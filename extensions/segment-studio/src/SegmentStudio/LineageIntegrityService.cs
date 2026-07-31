using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Cove.Core.Auth;
using Cove.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

public sealed record LineageIssueDto(
    Guid Id,
    string Kind,
    string State,
    string ComponentKey,
    Guid? NodeId,
    long? EdgeId,
    string DetailsJson,
    DateTime LastDetectedAt);

public sealed record LineageIssuePage(
    IReadOnlyList<LineageIssueDto> Items,
    int Page,
    int PerPage,
    long Total);

public sealed record LineageValidationResult(
    string ComponentKey,
    string Fingerprint,
    IReadOnlyList<LineageIssueDto> Issues);

public sealed record LineageRepairPreview(
    Guid IssueId,
    string Action,
    string Fingerprint,
    int AffectedItemCount,
    string Summary);

public sealed record LineageRepairExecuteRequest(
    Guid OperationId,
    string Action,
    string Fingerprint);

public interface ILineageIntegrityService
{
    Task<LineageValidationResult> ValidateItemAsync(
        DbContext db, long itemId, bool persist, CancellationToken ct);
    Task<SegmentStudioLineageScanRun> RunFullScanAsync(
        DbContext db, int? requestedByUserId, int batchSize, CancellationToken ct);
    Task<LineageIssuePage> ListIssuesAsync(
        DbContext db, int page, int perPage, CancellationToken ct);
    Task<LineageRepairPreview> PreviewRepairAsync(
        DbContext db, Guid issueId, string action, CancellationToken ct);
    Task ExecuteRepairAsync(
        DbContext db,
        Guid issueId,
        LineageRepairExecuteRequest request,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        CancellationToken ct);
}

public sealed class LineageIntegrityService(
    ILineageReconciliationService reconciliation,
    ISegmentLineageDeletionService deletion) : ILineageIntegrityService
{
    private const int MaximumBatchSize = 500;

    public async Task<LineageValidationResult> ValidateItemAsync(
        DbContext db,
        long itemId,
        bool persist,
        CancellationToken ct)
    {
        var node = await db.Set<SegmentStudioLineageNode>().AsNoTracking()
            .SingleOrDefaultAsync(candidate => candidate.ItemId == itemId, ct)
            ?? throw new KeyNotFoundException("Lineage node was not found.");
        var state = await LoadComponentAsync(db, node.Id, ct);
        var findings = Detect(state);
        if (persist)
            await PersistAsync(db, state.ComponentKey, findings, ct);
        return new LineageValidationResult(
            state.ComponentKey,
            state.Fingerprint,
            findings.Select(ToDto).ToArray());
    }

    public async Task<SegmentStudioLineageScanRun> RunFullScanAsync(
        DbContext db,
        int? requestedByUserId,
        int batchSize,
        CancellationToken ct)
    {
        var attempt = new ScanAttempt();
        if (db.Database.CurrentTransaction is not null)
            return await RunFullScanCoreAsync(db, requestedByUserId, batchSize, attempt, ct);

        var strategy = db.Database.CreateExecutionStrategy();
        var firstAttempt = true;
        return await strategy.ExecuteAsync(async () =>
        {
            if (!firstAttempt) db.ChangeTracker.Clear();
            firstAttempt = false;
            return await RunFullScanCoreAsync(db, requestedByUserId, batchSize, attempt, ct);
        });
    }

    private async Task<SegmentStudioLineageScanRun> RunFullScanCoreAsync(
        DbContext db,
        int? requestedByUserId,
        int batchSize,
        ScanAttempt attempt,
        CancellationToken ct)
    {
        var size = Math.Clamp(batchSize, 1, MaximumBatchSize);
        await using var transaction = db.Database.IsRelational()
            && db.Database.CurrentTransaction is null
            ? await db.Database.BeginTransactionAsync(ct)
            : null;
        if (db.Database.ProviderName?.Contains("Npgsql", StringComparison.Ordinal) == true)
            await db.Database.ExecuteSqlRawAsync(
                "SELECT pg_advisory_xact_lock(hashtextextended('segment-studio:lineage-full-scan', 0))",
                ct);
        if (attempt.CommittedResult is { } attempted)
        {
            var committed = await db.Set<SegmentStudioLineageScanRun>()
                .SingleOrDefaultAsync(run => run.Id == attempted.RunId, ct);
            if (committed is not null && attempted.Matches(committed))
            {
                if (transaction is not null) await transaction.CommitAsync(ct);
                return committed;
            }
        }
        var sourceFingerprint = await SourceFingerprintAsync(db, ct);
        var existing = await db.Set<SegmentStudioLineageScanRun>()
            .Where(run => run.Scope == "full" && (run.State == "pending" || run.State == "running"))
            .OrderBy(run => run.CreatedAt)
            .FirstOrDefaultAsync(ct);
        var now = DateTime.UtcNow;
        var run = existing ?? new SegmentStudioLineageScanRun
        {
            Id = Guid.NewGuid(),
            Scope = "full",
            State = "pending",
            CountsJson = """{"components":0,"issues":0}""",
            RequestedByUserId = requestedByUserId,
            CreatedAt = now,
            UpdatedAt = now,
        };
        if (existing is null)
        {
            run.SourceFingerprint = sourceFingerprint;
            db.Add(run);
            await db.SaveChangesAsync(ct);
        }
        else if (run.SourceFingerprint != sourceFingerprint)
        {
            run.CursorJson = null;
            run.CountsJson = """{"components":0,"issues":0}""";
            run.SourceFingerprint = sourceFingerprint;
            run.StartedAt = now;
        }
        run.State = "running";
        run.StartedAt ??= now;
        var cursor = ParseCursor(run.CursorJson);
        var nodeQuery = db.Set<SegmentStudioLineageNode>().AsNoTracking();
        if (cursor is Guid cursorId)
            nodeQuery = nodeQuery.Where(node => node.Id.CompareTo(cursorId) > 0);
        var roots = await nodeQuery
            .OrderBy(node => node.Id)
            .Take(size)
            .Select(node => node.Id)
            .ToListAsync(ct);
        var seenComponents = new HashSet<string>();
        var issueCount = 0;
        foreach (var nodeId in roots)
        {
            var state = await LoadComponentAsync(db, nodeId, ct);
            if (state.Nodes.Min(node => node.Id) != nodeId)
                continue;
            if (!seenComponents.Add(state.ComponentKey))
                continue;
            var findings = Detect(state);
            issueCount += findings.Count;
            await PersistAsync(db, state.ComponentKey, findings, ct);
        }
        var previousCounts = ParseCounts(run.CountsJson);
        run.CountsJson = JsonSerializer.Serialize(new
        {
            components = previousCounts.Components + seenComponents.Count,
            issues = previousCounts.Issues + issueCount,
        });
        run.CursorJson = roots.Count == 0 ? run.CursorJson : JsonSerializer.Serialize(new { nodeId = roots[^1] });
        var endingSourceFingerprint = await SourceFingerprintAsync(db, ct);
        if (endingSourceFingerprint != sourceFingerprint)
        {
            run.State = "pending";
            run.CursorJson = null;
            run.CountsJson = """{"components":0,"issues":0}""";
            run.SourceFingerprint = endingSourceFingerprint;
            run.StartedAt = DateTime.UtcNow;
        }
        else if (roots.Count < size)
        {
            run.State = "completed";
            run.CompletedAt = DateTime.UtcNow;
            var scanStartedAt = run.StartedAt ?? run.CreatedAt;
            var staleIssues = await db.Set<SegmentStudioLineageIssue>()
                .Where(issue => issue.State == "open"
                    && issue.LastDetectedAt < scanStartedAt)
                .ToListAsync(ct);
            foreach (var issue in staleIssues)
            {
                issue.State = "resolved";
                issue.ResolvedAt = DateTime.UtcNow;
                issue.ResolutionJson = """{"action":"no-longer-detected-by-full-scan"}""";
            }
        }
        else
        {
            run.State = "pending";
        }
        run.UpdatedAt = PostgreSqlTimestamp(DateTime.UtcNow);
        await db.SaveChangesAsync(ct);
        attempt.CommittedResult = ScanResultSnapshot.From(run);
        if (transaction is not null)
            await transaction.CommitAsync(ct);
        return run;
    }

    public async Task<LineageIssuePage> ListIssuesAsync(
        DbContext db,
        int page,
        int perPage,
        CancellationToken ct)
    {
        var boundedPage = Math.Clamp(page, 1, 1_000_000);
        var boundedPerPage = Math.Clamp(perPage, 1, 100);
        var query = db.Set<SegmentStudioLineageIssue>().AsNoTracking()
            .Where(issue => issue.State == "open");
        var total = await query.LongCountAsync(ct);
        var items = await query
            .Where(issue => issue.State == "open")
            .OrderByDescending(issue => issue.LastDetectedAt)
            .ThenBy(issue => issue.Id)
            .Skip((boundedPage - 1) * boundedPerPage)
            .Take(boundedPerPage)
            .Select(issue => new LineageIssueDto(
                issue.Id,
                issue.IssueKind,
                issue.State,
                issue.ComponentKey,
                issue.LineageNodeId,
                issue.EdgeId,
                issue.DetailsJson,
                issue.LastDetectedAt))
            .ToListAsync(ct);
        return new LineageIssuePage(items, boundedPage, boundedPerPage, total);
    }

    public async Task<LineageRepairPreview> PreviewRepairAsync(
        DbContext db,
        Guid issueId,
        string action,
        CancellationToken ct)
    {
        ValidateAction(action);
        var issue = await LoadOpenIssueAsync(db, issueId, ct);
        ValidateActionForIssue(action, issue.IssueKind);
        var nodeId = issue.LineageNodeId
            ?? await db.Set<SegmentStudioDerivationEdge>().AsNoTracking()
                .Where(edge => edge.Id == issue.EdgeId)
                .Select(edge => (Guid?)edge.SourceNodeId)
                .SingleOrDefaultAsync(ct)
            ?? throw new LineageConflictException(
                "LINEAGE_COMPONENT_INCONSISTENT",
                "The issue has no remaining component endpoint.");
        var state = await LoadComponentAsync(db, nodeId, ct);
        var fingerprint = Fingerprint(
            $"{issue.Id}|{issue.LastDetectedAt.Ticks}|{state.Fingerprint}|{action}");
        return new LineageRepairPreview(
            issue.Id,
            action,
            fingerprint,
            state.Nodes.Count(node => node.ItemId is not null),
            action switch
            {
                "restore-tag" => "Restore the tag required by the incoming derivation rules.",
                "recalculate" => "Recalculate valid paths from the component roots.",
                "remove" => "Remove the complete remaining lineage component.",
                _ => "Ignore this issue while retaining it as publication-blocking audit evidence.",
            });
    }

    public async Task ExecuteRepairAsync(
        DbContext db,
        Guid issueId,
        LineageRepairExecuteRequest request,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        CancellationToken ct)
    {
        if (db.Database.CurrentTransaction is not null)
        {
            await ExecuteRepairCoreAsync(db, issueId, request, principal, authorization, ct);
            return;
        }

        var strategy = db.Database.CreateExecutionStrategy();
        var firstAttempt = true;
        await strategy.ExecuteAsync(async () =>
        {
            if (!firstAttempt) db.ChangeTracker.Clear();
            firstAttempt = false;
            await ExecuteRepairCoreAsync(db, issueId, request, principal, authorization, ct);
        });
    }

    private async Task ExecuteRepairCoreAsync(
        DbContext db,
        Guid issueId,
        LineageRepairExecuteRequest request,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        CancellationToken ct)
    {
        if (request.OperationId == Guid.Empty)
            throw new ArgumentException("Operation ID is required.", nameof(request));
        ValidateAction(request.Action);
        var requestFingerprint = Fingerprint(
            $"lineage-repair|{issueId}|{request.Action}|{request.Fingerprint}");
        if (await IsRepairReplayAsync(db, request.OperationId, requestFingerprint, principal?.UserId, ct))
            return;

        await using var transaction = db.Database.IsRelational()
            && db.Database.CurrentTransaction is null
            ? await db.Database.BeginTransactionAsync(ct)
            : null;
        if (db.Database.ProviderName?.Contains("Npgsql", StringComparison.Ordinal) == true)
            await db.Database.ExecuteSqlInterpolatedAsync(
                $"SELECT pg_advisory_xact_lock(hashtextextended({request.OperationId.ToString()}, 0))",
                ct);
        if (await IsRepairReplayAsync(db, request.OperationId, requestFingerprint, principal?.UserId, ct))
        {
            if (transaction is not null)
                await transaction.CommitAsync(ct);
            return;
        }
        await SegmentStudioRolloutService.EnsureWritesEnabledAsync(db, ct);

        var preview = await PreviewRepairAsync(db, issueId, request.Action, ct);
        if (preview.Fingerprint != request.Fingerprint)
            throw Changed();
        var issue = await LoadOpenIssueAsync(db, issueId, ct);
        var state = await LoadIssueComponentAsync(db, issue, ct);
        foreach (var videoId in state.Nodes.Select(node => node.LastKnownVideoId).Distinct().Order())
        {
            await SegmentStudioReviewLock.AcquireAsync(db, videoId, ct);
            var permission = request.Action == "remove"
                ? Permissions.SegmentsDelete
                : Permissions.SegmentsWrite;
            var access = await authorization.AuthorizeAsync(
                principal, permission, EntityRef.Of(EntityKinds.Video, videoId), ct);
            if (!access.Allowed)
                throw new LineageConflictException(
                    "LINEAGE_PERMISSION_DENIED",
                    "You cannot repair every member of this lineage component.");
        }
        preview = await PreviewRepairAsync(db, issueId, request.Action, ct);
        if (preview.Fingerprint != request.Fingerprint)
            throw Changed();

        if (request.Action == "ignore")
        {
            issue.State = "ignored";
            issue.ResolutionJson = JsonSerializer.Serialize(new
            {
                action = "ignore",
                actorUserId = principal?.UserId,
                operationId = request.OperationId,
            });
        }
        else if (request.Action == "restore-tag")
        {
            await RestoreExpectedTagAsync(db, issue, principal, authorization, ct);
        }
        else
        {
            var itemId = request.Action == "remove"
                ? state.Nodes.Where(node => node.ItemId is not null)
                    .Select(node => node.ItemId!.Value)
                    .FirstOrDefault()
                : await ResolveRootItemIdAsync(db, issue, ct);
            if (itemId == 0)
                throw new LineageConflictException(
                    "LINEAGE_COMPONENT_INCONSISTENT",
                    "The component has no remaining live item.");
            var item = await db.Set<SegmentStudioItem>().AsNoTracking()
                .SingleAsync(candidate => candidate.Id == itemId, ct);
            if (request.Action == "recalculate")
            {
                var tagId = await ResolveCurrentTagAsync(db, item, ct)
                    ?? throw new LineageConflictException("LINEAGE_RULE_MISMATCH", "Root tag is missing.");
                var tagPreview = await reconciliation.PreviewAsync(
                    db, itemId, new TagChangePreviewRequest(item.Revision, tagId), ct);
                await reconciliation.ExecuteAsync(
                    db,
                    itemId,
                    new TagChangeExecuteRequest(
                        ChildOperationId(request.OperationId, "recalculate"),
                        item.Revision,
                        tagPreview.ComponentFingerprint,
                        tagId),
                    principal?.UserId,
                    ct);
            }
            else
            {
                var deletePreview = await deletion.PreviewRepairAsync(
                    db,
                    itemId,
                    item.Revision,
                    principal,
                    authorization,
                    ct);
                await deletion.ExecuteRepairAsync(
                    db,
                    itemId,
                    new SegmentDependencyDeleteExecuteRequest(
                        ChildOperationId(request.OperationId, "remove"),
                        deletePreview.Fingerprint),
                    principal,
                    authorization,
                    ct);
            }
        }
        if (request.Action is not ("ignore" or "remove"))
        {
            var remaining = await LoadComponentAsync(
                db,
                issue.LineageNodeId
                    ?? throw new LineageConflictException(
                        "LINEAGE_COMPONENT_INCONSISTENT",
                        "The repaired issue no longer has a component anchor."),
                ct);
            if (Detect(remaining).Any(finding =>
                    finding.Kind == issue.IssueKind
                    && finding.NodeId == issue.LineageNodeId
                    && finding.EdgeId == issue.EdgeId))
                throw new LineageConflictException(
                    "LINEAGE_REPAIR_INCOMPLETE",
                    "The selected action did not resolve this integrity issue.");
            issue.State = "resolved";
            issue.ResolvedAt = DateTime.UtcNow;
            issue.ResolutionJson = JsonSerializer.Serialize(new
            {
                action = request.Action,
                actorUserId = principal?.UserId,
                operationId = request.OperationId,
            });
        }
        db.Add(new SegmentStudioSegmentOperation
        {
            OperationId = request.OperationId,
            Kind = "lineage-repair",
            ActorUserId = principal?.UserId,
            RequestFingerprint = requestFingerprint,
            ComponentFingerprint = state.Fingerprint,
            ResultPayloadJson = JsonSerializer.Serialize(new
            {
                issueId,
                action = request.Action,
            }),
            CreatedAt = DateTime.UtcNow,
        });
        await db.SaveChangesAsync(ct);
        if (transaction is not null)
            await transaction.CommitAsync(ct);
    }

    private sealed class ScanAttempt
    {
        public ScanResultSnapshot? CommittedResult { get; set; }
    }

    private sealed record ScanResultSnapshot(
        Guid RunId,
        string State,
        string? CursorJson,
        string CountsJson,
        string? SourceFingerprint,
        DateTime UpdatedAt)
    {
        public static ScanResultSnapshot From(SegmentStudioLineageScanRun run) =>
            new(
                run.Id,
                run.State,
                run.CursorJson,
                run.CountsJson,
                run.SourceFingerprint,
                run.UpdatedAt);

        public bool Matches(SegmentStudioLineageScanRun run) =>
            run.State == State
            && run.CursorJson == CursorJson
            && run.CountsJson == CountsJson
            && run.SourceFingerprint == SourceFingerprint
            && run.UpdatedAt == UpdatedAt;
    }

    private static async Task<bool> IsRepairReplayAsync(
        DbContext db,
        Guid operationId,
        string requestFingerprint,
        int? actorUserId,
        CancellationToken ct)
    {
        var receipt = await db.Set<SegmentStudioSegmentOperation>().AsNoTracking()
            .SingleOrDefaultAsync(operation => operation.OperationId == operationId, ct);
        if (receipt is null)
            return false;
        if (receipt.Kind != "lineage-repair"
            || receipt.RequestFingerprint != requestFingerprint
            || receipt.ActorUserId != actorUserId)
            throw new LineageConflictException(
                "OPERATION_ID_REUSED",
                "The operation ID was already used for a different repair.");
        return true;
    }

    private static Guid ChildOperationId(Guid operationId, string action) =>
        new(SHA256.HashData(Encoding.UTF8.GetBytes($"{operationId}:{action}"))[..16]);

    private static LineageConflictException Changed() =>
        new("LINEAGE_COMPONENT_CHANGED", "The issue or component changed after repair preview.");

    private static async Task<ComponentState> LoadIssueComponentAsync(
        DbContext db,
        SegmentStudioLineageIssue issue,
        CancellationToken ct)
    {
        var nodeId = issue.LineageNodeId
            ?? await db.Set<SegmentStudioDerivationEdge>().AsNoTracking()
                .Where(edge => edge.Id == issue.EdgeId)
                .Select(edge => (Guid?)edge.SourceNodeId)
                .SingleOrDefaultAsync(ct)
            ?? throw new LineageConflictException(
                "LINEAGE_COMPONENT_INCONSISTENT",
                "The issue has no remaining component endpoint.");
        return await LoadComponentAsync(db, nodeId, ct);
    }

    private static async Task RestoreExpectedTagAsync(
        DbContext db,
        SegmentStudioLineageIssue issue,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        CancellationToken ct)
    {
        var node = await db.Set<SegmentStudioLineageNode>()
            .SingleAsync(candidate => candidate.Id == issue.LineageNodeId, ct);
        var expectedTags = await (
                from edge in db.Set<SegmentStudioDerivationEdge>().AsNoTracking()
                join rule in db.Set<SegmentStudioDerivationRule>().AsNoTracking()
                    on edge.RuleId equals rule.Id
                where edge.DerivedNodeId == node.Id
                select rule.DerivedTagId)
            .Distinct()
            .ToListAsync(ct);
        if (expectedTags.Count != 1 || node.ItemId is not long itemId)
            throw new LineageConflictException(
                "LINEAGE_COMPONENT_INCONSISTENT",
                "Incoming rules do not agree on an expected tag.");
        var item = await db.Set<SegmentStudioItem>().SingleAsync(candidate => candidate.Id == itemId, ct);
        var videoId = node.LastKnownVideoId;
        var access = await authorization.AuthorizeAsync(
            principal,
            Permissions.SegmentsWrite,
            EntityRef.Of(EntityKinds.Video, videoId),
            ct);
        if (!access.Allowed)
            throw new LineageConflictException(
                "LINEAGE_PERMISSION_DENIED",
                "You cannot repair this segment.");
        if (item.NativeSegmentId is int nativeId)
        {
            var segment = await db.Set<Segment>().SingleAsync(candidate => candidate.Id == nativeId, ct);
            segment.TagId = expectedTags[0];
            segment.UpdatedAt = DateTime.UtcNow;
        }
        else
        {
            item.TagId = expectedTags[0];
            item.Revision++;
            item.UpdatedAt = DateTime.UtcNow;
        }
        node.LastKnownTagId = expectedTags[0];
        node.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync(ct);
    }

    private static IReadOnlyList<Finding> Detect(ComponentState state)
    {
        var findings = new List<Finding>();
        var nodes = state.Nodes.ToDictionary(node => node.Id);
        var rules = state.Rules.ToDictionary(rule => rule.Id);
        foreach (var node in state.Nodes)
        {
            if (node.State != "live" || node.ItemId is null || !state.CurrentTags.TryGetValue(node.Id, out var tag))
                findings.Add(new("missing-endpoint", node.Id, null, """{"reason":"item-missing"}"""));
            else if (tag != node.LastKnownTagId)
                findings.Add(new(
                    state.Edges.Any(edge => edge.DerivedNodeId == node.Id)
                        ? "derived-tag-mismatch"
                        : "root-tag-mismatch",
                    node.Id,
                    null,
                    JsonSerializer.Serialize(new { expected = node.LastKnownTagId, actual = tag })));
        }
        foreach (var edge in state.Edges)
        {
            if (!nodes.TryGetValue(edge.SourceNodeId, out var source)
                || !nodes.TryGetValue(edge.DerivedNodeId, out var derived))
            {
                findings.Add(new("missing-endpoint", null, edge.Id, "{}"));
                continue;
            }
            if (source.LastKnownVideoId != derived.LastKnownVideoId)
                findings.Add(new("cross-video-edge", null, edge.Id, "{}"));
            if (!rules.TryGetValue(edge.RuleId, out var rule))
                findings.Add(new("missing-rule", null, edge.Id, "{}"));
            else if (edge.RuleVersionAtCreation != rule.Version)
                findings.Add(new(
                    "missing-rule-version",
                    derived.Id,
                    edge.Id,
                    JsonSerializer.Serialize(new
                    {
                        expected = edge.RuleVersionAtCreation,
                        actual = rule.Version,
                    })));
            else if (rule.SourceTagId != source.LastKnownTagId
                || rule.DerivedTagId != derived.LastKnownTagId
                || edge.SourceTagIdAtCreation != source.LastKnownTagId
                || edge.DerivedTagIdAtCreation != derived.LastKnownTagId)
                findings.Add(new("rule-tag-mismatch", derived.Id, edge.Id, "{}"));
        }
        if (HasCycle(state.Edges))
            findings.Add(new(
                "cycle",
                state.Nodes.OrderBy(node => node.Id).Select(node => (Guid?)node.Id).FirstOrDefault(),
                null,
                "{}"));
        return findings;
    }

    private static bool HasCycle(IReadOnlyList<SegmentStudioDerivationEdge> edges)
    {
        var outgoing = edges.ToLookup(edge => edge.SourceNodeId, edge => edge.DerivedNodeId);
        var visiting = new HashSet<Guid>();
        var visited = new HashSet<Guid>();
        bool Visit(Guid nodeId)
        {
            if (!visiting.Add(nodeId))
                return true;
            if (visited.Contains(nodeId))
            {
                visiting.Remove(nodeId);
                return false;
            }
            foreach (var child in outgoing[nodeId])
                if (Visit(child))
                    return true;
            visiting.Remove(nodeId);
            visited.Add(nodeId);
            return false;
        }
        return edges.SelectMany(edge => new[] { edge.SourceNodeId, edge.DerivedNodeId })
            .Distinct()
            .Any(Visit);
    }

    private static async Task PersistAsync(
        DbContext db,
        string componentKey,
        IReadOnlyList<Finding> findings,
        CancellationToken ct)
    {
        var now = DateTime.UtcNow;
        var activeFingerprints = new HashSet<string>();
        foreach (var finding in findings)
        {
            var fingerprint = Fingerprint(
                $"{finding.Kind}|{componentKey}|{finding.NodeId}|{finding.EdgeId}|{finding.DetailsJson}");
            activeFingerprints.Add(fingerprint);
            var issue = await db.Set<SegmentStudioLineageIssue>()
                .SingleOrDefaultAsync(candidate =>
                    candidate.IssueFingerprint == fingerprint
                    && (candidate.State == "open" || candidate.State == "ignored"), ct);
            if (issue is null)
            {
                issue = new SegmentStudioLineageIssue
                {
                    Id = Guid.NewGuid(),
                    IssueFingerprint = fingerprint,
                    ComponentKey = componentKey,
                    IssueKind = finding.Kind,
                    State = "open",
                    LineageNodeId = finding.NodeId,
                    EdgeId = finding.EdgeId,
                    DetailsJson = finding.DetailsJson,
                    FirstDetectedAt = now,
                    LastDetectedAt = now,
                };
                db.Add(issue);
            }
            else
            {
                issue.LastDetectedAt = now;
            }
        }
        var resolved = await db.Set<SegmentStudioLineageIssue>()
            .Where(issue => issue.ComponentKey == componentKey
                && issue.State == "open"
                && !activeFingerprints.Contains(issue.IssueFingerprint))
            .ToListAsync(ct);
        foreach (var issue in resolved)
        {
            issue.State = "resolved";
            issue.ResolvedAt = now;
            issue.ResolutionJson = """{"action":"no-longer-detected"}""";
        }
        await db.SaveChangesAsync(ct);
    }

    private static async Task<ComponentState> LoadComponentAsync(
        DbContext db,
        Guid nodeId,
        CancellationToken ct)
    {
        var edges = (await LineageScaleQueries.LoadComponentEdgesAsync(
            db, [nodeId], tracking: false, ct)).ToList();
        var nodeIds = edges
            .SelectMany(edge => new[] { edge.SourceNodeId, edge.DerivedNodeId })
            .Append(nodeId)
            .ToHashSet();
        var nodes = await db.Set<SegmentStudioLineageNode>().AsNoTracking()
            .Where(node => nodeIds.Contains(node.Id))
            .ToListAsync(ct);
        var ruleIds = edges.Select(edge => edge.RuleId).Distinct().ToArray();
        var rules = await db.Set<SegmentStudioDerivationRule>().AsNoTracking()
            .Where(rule => ruleIds.Contains(rule.Id))
            .ToListAsync(ct);
        var itemIds = nodes.Where(node => node.ItemId is not null)
            .Select(node => node.ItemId!.Value)
            .ToArray();
        var items = await db.Set<SegmentStudioItem>().AsNoTracking()
            .Where(item => itemIds.Contains(item.Id))
            .ToListAsync(ct);
        var nativeIds = items.Where(item => item.NativeSegmentId is not null)
            .Select(item => item.NativeSegmentId!.Value)
            .ToArray();
        var nativeTags = await db.Set<Segment>().AsNoTracking()
            .Where(segment => nativeIds.Contains(segment.Id))
            .ToDictionaryAsync(segment => segment.Id, segment => segment.TagId, ct);
        var tags = new Dictionary<Guid, int?>();
        foreach (var node in nodes)
        {
            var item = items.SingleOrDefault(candidate => candidate.Id == node.ItemId);
            if (item is null)
                continue;
            tags[node.Id] = item.NativeSegmentId is int nativeId
                ? nativeTags.GetValueOrDefault(nativeId)
                : item.TagId;
        }
        var componentKey = Fingerprint(string.Join("|", nodeIds.Order()));
        var payload = string.Join("|", nodes.OrderBy(node => node.Id)
                .Select(node => $"n:{node.Id}:{node.ItemId}:{node.State}:{node.LastKnownTagId}:{node.UpdatedAt.Ticks}")) + "|"
            + string.Join("|", edges.OrderBy(edge => edge.Id)
                .Select(edge => $"e:{edge.Id}:{edge.SourceNodeId}:{edge.DerivedNodeId}:{edge.RuleId}:{edge.RuleVersionAtCreation}:{edge.UpdatedAt.Ticks}")) + "|"
            + string.Join("|", rules.OrderBy(rule => rule.Id)
                .Select(rule => $"r:{rule.Id}:{rule.SourceTagId}:{rule.DerivedTagId}:{rule.UpdatedAt.Ticks}")) + "|"
            + string.Join("|", tags.OrderBy(pair => pair.Key)
                .Select(pair => $"t:{pair.Key}:{pair.Value}"));
        return new ComponentState(
            componentKey, Fingerprint(payload), nodes, edges, rules, tags);
    }

    private static async Task<long> ResolveRootItemIdAsync(
        DbContext db,
        SegmentStudioLineageIssue issue,
        CancellationToken ct)
    {
        var start = issue.LineageNodeId
            ?? await db.Set<SegmentStudioDerivationEdge>().AsNoTracking()
                .Where(edge => edge.Id == issue.EdgeId)
                .Select(edge => edge.SourceNodeId)
                .SingleAsync(ct);
        var current = start;
        var visited = new HashSet<Guid>();
        while (visited.Add(current))
        {
            var parent = await db.Set<SegmentStudioDerivationEdge>().AsNoTracking()
                .Where(edge => edge.DerivedNodeId == current)
                .OrderBy(edge => edge.Id)
                .Select(edge => (Guid?)edge.SourceNodeId)
                .FirstOrDefaultAsync(ct);
            if (parent is not Guid parentId)
                break;
            current = parentId;
        }
        return await db.Set<SegmentStudioLineageNode>().AsNoTracking()
            .Where(node => node.Id == current)
            .Select(node => node.ItemId)
            .SingleAsync(ct)
            ?? throw new LineageConflictException(
                "LINEAGE_COMPONENT_INCONSISTENT",
                "The component root is missing.");
    }

    private static async Task<int?> ResolveCurrentTagAsync(
        DbContext db,
        SegmentStudioItem item,
        CancellationToken ct) =>
        item.NativeSegmentId is int nativeId
            ? await db.Set<Segment>().AsNoTracking()
                .Where(segment => segment.Id == nativeId)
                .Select(segment => segment.TagId)
                .SingleOrDefaultAsync(ct)
            : item.TagId;

    private static async Task<SegmentStudioLineageIssue> LoadOpenIssueAsync(
        DbContext db,
        Guid issueId,
        CancellationToken ct) =>
        await db.Set<SegmentStudioLineageIssue>()
            .SingleOrDefaultAsync(issue => issue.Id == issueId && issue.State == "open", ct)
        ?? throw new KeyNotFoundException("Open lineage issue was not found.");

    private static void ValidateAction(string action)
    {
        if (action is not ("restore-tag" or "recalculate" or "remove" or "ignore"))
            throw new ArgumentException("Repair action is invalid.", nameof(action));
    }

    private static void ValidateActionForIssue(string action, string issueKind)
    {
        if (action is "remove" or "ignore")
            return;
        if (action == "restore-tag" && issueKind == "derived-tag-mismatch")
            return;
        if (action == "recalculate"
            && issueKind is ("root-tag-mismatch" or "derived-tag-mismatch"
                or "rule-tag-mismatch" or "missing-rule-version"))
            return;
        throw new LineageConflictException(
            "LINEAGE_REPAIR_NOT_APPLICABLE",
            "The selected repair does not apply to this issue type.");
    }

    private static Guid? ParseCursor(string? json)
    {
        if (string.IsNullOrWhiteSpace(json))
            return null;
        using var document = JsonDocument.Parse(json);
        return document.RootElement.TryGetProperty("nodeId", out var value)
            ? value.GetGuid()
            : null;
    }

    private static (int Components, int Issues) ParseCounts(string json)
    {
        using var document = JsonDocument.Parse(json);
        return (
            document.RootElement.TryGetProperty("components", out var components)
                ? components.GetInt32()
                : 0,
            document.RootElement.TryGetProperty("issues", out var issues)
                ? issues.GetInt32()
                : 0);
    }

    private static async Task<string> SourceFingerprintAsync(DbContext db, CancellationToken ct)
    {
        var nodeCount = await db.Set<SegmentStudioLineageNode>().CountAsync(ct);
        var edgeCount = await db.Set<SegmentStudioDerivationEdge>().CountAsync(ct);
        var ruleCount = await db.Set<SegmentStudioDerivationRule>().CountAsync(ct);
        var itemCount = await db.Set<SegmentStudioItem>().CountAsync(ct);
        var nativeCount = await db.Set<Segment>().CountAsync(ct);
        var nativeIdSum = await db.Set<Segment>()
            .SumAsync(segment => (long?)segment.Id, ct) ?? 0;
        var maxNodeUpdate = await db.Set<SegmentStudioLineageNode>()
            .MaxAsync(node => (DateTime?)node.UpdatedAt, ct);
        var maxEdgeUpdate = await db.Set<SegmentStudioDerivationEdge>()
            .MaxAsync(edge => (DateTime?)edge.UpdatedAt, ct);
        var maxRuleUpdate = await db.Set<SegmentStudioDerivationRule>()
            .MaxAsync(rule => (DateTime?)rule.UpdatedAt, ct);
        var maxItemUpdate = await db.Set<SegmentStudioItem>()
            .MaxAsync(item => (DateTime?)item.UpdatedAt, ct);
        var maxNativeUpdate = await db.Set<Segment>()
            .MaxAsync(segment => (DateTime?)segment.UpdatedAt, ct);
        return Fingerprint(
            $"{nodeCount}|{edgeCount}|{ruleCount}|{itemCount}|{nativeCount}|{nativeIdSum}|{maxNodeUpdate?.Ticks}|{maxEdgeUpdate?.Ticks}|{maxRuleUpdate?.Ticks}|{maxItemUpdate?.Ticks}|{maxNativeUpdate?.Ticks}");
    }

    private static LineageIssueDto ToDto(Finding finding) =>
        new(Guid.Empty, finding.Kind, "open", "", finding.NodeId, finding.EdgeId,
            finding.DetailsJson, DateTime.MinValue);

    private static string Fingerprint(string payload) =>
        Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(payload)));

    private static DateTime PostgreSqlTimestamp(DateTime value) =>
        new(value.Ticks - value.Ticks % 10, value.Kind);

    private sealed record Finding(string Kind, Guid? NodeId, long? EdgeId, string DetailsJson);
    private sealed record ComponentState(
        string ComponentKey,
        string Fingerprint,
        IReadOnlyList<SegmentStudioLineageNode> Nodes,
        IReadOnlyList<SegmentStudioDerivationEdge> Edges,
        IReadOnlyList<SegmentStudioDerivationRule> Rules,
        IReadOnlyDictionary<Guid, int?> CurrentTags);
}
