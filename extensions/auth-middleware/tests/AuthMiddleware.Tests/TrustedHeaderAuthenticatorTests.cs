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
    public async Task Trusted_direct_peer_can_assert_an_exact_stable_subject_and_display_label()
    {
        var settings = AuthMiddlewareSettings.Default with
        {
            TrustedHeaderEnabled = true,
            TrustedHeaderProviderId = "proxy-authority",
            TrustedHeaderSubjectName = "X-Authentik-Uid",
            TrustedHeaderDisplayName = "X-Authentik-Username",
            TrustedProxyCidrs = ["192.0.2.0/24"],
        };
        var authenticator = new TrustedHeaderAuthenticator(new FixedSettings(settings));
        var context = Context("192.0.2.14");
        context.Request.Headers["X-Authentik-Uid"] = " authority-subject ";
        context.Request.Headers["X-Authentik-Username"] = " existing-user ";
        var nextCalled = false;

        await authenticator.InvokeAsync(context, _ =>
        {
            nextCalled = true;
            return Task.CompletedTask;
        });

        Assert.True(nextCalled);
        Assert.True(context.TryGetExtensionIdentityAssertion(out var assertion));
        Assert.Equal(AuthMiddlewareExtension.ExtensionId, assertion.ExtensionId);
        Assert.Equal("proxy-authority", assertion.ProviderId);
        Assert.Equal(" authority-subject ", assertion.Subject);
        Assert.Equal("existing-user", assertion.AccountLabel);
        Assert.Equal("trusted-header", assertion.Method);
        Assert.True(assertion.IsAuthoritative);
    }

    [Fact]
    public async Task Untrusted_peer_and_ambiguous_headers_fail_closed()
    {
        var settings = AuthMiddlewareSettings.Default with
        {
            TrustedHeaderEnabled = true,
            TrustedHeaderProviderId = "proxy-authority",
            TrustedProxyCidrs = ["192.0.2.0/24"],
        };
        var authenticator = new TrustedHeaderAuthenticator(new FixedSettings(settings));
        var untrusted = Context("198.51.100.9");
        untrusted.Request.Headers[settings.TrustedHeaderSubjectName] = "subject-1";
        var ambiguous = Context("192.0.2.14");
        ambiguous.Request.Headers[settings.TrustedHeaderSubjectName] = new StringValues(["subject-1", "subject-2"]);

        await authenticator.InvokeAsync(untrusted, _ => Task.CompletedTask);
        await authenticator.InvokeAsync(ambiguous, _ => Task.CompletedTask);

        Assert.False(untrusted.TryGetExtensionIdentityAssertion(out _));
        Assert.False(ambiguous.TryGetExtensionIdentityAssertion(out _));
    }

    [Fact]
    public async Task Forwarded_address_headers_never_make_an_untrusted_direct_peer_trusted()
    {
        var settings = AuthMiddlewareSettings.Default with
        {
            TrustedHeaderEnabled = true,
            TrustedHeaderProviderId = "proxy-authority",
            TrustedProxyCidrs = ["192.0.2.14/32"],
        };
        var context = Context("198.51.100.9");
        context.Request.Headers["X-Forwarded-For"] = "192.0.2.14";
        context.Request.Headers[settings.TrustedHeaderSubjectName] = "subject-1";

        await new TrustedHeaderAuthenticator(new FixedSettings(settings))
            .InvokeAsync(context, _ => Task.CompletedTask);

        Assert.False(context.TryGetExtensionIdentityAssertion(out _));
    }

    [Theory]
    [InlineData("existing-user,other-user")]
    [InlineData(" ")]
    [InlineData("existing\ruser")]
    public async Task Malformed_subject_header_fails_closed(string value)
    {
        var settings = AuthMiddlewareSettings.Default with
        {
            TrustedHeaderEnabled = true,
            TrustedHeaderProviderId = "proxy-authority",
            TrustedProxyCidrs = ["192.0.2.14/32"],
        };
        var context = Context("192.0.2.14");
        context.Request.Headers[settings.TrustedHeaderSubjectName] = value;

        await new TrustedHeaderAuthenticator(new FixedSettings(settings))
            .InvokeAsync(context, _ => Task.CompletedTask);

        Assert.False(context.TryGetExtensionIdentityAssertion(out _));
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
