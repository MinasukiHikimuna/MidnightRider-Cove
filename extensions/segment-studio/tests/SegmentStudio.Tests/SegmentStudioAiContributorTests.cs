using System.Text.Json;
using AI.Extensions.Abstractions;
using Cove.Plugins;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
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
        // extension must register exactly one. Initialization publishes every
        // registered contributor, so the registrations are what this checks.
        var services = new ServiceCollection();
        new SegmentStudioExtension().ConfigureServices(services, CreateContext());

        var registration = Assert.Single(
            services, service => service.ServiceType == typeof(IAiCapabilityContributor));
        Assert.Equal(typeof(SegmentStudioAiContributor), registration.ImplementationType);
        Assert.Equal(ServiceLifetime.Singleton, registration.Lifetime);
    }

    [Fact]
    public async Task InitializationPublishesTheContributorForAiCore()
    {
        // AI Core does not see Segment Studio's service container. It reads
        // contributors from the host's service exchange, where initialization
        // publishes them through PublishContributions<IAiCapabilityContributor>.
        var extension = new SegmentStudioExtension();
        ((IManifestAware)extension).ApplyManifest(new ExtensionManifestFile
        {
            Id = SegmentStudioAiContributor.ExtensionId,
            Name = "Segment Studio",
            Version = "0.1.8",
        });
        var exchange = new ExtensionServiceExchange();
        var services = new ServiceCollection();
        extension.ConfigureServices(services, CreateContext());
        services.AddLogging();
        services.AddSingleton<IExtensionServiceExchange>(exchange);
        services.AddSingleton<IExtensionServiceScopeFactory, ProviderScopeFactory>();
        await using var provider = services.BuildServiceProvider();

        await extension.InitializeAsync(provider);
        try
        {
            var published = Assert.Single(exchange.GetAll<IAiCapabilityContributor>());
            Assert.IsType<SegmentStudioAiContributor>(published);
            Assert.Same(provider.GetRequiredService<IAiCapabilityContributor>(), published);

            // Published under Segment Studio's own id, so the host withdraws it when
            // the extension is disabled.
            exchange.WithdrawAll(SegmentStudioAiContributor.ExtensionId);
            Assert.Empty(exchange.GetAll<IAiCapabilityContributor>());
        }
        finally
        {
            await extension.ShutdownAsync();
        }
    }

    [Fact]
    public void TheManifestRequiresAiCoreForTheContract()
    {
        // The contributor contract is AI.Extensions.Abstractions. Segment Studio does
        // not ship it: AI Core does (the other AI extensions bundle copies too, and all
        // of them require AI Core), so depending on AI Core guarantees a copy is there.
        using var manifest = JsonDocument.Parse(File.ReadAllText(Path.Combine(
            AppContext.BaseDirectory, "..", "..", "..", "..", "..", "src", "SegmentStudio", "extension.json")));

        Assert.Equal(
            ">=0.6.0",
            manifest.RootElement.GetProperty("dependencies").GetProperty("cove.community.ai.core").GetString());
        Assert.Contains(
            "AI.Extensions.Abstractions",
            manifest.RootElement.GetProperty("sharedAssemblies").EnumerateArray().Select(item => item.GetString()));
    }

    [Fact]
    public void EveryCapabilityNamesAClaimTheDescriptorDeclares()
    {
        var descriptor = CreateContributor().Describe();
        var claimIds = descriptor.Claims.Select(claim => claim.ClaimId).ToHashSet(StringComparer.Ordinal);

        foreach (var capability in descriptor.Capabilities)
            Assert.All(capability.ClaimIds, claimId => Assert.Contains(claimId, claimIds));
    }

    private static ExtensionContext CreateContext() => new()
    {
        Configuration = new ConfigurationBuilder().Build(),
        DataDirectory = Path.GetTempPath(),
        CoveVersion = "1.4.0",
    };

    private sealed class ProviderScopeFactory(IServiceProvider provider) : IExtensionServiceScopeFactory
    {
        public IServiceScope CreateScope() => provider.CreateScope();

        public AsyncServiceScope CreateAsyncScope() => provider.CreateAsyncScope();
    }
}
