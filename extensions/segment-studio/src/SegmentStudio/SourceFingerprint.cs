using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace SegmentStudio;

/// <summary>
/// Identifies the file an analysis ran against, as it was when the run read it.
/// </summary>
/// <remarks>
/// Candidate keys are derived from this, so a re-run over an unchanged file
/// re-derives the keys a reviewer has already seen, while replacing or re-encoding
/// the file produces new ones rather than silently attaching old review decisions
/// to different content. The payload has the same fields as the one Segment
/// Studio's standalone analysis service hashed, but not the same bytes
/// (modification-time precision, path resolution and JSON escaping differ), so
/// keys from that service's runs do not carry over.
/// </remarks>
public static class SourceFingerprint
{
    public static string For(string path)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(path);
        string payload;
        try
        {
            var info = new FileInfo(path);
            // Size and modification time together are cheap to read, and enough to
            // notice the file changed without hashing a multi-gigabyte video on
            // every run.
            var mtimeNanoseconds =
                (info.LastWriteTimeUtc.Ticks - DateTime.UnixEpoch.Ticks) * 100L;
            payload = Compose(info.FullName, mtimeNanoseconds, info.Length);
        }
        catch (Exception error) when (
            error is IOException or UnauthorizedAccessException or ArgumentException)
        {
            // An unreadable file still needs a stable key, and the path alone gives
            // one; it simply cannot notice that the content changed.
            payload = Compose(path, 0, 0);
        }
        return $"sha256:{Convert.ToHexStringLower(SHA256.HashData(Encoding.UTF8.GetBytes(payload)))}";
    }

    private static string Compose(string canonicalPath, long mtimeNanoseconds, long sizeBytes)
        => $"{{\"canonicalPath\":{JsonSerializer.Serialize(canonicalPath)},"
            + $"\"mtimeNs\":{mtimeNanoseconds},\"sizeBytes\":{sizeBytes}}}";
}
