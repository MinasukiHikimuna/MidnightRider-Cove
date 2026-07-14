using System.Security.Cryptography;

namespace HashTheCove;

public static class FileHasher
{
    public static async Task<IReadOnlyDictionary<string, string>> HashAsync(
        string path,
        IReadOnlyCollection<string> algorithms,
        CancellationToken ct = default)
    {
        var selected = new HashSet<string>(algorithms, StringComparer.OrdinalIgnoreCase);
        var xxHash = selected.Contains("xxhash") ? new XxHash64() : null;
        using var sha256 = selected.Contains("sha256") ? IncrementalHash.CreateHash(HashAlgorithmName.SHA256) : null;
        using var sha1 = selected.Contains("sha1") ? IncrementalHash.CreateHash(HashAlgorithmName.SHA1) : null;
        var buffer = new byte[128 * 1024];

        await using var stream = new FileStream(
            path,
            FileMode.Open,
            FileAccess.Read,
            FileShare.Read,
            buffer.Length,
            FileOptions.Asynchronous | FileOptions.SequentialScan);

        while (true)
        {
            var read = await stream.ReadAsync(buffer, ct);
            if (read == 0)
                break;

            var chunk = buffer.AsSpan(0, read);
            xxHash?.Append(chunk);
            sha256?.AppendData(chunk);
            sha1?.AppendData(chunk);
        }

        var hashes = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
        if (xxHash is not null) hashes["xxhash"] = xxHash.GetHexDigest();
        if (sha256 is not null) hashes["sha256"] = Convert.ToHexString(sha256.GetHashAndReset()).ToLowerInvariant();
        if (sha1 is not null) hashes["sha1"] = Convert.ToHexString(sha1.GetHashAndReset()).ToLowerInvariant();
        return hashes;
    }
}
