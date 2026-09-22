using System.Reflection;
using AI.Extensions.Abstractions;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging.Abstractions;
using SegmentStudio;
using Xunit;

namespace SegmentStudio.Tests;

public sealed class SegmentStudioAiContributorTests
{
    private static SegmentStudioAiContributor CreateContributor()
        => new(
            new ServiceCollection().BuildServiceProvider().GetRequiredService<IServiceScopeFactory>(),
            NullLogger<SegmentStudioAiContributor>.Instance);

    /// <summary>
    /// A run that is not anchored to a Cove video: every handler returns before it
    /// touches the database, so this exercises routing on its own.
    /// </summary>
    private static AiDispatchRequest RequestFor(params AiCapabilityClaim[] claims)
        => new(
            new AiRunContext("run-1", AiMediaKinds.Video, "asset-1", "subject"),
            claims,
            new AiAnalyzeResult { MediaKind = AiMediaKinds.Video });

    [Fact]
    public async Task EveryAdvertisedClaimIsRouted()
    {
        // The bug this guards: AI Core groups a run's claims by extension id and
        // dispatches the group to ONE contributor, so a claim the contributor
        // advertises but does not route is dropped with no error and a run that
        // still reports success.
        var contributor = CreateContributor();
        var claims = contributor.Describe().Claims;

        var result = await contributor.DispatchAsync(RequestFor([.. claims]));

        Assert.Equal(claims.Count, result.ClaimCount);
        Assert.DoesNotContain(
            result.Notes ?? [],
            note => note.Contains("does not handle", StringComparison.OrdinalIgnoreCase));
        foreach (var claim in claims)
            Assert.True(
                result.PreparedCounts?.ContainsKey(claim.OutputKey) == true,
                $"claim {claim.ClaimId} produced no entry for output key '{claim.OutputKey}'");
    }

    [Fact]
    public async Task AnUnroutedClaimIsReportedRatherThanIgnored()
    {
        var contributor = CreateContributor();
        var stranger = new AiCapabilityClaim(
            "segment-studio.video.not-a-real-claim", "Stranger", AiMediaKinds.Video,
            "tagging", "frame", "stranger");

        var result = await contributor.DispatchAsync(RequestFor(stranger));

        Assert.Contains(
            result.Notes ?? [],
            note => note.Contains("does not handle", StringComparison.OrdinalIgnoreCase));
    }

    [Fact]
    public void TheExtensionRegistersExactlyOneContributor()
    {
        // A second IAiCapabilityContributor under the same extension id would be
        // silently ignored by AI Core along with every claim it owns, so the
        // extension must keep exactly one.
        var contributors = typeof(SegmentStudioAiContributor).Assembly
            .GetTypes()
            .Where(type => type is { IsAbstract: false, IsInterface: false }
                && typeof(IAiCapabilityContributor).IsAssignableFrom(type))
            .ToArray();

        Assert.Equal([typeof(SegmentStudioAiContributor)], contributors);
    }

    [Fact]
    public void ShotBoundariesAndTaggingStaySeparatelySelectable()
    {
        // The Run AI dialog renders one checkbox per capability and run presets
        // address capabilities by id, so merging the contributors must not merge
        // the features.
        var descriptor = CreateContributor().Describe();

        Assert.Equal(2, descriptor.Capabilities.Count);
        Assert.Equal(
            [SegmentStudioAiContributor.TaggingCapabilityId, SegmentStudioAiContributor.ShotBoundaryCapabilityId],
            descriptor.Capabilities.Select(capability => capability.CapabilityId).Order());
        Assert.All(
            descriptor.Capabilities,
            capability => Assert.Single(capability.ClaimIds));
    }

    [Fact]
    public void EveryCapabilityNamesAClaimTheDescriptorDeclares()
    {
        var descriptor = CreateContributor().Describe();
        var claimIds = descriptor.Claims.Select(claim => claim.ClaimId).ToHashSet(StringComparer.Ordinal);

        foreach (var capability in descriptor.Capabilities)
            Assert.All(capability.ClaimIds, claimId => Assert.Contains(claimId, claimIds));
    }
}
