using System.Globalization;
using System.Net;

namespace AuthMiddleware;

internal static class TrustedProxyMatcher
{
    public static bool IsTrusted(IPAddress? remoteAddress, IReadOnlyList<string> networks)
    {
        if (remoteAddress is null || networks.Count == 0)
            return false;

        var candidate = NormalizeAddress(remoteAddress);
        foreach (var text in networks)
        {
            if (TryParse(text, out var network) && network.Contains(candidate))
                return true;
        }

        return false;
    }

    public static bool TryNormalizeNetwork(string? value, out string normalized)
    {
        if (TryParse(value, out var network))
        {
            normalized = network.ToString();
            return true;
        }

        normalized = string.Empty;
        return false;
    }

    private static bool TryParse(string? value, out Network network)
    {
        network = default;
        var text = value?.Trim();
        if (string.IsNullOrWhiteSpace(text) || text.Length > 128)
            return false;

        var slash = text.IndexOf('/');
        if (slash != text.LastIndexOf('/'))
            return false;

        var addressText = slash < 0 ? text : text[..slash];
        if (!IPAddress.TryParse(addressText, out var parsed))
            return false;

        var address = NormalizeAddress(parsed);
        if (address.AddressFamily == System.Net.Sockets.AddressFamily.InterNetworkV6
            && address.ScopeId != 0)
        {
            return false;
        }

        var bytes = address.GetAddressBytes();
        var maximumPrefix = bytes.Length * 8;
        var prefix = maximumPrefix;
        if (slash >= 0
            && (!int.TryParse(text[(slash + 1)..], NumberStyles.None, CultureInfo.InvariantCulture, out prefix)
                || prefix < 0
                || prefix > maximumPrefix))
        {
            return false;
        }

        ApplyMask(bytes, prefix);
        network = new Network(new IPAddress(bytes), prefix);
        return true;
    }

    private static IPAddress NormalizeAddress(IPAddress address) =>
        address.IsIPv4MappedToIPv6 ? address.MapToIPv4() : address;

    private static void ApplyMask(byte[] bytes, int prefixLength)
    {
        var completeBytes = prefixLength / 8;
        var remainingBits = prefixLength % 8;
        if (remainingBits != 0 && completeBytes < bytes.Length)
        {
            bytes[completeBytes] &= (byte)(0xff << (8 - remainingBits));
            completeBytes++;
        }

        Array.Clear(bytes, completeBytes, bytes.Length - completeBytes);
    }

    private readonly record struct Network(IPAddress Address, int PrefixLength)
    {
        public bool Contains(IPAddress candidate)
        {
            candidate = NormalizeAddress(candidate);
            var networkBytes = Address.GetAddressBytes();
            var candidateBytes = candidate.GetAddressBytes();
            if (networkBytes.Length != candidateBytes.Length)
                return false;

            var completeBytes = PrefixLength / 8;
            for (var index = 0; index < completeBytes; index++)
            {
                if (networkBytes[index] != candidateBytes[index])
                    return false;
            }

            var remainingBits = PrefixLength % 8;
            if (remainingBits == 0)
                return true;

            var mask = (byte)(0xff << (8 - remainingBits));
            return (networkBytes[completeBytes] & mask) == (candidateBytes[completeBytes] & mask);
        }

        public override string ToString() => $"{Address}/{PrefixLength}";
    }
}
