using Cove.Core.Auth;
using Cove.Plugins;
using Microsoft.AspNetCore.Http;

namespace ExternalSignIn;

public interface IExternalSignInSettingsProvider
{
    ExternalSignInSettings Current { get; }
}

internal sealed class TrustedHeaderAuthenticator(IExternalSignInSettingsProvider settings)
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        if (TryGetIdentity(context, out var identity))
            context.TrySetExtensionIdentityAssertion(identity);
        await next(context);
    }

    public bool TryGetIdentity(HttpContext context, out ExtensionIdentityAssertion identity)
    {
        ArgumentNullException.ThrowIfNull(context);
        var current = settings.Current;
        if (!current.TrustedHeaderReady
            || !TrustedProxyMatcher.IsTrusted(
                context.Connection.RemoteIpAddress,
                current.TrustedProxyCidrs)
            || !TryReadExactSubject(context, current.TrustedHeaderSubjectName, out var subject)
            || !TryReadDisplayLabel(context, current.TrustedHeaderDisplayName, out var accountLabel))
        {
            identity = null!;
            return false;
        }

        identity = new ExtensionIdentityAssertion(
            ExternalSignInExtension.ExtensionId,
            current.TrustedHeaderProviderId,
            subject,
            "trusted-header",
            current.TrustedHeaderLabel,
            accountLabel)
        {
            IsAuthoritative = true,
        };
        return true;
    }

    private static bool TryReadExactSubject(
        HttpContext context,
        string headerName,
        out string subject)
    {
        if (context.Request.Headers.TryGetValue(headerName, out var values)
            && values.Count == 1
            && values[0] is { } value
            && !string.IsNullOrWhiteSpace(value)
            && value.Length <= 512
            && !value.Contains(',')
            && !value.Any(char.IsControl))
        {
            // Authority subjects are opaque. Preserve whitespace and case exactly.
            subject = value;
            return true;
        }
        subject = string.Empty;
        return false;
    }

    private static bool TryReadDisplayLabel(
        HttpContext context,
        string headerName,
        out string? accountLabel)
    {
        accountLabel = null;
        if (headerName.Length == 0 || !context.Request.Headers.TryGetValue(headerName, out var values))
            return true;
        if (values.Count != 1 || values[0] is not { } value)
            return false;

        var normalized = value.Trim();
        if (string.IsNullOrWhiteSpace(normalized)
            || normalized.Length > 256
            || normalized.Any(char.IsControl))
        {
            return false;
        }
        accountLabel = normalized;
        return true;
    }
}
