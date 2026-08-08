using Cove.Plugins;
using Microsoft.AspNetCore.Http;

namespace AuthMiddleware;

public interface IAuthMiddlewareSettingsProvider
{
    AuthMiddlewareSettings Current { get; }
}

internal sealed class TrustedHeaderAuthenticator(IAuthMiddlewareSettingsProvider settings)
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        var current = settings.Current;
        if (current.TrustedHeaderEnabled
            && TrustedProxyMatcher.IsTrusted(
                context.Connection.RemoteIpAddress,
                current.TrustedProxyCidrs)
            && context.Request.Headers.TryGetValue(current.TrustedHeaderName, out var values)
            && values.Count == 1)
        {
            var username = values[0]?.Trim();
            if (IsSafeUsername(username))
            {
                context.TrySetExtensionUserAssertion(new ExtensionUserAssertion(
                    AuthMiddlewareExtension.ExtensionId,
                    username!,
                    "trusted-header"));
            }
        }

        await next(context);
    }

    private static bool IsSafeUsername(string? value) =>
        !string.IsNullOrWhiteSpace(value)
        && value.Length <= 256
        && !value.Contains(',')
        && !value.Any(char.IsControl);
}
