using Cove.Plugins;
using Microsoft.Extensions.Logging;

namespace HashTheCove;

public sealed record HashJobTotals(int Processed, int Added, int Skipped, int Failed);

public sealed class HashJobRunner(IHashFileRepository repository, ILogger<HashJobRunner> logger)
{
    public async Task<HashJobTotals> RunAsync(HashSettings settings, IJobProgress progress, CancellationToken ct)
    {
        ct.ThrowIfCancellationRequested();
        var algorithms = settings.EnabledAlgorithms;
        var plan = await repository.BuildPlanAsync(
            settings.HashVideos,
            settings.HashGalleries,
            settings.XxHash,
            settings.Sha256,
            settings.Sha1,
            ct);
        var ids = plan.FileIds;
        var processed = 0;
        var added = 0;
        var skipped = 0;
        var failed = 0;

        progress.Report(0, FormatPlan(plan, settings));

        foreach (var id in ids)
        {
            ct.ThrowIfCancellationRequested();
            try
            {
                var file = await repository.FindAsync(id, ct);
                if (file is null)
                    throw new FileNotFoundException($"Cove file record {id} no longer exists.");

                var missing = algorithms
                    .Where(algorithm => !file.FingerprintTypes.Contains(algorithm, StringComparer.OrdinalIgnoreCase))
                    .ToArray();
                if (missing.Length == 0)
                {
                    skipped++;
                    continue;
                }

                var before = ReadAndValidate(file);
                var hashes = await FileHasher.HashAsync(file.Path, missing, ct);
                EnsureStillUnchanged(file.Path, before);
                var inserted = await repository.AddMissingAsync(file.Id, hashes, ct);
                added += inserted;
                if (inserted == 0)
                    skipped++;
            }
            catch (OperationCanceledException) when (ct.IsCancellationRequested)
            {
                throw;
            }
            catch (Exception ex)
            {
                failed++;
                logger.LogWarning(ex, "Could not hash Cove file record {FileId}", id);
            }
            finally
            {
                processed++;
                progress.Report(
                    ids.Count == 0 ? 1 : (double)processed / ids.Count,
                    $"{FormatPlan(plan, settings)} {FormatTotals(processed, added, skipped, failed)}");
            }
        }

        var totals = new HashJobTotals(processed, added, skipped, failed);
        progress.Report(1, $"{FormatPlan(plan, settings)} {FormatTotals(totals.Processed, totals.Added, totals.Skipped, totals.Failed)}");
        return totals;
    }

    private static FileSnapshot ReadAndValidate(HashFileRecord file)
    {
        var info = new FileInfo(file.Path);
        if (!info.Exists)
            throw new FileNotFoundException("File not found.", file.Path);
        var recordedTime = file.ModTime.Kind switch
        {
            DateTimeKind.Utc => file.ModTime,
            DateTimeKind.Local => file.ModTime.ToUniversalTime(),
            _ => DateTime.SpecifyKind(file.ModTime, DateTimeKind.Utc),
        };
        // Cove imports can preserve only whole-second timestamp precision even when the mounted
        // filesystem reports fractional seconds. The exact snapshot check after hashing still
        // detects any modification that occurs while this job reads the file.
        if (info.Length != file.Size || (info.LastWriteTimeUtc - recordedTime).Duration() >= TimeSpan.FromSeconds(1))
            throw new IOException($"File changed since Cove recorded its metadata: {file.Path}");
        return new FileSnapshot(info.Length, info.LastWriteTimeUtc);
    }

    private static void EnsureStillUnchanged(string path, FileSnapshot before)
    {
        var info = new FileInfo(path);
        if (!info.Exists || info.Length != before.Size || info.LastWriteTimeUtc != before.ModTime)
            throw new IOException($"File changed while it was being hashed: {path}");
    }

    private static string FormatTotals(int processed, int added, int skipped, int failed) =>
        $"Processed {processed}; added {added}; skipped {skipped}; failed {failed}.";

    private static string FormatPlan(HashWorkPlan plan, HashSettings settings)
    {
        var missing = new List<string>();
        if (settings.XxHash) missing.Add($"{plan.MissingXxHash} xxhash");
        if (settings.Sha256) missing.Add($"{plan.MissingSha256} sha256");
        if (settings.Sha1) missing.Add($"{plan.MissingSha1} sha1");
        return missing.Count == 0
            ? "Found 0 files to process. No hash algorithms are enabled."
            : $"Found {plan.FileIds.Count} files to process. Missing fingerprints: {string.Join("; ", missing)}.";
    }

    private readonly record struct FileSnapshot(long Size, DateTime ModTime);
}
