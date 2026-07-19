using System.Security.Cryptography;
using System.Text;
using Cove.Core.Auth;
using Cove.Core.Entities;
using Cove.Core.Interfaces;
using Cove.Plugins;
using Cove.Sdk;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;

namespace AnimatedTagPreviews;

public sealed class AnimatedTagPreviewsExtension : FullExtensionBase
{
    private const string ApiBase = "/api/extensions/animated-tag-previews";
    private IPreviewJobCoordinator? _jobCoordinator;

    public override void ConfigureServices(IServiceCollection services, ExtensionContext context)
    {
        services.AddSingleton<IPreviewStateStore>(_ => new PreviewStateStore(() => Store));
        services.AddSingleton<IExternalToolRunner, ExternalToolRunner>();
        services.AddSingleton<ITemporaryFileProvider, TemporaryFileProvider>();
        services.AddSingleton<IPreviewHealthService, PreviewHealthService>();
        services.AddSingleton<PreviewMutationGate>();
        services.AddSingleton<IPreviewMaintenanceService, PreviewMaintenanceService>();
        services.AddSingleton<IPreviewJobCoordinator, PreviewJobCoordinator>();
        services.AddScoped<IPreviewGenerationService, PreviewGenerationService>();
    }

    public override Task InitializeAsync(IServiceProvider services, CancellationToken ct = default)
    {
        _jobCoordinator = services.GetRequiredService<IPreviewJobCoordinator>();
        return Task.CompletedTask;
    }

    public override async Task ShutdownAsync(CancellationToken ct = default)
    {
        if (_jobCoordinator is not null)
            await _jobCoordinator.CancelAllAsync();
        _jobCoordinator = null;
    }

    public override UIManifest GetUIManifest()
        => ManifestBuilder()
            .AddSlot("media-player-actions", "AnimatedPreviewPlayerAction", "animated-tag-previews:player-action", 100)
            .AddSlot("media-player-overlay", "AnimatedPreviewPlayerOverlay", "animated-tag-previews:player-overlay", 100)
            .OverrideComponent("entity.media", "AnimatedTagMedia", 100)
            .AddSettingsTab(
                "animated-tag-previews",
                "Animated tag previews",
                order: 140,
                icon: "film",
                description: "Generate and configure animated tag media.",
                searchKeywords: ["webm", "tag", "preview", "ffmpeg"])
            .AddSettingsSection(
                "animated-tag-previews",
                "Animated tag previews",
                "AnimatedPreviewSettings",
                "animated-tag-previews:settings",
                100)
            .Build();

    public override void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet($"{ApiBase}/health", GetHealthAsync)
            .RequireCovePermission(Permissions.JobsRun);

        endpoints.MapGet($"{ApiBase}/tags", GetIndexAsync)
            .RequireCovePermission(Permissions.TagsRead);

        endpoints.MapGet($"{ApiBase}/videos/{{videoId:int}}/source", GetPreviewSourceAsync)
            .RequireCovePermission(Permissions.VideosRead)
            .RequireCoveEntityAccess(EntityKinds.Video, "videoId", Permissions.VideosRead);

        endpoints.MapGet($"{ApiBase}/videos/{{videoId:int}}/source/media", GetPreviewSourceMediaAsync)
            .RequireCovePermission(Permissions.VideosRead, Permissions.StreamRead)
            .RequireCoveEntityAccess(EntityKinds.Video, "videoId", Permissions.VideosRead);

        endpoints.MapPost($"{ApiBase}/videos/{{videoId:int}}/tags/{{tagId:int}}/generate", GenerateAsync)
            .RequireCovePermission(Permissions.VideosRead, Permissions.TagsWrite, Permissions.JobsRun)
            .RequireCoveEntityAccess(EntityKinds.Video, "videoId", Permissions.VideosRead)
            .RequireCoveEntityAccess(EntityKinds.Tag, "tagId", Permissions.TagsWrite);

        endpoints.MapGet($"{ApiBase}/videos/{{videoId:int}}/tags/{{tagId:int}}/jobs/{{jobId}}", GetJob)
            .RequireCovePermission(Permissions.VideosRead, Permissions.TagsRead, Permissions.JobsRead)
            .RequireCoveEntityAccess(EntityKinds.Video, "videoId", Permissions.VideosRead)
            .RequireCoveEntityAccess(EntityKinds.Tag, "tagId", Permissions.TagsRead);

        endpoints.MapDelete($"{ApiBase}/videos/{{videoId:int}}/tags/{{tagId:int}}/jobs/{{jobId}}", CancelJobAsync)
            .RequireCovePermission(Permissions.VideosRead, Permissions.TagsWrite, Permissions.JobsCancel)
            .RequireCoveEntityAccess(EntityKinds.Video, "videoId", Permissions.VideosRead)
            .RequireCoveEntityAccess(EntityKinds.Tag, "tagId", Permissions.TagsWrite);

        endpoints.MapGet($"{ApiBase}/tags/{{tagId:int}}/media", GetMediaAsync)
            .RequireCovePermission(Permissions.TagsRead)
            .RequireCoveEntityAccess(EntityKinds.Tag, "tagId", Permissions.TagsRead);

        endpoints.MapDelete($"{ApiBase}/tags/{{tagId:int}}/media", DeleteMediaAsync)
            .RequireCovePermission(Permissions.TagsWrite)
            .RequireCoveEntityAccess(EntityKinds.Tag, "tagId", Permissions.TagsWrite);

        endpoints.MapGet($"{ApiBase}/settings", GetSettingsAsync)
            .RequireCovePermission(Permissions.TagsRead);

        endpoints.MapPut($"{ApiBase}/settings", PutSettingsAsync)
            .RequireCovePermission(Permissions.ExtensionsConfigure);

        endpoints.MapPost($"{ApiBase}/cleanup/orphans", CleanupOrphansAsync)
            .RequireCovePermission(Permissions.ExtensionsConfigure, Permissions.LibraryClean, Permissions.JobsRun);
    }

    private static Task<PreviewHealthResponse> GetHealthAsync(IPreviewHealthService health, CancellationToken ct)
        => health.GetAsync(ct);

    private static async Task<IResult> GetPreviewSourceAsync(int videoId, IVideoRepository videos, CancellationToken ct)
    {
        var video = await videos.GetByIdWithRelationsAsync(videoId, ct);
        if (video is null) return Results.NotFound();
        var source = PreviewSourceResolver.Resolve(video, null);
        return source.IsValid
            ? Results.Ok(new { fileId = source.Value!.File.Id })
            : ValidationProblem(source.Errors);
    }

    private static async Task<IResult> GetPreviewSourceMediaAsync(int videoId, int fileId, IVideoRepository videos, CancellationToken ct)
    {
        var video = await videos.GetByIdWithRelationsAsync(videoId, ct);
        if (video is null) return Results.NotFound();
        var source = PreviewSourceResolver.Resolve(video, fileId);
        if (!source.IsValid) return ValidationProblem(source.Errors);
        var contentType = Path.GetExtension(source.Value!.Path).ToLowerInvariant() switch
        {
            ".mp4" or ".m4v" => "video/mp4",
            ".webm" => "video/webm",
            ".ogv" or ".ogg" => "video/ogg",
            ".mov" => "video/quicktime",
            ".mpeg" or ".mpg" => "video/mpeg",
            _ => "application/octet-stream"
        };
        return Results.File(source.Value.Path, contentType, enableRangeProcessing: true);
    }

    private static async Task<IResult> GetIndexAsync(
        IPreviewStateStore state,
        IAuthorizationService authorization,
        ICurrentPrincipalAccessor principals,
        ITagRepository tags,
        CancellationToken ct)
    {
        var previews = await state.GetPreviewsAsync(ct);
        var visible = new List<PreviewRecord>(previews.Count);
        foreach (var preview in previews)
        {
            if (await tags.GetByIdAsync(preview.TagId, ct) is null)
                continue;
            var decision = await authorization.AuthorizeAsync(
                principals.Current,
                Permissions.TagsRead,
                new EntityRef(EntityKinds.Tag, preview.TagId.ToString(System.Globalization.CultureInfo.InvariantCulture)),
                ct);
            if (decision.Allowed)
                visible.Add(preview);
        }

        var items = visible
            .Select(preview => new PreviewIndexItem(
                preview.TagId,
                preview.Version,
                $"{ApiBase}/tags/{preview.TagId}/media?v={Uri.EscapeDataString(preview.Version)}"))
            .ToArray();
        return Results.Ok(new PreviewIndexResponse(CalculateIndexVersion(items), items));
    }

    private static async Task<IResult> GenerateAsync(
        int videoId,
        int tagId,
        GeneratePreviewRequest request,
        IVideoRepository videos,
        ITagRepository tags,
        IPreviewStateStore state,
        IPreviewHealthService health,
        IPreviewJobCoordinator jobs,
        IAuditService audit,
        ICurrentPrincipalAccessor principals,
        CancellationToken ct)
    {
        if (videoId <= 0 || tagId <= 0)
            return ValidationProblem("videoId and tagId must be positive integers.");

        var dependencyHealth = await health.GetAsync(ct);
        if (!dependencyHealth.Healthy)
            return Results.Problem(
                string.Join(" ", new[] { dependencyHealth.Ffmpeg.Message, dependencyHealth.Ffprobe.Message, dependencyHealth.Vp9Encoder.Message }
                    .Where(message => !string.IsNullOrWhiteSpace(message))),
                statusCode: StatusCodes.Status503ServiceUnavailable,
                title: "Animated preview dependencies are unavailable.");

        var video = await videos.GetByIdWithRelationsAsync(videoId, ct);
        var tag = await tags.GetByIdAsync(tagId, ct);
        if (video is null || tag is null)
            return Results.NotFound();

        var source = PreviewSourceResolver.Resolve(video, request.SourceFileId);
        if (!source.IsValid)
            return ValidationProblem(source.Errors);
        var validation = PreviewRequestValidator.Validate(request, source.Value!.File.Duration, await state.GetSettingsAsync(ct));
        if (!validation.IsValid)
            return ValidationProblem(validation.Errors);

        var actor = principals.Current;
        if (actor is null)
            return Results.Unauthorized();
        string jobId;
        try
        {
            jobId = jobs.Enqueue(videoId, tagId, tag.Name, validation.Value!, actor);
        }
        catch (PreviewCoordinatorStoppingException ex)
        {
            return Results.Problem(ex.Message, statusCode: StatusCodes.Status503ServiceUnavailable, title: "Animated previews are stopping.");
        }
        await audit.LogAsync("animated_preview.generate.enqueue", AuditOutcomes.Success, actor, "tag",
            tagId.ToString(System.Globalization.CultureInfo.InvariantCulture), new { videoId, jobId }, ct);
        return Results.Accepted($"{ApiBase}/videos/{videoId}/tags/{tagId}/jobs/{Uri.EscapeDataString(jobId)}",
            new GeneratePreviewResponse(jobId, videoId, tagId));
    }

    private static IResult GetJob(int videoId, int tagId, string jobId, IPreviewJobCoordinator jobs)
        => jobs.Get(videoId, tagId, jobId) is { } job ? Results.Ok(job) : Results.NotFound();

    private static async Task<IResult> CancelJobAsync(
        int videoId,
        int tagId,
        string jobId,
        IPreviewJobCoordinator jobs,
        IAuditService audit,
        ICurrentPrincipalAccessor principals,
        CancellationToken ct)
    {
        var known = jobs.Get(videoId, tagId, jobId);
        if (known is null)
            return Results.NotFound();
        var cancelled = jobs.Cancel(videoId, tagId, jobId);
        await audit.LogAsync("animated_preview.generate.cancel", cancelled ? AuditOutcomes.Success : AuditOutcomes.Fail,
            principals.Current, "tag", tagId.ToString(System.Globalization.CultureInfo.InvariantCulture), new { videoId, jobId }, ct);
        return Results.Ok(new CancelPreviewJobResponse(jobId, cancelled));
    }

    private static async Task<IResult> GetMediaAsync(
        int tagId,
        HttpContext context,
        IPreviewStateStore state,
        IBlobService blobs,
        ITagRepository tags,
        CancellationToken ct)
    {
        if (await tags.GetByIdAsync(tagId, ct) is null)
            return Results.NotFound();
        var record = await state.GetPreviewAsync(tagId, ct);
        if (record is null)
            return Results.NotFound();

        var requestedVersion = context.Request.Query["v"].ToString();
        if (!string.IsNullOrEmpty(requestedVersion) && !string.Equals(requestedVersion, record.Version, StringComparison.Ordinal))
            return Results.NotFound();

        var blob = await blobs.GetBlobAsync(record.BlobId, ct);
        if (blob is null)
            return Results.NotFound();
        if (!string.Equals(blob.Value.ContentType, "video/webm", StringComparison.OrdinalIgnoreCase))
        {
            await blob.Value.Stream.DisposeAsync();
            return Results.Problem("Stored preview media has an invalid content type.", statusCode: StatusCodes.Status500InternalServerError);
        }

        context.Response.Headers.XContentTypeOptions = "nosniff";
        context.Response.Headers.CacheControl = string.IsNullOrEmpty(requestedVersion)
            ? "no-cache"
            : "private, max-age=31536000, immutable";
        return Results.File(blob.Value.Stream, "video/webm", enableRangeProcessing: blob.Value.Stream.CanSeek);
    }

    private static async Task<IResult> DeleteMediaAsync(
        int tagId,
        IPreviewMaintenanceService maintenance,
        IAuditService audit,
        ICurrentPrincipalAccessor principals,
        CancellationToken ct)
    {
        var result = await maintenance.DeleteAsync(tagId, ct);
        await audit.LogAsync("animated_preview.delete", result.Deleted ? AuditOutcomes.Success : AuditOutcomes.Fail,
            principals.Current, "tag", tagId.ToString(System.Globalization.CultureInfo.InvariantCulture), new { result.BlobDeleted }, ct);
        return Results.Ok(result);
    }

    private static Task<PreviewSettings> GetSettingsAsync(IPreviewStateStore state, CancellationToken ct)
        => state.GetSettingsAsync(ct);

    private static async Task<IResult> PutSettingsAsync(
        PreviewSettings settings,
        IPreviewStateStore state,
        IAuditService audit,
        ICurrentPrincipalAccessor principals,
        CancellationToken ct)
    {
        var validation = PreviewRequestValidator.ValidateSettings(settings);
        if (!validation.IsValid)
            return ValidationProblem(validation.Errors);
        await state.SaveSettingsAsync(validation.Value!, ct);
        await audit.LogAsync(AuditActions.SettingsChange, AuditOutcomes.Success, principals.Current,
            "extension", "animated-tag-previews", new { settings = "animated-tag-previews" }, ct);
        return Results.Ok(validation.Value);
    }

    private static async Task<IResult> CleanupOrphansAsync(
        bool dryRun,
        string? expectedVersion,
        IPreviewMaintenanceService maintenance,
        IAuditService audit,
        ICurrentPrincipalAccessor principals,
        CancellationToken ct)
    {
        OrphanCleanupResponse result;
        try
        {
            result = await maintenance.CleanupOrphansAsync(dryRun, expectedVersion, ct);
        }
        catch (OrphanSetChangedException ex)
        {
            return Results.Conflict(new { error = ex.Message, currentVersion = ex.CurrentVersion });
        }
        await audit.LogAsync("animated_preview.orphan_cleanup", AuditOutcomes.Success, principals.Current,
            "extension", "animated-tag-previews", new { dryRun, result.Count, result.DeletedBlobCount, failed = result.FailedBlobIds.Count }, ct);
        return Results.Ok(result);
    }

    private static IResult ValidationProblem(params string[] errors) => ValidationProblem((IReadOnlyList<string>)errors);

    private static IResult ValidationProblem(IReadOnlyList<string> errors)
        => Results.ValidationProblem(new Dictionary<string, string[]> { ["request"] = errors.ToArray() });

    private static string CalculateIndexVersion(IEnumerable<PreviewIndexItem> items)
    {
        var canonical = string.Join('|', items.Select(item => $"{item.TagId}:{item.Version}"));
        return Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(canonical)))[..16].ToLowerInvariant();
    }
}
