using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace CompleteTheCove.Tests;

public sealed class CatalogSnapshotTests
{
    [Fact]
    public async Task First_page_returns_full_envelope_with_deterministic_order_and_status()
    {
        await using var db = CreateDb();
        SeedCatalog(db);
        var outcome = await CatalogSnapshot.PageAsync("3", null, db, new CatalogSnapshotRegistry(), default);
        var envelope = Assert.IsAssignableFrom<CatalogSnapshotResponse>(outcome.Envelope);

        Assert.Equal("v1", envelope.SchemaVersion);
        Assert.Equal(["a1", "a2", "a3"], envelope.Items.Select(item => item.RemoteId).ToList());
        Assert.Equal(
            ["https://stashdb.org/graphql", "https://theporndb.net/graphql"],
            envelope.Status.Providers.Select(provider => provider.Endpoint).ToList());
        Assert.Equal("current", envelope.Status.Condition);
        var stashdb = envelope.Status.Providers[0];
        Assert.Equal("current", stashdb.Condition);
        Assert.Equal(3, stashdb.EligibleVideoCount);
        Assert.Equal(1, stashdb.OwnedVideoCount);
        Assert.NotNull(stashdb.LastAttemptedRefreshAt);
        Assert.NotNull(stashdb.LastSuccessfulRefreshAt);
        Assert.NotNull(envelope.NextCursor);
        Assert.True(envelope.ExpiresAt - envelope.CreatedAt >= TimeSpan.FromMinutes(15));
    }

    [Fact]
    public async Task Paging_walks_every_item_exactly_once_in_order()
    {
        await using var db = CreateDb();
        SeedCatalog(db);
        var registry = new CatalogSnapshotRegistry();

        var seen = new List<string>();
        string? cursor = null;
        for (var pages = 0; pages < 10; pages++)
        {
            var envelope = Assert.IsAssignableFrom<CatalogSnapshotResponse>((await CatalogSnapshot.PageAsync("2", cursor, db, registry, default)).Envelope);
            seen.AddRange(envelope.Items.Select(item => item.RemoteId));
            cursor = envelope.NextCursor;
            if (cursor is null) break;
        }

        Assert.Equal(["a1", "a2", "a3", "b1", "b2"], seen);
    }

    [Fact]
    public async Task Snapshot_pages_are_frozen_against_concurrent_catalog_writes()
    {
        await using var db = CreateDb();
        var (_, b) = SeedCatalog(db);
        var registry = new CatalogSnapshotRegistry();
        var first = (await CatalogSnapshot.PageAsync("2", null, db, registry, default)).Envelope!;
        var cursor = Assert.IsAssignableFrom<string>(first.NextCursor);

        var a1 = await db.Set<CompletionVideo>().SingleAsync(x => x.RemoteId == "a1");
        a1.Title = "changed after snapshot";
        db.Add(Video(b, "b2-new"));
        var b1 = await db.Set<CompletionVideo>().SingleAsync(x => x.RemoteId == "b1");
        db.Remove(b1);
        await db.SaveChangesAsync();

        var second = (await CatalogSnapshot.PageAsync("2", cursor, db, registry, default)).Envelope!;
        Assert.Equal(["a3", "b1"], second.Items.Select(item => item.RemoteId).ToList());
        Assert.Equal("b1", second.Items[1].Title);
    }

    [Fact]
    public async Task Snapshot_reads_persist_nothing()
    {
        await using var db = CreateDb();
        SeedCatalog(db);
        var registry = new CatalogSnapshotRegistry();
        var savesBefore = db.SaveCalls;
        string? cursor = null;
        do
        {
            var envelope = (await CatalogSnapshot.PageAsync("2", cursor, db, registry, default)).Envelope!;
            cursor = envelope.NextCursor;
        } while (cursor is not null);
        Assert.Equal(savesBefore, db.SaveCalls);
    }

    [Theory]
    [InlineData("0")]
    [InlineData("1001")]
    [InlineData("abc")]
    [InlineData("-1")]
    public async Task Out_of_range_limit_returns_validation_error(string limit)
    {
        await using var db = CreateDb();
        SeedCatalog(db);
        var outcome = await CatalogSnapshot.PageAsync(limit, null, db, new CatalogSnapshotRegistry(), default);
        Assert.Equal(400, outcome.Status);
        Assert.Equal("validation_error", outcome.Code);
    }

    [Theory]
    [InlineData("not-a-cursor!!")]
    [InlineData("MQHx")]
    public async Task Malformed_cursor_returns_cursor_invalid(string cursor)
    {
        await using var db = CreateDb();
        SeedCatalog(db);
        var outcome = await CatalogSnapshot.PageAsync(null, cursor, db, new CatalogSnapshotRegistry(), default);
        Assert.Equal(400, outcome.Status);
        Assert.Equal("cursor_invalid", outcome.Code);
    }

    [Fact]
    public async Task Future_version_cursor_returns_cursor_version_unsupported()
    {
        await using var db = CreateDb();
        SeedCatalog(db);
        var token = Convert.ToBase64String(Encoding.UTF8.GetBytes($"2|{Guid.NewGuid():N}|0")).TrimEnd('=');
        var outcome = await CatalogSnapshot.PageAsync(null, token, db, new CatalogSnapshotRegistry(), default);
        Assert.Equal(409, outcome.Status);
        Assert.Equal("cursor_version_unsupported", outcome.Code);
    }

    [Fact]
    public async Task Unknown_snapshot_cursor_returns_cursor_expired()
    {
        await using var db = CreateDb();
        SeedCatalog(db);
        var token = CatalogSnapshotCursor.Encode(Guid.NewGuid(), 0);
        var outcome = await CatalogSnapshot.PageAsync(null, token, db, new CatalogSnapshotRegistry(), default);
        Assert.Equal(410, outcome.Status);
        Assert.Equal("cursor_expired", outcome.Code);
        Assert.True(outcome.Restart);
    }

    [Fact]
    public async Task Expired_snapshot_cursor_returns_cursor_expired()
    {
        await using var db = CreateDb();
        SeedCatalog(db);
        var registry = new CatalogSnapshotRegistry();
        var id = Guid.NewGuid();
        registry.Add(new CatalogSnapshotRecord(id, DateTime.UtcNow.AddHours(-2), DateTime.UtcNow.AddMinutes(-30), [], [], "unavailable"));
        var outcome = await CatalogSnapshot.PageAsync(null, CatalogSnapshotCursor.Encode(id, 0), db, registry, default);
        Assert.Equal(410, outcome.Status);
        Assert.Equal("cursor_expired", outcome.Code);
        Assert.False(registry.TryGet(id, out _));
    }

    [Fact]
    public async Task Out_of_range_cursor_returns_cursor_invalid()
    {
        await using var db = CreateDb();
        SeedCatalog(db);
        var registry = new CatalogSnapshotRegistry();
        var first = (await CatalogSnapshot.PageAsync("1", null, db, registry, default)).Envelope!;
        var snapshotId = Guid.Parse(first.SnapshotId);
        var total = await db.Set<CompletionVideo>().CountAsync();
        var outcome = await CatalogSnapshot.PageAsync(null, CatalogSnapshotCursor.Encode(snapshotId, total), db, registry, default);
        Assert.Equal(400, outcome.Status);
        Assert.Equal("cursor_invalid", outcome.Code);
    }

    [Theory]
    [InlineData("current")]
    [InlineData("degraded")]
    [InlineData("failed")]
    [InlineData("unavailable")]
    public async Task Provider_condition_reflects_refresh_state(string expected)
    {
        await using var db = CreateDb();
        var now = DateTime.UtcNow;
        var target = new CompletionTarget
        {
            EntityType = CompletionTargetType.Performer,
            EntityId = 1,
            DisplayName = "P",
            RemoteEndpoint = "https://stashdb.org/graphql",
            RemoteId = "p",
        };
        switch (expected)
        {
            case "current":
                target.LastRefreshAt = now;
                target.LastSuccessfulRefreshAt = now;
                break;
            case "degraded":
                target.LastRefreshAt = now;
                target.LastSuccessfulRefreshAt = now.AddHours(-1);
                target.LastRefreshError = "provider error";
                break;
            case "failed":
                target.LastRefreshAt = now;
                target.LastRefreshError = "provider error";
                break;
        }
        db.Add(target);
        await db.SaveChangesAsync();

        var envelope = Assert.IsAssignableFrom<CatalogSnapshotResponse>((await CatalogSnapshot.PageAsync(null, null, db, new CatalogSnapshotRegistry(), default)).Envelope);
        var provider = envelope.Status.Providers.Single();
        Assert.Equal(expected, provider.Condition);
        Assert.Equal(expected, envelope.Status.Condition);
        if (expected is "degraded" or "failed")
        {
            Assert.Equal("provider error", provider.LastRefreshError);
        }
    }

    [Fact]
    public async Task Snapshot_condition_degrades_when_any_provider_is_not_current()
    {
        await using var db = CreateDb();
        var now = DateTime.UtcNow;
        db.AddRange(
            new CompletionTarget
            {
                EntityType = CompletionTargetType.Performer, EntityId = 1, DisplayName = "A",
                RemoteEndpoint = "https://a.test/graphql", RemoteId = "a",
                LastRefreshAt = now, LastSuccessfulRefreshAt = now,
            },
            new CompletionTarget
            {
                EntityType = CompletionTargetType.Performer, EntityId = 2, DisplayName = "B",
                RemoteEndpoint = "https://b.test/graphql", RemoteId = "b",
                LastRefreshAt = now, LastRefreshError = "down",
            });
        await db.SaveChangesAsync();

        var envelope = Assert.IsAssignableFrom<CatalogSnapshotResponse>((await CatalogSnapshot.PageAsync(null, null, db, new CatalogSnapshotRegistry(), default)).Envelope);
        Assert.Equal("degraded", envelope.Status.Condition);
    }

    [Fact]
    public async Task Empty_catalog_reports_unavailable_with_empty_collections()
    {
        await using var db = CreateDb();
        var envelope = Assert.IsAssignableFrom<CatalogSnapshotResponse>((await CatalogSnapshot.PageAsync(null, null, db, new CatalogSnapshotRegistry(), default)).Envelope);
        Assert.Equal("unavailable", envelope.Status.Condition);
        Assert.Empty(envelope.Status.Providers);
        Assert.Empty(envelope.Items);
        Assert.Null(envelope.NextCursor);
    }

    [Fact]
    public async Task Null_fields_are_emitted_with_wire_names()
    {
        await using var db = CreateDb();
        var target = new CompletionTarget
        {
            EntityType = CompletionTargetType.Tag, EntityId = 9, DisplayName = "T",
            RemoteEndpoint = "https://stashdb.org/graphql", RemoteId = "t",
            LastRefreshAt = DateTime.UtcNow, LastSuccessfulRefreshAt = DateTime.UtcNow,
        };
        var video = new CompletionVideo
        {
            RemoteEndpoint = "https://StashDB.Org/graphql/",
            RemoteId = "naked",
            CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc),
            UpdatedAt = new DateTime(2026, 1, 2, 0, 0, 0, DateTimeKind.Utc),
        };
        video.Targets.Add(new CompletionVideoTarget { Video = video, Target = target });
        db.AddRange(target, video);
        await db.SaveChangesAsync();

        var json = JsonSerializer.Serialize(
            (await CatalogSnapshot.PageAsync(null, null, db, new CatalogSnapshotRegistry(), default)).Envelope!,
            CatalogSnapshotJson.Options);
        using var doc = JsonDocument.Parse(json);
        var root = doc.RootElement;
        foreach (var key in new[] { "schemaVersion", "snapshotId", "createdAt", "expiresAt", "nextCursor", "status", "items" })
        {
            Assert.True(root.TryGetProperty(key, out _), $"missing wire key {key}");
        }
        Assert.EndsWith("Z", root.GetProperty("createdAt").GetString());
        Assert.Null(root.GetProperty("nextCursor").GetString());
        var item = root.GetProperty("items")[0];
        Assert.Equal("2026-01-01T00:00:00Z", item.GetProperty("createdAt").GetString());
        Assert.Equal("https://StashDB.Org/graphql/", item.GetProperty("remoteEndpoint").GetString());
        Assert.Equal("https://stashdb.org/graphql", item.GetProperty("normalizedEndpoint").GetString());
        Assert.Equal(JsonValueKind.Null, item.GetProperty("title").ValueKind);
        Assert.Equal(JsonValueKind.Null, item.GetProperty("studio").ValueKind);
        Assert.Equal(JsonValueKind.Null, item.GetProperty("releaseDate").ValueKind);
        Assert.Equal("[]", item.GetProperty("performers").GetRawText());
        Assert.Equal("unavailable", item.GetProperty("cover").GetProperty("state").GetString());
        Assert.Equal(JsonValueKind.Null, item.GetProperty("cover").GetProperty("error").ValueKind);
        Assert.Equal("tag", item.GetProperty("targets")[0].GetProperty("targetType").GetString());
    }

    [Fact]
    public async Task Cover_states_map_to_available_failed_unavailable()
    {
        await using var db = CreateDb();
        var (a, _) = SeedCatalog(db);
        var coverOk = Video(a, "cover-ok");
        coverOk.CoverBlobId = "blob-1";
        coverOk.CoverSourceUrl = "https://stashdb.org/cover.jpg";
        var coverFail = Video(a, "cover-fail");
        coverFail.CoverError = "cover download failed";
        db.AddRange(coverOk, coverFail, Video(a, "cover-none"));
        await db.SaveChangesAsync();

        var envelope = Assert.IsAssignableFrom<CatalogSnapshotResponse>((await CatalogSnapshot.PageAsync("100", null, db, new CatalogSnapshotRegistry(), default)).Envelope);
        Assert.Equal("available", envelope.Items.Single(x => x.RemoteId == "cover-ok").Cover.State);
        Assert.Equal("failed", envelope.Items.Single(x => x.RemoteId == "cover-fail").Cover.State);
        Assert.Equal("unavailable", envelope.Items.Single(x => x.RemoteId == "cover-none").Cover.State);
    }

    [Fact]
    public async Task Studio_and_parent_projection_preserves_local_ids()
    {
        await using var db = CreateDb();
        var (a, _) = SeedCatalog(db);
        var studioVideo = Video(a, "studio");
        studioVideo.StudioRemoteId = "s1";
        studioVideo.StudioName = "Studio One";
        studioVideo.CoveStudioId = 42;
        studioVideo.ParentStudioRemoteId = "s0";
        studioVideo.ParentStudioName = "Parent Studio";
        db.Add(studioVideo);
        await db.SaveChangesAsync();

        var item = (await CatalogSnapshot.PageAsync("100", null, db, new CatalogSnapshotRegistry(), default)).Envelope!
            .Items.Single(x => x.RemoteId == "studio");
        var studio = Assert.IsAssignableFrom<CatalogSnapshotStudio>(item.Studio);
        Assert.Equal(42, studio.LocalId);
        Assert.Equal("s1", studio.RemoteId);
        var parent = Assert.IsAssignableFrom<CatalogSnapshotStudioParent>(studio.Parent);
        Assert.Equal("s0", parent.RemoteId);
        Assert.Null(parent.LocalId);
    }

    [Fact]
    public async Task Endpoint_maps_success_and_error_wire_shapes()
    {
        await using var db = CreateDb();
        SeedCatalog(db);
        var services = new ServiceCollection()
            .AddLogging()
            .BuildServiceProvider();

        var ok = new DefaultHttpContext();
        ok.Request.QueryString = QueryString.Create("limit", "2");
        ok.RequestServices = services;
        var okBody = new MemoryStream();
        ok.Response.Body = okBody;
        await (await CompleteTheCoveExtension.GetCatalogSnapshot(ok.Request, db, default)).ExecuteAsync(ok);
        Assert.Equal(200, ok.Response.StatusCode);
        okBody.Position = 0;
        var okDoc = JsonDocument.Parse(Encoding.UTF8.GetString(okBody.ToArray()));
        Assert.Equal("v1", okDoc.RootElement.GetProperty("schemaVersion").GetString());

        var bad = new DefaultHttpContext();
        bad.Request.QueryString = QueryString.Create("limit", "0");
        bad.RequestServices = services;
        var badBody = new MemoryStream();
        bad.Response.Body = badBody;
        await (await CompleteTheCoveExtension.GetCatalogSnapshot(bad.Request, db, default)).ExecuteAsync(bad);
        Assert.Equal(400, bad.Response.StatusCode);
        badBody.Position = 0;
        var badDoc = JsonDocument.Parse(Encoding.UTF8.GetString(badBody.ToArray()));
        var error = badDoc.RootElement.GetProperty("error");
        Assert.Equal("validation_error", error.GetProperty("code").GetString());
        Assert.False(error.GetProperty("restart").GetBoolean());
    }

    private sealed class TestDb(DbContextOptions options) : DbContext(options)
    {
        public int SaveCalls { get; private set; }
        public override int SaveChanges(bool acceptAllChangesOnSuccess)
        {
            SaveCalls++;
            ChangeTracker.DetectChanges();
            return base.SaveChanges(acceptAllChangesOnSuccess);
        }
        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            SaveCalls++;
            ChangeTracker.DetectChanges();
            return base.SaveChangesAsync(cancellationToken);
        }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            new CompleteTheCoveExtension().ConfigureModel(builder);
        }
    }

    private static TestDb CreateDb() => new(new DbContextOptionsBuilder<TestDb>().UseInMemoryDatabase(Guid.NewGuid().ToString()).Options);

    private static (CompletionTarget A, CompletionTarget B) SeedCatalog(TestDb db)
    {
        var now = DateTime.UtcNow;
        var a = new CompletionTarget
        {
            EntityType = CompletionTargetType.Performer, EntityId = 1, DisplayName = "P1",
            RemoteEndpoint = "https://stashdb.org/graphql", RemoteId = "p1",
            LastRefreshAt = now, LastSuccessfulRefreshAt = now, EligibleVideoCount = 3, OwnedVideoCount = 1,
        };
        var b = new CompletionTarget
        {
            EntityType = CompletionTargetType.Performer, EntityId = 2, DisplayName = "P2",
            RemoteEndpoint = "https://theporndb.net/graphql", RemoteId = "p2",
            LastRefreshAt = now, LastSuccessfulRefreshAt = now, EligibleVideoCount = 2, OwnedVideoCount = 0,
        };
        db.AddRange(a, b, Video(a, "a1"), Video(a, "a2"), Video(a, "a3"), Video(b, "b1"), Video(b, "b2"));
        db.SaveChanges();
        return (a, b);
    }

    private static CompletionVideo Video(CompletionTarget target, string id) => new()
    {
        RemoteEndpoint = target.RemoteEndpoint,
        RemoteId = id,
        Title = id,
        Code = $"CODE-{id}",
        Details = $"details {id}",
        ReleaseDate = new DateOnly(2026, 1, 2),
        CreatedAt = DateTime.UtcNow,
        UpdatedAt = DateTime.UtcNow,
        Performers = [new CompletionVideoPerformer { RemoteId = $"perf-{id}", CovePerformerId = id is "a1" ? 7 : null, Name = $"Performer {id}" }],
        Tags = [new CompletionVideoTag { RemoteId = $"tag-{id}", Name = $"Tag {id}" }],
        Urls = [new CompletionVideoUrl { Url = $"https://example.test/{id}" }],
    };
}
