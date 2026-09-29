using Cove.Core.Auth;
using Cove.Core.Entities;
using Cove.Core.Interfaces;
using Cove.Plugins;
using Cove.Sdk;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace CompleteTheCove;

public sealed class CompleteTheCoveExtension : FullExtensionBase
{
    private sealed record RefreshRequest(
        CompletionTargetType? TargetType,
        int? EntityId,
        string? ProviderEndpoint);
    private sealed record StudioFacetCandidate(
        string Value,
        string? Name,
        int Count,
        bool IsDirect);
    private sealed record StudioFacetOverlap(string Value, int Count);
    internal sealed record StudioFacet(string Value, string? Name, int Count);

    private static readonly TargetSurface[] TargetSurfaces =
    [
        new("performer", CompletionTargetType.Performer, EntityKinds.Performer,
            Permissions.PerformersRead, "MissingPerformerVideosTab", "IgnorePerformerTab"),
        new("studio", CompletionTargetType.Studio, EntityKinds.Studio,
            Permissions.StudiosRead, "MissingStudioVideosTab", "IgnoreStudioTab"),
        new("tag", CompletionTargetType.Tag, EntityKinds.Tag,
            Permissions.TagsRead, "MissingTagVideosTab", "IgnoreTagTab"),
    ];

    private IServiceScopeFactory? _scopes;
    private CoveConfiguration? _configuration;
    private Task? _orphanBlobDrain;
    private readonly SemaphoreSlim _refreshLock = new(1, 1);

    public override UIManifest GetUIManifest()
    {
        var manifest = ManifestBuilder()
            .AddPage(new UIPageDefinition("missing-videos", "Complete the Cove", "list-checks", ShowInNav: true, NavOrder: 65,
                RequiredPermission: Permissions.ExtensionsConfigure, ComponentName: "MissingVideosPage"))
            .AddPage(new UIPageDefinition("missing-video", "Missing Video", ShowInNav: false,
                RequiredPermission: Permissions.ExtensionsConfigure, ComponentName: "MissingVideoDetailPage"))
            .AddPage(new UIPageDefinition("missing-scenes", "Missing Videos", ShowInNav: false,
                RequiredPermission: Permissions.ExtensionsConfigure, ComponentName: "LegacyMissingVideosPage"))
            .AddPage(new UIPageDefinition("missing-scene", "Missing Video", ShowInNav: false,
                RequiredPermission: Permissions.ExtensionsConfigure, ComponentName: "LegacyMissingVideoDetailPage"));
        foreach (var target in TargetSurfaces)
        {
            manifest.AddTab(CreateTab(target));
            manifest.AddTab(CreateIgnoreTab(target));
        }

        return manifest
            .AddSettingsTab("extensions/com.midnightrider.complete-the-cove", "Complete the Cove", order: 125, icon: "puzzle",
                description: "Configure discovery exclusions for the missing-video catalog.")
            .AddSettingsSection("extensions/com.midnightrider.complete-the-cove", "Complete the Cove", "CompleteTheCoveSettings")
            .Build();
    }

    private static UITabContribution CreateTab(TargetSurface target) => new(
        "missing-videos", "Missing Videos", target.RouteType, "com.midnightrider.complete-the-cove", target.ComponentName, 85,
        $"/api/plugins/com.midnightrider.complete-the-cove/targets/{target.RouteType}/{{entityId}}/count", "puzzle")
    { RequiredPermissions = [Permissions.ExtensionsConfigure, target.ReadPermission] };

    private static UITabContribution CreateIgnoreTab(TargetSurface target) => new(
        "ignore-this", "Ignore This", target.RouteType, "com.midnightrider.complete-the-cove", target.IgnoreComponentName, 86,
        null, "eye-off")
    { RequiredPermissions = [Permissions.ExtensionsConfigure, target.ReadPermission] };

    public override void ConfigureServices(IServiceCollection services, ExtensionContext context) =>
        services.AddScoped<CompletionCatalog>();

    public override Task InitializeAsync(IServiceProvider services, CancellationToken ct = default)
    {
        _scopes = services.GetRequiredService<IServiceScopeFactory>();
        _configuration = services.GetRequiredService<CoveConfiguration>();
        // Draining the blobs parked by migration 011 runs the host's per-blob reference
        // count against every entity table, so 100k blobs would stall extension startup
        // (and its endpoints) for hours if awaited. Run it in the background instead; it is
        // idempotent and resumes from whatever rows are left after a restart.
        _orphanBlobDrain ??= DrainOrphanBlobsAsync(
            services.GetRequiredService<ILogger<CompleteTheCoveExtension>>(), CancellationToken.None);
        return Task.CompletedTask;
    }

    private async Task DrainOrphanBlobsAsync(ILogger logger, CancellationToken ct)
    {
        // Migration 011 moves cover blobs orphaned by endpoint-variant dedup into
        // complete_the_cove_orphan_blobs. The blob store is file-based, so delete the
        // files through the host's blob service here instead of in SQL.
        try
        {
            await using var scope = _scopes!.CreateAsyncScope();
            var db = scope.ServiceProvider.GetRequiredService<DbContext>();
            var blobs = scope.ServiceProvider.GetRequiredService<IBlobService>();
            var orphanIds = await db.Database.SqlQueryRaw<string>(
                "SELECT \"BlobId\" FROM complete_the_cove_orphan_blobs").ToListAsync(ct);
            for (var i = 0; i < orphanIds.Count; i += 500)
            {
                var chunk = orphanIds.GetRange(i, Math.Min(500, orphanIds.Count - i));
                foreach (var blobId in chunk)
                    await blobs.DeleteBlobAsync(blobId, ct);
                // EF's raw-SQL parameters do not map List<string> to text[], so build an
                // escaped IN list instead (BlobIds are host-generated GUID strings).
                var ids = string.Join(", ", chunk.Select(id => $"'{id.Replace("'", "''")}'"));
                await db.Database.ExecuteSqlRawAsync(
                    $"DELETE FROM complete_the_cove_orphan_blobs WHERE \"BlobId\" IN ({ids})", ct);
            }

            if (orphanIds.Count > 0)
                logger.LogInformation("Drained {Count} orphaned cover blobs from Complete the Cove", orphanIds.Count);
        }
        catch (Exception ex)
        {
            // Non-fatal: rows remain in complete_the_cove_orphan_blobs and are retried on the next start.
            logger.LogWarning(ex, "Could not drain orphaned Complete the Cove cover blobs; will retry on next start");
        }
    }

    protected override void DefineJobs() => Job(
        "refresh-catalog", "Refresh Missing Videos", RunRefreshAsync,
        "Refresh the extension-owned catalog of remote videos missing from this Cove.",
        supportsParameters: true, showInTaskList: true);

    private async Task RunRefreshAsync(IReadOnlyDictionary<string, string>? parameters, Cove.Plugins.IJobProgress progress, CancellationToken ct)
    {
        await _refreshLock.WaitAsync(ct);
        try
        {
            var (scopes, configuration) = GetRequiredRefreshServices();
            var request = ParseRefreshRequest(parameters);
            await RefreshCatalogAsync(scopes, configuration, request, progress, ct);
        }
        finally
        {
            _refreshLock.Release();
        }
    }

    private (IServiceScopeFactory Scopes, CoveConfiguration Configuration) GetRequiredRefreshServices()
    {
        if (_scopes is null || _configuration is null)
            throw new InvalidOperationException("Complete the Cove is not initialized.");

        return (_scopes, _configuration);
    }

    private static RefreshRequest ParseRefreshRequest(IReadOnlyDictionary<string, string>? parameters)
    {
        CompletionTargetType? type = null;
        int? entityId = null;
        if (parameters?.TryGetValue("entityType", out var typeText) == true
            && Enum.TryParse<CompletionTargetType>(typeText, true, out var parsedType))
        {
            type = parsedType;
        }
        if (parameters?.TryGetValue("entityId", out var idText) == true
            && int.TryParse(idText, out var parsedId)
            && parsedId > 0)
        {
            entityId = parsedId;
        }
        if (type.HasValue != entityId.HasValue)
            throw new InvalidOperationException("entityType and entityId must be supplied together.");

        string? providerEndpoint = null;
        parameters?.TryGetValue("providerEndpoint", out providerEndpoint);

        return new(type, entityId, providerEndpoint);
    }

    private static async Task RefreshCatalogAsync(
        IServiceScopeFactory scopes,
        CoveConfiguration configuration,
        RefreshRequest request,
        Cove.Plugins.IJobProgress progress,
        CancellationToken ct)
    {
        await using var scope = scopes.CreateAsyncScope();
        var catalog = scope.ServiceProvider.GetRequiredService<CompletionCatalog>();
        var settings = CompleteSettings.From(configuration);
        var enabledEndpoints = CompletionDiscoveryProviders.SupportedEndpoints(
            configuration,
            settings.SelectedMetadataEndpoints);
        var discoveries = CompletionDiscoveryProviders.CreateConfigured(
            configuration,
            settings.SelectedMetadataEndpoints,
            request.ProviderEndpoint);
        try
        {
            EnsureRefreshProviders(discoveries, request.ProviderEndpoint);
            await catalog.SynchronizeTargetSourcesAsync(enabledEndpoints, ct, request.TargetType, request.EntityId);
            await RefreshProvidersAsync(catalog, discoveries, settings, request, progress, ct);
        }
        finally
        {
            foreach (var discovery in discoveries.OfType<IDisposable>())
            {
                discovery.Dispose();
            }
        }
    }

    private static void EnsureRefreshProviders(
        IReadOnlyList<ICompletionDiscovery> discoveries,
        string? providerEndpoint)
    {
        if (discoveries.Count > 0)
            return;

        throw new InvalidOperationException(string.IsNullOrWhiteSpace(providerEndpoint)
            ? "Configure a supported metadata server before refreshing."
            : "The requested metadata provider is not enabled for Complete the Cove.");
    }

    private static async Task RefreshProvidersAsync(
        CompletionCatalog catalog,
        IReadOnlyList<ICompletionDiscovery> discoveries,
        CompleteSettings settings,
        RefreshRequest request,
        Cove.Plugins.IJobProgress progress,
        CancellationToken ct)
    {
        for (var index = 0; index < discoveries.Count; index++)
        {
            var providerProgress = new RangedJobProgress(
                progress,
                (double)index / discoveries.Count,
                (double)(index + 1) / discoveries.Count);
            await catalog.RefreshAsync(
                discoveries[index],
                settings,
                request.TargetType,
                request.EntityId,
                providerProgress,
                ct);
        }
    }

    public override void ConfigureModel(ModelBuilder builder)
    {
        builder.Entity<CompletionTarget>(entity =>
        {
            entity.ToTable("complete_the_cove_targets");
            entity.HasIndex(x => new { x.EntityType, x.EntityId, x.RemoteEndpoint }).IsUnique();
            entity.Property(x => x.EntityType).HasConversion<int>();
        });
        builder.Entity<CompletionVideo>(entity =>
        {
            entity.ToTable("complete_the_cove_videos");
            entity.HasIndex(x => new { x.RemoteEndpoint, x.RemoteId }).IsUnique();
            entity.HasIndex(x => x.CoveStudioId);
        });
        builder.Entity<CompletionVideoTarget>(entity =>
        {
            entity.ToTable("complete_the_cove_video_targets");
            entity.HasKey(x => new { x.VideoId, x.TargetId });
            entity.HasOne(x => x.Video).WithMany(x => x.Targets).HasForeignKey(x => x.VideoId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(x => x.Target).WithMany(x => x.Videos).HasForeignKey(x => x.TargetId).OnDelete(DeleteBehavior.Cascade);
        });
        builder.Entity<CompletionVideoPerformer>(entity =>
        {
            entity.ToTable("complete_the_cove_video_performers");
            entity.HasOne(x => x.Video).WithMany(x => x.Performers).HasForeignKey(x => x.VideoId).OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(x => new { x.VideoId, x.RemoteId }).IsUnique();
            entity.HasIndex(x => x.CovePerformerId);
        });
        builder.Entity<CompletionVideoTag>(entity =>
        {
            entity.ToTable("complete_the_cove_video_tags");
            entity.HasOne(x => x.Video).WithMany(x => x.Tags).HasForeignKey(x => x.VideoId).OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(x => new { x.VideoId, x.RemoteId }).IsUnique();
            entity.HasIndex(x => x.CoveTagId);
        });
        builder.Entity<CompletionVideoUrl>(entity =>
        {
            entity.ToTable("complete_the_cove_video_urls");
            entity.HasOne(x => x.Video).WithMany(x => x.Urls).HasForeignKey(x => x.VideoId).OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(x => new { x.VideoId, x.Url }).IsUnique();
        });
        builder.Entity<CompletionIgnoredEntity>(entity =>
        {
            entity.ToTable("complete_the_cove_ignored_entities");
            entity.HasKey(x => new { x.EntityType, x.CoveEntityId });
            entity.Property(x => x.EntityType).HasConversion<int>();
        });
    }

    protected override void DefineMigrations()
    {
        Migration("001_single_cove_catalog", """
        CREATE TABLE IF NOT EXISTS complete_the_cove_targets (
          "Id" integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY, "EntityType" integer NOT NULL,
          "EntityId" integer NOT NULL, "DisplayName" text NOT NULL, "RemoteEndpoint" text NOT NULL,
          "RemoteId" text NOT NULL, "SelectedAt" timestamptz NOT NULL, "LastRefreshAt" timestamptz NULL,
          "LastRefreshError" text NULL, UNIQUE ("EntityType", "EntityId"));
        CREATE TABLE IF NOT EXISTS complete_the_cove_scenes (
          "Id" integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY, "RemoteEndpoint" text NOT NULL,
          "RemoteId" text NOT NULL, "Title" text NULL, "Code" text NULL, "Details" text NULL,
          "ReleaseDate" date NULL, "StudioRemoteId" text NULL, "StudioName" text NULL,
          "ParentStudioRemoteId" text NULL, "ParentStudioName" text NULL, "CoverBlobId" text NULL,
          "CoverSourceUrl" text NULL, "CoverError" text NULL, "CreatedAt" timestamptz NOT NULL,
          "UpdatedAt" timestamptz NOT NULL, UNIQUE ("RemoteEndpoint", "RemoteId"));
        CREATE TABLE IF NOT EXISTS complete_the_cove_scene_targets (
          "SceneId" integer NOT NULL REFERENCES complete_the_cove_scenes("Id") ON DELETE CASCADE,
          "TargetId" integer NOT NULL REFERENCES complete_the_cove_targets("Id") ON DELETE CASCADE,
          PRIMARY KEY ("SceneId", "TargetId"));
        CREATE TABLE IF NOT EXISTS complete_the_cove_scene_performers (
          "Id" integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
          "SceneId" integer NOT NULL REFERENCES complete_the_cove_scenes("Id") ON DELETE CASCADE,
          "RemoteId" text NOT NULL, "Name" text NOT NULL, "Disambiguation" text NULL,
          UNIQUE ("SceneId", "RemoteId"));
        CREATE TABLE IF NOT EXISTS complete_the_cove_scene_tags (
          "Id" integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
          "SceneId" integer NOT NULL REFERENCES complete_the_cove_scenes("Id") ON DELETE CASCADE,
          "RemoteId" text NOT NULL, "Name" text NOT NULL, UNIQUE ("SceneId", "RemoteId"));
        CREATE TABLE IF NOT EXISTS complete_the_cove_scene_urls (
          "Id" integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
          "SceneId" integer NOT NULL REFERENCES complete_the_cove_scenes("Id") ON DELETE CASCADE,
          "Url" text NOT NULL, UNIQUE ("SceneId", "Url"));
        CREATE INDEX IF NOT EXISTS ix_complete_the_cove_scene_release ON complete_the_cove_scenes ("ReleaseDate");
        CREATE INDEX IF NOT EXISTS ix_complete_the_cove_scene_studio ON complete_the_cove_scenes ("StudioName");
        """);
        Migration("002_local_performer_links", """
        ALTER TABLE complete_the_cove_scene_performers
          ADD COLUMN IF NOT EXISTS "CovePerformerId" integer NULL;
        CREATE INDEX IF NOT EXISTS ix_complete_the_cove_scene_performer_cove_id
          ON complete_the_cove_scene_performers ("CovePerformerId");
        """);
        Migration("003_normalize_local_performer_links", """
        UPDATE complete_the_cove_scene_performers
          SET "CovePerformerId" = NULL
          WHERE "CovePerformerId" = 0;
        """);
        Migration("004_multi_source_targets", """
        ALTER TABLE complete_the_cove_targets
          DROP CONSTRAINT IF EXISTS "complete_the_cove_targets_EntityType_EntityId_key";
        CREATE UNIQUE INDEX IF NOT EXISTS ix_complete_the_cove_target_source
          ON complete_the_cove_targets ("EntityType", "EntityId", "RemoteEndpoint");
        """);
        Migration("005_remove_legacy_single_source_constraint", """
        ALTER TABLE complete_the_cove_targets
          DROP CONSTRAINT IF EXISTS "complete_the_stash_targets_EntityType_EntityId_key";
        ALTER TABLE complete_the_cove_targets
          DROP CONSTRAINT IF EXISTS "complete_the_cove_targets_EntityType_EntityId_key";
        CREATE UNIQUE INDEX IF NOT EXISTS ix_complete_the_cove_target_source
          ON complete_the_cove_targets ("EntityType", "EntityId", "RemoteEndpoint");
        """);
        Migration("006_local_tag_studio_links", """
        ALTER TABLE complete_the_cove_scenes ADD COLUMN IF NOT EXISTS "CoveStudioId" integer NULL;
        ALTER TABLE complete_the_cove_scene_tags ADD COLUMN IF NOT EXISTS "CoveTagId" integer NULL;
        CREATE INDEX IF NOT EXISTS ix_complete_the_cove_scene_studio_cove_id ON complete_the_cove_scenes ("CoveStudioId");
        CREATE INDEX IF NOT EXISTS ix_complete_the_cove_scene_tag_cove_id ON complete_the_cove_scene_tags ("CoveTagId");
        """);
        Migration("007_backfill_local_tag_studio_links", """
        UPDATE complete_the_cove_scenes scene
        SET "CoveStudioId" = remote."StudioId"
        FROM studio_remote_ids remote
        WHERE scene."CoveStudioId" IS NULL
          AND scene."StudioRemoteId" = remote."RemoteId"
          AND rtrim(scene."RemoteEndpoint", '/') = rtrim(remote."Endpoint", '/');
        UPDATE complete_the_cove_scene_tags scene_tag
        SET "CoveTagId" = remote."TagId"
        FROM complete_the_cove_scenes scene, tag_remote_ids remote
        WHERE scene_tag."CoveTagId" IS NULL
          AND scene_tag."SceneId" = scene."Id"
          AND scene_tag."RemoteId" = remote."RemoteId"
          AND rtrim(scene."RemoteEndpoint", '/') = rtrim(remote."Endpoint", '/');
        """);
        Migration("008_ignored_scenes", """
        ALTER TABLE complete_the_cove_scenes
          ADD COLUMN IF NOT EXISTS "IsIgnored" boolean NOT NULL DEFAULT false;
        """);
        Migration("009_provider_completion_progress", """
        ALTER TABLE complete_the_cove_targets
          ADD COLUMN IF NOT EXISTS "LastSuccessfulRefreshAt" timestamptz NULL,
          ADD COLUMN IF NOT EXISTS "EligibleSceneCount" integer NULL,
          ADD COLUMN IF NOT EXISTS "OwnedSceneCount" integer NULL;
        """);
        Migration("010_video_terminology", """
        ALTER TABLE complete_the_cove_scenes RENAME TO complete_the_cove_videos;
        ALTER TABLE complete_the_cove_scene_targets RENAME TO complete_the_cove_video_targets;
        ALTER TABLE complete_the_cove_scene_performers RENAME TO complete_the_cove_video_performers;
        ALTER TABLE complete_the_cove_scene_tags RENAME TO complete_the_cove_video_tags;
        ALTER TABLE complete_the_cove_scene_urls RENAME TO complete_the_cove_video_urls;

        ALTER TABLE complete_the_cove_video_targets RENAME COLUMN "SceneId" TO "VideoId";
        ALTER TABLE complete_the_cove_video_performers RENAME COLUMN "SceneId" TO "VideoId";
        ALTER TABLE complete_the_cove_video_tags RENAME COLUMN "SceneId" TO "VideoId";
        ALTER TABLE complete_the_cove_video_urls RENAME COLUMN "SceneId" TO "VideoId";
        ALTER TABLE complete_the_cove_targets RENAME COLUMN "EligibleSceneCount" TO "EligibleVideoCount";
        ALTER TABLE complete_the_cove_targets RENAME COLUMN "OwnedSceneCount" TO "OwnedVideoCount";

        DO $$
        DECLARE item record;
        DECLARE sequence_name text;
        BEGIN
          FOR item IN
            SELECT * FROM (VALUES
              ('complete_the_cove_videos', 'complete_the_cove_videos_Id_seq'),
              ('complete_the_cove_video_performers', 'complete_the_cove_video_performers_Id_seq'),
              ('complete_the_cove_video_tags', 'complete_the_cove_video_tags_Id_seq'),
              ('complete_the_cove_video_urls', 'complete_the_cove_video_urls_Id_seq'))
              AS sequences(table_name, new_name)
          LOOP
            sequence_name := pg_get_serial_sequence(item.table_name, 'Id');
            IF sequence_name IS NOT NULL THEN
              EXECUTE format('ALTER SEQUENCE %s RENAME TO %I', sequence_name, item.new_name);
            END IF;
          END LOOP;
        END $$;

        DO $$
        DECLARE item record;
        DECLARE renamed text;
        BEGIN
          FOR item IN
            SELECT conrelid::regclass AS table_name, conname
            FROM pg_constraint
            WHERE conrelid IN (
              'complete_the_cove_videos'::regclass,
              'complete_the_cove_video_targets'::regclass,
              'complete_the_cove_video_performers'::regclass,
              'complete_the_cove_video_tags'::regclass,
              'complete_the_cove_video_urls'::regclass)
          LOOP
            renamed := replace(replace(replace(replace(
              item.conname,
              'complete_the_stash_scenes', 'complete_the_cove_videos'),
              'complete_the_stash_scene', 'complete_the_cove_video'),
              'SceneId', 'VideoId'),
              'scene', 'video');
            IF renamed <> item.conname THEN
              EXECUTE format('ALTER TABLE %s RENAME CONSTRAINT %I TO %I',
                item.table_name, item.conname, renamed);
            END IF;
          END LOOP;
        END $$;

        ALTER INDEX IF EXISTS ix_complete_the_cove_scene_release RENAME TO ix_complete_the_cove_video_release;
        ALTER INDEX IF EXISTS ix_complete_the_cove_scene_studio RENAME TO ix_complete_the_cove_video_studio;
        ALTER INDEX IF EXISTS ix_complete_the_cove_scene_ignored RENAME TO ix_complete_the_cove_video_ignored;
        ALTER INDEX IF EXISTS ix_complete_the_cove_scene_studio_cove_id RENAME TO ix_complete_the_cove_video_studio_cove_id;
        ALTER INDEX IF EXISTS ix_complete_the_cove_scene_performer_cove_id RENAME TO ix_complete_the_cove_video_performer_cove_id;
        ALTER INDEX IF EXISTS ix_complete_the_cove_scene_tag_cove_id RENAME TO ix_complete_the_cove_video_tag_cove_id;
        """);
        Migration("011_canonical_endpoint_dedup", """
        -- Query-string variants of one metadata endpoint (e.g. theporndb.net/graphql?type=Movie)
        -- are the same source; catalog rows were stored once per variant. Merge them, keeping
        -- the un-queried variant (the broadest catalog) and the lowest Id as a tie-break.
        CREATE TABLE IF NOT EXISTS complete_the_cove_orphan_blobs (
          "BlobId" text PRIMARY KEY
        );

        CREATE TEMP TABLE ctc_011_dup_videos AS
        SELECT dup_id, keeper_id
        FROM (
          SELECT v."Id" AS dup_id,
                 first_value(v."Id") OVER (
                   PARTITION BY split_part(v."RemoteEndpoint", '?', 1), lower(v."RemoteId")
                   ORDER BY (v."RemoteEndpoint" NOT LIKE '%?%') DESC, v."Id" ASC
                 ) AS keeper_id
          FROM complete_the_cove_videos v
        ) AS ranked
        WHERE dup_id <> keeper_id;

        -- Pick one survivor link per (keeper video, target) first: a self-joining
        -- subquery does not see rows updated earlier in the same statement, so at
        -- most one link per group may be re-pointed.
        CREATE TEMP TABLE ctc_011_video_link_keep AS
        SELECT dup_video_id, target_id, keeper_video_id
        FROM (
          SELECT lt."VideoId" AS dup_video_id,
                 lt."TargetId" AS target_id,
                 d.keeper_id AS keeper_video_id,
                 row_number() OVER (PARTITION BY lt."TargetId", d.keeper_id ORDER BY lt."VideoId") AS rn
          FROM complete_the_cove_video_targets lt
          JOIN ctc_011_dup_videos d ON lt."VideoId" = d.dup_id
        ) AS ranked
        WHERE rn = 1;

        UPDATE complete_the_cove_video_targets AS t
        SET "VideoId" = k.keeper_video_id
        FROM ctc_011_video_link_keep k
        WHERE t."VideoId" = k.dup_video_id AND t."TargetId" = k.target_id
          AND NOT EXISTS (
            SELECT 1 FROM complete_the_cove_video_targets t2
            WHERE t2."VideoId" = k.keeper_video_id AND t2."TargetId" = k.target_id);

        DELETE FROM complete_the_cove_video_targets AS t
        USING ctc_011_dup_videos d
        WHERE t."VideoId" = d.dup_id;

        UPDATE complete_the_cove_videos AS k
        SET "IsIgnored" = k."IsIgnored" OR d.any_ignored
        FROM (
          SELECT d.keeper_id, bool_or(v."IsIgnored") AS any_ignored
          FROM ctc_011_dup_videos d
          JOIN complete_the_cove_videos v ON v."Id" = d.dup_id
          GROUP BY d.keeper_id
        ) AS d
        WHERE k."Id" = d.keeper_id;

        INSERT INTO complete_the_cove_orphan_blobs ("BlobId")
        SELECT DISTINCT v."CoverBlobId"
        FROM complete_the_cove_videos v
        JOIN ctc_011_dup_videos d ON d.dup_id = v."Id"
        WHERE v."CoverBlobId" IS NOT NULL
          AND NOT EXISTS (
            SELECT 1 FROM complete_the_cove_videos k
            WHERE k."Id" = d.keeper_id AND k."CoverBlobId" = v."CoverBlobId")
        ON CONFLICT ("BlobId") DO NOTHING;

        DELETE FROM complete_the_cove_videos AS v
        USING ctc_011_dup_videos d
        WHERE v."Id" = d.dup_id;

        CREATE TEMP TABLE ctc_011_dup_targets AS
        SELECT dup_id, keeper_id
        FROM (
          SELECT t."Id" AS dup_id,
                 first_value(t."Id") OVER (
                   PARTITION BY t."EntityType", t."EntityId", split_part(t."RemoteEndpoint", '?', 1)
                   ORDER BY (t."RemoteEndpoint" NOT LIKE '%?%') DESC, t."Id" ASC
                 ) AS keeper_id
          FROM complete_the_cove_targets t
        ) AS ranked
        WHERE dup_id <> keeper_id;

        CREATE TEMP TABLE ctc_011_target_link_keep AS
        SELECT dup_target_id, video_id, keeper_target_id
        FROM (
          SELECT lt."TargetId" AS dup_target_id,
                 lt."VideoId" AS video_id,
                 m.keeper_id AS keeper_target_id,
                 row_number() OVER (PARTITION BY lt."VideoId", m.keeper_id ORDER BY lt."TargetId") AS rn
          FROM complete_the_cove_video_targets lt
          JOIN ctc_011_dup_targets m ON lt."TargetId" = m.dup_id
        ) AS ranked
        WHERE rn = 1;

        UPDATE complete_the_cove_video_targets AS t
        SET "TargetId" = k.keeper_target_id
        FROM ctc_011_target_link_keep k
        WHERE t."TargetId" = k.dup_target_id AND t."VideoId" = k.video_id
          AND NOT EXISTS (
            SELECT 1 FROM complete_the_cove_video_targets t2
            WHERE t2."VideoId" = k.video_id AND t2."TargetId" = k.keeper_target_id);

        DELETE FROM complete_the_cove_video_targets AS t
        USING ctc_011_dup_targets d
        WHERE t."TargetId" = d.dup_id;

        CREATE TEMP TABLE ctc_011_target_errors AS
        SELECT keeper_id, last_error
        FROM (
          SELECT d.keeper_id,
                 t."LastRefreshError" AS last_error,
                 row_number() OVER (PARTITION BY d.keeper_id ORDER BY t."LastRefreshAt" DESC NULLS LAST) AS rn
          FROM ctc_011_dup_targets d
          JOIN complete_the_cove_targets t ON t."Id" = d.dup_id
          WHERE t."LastRefreshError" IS NOT NULL
        ) AS ranked
        WHERE rn = 1;

        UPDATE complete_the_cove_targets AS k
        SET "LastRefreshAt" = g.last_refresh_at,
            "LastRefreshError" = COALESCE(k."LastRefreshError", e.last_error),
            "LastSuccessfulRefreshAt" = g.last_successful_refresh_at,
            "EligibleVideoCount" = g.eligible_video_count,
            "OwnedVideoCount" = g.owned_video_count
        FROM (
          SELECT d.keeper_id,
                 max(t."LastRefreshAt") AS last_refresh_at,
                 max(t."LastSuccessfulRefreshAt") AS last_successful_refresh_at,
                 max(t."EligibleVideoCount") AS eligible_video_count,
                 max(t."OwnedVideoCount") AS owned_video_count
          FROM ctc_011_dup_targets d
          JOIN complete_the_cove_targets t ON t."Id" = d.dup_id OR t."Id" = d.keeper_id
          GROUP BY d.keeper_id
        ) AS g
        LEFT JOIN ctc_011_target_errors AS e ON e.keeper_id = g.keeper_id
        WHERE k."Id" = g.keeper_id;

        DELETE FROM complete_the_cove_targets AS t
        USING ctc_011_dup_targets d
        WHERE t."Id" = d.dup_id;

        UPDATE complete_the_cove_videos
        SET "RemoteEndpoint" = split_part("RemoteEndpoint", '?', 1)
        WHERE "RemoteEndpoint" LIKE '%?%';
        UPDATE complete_the_cove_targets
        SET "RemoteEndpoint" = split_part("RemoteEndpoint", '?', 1)
        WHERE "RemoteEndpoint" LIKE '%?%';

        DROP TABLE ctc_011_video_link_keep;
        DROP TABLE ctc_011_target_link_keep;
        DROP TABLE ctc_011_dup_videos;
        DROP TABLE ctc_011_dup_targets;
        DROP TABLE ctc_011_target_errors;
        """);
        Migration("012_ignored_entities", """
        CREATE TABLE IF NOT EXISTS complete_the_cove_ignored_entities (
          "EntityType" integer NOT NULL, "CoveEntityId" integer NOT NULL,
          "CreatedAt" timestamptz NOT NULL,
          PRIMARY KEY ("EntityType", "CoveEntityId"));
        """);
    }

    public override void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet("/api/plugins/com.midnightrider.complete-the-cove/videos", ListVideos).RequireCovePermission(Permissions.ExtensionsConfigure);
        endpoints.MapGet("/api/plugins/com.midnightrider.complete-the-cove/videos/{id:int}", GetVideo).RequireCovePermission(Permissions.ExtensionsConfigure);
        endpoints.MapPost("/api/plugins/com.midnightrider.complete-the-cove/videos/{id:int}/ignore", (int id, CompletionCatalog catalog, CancellationToken ct) => SetIgnored(id, true, catalog, ct)).RequireCovePermission(Permissions.ExtensionsConfigure);
        endpoints.MapDelete("/api/plugins/com.midnightrider.complete-the-cove/videos/{id:int}/ignore", (int id, CompletionCatalog catalog, CancellationToken ct) => SetIgnored(id, false, catalog, ct)).RequireCovePermission(Permissions.ExtensionsConfigure);
        endpoints.MapPost("/api/plugins/com.midnightrider.complete-the-cove/videos/ignore", (BulkIgnoreRequest body, CompletionCatalog catalog, CancellationToken ct) => SetIgnoredMany(body, catalog, ct)).RequireCovePermission(Permissions.ExtensionsConfigure);
        endpoints.MapGet("/api/plugins/com.midnightrider.complete-the-cove/videos/{id:int}/cover", GetCover).RequireCovePermission(Permissions.ExtensionsConfigure);
        endpoints.MapGet("/api/plugins/com.midnightrider.complete-the-cove/scenes", ListVideos).RequireCovePermission(Permissions.ExtensionsConfigure);
        endpoints.MapGet("/api/plugins/com.midnightrider.complete-the-cove/scenes/{id:int}", GetVideo).RequireCovePermission(Permissions.ExtensionsConfigure);
        endpoints.MapPost("/api/plugins/com.midnightrider.complete-the-cove/scenes/{id:int}/ignore", (int id, CompletionCatalog catalog, CancellationToken ct) => SetIgnored(id, true, catalog, ct)).RequireCovePermission(Permissions.ExtensionsConfigure);
        endpoints.MapDelete("/api/plugins/com.midnightrider.complete-the-cove/scenes/{id:int}/ignore", (int id, CompletionCatalog catalog, CancellationToken ct) => SetIgnored(id, false, catalog, ct)).RequireCovePermission(Permissions.ExtensionsConfigure);
        endpoints.MapGet("/api/plugins/com.midnightrider.complete-the-cove/scenes/{id:int}/cover", GetCover).RequireCovePermission(Permissions.ExtensionsConfigure);
        endpoints.MapGet("/api/plugins/com.midnightrider.complete-the-cove/facets", GetFacets).RequireCovePermission(Permissions.ExtensionsConfigure);
        endpoints.MapGet("/api/plugins/com.midnightrider.complete-the-cove/targets", GetTargets).RequireCovePermission(Permissions.ExtensionsConfigure);
        endpoints.MapGet("/api/plugins/com.midnightrider.complete-the-cove/providers", GetProviders).RequireCovePermission(Permissions.ExtensionsConfigure);
        endpoints.MapGet("/api/plugins/com.midnightrider.complete-the-cove/refresh/{jobId}", (string jobId, IJobService jobs) =>
            jobs.GetJob(jobId) is { } job ? Results.Ok(job) : Results.NotFound()).RequireCovePermission(Permissions.ExtensionsConfigure);
        foreach (var target in TargetSurfaces)
        {
            MapTarget(endpoints, target);
            MapEntityIgnore(endpoints, target);
        }
    }

    private static void MapEntityIgnore(IEndpointRouteBuilder endpoints, TargetSurface target)
    {
        var route = $"/api/plugins/com.midnightrider.complete-the-cove/entities/{target.RouteType}/{{entityId:int}}/ignore";
        ApplyTargetAccessPolicy(
            endpoints.MapGet(route, (int entityId, CompletionCatalog catalog, CancellationToken ct) =>
                GetEntityIgnored(target.TargetType, entityId, catalog, ct)),
            target);
        ApplyTargetAccessPolicy(
            endpoints.MapPost(route, (int entityId, CompletionCatalog catalog, CancellationToken ct) =>
                SetEntityIgnored(target.TargetType, entityId, true, catalog, ct)),
            target);
        ApplyTargetAccessPolicy(
            endpoints.MapDelete(route, (int entityId, CompletionCatalog catalog, CancellationToken ct) =>
                SetEntityIgnored(target.TargetType, entityId, false, catalog, ct)),
            target);
    }

    private static void MapTarget(IEndpointRouteBuilder endpoints, TargetSurface target)
    {
        var route = $"/api/plugins/com.midnightrider.complete-the-cove/targets/{target.RouteType}/{{entityId:int}}";
        ApplyTargetAccessPolicy(
            endpoints.MapGet(route, (int entityId, CompletionCatalog catalog, CancellationToken ct) =>
                GetTarget(target.TargetType, entityId, catalog, ct)),
            target);
        ApplyTargetAccessPolicy(
            endpoints.MapGet(route + "/count", (int entityId, DbContext db, CancellationToken ct) =>
                CountTarget(target.TargetType, entityId, db, ct)),
            target);
        ApplyTargetAccessPolicy(
            endpoints.MapPost(route, (int entityId, CompletionCatalog catalog, CoveConfiguration configuration, CancellationToken ct) =>
                Track(target.TargetType, entityId, catalog, configuration, ct)),
            target);
        ApplyTargetAccessPolicy(
            endpoints.MapDelete(route, (int entityId, CompletionCatalog catalog, CancellationToken ct) =>
                Untrack(target.TargetType, entityId, catalog, ct)),
            target);
    }

    private static void ApplyTargetAccessPolicy(
        IEndpointConventionBuilder endpoint,
        TargetSurface target)
        => endpoint
            .RequireCovePermission(Permissions.ExtensionsConfigure, target.ReadPermission)
            .RequireCoveEntityAccess(target.EntityKind, "entityId", target.ReadPermission);

    private static async Task<IResult> ListVideos(HttpRequest request, DbContext db, CancellationToken ct)
    {
        var page = Math.Max(1, ParseInt(request.Query["page"], 1));
        var perPage = Math.Clamp(ParseInt(request.Query["perPage"], 40), 1, 1000);
        var query = ApplyIgnoredStatus(request, db.Set<CompletionVideo>().AsNoTracking().Where(x => x.Targets.Any()));
        var q = request.Query["q"].ToString().Trim().ToLowerInvariant();
        if (q.Length > 0) query = query.Where(x => (x.Title ?? "").ToLower().Contains(q) || (x.Code ?? "").ToLower().Contains(q)
            || (x.StudioName ?? "").ToLower().Contains(q) || x.Performers.Any(p => p.Name.ToLower().Contains(q)) || x.Tags.Any(t => t.Name.ToLower().Contains(q)));
        var provider = request.Query["provider"].ToString();
        if (provider.Length > 0) query = query.Where(x => x.RemoteEndpoint == provider);
        var tagDescendants = request.Query["includeSubtags"] == "true"
            ? await ExpandSelectedTagIdsAsync(request, db, ct)
            : null;
        var studioDescendants = request.Query["includeSubstudios"] == "true"
            ? await ExpandSelectedStudioIdsAsync(request, db, ct)
            : null;
        query = VideoCatalogFilter.Apply(request, query, tagDescendants, studioDescendants);
        if (Enum.TryParse<CompletionTargetType>(request.Query["targetType"], true, out var targetType) && int.TryParse(request.Query["targetId"], out var targetId))
            query = query.Where(x => x.Targets.Any(t => t.Target!.EntityType == targetType && t.Target.EntityId == targetId));
        var total = await query.CountAsync(ct);
        query = ApplyVideoSort(request, query);
        var items = await query.Skip((page - 1) * perPage).Take(perPage).Select(x => new
        {
            x.Id, x.Title, x.Code, x.Details, releaseDate = x.ReleaseDate, x.StudioName, x.StudioRemoteId, x.CoveStudioId, x.RemoteEndpoint, x.IsIgnored,
            coverUrl = x.CoverBlobId == null ? null : $"/api/plugins/com.midnightrider.complete-the-cove/videos/{x.Id}/cover?v={x.UpdatedAt.Ticks}",
            performers = x.Performers.OrderBy(p => p.Name).Select(p => new
            {
                p.RemoteId,
                CovePerformerId = db.Set<Performer>().Where(local => local.Id == p.CovePerformerId).Select(local => (int?)local.Id).FirstOrDefault(),
                p.Name,
                p.Disambiguation
            }),
            tags = x.Tags.OrderBy(t => t.Name).Select(t => new { t.RemoteId, t.CoveTagId, t.Name }),
        }).ToListAsync(ct);
        return Results.Ok(new { items, total, page, perPage });
    }

    internal static IOrderedQueryable<CompletionVideo> ApplyVideoSort(HttpRequest request, IQueryable<CompletionVideo> query) =>
        request.Query["sort"] == "title"
            ? request.Query["direction"] == "desc" ? query.OrderByDescending(x => x.Title) : query.OrderBy(x => x.Title)
            : request.Query["direction"] == "asc"
                ? query.OrderBy(x => x.ReleaseDate.HasValue).ThenBy(x => x.ReleaseDate)
                : query.OrderByDescending(x => x.ReleaseDate.HasValue).ThenByDescending(x => x.ReleaseDate);

    private static async Task<IReadOnlyDictionary<int, IReadOnlyCollection<int>>> ExpandSelectedTagIdsAsync(
        HttpRequest request,
        DbContext db,
        CancellationToken ct)
    {
        var selectedIds = request.Query["tag"].Concat(request.Query["excludeTag"])
            .Select(value => int.TryParse(value, out var id) && id > 0 ? id : 0)
            .Where(id => id > 0)
            .Distinct()
            .ToArray();
        if (selectedIds.Length == 0) return new Dictionary<int, IReadOnlyCollection<int>>();

        var relations = await db.Set<TagParent>().AsNoTracking()
            .Select(relation => new { relation.ParentId, relation.ChildId })
            .ToListAsync(ct);
        var childrenByParent = relations
            .GroupBy(relation => relation.ParentId)
            .ToDictionary(group => group.Key, group => group.Select(relation => relation.ChildId).ToArray());
        return selectedIds.ToDictionary(
            id => id,
            id => (IReadOnlyCollection<int>)ExpandTagId(id, childrenByParent));
    }

    private static int[] ExpandTagId(int rootId, IReadOnlyDictionary<int, int[]> childrenByParent)
    {
        var result = new HashSet<int> { rootId };
        var pending = new Queue<int>();
        pending.Enqueue(rootId);
        while (pending.TryDequeue(out var parentId))
        {
            if (!childrenByParent.TryGetValue(parentId, out var childIds)) continue;
            foreach (var childId in childIds)
                if (result.Add(childId)) pending.Enqueue(childId);
        }
        return result.ToArray();
    }

    private static async Task<IReadOnlyDictionary<int, IReadOnlyCollection<int>>> ExpandSelectedStudioIdsAsync(
        HttpRequest request,
        DbContext db,
        CancellationToken ct)
    {
        var selectedIds = request.Query["studio"].Concat(request.Query["excludeStudio"])
            .Select(value => int.TryParse(value, out var id) && id > 0 ? id : 0)
            .Where(id => id > 0)
            .Distinct()
            .ToArray();
        if (selectedIds.Length == 0) return new Dictionary<int, IReadOnlyCollection<int>>();

        var relations = await db.Set<Studio>().AsNoTracking()
            .Where(studio => studio.ParentId != null)
            .Select(studio => new { ParentId = studio.ParentId!.Value, ChildId = studio.Id })
            .ToListAsync(ct);
        var childrenByParent = relations
            .GroupBy(relation => relation.ParentId)
            .ToDictionary(group => group.Key, group => group.Select(relation => relation.ChildId).ToArray());
        return selectedIds.ToDictionary(
            id => id,
            id => (IReadOnlyCollection<int>)ExpandTagId(id, childrenByParent));
    }

    private static async Task<IResult> GetVideo(int id, DbContext db, CancellationToken ct)
    {
        var video = await db.Set<CompletionVideo>().AsNoTracking().Where(x => x.Id == id).Select(x => new
        {
            x.Id, x.Title, x.Code, x.Details, releaseDate = x.ReleaseDate, x.StudioName, x.StudioRemoteId, x.CoveStudioId,
            x.ParentStudioName, x.ParentStudioRemoteId, x.RemoteEndpoint, x.RemoteId, x.CoverError, x.IsIgnored, x.CreatedAt, x.UpdatedAt,
            coverUrl = x.CoverBlobId == null ? null : $"/api/plugins/com.midnightrider.complete-the-cove/videos/{x.Id}/cover?v={x.UpdatedAt.Ticks}",
            performers = x.Performers.OrderBy(p => p.Name).Select(p => new
            {
                p.RemoteId,
                CovePerformerId = db.Set<Performer>().Where(local => local.Id == p.CovePerformerId).Select(local => (int?)local.Id).FirstOrDefault(),
                p.Name,
                p.Disambiguation
            }),
            tags = x.Tags.OrderBy(t => t.Name).Select(t => new { t.RemoteId, t.CoveTagId, t.Name }),
            urls = x.Urls.Select(u => u.Url),
            targets = x.Targets.Select(t => new { type = t.Target!.EntityType.ToString().ToLower(), t.Target.EntityId, t.Target.DisplayName }),
        }).FirstOrDefaultAsync(ct);
        return video is null ? Results.NotFound() : Results.Ok(video);
    }

    private static async Task<IResult> GetCover(int id, DbContext db, IBlobService blobs, CancellationToken ct)
    {
        var blobId = await db.Set<CompletionVideo>().AsNoTracking().Where(x => x.Id == id).Select(x => x.CoverBlobId).FirstOrDefaultAsync(ct);
        if (string.IsNullOrWhiteSpace(blobId)) return Results.NotFound();
        var blob = await blobs.GetBlobAsync(blobId, ct);
        return blob is null ? Results.NotFound() : Results.Stream(blob.Value.Stream, blob.Value.ContentType, enableRangeProcessing: blob.Value.Stream.CanSeek);
    }

    private static async Task<IResult> GetFacets(HttpRequest request, DbContext db, CancellationToken ct)
    {
        var videos = ApplyIgnoredStatus(request, db.Set<CompletionVideo>().AsNoTracking().Where(x => x.Targets.Any()));
        return Results.Ok(new
        {
            providers = await videos.GroupBy(x => x.RemoteEndpoint).Select(x => new { value = x.Key, name = x.Key, count = x.Count() }).OrderBy(x => x.name).ToListAsync(ct),
        });
    }

    internal static async Task<IReadOnlyList<StudioFacet>> BuildStudioFacetsAsync(
        IQueryable<CompletionVideo> videos,
        CancellationToken ct = default)
    {
        var matchingStudios = await videos
            .Where(video => video.StudioRemoteId != null)
            .GroupBy(video => new
            {
                video.RemoteEndpoint,
                video.StudioRemoteId,
                video.StudioName
            })
            .Select(group => new StudioFacetCandidate(
                group.Key.RemoteEndpoint + "|" + group.Key.StudioRemoteId,
                group.Key.StudioName,
                group.Count(),
                true))
            .ToListAsync(ct);
        var parentStudios = await videos
            .Where(video => video.ParentStudioRemoteId != null)
            .GroupBy(video => new
            {
                video.RemoteEndpoint,
                video.ParentStudioRemoteId,
                video.ParentStudioName
            })
            .Select(group => new StudioFacetCandidate(
                group.Key.RemoteEndpoint + "|" + group.Key.ParentStudioRemoteId,
                group.Key.ParentStudioName,
                group.Count(),
                false))
            .ToListAsync(ct);
        var overlappingStudios = await videos
            .Where(video => video.StudioRemoteId != null
                && video.StudioRemoteId == video.ParentStudioRemoteId)
            .GroupBy(video => new { video.RemoteEndpoint, video.StudioRemoteId })
            .Select(group => new StudioFacetOverlap(
                group.Key.RemoteEndpoint + "|" + group.Key.StudioRemoteId,
                group.Count()))
            .ToDictionaryAsync(overlap => overlap.Value, overlap => overlap.Count, ct);

        return matchingStudios
            .Concat(parentStudios)
            .GroupBy(studio => studio.Value)
            .Select(group => new StudioFacet(
                group.Key,
                PreferredStudioCandidate(group).Name,
                group.Sum(studio => studio.Count)
                    - overlappingStudios.GetValueOrDefault(group.Key)))
            .OrderBy(studio => studio.Name)
            .ThenBy(studio => studio.Value)
            .ToList();
    }

    private static StudioFacetCandidate PreferredStudioCandidate(
        IEnumerable<StudioFacetCandidate> candidates) =>
        candidates
            .Where(candidate => !string.IsNullOrWhiteSpace(candidate.Name))
            .OrderByDescending(candidate => candidate.IsDirect)
            .ThenBy(candidate => candidate.Name, StringComparer.OrdinalIgnoreCase)
            .ThenBy(candidate => candidate.Name, StringComparer.Ordinal)
            .FirstOrDefault()
        ?? candidates
            .OrderByDescending(candidate => candidate.IsDirect)
            .ThenBy(candidate => candidate.Value, StringComparer.Ordinal)
            .First();

    internal static IQueryable<CompletionVideo> ApplyIgnoredStatus(HttpRequest request, IQueryable<CompletionVideo> videos)
    {
        var status = request.Query["ignored"].ToString();
        if (status == "all"
            || (status.Length == 0
                && bool.TryParse(request.Query["showIgnored"], out var showIgnored)
                && showIgnored))
        {
            return videos;
        }

        return status == "ignored"
            ? videos.Where(video => video.IsIgnored)
            : videos.Where(video => !video.IsIgnored);
    }

    private static async Task<IResult> GetTargets(CompletionCatalog catalog, CancellationToken ct) => Results.Ok(await catalog.GetTargetOverviewAsync(ct));
    private static IResult GetProviders(CoveConfiguration configuration)
    {
        var selected = CompleteSettings.From(configuration).SelectedMetadataEndpoints;
        return Results.Ok(CompletionDiscoveryProviders.SupportedServers(configuration).Select(server =>
        {
            var endpoint = CompletionCatalog.CanonicalEndpoint(server.Endpoint);
            return new
            {
                name = string.IsNullOrWhiteSpace(server.Name) ? new Uri(server.Endpoint).Host : server.Name,
                endpoint,
                enabled = selected is null || selected.Count == 0 || selected.Contains(endpoint),
            };
        }));
    }
    private static async Task<IResult> GetTarget(CompletionTargetType type, int entityId, CompletionCatalog catalog, CancellationToken ct) =>
        Results.Ok(new { tracked = await catalog.GetTargetOverviewItemAsync(type, entityId, ct) });
    internal static async Task<IResult> CountTarget(CompletionTargetType type, int entityId, DbContext db, CancellationToken ct)
    {
        var tracked = await db.Set<CompletionTarget>().AnyAsync(x => x.EntityType == type && x.EntityId == entityId, ct);
        int? count = tracked
            ? await db.Set<CompletionVideo>().CountAsync(x => !x.IsIgnored && x.Targets.Any(t => t.Target!.EntityType == type && t.Target.EntityId == entityId), ct)
            : null;
        return Results.Ok(new { count });
    }
    private static async Task<IResult> Track(CompletionTargetType type, int entityId, CompletionCatalog catalog, CoveConfiguration configuration, CancellationToken ct)
    {
        var settings = CompleteSettings.From(configuration);
        var endpoints = CompletionDiscoveryProviders.SupportedEndpoints(configuration, settings.SelectedMetadataEndpoints);
        if (endpoints.Count == 0) return Results.BadRequest(new { message = "Configure a supported metadata server first." });
        try { return Results.Ok((await catalog.TrackAsync(type, entityId, endpoints, ct)).First()); }
        catch (InvalidOperationException ex) { return Results.BadRequest(new { message = ex.Message }); }
    }
    private static async Task<IResult> Untrack(CompletionTargetType type, int entityId, CompletionCatalog catalog, CancellationToken ct)
    { await catalog.UntrackAsync(type, entityId, ct); return Results.NoContent(); }
    private static async Task<IResult> SetIgnored(int id, bool ignored, CompletionCatalog catalog, CancellationToken ct) =>
        await catalog.SetIgnoredAsync(id, ignored, ct) ? Results.NoContent() : Results.NotFound();

    private static async Task<IResult> SetIgnoredMany(BulkIgnoreRequest body, CompletionCatalog catalog, CancellationToken ct) =>
        Results.Ok(new { updated = await catalog.SetIgnoredManyAsync(body.VideoIds ?? Array.Empty<int>(), body.Ignored, ct) });
    private static async Task<IResult> GetEntityIgnored(CompletionTargetType type, int entityId, CompletionCatalog catalog, CancellationToken ct) =>
        Results.Ok(new { ignored = await catalog.IsEntityIgnoredAsync(type, entityId, ct) });
    private static async Task<IResult> SetEntityIgnored(CompletionTargetType type, int entityId, bool ignored, CompletionCatalog catalog, CancellationToken ct) =>
        Results.Ok(new { ignored, updated = await catalog.SetEntityIgnoredAsync(type, entityId, ignored, ct) });
    private static int ParseInt(string? value, int fallback) => int.TryParse(value, out var parsed) ? parsed : fallback;
}

internal sealed record TargetSurface(
    string RouteType,
    CompletionTargetType TargetType,
    string EntityKind,
    string ReadPermission,
    string ComponentName,
    string IgnoreComponentName);

internal sealed record BulkIgnoreRequest(IReadOnlyList<int>? VideoIds, bool Ignored);

internal sealed class RangedJobProgress(Cove.Plugins.IJobProgress parent, double start, double end) : Cove.Plugins.IJobProgress
{
    public void Report(double percent, string? message = null) =>
        parent.Report(start + ((end - start) * Math.Clamp(percent, 0, 1)), message);
}
