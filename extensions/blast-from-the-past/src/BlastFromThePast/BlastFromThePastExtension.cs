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

namespace MidnightRider.Cove.BlastFromThePast;

public sealed class BlastFromThePastExtension : FullExtensionBase
{
    internal const string ApiBase = "/api/plugins/com.midnightrider.blast-from-the-past";

    // How far a like may sit from a playback session and still belong to it; SESSION_LEAD_MS and
    // SESSION_TAIL_MS in assets/ui.mjs, which makes the final match.
    internal const int SessionLeadSeconds = 10;
    internal const int SessionTailSeconds = 120;

    public override UIManifest GetUIManifest()
        => ManifestBuilder()
            .AddDashboardWidget(new UIDashboardWidgetContribution(
                "blast-from-the-past",
                "Blast From The Past",
                ExtensionId: string.Empty,
                ComponentName: "BlastFromThePastWidget",
                EditorComponentName: "BlastFromThePastEditor",
                Description: "Replay the moments in your viewing sessions that ended in a like.",
                Icon: "heart",
                DefaultConfiguration: JsonSerializer.SerializeToElement(new { count = 6, leadSeconds = 15, clipSeconds = 30, autoplay = true }),
                AllowMultiple: true,
                Order: 11)
            {
                RequiredPermissions = [Permissions.VideosRead],
                RequiredPermissionMode = PermissionMode.All,
                SupportedPresentations = [DashboardWidgetPresentation.Flow],
                DefaultPresentation = DashboardWidgetPresentation.Flow,
            })
            .Build();

    public override void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet($"{ApiBase}/candidates", GetCandidatesAsync)
            .AllowWithoutCovePermission();
    }

    // The videos the current user liked during one of their own playback sessions. Only ids are returned:
    // the widget loads the videos through Cove's authorization-filtered search, so this needs no access rules of its own.
    private static async Task<IResult> GetCandidatesAsync(
        CoveConfiguration configuration,
        ICurrentPrincipalAccessor principalAccessor,
        IAuditService audit,
        DbContext db,
        CancellationToken ct)
    {
        var principal = principalAccessor.Current;
        if (configuration.Auth.Enabled)
        {
            if (principal is null || principal.Kind == PrincipalKind.Anonymous)
                return Results.Unauthorized();

            var shareLinkDenied = principal.Kind == PrincipalKind.ShareLink;
            var canReadVideos = principal.Has(Permissions.VideosRead) || principal.HasReadGrant(Permissions.VideosRead);
            if (shareLinkDenied || !canReadVideos)
            {
                await audit.LogAsync(
                    AuditActions.PermissionDeny,
                    AuditOutcomes.Deny,
                    principal,
                    "endpoint",
                    "blast-from-the-past-candidates",
                    new
                    {
                        reason = shareLinkDenied ? "share_link_route" : "missing_permissions",
                        missing = canReadVideos ? Array.Empty<string>() : [Permissions.VideosRead],
                    },
                    ct);
                return Results.Json(
                    new
                    {
                        code = "FORBIDDEN",
                        message = shareLinkDenied
                            ? "This endpoint is outside the share link viewing bundle."
                            : "Blast From The Past requires video read access.",
                    },
                    statusCode: StatusCodes.Status403Forbidden);
            }
        }

        var videoIds = principal?.UserId is int userId
            ? await FindCandidateVideoIdsAsync(db, userId, ct)
            : [];
        return Results.Json(new { videoIds });
    }

    internal static Task<List<int>> FindCandidateVideoIdsAsync(DbContext db, int userId, CancellationToken ct)
    {
        var sessions = db.Set<PlaybackSession>().AsNoTracking()
            .Where(session => session.UserId == userId && session.HostType == InteractionHostType.Video);
        return db.Set<Interaction>().AsNoTracking()
            .Where(like => like.UserId == userId && like.HostType == InteractionHostType.Video && like.Kind == InteractionKind.LikeCount)
            .Where(like => sessions.Any(session => session.HostId == like.HostId
                && session.StartedAt <= like.At.AddSeconds(SessionLeadSeconds)
                && (session.EndedAt ?? session.LastSeenAt) >= like.At.AddSeconds(-SessionTailSeconds)))
            .Select(like => like.HostId)
            .Distinct()
            .OrderBy(videoId => videoId)
            .ToListAsync(ct);
    }
}
