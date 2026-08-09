using System.Text.Json;
using System.Text.Json.Serialization;
using Cove.Plugins;
using Cove.Sdk;
using Cove.Core.Auth;
using Cove.Core.Entities;
using Cove.Core.Interfaces;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace SegmentStudio;

public sealed class SegmentStudioExtension : FullExtensionBase, IPermissionContributor
{
    public const string ProvenanceReadPermission = "segment-studio.provenance.read";
    public const string ProvenanceManagePermission = "segment-studio.provenance.manage";
    public const string LineageManagePermission = "segment-studio.lineage.manage";
    public const string LineageMaintenancePermission = "segment-studio.lineage.maintenance";
    public const string AnalysisSettingsManagePermission = "segment-studio.analysis.settings.manage";

    private CancellationTokenSource? _cleanupCancellation;
    private Task? _cleanupTask;

    public override void ConfigureServices(IServiceCollection services, ExtensionContext context)
    {
        services.AddSingleton<ISegmentStudioAnalysisSettingsStore>(
            _ => new SegmentStudioAnalysisSettingsStore(() => Store));
        services.AddHttpClient<ISegmentStudioAnalysisClient, SegmentStudioAnalysisClient>(client =>
        {
            client.Timeout = Timeout.InfiniteTimeSpan;
        }).ConfigurePrimaryHttpMessageHandler(static () => new HttpClientHandler
        {
            AllowAutoRedirect = false,
        });
        services.AddScoped<ISegmentStudioVideoAnalysisService, SegmentStudioVideoAnalysisService>();
        services.AddScoped<ISegmentStudioAnalysisProvenanceService, SegmentStudioAnalysisProvenanceService>();
        services.AddSingleton<SegmentStudioBlobCleanupWorker>();
        services.AddScoped<ISegmentSourceRegistry, SegmentSourceRegistry>();
        services.AddScoped<IProvenanceActivityService, ProvenanceActivityService>();
        services.AddScoped<ILineageNodeService, LineageNodeService>();
        services.AddScoped<ISegmentProvenanceService, SegmentProvenanceService>();
        services.AddScoped<ISegmentDuplicationProvenanceService, SegmentDuplicationProvenanceService>();
        services.AddScoped<IDerivationRuleService, DerivationRuleService>();
        services.AddScoped<IDerivationGraphService, DerivationGraphService>();
        services.AddScoped<ILineageMutationService, LineageMutationService>();
        services.AddScoped<ILineageReconciliationService, LineageReconciliationService>();
        services.AddScoped<ISegmentLineageDeletionService, SegmentLineageDeletionService>();
        services.AddScoped<ILineageIntegrityService, LineageIntegrityService>();
        services.AddScoped<INativeAiProvenanceIngestionService, NativeAiProvenanceIngestionService>();
        services.AddScoped<INativeSegmentImportService, NativeSegmentImportService>();
    }

    public IEnumerable<PermissionDefinition> ContributePermissions() =>
    [
        new(
            ProvenanceReadPermission,
            "Segment Studio",
            "Read segment provenance evidence.",
            Source: "extension:segment-studio",
            GrantToAdminsByDefault: true),
        new(
            ProvenanceManagePermission,
            "Segment Studio",
            "Register sources and append provenance corrections.",
            Dangerous: true,
            Implies: [ProvenanceReadPermission],
            Source: "extension:segment-studio",
            GrantToAdminsByDefault: true),
        new(
            LineageManagePermission,
            "Segment Studio",
            "Create and mutate segment derivation lineage.",
            Dangerous: true,
            Implies: [ProvenanceReadPermission],
            Source: "extension:segment-studio",
            GrantToAdminsByDefault: true),
        new(
            LineageMaintenancePermission,
            "Segment Studio",
            "Scan and repair segment lineage integrity.",
            Dangerous: true,
            Implies: [ProvenanceReadPermission],
            Source: "extension:segment-studio",
            GrantToAdminsByDefault: true),
        new(
            AnalysisSettingsManagePermission,
            "Segment Studio",
            "Change the trusted network target used for Segment Studio analysis.",
            Dangerous: true,
            Source: "extension:segment-studio",
            GrantToAdminsByDefault: true),
    ];

    public override Task InitializeAsync(IServiceProvider services, CancellationToken ct = default)
    {
        _cleanupCancellation = CancellationTokenSource.CreateLinkedTokenSource(ct);
        _cleanupTask = services.GetRequiredService<SegmentStudioBlobCleanupWorker>()
            .RunAsync(_cleanupCancellation.Token);
        return Task.CompletedTask;
    }

    public override async Task ShutdownAsync(CancellationToken ct = default)
    {
        if (_cleanupCancellation is null)
            return;
        await _cleanupCancellation.CancelAsync();
        if (_cleanupTask is not null)
        {
            try
            {
                await _cleanupTask.WaitAsync(ct);
            }
            catch (OperationCanceledException)
            { }
        }
        _cleanupCancellation.Dispose();
        _cleanupCancellation = null;
        _cleanupTask = null;
    }

    public override void ConfigureModel(ModelBuilder modelBuilder) =>
        SegmentStudioModelConfiguration.Configure(modelBuilder);

    protected override void DefineMigrations()
    {
        using var stream = typeof(SegmentStudioExtension).Assembly
            .GetManifestResourceStream("SegmentStudio.SegmentStudioBaseline.sql")
            ?? throw new InvalidOperationException(
                "The embedded Segment Studio baseline schema is missing.");
        using var reader = new StreamReader(stream);
        Migration("001_initial_schema", reader.ReadToEnd());

        using var analysisSourceTagsStream = typeof(SegmentStudioExtension).Assembly
            .GetManifestResourceStream("SegmentStudio.SegmentStudioAnalysisSourceTags.sql")
            ?? throw new InvalidOperationException(
                "The embedded Segment Studio analysis source-tag migration is missing.");
        using var analysisSourceTagsReader = new StreamReader(analysisSourceTagsStream);
        Migration("002_corresponding_tags", analysisSourceTagsReader.ReadToEnd());

        using var removeCorrespondingTagsStream = typeof(SegmentStudioExtension).Assembly
            .GetManifestResourceStream("SegmentStudio.SegmentStudioRemoveCorrespondingTags.sql")
            ?? throw new InvalidOperationException(
                "The embedded Segment Studio mapping cleanup migration is missing.");
        using var removeCorrespondingTagsReader = new StreamReader(removeCorrespondingTagsStream);
        Migration("003_remove_corresponding_tags", removeCorrespondingTagsReader.ReadToEnd());

    }

    public override UIManifest GetUIManifest()
    {
        var builder = ManifestBuilder()
            .AddPage(
                "segment-studio",
                "Segment Studio",
                "SegmentStudioPage",
                icon: "puzzle",
                detailRoute: "segment-studio/:id",
                navOrder: 65)
            .AddAction(
                "open-segment-studio",
                "Open in Segment Studio",
                "toolbar",
                ["video"],
                icon: "scissors",
                handlerName: "openSegmentStudio",
                order: 45,
                suppressSuccessAlert: true);
        SegmentStudioKeyboardActions.AddTo(builder);
        return builder.Build();
    }

    public override void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet(
                "/api/plugins/segment-studio/analysis/settings",
                async ([FromServices] ISegmentStudioAnalysisSettingsStore settings,
                    CancellationToken ct) => Results.Ok(await settings.LoadAsync(ct)))
            .RequireAuthorization()
            .RequireCovePermission(AnalysisSettingsManagePermission);

        endpoints.MapPut(
                "/api/plugins/segment-studio/analysis/settings",
                async Task<IResult> (SegmentStudioAnalysisSettings request,
                    [FromServices] ISegmentStudioAnalysisSettingsStore settings,
                    CancellationToken ct) =>
                {
                    try
                    {
                        return Results.Ok(await settings.SaveAsync(request, ct));
                    }
                    catch (InvalidOperationException error)
                    {
                        return Results.BadRequest(new { error = error.Message });
                    }
                })
            .RequireAuthorization()
            .RequireCovePermission(AnalysisSettingsManagePermission);

        endpoints.MapGet(
                "/api/plugins/segment-studio/analysis/status",
                async Task<IResult> ([FromServices] ISegmentStudioAnalysisSettingsStore settingsStore,
                    [FromServices] ISegmentStudioAnalysisClient client, CancellationToken ct) =>
                {
                    var settings = await settingsStore.LoadAsync(ct);
                    if (!settings.IsConfigured)
                        return Results.Ok(new
                        {
                            configured = false,
                            ready = false,
                            error = settings.ConfigurationError,
                        });
                    try
                    {
                        var ready = await client.ReadyAsync(ct);
                        return Results.Ok(new
                        {
                            configured = true,
                            ready = ready.Ok,
                            ready.ServiceVersion,
                            ready.SchemaVersion,
                            ready.Checks,
                        });
                    }
                    catch (SegmentStudioAnalysisNotConfiguredException exception)
                    {
                        return Results.Ok(new
                        {
                            configured = false,
                            ready = false,
                            error = exception.Message,
                        });
                    }
                    catch (SegmentStudioAnalysisServiceException exception)
                    {
                        return Results.Ok(new
                        {
                            configured = true,
                            ready = false,
                            errorCode = exception.Code,
                            error = exception.Message,
                        });
                    }
                })
            .RequireAuthorization()
            .RequireCovePermission(Permissions.SegmentsRead)
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.AnalysisFullScan);

        endpoints.MapGet(
                "/api/plugins/segment-studio/analysis/catalog",
                async ([FromServices] ISegmentStudioAnalysisClient client, CancellationToken ct) =>
                    Results.Ok(await client.GetCatalogAsync(ct)))
            .RequireAuthorization()
            .RequireCovePermission(Permissions.SegmentsRead)
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.AnalysisFullScan);

        endpoints.MapGet(
                "/api/plugins/segment-studio/videos/{videoId:int}/analysis-runs",
                async Task<IResult> (int videoId, DbContext db,
                    ICurrentPrincipalAccessor principalAccessor,
                    [FromServices] IJobService jobs, CancellationToken ct) =>
                {
                    if (principalAccessor.Current?.UserId is not int userId)
                        return Results.Unauthorized();
                    var profile =
                        await SegmentStudioFeatureProfileService.GetAsync(
                            db, userId, ct);
                    var runs = await db.Set<SegmentStudioAnalysisRun>()
                        .Where(run => run.VideoId == videoId)
                        .OrderByDescending(run => run.CreatedAt)
                        .Take(20)
                        .ToListAsync(ct);
                    var now = DateTime.UtcNow;
                    foreach (var run in runs.Where(run =>
                                 run.Status == "queued" || run.Status == "running"))
                    {
                        var job = string.IsNullOrWhiteSpace(run.JobId)
                            ? null
                            : jobs.GetJob(run.JobId);
                        if (job?.Status is JobStatus.Pending or JobStatus.Running)
                            continue;
                        if (job is null && run.JobId is null
                            && now - run.CreatedAt < TimeSpan.FromMinutes(1))
                            continue;
                        run.Status = job?.Status == JobStatus.Cancelled ? "cancelled" : "failed";
                        run.ErrorCode = job?.Status == JobStatus.Cancelled
                            ? "cancelled"
                            : "job_interrupted";
                        run.ErrorMessage = job?.Status == JobStatus.Cancelled
                            ? "Analysis was cancelled before it started."
                            : "The analysis job ended before the run completed.";
                        run.UpdatedAt = now;
                        run.CompletedAt = now;
                    }
                    await db.SaveChangesAsync(ct);
                    if (profile.EffectiveMode == SegmentStudioModes.Basic)
                        return Results.Ok(runs.Select(run =>
                            ToAnalysisRunResponse(run, [])));
                    var runIds = runs.Select(run => run.Id).ToArray();
                    var candidates = await db.Set<SegmentStudioAnalysisCandidate>().AsNoTracking()
                        .Where(candidate => runIds.Contains(candidate.RunId))
                        .OrderBy(candidate => candidate.StartSec)
                        .ThenBy(candidate => candidate.Id)
                        .ToListAsync(ct);
                    var candidatesByRun = candidates.ToLookup(candidate => candidate.RunId);
                    return Results.Ok(runs.Select(run =>
                        ToAnalysisRunResponse(
                            run,
                            candidatesByRun[run.Id])));
                })
            .RequireAuthorization()
            .RequireCovePermission(Permissions.SegmentsRead)
            .RequireCoveEntityAccess(EntityKinds.Video, "videoId", Permissions.VideosRead)
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.AnalysisFullScan);

        endpoints.MapPost(
                "/api/plugins/segment-studio/videos/{videoId:int}/analysis-runs",
                async Task<IResult> (int videoId, [FromBody] StartSegmentStudioAnalysisRequest request,
                    DbContext db, [FromServices] ISegmentStudioVideoAnalysisService analysis,
                    ICurrentPrincipalAccessor principalAccessor,
                    Cove.Core.Auth.IAuthorizationService authorization,
                    [FromServices] IJobService jobs, [FromServices] IServiceScopeFactory scopeFactory,
                    CancellationToken ct) =>
                {
                    if (principalAccessor.Current?.UserId is not int userId)
                        return Results.Unauthorized();
                    var outputMode =
                        (await SegmentStudioFeatureProfileService.GetAsync(
                            db, userId, ct)).EffectiveMode;
                    IReadOnlyList<SegmentStudioAnalysisKind> requestedAnalyses;
                    try
                    {
                        requestedAnalyses = SegmentStudioVideoAnalysisService.NormalizeAnalyses(
                            request.Analyses,
                            outputMode);
                    }
                    catch (ArgumentException exception)
                    {
                        return Results.BadRequest(new { error = exception.Message });
                    }
                    if (requestedAnalyses.Contains(SegmentStudioAnalysisKind.AiTagging))
                    {
                        var tagWriteAccess = await authorization.AuthorizeAsync(
                            principalAccessor.Current,
                            Permissions.TagsWrite,
                            null,
                            ct);
                        if (!tagWriteAccess.Allowed)
                        {
                            return Results.Json(
                                new { error = tagWriteAccess.Reason },
                                statusCode: StatusCodes.Status403Forbidden);
                        }
                    }
                    SegmentStudioAnalysisRun run;
                    try
                    {
                        run = await analysis.CreateRunAsync(
                            db, videoId, request, outputMode, ct);
                    }
                    catch (KeyNotFoundException)
                    {
                        return Results.NotFound(new { error = "Video or source file not found." });
                    }
                    catch (ArgumentException exception)
                    {
                        return Results.BadRequest(new { error = exception.Message });
                    }

                    var jobId = jobs.Enqueue(
                        "segment-studio-analysis",
                        "Analyze video for Segment Studio",
                        async (progress, jobCt) =>
                        {
                            progress.Report(0.02, "Starting video analysis");
                            await using var scope = scopeFactory.CreateAsyncScope();
                            var scopedDb = scope.ServiceProvider.GetRequiredService<DbContext>();
                            var scopedAnalysis = scope.ServiceProvider
                                .GetRequiredService<ISegmentStudioVideoAnalysisService>();
                            await using var modeLock =
                                await SegmentStudioModeLock.AcquireSharedAsync(
                                    scopedDb, userId, jobCt);
                            var currentProfile =
                                await SegmentStudioFeatureProfileService.GetAsync(
                                    scopedDb, userId, jobCt);
                            if (currentProfile.EffectiveMode != outputMode)
                            {
                                var cancelledRun = await scopedDb
                                    .Set<SegmentStudioAnalysisRun>()
                                    .SingleAsync(candidate =>
                                        candidate.Id == run.Id, jobCt);
                                var now = DateTime.UtcNow;
                                cancelledRun.Status = "cancelled";
                                cancelledRun.ErrorCode = "mode_changed";
                                cancelledRun.ErrorMessage =
                                    "Analysis was cancelled because the Segment Studio mode changed before it started.";
                                cancelledRun.UpdatedAt = now;
                                cancelledRun.CompletedAt = now;
                                await scopedDb.SaveChangesAsync(jobCt);
                                progress.Report(
                                    1,
                                    "Video analysis cancelled after mode change");
                                return;
                            }
                            var jobAnalyses = SegmentStudioVideoAnalysisService.NormalizeAnalyses(
                                request.Analyses,
                                outputMode);
                            await scopedAnalysis.ExecuteRunAsync(
                                scopedDb,
                                run.Id,
                                request,
                                outputMode,
                                new SegmentStudioAnalysisProgressRelay(update =>
                                    progress.Report(
                                        SegmentStudioAnalysisClient.EstimateProgress(
                                            update,
                                            jobAnalyses),
                                        SegmentStudioAnalysisClient.FormatPhase(update.Phase))),
                                jobCt);
                            progress.Report(1, "Video analysis complete");
                        });
                    run.JobId = jobId;
                    run.UpdatedAt = DateTime.UtcNow;
                    await db.SaveChangesAsync(ct);
                    return Results.Accepted(
                        $"/api/plugins/segment-studio/videos/{videoId}/analysis-runs",
                        ToAnalysisRunResponse(run, []));
                })
            .RequireAuthorization()
            .RequireCovePermission(
                PermissionMode.All,
                Permissions.SegmentsWrite,
                Permissions.JobsRun)
            .RequireCoveEntityAccess(EntityKinds.Video, "videoId", Permissions.VideosWrite)
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.AnalysisFullScan);

        endpoints.MapGet(
                "/api/plugins/segment-studio/videos/{videoId:int}/history",
                async Task<IResult> (int videoId, DbContext db,
                    ICurrentPrincipalAccessor principalAccessor, CancellationToken ct) =>
                {
                    if (principalAccessor.Current?.UserId is not int userId)
                        return Results.Unauthorized();
                    var profile = await SegmentStudioFeatureProfileService.GetAsync(
                        db, userId, ct);
                    return Results.Ok(await SegmentStudioHistoryService.GetAsync(
                        db, userId, videoId, profile.EffectiveMode, ct));
                })
            .RequireAuthorization()
            .RequireCovePermission(Permissions.SegmentsRead)
            .RequireCoveEntityAccess(EntityKinds.Video, "videoId", Permissions.VideosRead)
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.EditorUndo);

        endpoints.MapPost(
                "/api/plugins/segment-studio/videos/{videoId:int}/history/actions",
                async Task<IResult> (int videoId, SegmentStudioHistoryRecordRequest request, DbContext db,
                    ICurrentPrincipalAccessor principalAccessor, CancellationToken ct) =>
                {
                    if (principalAccessor.Current?.UserId is not int userId)
                        return Results.Unauthorized();
                    var profile = await SegmentStudioFeatureProfileService.GetAsync(
                        db, userId, ct);
                    var result = await SegmentStudioHistoryService.AppendAsync(
                        db, userId, videoId, profile.EffectiveMode, request, ct);
                    return result.Status switch
                    {
                        SegmentStudioHistoryMutationStatus.Updated => Results.Ok(result.Value),
                        SegmentStudioHistoryMutationStatus.Conflict => Results.Conflict(new { error = result.Error, current = result.Value }),
                        _ => Results.BadRequest(new { error = result.Error, current = result.Value }),
                    };
                })
            .RequireAuthorization()
            .RequireCovePermission(PermissionMode.All, Permissions.SegmentsWrite, Permissions.VideosRead)
            .RequireCoveEntityAccess(EntityKinds.Video, "videoId", Permissions.SegmentsWrite)
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.EditorUndo);

        endpoints.MapPost(
                "/api/plugins/segment-studio/videos/{videoId:int}/history/native-state",
                async Task<IResult> (int videoId,
                    BasicNativeHistoryRestoreRequest request,
                    DbContext db,
                    ICurrentPrincipalAccessor principalAccessor,
                    Cove.Core.Auth.IAuthorizationService authorization,
                    [FromServices] IBlobService blobs,
                    [FromServices] ISegmentSpanCacheInvalidator spanCacheInvalidator,
                    CancellationToken ct) =>
                {
                    if (principalAccessor.Current?.UserId is not int userId)
                        return Results.Unauthorized();
                    var profile = await SegmentStudioFeatureProfileService.GetAsync(
                        db, userId, ct);
                    if (profile.EffectiveMode != SegmentStudioModes.Basic)
                        return Results.Conflict(new
                        {
                            error = "Native-only history restoration is available only in Basic mode.",
                        });
                    var strategy = db.Database.CreateExecutionStrategy();
                    var result = await strategy.ExecuteAsync(async () =>
                    {
                        await using var transaction = db.Database.IsRelational()
                            ? await db.Database.BeginTransactionAsync(ct)
                            : null;
                        var restored = await BasicNativeHistoryService.RestoreAsync(
                            db, videoId, request, principalAccessor.Current,
                            authorization, blobs, ct);
                        if (restored.Status == BasicNativeHistoryRestoreStatus.Updated
                            && transaction is not null)
                            await transaction.CommitAsync(ct);
                        return restored;
                    });
                    if (result.Status == BasicNativeHistoryRestoreStatus.Updated)
                        PublishSegmentInvalidation(spanCacheInvalidator, videoId);
                    return result.Status switch
                    {
                        BasicNativeHistoryRestoreStatus.Updated =>
                            Results.Ok(result),
                        BasicNativeHistoryRestoreStatus.Invalid =>
                            Results.BadRequest(new { error = result.Error }),
                        BasicNativeHistoryRestoreStatus.Forbidden =>
                            Results.Json(new { error = result.Error },
                                statusCode: StatusCodes.Status403Forbidden),
                        BasicNativeHistoryRestoreStatus.Conflict =>
                            Results.Conflict(new
                            {
                                error = result.Error,
                                current = result.History,
                            }),
                        _ => Results.NotFound(new { error = result.Error }),
                    };
                })
            .RequireAuthorization()
            .RequireCovePermission(
                PermissionMode.All,
                Permissions.SegmentsWrite,
                Permissions.SegmentsDelete)
            .RequireCoveEntityAccess(
                EntityKinds.Video,
                "videoId",
                Permissions.SegmentsWrite)
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.EditorUndo);

        endpoints.MapPost(
                "/api/plugins/segment-studio/videos/{videoId:int}/history/cursor",
                async Task<IResult> (int videoId, SegmentStudioHistoryCursorRequest request, DbContext db,
                    ICurrentPrincipalAccessor principalAccessor, CancellationToken ct) =>
                {
                    if (principalAccessor.Current?.UserId is not int userId)
                        return Results.Unauthorized();
                    var profile = await SegmentStudioFeatureProfileService.GetAsync(
                        db, userId, ct);
                    var result = await SegmentStudioHistoryService.MoveCursorAsync(
                        db, userId, videoId, profile.EffectiveMode, request, ct);
                    return result.Status switch
                    {
                        SegmentStudioHistoryMutationStatus.Updated => Results.Ok(result.Value),
                        SegmentStudioHistoryMutationStatus.Conflict => Results.Conflict(new { error = result.Error, current = result.Value }),
                        _ => Results.BadRequest(new { error = result.Error, current = result.Value }),
                    };
                })
            .RequireAuthorization()
            .RequireCovePermission(PermissionMode.All, Permissions.SegmentsWrite, Permissions.VideosRead)
            .RequireCoveEntityAccess(EntityKinds.Video, "videoId", Permissions.SegmentsWrite)
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.EditorUndo);

        endpoints.MapGet(
                "/api/plugins/segment-studio/videos/{videoId:int}/incorrect-examples",
                async (int videoId, DbContext db, CancellationToken ct) =>
                    Results.Ok(await IncorrectExampleService.ListAsync(db, videoId, ct)))
            .RequireAuthorization()
            .RequireCovePermission(Permissions.SegmentsRead)
            .RequireCoveEntityAccess(EntityKinds.Video, "videoId", Permissions.VideosRead)
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.FeedbackManage);

        endpoints.MapPost(
                "/api/plugins/segment-studio/videos/{videoId:int}/incorrect-examples/toggle",
                async Task<IResult> (int videoId, ToggleIncorrectExampleRequest request, DbContext db,
                    ICurrentPrincipalAccessor principalAccessor, Cove.Core.Auth.IAuthorizationService authorization,
                    [FromServices] IBlobService blobs,
                    [FromServices] INativeAiProvenanceIngestionService nativeAiIngestion,
                    [FromServices] ISegmentSpanCacheInvalidator spanCacheInvalidator, CancellationToken ct) =>
                {
                    if (await SegmentStudioCompatibilityService.RequiresLegacyUiAsync(db, ct))
                        return LegacyUiRequiredResult();
                    if (principalAccessor.Current?.UserId is not int userId)
                        return Results.Unauthorized();
                    var profile = await SegmentStudioFeatureProfileService.GetAsync(
                        db, userId, ct);
                    var strategy = db.Database.CreateExecutionStrategy();
                    var result = await strategy.ExecuteAsync(async () =>
                    {
                        await using var transaction = db.Database.IsRelational()
                            ? await db.Database.BeginTransactionAsync(ct)
                            : null;
                        var toggled = await IncorrectExampleService.ToggleAsync(
                            db, videoId, request, principalAccessor.Current,
                            authorization, blobs, ct, profile.EffectiveMode,
                            nativeAiIngestion);
                        if (toggled.Status == SegmentTransitionStatus.Updated && transaction is not null)
                            await transaction.CommitAsync(ct);
                        return toggled;
                    });
                    if (result.Status == SegmentTransitionStatus.Updated)
                        PublishSegmentInvalidation(spanCacheInvalidator, videoId);
                    return result.Status switch
                    {
                        SegmentTransitionStatus.Updated => Results.Ok(result),
                        SegmentTransitionStatus.Forbidden => Results.Json(new { error = result.Error }, statusCode: StatusCodes.Status403Forbidden),
                        SegmentTransitionStatus.Conflict => Results.Conflict(new { error = result.Error, result }),
                        SegmentTransitionStatus.Invalid or SegmentTransitionStatus.MissingImage => Results.BadRequest(new { error = result.Error, result }),
                        _ => Results.NotFound(new { error = result.Error }),
                    };
                })
            .RequireAuthorization()
            .RequireCovePermission(PermissionMode.All, Permissions.SegmentsWrite, Permissions.SegmentsDelete)
            .RequireCoveEntityAccess(EntityKinds.Video, "videoId", Permissions.SegmentsWrite)
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.FeedbackManage);

        endpoints.MapPost(
                "/api/plugins/segment-studio/videos/{videoId:int}/incorrect-examples/collect",
                async Task<IResult> (int videoId, ToggleIncorrectExampleRequest request, DbContext db,
                    ICurrentPrincipalAccessor principalAccessor, Cove.Core.Auth.IAuthorizationService authorization,
                    [FromServices] IBlobService blobs,
                    [FromServices] INativeAiProvenanceIngestionService nativeAiIngestion,
                    [FromServices] ISegmentSpanCacheInvalidator spanCacheInvalidator, CancellationToken ct) =>
                {
                    if (await SegmentStudioCompatibilityService.RequiresLegacyUiAsync(db, ct))
                        return LegacyUiRequiredResult();
                    if (principalAccessor.Current?.UserId is not int userId)
                        return Results.Unauthorized();
                    var profile = await SegmentStudioFeatureProfileService.GetAsync(
                        db, userId, ct);
                    var strategy = db.Database.CreateExecutionStrategy();
                    var result = await strategy.ExecuteAsync(async () =>
                    {
                        await using var transaction = db.Database.IsRelational()
                            ? await db.Database.BeginTransactionAsync(ct)
                            : null;
                        var collected = await IncorrectExampleService.CollectAsync(
                            db, videoId, request, principalAccessor.Current,
                            authorization, blobs, ct, profile.EffectiveMode,
                            nativeAiIngestion);
                        if (collected.Status == SegmentTransitionStatus.Updated
                            && transaction is not null)
                            await transaction.CommitAsync(ct);
                        return collected;
                    });
                    if (result.Status == SegmentTransitionStatus.Updated)
                        PublishSegmentInvalidation(spanCacheInvalidator, videoId);
                    return result.Status switch
                    {
                        SegmentTransitionStatus.Updated => Results.Ok(result),
                        SegmentTransitionStatus.Forbidden => Results.Json(new { error = result.Error }, statusCode: StatusCodes.Status403Forbidden),
                        SegmentTransitionStatus.Conflict => Results.Conflict(new { error = result.Error, result }),
                        SegmentTransitionStatus.Invalid or SegmentTransitionStatus.MissingImage => Results.BadRequest(new { error = result.Error, result }),
                        _ => Results.NotFound(new { error = result.Error }),
                    };
                })
            .RequireAuthorization()
            .RequireCovePermission(PermissionMode.All, Permissions.SegmentsWrite, Permissions.SegmentsDelete)
            .RequireCoveEntityAccess(EntityKinds.Video, "videoId", Permissions.SegmentsWrite)
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.FeedbackManage);

        endpoints.MapPost(
                "/api/plugins/segment-studio/videos/{videoId:int}/incorrect-examples/{exampleId:long}/remove",
                async Task<IResult> (int videoId, long exampleId,
                    RemoveIncorrectExampleRequest request, DbContext db,
                    ICurrentPrincipalAccessor principalAccessor,
                    Cove.Core.Auth.IAuthorizationService authorization,
                    [FromServices] IBlobService blobs,
                    [FromServices] ISegmentSpanCacheInvalidator spanCacheInvalidator,
                    CancellationToken ct) =>
                {
                    var strategy = db.Database.CreateExecutionStrategy();
                    var result = await strategy.ExecuteAsync(async () =>
                    {
                        await using var transaction = db.Database.IsRelational()
                            ? await db.Database.BeginTransactionAsync(ct)
                            : null;
                        var removed = await IncorrectExampleService.RemoveAsync(
                            db, videoId, exampleId, request,
                            principalAccessor.Current, authorization, blobs, ct);
                        if (removed.Status == SegmentTransitionStatus.Updated
                            && transaction is not null)
                            await transaction.CommitAsync(ct);
                        return removed;
                    });
                    if (result.Status == SegmentTransitionStatus.Updated)
                        PublishSegmentInvalidation(spanCacheInvalidator, videoId);
                    return result.Status switch
                    {
                        SegmentTransitionStatus.Updated => Results.Ok(result),
                        SegmentTransitionStatus.Forbidden => Results.Json(
                            new { error = result.Error },
                            statusCode: StatusCodes.Status403Forbidden),
                        SegmentTransitionStatus.Conflict => Results.Conflict(
                            new { error = result.Error, result }),
                        SegmentTransitionStatus.Invalid
                            or SegmentTransitionStatus.MissingImage =>
                            Results.BadRequest(new { error = result.Error, result }),
                        _ => Results.NotFound(new { error = result.Error }),
                    };
                })
            .RequireAuthorization()
            .RequireCovePermission(
                PermissionMode.All,
                Permissions.SegmentsWrite,
                Permissions.SegmentsDelete)
            .RequireCoveEntityAccess(
                EntityKinds.Video,
                "videoId",
                Permissions.SegmentsWrite)
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.FeedbackManage);

        endpoints.MapPost(
                "/api/plugins/segment-studio/videos/{videoId:int}/incorrect-examples/export",
                async Task<IResult> (int videoId, HttpRequest request, DbContext db,
                    ICurrentPrincipalAccessor principalAccessor,
                    [FromServices] IBlobService blobs, CancellationToken ct) =>
                {
                    if (!request.HasFormContentType)
                        return Results.BadRequest(new
                        {
                            error = "Training export capture must use multipart form data.",
                        });
                    try
                    {
                        var form = await request.ReadFormAsync(ct);
                        var metadataJson = form["metadata"].FirstOrDefault();
                        var capture = string.IsNullOrWhiteSpace(metadataJson)
                            ? null
                            : JsonSerializer.Deserialize<TrainingExportCaptureRequest>(
                                metadataJson,
                                new JsonSerializerOptions(JsonSerializerDefaults.Web));
                        if (capture is null)
                            return Results.BadRequest(new
                            {
                                error = "Training export metadata is required.",
                            });
                        var uploads = new List<TrainingFrameUpload>(form.Files.Count);
                        foreach (var file in form.Files)
                        {
                            if (file.Length > 20 * 1024 * 1024)
                                return Results.BadRequest(new
                                {
                                    error = "Each JPEG frame must be 20 MB or smaller.",
                                });
                            await using var input = file.OpenReadStream();
                            await using var output = new MemoryStream();
                            await input.CopyToAsync(output, ct);
                            uploads.Add(new(
                                file.Name,
                                file.ContentType,
                                output.ToArray()));
                        }
                        var strategy = db.Database.CreateExecutionStrategy();
                        var result = await strategy.ExecuteAsync(async () =>
                        {
                            await using var transaction = db.Database.IsRelational()
                                ? await db.Database.BeginTransactionAsync(ct)
                                : null;
                            var captured = await IncorrectExampleService
                                .CaptureExportAsync(
                                    db,
                                    videoId,
                                    principalAccessor.Current?.UserId,
                                    capture,
                                    uploads,
                                    blobs,
                                    ct);
                            if (transaction is not null)
                                await transaction.CommitAsync(ct);
                            return captured;
                        });
                        return Results.Ok(result);
                    }
                    catch (IncorrectExampleConflictException exception)
                    {
                        return Results.Conflict(new { error = exception.Message });
                    }
                    catch (IncorrectExampleException exception)
                    {
                        return Results.BadRequest(new { error = exception.Message });
                    }
                    catch (JsonException)
                    {
                        return Results.BadRequest(new
                        {
                            error = "Training export metadata is invalid.",
                        });
                    }
                })
            .RequireAuthorization()
            .RequireCovePermission(Permissions.SegmentsWrite)
            .RequireCoveEntityAccess(EntityKinds.Video, "videoId")
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.FeedbackManage);

        endpoints.MapGet(
                "/api/plugins/segment-studio/training-exports/{exportId:guid}/download",
                async Task<IResult> (Guid exportId, DbContext db,
                    ICurrentPrincipalAccessor principalAccessor,
                    Cove.Core.Auth.IAuthorizationService authorization,
                    [FromServices] IBlobService blobs, CancellationToken ct) =>
                {
                    var videoId = await IncorrectExampleService.GetExportVideoIdAsync(
                        db, exportId, ct);
                    if (videoId is null)
                        return Results.NotFound();
                    var access = await authorization.AuthorizeAsync(
                        principalAccessor.Current,
                        Permissions.SegmentsRead,
                        EntityRef.Of(EntityKinds.Video, videoId.Value),
                        ct);
                    if (!access.Allowed)
                        return Results.Json(
                            new { error = access.Reason },
                            statusCode: StatusCodes.Status403Forbidden);
                    try
                    {
                        var download = await IncorrectExampleService.BuildDownloadAsync(
                            db, exportId, blobs, ct);
                        return download is null
                            ? Results.NotFound()
                            : Results.File(
                                download.Content,
                                "application/zip",
                                download.FileName);
                    }
                    catch (IncorrectExampleConflictException exception)
                    {
                        return Results.Conflict(new { error = exception.Message });
                    }
                })
            .RequireAuthorization()
            .RequireCovePermission(Permissions.SegmentsRead)
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.FeedbackManage);

        endpoints.MapPost(
                "/api/plugins/segment-studio/training-exports/{exportId:guid}/complete",
                async Task<IResult> (Guid exportId, DbContext db,
                    ICurrentPrincipalAccessor principalAccessor,
                    Cove.Core.Auth.IAuthorizationService authorization,
                    CancellationToken ct) =>
                {
                    var videoId = await IncorrectExampleService.GetExportVideoIdAsync(
                        db, exportId, ct);
                    if (videoId is null)
                        return Results.NotFound();
                    var access = await authorization.AuthorizeAsync(
                        principalAccessor.Current,
                        Permissions.SegmentsWrite,
                        EntityRef.Of(EntityKinds.Video, videoId.Value),
                        ct);
                    if (!access.Allowed)
                        return Results.Json(
                            new { error = access.Reason },
                            statusCode: StatusCodes.Status403Forbidden);
                    var strategy = db.Database.CreateExecutionStrategy();
                    var result = await strategy.ExecuteAsync(async () =>
                    {
                        await using var transaction = db.Database.IsRelational()
                            ? await db.Database.BeginTransactionAsync(ct)
                            : null;
                        var completed = await IncorrectExampleService
                            .CompleteExportAsync(db, exportId, ct);
                        if (completed is not null && transaction is not null)
                            await transaction.CommitAsync(ct);
                        return completed;
                    });
                    return result is null
                        ? Results.NotFound()
                        : Results.Ok(result);
                })
            .RequireAuthorization()
            .RequireCovePermission(Permissions.SegmentsWrite)
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.FeedbackManage);

        endpoints.MapGet(
                "/api/plugins/segment-studio/compatibility",
                async (DbContext db, CancellationToken ct) => Results.Ok(new
                {
                    requiresLegacyUi = await SegmentStudioCompatibilityService.RequiresLegacyUiAsync(db, ct),
                }))
            .RequireAuthorization()
            .RequireCovePermission(Permissions.SegmentsRead);

        endpoints.MapGet(
                "/api/plugins/segment-studio/maintenance/rollout",
                async (DbContext db, CancellationToken ct) =>
                    Results.Ok(await SegmentStudioRolloutService.GetAsync(db, ct)))
            .RequireAuthorization()
            .RequireCovePermission(LineageMaintenancePermission);

        endpoints.MapPut(
                "/api/plugins/segment-studio/maintenance/rollout",
                async (SegmentStudioRolloutUpdate request, DbContext db, CancellationToken ct) =>
                {
                    await SegmentStudioRolloutService.SetPausedAsync(db, request.Paused, ct);
                    return Results.Ok(await SegmentStudioRolloutService.GetAsync(db, ct));
                })
            .RequireAuthorization()
            .RequireCovePermission(
                PermissionMode.All,
                LineageMaintenancePermission,
                LineageManagePermission);

        endpoints.MapGet(
                "/api/plugins/segment-studio/maintenance/telemetry",
                async (DbContext db, CancellationToken ct) =>
                    Results.Ok(await SegmentStudioRolloutService.GetTelemetryAsync(db, ct)))
            .RequireAuthorization()
            .RequireCovePermission(LineageMaintenancePermission);

        endpoints.MapGet(
                "/api/plugins/segment-studio/preferences",
                async (DbContext db, ICurrentPrincipalAccessor principalAccessor, CancellationToken ct) =>
                {
                    if (principalAccessor.Current?.UserId is not int userId)
                        return Results.Unauthorized();
                    return Results.Ok(
                        await SegmentStudioFeatureProfileService.GetAsync(
                            db, userId, ct));
                })
            .RequireAuthorization()
            .RequireCovePermission(Permissions.SegmentsRead);

        endpoints.MapGet(
                "/api/plugins/segment-studio/preferences/transition",
                async (HttpRequest request, DbContext db,
                    ICurrentPrincipalAccessor principalAccessor,
                    Cove.Core.Auth.IAuthorizationService authorization,
                    CancellationToken ct) =>
                {
                    if (principalAccessor.Current?.UserId is not int userId)
                        return Results.Unauthorized();
                    try
                    {
                        await using var modeLock =
                            await SegmentStudioModeLock.AcquireSharedAsync(
                                db, userId, ct);
                        var profile =
                            await SegmentStudioFeatureProfileService.GetAsync(
                                db, userId, ct);
                        return Results.Ok(
                            await SegmentStudioModeTransitionService.PreviewAsync(
                                db,
                                profile.RequestedMode,
                                request.Query["mode"].FirstOrDefault()
                                    ?? profile.RequestedMode,
                                principalAccessor.Current,
                                authorization,
                                ct));
                    }
                    catch (ArgumentException exception)
                    {
                        return Results.BadRequest(new
                        {
                            error = exception.Message,
                        });
                    }
                })
            .RequireAuthorization()
            .RequireCovePermission(Permissions.SegmentsRead);

        endpoints.MapPut(
                "/api/plugins/segment-studio/preferences",
                async (SegmentStudioPreferenceUpdateRequest request, DbContext db,
                    ICurrentPrincipalAccessor principalAccessor,
                    Cove.Core.Auth.IAuthorizationService authorization,
                    CancellationToken ct) =>
                {
                    if (principalAccessor.Current?.UserId is not int userId)
                        return Results.Unauthorized();
                    try
                    {
                        var strategy = db.Database.CreateExecutionStrategy();
                        return await strategy.ExecuteAsync<IResult>(async () =>
                        {
                            await using var transaction = db.Database.IsRelational()
                                ? await db.Database.BeginTransactionAsync(ct)
                                : null;
                            if (transaction is not null)
                                await SegmentStudioModeLock
                                    .AcquireExclusiveTransactionAsync(
                                        db, userId, ct);
                            var current =
                                await SegmentStudioFeatureProfileService.GetAsync(
                                    db, userId, ct);
                            var targetMode = SegmentStudioModes.NormalizePublic(
                                SegmentStudioModes.ToStored(request.Mode));
                            if (targetMode != current.RequestedMode)
                            {
                                var preview =
                                    await SegmentStudioModeTransitionService.PreviewAsync(
                                        db,
                                        current.RequestedMode,
                                        targetMode,
                                        principalAccessor.Current,
                                        authorization,
                                        ct);
                                if (current.RequestedMode == SegmentStudioModes.Basic
                                    && targetMode == SegmentStudioModes.Full)
                                {
                                    if (!request.ConfirmBasicHistoryCleanup)
                                    {
                                        return Results.Conflict(new
                                        {
                                            error = "Confirm that Basic undo history will be cleared before switching to Full mode.",
                                            code = "basic_history_cleanup_confirmation_required",
                                            preview,
                                        });
                                    }
                                }
                                if (current.RequestedMode == SegmentStudioModes.Basic
                                    && targetMode == SegmentStudioModes.Full
                                    && preview.RecyclingBinCount > 0)
                                {
                                    if (!request.EmptyRecyclingBin
                                        || request.OperationId is not Guid operationId
                                        || string.IsNullOrWhiteSpace(
                                            request.ExpectedRecyclingBinFingerprint))
                                    {
                                        return Results.Conflict(new
                                        {
                                            error = "Confirm and empty the recycling bin as part of switching to Full mode.",
                                            code = "recycling_bin_cleanup_confirmation_required",
                                            preview,
                                        });
                                    }
                                    var emptied =
                                        await BasicNativeRecycleBinService.EmptyAsync(
                                            db,
                                            new EmptyBinRequest(
                                                operationId,
                                                request.ExpectedRecyclingBinFingerprint),
                                            principalAccessor.Current,
                                            authorization,
                                            ct,
                                            preserveIncorrectExamples: true);
                                    if (emptied.Status !=
                                        SegmentTransitionStatus.Updated)
                                    {
                                        return emptied.Status switch
                                        {
                                            SegmentTransitionStatus.Forbidden =>
                                                Results.Json(
                                                    new { error = emptied.Error },
                                                    statusCode: StatusCodes.Status403Forbidden),
                                            SegmentTransitionStatus.Invalid =>
                                                Results.BadRequest(new
                                                {
                                                    error = emptied.Error,
                                                    result = emptied,
                                                }),
                                            _ => Results.Conflict(new
                                            {
                                                error = emptied.Error,
                                                code = "recycling_bin_changed",
                                                result = emptied,
                                            }),
                                        };
                                    }
                                }
                                if (current.RequestedMode == SegmentStudioModes.Full
                                    && targetMode == SegmentStudioModes.Basic
                                    && !request.ConfirmHiddenExtensionOwnedSegments)
                                {
                                    return Results.Conflict(new
                                    {
                                        error = "Confirm that extension-owned segments and expanded metadata may be hidden before switching to Basic mode.",
                                        code = "hidden_extension_segments_confirmation_required",
                                        preview,
                                    });
                                }
                                if (current.RequestedMode == SegmentStudioModes.Basic
                                    && targetMode == SegmentStudioModes.Full)
                                {
                                    await SegmentStudioHistoryService
                                        .ClearBasicUserAsync(db, userId, ct);
                                }
                            }
                            await SegmentStudioUserPreferenceService.SetModeAsync(
                                db, userId, request.Mode, ct);
                            var saved =
                                await SegmentStudioFeatureProfileService.GetAsync(
                                    db, userId, ct);
                            if (transaction is not null)
                                await transaction.CommitAsync(ct);
                            return Results.Ok(saved);
                        });
                    }
                    catch (ArgumentException exception)
                    {
                        return Results.BadRequest(new { error = exception.Message });
                    }
                })
            .RequireAuthorization()
            .RequireCovePermission(Permissions.SegmentsRead);

        endpoints.MapGet(
                "/api/plugins/segment-studio/sources",
                async (DbContext db, CancellationToken ct) =>
                    Results.Ok(await db.Set<SegmentStudioSource>()
                        .AsNoTracking()
                        .OrderBy(source => source.DisplayName)
                        .ThenBy(source => source.Key)
                        .Take(1000)
                        .Select(source => new SegmentSourceDto(
                            source.Key,
                            source.DisplayName,
                            source.Category,
                            source.Provider,
                            source.DefaultModelIdentifier,
                            source.Description,
                            source.MetadataJson))
                        .ToListAsync(ct)))
            .RequireAuthorization()
            .RequireCovePermission(
                PermissionMode.All,
                Permissions.SegmentsRead,
                ProvenanceReadPermission);

        endpoints.MapPost(
                "/api/plugins/segment-studio/sources",
                async (SegmentSourceRegistrationRequest request, DbContext db,
                    ISegmentSourceRegistry registry, CancellationToken ct) =>
                {
                    try
                    {
                        var source = await registry.RegisterAsync(
                            db,
                            new SegmentSourceRegistration(
                                request.Key,
                                request.DisplayName,
                                request.Category,
                                request.Provider,
                                request.DefaultModelIdentifier,
                                request.Description,
                                request.MetadataJson),
                            ct);
                        return Results.Ok(new SegmentSourceDto(
                            source.Key,
                            source.DisplayName,
                            source.Category,
                            source.Provider,
                            source.DefaultModelIdentifier,
                            source.Description,
                            source.MetadataJson));
                    }
                    catch (ArgumentException exception)
                    {
                        return Results.BadRequest(new { error = exception.Message });
                    }
                })
            .RequireAuthorization()
            .RequireCovePermission(
                PermissionMode.All,
                Permissions.SegmentsWrite,
                ProvenanceManagePermission)
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.LineageManage);

        endpoints.MapGet(
                "/api/plugins/segment-studio/items/{itemId:long}/provenance",
                async (long itemId, DbContext db, ISegmentProvenanceService provenance,
                    ICurrentPrincipalAccessor principalAccessor,
                    Cove.Core.Auth.IAuthorizationService authorization,
                    CancellationToken ct) =>
                {
                    var videoId = await ResolveItemVideoIdAsync(db, itemId, ct);
                    if (videoId is null)
                        return Results.NotFound();
                    var access = await authorization.AuthorizeAsync(
                        principalAccessor.Current,
                        Permissions.SegmentsRead,
                        EntityRef.Of(EntityKinds.Video, videoId.Value),
                        ct);
                    if (!access.Allowed)
                        return Results.Forbid();
                    return Results.Ok(await provenance.GetForItemAsync(db, itemId, ct));
                })
            .RequireAuthorization()
            .RequireCovePermission(
                PermissionMode.All,
                Permissions.SegmentsRead,
                ProvenanceReadPermission)
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.OwnedSegmentsRead);

        endpoints.MapGet(
                "/api/plugins/segment-studio/videos/{videoId:int}/segments/{segmentId:int}/provenance",
                async Task<IResult> (
                    int videoId,
                    int segmentId,
                    DbContext db,
                    [FromServices] IFieldProvenanceService? fieldProvenance,
                    ICurrentPrincipalAccessor principalAccessor,
                    Cove.Core.Auth.IAuthorizationService authorization,
                    CancellationToken ct) =>
                {
                    var access = await authorization.AuthorizeAsync(
                        principalAccessor.Current,
                        Permissions.SegmentsRead,
                        EntityRef.Of(EntityKinds.Video, videoId),
                        ct);
                    if (!access.Allowed)
                        return Results.Forbid();
                    if (!await db.Set<Segment>().AsNoTracking().AnyAsync(
                            segment =>
                                segment.Id == segmentId
                                && segment.HostType == SegmentHostType.Video
                                && segment.HostId == videoId
                                && segment.Kind == "tag",
                            ct))
                        return Results.NotFound();
                    return Results.Ok(fieldProvenance is null
                        ? []
                        : await fieldProvenance.GetForHostAsync(
                            AffinityHostType.Segment,
                            segmentId,
                            ct));
                })
            .RequireAuthorization()
            .RequireCovePermission(
                PermissionMode.All,
                Permissions.SegmentsRead,
                ProvenanceReadPermission)
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.NativeSegmentsRead);

        endpoints.MapPost(
                "/api/plugins/segment-studio/items/{itemId:long}/provenance",
                async (long itemId, SegmentProvenanceCreateRequest request, DbContext db,
                    ILineageNodeService nodes, ISegmentProvenanceService provenance,
                    ICurrentPrincipalAccessor principalAccessor,
                    Cove.Core.Auth.IAuthorizationService authorization,
                    CancellationToken ct) =>
                {
                    var videoId = await ResolveItemVideoIdAsync(db, itemId, ct);
                    if (videoId is null)
                        return Results.NotFound();
                    var access = await authorization.AuthorizeAsync(
                        principalAccessor.Current,
                        Permissions.SegmentsWrite,
                        EntityRef.Of(EntityKinds.Video, videoId.Value),
                        ct);
                    if (!access.Allowed)
                        return Results.Forbid();
                    try
                    {
                        await SegmentStudioRolloutService.EnsureWritesEnabledAsync(db, ct);
                    }
                    catch (LineageConflictException exception)
                    {
                        return Results.Conflict(new { code = exception.Code, error = exception.Message });
                    }
                    if (string.IsNullOrWhiteSpace(request.SourceKey))
                        return Results.BadRequest(new { error = "Source key cannot be empty." });
                    if (string.IsNullOrWhiteSpace(request.MetadataJson))
                        return Results.BadRequest(new { error = "Metadata is required." });
                    try
                    {
                        using var _ = System.Text.Json.JsonDocument.Parse(request.MetadataJson);
                    }
                    catch (System.Text.Json.JsonException)
                    {
                        return Results.BadRequest(new { error = "Metadata must be valid JSON." });
                    }
                    var sourceKey = request.SourceKey.Trim().ToLowerInvariant();
                    var source = await db.Set<SegmentStudioSource>()
                        .SingleOrDefaultAsync(candidate => candidate.Key == sourceKey, ct);
                    if (source is null)
                    {
                        return Results.Conflict(new
                        {
                            code = "PROVENANCE_SOURCE_UNKNOWN",
                            sourceKey,
                        });
                    }

                    try
                    {
                        var strategy = db.Database.CreateExecutionStrategy();
                        var firstAttempt = true;
                        var assertionId = await strategy.ExecuteAsync(async () =>
                        {
                            if (!firstAttempt) db.ChangeTracker.Clear();
                            firstAttempt = false;
                            await using var transaction = db.Database.IsRelational()
                                ? await db.Database.BeginTransactionAsync(ct)
                                : null;
                            var node = await nodes.EnsureAsync(db, itemId, ct);
                            var assertion = await provenance.AppendAsync(
                                db,
                                new SegmentProvenanceAppend(
                                    node.Id,
                                    source.Id,
                                    request.Relation,
                                    request.ActivityId,
                                    request.ModelKey,
                                    request.ModelIdentifier,
                                    request.ModelVersion,
                                    request.Confidence,
                                    request.RecordedAt,
                                    request.MetadataJson),
                                ct);
                            if (transaction is not null) await transaction.CommitAsync(ct);
                            return assertion.Id;
                        });
                        var result = (await provenance.GetForItemAsync(db, itemId, ct))
                            .Single(candidate => candidate.Id == assertionId);
                        return Results.Ok(result);
                    }
                    catch (ArgumentException exception)
                    {
                        return Results.BadRequest(new { error = exception.Message });
                    }
                })
            .RequireAuthorization()
            .RequireCovePermission(
                PermissionMode.All,
                Permissions.SegmentsWrite,
                ProvenanceManagePermission)
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.LineageManage);

        endpoints.MapGet(
                "/api/plugins/segment-studio/items/{itemId:long}/lineage",
                async (long itemId, DbContext db, IDerivationGraphService graph,
                    ILineageIntegrityService integrity,
                    ICurrentPrincipalAccessor principalAccessor,
                    Cove.Core.Auth.IAuthorizationService authorization,
                    CancellationToken ct) =>
                {
                    var videoId = await ResolveItemVideoIdAsync(db, itemId, ct);
                    if (videoId is null)
                        return Results.NotFound();
                    var access = await authorization.AuthorizeAsync(
                        principalAccessor.Current,
                        Permissions.SegmentsRead,
                        EntityRef.Of(EntityKinds.Video, videoId.Value),
                        ct);
                    if (!access.Allowed)
                        return Results.Forbid();
                    var lineage = await graph.GetLineageAsync(db, itemId, ct);
                    if (lineage.NodeId is null)
                        return Results.Ok(lineage);
                    var validation = await integrity.ValidateItemAsync(db, itemId, false, ct);
                    return Results.Ok(lineage with
                    {
                        IntegrityState = validation.Issues.Count == 0 ? "consistent" : "inconsistent",
                    });
                })
            .RequireAuthorization()
            .RequireCovePermission(
                PermissionMode.All,
                Permissions.SegmentsRead,
                ProvenanceReadPermission)
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.LineageManage);

        endpoints.MapGet(
                "/api/plugins/segment-studio/derivation-rules",
                async (DbContext db, CancellationToken ct) =>
                    Results.Ok(await DerivationRuleManagementService.LoadAsync(db, ct)))
            .RequireAuthorization()
            .RequireCovePermission(
                PermissionMode.All,
                Permissions.SegmentsRead,
                Permissions.TagsRead,
                ProvenanceReadPermission)
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.SettingsDerivation);

        endpoints.MapPut(
                "/api/plugins/segment-studio/derivation-rules",
                async (DerivationRuleSaveRequest request, DbContext db,
                    ICurrentPrincipalAccessor principalAccessor,
                    Cove.Core.Auth.IAuthorizationService authorization,
                    [FromServices] ISegmentSpanCacheInvalidator spanCacheInvalidator,
                    CancellationToken ct) =>
                {
                    try
                    {
                        if (request.RuleId is Guid ruleId)
                            await DerivationRuleLifecycleService.PreviewDeleteAsync(
                                db, ruleId, principalAccessor.Current, authorization, ct);
                        var saved = await DerivationRuleManagementService.SaveAsync(db, request, ct);
                        var rules = await DerivationRuleManagementService.LoadAsync(db, ct);
                        if (request.RuleId is not null)
                            spanCacheInvalidator.InvalidateAll();
                        return Results.Ok(rules.Single(rule => rule.Id == saved.Id));
                    }
                    catch (KeyNotFoundException)
                    {
                        return Results.NotFound();
                    }
                    catch (LineageConflictException exception)
                        when (exception.Code == "LINEAGE_PERMISSION_DENIED")
                    {
                        return Results.Forbid();
                    }
                    catch (LineageConflictException exception)
                    {
                        return Results.Conflict(new { code = exception.Code, error = exception.Message });
                    }
                    catch (ArgumentException exception)
                    {
                        return Results.BadRequest(new { error = exception.Message });
                    }
                })
            .RequireAuthorization()
            .RequireCovePermission(
                PermissionMode.All,
                Permissions.SegmentsWrite,
                Permissions.TagsRead,
                LineageManagePermission)
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.SettingsDerivation);

        endpoints.MapPost(
                "/api/plugins/segment-studio/derivation-rules/{ruleId:guid}/deletion/preview",
                async (Guid ruleId, DbContext db, ICurrentPrincipalAccessor principalAccessor,
                    Cove.Core.Auth.IAuthorizationService authorization, CancellationToken ct) =>
                {
                    try
                    {
                        return Results.Ok(await DerivationRuleLifecycleService.PreviewDeleteAsync(
                            db, ruleId, principalAccessor.Current, authorization, ct));
                    }
                    catch (KeyNotFoundException)
                    {
                        return Results.NotFound();
                    }
                    catch (LineageConflictException exception)
                        when (exception.Code == "LINEAGE_PERMISSION_DENIED")
                    {
                        return Results.Forbid();
                    }
                    catch (LineageConflictException exception)
                    {
                        return Results.Conflict(new { code = exception.Code, error = exception.Message });
                    }
                })
            .RequireAuthorization()
            .RequireCovePermission(
                PermissionMode.All,
                Permissions.SegmentsRead,
                Permissions.TagsRead,
                LineageManagePermission)
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.SettingsDerivation);

        endpoints.MapDelete(
                "/api/plugins/segment-studio/derivation-rules/{ruleId:guid}",
                async (Guid ruleId, [FromBody] DerivationRuleDeleteRequest request, DbContext db,
                    ICurrentPrincipalAccessor principalAccessor,
                    Cove.Core.Auth.IAuthorizationService authorization,
                    [FromServices] ISegmentSpanCacheInvalidator spanCacheInvalidator,
                    CancellationToken ct) =>
                {
                    try
                    {
                        var result = await DerivationRuleLifecycleService.DeleteAsync(
                            db, ruleId, request, principalAccessor.Current, authorization, ct);
                        spanCacheInvalidator.InvalidateAll();
                        return Results.Ok(result);
                    }
                    catch (KeyNotFoundException)
                    {
                        return Results.NotFound();
                    }
                    catch (LineageConflictException exception)
                        when (exception.Code == "LINEAGE_PERMISSION_DENIED")
                    {
                        return Results.Forbid();
                    }
                    catch (LineageConflictException exception)
                    {
                        return Results.Conflict(new { code = exception.Code, error = exception.Message });
                    }
                    catch (ArgumentException exception)
                    {
                        return Results.BadRequest(new { error = exception.Message });
                    }
                })
            .RequireAuthorization()
            .RequireCovePermission(
                PermissionMode.All,
                Permissions.SegmentsDelete,
                Permissions.TagsRead,
                LineageManagePermission)
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.SettingsDerivation);

        endpoints.MapPost(
                "/api/plugins/segment-studio/derivation-rules/{ruleId:guid}/materialization/preview",
                async (Guid ruleId, DbContext db, ICurrentPrincipalAccessor principalAccessor,
                    Cove.Core.Auth.IAuthorizationService authorization, CancellationToken ct) =>
                {
                    try
                    {
                        return Results.Ok(
                            await DerivationRuleLifecycleService.PreviewMaterializationAsync(
                                db, ruleId, principalAccessor.Current, authorization, ct));
                    }
                    catch (KeyNotFoundException)
                    {
                        return Results.NotFound();
                    }
                    catch (LineageConflictException exception)
                        when (exception.Code == "LINEAGE_PERMISSION_DENIED")
                    {
                        return Results.Forbid();
                    }
                    catch (LineageConflictException exception)
                    {
                        return Results.Conflict(new { code = exception.Code, error = exception.Message });
                    }
                })
            .RequireAuthorization()
            .RequireCovePermission(
                PermissionMode.All,
                Permissions.SegmentsRead,
                Permissions.TagsRead,
                LineageManagePermission)
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.SettingsDerivation);

        endpoints.MapPost(
                "/api/plugins/segment-studio/derivation-rules/{ruleId:guid}/materialize",
                async (Guid ruleId, DerivationRuleMaterializationRequest request, DbContext db,
                    ICurrentPrincipalAccessor principalAccessor,
                    Cove.Core.Auth.IAuthorizationService authorization,
                    [FromServices] ISegmentSpanCacheInvalidator spanCacheInvalidator,
                    CancellationToken ct) =>
                {
                    try
                    {
                        var result = await DerivationRuleLifecycleService.MaterializeAsync(
                            db, ruleId, request, principalAccessor.Current?.UserId,
                            principalAccessor.Current, authorization, ct);
                        spanCacheInvalidator.InvalidateAll();
                        return Results.Ok(result);
                    }
                    catch (KeyNotFoundException)
                    {
                        return Results.NotFound();
                    }
                    catch (LineageConflictException exception)
                        when (exception.Code == "LINEAGE_PERMISSION_DENIED")
                    {
                        return Results.Forbid();
                    }
                    catch (LineageConflictException exception)
                    {
                        return Results.Conflict(new { code = exception.Code, error = exception.Message });
                    }
                    catch (ArgumentException exception)
                    {
                        return Results.BadRequest(new { error = exception.Message });
                    }
                })
            .RequireAuthorization()
            .RequireCovePermission(
                PermissionMode.All,
                Permissions.SegmentsWrite,
                Permissions.TagsRead,
                LineageManagePermission)
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.SettingsDerivation);

        endpoints.MapPost(
                "/api/plugins/segment-studio/videos/{videoId:int}/derived-segments/preview",
                async (int videoId, DerivedSegmentMaterializationPreviewRequest request, DbContext db,
                    ICurrentPrincipalAccessor principalAccessor,
                    Cove.Core.Auth.IAuthorizationService authorization,
                    CancellationToken ct) =>
                {
                    var access = await authorization.AuthorizeAsync(
                        principalAccessor.Current,
                        Permissions.SegmentsRead,
                        EntityRef.Of(EntityKinds.Video, videoId),
                        ct);
                    if (!access.Allowed) return Results.Forbid();
                    try
                    {
                        return Results.Ok(await DerivedSegmentMaterializationService.PreviewAsync(
                            db, videoId, request.MaxDepth, ct));
                    }
                    catch (LineageConflictException exception)
                    {
                        return Results.Conflict(new { code = exception.Code, error = exception.Message });
                    }
                })
            .RequireAuthorization()
            .RequireCovePermission(
                PermissionMode.All,
                Permissions.SegmentsRead,
                Permissions.TagsRead,
                ProvenanceReadPermission)
            .RequireCoveEntityAccess(EntityKinds.Video, "videoId", Permissions.VideosRead)
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.SettingsDerivation);

        endpoints.MapPost(
                "/api/plugins/segment-studio/videos/{videoId:int}/derived-segments/materialize",
                async (int videoId, DerivedSegmentMaterializationRequest request, DbContext db,
                    ICurrentPrincipalAccessor principalAccessor,
                    Cove.Core.Auth.IAuthorizationService authorization,
                    [FromServices] ISegmentSpanCacheInvalidator spanCacheInvalidator,
                    CancellationToken ct) =>
                {
                    var access = await authorization.AuthorizeAsync(
                        principalAccessor.Current,
                        Permissions.SegmentsWrite,
                        EntityRef.Of(EntityKinds.Video, videoId),
                        ct);
                    if (!access.Allowed) return Results.Forbid();
                    try
                    {
                        var result = await DerivedSegmentMaterializationService.ExecuteAsync(
                            db,
                            videoId,
                            request,
                            principalAccessor.Current?.UserId,
                            ct);
                        spanCacheInvalidator.InvalidateVideo(videoId);
                        return Results.Ok(result);
                    }
                    catch (LineageConflictException exception)
                    {
                        return Results.Conflict(new { code = exception.Code, error = exception.Message });
                    }
                    catch (ArgumentException exception)
                    {
                        return Results.BadRequest(new { error = exception.Message });
                    }
                })
            .RequireAuthorization()
            .RequireCovePermission(
                PermissionMode.All,
                Permissions.SegmentsWrite,
                Permissions.TagsRead,
                LineageManagePermission)
            .RequireCoveEntityAccess(EntityKinds.Video, "videoId", Permissions.SegmentsWrite)
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.SettingsDerivation);

        endpoints.MapPost(
                "/api/plugins/segment-studio/items/{itemId:long}/derive",
                async (long itemId, DeriveSegmentRequest request, DbContext db,
                    ILineageMutationService lineage,
                    ICurrentPrincipalAccessor principalAccessor,
                    Cove.Core.Auth.IAuthorizationService authorization,
                    CancellationToken ct) =>
                {
                    var videoId = await ResolveItemVideoIdAsync(db, itemId, ct);
                    if (videoId is null)
                        return Results.NotFound();
                    var access = await authorization.AuthorizeAsync(
                        principalAccessor.Current,
                        Permissions.SegmentsWrite,
                        EntityRef.Of(EntityKinds.Video, videoId.Value),
                        ct);
                    if (!access.Allowed)
                        return Results.Forbid();
                    try
                    {
                        var result = await lineage.DeriveAsync(
                            db,
                            itemId,
                            request,
                            principalAccessor.Current?.UserId,
                            ct);
                        return Results.Ok(result);
                    }
                    catch (KeyNotFoundException)
                    {
                        return Results.NotFound();
                    }
                    catch (LineageConflictException exception)
                    {
                        return Results.Conflict(new { code = exception.Code, error = exception.Message });
                    }
                    catch (ArgumentException exception)
                    {
                        return Results.BadRequest(new { error = exception.Message });
                    }
                })
            .RequireAuthorization()
            .RequireCovePermission(
                PermissionMode.All,
                Permissions.SegmentsWrite,
                LineageManagePermission)
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.LineageManage);

        endpoints.MapPost(
                "/api/plugins/segment-studio/items/{itemId:long}/tag-change/preview",
                async (long itemId, TagChangePreviewRequest request, DbContext db,
                    ILineageReconciliationService reconciliation,
                    ICurrentPrincipalAccessor principalAccessor,
                    Cove.Core.Auth.IAuthorizationService authorization,
                    CancellationToken ct) =>
                {
                    var videoId = await ResolveItemVideoIdAsync(db, itemId, ct);
                    if (videoId is null)
                        return Results.NotFound();
                    var access = await authorization.AuthorizeAsync(
                        principalAccessor.Current,
                        Permissions.SegmentsWrite,
                        EntityRef.Of(EntityKinds.Video, videoId.Value),
                        ct);
                    if (!access.Allowed)
                        return Results.Forbid();
                    try
                    {
                        return Results.Ok(await reconciliation.PreviewAsync(db, itemId, request, ct));
                    }
                    catch (KeyNotFoundException)
                    {
                        return Results.NotFound();
                    }
                    catch (LineageConflictException exception)
                    {
                        return Results.Conflict(new { code = exception.Code, error = exception.Message });
                    }
                    catch (ArgumentException exception)
                    {
                        return Results.BadRequest(new { error = exception.Message });
                    }
                })
            .RequireAuthorization()
            .RequireCovePermission(
                PermissionMode.All,
                Permissions.SegmentsWrite,
                LineageManagePermission)
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.LineageManage);

        endpoints.MapPost(
                "/api/plugins/segment-studio/items/{itemId:long}/tag-change/execute",
                async (long itemId, TagChangeExecuteRequest request, DbContext db,
                    ILineageReconciliationService reconciliation,
                    [FromServices] ISegmentSpanCacheInvalidator spanCacheInvalidator,
                    ICurrentPrincipalAccessor principalAccessor,
                    Cove.Core.Auth.IAuthorizationService authorization,
                    CancellationToken ct) =>
                {
                    var videoId = await ResolveItemVideoIdAsync(db, itemId, ct);
                    if (videoId is null)
                        return Results.NotFound();
                    var access = await authorization.AuthorizeAsync(
                        principalAccessor.Current,
                        Permissions.SegmentsWrite,
                        EntityRef.Of(EntityKinds.Video, videoId.Value),
                        ct);
                    if (!access.Allowed)
                        return Results.Forbid();
                    var slotAccess = await SegmentStudioAuthorization.AuthorizePerformerSlotReadAsync(
                        principalAccessor.Current, authorization, ct);
                    try
                    {
                        if (await db.Set<SegmentStudioSegmentOperation>().AsNoTracking()
                            .AnyAsync(operation => operation.OperationId == request.OperationId, ct))
                        {
                            var replay = await reconciliation.ExecuteAsync(
                                db, itemId, request, principalAccessor.Current?.UserId, ct,
                                autoAssignMissingSlots: slotAccess.Allowed);
                            PublishSegmentInvalidation(spanCacheInvalidator, videoId.Value);
                            return Results.Ok(replay);
                        }
                        await SegmentStudioRolloutService.EnsureWritesEnabledAsync(db, ct);
                        var preview = await reconciliation.PreviewAsync(
                            db,
                            itemId,
                            new TagChangePreviewRequest(request.ExpectedRevision, request.TagId),
                            ct);
                        if (preview.DeletedItemIds.Count > 0)
                        {
                            var deleteAccess = await authorization.AuthorizeAsync(
                                principalAccessor.Current,
                                Permissions.SegmentsDelete,
                                EntityRef.Of(EntityKinds.Video, videoId.Value),
                                ct);
                            if (!deleteAccess.Allowed)
                                return Results.Forbid();
                        }
                        var result = await reconciliation.ExecuteAsync(
                            db, itemId, request, principalAccessor.Current?.UserId, ct,
                            autoAssignMissingSlots: slotAccess.Allowed);
                        PublishSegmentInvalidation(spanCacheInvalidator, videoId.Value);
                        return Results.Ok(result);
                    }
                    catch (KeyNotFoundException)
                    {
                        return Results.NotFound();
                    }
                    catch (LineageConflictException exception)
                    {
                        return Results.Conflict(new { code = exception.Code, error = exception.Message });
                    }
                    catch (ArgumentException exception)
                    {
                        return Results.BadRequest(new { error = exception.Message });
                    }
                })
            .RequireAuthorization()
            .RequireCovePermission(
                PermissionMode.All,
                Permissions.SegmentsWrite,
                LineageManagePermission)
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.LineageManage);

        endpoints.MapPost(
                "/api/plugins/segment-studio/items/{itemId:long}/delete/preview",
                async (long itemId, SegmentDependencyDeletePreviewRequest request, DbContext db,
                    ISegmentLineageDeletionService deletion,
                    ICurrentPrincipalAccessor principalAccessor,
                    Cove.Core.Auth.IAuthorizationService authorization,
                    CancellationToken ct) =>
                {
                    try
                    {
                        return Results.Ok(await deletion.PreviewAsync(
                            db, itemId, request, principalAccessor.Current, authorization, ct));
                    }
                    catch (KeyNotFoundException)
                    {
                        return Results.NotFound();
                    }
                    catch (LineageConflictException exception)
                    {
                        return Results.Conflict(new { code = exception.Code, error = exception.Message });
                    }
                })
            .RequireAuthorization()
            .RequireCovePermission(
                PermissionMode.All,
                Permissions.SegmentsDelete,
                LineageManagePermission)
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.WorkflowDeletionManage);

        endpoints.MapPost(
                "/api/plugins/segment-studio/items/{itemId:long}/delete/execute",
                async (long itemId, SegmentDependencyDeleteExecuteRequest request, DbContext db,
                    ISegmentLineageDeletionService deletion,
                    ICurrentPrincipalAccessor principalAccessor,
                    Cove.Core.Auth.IAuthorizationService authorization,
                    [FromServices] ISegmentSpanCacheInvalidator spanCacheInvalidator,
                    CancellationToken ct) =>
                {
                    try
                    {
                        var result = await deletion.ExecuteAsync(
                            db, itemId, request, principalAccessor.Current, authorization, ct);
                        spanCacheInvalidator.InvalidateAll();
                        return Results.Ok(result);
                    }
                    catch (KeyNotFoundException)
                    {
                        return Results.NotFound();
                    }
                    catch (LineageConflictException exception)
                    {
                        return Results.Conflict(new { code = exception.Code, error = exception.Message });
                    }
                    catch (ArgumentException exception)
                    {
                        return Results.BadRequest(new { error = exception.Message });
                    }
                })
            .RequireAuthorization()
            .RequireCovePermission(
                PermissionMode.All,
                Permissions.SegmentsDelete,
                LineageManagePermission)
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.WorkflowDeletionManage);

        endpoints.MapPost(
                "/api/plugins/segment-studio/maintenance/provenance/cove-ai/ingest",
                async (NativeAiIngestionRequest request, DbContext db,
                    INativeAiProvenanceIngestionService ingestion,
                    CancellationToken ct) =>
                {
                    try
                    {
                        return Results.Ok(await ingestion.IngestAsync(db, request, ct));
                    }
                    catch (ArgumentOutOfRangeException exception)
                    {
                        return Results.BadRequest(new { error = exception.Message });
                    }
                    catch (LineageConflictException exception)
                    {
                        return Results.Conflict(new { code = exception.Code, error = exception.Message });
                    }
                })
            .RequireAuthorization()
            .RequireCovePermission(
                PermissionMode.All,
                ProvenanceManagePermission,
                LineageMaintenancePermission,
                Permissions.AiRunsRead);

        endpoints.MapPost(
                "/api/plugins/segment-studio/maintenance/lineage/scans",
                async (DbContext db, ILineageIntegrityService integrity,
                    ICurrentPrincipalAccessor principalAccessor, CancellationToken ct) =>
                {
                    var run = await integrity.RunFullScanAsync(
                        db, principalAccessor.Current?.UserId, 250, ct);
                    return Results.Accepted(
                        $"/api/plugins/segment-studio/maintenance/lineage/scans/{run.Id}",
                        run);
                })
            .RequireAuthorization()
            .RequireCovePermission(LineageMaintenancePermission);

        endpoints.MapGet(
                "/api/plugins/segment-studio/maintenance/lineage/scans/{scanId:guid}",
                async (Guid scanId, DbContext db, CancellationToken ct) =>
                {
                    var run = await db.Set<SegmentStudioLineageScanRun>().AsNoTracking()
                        .SingleOrDefaultAsync(candidate => candidate.Id == scanId, ct);
                    return run is null ? Results.NotFound() : Results.Ok(run);
                })
            .RequireAuthorization()
            .RequireCovePermission(LineageMaintenancePermission);

        endpoints.MapGet(
                "/api/plugins/segment-studio/maintenance/lineage/issues",
                async (HttpRequest request, DbContext db,
                    ILineageIntegrityService integrity, CancellationToken ct) =>
                {
                    var page = int.TryParse(request.Query["page"], out var parsedPage)
                        ? parsedPage
                        : 1;
                    var perPage = int.TryParse(request.Query["perPage"], out var parsedPerPage)
                        ? parsedPerPage
                        : 50;
                    return Results.Ok(await integrity.ListIssuesAsync(
                        db, page, perPage, ct));
                })
            .RequireAuthorization()
            .RequireCovePermission(LineageMaintenancePermission);

        endpoints.MapPost(
                "/api/plugins/segment-studio/maintenance/lineage/issues/{issueId:guid}/repair/preview",
                async (Guid issueId, string action, DbContext db,
                    ILineageIntegrityService integrity, CancellationToken ct) =>
                {
                    try
                    {
                        return Results.Ok(await integrity.PreviewRepairAsync(db, issueId, action, ct));
                    }
                    catch (KeyNotFoundException)
                    {
                        return Results.NotFound();
                    }
                    catch (ArgumentException exception)
                    {
                        return Results.BadRequest(new { error = exception.Message });
                    }
                    catch (LineageConflictException exception)
                    {
                        return Results.Conflict(new { code = exception.Code, error = exception.Message });
                    }
                })
            .RequireAuthorization()
            .RequireCovePermission(
                PermissionMode.All,
                LineageMaintenancePermission,
                LineageManagePermission);

        endpoints.MapPost(
                "/api/plugins/segment-studio/maintenance/lineage/issues/{issueId:guid}/repair/execute",
                async (Guid issueId, LineageRepairExecuteRequest request, DbContext db,
                    ILineageIntegrityService integrity,
                    ICurrentPrincipalAccessor principalAccessor,
                    Cove.Core.Auth.IAuthorizationService authorization,
                    [FromServices] ISegmentSpanCacheInvalidator spanCacheInvalidator,
                    CancellationToken ct) =>
                {
                    try
                    {
                        await integrity.ExecuteRepairAsync(
                            db, issueId, request, principalAccessor.Current, authorization, ct);
                        spanCacheInvalidator.InvalidateAll();
                        return Results.Ok(new { issueId, request.Action });
                    }
                    catch (KeyNotFoundException)
                    {
                        return Results.NotFound();
                    }
                    catch (ArgumentException exception)
                    {
                        return Results.BadRequest(new { error = exception.Message });
                    }
                    catch (LineageConflictException exception)
                    {
                        return Results.Conflict(new { code = exception.Code, error = exception.Message });
                    }
                })
            .RequireAuthorization()
            .RequireCovePermission(
                PermissionMode.All,
                LineageMaintenancePermission,
                LineageManagePermission);

        endpoints.MapGet(
                "/api/plugins/segment-studio/segment-groups",
                async (DbContext db, ICurrentPrincipalAccessor principalAccessor,
                    Cove.Core.Auth.IAuthorizationService authorization, CancellationToken ct) =>
                {
                    var access = await SegmentStudioAuthorization.AuthorizeSegmentGroupReadAsync(
                        principalAccessor.Current, authorization, ct);
                    if (!access.Allowed)
                        return Results.Json(new { error = access.Reason ?? "You cannot view Segment groups." }, statusCode: StatusCodes.Status403Forbidden);
                    return Results.Ok(await SegmentGroupService.ListAsync(db, ct));
                })
            .RequireAuthorization()
            .RequireCovePermission(PermissionMode.All, Permissions.SegmentsRead, Permissions.TagsRead)
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.SegmentGroupsManage);

        endpoints.MapPost(
                "/api/plugins/segment-studio/segment-groups",
                async (SegmentGroupCreateRequest request, DbContext db, ICurrentPrincipalAccessor principalAccessor,
                    Cove.Core.Auth.IAuthorizationService authorization, CancellationToken ct) =>
                {
                    var access = await SegmentStudioAuthorization.AuthorizeSegmentGroupWriteAsync(
                        principalAccessor.Current, authorization, ct);
                    if (!access.Allowed)
                        return Results.Json(new { error = access.Reason ?? "You cannot change Segment groups." }, statusCode: StatusCodes.Status403Forbidden);
                    try
                    {
                        return Results.Ok(await SegmentGroupService.CreateAsync(db, request.Name, ct));
                    }
                    catch (ArgumentException exception)
                    {
                        return Results.BadRequest(new { error = exception.Message });
                    }
                    catch (InvalidOperationException exception)
                    {
                        return Results.Conflict(new { error = exception.Message });
                    }
                    catch (DbUpdateException)
                    {
                        return Results.Conflict(new { error = "Segment groups changed concurrently. Reload and try again." });
                    }
                })
            .RequireAuthorization()
            .RequireCovePermission(PermissionMode.All, Permissions.SegmentsWrite, Permissions.TagsRead)
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.SegmentGroupsManage);

        endpoints.MapPut(
                "/api/plugins/segment-studio/segment-groups/{groupId:long}",
                async (long groupId, SegmentGroupUpdateRequest request, DbContext db,
                    ICurrentPrincipalAccessor principalAccessor, Cove.Core.Auth.IAuthorizationService authorization,
                    CancellationToken ct) =>
                {
                    var access = await SegmentStudioAuthorization.AuthorizeSegmentGroupWriteAsync(
                        principalAccessor.Current, authorization, ct);
                    if (!access.Allowed)
                        return Results.Json(new { error = access.Reason ?? "You cannot change Segment groups." }, statusCode: StatusCodes.Status403Forbidden);
                    SegmentGroupMutationResult result;
                    try
                    {
                        result = await SegmentGroupService.UpdateAsync(db, groupId, request, ct);
                    }
                    catch (DbUpdateException)
                    {
                        return Results.Conflict(new { error = "Segment groups changed concurrently. Reload and try again." });
                    }
                    return result.Status switch
                    {
                        SegmentGroupMutationStatus.Updated => Results.Ok(result.Group),
                        SegmentGroupMutationStatus.Invalid => Results.BadRequest(new { error = result.Error }),
                        SegmentGroupMutationStatus.Conflict => Results.Conflict(new { error = result.Error }),
                        _ => Results.NotFound(new { error = result.Error }),
                    };
                })
            .RequireAuthorization()
            .RequireCovePermission(PermissionMode.All, Permissions.SegmentsWrite, Permissions.TagsRead)
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.SegmentGroupsManage);

        endpoints.MapPut(
                "/api/plugins/segment-studio/segment-groups/order",
                async (SegmentGroupReorderRequest request, DbContext db, ICurrentPrincipalAccessor principalAccessor,
                    Cove.Core.Auth.IAuthorizationService authorization, CancellationToken ct) =>
                {
                    var access = await SegmentStudioAuthorization.AuthorizeSegmentGroupWriteAsync(
                        principalAccessor.Current, authorization, ct);
                    if (!access.Allowed)
                        return Results.Json(new { error = access.Reason ?? "You cannot change Segment groups." }, statusCode: StatusCodes.Status403Forbidden);
                    SegmentGroupMutationResult result;
                    try
                    {
                        result = await SegmentGroupService.ReorderAsync(db, request.GroupIds, ct);
                    }
                    catch (DbUpdateException)
                    {
                        return Results.Conflict(new { error = "Segment groups changed concurrently. Reload and try again." });
                    }
                    return result.Status == SegmentGroupMutationStatus.Updated
                        ? Results.NoContent()
                        : Results.BadRequest(new { error = result.Error });
                })
            .RequireAuthorization()
            .RequireCovePermission(PermissionMode.All, Permissions.SegmentsWrite, Permissions.TagsRead)
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.SegmentGroupsManage);

        endpoints.MapDelete(
                "/api/plugins/segment-studio/segment-groups/{groupId:long}",
                async (long groupId, DbContext db, ICurrentPrincipalAccessor principalAccessor,
                    Cove.Core.Auth.IAuthorizationService authorization, CancellationToken ct) =>
                {
                    var access = await SegmentStudioAuthorization.AuthorizeSegmentGroupWriteAsync(
                        principalAccessor.Current, authorization, ct);
                    if (!access.Allowed)
                        return Results.Json(new { error = access.Reason ?? "You cannot change Segment groups." }, statusCode: StatusCodes.Status403Forbidden);
                    try
                    {
                        return await SegmentGroupService.DeleteAsync(db, groupId, ct)
                            ? Results.NoContent()
                            : Results.NotFound(new { error = "Segment group not found." });
                    }
                    catch (DbUpdateException)
                    {
                        return Results.Conflict(new { error = "Segment groups changed concurrently. Reload and try again." });
                    }
                })
            .RequireAuthorization()
            .RequireCovePermission(PermissionMode.All, Permissions.SegmentsWrite, Permissions.TagsRead)
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.SegmentGroupsManage);

        endpoints.MapGet(
                "/api/plugins/segment-studio/videos",
                async (HttpRequest request, DbContext db, ICurrentPrincipalAccessor principalAccessor,
                    Cove.Core.Auth.IAuthorizationService authorization, CancellationToken ct) =>
                {
                    if (principalAccessor.Current?.UserId is not int userId)
                        return Results.Unauthorized();
                    var access = await SegmentStudioAuthorization.AuthorizeReadAsync(
                        principalAccessor.Current, authorization, videoId: null, ct);
                    if (!access.Allowed)
                        return Results.Json(new { error = access.Reason ?? "You cannot view segments." }, statusCode: StatusCodes.Status403Forbidden);
                    var profile = await SegmentStudioFeatureProfileService.GetAsync(
                        db, userId, ct);
                    var fullWorkflow = profile.Has(
                        SegmentStudioCapabilities.SegmentReview);
                    var query = ParseDiscoveryQuery(
                        request.Query,
                        fullWorkflow,
                        profile.LegacyCompatibilityRequired);
                    var result = await VideoDiscoveryService.FindAsync(db, query, ct);
                    if (!fullWorkflow)
                    {
                        return Results.Ok(new
                        {
                            items = result.Items.Select(item => new
                            {
                                item.VideoId,
                                item.Title,
                                item.Details,
                                item.Date,
                                item.Organized,
                                item.IsVr,
                                item.Duration,
                                item.CreatedAt,
                                item.UpdatedAt,
                                item.SegmentCount,
                            }),
                            result.TotalCount,
                            result.Page,
                            result.PerPage,
                        });
                    }
                    return Results.Ok(result);
                })
            .RequireAuthorization()
            .RequireCovePermission(Permissions.SegmentsRead)
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.NavigationVideos);

        endpoints.MapGet(
                "/api/plugins/segment-studio/videos/{videoId:int}/editor",
                async (int videoId, DbContext db, ICurrentPrincipalAccessor principalAccessor,
                    Cove.Core.Auth.IAuthorizationService authorization, CancellationToken ct) =>
                {
                    if (principalAccessor.Current?.UserId is not int userId)
                        return Results.Unauthorized();
                    var profile = await SegmentStudioFeatureProfileService.GetAsync(
                        db, userId, ct);
                    var fullWorkflow = profile.Has(
                        SegmentStudioCapabilities.OwnedSegmentsRead);
                    var video = await db.Set<Video>()
                        .AsNoTracking()
                        .Where(candidate => candidate.Id == videoId)
                        .Select(candidate => new SegmentStudioEditorVideo(
                            candidate.Id,
                            candidate.Title ?? candidate.FileSearchText,
                            candidate.UpdatedAt,
                            db.Set<VideoFile>()
                                .Where(file => file.VideoId == (candidate.ParentVideoId ?? candidate.Id))
                                .OrderBy(file => file.Id)
                                .Select(file => new SegmentStudioVideoFile(
                                    file.Format,
                                    file.Duration,
                                    file.AudioCodec,
                                    file.FrameRate))
                                .FirstOrDefault()))
                        .SingleOrDefaultAsync(ct);
                    if (video is null)
                        return Results.NotFound(new { error = "Video not found." });
                    var access = await SegmentStudioAuthorization.AuthorizeReadAsync(
                        principalAccessor.Current, authorization, videoId, ct);
                    if (!access.Allowed)
                        return Results.Json(new { error = access.Reason ?? "You cannot view segments for this video." }, statusCode: StatusCodes.Status403Forbidden);
                    var provenanceAccess = await authorization.AuthorizeAsync(
                        principalAccessor.Current,
                        ProvenanceReadPermission,
                        entity: null,
                        ct);
                    if (!fullWorkflow)
                    {
                        var basicRows = await db.Set<Segment>()
                            .AsNoTracking()
                            .Where(segment =>
                                segment.HostType == SegmentHostType.Video
                                && segment.HostId == videoId
                                && segment.Kind == "tag"
                                && segment.TagId != null)
                            .OrderBy(segment => segment.StartSec)
                            .ThenBy(segment => segment.Id)
                            .Select(segment => new SegmentStudioBasicEditorRow(
                                segment.Id,
                                videoId,
                                segment.TagId!.Value,
                                segment.Tag != null ? segment.Tag.Name : null,
                                segment.StartSec,
                                segment.EndSec,
                                segment.Kind,
                                segment.RefId,
                                segment.Payload,
                                segment.UpdatedAt,
                                segment.SourceKey,
                                segment.SourceRunId,
                                segment.Confidence,
                                segment.Title,
                                segment.ColorHint,
                                segment.ImageBlobId,
                                segment.CreatedAt))
                            .ToListAsync(ct);
                        var basicIds = basicRows.Select(row => row.Id).ToArray();
                        var fieldProvenance = !provenanceAccess.Allowed
                            || db.Model.FindEntityType(typeof(FieldProvenance)) is null
                            ? []
                            : await db.Set<FieldProvenance>().AsNoTracking()
                                .Where(row =>
                                    row.HostType == AffinityHostType.Segment
                                    && basicIds.Contains(row.HostId))
                                .OrderBy(row => row.Id)
                                .Select(row =>
                                    new SegmentStudioBasicFieldProvenance(
                                        row.HostId,
                                        row.FieldKey,
                                        row.ValueJson,
                                        row.SourceKey,
                                        row.SourceRunId,
                                        row.ModelKey,
                                        row.Confidence,
                                        row.CreatedAt,
                                        row.UpdatedAt))
                                .ToListAsync(ct);
                        var provenanceBySegment = fieldProvenance
                            .ToLookup(row => row.NativeSegmentId);
                        var basicSegments = basicRows.Select(segment =>
                            new SegmentStudioBasicEditorItem(
                                $"native:{segment.Id}",
                                segment.Id,
                                segment.Id,
                                segment.VideoId,
                                segment.TagId,
                                segment.TagName,
                                segment.StartSec,
                                segment.EndSec,
                                segment.Kind ?? "tag",
                                segment.RefId?.ToString(),
                                segment.Payload?.RootElement.GetRawText(),
                                segment.UpdatedAt,
                                segment.SourceKey,
                                segment.SourceRunId,
                                segment.Confidence,
                                segment.Title,
                                segment.ColorHint,
                                segment.ImageBlobId,
                                segment.CreatedAt,
                                provenanceBySegment[segment.Id].ToArray()))
                            .ToList();
                        var basicSegmentGroups =
                            await SegmentGroupService.ListForTagsAsync(
                                db,
                                basicSegments.Select(segment => segment.TagId)
                                    .Distinct()
                                    .ToArray(),
                                ct);
                        return Results.Ok(new SegmentStudioBasicEditorResponse(
                            SegmentStudioModes.Basic,
                            video,
                            basicSegments,
                            basicSegmentGroups,
                            provenanceAccess.Allowed));
                    }

                    var rows = await db.Set<Segment>()
                        .AsNoTracking()
                        .Where(segment =>
                            segment.HostType == SegmentHostType.Video
                            && segment.HostId == videoId
                            && segment.Kind == "tag"
                            && segment.TagId != null)
                        .OrderBy(segment => segment.StartSec)
                        .ThenBy(segment => segment.Id)
                        .Select(segment => new SegmentStudioEditorRow(
                            segment.Id,
                            segment.TagId!.Value,
                            segment.Tag != null ? segment.Tag.Name : null,
                            segment.StartSec,
                            segment.EndSec,
                            segment.Payload,
                            segment.UpdatedAt,
                            segment.SourceKey,
                            segment.SourceRunId,
                            segment.Confidence))
                        .ToListAsync(ct);

                    var performerAccess =
                        await SegmentStudioAuthorization.AuthorizePerformerSlotReadAsync(
                            principalAccessor.Current, authorization, ct);
                    var anchors = await db.Set<SegmentStudioItem>().AsNoTracking()
                        .Where(item => item.NativeSegmentId != null
                            && rows.Select(row => row.Id).Contains(item.NativeSegmentId.Value))
                        .ToDictionaryAsync(
                            item => item.NativeSegmentId!.Value,
                            item => (long?)item.Id,
                            ct);
                    var segments = rows
                        .Where(row => anchors.ContainsKey(row.Id))
                        .Select(row => new SegmentStudioEditorItem(
                        $"native:{row.Id}",
                        row.Id,
                        anchors.GetValueOrDefault(row.Id),
                        row.Id,
                        videoId,
                        row.TagId,
                        row.TagName,
                        row.StartSec,
                        row.EndSec,
                        "approved",
                        "native",
                        true,
                        0,
                        row.UpdatedAt,
                        row.SourceKey,
                        row.SourceRunId,
                        row.Confidence)).ToList();
                    {
                        var owned = await (
                                from item in db.Set<SegmentStudioItem>().AsNoTracking()
                                join tag in db.Set<Tag>().AsNoTracking() on item.TagId equals tag.Id
                                where item.NativeSegmentId == null
                                    && item.VideoId == videoId
                                    && item.ReviewState != null
                                select new SegmentStudioEditorItem(
                                    $"item:{item.Id}",
                                    -item.Id,
                                    item.Id,
                                    null,
                                    videoId,
                                    item.TagId!.Value,
                                    tag.Name,
                                    item.StartSec!.Value,
                                    item.EndSec,
                                    item.ReviewState!,
                                    "extension",
                                    false,
                                    item.Revision,
                                    item.UpdatedAt,
                                    item.SourceKey!,
                                    item.SourceRunId,
                                    item.Confidence))
                            .ToListAsync(ct);
                        segments.AddRange(owned);
                        segments = segments.OrderBy(segment => segment.StartSec)
                            .ThenBy(segment => segment.Key, StringComparer.Ordinal)
                            .ToList();
                    }
                    var editorItemIds = segments
                        .Where(segment => segment.ItemId != null)
                        .Select(segment => segment.ItemId!.Value)
                        .ToArray();
                    var derivedItemIds = await DerivedTagGuard.LoadDerivedItemIdsAsync(
                        db, editorItemIds, ct);
                    segments = segments
                        .Select(segment => segment with
                        {
                            IsDerived = segment.ItemId is long itemId && derivedItemIds.Contains(itemId),
                        })
                        .ToList();
                    var segmentGroups = await SegmentGroupService.ListForTagsAsync(
                        db, segments.Select(segment => segment.TagId).Distinct().ToArray(), ct);
                    var nativeTagIds = segments
                        .Where(segment => segment.NativeSegmentId != null)
                        .ToDictionary(segment => segment.NativeSegmentId!.Value, segment => segment.TagId);
                    var ownedTagIds = segments
                        .Where(segment => segment.NativeSegmentId == null && segment.ItemId != null)
                        .ToDictionary(segment => segment.ItemId!.Value, segment => segment.TagId);
                    var performerSlots = performerAccess.Allowed
                        ? await PerformerSlotEditorService.LoadUnifiedAsync(
                            db, nativeTagIds, ownedTagIds, ct)
                        : [];
                    var performerSlotRevisions = performerAccess.Allowed
                        ? await PerformerSlotMutationService.LoadUnifiedAssignmentRevisionsAsync(
                            db, nativeTagIds, ownedTagIds, performerSlots, ct)
                        : new Dictionary<long, string>();
                    var performerCandidates = performerAccess.Allowed
                        ? await PerformerSlotEditorService.LoadCandidatesAsync(db, videoId, ct)
                        : [];
                    var shotBoundaries = await ShotBoundaryService.ListAsync(db, videoId, ct);
                    var itemMetadata = provenanceAccess.Allowed
                        ? await SegmentEditorMetadataService.LoadAsync(
                            db,
                            videoId,
                            editorItemIds,
                            provenanceAccess.Allowed,
                            provenanceAccess.Allowed,
                            ct)
                        : new Dictionary<long, SegmentEditorItemMetadata>();
                    return Results.Ok(new SegmentStudioEditorResponse(
                        SegmentStudioModes.Full,
                        video,
                        segments,
                        shotBoundaries,
                        segmentGroups,
                        performerSlots,
                        performerSlotRevisions,
                        performerCandidates,
                        performerAccess.Allowed,
                        provenanceAccess.Allowed,
                        provenanceAccess.Allowed,
                        itemMetadata,
                        fullWorkflow
                            ? await SegmentStudioReviewCompletionService.GetApprovedSetVersionAsync(db, videoId, ct)
                            : null,
                        fullWorkflow ? rows.Count(row => !anchors.ContainsKey(row.Id)) : 0));
                })
            .RequireAuthorization()
            .RequireCovePermission(Permissions.SegmentsRead)
            .RequireCoveEntityAccess(EntityKinds.Video, "videoId", Permissions.VideosRead)
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.NativeSegmentsRead);

        endpoints.MapPost(
                "/api/plugins/segment-studio/videos/{videoId:int}/native-segments/import",
                async Task<IResult> (int videoId, NativeSegmentImportRequest request, DbContext db,
                    ICurrentPrincipalAccessor principalAccessor,
                    Cove.Core.Auth.IAuthorizationService authorization,
                    [FromServices] IBlobService blobs,
                    [FromServices] INativeSegmentImportService importer,
                    [FromServices] ISegmentSpanCacheInvalidator spanCacheInvalidator,
                    CancellationToken ct) =>
                {
                    if (await SegmentStudioCompatibilityService.RequiresLegacyUiAsync(db, ct))
                        return LegacyUiRequiredResult();
                    try
                    {
                        var strategy = db.Database.CreateExecutionStrategy();
                        var result = await strategy.ExecuteAsync(async () =>
                        {
                            await using var transaction = db.Database.IsRelational()
                                ? await db.Database.BeginTransactionAsync(ct)
                                : null;
                            var imported = await importer.ImportAsync(
                                db, videoId, request, principalAccessor.Current,
                                authorization, blobs, ct);
                            await SegmentStudioHistoryService.ClearVideoAsync(db, videoId, ct);
                            if (transaction is not null)
                                await transaction.CommitAsync(ct);
                            return imported;
                        });
                        PublishSegmentInvalidation(spanCacheInvalidator, videoId);
                        return Results.Ok(result);
                    }
                    catch (ArgumentException exception)
                    {
                        return Results.BadRequest(new { error = exception.Message });
                    }
                    catch (UnauthorizedAccessException exception)
                    {
                        return Results.Json(new { error = exception.Message }, statusCode: StatusCodes.Status403Forbidden);
                    }
                    catch (InvalidOperationException exception)
                    {
                        return Results.Conflict(new { error = exception.Message });
                    }
                })
            .RequireAuthorization()
            .RequireCovePermission(Permissions.SegmentsWrite)
            .RequireCoveEntityAccess(EntityKinds.Video, "videoId", Permissions.VideosWrite)
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.OwnedSegmentsRead);

        endpoints.MapGet(
                "/api/plugins/segment-studio/videos/{videoId:int}/shot-boundaries",
                async (int videoId, DbContext db, CancellationToken ct) =>
                    Results.Ok(await ShotBoundaryService.ListAsync(db, videoId, ct)))
            .RequireAuthorization()
            .RequireCovePermission(Permissions.SegmentsRead)
            .RequireCoveEntityAccess(EntityKinds.Video, "videoId", Permissions.VideosRead)
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.ShotBoundariesManage);

        endpoints.MapPost(
                "/api/plugins/segment-studio/videos/{videoId:int}/shot-boundaries/split",
                async Task<IResult> (int videoId, SplitShotBoundaryRequest request, DbContext db, CancellationToken ct) =>
                {
                    var duration = await db.Set<Video>().AsNoTracking()
                        .Where(video => video.Id == videoId)
                        .Select(video => video.Files.OrderBy(file => file.Id)
                            .Select(file => (double?)file.Duration).FirstOrDefault())
                        .SingleOrDefaultAsync(ct);
                    if (duration is null or <= 0)
                        return Results.BadRequest(new { error = "The video duration is unavailable." });
                    var strategy = db.Database.CreateExecutionStrategy();
                    var result = await strategy.ExecuteAsync(async () =>
                    {
                        await using var transaction = db.Database.IsRelational()
                            ? await db.Database.BeginTransactionAsync(ct)
                            : null;
                        var mutation = await ShotBoundaryService.SplitAsync(
                            db, videoId, request, duration.Value, ct);
                        if (mutation.Status == ShotBoundaryMutationStatus.Updated && transaction is not null)
                            await transaction.CommitAsync(ct);
                        return mutation;
                    });
                    return result.Status switch
                    {
                        ShotBoundaryMutationStatus.Updated => Results.Ok(result.Boundaries),
                        ShotBoundaryMutationStatus.Conflict => Results.Conflict(new { error = result.Error }),
                        _ => Results.BadRequest(new { error = result.Error }),
                    };
                })
            .RequireAuthorization()
            .RequireCovePermission(Permissions.SegmentsWrite)
            .RequireCoveEntityAccess(EntityKinds.Video, "videoId")
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.ShotBoundariesManage);

        endpoints.MapPost(
                "/api/plugins/segment-studio/videos/{videoId:int}/shot-boundaries/merge",
                async Task<IResult> (int videoId, MergeShotBoundaryRequest request, DbContext db, CancellationToken ct) =>
                {
                    var strategy = db.Database.CreateExecutionStrategy();
                    var result = await strategy.ExecuteAsync(async () =>
                    {
                        await using var transaction = db.Database.IsRelational()
                            ? await db.Database.BeginTransactionAsync(ct)
                            : null;
                        var mutation = await ShotBoundaryService.MergeAsync(db, videoId, request, ct);
                        if (mutation.Status == ShotBoundaryMutationStatus.Updated && transaction is not null)
                            await transaction.CommitAsync(ct);
                        return mutation;
                    });
                    return result.Status switch
                    {
                        ShotBoundaryMutationStatus.Updated => Results.Ok(result.Boundaries),
                        ShotBoundaryMutationStatus.Conflict => Results.Conflict(new { error = result.Error }),
                        _ => Results.BadRequest(new { error = result.Error }),
                    };
                })
            .RequireAuthorization()
            .RequireCovePermission(Permissions.SegmentsWrite)
            .RequireCoveEntityAccess(EntityKinds.Video, "videoId")
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.ShotBoundariesManage);

        endpoints.MapPost(
                "/api/plugins/segment-studio/videos/{videoId:int}/shot-boundaries/restore",
                async Task<IResult> (int videoId, RestoreShotBoundariesRequest request, DbContext db, CancellationToken ct) =>
                {
                    var duration = await db.Set<Video>().AsNoTracking()
                        .Where(video => video.Id == videoId)
                        .Select(video => video.Files.OrderBy(file => file.Id)
                            .Select(file => (double?)file.Duration).FirstOrDefault())
                        .SingleOrDefaultAsync(ct);
                    if (duration is null or <= 0)
                        return Results.BadRequest(new { error = "The video duration is unavailable." });
                    var strategy = db.Database.CreateExecutionStrategy();
                    var result = await strategy.ExecuteAsync(async () =>
                    {
                        await using var transaction = db.Database.IsRelational()
                            ? await db.Database.BeginTransactionAsync(ct)
                            : null;
                        var mutation = await ShotBoundaryService.RestoreAsync(
                            db, videoId, request, duration.Value, ct);
                        if (mutation.Status == ShotBoundaryMutationStatus.Updated && transaction is not null)
                            await transaction.CommitAsync(ct);
                        return mutation;
                    });
                    return result.Status switch
                    {
                        ShotBoundaryMutationStatus.Updated => Results.Ok(result.Boundaries),
                        ShotBoundaryMutationStatus.Conflict => Results.Conflict(new { error = result.Error }),
                        _ => Results.BadRequest(new { error = result.Error }),
                    };
                })
            .RequireAuthorization()
            .RequireCovePermission(Permissions.SegmentsWrite)
            .RequireCoveEntityAccess(EntityKinds.Video, "videoId")
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.ShotBoundariesManage);

        endpoints.MapGet("/api/plugins/segment-studio/browse/activities",
                async (HttpRequest request, DbContext db, ICurrentPrincipalAccessor principalAccessor,
                    Cove.Core.Auth.IAuthorizationService authorization, CancellationToken ct) =>
                {
                    var access = await SegmentStudioAuthorization.AuthorizeBrowseReadAsync(principalAccessor.Current, authorization, ct);
                    return !access.Allowed ? Results.Json(new { error = access.Reason }, statusCode: 403)
                        : Results.Ok(await SegmentStudioBrowseService.ActivitiesAsync(db, request.Query["q"].FirstOrDefault(), ct));
                }).RequireAuthorization().RequireCovePermission(PermissionMode.All, Permissions.SegmentsRead, Permissions.TagsRead)
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.NavigationSegmentInventory);

        endpoints.MapGet("/api/plugins/segment-studio/browse/activities/{tagId:int}/facets",
                async (int tagId, DbContext db, ICurrentPrincipalAccessor principalAccessor,
                    Cove.Core.Auth.IAuthorizationService authorization, CancellationToken ct) =>
                {
                    var access = await SegmentStudioAuthorization.AuthorizePerformerSlotMetadataReadAsync(principalAccessor.Current, authorization, ct);
                    if (!access.Allowed) return Results.Json(new { error = access.Reason }, statusCode: 403);
                    var result = await SegmentStudioBrowseService.FacetsAsync(db, tagId, ct);
                    return result is null ? Results.NotFound(new { error = "Activity tag not found." }) : Results.Ok(result);
                }).RequireAuthorization().RequireCovePermission(PermissionMode.All, Permissions.SegmentsRead, Permissions.TagsRead, Permissions.PerformersRead)
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.NavigationSegmentInventory);

        endpoints.MapPost("/api/plugins/segment-studio/browse/segments",
                async (BrowseRequest request, DbContext db, ICurrentPrincipalAccessor principalAccessor,
                    Cove.Core.Auth.IAuthorizationService authorization, CancellationToken ct) =>
                {
                    var access = await SegmentStudioAuthorization.AuthorizeBrowseReadAsync(principalAccessor.Current, authorization, ct);
                    if (!access.Allowed) return Results.Json(new { error = access.Reason }, statusCode: 403);
                    var performer = await SegmentStudioAuthorization.AuthorizePerformerSlotReadAsync(principalAccessor.Current, authorization, ct);
                    var (result, error) = await SegmentStudioBrowseService.SearchAsync(db, request, performer.Allowed, ct);
                    return result is null ? Results.BadRequest(new { error }) : Results.Ok(result);
                }).RequireAuthorization().RequireCovePermission(PermissionMode.All, Permissions.SegmentsRead, Permissions.TagsRead)
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.NavigationSegmentInventory);

        endpoints.MapPost("/api/plugins/segment-studio/review/segments",
                async (ReviewUnionRequest request, DbContext db, ICurrentPrincipalAccessor principalAccessor,
                    Cove.Core.Auth.IAuthorizationService authorization, CancellationToken ct) =>
                {
                    if (await SegmentStudioCompatibilityService.RequiresLegacyUiAsync(db, ct))
                        return LegacyUiRequiredResult();
                    var access = await SegmentStudioAuthorization.AuthorizeBrowseReadAsync(
                        principalAccessor.Current, authorization, ct);
                    if (!access.Allowed)
                        return Results.Json(new { error = access.Reason }, statusCode: StatusCodes.Status403Forbidden);
                    var (result, error) = await SegmentStudioReviewUnionService.SearchAuthorizedAsync(
                        db, request, principalAccessor.Current, authorization, ct);
                    return result is null ? Results.BadRequest(new { error }) : Results.Ok(result);
                })
            .RequireAuthorization()
            .RequireCovePermission(PermissionMode.All, Permissions.SegmentsRead, Permissions.TagsRead)
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.SegmentReview);

        endpoints.MapPost("/api/plugins/segment-studio/videos/{videoId:int}/drafts",
                async Task<IResult> (int videoId, CreateSegmentDraftRequest request, DbContext db,
                    ICurrentPrincipalAccessor principalAccessor, Cove.Core.Auth.IAuthorizationService authorization,
                    ILineageNodeService lineageNodes, ISegmentProvenanceService provenance,
                    [FromServices] ISegmentSpanCacheInvalidator spanCacheInvalidator, CancellationToken ct) =>
                {
                    if (await SegmentStudioCompatibilityService.RequiresLegacyUiAsync(db, ct))
                        return LegacyUiRequiredResult();
                    var strategy = db.Database.CreateExecutionStrategy();
                    var result = await strategy.ExecuteAsync(async () =>
                    {
                        await using var transaction = db.Database.IsRelational()
                            ? await db.Database.BeginTransactionAsync(ct)
                            : null;
                        var mutation = await SegmentStudioDraftService.CreateAsync(
                            db, videoId, request, principalAccessor.Current, authorization, ct);
                        if (mutation.Status == SegmentDraftMutationStatus.Updated
                            && mutation.Draft is { ItemId: var itemId })
                        {
                            var sourceId = await db.Set<SegmentStudioSource>()
                                .Where(source => source.Key == "user")
                                .Select(source => source.Id)
                                .SingleAsync(ct);
                            var node = await lineageNodes.EnsureAsync(db, itemId, ct);
                            await provenance.AppendAsync(
                                db,
                                new SegmentProvenanceAppend(
                                    node.Id,
                                    sourceId,
                                    "origin",
                                    null,
                                    null,
                                    null,
                                    null,
                                    null,
                                    DateTime.UtcNow,
                                    """{"creationMethod":"segment-studio"}"""),
                                ct);
                        }
                        if (mutation.Status == SegmentDraftMutationStatus.Updated && transaction is not null)
                            await transaction.CommitAsync(ct);
                        return mutation;
                    });
                    if (result.Status == SegmentDraftMutationStatus.Updated)
                        PublishSegmentInvalidation(spanCacheInvalidator, videoId);
                    return ToDraftHttpResult(result);
                })
            .RequireAuthorization()
            .RequireCovePermission(Permissions.SegmentsWrite)
            .RequireCoveEntityAccess(EntityKinds.Video, "videoId")
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.OwnedSegmentsRead);

        endpoints.MapPut("/api/plugins/segment-studio/videos/{videoId:int}/drafts/{itemId:long}",
                async Task<IResult> (int videoId, long itemId, UpdateSegmentDraftRequest request, DbContext db,
                    ICurrentPrincipalAccessor principalAccessor, Cove.Core.Auth.IAuthorizationService authorization,
                    [FromServices] ISegmentSpanCacheInvalidator spanCacheInvalidator, CancellationToken ct) =>
                {
                    if (await SegmentStudioCompatibilityService.RequiresLegacyUiAsync(db, ct))
                        return LegacyUiRequiredResult();
                    var strategy = db.Database.CreateExecutionStrategy();
                    var result = await strategy.ExecuteAsync(async () =>
                    {
                        await using var transaction = db.Database.IsRelational()
                            ? await db.Database.BeginTransactionAsync(ct)
                            : null;
                        var mutation = await SegmentStudioDraftService.UpdateAsync(
                            db, videoId, itemId, request, principalAccessor.Current, authorization, ct);
                        if (mutation.Status == SegmentDraftMutationStatus.Updated && transaction is not null)
                            await transaction.CommitAsync(ct);
                        return mutation;
                    });
                    if (result.Status == SegmentDraftMutationStatus.Updated
                        && result.Replayed
                        && result.Draft?.ReviewState == "approved"
                        && result.ApprovedSetVersion is null)
                        return Results.Conflict(new
                        {
                            error = "This saved draft predates local completion-state synchronization. Reload the editor.",
                            code = "DRAFT_REPLAY_RELOAD_REQUIRED",
                        });
                    if (result.Status == SegmentDraftMutationStatus.Updated)
                        PublishSegmentInvalidation(spanCacheInvalidator, videoId);
                    return ToDraftHttpResult(result);
                })
            .RequireAuthorization()
            .RequireCovePermission(Permissions.SegmentsWrite)
            .RequireCoveEntityAccess(EntityKinds.Video, "videoId")
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.OwnedSegmentsRead);

        endpoints.MapPost("/api/plugins/segment-studio/videos/{videoId:int}/drafts/{itemId:long}/split",
                async Task<IResult> (int videoId, long itemId, SplitSegmentDraftRequest request, DbContext db,
                    ICurrentPrincipalAccessor principalAccessor, Cove.Core.Auth.IAuthorizationService authorization,
                    [FromServices] ISegmentSpanCacheInvalidator spanCacheInvalidator, CancellationToken ct) =>
                {
                    if (await SegmentStudioCompatibilityService.RequiresLegacyUiAsync(db, ct))
                        return LegacyUiRequiredResult();
                    var strategy = db.Database.CreateExecutionStrategy();
                    var result = await strategy.ExecuteAsync(async () =>
                    {
                        await using var transaction = db.Database.IsRelational()
                            ? await db.Database.BeginTransactionAsync(ct)
                            : null;
                        var mutation = await SegmentStudioDraftService.SplitAsync(
                            db, videoId, itemId, request, principalAccessor.Current, authorization, ct);
                        if (mutation.Status == SegmentDraftMutationStatus.Updated && transaction is not null)
                            await transaction.CommitAsync(ct);
                        return mutation;
                    });
                    if (result.Status == SegmentDraftMutationStatus.Updated)
                        PublishSegmentInvalidation(spanCacheInvalidator, videoId);
                    return ToDraftHttpResult(result);
                })
            .RequireAuthorization()
            .RequireCovePermission(Permissions.SegmentsWrite)
            .RequireCoveEntityAccess(EntityKinds.Video, "videoId")
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.OwnedSegmentsRead);

        endpoints.MapPost("/api/plugins/segment-studio/videos/{videoId:int}/drafts/{itemId:long}/duplicate",
                async Task<IResult> (int videoId, long itemId, DuplicateSegmentDraftRequest request, DbContext db,
                    ICurrentPrincipalAccessor principalAccessor, Cove.Core.Auth.IAuthorizationService authorization,
                    [FromServices] ISegmentSpanCacheInvalidator spanCacheInvalidator, ISegmentDuplicationProvenanceService duplicateProvenance,
                    CancellationToken ct) =>
                {
                    if (await SegmentStudioCompatibilityService.RequiresLegacyUiAsync(db, ct))
                        return LegacyUiRequiredResult();
                    var strategy = db.Database.CreateExecutionStrategy();
                    var result = await strategy.ExecuteAsync(async () =>
                    {
                        await using var transaction = db.Database.IsRelational()
                            ? await db.Database.BeginTransactionAsync(ct)
                            : null;
                        var mutation = await SegmentStudioDraftService.DuplicateAsync(
                            db, videoId, itemId, request, principalAccessor.Current, authorization,
                            duplicateProvenance, ct);
                        if (mutation.Status == SegmentDraftMutationStatus.Updated && transaction is not null)
                            await transaction.CommitAsync(ct);
                        return mutation;
                    });
                    if (result.Status == SegmentDraftMutationStatus.Updated)
                        PublishSegmentInvalidation(spanCacheInvalidator, videoId);
                    return ToDraftHttpResult(result);
                })
            .RequireAuthorization()
            .RequireCovePermission(Permissions.SegmentsWrite)
            .RequireCoveEntityAccess(EntityKinds.Video, "videoId")
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.OwnedSegmentsRead);

        endpoints.MapPost("/api/plugins/segment-studio/videos/{videoId:int}/drafts/{itemId:long}/merge",
                async Task<IResult> (int videoId, long itemId, MergeSegmentDraftRequest request, DbContext db,
                    ICurrentPrincipalAccessor principalAccessor, Cove.Core.Auth.IAuthorizationService authorization,
                    [FromServices] ISegmentSpanCacheInvalidator spanCacheInvalidator, CancellationToken ct) =>
                {
                    var strategy = db.Database.CreateExecutionStrategy();
                    var result = await strategy.ExecuteAsync(async () =>
                    {
                        await using var transaction = db.Database.IsRelational()
                            ? await db.Database.BeginTransactionAsync(ct) : null;
                        var mutation = await SegmentStudioDraftService.MergeAsync(
                            db, videoId, itemId, request, principalAccessor.Current, authorization, ct);
                        if (mutation.Status == SegmentDraftMutationStatus.Updated && transaction is not null)
                            await transaction.CommitAsync(ct);
                        return mutation;
                    });
                    if (result.Status == SegmentDraftMutationStatus.Updated) PublishSegmentInvalidation(spanCacheInvalidator, videoId);
                    return ToDraftHttpResult(result);
                })
            .RequireAuthorization()
            .RequireCovePermission(PermissionMode.All, Permissions.SegmentsWrite, Permissions.SegmentsDelete)
            .RequireCoveEntityAccess(EntityKinds.Video, "videoId", Permissions.SegmentsWrite)
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.OwnedSegmentsRead);

        endpoints.MapPost("/api/plugins/segment-studio/videos/{videoId:int}/drafts/merge-selection",
                async Task<IResult> (int videoId, MergeSegmentDraftSelectionRequest request, DbContext db,
                    ICurrentPrincipalAccessor principalAccessor, Cove.Core.Auth.IAuthorizationService authorization,
                    [FromServices] ISegmentSpanCacheInvalidator spanCacheInvalidator, CancellationToken ct) =>
                {
                    if (request.ConsumedDrafts is null || request.ConsumedDrafts.Count == 0)
                        return Results.BadRequest(new { error = "Choose at least two drafts to merge." });
                    var performerAccess = await SegmentStudioAuthorization.AuthorizePerformerSlotReadAsync(
                        principalAccessor.Current, authorization, ct);
                    var provenanceAccess = await authorization.AuthorizeAsync(
                        principalAccessor.Current, ProvenanceReadPermission, entity: null, ct);
                    var strategy = db.Database.CreateExecutionStrategy();
                    var outcome = await strategy.ExecuteAsync(async () =>
                    {
                        await using var transaction = db.Database.IsRelational()
                            ? await db.Database.BeginTransactionAsync(ct) : null;
                        await SegmentStudioReviewLock.AcquireAsync(db, videoId, ct);
                        SegmentDraftMutationResult? mutation = null;
                        var survivorItemId = request.SurvivorItemId;
                        var survivorRevision = request.ExpectedSurvivorRevision;
                        foreach (var consumed in request.ConsumedDrafts)
                        {
                            mutation = await SegmentStudioDraftService.MergeAsync(
                                db, videoId, survivorItemId,
                                new MergeSegmentDraftRequest(
                                    consumed.OperationId,
                                    consumed.ItemId,
                                    survivorRevision,
                                    consumed.ExpectedRevision),
                                principalAccessor.Current, authorization, ct);
                            if (mutation.Status != SegmentDraftMutationStatus.Updated || mutation.Replayed)
                                return (Mutation: mutation, Delta: (SegmentEditorMergeDelta?)null);
                            survivorItemId = mutation.Draft!.ItemId;
                            survivorRevision = mutation.Draft.Revision;
                        }
                        await SegmentStudioHistoryService.ClearVideoAsync(db, videoId, ct);
                        var removedItemIds = request.ConsumedDrafts.Select(item => item.ItemId)
                            .Append(request.SurvivorItemId)
                            .Where(itemId => itemId != mutation!.Draft!.ItemId)
                            .Distinct()
                            .ToArray();
                        var delta = await SegmentEditorMergeProjectionService.LoadDraftAsync(
                            db, mutation!.Draft!, removedItemIds, performerAccess.Allowed,
                            provenanceAccess.Allowed, true, ct);
                        if (transaction is not null) await transaction.CommitAsync(ct);
                        return (Mutation: mutation!, Delta: (SegmentEditorMergeDelta?)delta);
                    });
                    if (outcome.Mutation.Status == SegmentDraftMutationStatus.Updated
                        && outcome.Delta is not null)
                    {
                        PublishSegmentInvalidation(spanCacheInvalidator, videoId);
                        return Results.Ok(outcome.Delta);
                    }
                    if (outcome.Mutation.Replayed)
                        return Results.Conflict(new { error = "This merge response was already applied. Reload before retrying it." });
                    return ToDraftHttpResult(outcome.Mutation);
                })
            .RequireAuthorization()
            .RequireCovePermission(PermissionMode.All, Permissions.SegmentsWrite, Permissions.SegmentsDelete)
            .RequireCoveEntityAccess(EntityKinds.Video, "videoId", Permissions.SegmentsWrite)
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.OwnedSegmentsRead);

        endpoints.MapGet("/api/plugins/segment-studio/slot-definitions",
                async (DbContext db, ICurrentPrincipalAccessor principalAccessor,
                    Cove.Core.Auth.IAuthorizationService authorization, CancellationToken ct) =>
                {
                    var access = await SegmentStudioAuthorization.AuthorizeSlotDefinitionMetadataReadAsync(
                        principalAccessor.Current, authorization, ct);
                    if (!access.Allowed)
                        return Results.Json(new { error = access.Reason }, statusCode: StatusCodes.Status403Forbidden);
                    return Results.Ok(await PerformerSlotMutationService.ListDefinitionSummariesAsync(db, ct));
                })
            .RequireAuthorization()
            .RequireCovePermission(
                PermissionMode.All,
                Permissions.SegmentsRead,
                Permissions.TagsRead,
                Permissions.PerformersRead,
                Permissions.VideosRead)
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.PerformerSlotsManage);

        endpoints.MapGet("/api/plugins/segment-studio/slot-definitions/{tagId:int}",
                async (int tagId, DbContext db, ICurrentPrincipalAccessor principalAccessor,
                    Cove.Core.Auth.IAuthorizationService authorization, CancellationToken ct) =>
                {
                    var access = await SegmentStudioAuthorization.AuthorizeSlotDefinitionMetadataReadAsync(principalAccessor.Current, authorization, ct);
                    if (!access.Allowed) return Results.Json(new { error = access.Reason }, statusCode: 403);
                    if (!await db.Set<Tag>().AsNoTracking().AnyAsync(tag => tag.Id == tagId, ct))
                        return Results.NotFound(new { error = "Activity tag not found." });
                    var result = await PerformerSlotMutationService.LoadDefinitionsAsync(db, tagId, ct);
                    if (result is not null) return Results.Ok(result);
                    return Results.Ok(new SlotDefinitionSetView(tagId, "", false, []));
                }).RequireAuthorization().RequireCovePermission(PermissionMode.All, Permissions.SegmentsRead, Permissions.TagsRead, Permissions.PerformersRead, Permissions.VideosRead)
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.PerformerSlotsManage);

        endpoints.MapPut("/api/plugins/segment-studio/slot-definitions/{tagId:int}",
                async (int tagId, SlotDefinitionSetUpdate request, DbContext db, ICurrentPrincipalAccessor principalAccessor,
                    Cove.Core.Auth.IAuthorizationService authorization, CancellationToken ct) =>
                {
                    var access = await SegmentStudioAuthorization.AuthorizePerformerSlotDefinitionWriteAsync(principalAccessor.Current, authorization, ct);
                    if (!access.Allowed) return Results.Json(new { error = access.Reason }, statusCode: 403);
                    var affectedVideoIds = await PerformerSlotMutationService.LoadAffectedVideoIdsAsync(db, tagId, request.Definitions, ct);
                    foreach (var affectedVideoId in affectedVideoIds)
                    {
                        var videoAccess = await authorization.AuthorizeAsync(principalAccessor.Current, Permissions.SegmentsWrite,
                            EntityRef.Of(EntityKinds.Video, affectedVideoId), ct);
                        if (!videoAccess.Allowed)
                            return Results.Json(new { error = videoAccess.Reason ?? "You cannot remove assignments from an affected video." }, statusCode: 403);
                    }
                    var result = await PerformerSlotMutationService.UpdateDefinitionsAsync(db, tagId, request, ct);
                    return result.Status switch { SlotMutationStatus.Updated => Results.Ok(result.Value), SlotMutationStatus.Conflict => Results.Conflict(new { error = result.Error, current = result.Value }), SlotMutationStatus.NotFound => Results.NotFound(new { error = result.Error }), _ => Results.BadRequest(new { error = result.Error }) };
                }).RequireAuthorization().RequireCovePermission(PermissionMode.All, Permissions.SegmentsWrite, Permissions.TagsRead, Permissions.PerformersRead)
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.PerformerSlotsManage);

        endpoints.MapPut("/api/plugins/segment-studio/videos/{videoId:int}/segments/{segmentId:int}/slots",
                async (int videoId, int segmentId, SlotAssignmentUpdate request, DbContext db, ICurrentPrincipalAccessor principalAccessor,
                    Cove.Core.Auth.IAuthorizationService authorization, [FromServices] ISegmentSpanCacheInvalidator spanCacheInvalidator, CancellationToken ct) =>
                {
                    var access = await SegmentStudioAuthorization.AuthorizePerformerSlotAssignmentWriteAsync(principalAccessor.Current, authorization, videoId, ct);
                    if (!access.Allowed) return Results.Json(new { error = access.Reason }, statusCode: 403);
                    var result = await PerformerSlotMutationService.UpdateAssignmentsAsync(db, videoId, segmentId, request, ct);
                    if (result.Status == SlotMutationStatus.Updated)
                        spanCacheInvalidator.InvalidateVideo(videoId);
                    return result.Status switch { SlotMutationStatus.Updated => Results.Ok(result.Value), SlotMutationStatus.Conflict => Results.Conflict(new { error = result.Error, current = result.Value }), SlotMutationStatus.NotFound => Results.NotFound(new { error = result.Error }), _ => Results.BadRequest(new { error = result.Error }) };
                }).RequireAuthorization().RequireCovePermission(PermissionMode.All, Permissions.SegmentsWrite, Permissions.TagsRead, Permissions.PerformersRead)
            .RequireCoveEntityAccess(EntityKinds.Video, "videoId", Permissions.SegmentsWrite)
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.PerformerSlotsManage);

        endpoints.MapPut(
                "/api/plugins/segment-studio/videos/{videoId:int}/drafts/{itemId:long}/slots",
                async Task<IResult> (int videoId, long itemId, SlotAssignmentUpdate request, DbContext db,
                    ICurrentPrincipalAccessor principalAccessor,
                    Cove.Core.Auth.IAuthorizationService authorization,
                    [FromServices] ISegmentSpanCacheInvalidator spanCacheInvalidator,
                    CancellationToken ct) =>
                {
                    var access = await SegmentStudioAuthorization.AuthorizePerformerSlotAssignmentWriteAsync(
                        principalAccessor.Current, authorization, videoId, ct);
                    if (!access.Allowed)
                        return Results.Json(new { error = access.Reason }, statusCode: 403);
                    var result = await PerformerSlotMutationService.UpdateOwnedAssignmentsAsync(
                        db, videoId, itemId, request, ct);
                    if (result.Status == SlotMutationStatus.Updated)
                        PublishSegmentInvalidation(spanCacheInvalidator, videoId);
                    return result.Status switch
                    {
                        SlotMutationStatus.Updated => Results.Ok(result.Value),
                        SlotMutationStatus.Conflict => Results.Conflict(new { error = result.Error, current = result.Value }),
                        SlotMutationStatus.NotFound => Results.NotFound(new { error = result.Error }),
                        _ => Results.BadRequest(new { error = result.Error }),
                    };
                })
            .RequireAuthorization()
            .RequireCovePermission(PermissionMode.All, Permissions.SegmentsWrite, Permissions.TagsRead, Permissions.PerformersRead)
            .RequireCoveEntityAccess(EntityKinds.Video, "videoId", Permissions.SegmentsWrite)
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.PerformerSlotsManage);

        endpoints.MapPost(
                "/api/plugins/segment-studio/videos/{videoId:int}/segments/auto-assign-performer-slots",
                async Task<IResult> (int videoId, BulkAutoAssignmentRequest request, DbContext db, ICurrentPrincipalAccessor principalAccessor,
                    Cove.Core.Auth.IAuthorizationService authorization, [FromServices] ISegmentSpanCacheInvalidator spanCacheInvalidator, CancellationToken ct) =>
                {
                    var access = await SegmentStudioAuthorization.AuthorizePerformerSlotAssignmentWriteAsync(
                        principalAccessor.Current, authorization, videoId, ct);
                    if (!access.Allowed)
                        return Results.Json(new { error = access.Reason }, statusCode: 403);
                    var strategy = db.Database.CreateExecutionStrategy();
                    var result = await strategy.ExecuteAsync(async () =>
                    {
                        await using var transaction = db.Database.IsRelational()
                            ? await db.Database.BeginTransactionAsync(ct)
                            : null;
                        await SegmentStudioReviewLock.AcquireAsync(db, videoId, ct);
                        await PerformerSlotMutationService.LockSlotTablesAsync(db, ct);
                        var assigned = await PerformerSlotAutoAssignmentService.AssignEmptySegmentsAsync(
                            db, videoId, ct,
                            request.NativeSegmentIds?.Distinct().ToArray() ?? [],
                            request.ItemIds?.Distinct().ToArray() ?? []);
                        if (transaction is not null)
                            await transaction.CommitAsync(ct);
                        return assigned;
                    });
                    if (result.AssignedSegmentCount != 0)
                        PublishSegmentInvalidation(spanCacheInvalidator, videoId);
                    return Results.Ok(result);
                })
            .RequireAuthorization()
            .RequireCovePermission(PermissionMode.All, Permissions.SegmentsWrite, Permissions.TagsRead, Permissions.PerformersRead)
            .RequireCoveEntityAccess(EntityKinds.Video, "videoId", Permissions.SegmentsWrite)
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.PerformerSlotsManage);

        endpoints.MapPut(
                "/api/plugins/segment-studio/videos/{videoId:int}/segments/tag",
                async Task<IResult> (int videoId, BulkSegmentTagRequest request, DbContext db,
                    ICurrentPrincipalAccessor principalAccessor, Cove.Core.Auth.IAuthorizationService authorization,
                    [FromServices] ISegmentSpanCacheInvalidator spanCacheInvalidator,
                    IFieldProvenanceService? fieldProvenance,
                    CancellationToken ct) =>
                {
                    if (await SegmentStudioCompatibilityService.RequiresLegacyUiAsync(db, ct))
                        return LegacyUiRequiredResult();
                    var preserveExtensionMetadata = await UsesFullWorkflowAsync(
                        db, principalAccessor, ct);
                    var strategy = db.Database.CreateExecutionStrategy();
                    var result = await strategy.ExecuteAsync(async () =>
                    {
                        await using var transaction = db.Database.IsRelational()
                            ? await db.Database.BeginTransactionAsync(ct)
                            : null;
                        var basicIds = request.Segments
                            .Where(target => target.NativeSegmentId is not null)
                            .Select(target => target.NativeSegmentId!.Value)
                            .ToArray();
                        var history = preserveExtensionMetadata
                            ? null
                            : await PrepareBasicHistoryAsync(
                                db,
                                request.HistoryReceiptId,
                                principalAccessor.Current,
                                videoId,
                                basicIds,
                                ct);
                        if (history?.Exists == true)
                        {
                            return new BulkSegmentTagResult(
                                BulkSegmentTagStatus.Conflict,
                                Error: BasicHistoryReceiptReplayError,
                                Code: BasicHistoryReceiptReplayCode);
                        }
                        var mutation = await BulkSegmentTagService.UpdateAsync(
                            db, videoId, request, principalAccessor.Current,
                            authorization, ct, preserveExtensionMetadata);
                        if (mutation.Status == BulkSegmentTagStatus.Updated)
                        {
                            if (!mutation.Replayed && fieldProvenance is not null)
                            {
                                foreach (var segmentId in mutation.NativeSegmentIds ?? [])
                                    await fieldProvenance.RecordManyAsync(
                                        AffinityHostType.Segment,
                                        segmentId,
                                        new Dictionary<string, object?> { ["tag_id"] = request.TagId },
                                        "user",
                                        cancellationToken: ct);
                                await db.SaveChangesAsync(ct);
                            }
                            if (!preserveExtensionMetadata)
                            {
                                var changedCount = mutation.NativeSegmentIds?.Count
                                    ?? basicIds.Length;
                                await CompleteBasicNativeHistoryAsync(
                                    db,
                                    history,
                                    videoId,
                                    "segments.tag",
                                    $"Changed tag for {changedCount} segment{(changedCount == 1 ? "" : "s")}",
                                    mutation.NativeSegmentIds ?? basicIds,
                                    ct);
                            }
                            if (transaction is not null)
                                await transaction.CommitAsync(ct);
                        }
                        return mutation;
                    });
                    if (result.Status == BulkSegmentTagStatus.Updated)
                        PublishSegmentInvalidation(spanCacheInvalidator, videoId);
                    return result.Status switch
                    {
                        BulkSegmentTagStatus.Updated => Results.Ok(result),
                        BulkSegmentTagStatus.Invalid => Results.BadRequest(new { error = result.Error, result.Code }),
                        BulkSegmentTagStatus.Forbidden => Results.Json(
                            new { error = result.Error }, statusCode: StatusCodes.Status403Forbidden),
                        BulkSegmentTagStatus.Conflict => Results.Conflict(
                            new { error = result.Error, result.Code }),
                        _ => Results.NotFound(new { error = result.Error }),
                    };
                })
            .RequireAuthorization()
            .RequireCovePermission(Permissions.SegmentsWrite)
            .RequireCoveEntityAccess(EntityKinds.Video, "videoId")
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.NativeSegmentsBulkRetag);

        endpoints.MapPost(
                "/api/plugins/segment-studio/videos/{videoId:int}/segments",
                async Task<IResult> (int videoId,
                    CreateBasicNativeSegmentRequest request,
                    DbContext db,
                    ICurrentPrincipalAccessor principalAccessor,
                    Cove.Core.Auth.IAuthorizationService authorization,
                    [FromServices] ISegmentSpanCacheInvalidator spanCacheInvalidator,
                    CancellationToken ct) =>
                {
                    if (await UsesFullWorkflowAsync(db, principalAccessor, ct))
                        return Results.Conflict(new
                        {
                            error = "Use the Full workflow draft command in Full mode.",
                        });
                    try
                    {
                        var strategy = db.Database.CreateExecutionStrategy();
                        var outcome = await strategy.ExecuteAsync(async () =>
                        {
                            await using var transaction = db.Database.IsRelational()
                                ? await db.Database.BeginTransactionAsync(ct)
                                : null;
                            var history = await PrepareBasicHistoryAsync(
                                db,
                                request.HistoryReceiptId,
                                principalAccessor.Current,
                                videoId,
                                [],
                                ct);
                            if (history?.Exists == true)
                                return new BasicNativeCreateOutcome(null, true);
                            var result =
                                await BasicNativeSegmentService.CreateAsync(
                                    db, videoId, request,
                                    principalAccessor.Current,
                                    authorization, ct);
                            await CompleteBasicNativeHistoryAsync(
                                db,
                                history,
                                videoId,
                                "segment.create",
                                "Created segment",
                                [result.Id],
                                ct);
                            if (transaction is not null)
                                await transaction.CommitAsync(ct);
                            return new BasicNativeCreateOutcome(result, false);
                        });
                        if (outcome.Replayed)
                        {
                            return Results.Conflict(new
                            {
                                error = BasicHistoryReceiptReplayError,
                                code = BasicHistoryReceiptReplayCode,
                            });
                        }
                        var created = outcome.Segment!;
                        PublishSegmentInvalidation(spanCacheInvalidator, videoId);
                        return Results.Ok(created);
                    }
                    catch (KeyNotFoundException exception)
                    {
                        return Results.NotFound(new { error = exception.Message });
                    }
                    catch (UnauthorizedAccessException exception)
                    {
                        return Results.Json(new { error = exception.Message },
                            statusCode: StatusCodes.Status403Forbidden);
                    }
                    catch (ArgumentException exception)
                    {
                        return Results.BadRequest(new { error = exception.Message });
                    }
                })
            .RequireAuthorization()
            .RequireCovePermission(Permissions.SegmentsWrite)
            .RequireCoveEntityAccess(EntityKinds.Video, "videoId")
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.NativeSegmentsCreate);

        endpoints.MapPut(
                "/api/plugins/segment-studio/videos/{videoId:int}/segments/{segmentId:int}",
                async Task<IResult> (int videoId, int segmentId, DirectSegmentMutationRequest request, DbContext db,
                    ICurrentPrincipalAccessor principalAccessor, Cove.Core.Auth.IAuthorizationService authorization,
                    [FromServices] ISegmentSpanCacheInvalidator spanCacheInvalidator, IFieldProvenanceService? fieldProvenance, CancellationToken ct) =>
                {
                    var preserveExtensionMetadata = await UsesFullWorkflowAsync(
                        db, principalAccessor, ct);
                    var provenanceAccess = await authorization.AuthorizeAsync(
                        principalAccessor.Current,
                        ProvenanceReadPermission,
                        entity: null,
                        ct);
                    var strategy = db.Database.CreateExecutionStrategy();
                    return await strategy.ExecuteAsync(async () =>
                    {
                        await using var transaction = db.Database.IsRelational()
                            ? await db.Database.BeginTransactionAsync(ct)
                            : null;
                        var history = preserveExtensionMetadata
                            ? null
                            : await PrepareBasicHistoryAsync(
                                db,
                                request.HistoryReceiptId,
                                principalAccessor.Current,
                                videoId,
                                [segmentId],
                                ct);
                        if (history?.Exists == true)
                        {
                            return Results.Conflict(new
                            {
                                error = BasicHistoryReceiptReplayError,
                                code = BasicHistoryReceiptReplayCode,
                            });
                        }
                        var result = await DirectSegmentReviewService.UpdateAuthorizedAsync(
                            db, videoId, segmentId, request,
                            principalAccessor.Current, authorization, ct,
                            preserveExtensionMetadata);
                        if (result.Status == DirectSegmentMutationStatus.Updated
                            && result.Segment is not null
                            && result.ChangedFields is { Count: > 0 }
                            && fieldProvenance is not null)
                        {
                            await fieldProvenance.RecordManyAsync(
                                AffinityHostType.Segment,
                                segmentId,
                                result.ChangedFields,
                                "user",
                                cancellationToken: ct);
                            await db.SaveChangesAsync(ct);
                            if (provenanceAccess.Allowed)
                                result = result with
                            {
                                Segment = result.Segment with
                                {
                                    FieldProvenance = await fieldProvenance.GetForHostAsync(
                                        AffinityHostType.Segment,
                                        segmentId,
                                        ct),
                                },
                            };
                        }
                        if (result.Status == DirectSegmentMutationStatus.Updated)
                        {
                            if (!preserveExtensionMetadata)
                            {
                                await CompleteBasicNativeHistoryAsync(
                                    db,
                                    history,
                                    videoId,
                                    "segment.update",
                                    "Changed segment",
                                    [segmentId],
                                    ct);
                            }
                            if (transaction is not null)
                                await transaction.CommitAsync(ct);
                            spanCacheInvalidator.InvalidateVideo(videoId);
                        }

                        return result.Status switch
                        {
                            DirectSegmentMutationStatus.Updated => Results.Ok(result.Segment),
                            DirectSegmentMutationStatus.Invalid => Results.BadRequest(new { error = result.Error }),
                            DirectSegmentMutationStatus.Forbidden => Results.Json(new { error = result.Error }, statusCode: StatusCodes.Status403Forbidden),
                            DirectSegmentMutationStatus.Conflict => Results.Conflict(new { error = result.Error, code = result.Code, segment = result.Segment }),
                            _ => Results.NotFound(new { error = result.Error }),
                        };
                    });
                })
            .RequireAuthorization()
            .RequireCovePermission(Permissions.SegmentsWrite)
            .RequireCoveEntityAccess(EntityKinds.Video, "videoId")
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.NativeSegmentsEdit);

        endpoints.MapPost(
                "/api/plugins/segment-studio/videos/{videoId:int}/segments/{segmentId:int}/merge",
                async Task<IResult> (int videoId, int segmentId, MergeNativeSegmentsRequest request, DbContext db,
                    ICurrentPrincipalAccessor principalAccessor, Cove.Core.Auth.IAuthorizationService authorization,
                    [FromServices] ISegmentSpanCacheInvalidator spanCacheInvalidator, CancellationToken ct) =>
                {
                    var preserveExtensionMetadata = await UsesFullWorkflowAsync(
                        db, principalAccessor, ct);
                    var strategy = db.Database.CreateExecutionStrategy();
                    var result = await strategy.ExecuteAsync(async () =>
                    {
                        await using var transaction = db.Database.IsRelational()
                            ? await db.Database.BeginTransactionAsync(ct) : null;
                        var history = preserveExtensionMetadata
                            ? null
                            : await PrepareBasicHistoryAsync(
                                db,
                                request.HistoryReceiptId,
                                principalAccessor.Current,
                                videoId,
                                [segmentId, request.SourceSegmentId],
                                ct);
                        if (history?.Exists == true)
                            return BasicHistoryReceiptReplayDirectResult();
                        var mutation = await DirectSegmentReviewService.MergeAuthorizedAsync(
                            db, videoId, segmentId, request,
                            principalAccessor.Current, authorization, ct,
                            preserveExtensionMetadata);
                        if (mutation.Status == DirectSegmentMutationStatus.Updated)
                        {
                            if (!preserveExtensionMetadata)
                            {
                                await CompleteBasicNativeHistoryAsync(
                                    db,
                                    history,
                                    videoId,
                                    "segments.merge",
                                    "Merged 2 segments",
                                    [segmentId],
                                    ct);
                            }
                            if (transaction is not null)
                                await transaction.CommitAsync(ct);
                        }
                        return mutation;
                    });
                    if (result.Status == DirectSegmentMutationStatus.Updated) PublishSegmentInvalidation(spanCacheInvalidator, videoId);
                    return result.Status switch
                    {
                        DirectSegmentMutationStatus.Updated => Results.Ok(result.Segment),
                        DirectSegmentMutationStatus.Invalid => Results.BadRequest(new { error = result.Error }),
                        DirectSegmentMutationStatus.Forbidden => Results.Json(new { error = result.Error }, statusCode: 403),
                        DirectSegmentMutationStatus.Conflict => Results.Conflict(new { error = result.Error }),
                        _ => Results.NotFound(new { error = result.Error }),
                    };
                })
            .RequireAuthorization()
            .RequireCovePermission(PermissionMode.All, Permissions.SegmentsWrite, Permissions.SegmentsDelete)
            .RequireCoveEntityAccess(EntityKinds.Video, "videoId", Permissions.SegmentsWrite)
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.NativeSegmentsMerge);

        endpoints.MapPost(
                "/api/plugins/segment-studio/videos/{videoId:int}/segments/merge-selection",
                async Task<IResult> (int videoId, MergeNativeSegmentSelectionRequest request, DbContext db,
                    ICurrentPrincipalAccessor principalAccessor, Cove.Core.Auth.IAuthorizationService authorization,
                    [FromServices] ISegmentSpanCacheInvalidator spanCacheInvalidator, CancellationToken ct) =>
                {
                    if (request.ConsumedSegments is null || request.ConsumedSegments.Count == 0)
                        return Results.BadRequest(new { error = "Choose at least two segments to merge." });
                    var preserveExtensionMetadata = await UsesFullWorkflowAsync(
                        db, principalAccessor, ct);
                    var performerAccess = await SegmentStudioAuthorization.AuthorizePerformerSlotReadAsync(
                        principalAccessor.Current, authorization, ct);
                    var provenanceAccess = await authorization.AuthorizeAsync(
                        principalAccessor.Current, ProvenanceReadPermission, entity: null, ct);
                    var strategy = db.Database.CreateExecutionStrategy();
                    var outcome = await strategy.ExecuteAsync(async () =>
                    {
                        await using var transaction = db.Database.IsRelational()
                            ? await db.Database.BeginTransactionAsync(ct) : null;
                        await SegmentStudioReviewLock.AcquireAsync(db, videoId, ct);
                        var requestedNativeIds = request.ConsumedSegments.Select(item => item.SegmentId)
                            .Append(request.SurvivorSegmentId)
                            .Distinct()
                            .ToArray();
                        var requestedItemIds = preserveExtensionMetadata
                            ? await db.Set<SegmentStudioItem>().AsNoTracking()
                                .Where(item => item.NativeSegmentId != null
                                    && requestedNativeIds.Contains(item.NativeSegmentId.Value))
                                .Select(item => item.Id)
                                .ToArrayAsync(ct)
                            : [];
                        var history = preserveExtensionMetadata
                            ? null
                            : await PrepareBasicHistoryAsync(
                                db,
                                request.HistoryReceiptId,
                                principalAccessor.Current,
                                videoId,
                                new[] { request.SurvivorSegmentId }
                                    .Concat(request.ConsumedSegments.Select(
                                        consumed => consumed.SegmentId)),
                                ct);
                        if (history?.Exists == true)
                            return (
                                Mutation: BasicHistoryReceiptReplayDirectResult(),
                                Delta: (SegmentEditorMergeDelta?)null);
                        DirectSegmentMutationResult? mutation = null;
                        var survivorSegmentId = request.SurvivorSegmentId;
                        var survivorUpdatedAt = request.ExpectedSurvivorUpdatedAt;
                        foreach (var consumed in request.ConsumedSegments)
                        {
                            mutation = await DirectSegmentReviewService.MergeAuthorizedAsync(
                                db, videoId, survivorSegmentId,
                                new MergeNativeSegmentsRequest(
                                    consumed.OperationId,
                                    consumed.SegmentId,
                                    survivorUpdatedAt,
                                    consumed.ExpectedUpdatedAt),
                                principalAccessor.Current, authorization, ct,
                                preserveExtensionMetadata);
                            if (mutation.Status != DirectSegmentMutationStatus.Updated || mutation.Replayed)
                                return (Mutation: mutation, Delta: (SegmentEditorMergeDelta?)null);
                            survivorSegmentId = mutation.Segment!.Id;
                            survivorUpdatedAt = mutation.Segment.UpdatedAt;
                        }
                        if (preserveExtensionMetadata)
                            await SegmentStudioHistoryService.ClearVideoAsync(
                                db, videoId, ct);
                        else
                        {
                            var mergedCount = request.ConsumedSegments.Count + 1;
                            await CompleteBasicNativeHistoryAsync(
                                db,
                                history,
                                videoId,
                                "segments.merge",
                                $"Merged {mergedCount} segments",
                                [survivorSegmentId],
                                ct);
                        }
                        var removedNativeIds = requestedNativeIds
                            .Where(id => id != mutation!.Segment!.Id)
                            .ToArray();
                        var survivorItemId = preserveExtensionMetadata
                            ? await db.Set<SegmentStudioItem>().AsNoTracking()
                                .Where(item => item.NativeSegmentId == mutation!.Segment!.Id)
                                .Select(item => (long?)item.Id)
                                .SingleOrDefaultAsync(ct)
                            : null;
                        var removedItemIds = requestedItemIds
                            .Where(itemId => itemId != survivorItemId)
                            .ToArray();
                        var delta = await SegmentEditorMergeProjectionService.LoadNativeAsync(
                            db, mutation!.Segment!, removedNativeIds, removedItemIds,
                            preserveExtensionMetadata,
                            performerAccess.Allowed && preserveExtensionMetadata,
                            provenanceAccess.Allowed && preserveExtensionMetadata,
                            preserveExtensionMetadata, ct);
                        if (transaction is not null) await transaction.CommitAsync(ct);
                        return (Mutation: mutation!, Delta: (SegmentEditorMergeDelta?)delta);
                    });
                    if (outcome.Mutation.Status == DirectSegmentMutationStatus.Updated
                        && outcome.Delta is not null)
                    {
                        PublishSegmentInvalidation(spanCacheInvalidator, videoId);
                        return Results.Ok(outcome.Delta);
                    }
                    if (outcome.Mutation.Replayed)
                        return Results.Conflict(new { error = "This merge response was already applied. Reload before retrying it." });
                    return outcome.Mutation.Status switch
                    {
                        DirectSegmentMutationStatus.Invalid => Results.BadRequest(new { error = outcome.Mutation.Error }),
                        DirectSegmentMutationStatus.Forbidden => Results.Json(new { error = outcome.Mutation.Error }, statusCode: 403),
                        DirectSegmentMutationStatus.Conflict => Results.Conflict(new { error = outcome.Mutation.Error }),
                        _ => Results.NotFound(new { error = outcome.Mutation.Error }),
                    };
                })
            .RequireAuthorization()
            .RequireCovePermission(PermissionMode.All, Permissions.SegmentsWrite, Permissions.SegmentsDelete)
            .RequireCoveEntityAccess(EntityKinds.Video, "videoId", Permissions.SegmentsWrite)
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.NativeSegmentsMerge);

        endpoints.MapPost(
                "/api/plugins/segment-studio/videos/{videoId:int}/segments/{segmentId:int}/duplicate",
                async Task<IResult> (int videoId, int segmentId, DuplicateNativeSegmentRequest request, DbContext db,
                    ICurrentPrincipalAccessor principalAccessor, Cove.Core.Auth.IAuthorizationService authorization,
                    [FromServices] ISegmentSpanCacheInvalidator spanCacheInvalidator, ISegmentDuplicationProvenanceService duplicateProvenance,
                    CancellationToken ct) =>
                {
                    var preserveExtensionMetadata = await UsesFullWorkflowAsync(
                        db, principalAccessor, ct);
                    var strategy = db.Database.CreateExecutionStrategy();
                    var result = await strategy.ExecuteAsync(async () =>
                    {
                        await using var transaction = db.Database.IsRelational()
                            ? await db.Database.BeginTransactionAsync(ct)
                            : null;
                        var history = preserveExtensionMetadata
                            ? null
                            : await PrepareBasicHistoryAsync(
                                db,
                                request.HistoryReceiptId,
                                principalAccessor.Current,
                                videoId,
                                [],
                                ct);
                        if (history?.Exists == true)
                            return BasicHistoryReceiptReplayDirectResult();
                        var mutation = await DirectSegmentReviewService.DuplicateAuthorizedAsync(
                            db, videoId, segmentId, request, principalAccessor.Current, authorization,
                            duplicateProvenance, ct,
                            preserveExtensionMetadata);
                        if (mutation.Status == DirectSegmentMutationStatus.Updated)
                        {
                            if (!preserveExtensionMetadata)
                            {
                                await CompleteBasicNativeHistoryAsync(
                                    db,
                                    history,
                                    videoId,
                                    "segment.duplicate",
                                    "Duplicated segment",
                                    [mutation.Segment!.Id],
                                    ct);
                            }
                            if (transaction is not null)
                                await transaction.CommitAsync(ct);
                        }
                        return mutation;
                    });
                    if (result.Status == DirectSegmentMutationStatus.Updated)
                        PublishSegmentInvalidation(spanCacheInvalidator, videoId);
                    return result.Status switch
                    {
                        DirectSegmentMutationStatus.Updated => Results.Ok(result.Segment),
                        DirectSegmentMutationStatus.Invalid => Results.BadRequest(new { error = result.Error }),
                        DirectSegmentMutationStatus.Forbidden => Results.Json(new { error = result.Error }, statusCode: StatusCodes.Status403Forbidden),
                        DirectSegmentMutationStatus.Conflict => Results.Conflict(new { error = result.Error, code = result.Code, segment = result.Segment }),
                        _ => Results.NotFound(new { error = result.Error }),
                    };
                })
            .RequireAuthorization()
            .RequireCovePermission(Permissions.SegmentsWrite)
            .RequireCoveEntityAccess(EntityKinds.Video, "videoId")
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.NativeSegmentsDuplicate);

        endpoints.MapPost(
                "/api/plugins/segment-studio/videos/{videoId:int}/segments/{segmentId:int}/split",
                async Task<IResult> (int videoId, int segmentId, SplitNativeSegmentRequest request, DbContext db,
                    ICurrentPrincipalAccessor principalAccessor, Cove.Core.Auth.IAuthorizationService authorization,
                    [FromServices] ISegmentSpanCacheInvalidator spanCacheInvalidator, CancellationToken ct) =>
                {
                    var preserveExtensionMetadata = await UsesFullWorkflowAsync(
                        db, principalAccessor, ct);
                    var strategy = db.Database.CreateExecutionStrategy();
                    var result = await strategy.ExecuteAsync(async () =>
                    {
                        await using var transaction = db.Database.IsRelational()
                            ? await db.Database.BeginTransactionAsync(ct)
                            : null;
                        var history = preserveExtensionMetadata
                            ? null
                            : await PrepareBasicHistoryAsync(
                                db,
                                request.HistoryReceiptId,
                                principalAccessor.Current,
                                videoId,
                                [segmentId],
                                ct);
                        if (history?.Exists == true)
                            return BasicHistoryReceiptReplayDirectResult();
                        var mutation = await DirectSegmentReviewService.SplitAuthorizedAsync(
                            db, videoId, segmentId, request,
                            principalAccessor.Current, authorization, ct,
                            preserveExtensionMetadata);
                        if (mutation.Status == DirectSegmentMutationStatus.Updated)
                        {
                            if (!preserveExtensionMetadata)
                            {
                                await CompleteBasicNativeHistoryAsync(
                                    db,
                                    history,
                                    videoId,
                                    "segment.split",
                                    "Split segment",
                                    [segmentId, mutation.Segment!.Id],
                                    ct);
                            }
                            if (transaction is not null)
                                await transaction.CommitAsync(ct);
                        }
                        return mutation;
                    });
                    if (result.Status == DirectSegmentMutationStatus.Updated)
                        PublishSegmentInvalidation(spanCacheInvalidator, videoId);
                    return result.Status switch
                    {
                        DirectSegmentMutationStatus.Updated => Results.Ok(result.Segment),
                        DirectSegmentMutationStatus.Invalid => Results.BadRequest(new { error = result.Error }),
                        DirectSegmentMutationStatus.Forbidden => Results.Json(new { error = result.Error }, statusCode: StatusCodes.Status403Forbidden),
                        DirectSegmentMutationStatus.Conflict => Results.Conflict(new { error = result.Error, segment = result.Segment }),
                        _ => Results.NotFound(new { error = result.Error }),
                    };
                })
            .RequireAuthorization()
            .RequireCovePermission(Permissions.SegmentsWrite)
            .RequireCoveEntityAccess(EntityKinds.Video, "videoId")
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.NativeSegmentsSplit);

        endpoints.MapPost(
                "/api/plugins/segment-studio/videos/{videoId:int}/rejected/deletion/preview",
                async Task<IResult> (int videoId, DbContext db,
                    ISegmentLineageDeletionService deletion,
                    ICurrentPrincipalAccessor principalAccessor,
                    Cove.Core.Auth.IAuthorizationService authorization,
                    CancellationToken ct) =>
                {
                    try
                    {
                        return Results.Ok(await deletion.PreviewRejectedAsync(
                            db, videoId, principalAccessor.Current, authorization, ct));
                    }
                    catch (KeyNotFoundException)
                    {
                        return Results.NotFound();
                    }
                    catch (LineageConflictException exception)
                    {
                        return Results.Conflict(new { code = exception.Code, error = exception.Message });
                    }
                })
            .RequireAuthorization()
            .RequireCovePermission(Permissions.SegmentsDelete)
            .RequireCoveEntityAccess(EntityKinds.Video, "videoId")
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.SegmentReview);

        endpoints.MapPost(
                "/api/plugins/segment-studio/videos/{videoId:int}/rejected/deletion/execute",
                async Task<IResult> (int videoId, SegmentDependencyDeleteExecuteRequest request,
                    DbContext db, ISegmentLineageDeletionService deletion,
                    ICurrentPrincipalAccessor principalAccessor,
                    Cove.Core.Auth.IAuthorizationService authorization,
                    [FromServices] ISegmentSpanCacheInvalidator spanCacheInvalidator,
                    CancellationToken ct) =>
                {
                    try
                    {
                        var result = await deletion.ExecuteRejectedAsync(
                            db, videoId, request, principalAccessor.Current, authorization, ct);
                        spanCacheInvalidator.InvalidateAll();
                        return Results.Ok(result);
                    }
                    catch (KeyNotFoundException)
                    {
                        return Results.NotFound();
                    }
                    catch (LineageConflictException exception)
                    {
                        return Results.Conflict(new { code = exception.Code, error = exception.Message });
                    }
                    catch (ArgumentException exception)
                    {
                        return Results.BadRequest(new { error = exception.Message });
                    }
                })
            .RequireAuthorization()
            .RequireCovePermission(Permissions.SegmentsDelete)
            .RequireCoveEntityAccess(EntityKinds.Video, "videoId")
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.SegmentReview);

        endpoints.MapGet(
                "/api/plugins/segment-studio/bin",
                async (HttpRequest request, DbContext db, ICurrentPrincipalAccessor principalAccessor,
                    Cove.Core.Auth.IAuthorizationService authorization, CancellationToken ct) =>
                {
                    if (await SegmentStudioCompatibilityService.RequiresLegacyUiAsync(db, ct))
                        return LegacyUiRequiredResult();
                    var access = await SegmentStudioAuthorization.AuthorizeBrowseReadAsync(
                        principalAccessor.Current, authorization, ct);
                    if (!access.Allowed)
                        return Results.Json(new { error = access.Reason ?? "You cannot view rejected segments." }, statusCode: StatusCodes.Status403Forbidden);
                    var videoId = int.TryParse(request.Query["videoId"].FirstOrDefault(), out var parsedVideoId)
                        ? parsedVideoId
                        : (int?)null;
                    return Results.Ok(await BasicNativeRecycleBinService.GetAsync(
                        db, videoId, principalAccessor.Current, authorization, ct));
                })
            .RequireAuthorization()
            .RequireCovePermission(PermissionMode.All, Permissions.SegmentsRead, Permissions.TagsRead)
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.RecyclingBinView);

        endpoints.MapPost(
                "/api/plugins/segment-studio/bin/empty",
                async Task<IResult> (EmptyBinRequest request, DbContext db,
                    ICurrentPrincipalAccessor principalAccessor, Cove.Core.Auth.IAuthorizationService authorization,
                    [FromServices] ISegmentSpanCacheInvalidator spanCacheInvalidator, CancellationToken ct) =>
                {
                    if (await SegmentStudioCompatibilityService.RequiresLegacyUiAsync(db, ct))
                        return LegacyUiRequiredResult();
                    var strategy = db.Database.CreateExecutionStrategy();
                    var result = await strategy.ExecuteAsync(async () =>
                    {
                        await using var transaction = db.Database.IsRelational()
                            ? await db.Database.BeginTransactionAsync(ct)
                            : null;
                        var emptied = await BasicNativeRecycleBinService.EmptyAsync(
                            db, request, principalAccessor.Current, authorization, ct);
                        if (emptied.Status == SegmentTransitionStatus.Updated && transaction is not null)
                            await transaction.CommitAsync(ct);
                        return emptied;
                    });
                    if (result.Status == SegmentTransitionStatus.Updated)
                    {
                        foreach (var videoId in result.VideoIds ?? [])
                            PublishSegmentInvalidation(spanCacheInvalidator, videoId);
                    }
                    return result.Status switch
                    {
                        SegmentTransitionStatus.Updated => Results.Ok(result),
                        SegmentTransitionStatus.Invalid => Results.BadRequest(new { error = result.Error, result }),
                        SegmentTransitionStatus.Forbidden =>
                            Results.Json(new { error = result.Error }, statusCode: StatusCodes.Status403Forbidden),
                        SegmentTransitionStatus.Conflict => Results.Conflict(new { error = result.Error, result }),
                        _ => Results.NotFound(new { error = result.Error }),
                    };
                })
            .RequireAuthorization()
            .RequireCovePermission(Permissions.SegmentsDelete)
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.RecyclingBinEmpty);

        endpoints.MapPost(
                "/api/plugins/segment-studio/videos/{videoId:int}/complete-review",
                async Task<IResult> (int videoId, CompleteReviewRequest request, DbContext db,
                    ICurrentPrincipalAccessor principalAccessor, Cove.Core.Auth.IAuthorizationService authorization,
                    [FromServices] IBlobService blobs, [FromServices] ISegmentSpanCacheInvalidator spanCacheInvalidator, CancellationToken ct) =>
                {
                    if (await SegmentStudioCompatibilityService.RequiresLegacyUiAsync(db, ct))
                        return LegacyUiRequiredResult();
                    var strategy = db.Database.CreateExecutionStrategy();
                    var result = await strategy.ExecuteAsync(async () =>
                    {
                        await using var transaction = db.Database.IsRelational()
                            ? await db.Database.BeginTransactionAsync(ct)
                            : null;
                        var completion = await SegmentStudioReviewCompletionService.CompleteAsync(
                            db, videoId, request, principalAccessor.Current, authorization, blobs, ct);
                        if (completion.Status == ReviewCompletionStatus.Completed)
                        {
                            await SegmentStudioHistoryService.ClearVideoAsync(db, videoId, ct);
                            if (transaction is not null)
                                await transaction.CommitAsync(ct);
                        }
                        return completion;
                    });
                    if (result.Status == ReviewCompletionStatus.Completed)
                        PublishSegmentInvalidation(spanCacheInvalidator, videoId);
                    return result.Status switch
                    {
                        ReviewCompletionStatus.Completed => Results.Ok(result),
                        ReviewCompletionStatus.NothingToPublish => Results.BadRequest(new { error = result.Error, result }),
                        ReviewCompletionStatus.Forbidden => Results.Json(new { error = result.Error }, statusCode: StatusCodes.Status403Forbidden),
                        ReviewCompletionStatus.Conflict => Results.Conflict(new { error = result.Error, result }),
                        ReviewCompletionStatus.MissingImage => Results.BadRequest(new { error = result.Error, code = "missing-image", result }),
                        _ => Results.NotFound(new { error = result.Error }),
                    };
                })
            .RequireAuthorization()
            .RequireCovePermission(Permissions.SegmentsWrite)
            .RequireCoveEntityAccess(EntityKinds.Video, "videoId")
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.SegmentReview);

        endpoints.MapPut(
                "/api/plugins/segment-studio/videos/{videoId:int}/segments/review-state",
                async Task<IResult> (int videoId, BulkSegmentReviewRequest request, DbContext db,
                    ICurrentPrincipalAccessor principalAccessor,
                    Cove.Core.Auth.IAuthorizationService authorization,
                    [FromServices] IBlobService blobs,
                    [FromServices] ISegmentSpanCacheInvalidator spanCacheInvalidator,
                    CancellationToken ct) =>
                {
                    if (await SegmentStudioCompatibilityService.RequiresLegacyUiAsync(db, ct))
                        return LegacyUiRequiredResult();
                    var strategy = db.Database.CreateExecutionStrategy();
                    var result = await strategy.ExecuteAsync(async () =>
                    {
                        await using var transaction = db.Database.IsRelational()
                            ? await db.Database.BeginTransactionAsync(ct)
                            : null;
                        var mutation = await BulkSegmentReviewService.UpdateAsync(
                            db, videoId, request, principalAccessor.Current,
                            authorization, blobs, ct);
                        if (mutation.Status == BulkSegmentReviewStatus.Updated
                            && transaction is not null)
                            await transaction.CommitAsync(ct);
                        return mutation;
                    });
                    if (result.Status == BulkSegmentReviewStatus.Updated)
                        PublishSegmentInvalidation(spanCacheInvalidator, videoId);
                    return result.Status switch
                    {
                        BulkSegmentReviewStatus.Updated => Results.Ok(result),
                        BulkSegmentReviewStatus.Invalid =>
                            Results.BadRequest(new { error = result.Error, result.Code, result }),
                        BulkSegmentReviewStatus.MissingImage =>
                            Results.BadRequest(new { error = result.Error, code = "missing-image", result }),
                        BulkSegmentReviewStatus.Forbidden => Results.Json(
                            new { error = result.Error }, statusCode: StatusCodes.Status403Forbidden),
                        BulkSegmentReviewStatus.Conflict => Results.Conflict(new
                        {
                            error = result.Error,
                            result.Code,
                            currentHistory = result.History,
                        }),
                        _ => Results.NotFound(new { error = result.Error }),
                    };
                })
            .RequireAuthorization()
            .RequireCovePermission(Permissions.SegmentsWrite)
            .RequireCoveEntityAccess(EntityKinds.Video, "videoId")
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.SegmentReview);

        endpoints.MapPost(
                "/api/plugins/segment-studio/videos/{videoId:int}/segments/move-to-bin",
                async Task<IResult> (int videoId, NativeToOwnedTransitionBatchRequest request, DbContext db,
                    ICurrentPrincipalAccessor principalAccessor, Cove.Core.Auth.IAuthorizationService authorization,
                    [FromServices] IBlobService blobs, [FromServices] ISegmentSpanCacheInvalidator spanCacheInvalidator, CancellationToken ct) =>
                {
                    if (await SegmentStudioCompatibilityService.RequiresLegacyUiAsync(db, ct))
                        return LegacyUiRequiredResult();
                    if (principalAccessor.Current?.UserId is not int userId)
                        return Results.Unauthorized();
                    var profile = await SegmentStudioFeatureProfileService.GetAsync(
                        db, userId, ct);
                    var strategy = db.Database.CreateExecutionStrategy();
                    var result = await strategy.ExecuteAsync(async () =>
                    {
                        await using var transaction = db.Database.IsRelational()
                            ? await db.Database.BeginTransactionAsync(ct)
                            : null;
                        var basicHistory =
                            profile.EffectiveMode == SegmentStudioModes.Basic
                                ? await PrepareBasicHistoryAsync(
                                    db,
                                    request.HistoryReceiptId,
                                    principalAccessor.Current,
                                    videoId,
                                    request.Segments.Select(
                                        segment => segment.SegmentId),
                                    ct)
                                : null;
                        if (basicHistory?.Exists == true)
                        {
                            return new NativeToOwnedTransitionBatchResult(
                                SegmentTransitionStatus.Conflict,
                                VideoId: videoId,
                                Error: BasicHistoryReceiptReplayError,
                                Code: BasicHistoryReceiptReplayCode);
                        }
                        var transition = profile.EffectiveMode == SegmentStudioModes.Basic
                            ? await BasicNativeRecycleBinService.MoveManyAsync(
                                db, videoId, request, principalAccessor.Current,
                                authorization, blobs, ct)
                            : await SegmentOwnershipTransitionService.MoveManyNativeToOwnedAsync(
                                db, videoId, request, principalAccessor.Current,
                                authorization, blobs, ct);
                        if (transition.Status == SegmentTransitionStatus.Updated)
                        {
                            if (profile.EffectiveMode ==
                                SegmentStudioModes.Basic)
                            {
                                var count = transition.Items?.Count ?? 0;
                                await CompleteBasicBinHistoryAsync(
                                    db,
                                    basicHistory,
                                    videoId,
                                    $"Moved {count} segment{(count == 1 ? "" : "s")} to recycling bin",
                                    transition.Items?.Select(item => item.ItemId)
                                        ?? [],
                                    ct);
                            }
                            if (transaction is not null)
                                await transaction.CommitAsync(ct);
                        }
                        return transition;
                    });
                    if (result.Status == SegmentTransitionStatus.Updated)
                        PublishSegmentInvalidation(spanCacheInvalidator, videoId);
                    return result.Status switch
                    {
                        SegmentTransitionStatus.Updated => Results.Ok(result),
                        SegmentTransitionStatus.Invalid or SegmentTransitionStatus.MissingImage =>
                            Results.BadRequest(new { error = result.Error, result }),
                        SegmentTransitionStatus.Forbidden =>
                            Results.Json(new { error = result.Error }, statusCode: StatusCodes.Status403Forbidden),
                        SegmentTransitionStatus.Conflict => Results.Conflict(new { error = result.Error, code = result.Code, result }),
                        _ => Results.NotFound(new { error = result.Error }),
                    };
                })
            .RequireAuthorization()
            .RequireCovePermission(Permissions.SegmentsDelete)
            .RequireCoveEntityAccess(EntityKinds.Video, "videoId")
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.NativeSegmentsRemove);

        endpoints.MapPost(
                "/api/plugins/segment-studio/videos/{videoId:int}/segments/{segmentId:int}/move-to-bin",
                async Task<IResult> (int videoId, int segmentId, NativeToOwnedTransitionRequest request, DbContext db,
                    ICurrentPrincipalAccessor principalAccessor, Cove.Core.Auth.IAuthorizationService authorization,
                    [FromServices] IBlobService blobs, [FromServices] ISegmentSpanCacheInvalidator spanCacheInvalidator, CancellationToken ct) =>
                {
                    if (await SegmentStudioCompatibilityService.RequiresLegacyUiAsync(db, ct))
                        return LegacyUiRequiredResult();
                    if (principalAccessor.Current?.UserId is not int userId)
                        return Results.Unauthorized();
                    var profile = await SegmentStudioFeatureProfileService.GetAsync(
                        db, userId, ct);
                    var strategy = db.Database.CreateExecutionStrategy();
                    var result = await strategy.ExecuteAsync(async () =>
                    {
                        await using var transaction = db.Database.IsRelational()
                            ? await db.Database.BeginTransactionAsync(ct)
                            : null;
                        var basicHistory =
                            profile.EffectiveMode == SegmentStudioModes.Basic
                                ? await PrepareBasicHistoryAsync(
                                    db,
                                    request.HistoryReceiptId,
                                    principalAccessor.Current,
                                    videoId,
                                    [segmentId],
                                    ct)
                                : null;
                        if (basicHistory?.Exists == true)
                        {
                            return new SegmentTransitionResult(
                                SegmentTransitionStatus.Conflict,
                                VideoId: videoId,
                                Error: BasicHistoryReceiptReplayError,
                                Code: BasicHistoryReceiptReplayCode);
                        }
                        var transition = profile.EffectiveMode == SegmentStudioModes.Basic
                            ? await BasicNativeRecycleBinService.MoveAsync(
                                db, videoId, segmentId, request,
                                principalAccessor.Current, authorization, blobs, ct)
                            : await SegmentOwnershipTransitionService.MoveNativeToOwnedAsync(
                                db, videoId, segmentId, request,
                                principalAccessor.Current, authorization, blobs, ct);
                        if (transition.Status == SegmentTransitionStatus.Updated)
                        {
                            if (profile.EffectiveMode ==
                                SegmentStudioModes.Basic)
                            {
                                await CompleteBasicBinHistoryAsync(
                                    db,
                                    basicHistory,
                                    videoId,
                                    "Moved 1 segment to recycling bin",
                                    transition.ItemId is long entryId
                                        ? [entryId]
                                        : [],
                                    ct);
                            }
                            if (transaction is not null)
                                await transaction.CommitAsync(ct);
                        }
                        return transition;
                    });
                    if (result.Status == SegmentTransitionStatus.Updated)
                        PublishSegmentInvalidation(spanCacheInvalidator, videoId);
                    return ToTransitionHttpResult(result);
                })
            .RequireAuthorization()
            .RequireCovePermission(Permissions.SegmentsDelete)
            .RequireCoveEntityAccess(EntityKinds.Video, "videoId")
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.NativeSegmentsRemove);

        endpoints.MapPost(
                "/api/plugins/segment-studio/bin/{itemId:long}/restore",
                async Task<IResult> (long itemId, [FromBody] OwnedSegmentMutationRequest request, DbContext db,
                    ICurrentPrincipalAccessor principalAccessor, Cove.Core.Auth.IAuthorizationService authorization,
                    [FromServices] IBlobService blobs, [FromServices] ISegmentSpanCacheInvalidator spanCacheInvalidator, CancellationToken ct) =>
                {
                    if (await SegmentStudioCompatibilityService.RequiresLegacyUiAsync(db, ct))
                        return LegacyUiRequiredResult();
                    var strategy = db.Database.CreateExecutionStrategy();
                    var result = await strategy.ExecuteAsync(async () =>
                    {
                        await using var transaction = db.Database.IsRelational()
                            ? await db.Database.BeginTransactionAsync(ct)
                            : null;
                        var transition = await BasicNativeRecycleBinService.RestoreAsync(
                            db, itemId, request, principalAccessor.Current, authorization, blobs, ct);
                        if (transition.Status == SegmentTransitionStatus.Updated && transaction is not null)
                            await transaction.CommitAsync(ct);
                        return transition;
                    });
                    if (result.Status == SegmentTransitionStatus.Updated && result.VideoId is int videoId)
                        PublishSegmentInvalidation(spanCacheInvalidator, videoId);
                    return ToTransitionHttpResult(result);
                })
            .RequireAuthorization()
            .RequireCovePermission(Permissions.SegmentsWrite)
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.RecyclingBinRestore);

        endpoints.MapDelete(
                "/api/plugins/segment-studio/bin/{itemId:long}",
                async Task<IResult> (long itemId, [FromBody] OwnedSegmentMutationRequest request, DbContext db,
                    ICurrentPrincipalAccessor principalAccessor, Cove.Core.Auth.IAuthorizationService authorization,
                    [FromServices] ISegmentSpanCacheInvalidator spanCacheInvalidator, CancellationToken ct) =>
                {
                    if (await SegmentStudioCompatibilityService.RequiresLegacyUiAsync(db, ct))
                        return LegacyUiRequiredResult();
                    var strategy = db.Database.CreateExecutionStrategy();
                    var result = await strategy.ExecuteAsync(async () =>
                    {
                        await using var transaction = db.Database.IsRelational()
                            ? await db.Database.BeginTransactionAsync(ct)
                            : null;
                        var transition = await BasicNativeRecycleBinService.PurgeAsync(
                            db, itemId, request, principalAccessor.Current, authorization, ct);
                        if (transition.Status == SegmentTransitionStatus.Updated && transaction is not null)
                            await transaction.CommitAsync(ct);
                        return transition;
                    });
                    if (result.Status == SegmentTransitionStatus.Updated)
                    {
                        if (result.VideoId is int videoId)
                            PublishSegmentInvalidation(spanCacheInvalidator, videoId);
                    }
                    return ToTransitionHttpResult(result);
                })
            .RequireAuthorization()
            .RequireCovePermission(Permissions.SegmentsDelete)
            .RequireSegmentStudioCapability(
                SegmentStudioCapabilities.RecyclingBinEmpty);
    }

    private static IResult LegacyUiRequiredResult() => Results.Conflict(new
    {
        error = "This installation contains legacy Segment Studio review decisions. Use the compatibility UI until normalization is available.",
    });

    private static async Task<bool> UsesFullWorkflowAsync(
        DbContext db,
        ICurrentPrincipalAccessor principalAccessor,
        CancellationToken ct)
    {
        if (principalAccessor.Current?.UserId is not int userId)
            return false;
        return (await SegmentStudioFeatureProfileService.GetAsync(
            db, userId, ct)).EffectiveMode == SegmentStudioModes.Full;
    }

    private const string BasicHistoryReceiptReplayError =
        "This history-backed mutation was already completed. Reload before trying again.";
    private const string BasicHistoryReceiptReplayCode =
        "history_receipt_replayed";

    private static DirectSegmentMutationResult
        BasicHistoryReceiptReplayDirectResult() =>
        new(
            DirectSegmentMutationStatus.Conflict,
            Error: BasicHistoryReceiptReplayError,
            Code: BasicHistoryReceiptReplayCode);

    private static async Task<BasicHistoryPreparation?> PrepareBasicHistoryAsync(
        DbContext db,
        Guid? receiptId,
        CovePrincipal? principal,
        int videoId,
        IEnumerable<int> beforeSegmentIds,
        CancellationToken ct)
    {
        if (receiptId is null)
            return null;
        if (receiptId == Guid.Empty)
            throw new ArgumentException("History receipt ID is required.");
        if (principal?.UserId is not int userId)
            throw new UnauthorizedAccessException(
                "A signed-in user is required for Basic history.");
        if (await BasicNativeHistoryReceiptService.ExistsAsync(
                db, receiptId.Value, userId, videoId, ct))
            return new(receiptId.Value, userId, null, true);
        await SegmentStudioReviewLock.AcquireAsync(db, videoId, ct);
        if (await BasicNativeHistoryReceiptService.ExistsAsync(
                db, receiptId.Value, userId, videoId, ct))
            return new(receiptId.Value, userId, null, true);
        return new(
            receiptId.Value,
            userId,
            await BasicNativeHistoryReceiptService.CaptureNativeStateAsync(
                db, videoId, beforeSegmentIds, ct),
            false);
    }

    private static async Task CompleteBasicNativeHistoryAsync(
        DbContext db,
        BasicHistoryPreparation? preparation,
        int videoId,
        string kind,
        string label,
        IEnumerable<int> afterSegmentIds,
        CancellationToken ct)
    {
        if (preparation is null || preparation.Exists)
            return;
        var after = await BasicNativeHistoryReceiptService
            .CaptureNativeStateAsync(
                db, videoId, afterSegmentIds, ct);
        await BasicNativeHistoryReceiptService.RecordAsync(
            db,
            preparation.ReceiptId,
            preparation.UserId,
            new(
                videoId,
                kind,
                label,
                preparation.BeforeState!.Value,
                after),
            ct);
    }

    private static async Task CompleteBasicBinHistoryAsync(
        DbContext db,
        BasicHistoryPreparation? preparation,
        int videoId,
        string label,
        IEnumerable<long> binEntryIds,
        CancellationToken ct)
    {
        if (preparation is null || preparation.Exists)
            return;
        var after = await BasicNativeHistoryReceiptService
            .CaptureBinStateAsync(db, binEntryIds, ct);
        await BasicNativeHistoryReceiptService.RecordAsync(
            db,
            preparation.ReceiptId,
            preparation.UserId,
            new(
                videoId,
                "segments.moveToBin",
                label,
                preparation.BeforeState!.Value,
                after),
            ct);
    }

    private static IResult ToTransitionHttpResult(SegmentTransitionResult result) => result.Status switch
    {
        SegmentTransitionStatus.Updated => Results.Ok(result),
        SegmentTransitionStatus.MissingImage => Results.BadRequest(new { error = result.Error, code = "missing-image", result }),
        SegmentTransitionStatus.Invalid => Results.BadRequest(new { error = result.Error, result }),
        SegmentTransitionStatus.Forbidden => Results.Json(new { error = result.Error }, statusCode: StatusCodes.Status403Forbidden),
        SegmentTransitionStatus.Conflict => Results.Conflict(new { error = result.Error, code = result.Code, result }),
        _ => Results.NotFound(new { error = result.Error }),
    };

    private static IResult ToDraftHttpResult(SegmentDraftMutationResult result) => result.Status switch
    {
        SegmentDraftMutationStatus.Updated => Results.Ok(result),
        SegmentDraftMutationStatus.Invalid => Results.BadRequest(new { error = result.Error, result }),
        SegmentDraftMutationStatus.Forbidden => Results.Json(new { error = result.Error }, statusCode: StatusCodes.Status403Forbidden),
        SegmentDraftMutationStatus.Conflict => Results.Conflict(new { error = result.Error, code = result.Code, result }),
        _ => Results.NotFound(new { error = result.Error }),
    };

    private static async Task<int?> ResolveItemVideoIdAsync(
        DbContext db,
        long itemId,
        CancellationToken ct)
    {
        var item = await db.Set<SegmentStudioItem>().AsNoTracking()
            .SingleOrDefaultAsync(candidate => candidate.Id == itemId, ct);
        if (item is null)
            return null;
        if (item.VideoId is int videoId)
            return videoId;
        if (item.NativeSegmentId is not int nativeSegmentId)
            return null;
        return await db.Set<Segment>().AsNoTracking()
            .Where(segment =>
                segment.Id == nativeSegmentId
                && segment.HostType == SegmentHostType.Video)
            .Select(segment => (int?)segment.HostId)
            .SingleOrDefaultAsync(ct);
    }

    private static void PublishSegmentInvalidation(
        ISegmentSpanCacheInvalidator spanCacheInvalidator,
        int videoId) =>
        spanCacheInvalidator.InvalidateVideo(videoId);

    private static VideoDiscoveryQuery ParseDiscoveryQuery(
        IQueryCollection query,
        bool fullWorkflow,
        bool legacyCompatibilityRequired)
    {
        static int ReadInt(IQueryCollection values, string key, int fallback) =>
            int.TryParse(values[key].FirstOrDefault(), out var parsed) ? parsed : fallback;
        static int? ReadNullableInt(IQueryCollection values, string key) =>
            int.TryParse(values[key].FirstOrDefault(), out var parsed) ? parsed : null;
        static bool? ReadNullableBool(IQueryCollection values, string key) =>
            bool.TryParse(values[key].FirstOrDefault(), out var parsed) ? parsed : null;
        static int[] ReadIds(IQueryCollection values, string key) =>
            values[key]
                .SelectMany(value => (value ?? "").Split(',', StringSplitOptions.RemoveEmptyEntries))
                .Select(value => int.TryParse(value, out var parsed) ? parsed : 0)
                .Where(value => value > 0)
                .Distinct()
                .ToArray();

        var segmentTagId = ReadNullableInt(query, "segmentTagId")
            ?? ReadNullableInt(query, "tagId");

        var sort = query["sort"].FirstOrDefault();
        if (!fullWorkflow && sort == "unreviewed_count")
            sort = null;
        return new VideoDiscoveryQuery(
            Page: ReadInt(query, "page", 1),
            PerPage: ReadInt(query, "perPage", 24),
            Query: query["q"].FirstOrDefault(),
            Sort: sort,
            Direction: query["direction"].FirstOrDefault(),
            Seed: ReadNullableInt(query, "seed"),
            HasSegments: ReadNullableBool(query, "hasSegments"),
            ReviewState: fullWorkflow
                ? query["reviewState"].FirstOrDefault()
                : null,
            SegmentTagId: segmentTagId,
            SegmentTagIds: ReadIds(query, "segmentTag"),
            ExcludedSegmentTagIds: ReadIds(query, "excludeSegmentTag"),
            SegmentTagMode: query["segmentTagMode"].FirstOrDefault(),
            IncludeSegmentSubtags: ReadNullableBool(query, "includeSegmentSubtags") is true,
            VideoTagIds: ReadIds(query, "videoTag").Concat(ReadIds(query, "videoTagIds")).Distinct().ToArray(),
            ExcludedVideoTagIds: ReadIds(query, "excludeVideoTag"),
            VideoTagMode: query["videoTagMode"].FirstOrDefault(),
            IncludeVideoSubtags: ReadNullableBool(query, "includeVideoSubtags") is true,
            PerformerIds: ReadIds(query, "performer").Concat(ReadIds(query, "performerIds")).Distinct().ToArray(),
            ExcludedPerformerIds: ReadIds(query, "excludePerformer"),
            PerformerMode: query["performerMode"].FirstOrDefault(),
            StudioId: ReadNullableInt(query, "studioId"),
            StudioIds: ReadIds(query, "studio"),
            ExcludedStudioIds: ReadIds(query, "excludeStudio"),
            StudioMode: query["studioMode"].FirstOrDefault(),
            IncludeSubstudios: ReadNullableBool(query, "includeSubstudios") is true,
            HasShotBoundaries: fullWorkflow
                ? ReadNullableBool(query, "hasShotBoundaries")
                : null,
            Workflow: fullWorkflow
                ? legacyCompatibilityRequired ? "compatibility" : "full"
                : "basic");
    }

    private sealed record SegmentStudioVideoFile(string Format, double Duration, string AudioCodec, double FrameRate);

    private static SegmentStudioAnalysisRunResponse ToAnalysisRunResponse(
        SegmentStudioAnalysisRun run, IEnumerable<SegmentStudioAnalysisCandidate> candidates) =>
        new(
            run.Id,
            run.VideoId,
            run.VideoFileId,
            run.Status,
            JsonSerializer.Deserialize<IReadOnlyList<SegmentStudioAnalysisKind>>(
                run.AnalysesJson, new JsonSerializerOptions(JsonSerializerDefaults.Web)
                {
                    Converters = { new JsonStringEnumConverter<SegmentStudioAnalysisKind>(JsonNamingPolicy.CamelCase) },
                }) ?? [],
            run.JobId,
            run.ServiceRunId,
            run.SourceFingerprint,
            candidates.Select(candidate => new SegmentStudioAnalysisCandidateResponse(
                candidate.Id,
                candidate.CandidateKey,
                candidate.Kind,
                candidate.TagName,
                candidate.Title,
                candidate.StartSec,
                candidate.EndSec,
                candidate.Confidence,
                candidate.ModelKey,
                candidate.ObservationCount,
                candidate.ReviewState)).ToArray(),
            run.ErrorCode,
            run.ErrorMessage,
            run.CreatedAt,
            run.UpdatedAt,
            run.CompletedAt);

    private sealed record SegmentStudioEditorVideo(
        int Id,
        string? Title,
        DateTime UpdatedAt,
        SegmentStudioVideoFile? VideoFile);

    private sealed record SegmentStudioEditorResponse(
        string Mode,
        SegmentStudioEditorVideo Video,
        IReadOnlyList<SegmentStudioEditorItem> Segments,
        IReadOnlyList<ShotBoundaryResponse> ShotBoundaries,
        IReadOnlyList<SegmentGroupResponse> SegmentGroups,
        IReadOnlyList<PerformerSlotEditorItem> PerformerSlots,
        IReadOnlyDictionary<long, string> PerformerSlotRevisions,
        IReadOnlyList<PerformerSlotCandidate> PerformerCandidates,
        bool PerformerSlotsAvailable,
        bool ItemMetadataAvailable,
        bool LineageMetadataAvailable,
        IReadOnlyDictionary<long, SegmentEditorItemMetadata> ItemMetadata,
        string? ApprovedSetVersion,
        int NativeImportCount);

    private sealed record SegmentStudioBasicEditorResponse(
        string Mode,
        SegmentStudioEditorVideo Video,
        IReadOnlyList<SegmentStudioBasicEditorItem> Segments,
        IReadOnlyList<SegmentGroupResponse> SegmentGroups,
        bool ItemMetadataAvailable);

    private sealed record SegmentStudioBasicEditorItem(
        string Key,
        long Id,
        int NativeSegmentId,
        int VideoId,
        int TagId,
        string? TagName,
        double StartSec,
        double? EndSec,
        string Kind,
        string? RefId,
        string? PayloadJson,
        DateTime UpdatedAt,
        string SourceKey,
        string? SourceRunId,
        float? Confidence,
        string? Title,
        string? ColorHint,
        string? ImageBlobId,
        DateTime CreatedAt,
        IReadOnlyList<SegmentStudioBasicFieldProvenance> FieldProvenance);

    private sealed record SegmentStudioBasicEditorRow(
        int Id,
        int VideoId,
        int TagId,
        string? TagName,
        double StartSec,
        double? EndSec,
        string? Kind,
        long? RefId,
        JsonDocument? Payload,
        DateTime UpdatedAt,
        string SourceKey,
        string? SourceRunId,
        float? Confidence,
        string? Title,
        string? ColorHint,
        string? ImageBlobId,
        DateTime CreatedAt);

    private sealed record SegmentStudioBasicFieldProvenance(
        int NativeSegmentId,
        string FieldKey,
        [property: JsonIgnore] string? ValueJson,
        string SourceKey,
        string SourceRunId,
        string ModelKey,
        float? Confidence,
        DateTime CreatedAt,
        DateTime UpdatedAt)
    {
        [JsonPropertyName("value")]
        public JsonElement? Value => ParseValue(ValueJson);

        private static JsonElement? ParseValue(string? json)
        {
            if (json is null) return null;
            using var document = JsonDocument.Parse(json);
            return document.RootElement.Clone();
        }
    }

    private sealed record BasicHistoryPreparation(
        Guid ReceiptId,
        int UserId,
        JsonElement? BeforeState,
        bool Exists);

    private sealed record BasicNativeCreateOutcome(
        BasicNativeSegmentSnapshot? Segment,
        bool Replayed);

    private sealed record SegmentStudioEditorItem(
        string Key,
        long Id,
        long? ItemId,
        int? NativeSegmentId,
        int VideoId,
        int TagId,
        string? TagName,
        double StartSec,
        double? EndSec,
        string ReviewState,
        string Residence,
        bool Published,
        long Revision,
        DateTime UpdatedAt,
        string SourceKey,
        string? SourceRunId,
        float? Confidence,
        bool IsDerived = false);

    private sealed record SegmentStudioEditorRow(
        int Id,
        int TagId,
        string? TagName,
        double StartSec,
        double? EndSec,
        System.Text.Json.JsonDocument? Payload,
        DateTime UpdatedAt,
        string SourceKey,
        string? SourceRunId,
        float? Confidence);
}

public sealed class SegmentStudioAnalysisProgressRelay(
    Action<SegmentStudioAnalysisProgress> report)
    : IProgress<SegmentStudioAnalysisProgress>
{
    public void Report(SegmentStudioAnalysisProgress value) => report(value);
}
