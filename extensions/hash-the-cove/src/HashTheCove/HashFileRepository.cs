using Cove.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace HashTheCove;

public sealed record HashFileRecord(
    int Id,
    string Path,
    long Size,
    DateTime ModTime,
    IReadOnlyCollection<string> FingerprintTypes);

public sealed record HashWorkPlan(
    IReadOnlyList<int> FileIds,
    int MissingXxHash,
    int MissingSha256,
    int MissingSha1);

public interface IHashFileRepository
{
    Task<HashWorkPlan> BuildPlanAsync(
        bool videos,
        bool galleries,
        bool xxHash,
        bool sha256,
        bool sha1,
        CancellationToken ct);
    Task<HashFileRecord?> FindAsync(int id, CancellationToken ct);
    Task<int> AddMissingAsync(int id, IReadOnlyDictionary<string, string> hashes, CancellationToken ct);
}

internal sealed class EfHashFileRepository(DbContext db) : IHashFileRepository
{
    public async Task<HashWorkPlan> BuildPlanAsync(
        bool videos,
        bool galleries,
        bool xxHash,
        bool sha256,
        bool sha1,
        CancellationToken ct)
    {
        if (!xxHash && !sha256 && !sha1)
            return new HashWorkPlan([], 0, 0, 0);

        var rows = new List<HashPlanRow>();
        if (videos)
            rows.AddRange(await PlanRows(db.Set<VideoFile>(), ct));
        if (galleries)
            rows.AddRange(await PlanRows(db.Set<GalleryFile>(), ct));

        var missingXxHash = xxHash ? rows.Count(row => !row.HasXxHash) : 0;
        var missingSha256 = sha256 ? rows.Count(row => !row.HasSha256) : 0;
        var missingSha1 = sha1 ? rows.Count(row => !row.HasSha1) : 0;
        var ids = rows
            .Where(row =>
                (xxHash && !row.HasXxHash)
                || (sha256 && !row.HasSha256)
                || (sha1 && !row.HasSha1))
            .Select(row => row.Id)
            .Order()
            .ToArray();
        return new HashWorkPlan(ids, missingXxHash, missingSha256, missingSha1);
    }

    private static async Task<List<HashPlanRow>> PlanRows<TFile>(IQueryable<TFile> files, CancellationToken ct)
        where TFile : BaseFileEntity =>
        await files.AsNoTracking()
            .Select(file => new HashPlanRow(
                file.Id,
                file.Fingerprints.Any(fingerprint => fingerprint.Type.ToLower() == "xxhash"),
                file.Fingerprints.Any(fingerprint => fingerprint.Type.ToLower() == "sha256"),
                file.Fingerprints.Any(fingerprint => fingerprint.Type.ToLower() == "sha1")))
            .ToListAsync(ct);

    public async Task<HashFileRecord?> FindAsync(int id, CancellationToken ct)
    {
        var file = await db.Set<BaseFileEntity>()
            .AsNoTracking()
            .Include(candidate => candidate.Fingerprints)
            .Where(candidate => candidate.Id == id)
            .SingleOrDefaultAsync(ct);
        return file is null
            ? null
            : new HashFileRecord(
                file.Id,
                file.Path,
                file.Size,
                file.ModTime,
                file.Fingerprints.Select(fingerprint => fingerprint.Type).ToArray());
    }

    public async Task<int> AddMissingAsync(int id, IReadOnlyDictionary<string, string> hashes, CancellationToken ct)
    {
        var existing = await db.Set<FileFingerprint>()
            .Where(fingerprint => fingerprint.FileId == id)
            .Select(fingerprint => fingerprint.Type)
            .ToListAsync(ct);
        var existingTypes = new HashSet<string>(existing, StringComparer.OrdinalIgnoreCase);
        var added = 0;

        foreach (var (type, value) in hashes)
        {
            if (!existingTypes.Add(type))
                continue;

            db.Set<FileFingerprint>().Add(new FileFingerprint { FileId = id, Type = type.ToLowerInvariant(), Value = value });
            added++;
        }

        if (added > 0)
            await db.SaveChangesAsync(ct);
        return added;
    }

    private sealed record HashPlanRow(int Id, bool HasXxHash, bool HasSha256, bool HasSha1);
}
