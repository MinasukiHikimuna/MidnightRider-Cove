using Cove.Plugins;
using Microsoft.Extensions.Logging.Abstractions;

namespace HashTheCove.Tests;

public sealed class HashJobRunnerTests
{
    [Fact]
    public async Task AddsOnlyMissingAlgorithmsCaseInsensitively()
    {
        var path = await CreateFileAsync("hash me");
        try
        {
            var info = new FileInfo(path);
            var repository = new FakeRepository(new HashFileRecord(
                1, path, info.Length, info.LastWriteTimeUtc, ["SHA256"]));
            var runner = new HashJobRunner(repository, NullLogger<HashJobRunner>.Instance);

            var totals = await runner.RunAsync(
                new HashSettings(XxHash: true, Sha256: true),
                new ProgressStub(),
                default);

            Assert.Equal(new HashJobTotals(1, 1, 0, 0), totals);
            Assert.Equal(["xxhash"], repository.Added.Keys.Order());
        }
        finally
        {
            File.Delete(path);
        }
    }

    [Fact]
    public async Task DoesNothingUntilAnAlgorithmIsExplicitlyEnabled()
    {
        var path = await CreateFileAsync("leave me alone");
        try
        {
            var info = new FileInfo(path);
            var repository = new FakeRepository(new HashFileRecord(
                1, path, info.Length, info.LastWriteTimeUtc, []));
            var progress = new ProgressStub();
            var runner = new HashJobRunner(repository, NullLogger<HashJobRunner>.Instance);

            var totals = await runner.RunAsync(new HashSettings(), progress, default);

            Assert.Equal(new HashJobTotals(0, 0, 0, 0), totals);
            Assert.Empty(repository.Added);
            Assert.Contains(progress.Reports, report =>
                report.Message == "Found 0 files to process. No hash algorithms are enabled.");
        }
        finally
        {
            File.Delete(path);
        }
    }

    [Fact]
    public async Task ReportsDistinctCandidateFilesAndMissingFingerprintCountsBeforeProcessing()
    {
        var path = await CreateFileAsync("preflight me");
        try
        {
            var info = new FileInfo(path);
            var repository = new FakeRepository(
                new HashFileRecord(1, path, info.Length, info.LastWriteTimeUtc, ["sha256"]),
                new HashFileRecord(2, path, info.Length, info.LastWriteTimeUtc, ["xxhash"]));
            var progress = new ProgressStub();
            var runner = new HashJobRunner(repository, NullLogger<HashJobRunner>.Instance);

            await runner.RunAsync(
                new HashSettings(XxHash: true, Sha256: true, Sha1: true),
                progress,
                default);

            var first = progress.Reports[0];
            Assert.Equal(0, first.Percent);
            Assert.Equal(
                "Found 2 files to process. Missing fingerprints: 1 xxhash; 1 sha256; 2 sha1.",
                first.Message);
        }
        finally
        {
            File.Delete(path);
        }
    }

    [Fact]
    public async Task ContinuesAfterMissingFile()
    {
        var goodPath = await CreateFileAsync("good");
        try
        {
            var good = new FileInfo(goodPath);
            var repository = new FakeRepository(
                new HashFileRecord(1, goodPath + ".missing", 4, DateTime.UtcNow, []),
                new HashFileRecord(2, goodPath, good.Length, good.LastWriteTimeUtc, []));
            var runner = new HashJobRunner(repository, NullLogger<HashJobRunner>.Instance);

            var totals = await runner.RunAsync(
                new HashSettings(XxHash: false, Sha256: true),
                new ProgressStub(),
                default);

            Assert.Equal(new HashJobTotals(2, 1, 0, 1), totals);
        }
        finally
        {
            File.Delete(goodPath);
        }
    }

    [Fact]
    public async Task DoesNotOverwriteFingerprintAddedConcurrently()
    {
        var path = await CreateFileAsync("race");
        try
        {
            var info = new FileInfo(path);
            var repository = new FakeRepository(new HashFileRecord(1, path, info.Length, info.LastWriteTimeUtc, []))
            {
                AddNothing = true,
            };
            var runner = new HashJobRunner(repository, NullLogger<HashJobRunner>.Instance);

            var totals = await runner.RunAsync(
                new HashSettings(XxHash: false, Sha256: true),
                new ProgressStub(),
                default);

            Assert.Equal(new HashJobTotals(1, 0, 1, 0), totals);
        }
        finally
        {
            File.Delete(path);
        }
    }

    [Fact]
    public async Task TreatsUnspecifiedDatabaseModificationTimeAsUtc()
    {
        var path = await CreateFileAsync("timestamp");
        try
        {
            var info = new FileInfo(path);
            var unspecified = DateTime.SpecifyKind(info.LastWriteTimeUtc, DateTimeKind.Unspecified);
            var repository = new FakeRepository(new HashFileRecord(1, path, info.Length, unspecified, []));
            var runner = new HashJobRunner(repository, NullLogger<HashJobRunner>.Instance);

            var totals = await runner.RunAsync(
                new HashSettings(XxHash: false, Sha256: true),
                new ProgressStub(),
                default);

            Assert.Equal(new HashJobTotals(1, 1, 0, 0), totals);
        }
        finally
        {
            File.Delete(path);
        }
    }

    [Fact]
    public async Task ToleratesDatabaseTimestampRoundedToWholeSecond()
    {
        var path = await CreateFileAsync("rounded timestamp");
        try
        {
            var preciseTime = new DateTime(2026, 7, 13, 12, 34, 56, 400, DateTimeKind.Utc);
            File.SetLastWriteTimeUtc(path, preciseTime);
            var info = new FileInfo(path);
            var roundedTime = new DateTime(
                info.LastWriteTimeUtc.Ticks - info.LastWriteTimeUtc.Ticks % TimeSpan.TicksPerSecond,
                DateTimeKind.Utc);
            var repository = new FakeRepository(new HashFileRecord(1, path, info.Length, roundedTime, []));
            var runner = new HashJobRunner(repository, NullLogger<HashJobRunner>.Instance);

            var totals = await runner.RunAsync(
                new HashSettings(XxHash: false, Sha256: true),
                new ProgressStub(),
                default);

            Assert.Equal(new HashJobTotals(1, 1, 0, 0), totals);
        }
        finally
        {
            File.Delete(path);
        }
    }

    [Fact]
    public async Task RejectsFileWhoseTimestampDiffersByAFullSecond()
    {
        var path = await CreateFileAsync("changed timestamp");
        try
        {
            var info = new FileInfo(path);
            var repository = new FakeRepository(new HashFileRecord(
                1,
                path,
                info.Length,
                info.LastWriteTimeUtc.AddSeconds(-1),
                []));
            var runner = new HashJobRunner(repository, NullLogger<HashJobRunner>.Instance);

            var totals = await runner.RunAsync(
                new HashSettings(XxHash: false, Sha256: true),
                new ProgressStub(),
                default);

            Assert.Equal(new HashJobTotals(1, 0, 0, 1), totals);
        }
        finally
        {
            File.Delete(path);
        }
    }

    [Fact]
    public async Task HonorsCancellation()
    {
        var repository = new FakeRepository(new HashFileRecord(1, "unused", 0, DateTime.UtcNow, []));
        var runner = new HashJobRunner(repository, NullLogger<HashJobRunner>.Instance);
        using var source = new CancellationTokenSource();
        source.Cancel();

        await Assert.ThrowsAsync<OperationCanceledException>(() =>
            runner.RunAsync(new HashSettings(), new ProgressStub(), source.Token));
    }

    private static async Task<string> CreateFileAsync(string contents)
    {
        var path = Path.GetTempFileName();
        await File.WriteAllTextAsync(path, contents);
        return path;
    }

    private sealed class ProgressStub : IJobProgress
    {
        public List<(double Percent, string? Message)> Reports { get; } = [];

        public void Report(double percent, string? message = null) => Reports.Add((percent, message));
    }

    private sealed class FakeRepository(params HashFileRecord[] files) : IHashFileRepository
    {
        private readonly Dictionary<int, HashFileRecord> _files = files.ToDictionary(file => file.Id);
        public Dictionary<string, string> Added { get; } = new(StringComparer.OrdinalIgnoreCase);
        public bool AddNothing { get; init; }

        public Task<HashWorkPlan> BuildPlanAsync(
            bool videos,
            bool galleries,
            bool xxHash,
            bool sha256,
            bool sha1,
            CancellationToken ct)
        {
            var rows = _files.Values.ToArray();
            var missingXxHash = xxHash
                ? rows.Count(file => !file.FingerprintTypes.Contains("xxhash", StringComparer.OrdinalIgnoreCase))
                : 0;
            var missingSha256 = sha256
                ? rows.Count(file => !file.FingerprintTypes.Contains("sha256", StringComparer.OrdinalIgnoreCase))
                : 0;
            var missingSha1 = sha1
                ? rows.Count(file => !file.FingerprintTypes.Contains("sha1", StringComparer.OrdinalIgnoreCase))
                : 0;
            var ids = rows
                .Where(file =>
                    (xxHash && !file.FingerprintTypes.Contains("xxhash", StringComparer.OrdinalIgnoreCase))
                    || (sha256 && !file.FingerprintTypes.Contains("sha256", StringComparer.OrdinalIgnoreCase))
                    || (sha1 && !file.FingerprintTypes.Contains("sha1", StringComparer.OrdinalIgnoreCase)))
                .Select(file => file.Id)
                .Order()
                .ToArray();
            return Task.FromResult(new HashWorkPlan(ids, missingXxHash, missingSha256, missingSha1));
        }

        public Task<HashFileRecord?> FindAsync(int id, CancellationToken ct) =>
            Task.FromResult(_files.GetValueOrDefault(id));

        public Task<int> AddMissingAsync(int id, IReadOnlyDictionary<string, string> hashes, CancellationToken ct)
        {
            if (AddNothing)
                return Task.FromResult(0);
            foreach (var hash in hashes)
                Added.TryAdd(hash.Key, hash.Value);
            return Task.FromResult(hashes.Count);
        }
    }
}
