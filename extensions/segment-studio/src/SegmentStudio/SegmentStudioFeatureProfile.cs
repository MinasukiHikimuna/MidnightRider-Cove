using Microsoft.EntityFrameworkCore;
using Cove.Core.Auth;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;

namespace SegmentStudio;

public static class SegmentStudioModes
{
    public const string Basic = "basic";
    public const string Full = "full";
    public const string LegacyBasic = "editor";
    public const string LegacyFull = "review";

    public static string NormalizePublic(string? mode) =>
        mode?.Trim().ToLowerInvariant() switch
        {
            Basic or LegacyBasic => Basic,
            Full or LegacyFull => Full,
            _ => Basic,
        };

    public static string ToStored(string? mode) =>
        mode?.Trim().ToLowerInvariant() switch
        {
            Basic or LegacyBasic => LegacyBasic,
            Full or LegacyFull => LegacyFull,
            _ => throw new ArgumentException(
                "Mode must be either basic or full.",
                nameof(mode)),
        };
}

public static class SegmentStudioCapabilities
{
    public const string NavigationVideos = "navigation.videos";
    public const string NavigationSegmentInventory = "navigation.segmentInventory";
    public const string SettingsGeneral = "settings.general";
    public const string SettingsShortcuts = "settings.shortcuts";
    public const string SettingsOrganization = "settings.organization";
    public const string SettingsPerformerSlots = "settings.performerSlots";
    public const string SettingsDerivation = "settings.derivation";
    public const string NativeSegmentsRead = "nativeSegments.read";
    public const string NativeSegmentsCreate = "nativeSegments.create";
    public const string NativeSegmentsDuplicate = "nativeSegments.duplicate";
    public const string NativeSegmentsSplit = "nativeSegments.split";
    public const string NativeSegmentsMerge = "nativeSegments.merge";
    public const string NativeSegmentsEdit = "nativeSegments.edit";
    public const string NativeSegmentsBulkRetag = "nativeSegments.bulkRetag";
    public const string NativeSegmentsRemove = "nativeSegments.remove";
    public const string OwnedSegmentsRead = "ownedSegments.read";
    public const string SegmentReview = "segments.review";
    public const string ProvenanceRead = "provenance.read";
    public const string LineageManage = "lineage.manage";
    public const string PerformerSlotsManage = "performerSlots.manage";
    public const string AnalysisFullScan = "analysis.fullScan";
    public const string ShotBoundariesManage = "shotBoundaries.manage";
    public const string EditorUndo = "editor.undo";
    public const string EditorFiltersNative = "editor.filters.native";
    public const string EditorFiltersWorkflow = "editor.filters.workflow";
    public const string RecyclingBinView = "recyclingBin.view";
    public const string RecyclingBinMove = "recyclingBin.move";
    public const string RecyclingBinRestore = "recyclingBin.restore";
    public const string RecyclingBinEmpty = "recyclingBin.empty";
    public const string WorkflowDeletionManage = "workflowDeletion.manage";
    public const string SegmentGroupsManage = "segmentGroups.manage";
    public const string FeedbackManage = "feedback.manage";
}

public sealed record SegmentStudioFeatureProfile(
    int SchemaVersion,
    string RequestedMode,
    string EffectiveMode,
    bool LegacyCompatibilityRequired,
    IReadOnlyList<string> Capabilities)
{
    public bool Has(string capability) =>
        Capabilities.Contains(capability, StringComparer.Ordinal);
}

public static class SegmentStudioFeatureProfileService
{
    public const int SchemaVersion = 1;

    private static readonly string[] BasicCapabilities =
    [
        SegmentStudioCapabilities.NavigationVideos,
        SegmentStudioCapabilities.SettingsGeneral,
        SegmentStudioCapabilities.SettingsShortcuts,
        SegmentStudioCapabilities.SettingsOrganization,
        SegmentStudioCapabilities.NativeSegmentsRead,
        SegmentStudioCapabilities.NativeSegmentsCreate,
        SegmentStudioCapabilities.NativeSegmentsDuplicate,
        SegmentStudioCapabilities.NativeSegmentsSplit,
        SegmentStudioCapabilities.NativeSegmentsMerge,
        SegmentStudioCapabilities.NativeSegmentsEdit,
        SegmentStudioCapabilities.NativeSegmentsBulkRetag,
        SegmentStudioCapabilities.NativeSegmentsRemove,
        SegmentStudioCapabilities.ProvenanceRead,
        SegmentStudioCapabilities.EditorUndo,
        SegmentStudioCapabilities.EditorFiltersNative,
        SegmentStudioCapabilities.RecyclingBinView,
        SegmentStudioCapabilities.RecyclingBinMove,
        SegmentStudioCapabilities.RecyclingBinRestore,
        SegmentStudioCapabilities.RecyclingBinEmpty,
        SegmentStudioCapabilities.SegmentGroupsManage,
        SegmentStudioCapabilities.FeedbackManage,
    ];

    private static readonly string[] FullOnlyCapabilities =
    [
        SegmentStudioCapabilities.NavigationSegmentInventory,
        SegmentStudioCapabilities.SettingsPerformerSlots,
        SegmentStudioCapabilities.SettingsDerivation,
        SegmentStudioCapabilities.OwnedSegmentsRead,
        SegmentStudioCapabilities.SegmentReview,
        SegmentStudioCapabilities.LineageManage,
        SegmentStudioCapabilities.PerformerSlotsManage,
        SegmentStudioCapabilities.AnalysisFullScan,
        SegmentStudioCapabilities.ShotBoundariesManage,
        SegmentStudioCapabilities.EditorFiltersWorkflow,
        SegmentStudioCapabilities.WorkflowDeletionManage,
    ];

    private static readonly HashSet<string> BasicOnlyCapabilities =
    [
        SegmentStudioCapabilities.NativeSegmentsCreate,
        SegmentStudioCapabilities.RecyclingBinView,
        SegmentStudioCapabilities.RecyclingBinMove,
        SegmentStudioCapabilities.RecyclingBinRestore,
        SegmentStudioCapabilities.RecyclingBinEmpty,
    ];

    private static readonly string[] FullCapabilities =
    [
        .. BasicCapabilities.Where(capability =>
            !BasicOnlyCapabilities.Contains(capability)),
        .. FullOnlyCapabilities,
    ];

    public static SegmentStudioFeatureProfile Build(
        string? storedMode,
        bool legacyCompatibilityRequired)
    {
        var requestedMode = SegmentStudioModes.NormalizePublic(storedMode);
        var effectiveMode = legacyCompatibilityRequired
            ? SegmentStudioModes.Full
            : requestedMode;
        var capabilities = effectiveMode == SegmentStudioModes.Full
            ? FullCapabilities
            : BasicCapabilities;
        return new SegmentStudioFeatureProfile(
            SchemaVersion,
            requestedMode,
            effectiveMode,
            legacyCompatibilityRequired,
            capabilities);
    }

    public static async Task<SegmentStudioFeatureProfile> GetAsync(
        DbContext db,
        int userId,
        CancellationToken ct)
    {
        var storedMode = await SegmentStudioUserPreferenceService.GetModeAsync(
            db, userId, ct);
        var legacyCompatibilityRequired =
            await SegmentStudioCompatibilityService.RequiresLegacyUiAsync(db, ct);
        return Build(storedMode, legacyCompatibilityRequired);
    }
}

public sealed record SegmentStudioCapabilityRequirement(string Capability);

public static class SegmentStudioCapabilityEndpointExtensions
{
    public static RouteHandlerBuilder RequireSegmentStudioCapability(
        this RouteHandlerBuilder builder,
        string capability)
    {
        builder.WithMetadata(new SegmentStudioCapabilityRequirement(capability));
        builder.AddEndpointFilter(async (context, next) =>
        {
            var services = context.HttpContext.RequestServices;
            var principalAccessor =
                services.GetRequiredService<ICurrentPrincipalAccessor>();
            if (principalAccessor.Current?.UserId is not int userId)
                return Results.Unauthorized();
            var db = services.GetRequiredService<DbContext>();
            await using var modeLock =
                await SegmentStudioModeLock.AcquireSharedAsync(
                    db,
                    userId,
                    context.HttpContext.RequestAborted);
            var profile = await SegmentStudioFeatureProfileService.GetAsync(
                db,
                userId,
                context.HttpContext.RequestAborted);
            if (!profile.Has(capability))
            {
                return Results.Json(
                    new
                    {
                        error = "This feature is not available in the current Segment Studio mode.",
                        code = "segment_studio_capability_required",
                        capability,
                        effectiveMode = profile.EffectiveMode,
                    },
                    statusCode: StatusCodes.Status409Conflict);
            }
            return await next(context);
        });
        return builder;
    }
}
