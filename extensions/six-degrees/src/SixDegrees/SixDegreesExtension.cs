using System.Text.Json;
using Cove.Core.Auth;
using Cove.Core.Entities;
using Cove.Core.Interfaces;
using Cove.Plugins;
using Cove.Sdk;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;

namespace MidnightRider.Cove.SixDegrees;

public sealed class SixDegreesExtension : FullExtensionBase
{
    private const string ApiBase = "/api/plugins/com.midnightrider.six-degrees";
    private const int MaximumGraphAppearances = 250_000;
    private static readonly string[] ConnectionGraphPermissions =
        [Permissions.PerformersRead, Permissions.VideosRead];

    public override UIManifest GetUIManifest()
        => ManifestBuilder()
            .AddDashboardWidget(new UIDashboardWidgetContribution(
                "six-degrees",
                "Six Degrees of Johnny Sins",
                ExtensionId: string.Empty,
                ComponentName: "SixDegreesWidget",
                EditorComponentName: "SixDegreesEditor",
                Description: "Find the shortest chain of shared videos between two performers.",
                Icon: "network",
                DefaultConfiguration: JsonSerializer.SerializeToElement(new
                {
                    mode = "random",
                    startPerformerId = (int?)null,
                    endPerformerId = (int?)null,
                    maxDegrees = 6,
                }),
                AllowMultiple: false,
                Order: 90)
            {
                RequiredPermissions = ConnectionGraphPermissions,
                RequiredPermissionMode = PermissionMode.All,
                SupportedPresentations = [DashboardWidgetPresentation.Canvas],
                DefaultPresentation = DashboardWidgetPresentation.Canvas,
            })
            .Build();

    public override void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet($"{ApiBase}/performer-connections", GetPerformerConnectionsAsync)
            .AllowWithoutCovePermission();
    }

    private static async Task<IResult> GetPerformerConnectionsAsync(
        int? startPerformerId,
        int? endPerformerId,
        int? maxDegrees,
        int? seed,
        CoveConfiguration configuration,
        ICurrentPrincipalAccessor principalAccessor,
        IAuditService audit,
        DbContext db,
        CancellationToken ct)
    {
        if (configuration.Auth.Enabled)
        {
            var principal = principalAccessor.Current;
            if (principal is null || principal.Kind == PrincipalKind.Anonymous)
                return Results.Unauthorized();

            var missingPermissions = ConnectionGraphPermissions
                .Where(permission => !principal.Has(permission) && !principal.HasReadGrant(permission))
                .ToArray();
            var shareLinkDenied = principal.Kind == PrincipalKind.ShareLink;
            if (shareLinkDenied || missingPermissions.Length > 0)
            {
                await audit.LogAsync(
                    AuditActions.PermissionDeny,
                    AuditOutcomes.Deny,
                    principal,
                    "endpoint",
                    "performer-connections",
                    new
                    {
                        reason = shareLinkDenied ? "share_link_route" : "missing_permissions",
                        missing = missingPermissions,
                    },
                    ct);
                return Results.Json(
                    new
                    {
                        code = "FORBIDDEN",
                        message = shareLinkDenied
                            ? "This endpoint is outside the share link viewing bundle."
                            : "The performer connection graph requires performer and video read access.",
                        missing = missingPermissions,
                    },
                    statusCode: StatusCodes.Status403Forbidden);
            }
        }

        var degreeLimit = maxDegrees ?? 6;
        if (degreeLimit is < 1 or > 6)
            return Results.BadRequest(new { detail = "Maximum degrees must be between 1 and 6." });
        if (startPerformerId.HasValue != endPerformerId.HasValue)
            return Results.BadRequest(new { detail = "Choose both performers or neither performer." });
        if (startPerformerId is <= 0 || endPerformerId is <= 0)
            return Results.BadRequest(new { detail = "Performer identifiers must be positive." });

        var rows = await (
            from appearance in db.Set<VideoPerformer>().AsNoTracking()
            join video in db.Set<Video>().AsNoTracking() on appearance.VideoId equals video.Id
            join performer in db.Set<Performer>().AsNoTracking() on appearance.PerformerId equals performer.Id
            orderby appearance.VideoId, appearance.PerformerId
            select new
            {
                PerformerId = performer.Id,
                PerformerName = performer.Name,
                PerformerHasImage = performer.ImageOverrideBlobId != null || performer.ImageBlobId != null,
                PerformerUpdatedAt = performer.UpdatedAt,
                VideoId = video.Id,
                VideoTitle = video.Title,
                VideoDate = video.Date,
                VideoUpdatedAt = video.UpdatedAt,
            })
            .Take(MaximumGraphAppearances + 1)
            .ToListAsync(ct);

        if (rows.Count > MaximumGraphAppearances)
        {
            return Results.Problem(
                title: "The performer graph is too large to search.",
                detail: "This library has more performer appearances than Six Degrees can search at once.",
                statusCode: StatusCodes.Status422UnprocessableEntity);
        }

        var graph = new PerformerConnectionGraph(rows.Select(row => new PerformerConnectionAppearance(
            new(
                row.PerformerId,
                row.PerformerName,
                row.PerformerHasImage ? VersionedImageUrl("performers", row.PerformerId, row.PerformerUpdatedAt, 640) : null,
                VideoCount: 0),
            new(
                row.VideoId,
                string.IsNullOrWhiteSpace(row.VideoTitle) ? "Untitled video" : row.VideoTitle,
                row.VideoDate?.ToString("yyyy-MM-dd"),
                VersionedImageUrl("videos", row.VideoId, row.VideoUpdatedAt, 960)))));

        PerformerConnectionPath? chain;
        string? emptyReason;
        if (startPerformerId.HasValue && endPerformerId.HasValue)
        {
            var startAvailable = graph.ContainsPerformer(startPerformerId.Value);
            var endAvailable = graph.ContainsPerformer(endPerformerId.Value);
            chain = startAvailable && endAvailable
                ? graph.FindShortestPath(startPerformerId.Value, endPerformerId.Value, degreeLimit)
                : null;
            emptyReason = !startAvailable || !endAvailable ? "performerUnavailable" : chain is null ? "noPath" : null;
        }
        else
        {
            chain = graph.FindRandomPath(seed ?? 0, degreeLimit);
            emptyReason = chain is null ? "notEnoughConnections" : null;
        }

        return Results.Ok(new PerformerConnectionSearchResponse(
            chain,
            emptyReason,
            degreeLimit,
            graph.PerformerCount,
            graph.VideoCount));
    }

    private static string VersionedImageUrl(string entityType, int id, DateTime updatedAt, int max)
        => $"/api/{entityType}/{id}/image?max={max}&v={updatedAt.ToUniversalTime().Ticks}";
}
