using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Cove.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

public sealed record BasicNativeHistoryReceipt(
    int VideoId,
    string Kind,
    string Label,
    JsonElement BeforeState,
    JsonElement AfterState);

public static class BasicNativeHistoryReceiptService
{
    private const string OperationKind = "basic-native-history-receipt";
    private const string ExpiredOperationKind =
        "basic-native-history-receipt-expired";
    private static readonly JsonSerializerOptions JsonOptions =
        new(JsonSerializerDefaults.Web);

    public static async Task<bool> ExistsAsync(
        DbContext db,
        Guid receiptId,
        int userId,
        int videoId,
        CancellationToken ct)
    {
        var operation = await db.Set<SegmentStudioSegmentOperation>()
            .AsNoTracking()
            .SingleOrDefaultAsync(candidate =>
                candidate.OperationId == receiptId, ct);
        if (operation is null)
            return false;
        if (operation.Kind == ExpiredOperationKind)
        {
            if (operation.ActorUserId != userId)
                throw new InvalidOperationException(
                    "The history receipt ID was already used by another user.");
            return true;
        }
        if (operation.Kind != OperationKind
            || operation.ActorUserId != userId
            || operation.ResultPayloadJson is null)
            throw new InvalidOperationException(
                "The history receipt ID was already used for another operation.");
        var receipt = Deserialize(operation.ResultPayloadJson);
        if (receipt.VideoId != videoId)
            throw new InvalidOperationException(
                "The history receipt ID belongs to another video.");
        return true;
    }

    public static async Task RecordAsync(
        DbContext db,
        Guid receiptId,
        int userId,
        BasicNativeHistoryReceipt receipt,
        CancellationToken ct)
    {
        if (receiptId == Guid.Empty)
            throw new ArgumentException("History receipt ID is required.");
        var payload = JsonSerializer.Serialize(receipt, JsonOptions);
        var fingerprint = Convert.ToHexString(SHA256.HashData(
                Encoding.UTF8.GetBytes(payload)))
            .ToLowerInvariant();
        var existing = await db.Set<SegmentStudioSegmentOperation>()
            .AsNoTracking()
            .SingleOrDefaultAsync(candidate =>
                candidate.OperationId == receiptId, ct);
        if (existing is not null)
        {
            if (existing.Kind != OperationKind
                || existing.ActorUserId != userId
                || existing.RequestFingerprint != fingerprint
                || existing.ResultPayloadJson != payload)
            {
                throw new InvalidOperationException(
                    "The history receipt ID was already used for another operation.");
            }
            return;
        }
        db.Add(new SegmentStudioSegmentOperation
        {
            OperationId = receiptId,
            Kind = OperationKind,
            ActorUserId = userId,
            RequestFingerprint = fingerprint,
            ResultPayloadJson = payload,
            CreatedAt = DateTime.UtcNow,
        });
        await db.SaveChangesAsync(ct);
    }

    public static async Task<BasicNativeHistoryReceipt?> LoadAsync(
        DbContext db,
        Guid receiptId,
        int userId,
        CancellationToken ct)
    {
        var operation = await db.Set<SegmentStudioSegmentOperation>()
            .AsNoTracking()
            .SingleOrDefaultAsync(candidate =>
                candidate.OperationId == receiptId, ct);
        if (operation is null)
            return null;
        if (operation.Kind != OperationKind
            || operation.ActorUserId != userId
            || operation.ResultPayloadJson is null)
            throw new InvalidOperationException(
                "The history receipt ID was already used for another operation.");
        return Deserialize(operation.ResultPayloadJson);
    }

    public static async Task ExpireAsync(
        DbContext db,
        IEnumerable<Guid?> receiptIds,
        CancellationToken ct)
    {
        var ids = receiptIds
            .Where(receiptId => receiptId is not null)
            .Select(receiptId => receiptId!.Value)
            .Distinct()
            .ToArray();
        if (ids.Length == 0)
            return;
        var operations = await db.Set<SegmentStudioSegmentOperation>()
            .Where(operation =>
                ids.Contains(operation.OperationId)
                && operation.Kind == OperationKind)
            .ToListAsync(ct);
        Expire(operations);
    }

    public static async Task ExpireForVideoAsync(
        DbContext db,
        int videoId,
        int? userId,
        CancellationToken ct)
    {
        var operations = await db.Set<SegmentStudioSegmentOperation>()
            .Where(operation =>
                operation.Kind == OperationKind
                && operation.ResultPayloadJson != null
                && (userId == null || operation.ActorUserId == userId))
            .ToListAsync(ct);
        Expire(operations.Where(operation =>
        {
            if (string.IsNullOrWhiteSpace(operation.ResultPayloadJson))
                return false;
            try
            {
                return Deserialize(operation.ResultPayloadJson).VideoId
                    == videoId;
            }
            catch (JsonException)
            {
                return true;
            }
            catch (InvalidOperationException)
            {
                return true;
            }
        }));
    }

    public static async Task ExpireForUserAsync(
        DbContext db,
        int userId,
        CancellationToken ct)
    {
        var operations = await db.Set<SegmentStudioSegmentOperation>()
            .Where(operation =>
                operation.Kind == OperationKind
                && operation.ActorUserId == userId)
            .ToListAsync(ct);
        Expire(operations);
    }

    public static async Task<JsonElement> CaptureNativeStateAsync(
        DbContext db,
        int videoId,
        IEnumerable<int> nativeSegmentIds,
        CancellationToken ct)
    {
        var orderedIds = nativeSegmentIds.Distinct().ToArray();
        var rows = orderedIds.Length == 0
            ? []
            : await db.Set<Segment>()
                .AsNoTracking()
                .Where(segment =>
                    orderedIds.Contains(segment.Id)
                    && segment.HostType == SegmentHostType.Video
                    && segment.HostId == videoId
                    && segment.Kind == "tag"
                    && segment.TagId != null)
                .ToListAsync(ct);
        if (rows.Count != orderedIds.Length)
            throw new KeyNotFoundException(
                "A native segment required for history was not found.");
        var byId = rows.ToDictionary(segment => segment.Id);
        var provenance = db.Model.FindEntityType(typeof(FieldProvenance)) is null
            ? []
            : await db.Set<FieldProvenance>()
                .AsNoTracking()
                .Where(row =>
                    row.HostType == AffinityHostType.Segment
                    && orderedIds.Contains(row.HostId))
                .OrderBy(row => row.Id)
                .ToListAsync(ct);
        var provenanceBySegment = provenance.ToLookup(row => row.HostId);
        return JsonSerializer.SerializeToElement(new
        {
            type = "segments",
            segments = orderedIds.Select(id =>
            {
                var segment = byId[id];
                return new
                {
                    identity = new
                    {
                        nativeSegmentId = (int?)segment.Id,
                        updatedAt = (DateTime?)segment.UpdatedAt,
                    },
                    values = Values(
                        segment,
                        provenanceBySegment[segment.Id]),
                };
            }),
        }, JsonOptions);
    }

    public static async Task<JsonElement> CaptureBinStateAsync(
        DbContext db,
        IEnumerable<long> binEntryIds,
        CancellationToken ct)
    {
        var orderedIds = binEntryIds.Distinct().ToArray();
        var entries = orderedIds.Length == 0
            ? []
            : await db.Set<SegmentStudioNativeRecycleBinEntry>()
                .AsNoTracking()
                .Where(entry => orderedIds.Contains(entry.Id))
                .ToListAsync(ct);
        if (entries.Count != orderedIds.Length)
            throw new KeyNotFoundException(
                "A recycling-bin segment required for history was not found.");
        var byId = entries.ToDictionary(entry => entry.Id);
        return JsonSerializer.SerializeToElement(new
        {
            type = "segments",
            segments = orderedIds.Select(id =>
            {
                var entry = byId[id];
                return new
                {
                    identity = new
                    {
                        nativeSegmentId = (int?)null,
                        recycleBinItemId = (long?)entry.Id,
                        revision = (long?)entry.Revision,
                        updatedAt = (DateTime?)entry.UpdatedAt,
                        published = false,
                    },
                    values = new
                    {
                        startSec = entry.StartSec,
                        endSec = entry.EndSec,
                        tagId = entry.TagId,
                        kind = entry.Kind,
                        refId = entry.RefId?.ToString(),
                        payloadJson = entry.PayloadJson,
                        sourceKey = entry.SourceKey,
                        sourceRunId = entry.SourceRunId,
                        confidence = entry.Confidence,
                        title = entry.Title,
                        colorHint = entry.ColorHint,
                        imageBlobId = entry.ImageBlobId,
                        createdAt = entry.NativeCreatedAt,
                        fieldProvenance = ParseProvenance(entry.FieldProvenanceJson),
                    },
                };
            }),
        }, JsonOptions);
    }

    private static object Values(
        Segment segment,
        IEnumerable<FieldProvenance> provenance) =>
        new
        {
            startSec = segment.StartSec,
            endSec = segment.EndSec,
            tagId = segment.TagId!.Value,
            kind = segment.Kind ?? "tag",
            refId = segment.RefId?.ToString(),
            payloadJson = segment.Payload?.RootElement.GetRawText(),
            sourceKey = segment.SourceKey,
            sourceRunId = segment.SourceRunId,
            confidence = segment.Confidence,
            title = segment.Title,
            colorHint = segment.ColorHint,
            imageBlobId = segment.ImageBlobId,
            createdAt = segment.CreatedAt,
            fieldProvenance = provenance.Select(row => new
            {
                row.FieldKey,
                row.ValueJson,
                row.SourceKey,
                row.SourceRunId,
                row.ModelKey,
                row.Confidence,
                row.CreatedAt,
                row.UpdatedAt,
            }),
        };

    private static JsonElement ParseProvenance(string json)
    {
        using var document = JsonDocument.Parse(json);
        return document.RootElement.Clone();
    }

    private static BasicNativeHistoryReceipt Deserialize(string payload) =>
        JsonSerializer.Deserialize<BasicNativeHistoryReceipt>(
            payload,
            JsonOptions) ?? throw new InvalidOperationException(
            "The stored history receipt is invalid.");

    private static void Expire(
        IEnumerable<SegmentStudioSegmentOperation> operations)
    {
        foreach (var operation in operations)
        {
            operation.Kind = ExpiredOperationKind;
            operation.RequestFingerprint = "expired";
            operation.ItemId = null;
            operation.SourceNativeSegmentId = null;
            operation.ResultNativeSegmentId = null;
            operation.ResultPayloadJson = null;
            operation.ComponentFingerprint = null;
        }
    }
}
