using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

public sealed record DeriveSegmentRequest(
    Guid OperationId,
    long ExpectedRevision,
    Guid RuleId);

public sealed record DeriveSegmentResult(
    long ItemId,
    Guid LineageNodeId,
    long EdgeId,
    int TagId,
    long Revision,
    bool Replayed = false);

public interface ILineageMutationService
{
    Task<DeriveSegmentResult> DeriveAsync(
        DbContext db,
        long sourceItemId,
        DeriveSegmentRequest request,
        int? actorUserId,
        CancellationToken ct);
}

public sealed class LineageMutationService(
    ILineageNodeService nodes,
    IDerivationRuleService rules,
    IDerivationGraphService graph) : ILineageMutationService
{
    public async Task<DeriveSegmentResult> DeriveAsync(
        DbContext db,
        long sourceItemId,
        DeriveSegmentRequest request,
        int? actorUserId,
        CancellationToken ct)
    {
        if (db.Database.CurrentTransaction is not null)
            return await DeriveCoreAsync(db, sourceItemId, request, actorUserId, ct);

        var strategy = db.Database.CreateExecutionStrategy();
        var firstAttempt = true;
        return await strategy.ExecuteAsync(async () =>
        {
            if (!firstAttempt) db.ChangeTracker.Clear();
            firstAttempt = false;
            return await DeriveCoreAsync(db, sourceItemId, request, actorUserId, ct);
        });
    }

    private async Task<DeriveSegmentResult> DeriveCoreAsync(
        DbContext db,
        long sourceItemId,
        DeriveSegmentRequest request,
        int? actorUserId,
        CancellationToken ct)
    {
        if (request.OperationId == Guid.Empty)
            throw new ArgumentException("Operation ID is required.", nameof(request));
        var fingerprint = Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(
            $"derive|{sourceItemId}|{request.ExpectedRevision}|{request.RuleId}")));
        var replay = await ReplayAsync(db, request.OperationId, fingerprint, actorUserId, ct);
        if (replay is not null)
            return replay with { Replayed = true };

        await using var transaction = db.Database.IsRelational()
            && db.Database.CurrentTransaction is null
            ? await db.Database.BeginTransactionAsync(ct)
            : null;
        if (db.Database.ProviderName?.Contains("Npgsql", StringComparison.Ordinal) == true)
        {
            await db.Database.ExecuteSqlInterpolatedAsync(
                $"SELECT pg_advisory_xact_lock(hashtextextended({request.OperationId.ToString()}, 0))",
                ct);
        }
        replay = await ReplayAsync(db, request.OperationId, fingerprint, actorUserId, ct);
        if (replay is not null)
        {
            if (transaction is not null)
                await transaction.CommitAsync(ct);
            return replay with { Replayed = true };
        }
        await SegmentStudioRolloutService.EnsureWritesEnabledAsync(db, ct);

        var sourceItem = await db.Set<SegmentStudioItem>()
            .SingleOrDefaultAsync(item => item.Id == sourceItemId, ct)
            ?? throw new KeyNotFoundException("Source item was not found.");
        var sourceNode = await nodes.EnsureAsync(db, sourceItemId, ct);
        await SegmentStudioReviewLock.AcquireAsync(db, sourceNode.LastKnownVideoId, ct);
        await db.Entry(sourceItem).ReloadAsync(ct);
        if (sourceItem.Revision != request.ExpectedRevision)
            throw new LineageConflictException(
                "LINEAGE_COMPONENT_CHANGED",
                "The source item changed before derivation.");
        sourceNode = await nodes.EnsureAsync(db, sourceItemId, ct);
        if (sourceNode.LastKnownTagId is not int sourceTagId)
            throw new LineageConflictException("LINEAGE_RULE_MISMATCH", "Source item has no tag.");
        var rule = await rules.ResolveAsync(db, request.RuleId, sourceTagId, ct);

        var now = DateTime.UtcNow;
        var derivedItem = new SegmentStudioItem
        {
            ReviewState = "unreviewed",
            RepresentationSchemaVersion = 1,
            VideoId = sourceNode.LastKnownVideoId,
            StartSec = sourceNode.LastKnownStartSec,
            EndSec = sourceNode.LastKnownEndSec,
            TagId = rule.DerivedTagId,
            Kind = "tag",
            SourceKey = sourceItem.SourceKey ?? "user",
            SourceRunId = sourceItem.SourceRunId,
            Confidence = sourceItem.Confidence,
            Revision = 1,
            CreatedAt = now,
            UpdatedAt = now,
        };
        db.Add(derivedItem);
        await db.SaveChangesAsync(ct);
        var derivedNode = await nodes.EnsureAsync(db, derivedItem.Id, ct);
        var edge = await graph.CreateEdgeAsync(
            db,
            new DerivationEdgeCreate(
                sourceNode.Id,
                derivedNode.Id,
                rule.Id,
                null,
                now,
                "{}"),
            ct);
        var result = new DeriveSegmentResult(
            derivedItem.Id,
            derivedNode.Id,
            edge.Id,
            rule.DerivedTagId,
            derivedItem.Revision);
        db.Add(new SegmentStudioSegmentOperation
        {
            OperationId = request.OperationId,
            Kind = "derive",
            ActorUserId = actorUserId,
            RequestFingerprint = fingerprint,
            ItemId = derivedItem.Id,
            ResultPayloadJson = JsonSerializer.Serialize(result),
            CreatedAt = now,
        });
        await db.SaveChangesAsync(ct);
        if (transaction is not null)
            await transaction.CommitAsync(ct);
        return result;
    }

    private static async Task<DeriveSegmentResult?> ReplayAsync(
        DbContext db,
        Guid operationId,
        string fingerprint,
        int? actorUserId,
        CancellationToken ct)
    {
        var receipt = await db.Set<SegmentStudioSegmentOperation>().AsNoTracking()
            .SingleOrDefaultAsync(operation => operation.OperationId == operationId, ct);
        if (receipt is null)
            return null;
        if (receipt.Kind != "derive"
            || receipt.RequestFingerprint != fingerprint
            || receipt.ActorUserId != actorUserId)
            throw new LineageConflictException(
                "LINEAGE_COMPONENT_CHANGED",
                "The operation ID was already used for another request.");
        return JsonSerializer.Deserialize<DeriveSegmentResult>(receipt.ResultPayloadJson!)!;
    }
}
