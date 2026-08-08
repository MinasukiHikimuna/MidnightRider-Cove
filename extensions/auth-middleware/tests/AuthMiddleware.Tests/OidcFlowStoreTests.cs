namespace AuthMiddleware.Tests;

public sealed class OidcFlowStoreTests
{
    [Fact]
    public void Flow_is_single_use_and_contains_pkce_state_nonce_and_browser_binding()
    {
        var time = new MutableTimeProvider(DateTimeOffset.UnixEpoch);
        var store = new OidcFlowStore(time);
        var settings = AuthMiddlewareSettingsTests.ValidSettings();
        var flow = store.Create(
            settings,
            Assert.Single(settings.OidcProviders),
            ProviderConfiguration(),
            "browser-binding",
            "/settings?tab=security");

        Assert.True(flow.State.Length >= 40);
        Assert.True(flow.Nonce.Length >= 40);
        Assert.True(flow.CodeVerifier.Length >= 43);
        Assert.True(flow.CodeChallenge.Length >= 43);
        Assert.Equal("browser-binding", flow.BrowserBinding);
        Assert.Equal("/settings?tab=security", flow.ReturnUrl);
        Assert.Same(flow, store.TryGet(flow.State));
        Assert.Same(flow, store.TryTake(flow.State, flow));
        Assert.Null(store.TryGet(flow.State));
        Assert.Null(store.TryTake(flow.State, flow));
    }

    [Fact]
    public void Expired_flow_is_not_returned()
    {
        var time = new MutableTimeProvider(DateTimeOffset.UnixEpoch);
        var store = new OidcFlowStore(time);
        var settings = AuthMiddlewareSettingsTests.ValidSettings();
        var flow = store.Create(
            settings,
            Assert.Single(settings.OidcProviders),
            ProviderConfiguration(),
            "binding",
            null);

        time.Advance(TimeSpan.FromMinutes(11));

        Assert.Null(store.TryGet(flow.State));
    }

    [Fact]
    public void Link_flow_requires_and_retains_its_one_time_intent()
    {
        var store = new OidcFlowStore(TimeProvider.System);
        var settings = AuthMiddlewareSettingsTests.ValidSettings();

        Assert.Throws<ArgumentException>(() => store.Create(
            settings,
            Assert.Single(settings.OidcProviders),
            ProviderConfiguration(),
            "binding",
            null,
            OidcFlowPurpose.Link));

        var flow = store.Create(
            settings,
            Assert.Single(settings.OidcProviders),
            ProviderConfiguration(),
            "binding",
            null,
            OidcFlowPurpose.Link,
            "intent-token");

        Assert.Equal(OidcFlowPurpose.Link, flow.Purpose);
        Assert.Equal("intent-token", flow.LinkIntentToken);
    }

    private static OidcProviderConfiguration ProviderConfiguration() => new(
        "https://idp.example.invalid/application/o/cove/",
        new Uri("https://idp.example.invalid/application/o/authorize/"),
        new Uri("https://idp.example.invalid/application/o/token/"),
        new Uri("https://idp.example.invalid/application/o/cove/jwks/"),
        []);

    private sealed class MutableTimeProvider(DateTimeOffset now) : TimeProvider
    {
        public override DateTimeOffset GetUtcNow() => now;
        public void Advance(TimeSpan value) => now += value;
    }
}
