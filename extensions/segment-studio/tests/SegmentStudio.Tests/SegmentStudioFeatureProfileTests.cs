using SegmentStudio;

namespace SegmentStudio.Tests;

public sealed class SegmentStudioFeatureProfileTests
{
    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("unexpected")]
    [InlineData("editor")]
    [InlineData("basic")]
    public void BasicProfileExposesOnlyNativeWorkflowCapabilities(string? storedMode)
    {
        var profile = SegmentStudioFeatureProfileService.Build(
            storedMode,
            legacyCompatibilityRequired: false);

        Assert.Equal(1, profile.SchemaVersion);
        Assert.Equal("basic", profile.RequestedMode);
        Assert.Equal("basic", profile.EffectiveMode);
        Assert.True(profile.Has(SegmentStudioCapabilities.NativeSegmentsMerge));
        Assert.True(profile.Has(SegmentStudioCapabilities.NativeSegmentsRemove));
        Assert.True(profile.Has(SegmentStudioCapabilities.EditorUndo));
        Assert.True(profile.Has(SegmentStudioCapabilities.EditorFiltersNative));
        Assert.True(profile.Has(SegmentStudioCapabilities.FeedbackManage));
        Assert.True(profile.Has(SegmentStudioCapabilities.RecyclingBinRestore));
        Assert.False(profile.Has(SegmentStudioCapabilities.NavigationSegmentInventory));
        Assert.False(profile.Has(SegmentStudioCapabilities.SegmentReview));
        Assert.False(profile.Has(SegmentStudioCapabilities.OwnedSegmentsRead));
        Assert.False(profile.Has(SegmentStudioCapabilities.ShotBoundariesManage));
        Assert.False(profile.Has(SegmentStudioCapabilities.AnalysisFullScan));
        Assert.False(profile.Has(SegmentStudioCapabilities.SettingsPerformerSlots));
        Assert.False(profile.Has(SegmentStudioCapabilities.SettingsDerivation));
    }

    [Theory]
    [InlineData("review")]
    [InlineData("full")]
    public void FullProfileAddsWorkflowCapabilities(string storedMode)
    {
        var profile = SegmentStudioFeatureProfileService.Build(
            storedMode,
            legacyCompatibilityRequired: false);

        Assert.Equal("full", profile.RequestedMode);
        Assert.Equal("full", profile.EffectiveMode);
        Assert.False(profile.Has(SegmentStudioCapabilities.NativeSegmentsCreate));
        Assert.True(profile.Has(SegmentStudioCapabilities.NativeSegmentsMerge));
        Assert.True(profile.Has(SegmentStudioCapabilities.NativeSegmentsRemove));
        Assert.True(profile.Has(SegmentStudioCapabilities.NavigationSegmentInventory));
        Assert.True(profile.Has(SegmentStudioCapabilities.SegmentReview));
        Assert.True(profile.Has(SegmentStudioCapabilities.OwnedSegmentsRead));
        Assert.True(profile.Has(SegmentStudioCapabilities.ShotBoundariesManage));
        Assert.True(profile.Has(SegmentStudioCapabilities.AnalysisFullScan));
        Assert.True(profile.Has(SegmentStudioCapabilities.SettingsPerformerSlots));
        Assert.True(profile.Has(SegmentStudioCapabilities.SettingsDerivation));
        Assert.True(profile.Has(SegmentStudioCapabilities.FeedbackManage));
        Assert.False(profile.Has(SegmentStudioCapabilities.RecyclingBinView));
        Assert.False(profile.Has(SegmentStudioCapabilities.RecyclingBinMove));
    }

    [Fact]
    public void CompatibilityRequirementForcesFullWithoutChangingRequestedMode()
    {
        var profile = SegmentStudioFeatureProfileService.Build(
            "editor",
            legacyCompatibilityRequired: true);

        Assert.Equal("basic", profile.RequestedMode);
        Assert.Equal("full", profile.EffectiveMode);
        Assert.True(profile.LegacyCompatibilityRequired);
        Assert.True(profile.Has(SegmentStudioCapabilities.SegmentReview));
    }

    [Theory]
    [InlineData("basic", "editor")]
    [InlineData("editor", "editor")]
    [InlineData("full", "review")]
    [InlineData("review", "review")]
    public void PublicAndLegacyModesMapToStableStorage(
        string requestedMode,
        string storedMode)
    {
        Assert.Equal(storedMode, SegmentStudioModes.ToStored(requestedMode));
    }
}
