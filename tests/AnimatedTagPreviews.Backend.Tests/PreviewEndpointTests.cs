using System.Net;
using System.Net.Http.Json;
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

    private static async Task<WebApplication> StartAppAsync(EndpointState state, IBlobService blobs, string? deniedTagId = null)
    {
        var builder = WebApplication.CreateBuilder(new WebApplicationOptions { EnvironmentName = "Testing" });
        builder.WebHost.UseTestServer();
        builder.Services.AddSingleton<IPreviewStateStore>(state);
        builder.Services.AddSingleton(blobs);
        builder.Services.AddSingleton<IAuthorizationService>(new EndpointAuthorization(deniedTagId));
        builder.Services.AddSingleton<ICurrentPrincipalAccessor>(new EndpointPrincipal());
        RegisterUnused<IPreviewHealthService>(builder.Services);
        RegisterUnused<IVideoRepository>(builder.Services);
        builder.Services.AddSingleton<ITagRepository, EndpointTags>();
        RegisterUnused<IPreviewJobCoordinator>(builder.Services);
        RegisterUnused<IPreviewMaintenanceService>(builder.Services);
        RegisterUnused<IAuditService>(builder.Services);

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

    private sealed class EndpointBlobs(byte[] bytes) : IBlobService
    {
        public Task<string> StoreBlobAsync(Stream data, string contentType, CancellationToken ct = default) => throw new NotSupportedException();
        public Task<(Stream Stream, string ContentType)?> GetBlobAsync(string blobId, CancellationToken ct = default)
            => Task.FromResult<(Stream, string)?>(new ValueTuple<Stream, string>(new MemoryStream(bytes), "video/webm"));
        public Task DeleteBlobAsync(string blobId, CancellationToken ct = default) => throw new NotSupportedException();
    }

    private sealed class EndpointState : IPreviewStateStore
    {
        public IReadOnlyList<PreviewRecord> Records { get; set; } = [];
        public Task<PreviewSettings> GetSettingsAsync(CancellationToken ct = default) => Task.FromResult(PreviewSettings.Default);
        public Task SaveSettingsAsync(PreviewSettings settings, CancellationToken ct = default) => throw new NotSupportedException();
        public Task<PreviewRecord?> GetPreviewAsync(int tagId, CancellationToken ct = default) => Task.FromResult(Records.FirstOrDefault(x => x.TagId == tagId));
        public Task<IReadOnlyList<PreviewRecord>> GetPreviewsAsync(CancellationToken ct = default) => Task.FromResult(Records);
        public Task<PreviewRecord?> PublishAsync(PreviewRecord record, CancellationToken ct = default) => throw new NotSupportedException();
        public Task<PreviewRecord?> RemovePreviewAsync(int tagId, CancellationToken ct = default) => throw new NotSupportedException();
        public Task TrackOwnedBlobAsync(OwnedBlobRecord record, CancellationToken ct = default) => throw new NotSupportedException();
        public Task UntrackOwnedBlobAsync(string blobId, CancellationToken ct = default) => throw new NotSupportedException();
        public Task<IReadOnlyList<OwnedBlobRecord>> GetOwnedBlobsAsync(CancellationToken ct = default) => throw new NotSupportedException();
    }

    private sealed class EndpointAuthorization(string? deniedTagId) : IAuthorizationService
    {
        public AuthorizationResult Authorize(CovePrincipal? principal, string permission, EntityRef? entity = null)
            => entity?.Id == deniedTagId ? AuthorizationResult.Deny("denied") : AuthorizationResult.Allow();
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

    private sealed class EndpointTags : ITagRepository
    {
        public Task<Tag?> GetByIdAsync(int id, CancellationToken ct = default)
            => Task.FromResult<Tag?>(id > 0 ? new Tag { Id = id, Name = $"Tag {id}" } : null);
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
}
