using System.Collections.Concurrent;
using System.Text.Json;
using Cove.Plugins;

namespace AnimatedTagPreviews;

public interface IPreviewStateStore
{
    Task<PreviewSettings> GetSettingsAsync(CancellationToken ct = default);
    Task SaveSettingsAsync(PreviewSettings settings, CancellationToken ct = default);
    Task<PreviewRecord?> GetPreviewAsync(int tagId, CancellationToken ct = default);
    Task<IReadOnlyList<PreviewRecord>> GetPreviewsAsync(CancellationToken ct = default);
    Task<PreviewRecord?> PublishAsync(PreviewRecord record, CancellationToken ct = default);
    Task<PreviewRecord?> RemovePreviewAsync(int tagId, CancellationToken ct = default);
    Task<PreviewCandidateRecord?> GetCandidateAsync(string candidateId, CancellationToken ct = default);
    Task<IReadOnlyList<PreviewCandidateRecord>> GetCandidatesAsync(CancellationToken ct = default);
    Task SaveCandidateAsync(PreviewCandidateRecord record, CancellationToken ct = default);
    Task<PreviewCandidateRecord?> RemoveCandidateAsync(string candidateId, CancellationToken ct = default);
    Task<PreviewApprovalReceipt?> GetApprovalReceiptAsync(string candidateId, CancellationToken ct = default);
    Task<IReadOnlyList<PreviewApprovalReceipt>> GetApprovalReceiptsAsync(CancellationToken ct = default);
    Task SaveApprovalReceiptAsync(PreviewApprovalReceipt receipt, CancellationToken ct = default);
    Task<PreviewApprovalReceipt?> RemoveApprovalReceiptAsync(string candidateId, CancellationToken ct = default);
    Task TrackOwnedBlobAsync(OwnedBlobRecord record, CancellationToken ct = default);
    Task UntrackOwnedBlobAsync(string blobId, CancellationToken ct = default);
    Task<IReadOnlyList<OwnedBlobRecord>> GetOwnedBlobsAsync(CancellationToken ct = default);
}

public sealed class PreviewStateStore(Func<IExtensionStore> storeFactory) : IPreviewStateStore
{
    private const string SettingsKey = "settings";
    private const string PreviewPrefix = "preview:tag:";
    private const string OwnedBlobPrefix = "owned-blob:";
    private const string CandidatePrefix = "candidate:";
    private const string ApprovalReceiptPrefix = "approval-receipt:";
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);
    private readonly ConcurrentDictionary<int, SemaphoreSlim> _tagLocks = new();

    public async Task<PreviewSettings> GetSettingsAsync(CancellationToken ct = default)
    {
        var json = await storeFactory().GetAsync(SettingsKey, ct);
        if (string.IsNullOrWhiteSpace(json))
            return PreviewSettings.Default;
        try
        {
            var settings = JsonSerializer.Deserialize<PreviewSettings>(json, JsonOptions);
            var validation = settings is null ? null : PreviewRequestValidator.ValidateSettings(settings);
            return validation?.Value ?? PreviewSettings.Default;
        }
        catch (JsonException)
        {
            return PreviewSettings.Default;
        }
    }

    public Task SaveSettingsAsync(PreviewSettings settings, CancellationToken ct = default)
        => storeFactory().SetAsync(SettingsKey, JsonSerializer.Serialize(settings, JsonOptions), ct);

    public async Task<PreviewRecord?> GetPreviewAsync(int tagId, CancellationToken ct = default)
        => Deserialize<PreviewRecord>(await storeFactory().GetAsync(PreviewKey(tagId), ct));

    public async Task<IReadOnlyList<PreviewRecord>> GetPreviewsAsync(CancellationToken ct = default)
    {
        var all = await storeFactory().GetAllAsync(ct);
        return all
            .Where(pair => pair.Key.StartsWith(PreviewPrefix, StringComparison.Ordinal))
            .Select(pair => Deserialize<PreviewRecord>(pair.Value))
            .Where(record => record is not null)
            .Cast<PreviewRecord>()
            .OrderBy(record => record.TagId)
            .ToArray();
    }

    public async Task<PreviewRecord?> PublishAsync(PreviewRecord record, CancellationToken ct = default)
    {
        var gate = _tagLocks.GetOrAdd(record.TagId, static _ => new SemaphoreSlim(1, 1));
        await gate.WaitAsync(ct);
        try
        {
            var old = await GetPreviewAsync(record.TagId, ct);
            await storeFactory().SetAsync(PreviewKey(record.TagId), JsonSerializer.Serialize(record, JsonOptions), ct);
            return old;
        }
        finally
        {
            gate.Release();
        }
    }

    public async Task<PreviewRecord?> RemovePreviewAsync(int tagId, CancellationToken ct = default)
    {
        var gate = _tagLocks.GetOrAdd(tagId, static _ => new SemaphoreSlim(1, 1));
        await gate.WaitAsync(ct);
        try
        {
            var old = await GetPreviewAsync(tagId, ct);
            if (old is not null)
                await storeFactory().DeleteAsync(PreviewKey(tagId), ct);
            return old;
        }
        finally
        {
            gate.Release();
        }
    }

    public async Task<PreviewCandidateRecord?> GetCandidateAsync(string candidateId, CancellationToken ct = default)
        => Deserialize<PreviewCandidateRecord>(await storeFactory().GetAsync(CandidateKey(candidateId), ct));

    public async Task<IReadOnlyList<PreviewCandidateRecord>> GetCandidatesAsync(CancellationToken ct = default)
    {
        var all = await storeFactory().GetAllAsync(ct);
        return all
            .Where(pair => pair.Key.StartsWith(CandidatePrefix, StringComparison.Ordinal))
            .Select(pair => Deserialize<PreviewCandidateRecord>(pair.Value))
            .Where(record => record is not null)
            .Cast<PreviewCandidateRecord>()
            .OrderBy(record => record.CreatedAt)
            .ToArray();
    }

    public Task SaveCandidateAsync(PreviewCandidateRecord record, CancellationToken ct = default)
        => storeFactory().SetAsync(CandidateKey(record.CandidateId), JsonSerializer.Serialize(record, JsonOptions), ct);

    public async Task<PreviewCandidateRecord?> RemoveCandidateAsync(string candidateId, CancellationToken ct = default)
    {
        var old = await GetCandidateAsync(candidateId, ct);
        if (old is not null)
            await storeFactory().DeleteAsync(CandidateKey(candidateId), ct);
        return old;
    }

    public async Task<PreviewApprovalReceipt?> GetApprovalReceiptAsync(string candidateId, CancellationToken ct = default)
        => Deserialize<PreviewApprovalReceipt>(await storeFactory().GetAsync(ApprovalReceiptKey(candidateId), ct));

    public async Task<IReadOnlyList<PreviewApprovalReceipt>> GetApprovalReceiptsAsync(CancellationToken ct = default)
    {
        var all = await storeFactory().GetAllAsync(ct);
        return all
            .Where(pair => pair.Key.StartsWith(ApprovalReceiptPrefix, StringComparison.Ordinal))
            .Select(pair => Deserialize<PreviewApprovalReceipt>(pair.Value))
            .Where(record => record is not null)
            .Cast<PreviewApprovalReceipt>()
            .OrderBy(record => record.ApprovedAt)
            .ToArray();
    }

    public Task SaveApprovalReceiptAsync(PreviewApprovalReceipt receipt, CancellationToken ct = default)
        => storeFactory().SetAsync(ApprovalReceiptKey(receipt.CandidateId), JsonSerializer.Serialize(receipt, JsonOptions), ct);

    public async Task<PreviewApprovalReceipt?> RemoveApprovalReceiptAsync(string candidateId, CancellationToken ct = default)
    {
        var old = await GetApprovalReceiptAsync(candidateId, ct);
        if (old is not null)
            await storeFactory().DeleteAsync(ApprovalReceiptKey(candidateId), ct);
        return old;
    }

    public Task TrackOwnedBlobAsync(OwnedBlobRecord record, CancellationToken ct = default)
        => storeFactory().SetAsync(OwnedBlobKey(record.BlobId), JsonSerializer.Serialize(record, JsonOptions), ct);

    public Task UntrackOwnedBlobAsync(string blobId, CancellationToken ct = default)
        => storeFactory().DeleteAsync(OwnedBlobKey(blobId), ct);

    public async Task<IReadOnlyList<OwnedBlobRecord>> GetOwnedBlobsAsync(CancellationToken ct = default)
    {
        var all = await storeFactory().GetAllAsync(ct);
        return all
            .Where(pair => pair.Key.StartsWith(OwnedBlobPrefix, StringComparison.Ordinal))
            .Select(pair => Deserialize<OwnedBlobRecord>(pair.Value))
            .Where(record => record is not null)
            .Cast<OwnedBlobRecord>()
            .OrderBy(record => record.CreatedAt)
            .ToArray();
    }

    private static string PreviewKey(int tagId) => $"{PreviewPrefix}{tagId}";
    private static string OwnedBlobKey(string blobId) => $"{OwnedBlobPrefix}{blobId}";
    private static string CandidateKey(string candidateId) => $"{CandidatePrefix}{candidateId}";
    private static string ApprovalReceiptKey(string candidateId) => $"{ApprovalReceiptPrefix}{candidateId}";

    private static T? Deserialize<T>(string? json)
    {
        if (string.IsNullOrWhiteSpace(json))
            return default;
        try { return JsonSerializer.Deserialize<T>(json, JsonOptions); }
        catch (JsonException) { return default; }
    }
}
