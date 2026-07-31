using Cove.Core.Auth;
using Cove.Core.Entities;

namespace SegmentStudio;

public static class SegmentStudioAuthorization
{
    public static async Task<AuthorizationResult> AuthorizeBrowseReadAsync(
        CovePrincipal? principal, IAuthorizationService authorization, CancellationToken ct)
    {
        var segments = await authorization.AuthorizeAsync(principal, Permissions.SegmentsRead, entity: null, ct);
        if (!segments.Allowed) return segments;
        var segmentScope = AuthorizeUnscopedSegmentRead(principal);
        if (!segmentScope.Allowed) return segmentScope;
        return await authorization.AuthorizeAsync(principal, Permissions.TagsRead, entity: null, ct);
    }

    public static async Task<AuthorizationResult> AuthorizeReadAsync(
        CovePrincipal? principal,
        IAuthorizationService authorization,
        int? videoId,
        CancellationToken ct)
    {
        var access = await authorization.AuthorizeAsync(
            principal,
            Permissions.SegmentsRead,
            videoId is int id ? EntityRef.Of(EntityKinds.Video, id) : null,
            ct);
        if (!access.Allowed) return access;
        return AuthorizeUnscopedSegmentRead(principal);
    }

    public static async Task<AuthorizationResult> AuthorizeSegmentGroupReadAsync(
        CovePrincipal? principal,
        IAuthorizationService authorization,
        CancellationToken ct)
    {
        var segmentAccess = await authorization.AuthorizeAsync(principal, Permissions.SegmentsRead, entity: null, ct);
        if (!segmentAccess.Allowed) return segmentAccess;
        var segmentScope = AuthorizeUnscopedSegmentRead(principal);
        if (!segmentScope.Allowed) return segmentScope;
        var tagScope = AuthorizeUnscopedTagConfiguration(principal);
        if (!tagScope.Allowed) return tagScope;
        return await authorization.AuthorizeAsync(principal, Permissions.TagsRead, entity: null, ct);
    }

    public static async Task<AuthorizationResult> AuthorizePerformerSlotReadAsync(
        CovePrincipal? principal,
        IAuthorizationService authorization,
        CancellationToken ct)
    {
        var access = await authorization.AuthorizeAsync(
            principal,
            Permissions.PerformersRead,
            entity: null,
            ct);
        if (!access.Allowed) return access;
        if (principal is null
            || !principal.Has(Permissions.PerformersRead)
            || principal.ReadRestrictedEntityKinds.Contains(EntityKinds.Performer)
            || principal.ReadGrantedEntityKinds.Contains(EntityKinds.Performer))
        {
            return AuthorizationResult.Deny(
                "Performer-slot display requires unrestricted performer read access.",
                Permissions.PerformersRead);
        }

        return AuthorizationResult.Allow();
    }

    public static async Task<AuthorizationResult> AuthorizePerformerSlotMetadataReadAsync(
        CovePrincipal? principal, IAuthorizationService authorization, CancellationToken ct)
    {
        var browse = await AuthorizeBrowseReadAsync(principal, authorization, ct);
        if (!browse.Allowed) return browse;
        return await AuthorizePerformerSlotReadAsync(principal, authorization, ct);
    }

    public static async Task<AuthorizationResult> AuthorizeSlotDefinitionMetadataReadAsync(
        CovePrincipal? principal, IAuthorizationService authorization, CancellationToken ct)
    {
        var metadata = await AuthorizePerformerSlotMetadataReadAsync(principal, authorization, ct);
        if (!metadata.Allowed) return metadata;
        var videos = await authorization.AuthorizeAsync(principal, Permissions.VideosRead, entity: null, ct);
        if (!videos.Allowed) return videos;
        if (principal is null || !principal.Has(Permissions.VideosRead)
            || principal.ReadRestrictedEntityKinds.Contains(EntityKinds.Video)
            || principal.ReadGrantedEntityKinds.Contains(EntityKinds.Video))
            return AuthorizationResult.Deny("Slot-definition assignment counts require unrestricted video read access.", Permissions.VideosRead);
        return AuthorizationResult.Allow();
    }

    public static async Task<AuthorizationResult> AuthorizePerformerSlotDefinitionWriteAsync(
        CovePrincipal? principal, IAuthorizationService authorization, CancellationToken ct)
    {
        var read = await AuthorizePerformerSlotReadAsync(principal, authorization, ct);
        if (!read.Allowed) return read;
        var configuration = await AuthorizeSegmentGroupWriteAsync(principal, authorization, ct);
        if (!configuration.Allowed) return configuration;
        return configuration;
    }

    public static async Task<AuthorizationResult> AuthorizePerformerSlotAssignmentWriteAsync(
        CovePrincipal? principal, IAuthorizationService authorization, int videoId, CancellationToken ct)
    {
        var read = await AuthorizePerformerSlotReadAsync(principal, authorization, ct);
        if (!read.Allowed) return read;
        return await authorization.AuthorizeAsync(principal, Permissions.SegmentsWrite, EntityRef.Of(EntityKinds.Video, videoId), ct);
    }

    public static async Task<AuthorizationResult> AuthorizeSegmentGroupWriteAsync(
        CovePrincipal? principal,
        IAuthorizationService authorization,
        CancellationToken ct)
    {
        var segmentAccess = await authorization.AuthorizeAsync(principal, Permissions.SegmentsWrite, entity: null, ct);
        if (!segmentAccess.Allowed) return segmentAccess;
        var tagScope = AuthorizeUnscopedTagConfiguration(principal);
        if (!tagScope.Allowed) return tagScope;
        return await authorization.AuthorizeAsync(principal, Permissions.TagsRead, entity: null, ct);
    }

    private static AuthorizationResult AuthorizeUnscopedTagConfiguration(CovePrincipal? principal)
    {
        if (principal is null
            || !principal.Has(Permissions.TagsRead)
            || principal.ReadRestrictedEntityKinds.Contains(EntityKinds.Tag)
            || principal.ReadGrantedEntityKinds.Contains(EntityKinds.Tag))
        {
            return AuthorizationResult.Deny(
                "Segment group configuration requires unrestricted tag read access.",
                Permissions.TagsRead);
        }

        return AuthorizationResult.Allow();
    }

    private static AuthorizationResult AuthorizeUnscopedSegmentRead(CovePrincipal? principal)
    {
        if (principal is null
            || !principal.Has(Permissions.SegmentsRead)
            || principal.ReadRestrictedEntityKinds.Contains(EntityKinds.Segment)
            || principal.ReadGrantedEntityKinds.Contains(EntityKinds.Segment))
        {
            return AuthorizationResult.Deny(
                "Segment Studio requires unrestricted segment read access.",
                Permissions.SegmentsRead);
        }

        return AuthorizationResult.Allow();
    }

}
