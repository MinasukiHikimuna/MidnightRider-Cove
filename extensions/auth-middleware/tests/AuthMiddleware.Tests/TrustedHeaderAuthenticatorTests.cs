using System.Net;
using Cove.Plugins;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;

namespace AuthMiddleware.Tests;

public sealed class TrustedHeaderAuthenticatorTests
{
    [Theory]
    [InlineData("192.0.2.14", "192.0.2.14/32")]
    [InlineData("192.0.2.14", "192.0.2.0/24")]
    [InlineData("2001:db8::25", "2001:db8::/64")]
    [InlineData("::ffff:192.0.2.14", "192.0.2.0/24")]
    public void Trusted_proxy_matcher_accepts_only_addresses_inside_configured_networks(
        string remoteAddress,
        string trustedCidr)
    {
        Assert.True(TrustedProxyMatcher.IsTrusted(
            IPAddress.Parse(remoteAddress),
            [trustedCidr]));
        Assert.False(TrustedProxyMatcher.IsTrusted(
            IPAddress.Parse("198.51.100.9"),
            [trustedCidr]));
    }

    [Fact]
    public async Task Trusted_direct_peer_can_assert_exactly_one_username_header()
    {
        var settings = AuthMiddlewareSettings.Default with
        {
            TrustedHeaderEnabled = true,
            TrustedHeaderName = "X-Authentik-Username",
            TrustedProxyCidrs = ["192.0.2.0/24"],
        };
        var authenticator = new TrustedHeaderAuthenticator(new FixedSettings(settings));
        var context = Context("192.0.2.14");
        context.Request.Headers["X-Authentik-Username"] = " existing-user ";
        var nextCalled = false;

        await authenticator.InvokeAsync(context, _ =>
        {
            nextCalled = true;
            return Task.CompletedTask;
        });

        Assert.True(nextCalled);
        Assert.True(context.TryGetExtensionUserAssertion(out var assertion));
        Assert.Equal(AuthMiddlewareExtension.ExtensionId, assertion.ExtensionId);
        Assert.Equal("existing-user", assertion.Username);
        Assert.Equal("trusted-header", assertion.Method);
    }

    [Fact]
    public async Task Untrusted_peer_and_ambiguous_headers_fail_closed()
    {
        var settings = AuthMiddlewareSettings.Default with
        {
            TrustedHeaderEnabled = true,
            TrustedHeaderName = "X-Authentik-Username",
            TrustedProxyCidrs = ["192.0.2.0/24"],
        };
        var authenticator = new TrustedHeaderAuthenticator(new FixedSettings(settings));
        var untrusted = Context("198.51.100.9");
        untrusted.Request.Headers["X-Authentik-Username"] = "existing-user";
        var ambiguous = Context("192.0.2.14");
        ambiguous.Request.Headers["X-Authentik-Username"] = new StringValues(["existing-user", "other-user"]);

        await authenticator.InvokeAsync(untrusted, _ => Task.CompletedTask);
        await authenticator.InvokeAsync(ambiguous, _ => Task.CompletedTask);

        Assert.False(untrusted.TryGetExtensionUserAssertion(out _));
        Assert.False(ambiguous.TryGetExtensionUserAssertion(out _));
    }

    [Fact]
    public async Task Forwarded_address_headers_never_make_an_untrusted_direct_peer_trusted()
    {
        var settings = AuthMiddlewareSettings.Default with
        {
            TrustedHeaderEnabled = true,
            TrustedProxyCidrs = ["192.0.2.14/32"],
        };
        var context = Context("198.51.100.9");
        context.Request.Headers["X-Forwarded-For"] = "192.0.2.14";
        context.Request.Headers[settings.TrustedHeaderName] = "existing-user";

        await new TrustedHeaderAuthenticator(new FixedSettings(settings))
            .InvokeAsync(context, _ => Task.CompletedTask);

        Assert.False(context.TryGetExtensionUserAssertion(out _));
    }

    [Theory]
    [InlineData("existing-user,other-user")]
    [InlineData(" ")]
    [InlineData("existing\ruser")]
    public async Task Malformed_username_header_fails_closed(string value)
    {
        var settings = AuthMiddlewareSettings.Default with
        {
            TrustedHeaderEnabled = true,
            TrustedProxyCidrs = ["192.0.2.14/32"],
        };
        var context = Context("192.0.2.14");
        context.Request.Headers[settings.TrustedHeaderName] = value;

        await new TrustedHeaderAuthenticator(new FixedSettings(settings))
            .InvokeAsync(context, _ => Task.CompletedTask);

        Assert.False(context.TryGetExtensionUserAssertion(out _));
    }

    private static DefaultHttpContext Context(string remoteAddress)
    {
        var context = new DefaultHttpContext();
        context.Connection.RemoteIpAddress = IPAddress.Parse(remoteAddress);
        return context;
    }

    private sealed class FixedSettings(AuthMiddlewareSettings settings) : IAuthMiddlewareSettingsProvider
    {
        public AuthMiddlewareSettings Current => settings;
    }
}
