using System.Net;
using System.Net.Http.Json;
using System.Net.Http.Headers;
using AnimatedTagPreviews;
using Cove.Core.Auth;
using Cove.Core.Entities;
using Cove.Core.Interfaces;
using Cove.Plugins;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;

namespace AnimatedTagPreviews.Backend.Tests;

public sealed class PreviewEndpointTests
{
    private const string CandidateId = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";

    [Fact]
    public async Task Media_endpoint_serves_webm_ranges_with_immutable_and_nosniff_headers()
    {
        var state = new EndpointState
        {
            Records = [Record(42, "blob-a", "version-a")],
        };
        await using var app = await StartAppAsync(state, new EndpointBlobs([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]));
        using var request = new HttpRequestMessage(HttpMethod.Get,
            "/api/extensions/animated-tag-previews/tags/42/media?v=version-a");
        request.Headers.Range = new System.Net.Http.Headers.RangeHeaderValue(2, 5);

        var response = await app.GetTestClient().SendAsync(request);

        Assert.Equal(HttpStatusCode.PartialContent, response.StatusCode);
        Assert.Equal("video/webm", response.Content.Headers.ContentType!.MediaType);
        Assert.Equal("bytes 2-5/10", response.Content.Headers.ContentRange!.ToString());
        Assert.Equal([2, 3, 4, 5], await response.Content.ReadAsByteArrayAsync());
        Assert.Equal("nosniff", response.Headers.GetValues("X-Content-Type-Options").Single());
        Assert.Contains("immutable", response.Headers.CacheControl!.Extensions.Select(x => x.Name));
        Assert.True(response.Headers.CacheControl.Private);
        Assert.False(response.Headers.CacheControl.Public);
    }

    [Fact]
    public async Task Media_endpoint_rejects_a_stale_content_version()
    {
        var state = new EndpointState { Records = [Record(42, "blob-a", "current")] };
        await using var app = await StartAppAsync(state, new EndpointBlobs([1]));

        var response = await app.GetTestClient().GetAsync(
            "/api/extensions/animated-tag-previews/tags/42/media?v=stale");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task Candidate_media_endpoint_serves_private_webm_ranges_and_rejects_path_ownership_mismatches()
    {
        var state = new EndpointState
        {
            Candidates = [Candidate(CandidateId, 7, 42, "candidate-blob")],
        };
        await using var app = await StartAppAsync(state, new EndpointBlobs([0, 1, 2, 3, 4, 5]));
        using var request = new HttpRequestMessage(HttpMethod.Get,
            $"/api/extensions/animated-tag-previews/videos/7/tags/42/candidates/{CandidateId}/media");
        request.Headers.Range = new System.Net.Http.Headers.RangeHeaderValue(1, 3);

        var response = await app.GetTestClient().SendAsync(request);
        var wrongVideo = await app.GetTestClient().GetAsync(
            $"/api/extensions/animated-tag-previews/videos/8/tags/42/candidates/{CandidateId}/media");
        var wrongTag = await app.GetTestClient().GetAsync(
            $"/api/extensions/animated-tag-previews/videos/7/tags/41/candidates/{CandidateId}/media");

        Assert.Equal(HttpStatusCode.PartialContent, response.StatusCode);
        Assert.Equal([1, 2, 3], await response.Content.ReadAsByteArrayAsync());
        Assert.Equal("nosniff", response.Headers.GetValues("X-Content-Type-Options").Single());
        Assert.True(response.Headers.CacheControl!.Private);
        Assert.Contains("immutable", response.Headers.CacheControl.Extensions.Select(x => x.Name));
        Assert.Equal(HttpStatusCode.NotFound, wrongVideo.StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, wrongTag.StatusCode);
    }

    [Fact]
    public async Task Approve_endpoint_is_idempotent_after_full_commit_and_audits_without_request_cancellation()
    {
        var state = new EndpointState
        {
            Candidates = [Candidate(CandidateId, 7, 42, "candidate-blob")],
        };
        var blobs = new EndpointBlobs([1]);
        var audit = new EndpointAudit();
        await using var app = await StartAppAsync(state, blobs, audit: audit);
        var url = $"/api/extensions/animated-tag-previews/videos/7/tags/42/candidates/{CandidateId}/approve";

        var first = await app.GetTestClient().PostAsync(url, null);
        var retried = await app.GetTestClient().PostAsync(url, null);
        var firstBody = await first.Content.ReadFromJsonAsync<ApprovePreviewCandidateResponse>();
        var retryBody = await retried.Content.ReadFromJsonAsync<ApprovePreviewCandidateResponse>();

        Assert.Equal(HttpStatusCode.OK, first.StatusCode);
        Assert.Equal(HttpStatusCode.OK, retried.StatusCode);
        Assert.False(firstBody!.AlreadyApproved);
        Assert.True(retryBody!.AlreadyApproved);
        Assert.Equal(firstBody.Version, retryBody.Version);
        Assert.Empty(state.Candidates);
        Assert.Single(state.Receipts);
        Assert.Equal(2, audit.Actions.Count(action => action == "animated_preview.generate"));
        Assert.All(audit.CancellationTokens, token => Assert.False(token.CanBeCanceled));
    }

    [Fact]
    public async Task Discard_endpoint_audits_without_request_cancellation_after_candidate_removal()
    {
        var state = new EndpointState
        {
            Candidates = [Candidate(CandidateId, 7, 42, "candidate-blob")],
        };
        var audit = new EndpointAudit();
        await using var app = await StartAppAsync(state, new EndpointBlobs([1]), audit: audit);
        var url = $"/api/extensions/animated-tag-previews/videos/7/tags/42/candidates/{CandidateId}";

        var response = await app.GetTestClient().DeleteAsync(url);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Empty(state.Candidates);
        Assert.Contains("animated_preview.candidate.discard", audit.Actions);
        Assert.All(audit.CancellationTokens, token => Assert.False(token.CanBeCanceled));
    }

    [Fact]
    public async Task Destructive_cleanup_audits_without_request_cancellation_after_mutation()
    {
        var audit = new EndpointAudit();
        await using var app = await StartAppAsync(
            new EndpointState(),
            new EndpointBlobs([1]),
            audit: audit,
            maintenance: new CompletedMaintenance());

        var response = await app.GetTestClient().PostAsync(
            "/api/extensions/animated-tag-previews/cleanup/orphans?dryRun=false&expectedVersion=snapshot",
            null);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Contains("animated_preview.orphan_cleanup", audit.Actions);
        Assert.All(audit.CancellationTokens, token => Assert.False(token.CanBeCanceled));
    }

    [Fact]
    public async Task Compact_index_omits_tags_denied_by_entity_authorization()
    {
        var state = new EndpointState
        {
            Records = [Record(1, "blob-a", "a"), Record(2, "blob-b", "b")],
        };
        await using var app = await StartAppAsync(state, new EndpointBlobs([1]), deniedTagId: "2");

        var response = await app.GetTestClient().GetFromJsonAsync<PreviewIndexResponse>(
            "/api/extensions/animated-tag-previews/tags");

        Assert.NotNull(response);
        Assert.Single(response.Items);
        Assert.Equal(1, response.Items[0].TagId);
    }

    [Fact]
    public async Task Compact_index_exposes_revision_etag_and_honors_conditional_refresh()
    {
        var state = new EndpointState { Records = [Record(1, "blob-a", "a")] };
        await using var app = await StartAppAsync(state, new EndpointBlobs([1]));
        var client = app.GetTestClient();

        var first = await client.GetAsync("/api/extensions/animated-tag-previews/tags");
        var etag = first.Headers.ETag;
        Assert.NotNull(etag);
        using var conditional = new HttpRequestMessage(HttpMethod.Get, "/api/extensions/animated-tag-previews/tags");
        conditional.Headers.IfNoneMatch.Add(etag!);

        var second = await client.SendAsync(conditional);

        Assert.Equal(HttpStatusCode.NotModified, second.StatusCode);
    }

    [Fact]
    public async Task Preview_details_expose_the_authorized_generated_source_and_timestamp()
    {
        var state = new EndpointState { Records = [Record(42, "blob-a", "version-a")] };
        await using var app = await StartAppAsync(state, new EndpointBlobs([1]));

        var response = await app.GetTestClient().GetFromJsonAsync<PreviewDetailsResponse>(
            "/api/extensions/animated-tag-previews/tags/42/preview?v=version-a");

        Assert.NotNull(response);
        Assert.Equal(42, response.TagId);
        Assert.Equal("version-a", response.Version);
        Assert.Equal("generated", response.Origin);
        Assert.Equal(7, response.Source?.VideoId);
        Assert.Equal(1, response.Source?.StartSeconds);
    }

    [Fact]
    public async Task Preview_details_identify_direct_uploads_without_a_source_video()
    {
        var state = new EndpointState
        {
            Records = [new PreviewRecord(42, "blob-a", "version-a", Recipe: null, Origin: "uploaded")],
        };
        await using var app = await StartAppAsync(state, new EndpointBlobs([1]));

        var response = await app.GetTestClient().GetFromJsonAsync<PreviewDetailsResponse>(
            "/api/extensions/animated-tag-previews/tags/42/preview?v=version-a");

        Assert.NotNull(response);
        Assert.Equal("uploaded", response.Origin);
        Assert.Null(response.Source);
    }

    [Fact]
    public async Task Preview_details_report_a_competing_custom_tag_image()
    {
        var state = new EndpointState { Records = [Record(42, "blob-a", "version-a")] };
        await using var app = await StartAppAsync(state, new EndpointBlobs([1]), customImageTagId: 42);

        var response = await app.GetTestClient().GetFromJsonAsync<PreviewDetailsResponse>(
            "/api/extensions/animated-tag-previews/tags/42/preview?v=version-a");

        Assert.NotNull(response);
        Assert.True(response.HasCustomImage);
    }

    [Fact]
    public async Task Preview_details_do_not_disclose_a_denied_source_video()
    {
        var state = new EndpointState { Records = [Record(42, "blob-a", "version-a")] };
        await using var app = await StartAppAsync(state, new EndpointBlobs([1]), deniedVideoId: "7");

        var response = await app.GetTestClient().GetFromJsonAsync<PreviewDetailsResponse>(
            "/api/extensions/animated-tag-previews/tags/42/preview?v=version-a");

        Assert.NotNull(response);
        Assert.Equal("generated", response.Origin);
        Assert.Null(response.Source);
    }

    [Fact]
    public async Task Preview_details_reject_a_stale_preview_version()
    {
        var state = new EndpointState { Records = [Record(42, "blob-a", "current")] };
        await using var app = await StartAppAsync(state, new EndpointBlobs([1]));

        var response = await app.GetTestClient().GetAsync(
            "/api/extensions/animated-tag-previews/tags/42/preview?v=stale");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        Assert.Contains("no-store", response.Headers.CacheControl!.ToString());
    }

    [Fact]
    public async Task Preview_details_route_requires_tag_read_access()
    {
        await using var app = await StartAppAsync(new EndpointState(), new EndpointBlobs([1]));
        var endpoint = ((Microsoft.AspNetCore.Routing.IEndpointRouteBuilder)app).DataSources
            .SelectMany(source => source.Endpoints)
            .Single(item => item.DisplayName?.Contains("/tags/{tagId:int}/preview", StringComparison.Ordinal) == true);

        Assert.Equal([Permissions.TagsRead], endpoint.Metadata.GetMetadata<CovePermissionRequirementMetadata>()!.Permissions);
        Assert.Contains(endpoint.Metadata.GetOrderedMetadata<CoveRouteEntityAccessRequirementMetadata>(),
            requirement => requirement.EntityKind == EntityKinds.Tag
                && requirement.RouteValueName == "tagId"
                && requirement.Permission == Permissions.TagsRead);
    }

    [Fact]
    public async Task Generation_route_declares_permissions_and_both_entity_checks()
    {
        await using var app = await StartAppAsync(new EndpointState(), new EndpointBlobs([1]));
        var endpoint = ((Microsoft.AspNetCore.Routing.IEndpointRouteBuilder)app).DataSources.SelectMany(source => source.Endpoints)
            .Single(e => e.DisplayName?.Contains("/videos/{videoId:int}/tags/{tagId:int}/generate", StringComparison.Ordinal) == true);

        var permissions = endpoint.Metadata.GetMetadata<CovePermissionRequirementMetadata>();
        var entities = endpoint.Metadata.GetOrderedMetadata<CoveRouteEntityAccessRequirementMetadata>();

        Assert.NotNull(permissions);
        Assert.Equal([Permissions.VideosRead, Permissions.TagsWrite, Permissions.JobsRun], permissions.Permissions);
        Assert.Contains(entities, requirement => requirement.EntityKind == "video" && requirement.RouteValueName == "videoId" && requirement.Permission == Permissions.VideosRead);
        Assert.Contains(entities, requirement => requirement.EntityKind == "tag" && requirement.RouteValueName == "tagId" && requirement.Permission == Permissions.TagsWrite);
    }

    [Fact]
    public async Task Candidate_routes_declare_read_stream_and_write_permissions_with_both_entity_checks()
    {
        await using var app = await StartAppAsync(new EndpointState(), new EndpointBlobs([1]));
        var endpoints = ((Microsoft.AspNetCore.Routing.IEndpointRouteBuilder)app).DataSources
            .SelectMany(source => source.Endpoints)
            .Where(endpoint => endpoint.DisplayName?.Contains("/candidates/{candidateId}", StringComparison.Ordinal) == true)
            .ToArray();

        var media = endpoints.Single(endpoint => endpoint.DisplayName!.Contains("/media", StringComparison.Ordinal));
        var approve = endpoints.Single(endpoint => endpoint.DisplayName!.Contains("/approve", StringComparison.Ordinal));
        var discard = endpoints.Single(endpoint => endpoint.DisplayName!.StartsWith("HTTP: DELETE", StringComparison.Ordinal));

        Assert.Equal([Permissions.VideosRead, Permissions.TagsRead, Permissions.StreamRead],
            media.Metadata.GetMetadata<CovePermissionRequirementMetadata>()!.Permissions);
        Assert.Equal([Permissions.VideosRead, Permissions.TagsWrite],
            approve.Metadata.GetMetadata<CovePermissionRequirementMetadata>()!.Permissions);
        Assert.Equal([Permissions.VideosRead, Permissions.TagsWrite],
            discard.Metadata.GetMetadata<CovePermissionRequirementMetadata>()!.Permissions);
        foreach (var endpoint in endpoints)
        {
            var entities = endpoint.Metadata.GetOrderedMetadata<CoveRouteEntityAccessRequirementMetadata>();
            Assert.Contains(entities, item => item.EntityKind == EntityKinds.Video && item.RouteValueName == "videoId");
            Assert.Contains(entities, item => item.EntityKind == EntityKinds.Tag && item.RouteValueName == "tagId");
        }
    }

    [Fact]
    public async Task Settings_read_is_available_to_tag_readers_but_write_requires_extension_configuration()
    {
        await using var app = await StartAppAsync(new EndpointState(), new EndpointBlobs([1]));
        var endpoints = ((Microsoft.AspNetCore.Routing.IEndpointRouteBuilder)app).DataSources
            .SelectMany(source => source.Endpoints)
            .Where(endpoint => endpoint.DisplayName?.Contains("/settings", StringComparison.Ordinal) == true)
            .ToArray();
        var get = endpoints.Single(endpoint => endpoint.DisplayName!.StartsWith("HTTP: GET", StringComparison.Ordinal));
        var put = endpoints.Single(endpoint => endpoint.DisplayName!.StartsWith("HTTP: PUT", StringComparison.Ordinal));

        Assert.Equal([Permissions.TagsRead], get.Metadata.GetMetadata<CovePermissionRequirementMetadata>()!.Permissions);
        Assert.Equal([Permissions.ExtensionsConfigure], put.Metadata.GetMetadata<CovePermissionRequirementMetadata>()!.Permissions);
    }

    [Fact]
    public async Task Preview_source_media_requires_stream_permission_and_video_access()
    {
        await using var app = await StartAppAsync(new EndpointState(), new EndpointBlobs([1]));
        var endpoint = ((Microsoft.AspNetCore.Routing.IEndpointRouteBuilder)app).DataSources
            .SelectMany(source => source.Endpoints)
            .Single(e => e.DisplayName?.Contains("/videos/{videoId:int}/source/media", StringComparison.Ordinal) == true);

        Assert.Equal(
            [Permissions.VideosRead, Permissions.StreamRead],
            endpoint.Metadata.GetMetadata<CovePermissionRequirementMetadata>()!.Permissions);
        Assert.Contains(
            endpoint.Metadata.GetOrderedMetadata<CoveRouteEntityAccessRequirementMetadata>(),
            requirement => requirement.EntityKind == "video"
                && requirement.RouteValueName == "videoId"
                && requirement.Permission == Permissions.VideosRead);
    }

    [Fact]
    public async Task Upload_route_accepts_multipart_publishes_immediately_and_declares_tag_write_access()
    {
        var uploads = new EndpointUploads();
        var audit = new EndpointAudit();
        await using var app = await StartAppAsync(new EndpointState(), new EndpointBlobs([1]), audit: audit, uploads: uploads);
        using var content = new MultipartFormDataContent();
        var file = new ByteArrayContent([1, 2, 3]);
        file.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
        content.Add(file, "file", "custom.webm");

        var response = await app.GetTestClient().PostAsync("/api/extensions/animated-tag-previews/tags/42/media", content);
        var body = await response.Content.ReadFromJsonAsync<UploadPreviewResponse>();
        var endpoint = ((Microsoft.AspNetCore.Routing.IEndpointRouteBuilder)app).DataSources.SelectMany(source => source.Endpoints)
            .Single(item => item.DisplayName?.StartsWith("HTTP: POST /api/extensions/animated-tag-previews/tags/{tagId:int}/media", StringComparison.Ordinal) == true);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal(42, body!.TagId);
        Assert.Equal([1, 2, 3], uploads.Bytes);
        Assert.Equal([Permissions.TagsWrite], endpoint.Metadata.GetMetadata<CovePermissionRequirementMetadata>()!.Permissions);
        Assert.Contains(endpoint.Metadata.GetOrderedMetadata<CoveRouteEntityAccessRequirementMetadata>(), requirement => requirement.EntityKind == EntityKinds.Tag && requirement.RouteValueName == "tagId" && requirement.Permission == Permissions.TagsWrite);
        Assert.Contains("animated_preview.upload", audit.Actions);
    }

    private static async Task<WebApplication> StartAppAsync(
        EndpointState state,
        IBlobService blobs,
        string? deniedTagId = null,
        string? deniedVideoId = null,
        int? customImageTagId = null,
        IAuditService? audit = null,
        IPreviewMaintenanceService? maintenance = null,
        IUploadedPreviewService? uploads = null)
    {
        var builder = WebApplication.CreateBuilder(new WebApplicationOptions { EnvironmentName = "Testing" });
        builder.WebHost.UseTestServer();
        builder.Services.AddSingleton<IPreviewStateStore>(state);
        builder.Services.AddSingleton(blobs);
        builder.Services.AddSingleton<IAuthorizationService>(new EndpointAuthorization(deniedTagId, deniedVideoId));
        builder.Services.AddSingleton<ICurrentPrincipalAccessor>(new EndpointPrincipal());
        RegisterUnused<IPreviewHealthService>(builder.Services);
        builder.Services.AddSingleton<IVideoRepository, EndpointVideos>();
        builder.Services.AddSingleton<ITagRepository>(new EndpointTags(customImageTagId));
        RegisterUnused<IPreviewJobCoordinator>(builder.Services);
        if (uploads is null) RegisterUnused<IUploadedPreviewService>(builder.Services);
        else builder.Services.AddSingleton(uploads);
        if (maintenance is null)
            RegisterUnused<IPreviewMaintenanceService>(builder.Services);
        else
            builder.Services.AddSingleton(maintenance);
        builder.Services.AddSingleton<IPreviewCandidateService>(new PreviewCandidateService(state, blobs, new PreviewMutationGate()));
        builder.Services.AddSingleton(audit ?? new EndpointAudit());

        var app = builder.Build();
        new AnimatedTagPreviewsExtension().MapEndpoints(app);
        await app.StartAsync();
        return app;
    }

    private static void RegisterUnused<T>(IServiceCollection services) where T : class
        => services.AddSingleton<T>(_ => null!);

    private static PreviewRecord Record(int tagId, string blobId, string version) => new(
        tagId,
        blobId,
        version,
        new PreviewRecipe(7, 11, 1, 5, 0.5, 0.5, 1, 720, "libvpx-vp9", 2140, 24, DateTimeOffset.UnixEpoch));

    private static PreviewCandidateRecord Candidate(string candidateId, int videoId, int tagId, string blobId) => new(
        candidateId,
        videoId,
        tagId,
        blobId,
        new PreviewRecipe(videoId, 11, 1, 5, 0.5, 0.5, 1, 720, "libvpx-vp9", 2140, 24, DateTimeOffset.UnixEpoch),
        DateTimeOffset.UtcNow);

    private sealed class EndpointBlobs(byte[] bytes) : IBlobService
    {
        public Task<string> StoreBlobAsync(Stream data, string contentType, CancellationToken ct = default) => throw new NotSupportedException();
        public Task<(Stream Stream, string ContentType)?> GetBlobAsync(string blobId, CancellationToken ct = default)
            => Task.FromResult<(Stream, string)?>(new ValueTuple<Stream, string>(new MemoryStream(bytes), "video/webm"));
        public Task DeleteBlobAsync(string blobId, CancellationToken ct = default) => throw new NotSupportedException();
    }

    private sealed class EndpointUploads : IUploadedPreviewService
    {
        public byte[] Bytes { get; private set; } = [];
        public async Task<UploadPreviewResponse> UploadAsync(int tagId, Stream input, long declaredLength, CancellationToken ct)
        {
            using var output = new MemoryStream();
            await input.CopyToAsync(output, ct);
            Bytes = output.ToArray();
            Assert.Equal(Bytes.Length, declaredLength);
            return new UploadPreviewResponse(tagId, "uploaded", ReplacedExisting: false);
        }
    }

    private sealed class EndpointState : IPreviewStateStore
    {
        public IReadOnlyList<PreviewRecord> Records { get; set; } = [];
        public IReadOnlyList<PreviewCandidateRecord> Candidates { get; set; } = [];
        public IReadOnlyList<PreviewApprovalReceipt> Receipts { get; set; } = [];
        public Task<PreviewSettings> GetSettingsAsync(CancellationToken ct = default) => Task.FromResult(PreviewSettings.Default);
        public Task SaveSettingsAsync(PreviewSettings settings, CancellationToken ct = default) => throw new NotSupportedException();
        public Task<PreviewRecord?> GetPreviewAsync(int tagId, CancellationToken ct = default) => Task.FromResult(Records.FirstOrDefault(x => x.TagId == tagId));
        public Task<IReadOnlyList<PreviewRecord>> GetPreviewsAsync(CancellationToken ct = default) => Task.FromResult(Records);
        public Task<PreviewRecord?> PublishAsync(PreviewRecord record, CancellationToken ct = default)
        {
            var old = Records.FirstOrDefault(item => item.TagId == record.TagId);
            Records = Records.Where(item => item.TagId != record.TagId).Append(record).ToArray();
            return Task.FromResult(old);
        }
        public Task<PreviewRecord?> RemovePreviewAsync(int tagId, CancellationToken ct = default) => throw new NotSupportedException();
        public Task<PreviewCandidateRecord?> GetCandidateAsync(string candidateId, CancellationToken ct = default)
            => Task.FromResult(Candidates.FirstOrDefault(x => x.CandidateId == candidateId));
        public Task<IReadOnlyList<PreviewCandidateRecord>> GetCandidatesAsync(CancellationToken ct = default) => Task.FromResult(Candidates);
        public Task SaveCandidateAsync(PreviewCandidateRecord record, CancellationToken ct = default)
        {
            Candidates = Candidates.Where(item => item.CandidateId != record.CandidateId).Append(record).ToArray();
            return Task.CompletedTask;
        }
        public Task<PreviewCandidateRecord?> RemoveCandidateAsync(string candidateId, CancellationToken ct = default)
        {
            var old = Candidates.FirstOrDefault(item => item.CandidateId == candidateId);
            Candidates = Candidates.Where(item => item.CandidateId != candidateId).ToArray();
            return Task.FromResult(old);
        }
        public Task<PreviewApprovalReceipt?> GetApprovalReceiptAsync(string candidateId, CancellationToken ct = default)
            => Task.FromResult(Receipts.FirstOrDefault(item => item.CandidateId == candidateId));
        public Task<IReadOnlyList<PreviewApprovalReceipt>> GetApprovalReceiptsAsync(CancellationToken ct = default) => Task.FromResult(Receipts);
        public Task SaveApprovalReceiptAsync(PreviewApprovalReceipt receipt, CancellationToken ct = default)
        {
            Receipts = Receipts.Where(item => item.CandidateId != receipt.CandidateId).Append(receipt).ToArray();
            return Task.CompletedTask;
        }
        public Task<PreviewApprovalReceipt?> RemoveApprovalReceiptAsync(string candidateId, CancellationToken ct = default)
        {
            var old = Receipts.FirstOrDefault(item => item.CandidateId == candidateId);
            Receipts = Receipts.Where(item => item.CandidateId != candidateId).ToArray();
            return Task.FromResult(old);
        }
        public Task TrackOwnedBlobAsync(OwnedBlobRecord record, CancellationToken ct = default) => throw new NotSupportedException();
        public Task UntrackOwnedBlobAsync(string blobId, CancellationToken ct = default) => throw new NotSupportedException();
        public Task<IReadOnlyList<OwnedBlobRecord>> GetOwnedBlobsAsync(CancellationToken ct = default) => throw new NotSupportedException();
    }

    private sealed class EndpointAuthorization(string? deniedTagId, string? deniedVideoId) : IAuthorizationService
    {
        public AuthorizationResult Authorize(CovePrincipal? principal, string permission, EntityRef? entity = null)
            => entity is EntityRef entityRef
                && (entityRef.Kind == EntityKinds.Tag && entityRef.Id == deniedTagId
                    || entityRef.Kind == EntityKinds.Video && entityRef.Id == deniedVideoId)
                ? AuthorizationResult.Deny("denied")
                : AuthorizationResult.Allow();
        public Task<AuthorizationResult> AuthorizeAsync(CovePrincipal? principal, string permission, EntityRef? entity, CancellationToken ct)
            => Task.FromResult(Authorize(principal, permission, entity));
        public void Require(CovePrincipal? principal, string permission, EntityRef? entity = null) => throw new NotSupportedException();
        public bool Has(CovePrincipal? principal, string permission) => true;
    }

    private sealed class EndpointPrincipal : ICurrentPrincipalAccessor
    {
        public CovePrincipal? Current { get; private set; } = CovePrincipal.System();
        public void Set(CovePrincipal? principal) => Current = principal;
    }

    private sealed class EndpointAudit : IAuditService
    {
        public List<string> Actions { get; } = [];
        public List<CancellationToken> CancellationTokens { get; } = [];

        public Task LogAsync(
            string action,
            string outcome,
            CovePrincipal? actor = null,
            string? targetKind = null,
            string? targetId = null,
            object? detail = null,
            CancellationToken ct = default)
        {
            Actions.Add(action);
            CancellationTokens.Add(ct);
            return Task.CompletedTask;
        }
    }

    private sealed class CompletedMaintenance : IPreviewMaintenanceService
    {
        public Task<DeletePreviewResponse> DeleteAsync(int tagId, CancellationToken ct) => throw new NotSupportedException();
        public Task<OrphanCleanupResponse> CleanupOrphansAsync(bool dryRun, string? expectedVersion, CancellationToken ct)
            => Task.FromResult(new OrphanCleanupResponse(
                dryRun,
                1,
                ["blob"],
                1,
                0,
                1,
                [],
                expectedVersion ?? "snapshot"));
    }

    private sealed class EndpointTags(int? customImageTagId) : ITagRepository
    {
        public Task<Tag?> GetByIdAsync(int id, CancellationToken ct = default)
            => Task.FromResult<Tag?>(id > 0 ? new Tag
            {
                Id = id,
                Name = $"Tag {id}",
                ImageOverrideBlobId = id == customImageTagId ? "custom-image" : null,
            } : null);
        public Task<IReadOnlyList<Tag>> GetAllAsync(CancellationToken ct = default) => throw new NotSupportedException();
        public Task<Tag> AddAsync(Tag entity, CancellationToken ct = default) => throw new NotSupportedException();
        public Task UpdateAsync(Tag entity, CancellationToken ct = default) => throw new NotSupportedException();
        public Task DeleteAsync(int id, CancellationToken ct = default) => throw new NotSupportedException();
        public Task<int> CountAsync(CancellationToken ct = default) => throw new NotSupportedException();
        public Task<(IReadOnlyList<Tag> Items, int TotalCount)> FindAsync(TagFilter? filter, FindFilter? findFilter, CancellationToken ct = default) => throw new NotSupportedException();
        public Task<Tag?> GetByIdWithRelationsAsync(int id, CancellationToken ct = default) => throw new NotSupportedException();
        public Task<Tag?> GetByNameAsync(string name, CancellationToken ct = default) => throw new NotSupportedException();
        public Task<IReadOnlyList<Tag>> FindByNamesAsync(IReadOnlyList<string> names, CancellationToken ct = default) => throw new NotSupportedException();
        public Task<Dictionary<string, Tag>> FindOrCreateByNamesAsync(IReadOnlyList<string> names, CancellationToken ct = default) => throw new NotSupportedException();
    }

    private sealed class EndpointVideos : IVideoRepository
    {
        public Task<Video?> GetByIdAsync(int id, CancellationToken ct = default)
            => Task.FromResult<Video?>(id > 0 ? new Video { Id = id } : null);
        public Task<Video?> GetByIdWithRelationsAsync(int id, CancellationToken ct = default)
            => Task.FromResult<Video?>(id > 0 ? new Video { Id = id } : null);
        public Task<IReadOnlyList<Video>> GetAllAsync(CancellationToken ct = default) => throw new NotSupportedException();
        public Task<Video> AddAsync(Video entity, CancellationToken ct = default) => throw new NotSupportedException();
        public Task UpdateAsync(Video entity, CancellationToken ct = default) => throw new NotSupportedException();
        public Task DeleteAsync(int id, CancellationToken ct = default) => throw new NotSupportedException();
        public Task<int> CountAsync(CancellationToken ct = default) => throw new NotSupportedException();
        public Task<(IReadOnlyList<Video> Items, int TotalCount)> FindAsync(VideoFilter? filter, FindFilter? findFilter, CancellationToken ct = default) => throw new NotSupportedException();
        public Task<IReadOnlyList<VideoPerformer>> GetVideoPerformersAsync(IReadOnlyList<int> videoIds, CancellationToken ct = default) => throw new NotSupportedException();
    }
}
