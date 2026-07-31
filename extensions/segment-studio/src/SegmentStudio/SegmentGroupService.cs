using Cove.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

public enum SegmentGroupMutationStatus
{
    Updated,
    NotFound,
    Invalid,
    Conflict,
}

public sealed record SegmentGroupTagResponse(int TagId, string? TagName, int SortOrder);
public sealed record SegmentGroupResponse(long Id, string Name, int SortOrder, IReadOnlyList<SegmentGroupTagResponse> Tags);
public sealed record SegmentGroupUpdateRequest(string Name, IReadOnlyList<int> TagIds);
public sealed record SegmentGroupCreateRequest(string Name);
public sealed record SegmentGroupReorderRequest(IReadOnlyList<long> GroupIds);
public sealed record SegmentGroupMutationResult(SegmentGroupMutationStatus Status, SegmentGroupResponse? Group = null, string? Error = null);

public static class SegmentGroupService
{
    // Serializes extension-owned group/order mutations without locking canonical Cove rows.
    private const long MutationAdvisoryLockId = 0x5345474D475250;

    public static async Task<IReadOnlyList<SegmentGroupResponse>> ListAsync(DbContext db, CancellationToken ct)
    {
        var groups = await db.Set<SegmentStudioSegmentGroup>()
            .AsNoTracking()
            .OrderBy(group => group.SortOrder)
            .ThenBy(group => group.Id)
            .Select(group => new { group.Id, group.Name, group.SortOrder })
            .ToListAsync(ct);
        if (groups.Count == 0) return [];

        var groupIds = groups.Select(group => group.Id).ToArray();
        var members = await db.Set<SegmentStudioSegmentGroupTag>()
            .AsNoTracking()
            .Where(member => groupIds.Contains(member.SegmentGroupId))
            .Join(db.Set<Tag>().AsNoTracking(),
                member => member.TagId,
                tag => tag.Id,
                (member, tag) => new { member.SegmentGroupId, member.TagId, TagName = tag.Name, member.SortOrder })
            .OrderBy(member => member.SegmentGroupId)
            .ThenBy(member => member.SortOrder)
            .ThenBy(member => member.TagId)
            .ToListAsync(ct);
        var membersByGroup = members
            .GroupBy(member => member.SegmentGroupId)
            .ToDictionary(
                grouping => grouping.Key,
                grouping => (IReadOnlyList<SegmentGroupTagResponse>)grouping
                    .Select(member => new SegmentGroupTagResponse(member.TagId, member.TagName, member.SortOrder))
                    .ToList());
        return groups.Select(group => new SegmentGroupResponse(
            group.Id,
            group.Name,
            group.SortOrder,
            membersByGroup.GetValueOrDefault(group.Id) ?? [])).ToList();
    }

    public static async Task<IReadOnlyList<SegmentGroupResponse>> ListForTagsAsync(
        DbContext db,
        IReadOnlyCollection<int> tagIds,
        CancellationToken ct)
    {
        var groups = await db.Set<SegmentStudioSegmentGroup>()
            .AsNoTracking()
            .OrderBy(group => group.SortOrder)
            .ThenBy(group => group.Id)
            .Select(group => new { group.Id, group.Name, group.SortOrder })
            .ToListAsync(ct);
        if (groups.Count == 0) return [];

        var relevantTagIds = tagIds.Distinct().ToArray();
        var membersByGroup = new Dictionary<long, IReadOnlyList<SegmentGroupTagResponse>>();
        if (relevantTagIds.Length > 0)
        {
            var groupIds = groups.Select(group => group.Id).ToArray();
            var members = await db.Set<SegmentStudioSegmentGroupTag>()
                .AsNoTracking()
                .Where(member => groupIds.Contains(member.SegmentGroupId) && relevantTagIds.Contains(member.TagId))
                .OrderBy(member => member.SegmentGroupId)
                .ThenBy(member => member.SortOrder)
                .ThenBy(member => member.TagId)
                .Select(member => new SegmentGroupMemberRow(member.SegmentGroupId, member.TagId, member.SortOrder))
                .ToListAsync(ct);
            membersByGroup = members
                .GroupBy(member => member.SegmentGroupId)
                .ToDictionary(
                    grouping => grouping.Key,
                    grouping => (IReadOnlyList<SegmentGroupTagResponse>)grouping
                        .Select(member => new SegmentGroupTagResponse(member.TagId, null, member.SortOrder))
                        .ToList());
        }
        return groups
            .Where(group => membersByGroup.ContainsKey(group.Id))
            .Select(group => new SegmentGroupResponse(
                group.Id,
                group.Name,
                group.SortOrder,
                membersByGroup[group.Id]))
            .ToList();
    }

    public static async Task<SegmentGroupResponse> CreateAsync(DbContext db, string name, CancellationToken ct)
    {
        var normalizedName = NormalizeName(name);
        if (normalizedName is null) throw new ArgumentException("Segment group name is required.", nameof(name));
        return await ExecuteMutationAsync(db, "create", async () =>
        {
            var existing = await db.Set<SegmentStudioSegmentGroup>()
                .AsNoTracking()
                .SingleOrDefaultAsync(group => group.Name == normalizedName, ct);
            if (existing is not null)
                throw new InvalidOperationException("A Segment group with that name already exists.");
            var nextOrder = await db.Set<SegmentStudioSegmentGroup>()
                .Select(group => (int?)group.SortOrder)
                .MaxAsync(ct) is int maximum ? maximum + 1 : 0;
            var now = DateTime.UtcNow;
            var group = new SegmentStudioSegmentGroup
            {
                Name = normalizedName,
                SortOrder = nextOrder,
                CreatedAt = now,
                UpdatedAt = now,
            };
            db.Add(group);
            await db.SaveChangesAsync(ct);
            return MutationExecution.Changed(
                new SegmentGroupResponse(group.Id, group.Name, group.SortOrder, []));
        }, ct);
    }

    public static async Task<SegmentGroupMutationResult> UpdateAsync(
        DbContext db,
        long groupId,
        SegmentGroupUpdateRequest request,
        CancellationToken ct)
    {
        var normalizedName = NormalizeName(request.Name);
        if (normalizedName is null) return new(SegmentGroupMutationStatus.Invalid, Error: "Segment group name is required.");
        var tagIds = request.TagIds?.Distinct().ToArray() ?? [];
        if (tagIds.Length != (request.TagIds?.Count ?? 0))
            return new(SegmentGroupMutationStatus.Invalid, Error: "Each tag may appear only once in a Segment group.");

        return await ExecuteMutationAsync(db, "update", async () =>
        {
            var group = await db.Set<SegmentStudioSegmentGroup>().SingleOrDefaultAsync(candidate => candidate.Id == groupId, ct);
            if (group is null)
                return MutationExecution.Unchanged(
                    new SegmentGroupMutationResult(SegmentGroupMutationStatus.NotFound, Error: "Segment group not found."));
            if (await db.Set<SegmentStudioSegmentGroup>().AnyAsync(candidate => candidate.Id != groupId && candidate.Name == normalizedName, ct))
                return MutationExecution.Unchanged(
                    new SegmentGroupMutationResult(SegmentGroupMutationStatus.Conflict, Error: "A Segment group with that name already exists."));
            if (tagIds.Length > 0)
            {
                var existingTagCount = await db.Set<Tag>().AsNoTracking().CountAsync(tag => tagIds.Contains(tag.Id), ct);
                if (existingTagCount != tagIds.Length)
                    return MutationExecution.Unchanged(
                        new SegmentGroupMutationResult(SegmentGroupMutationStatus.Invalid, Error: "One or more tags no longer exist or are not accessible."));
            }

            group.Name = normalizedName;
            group.UpdatedAt = DateTime.UtcNow;
            var memberships = await db.Set<SegmentStudioSegmentGroupTag>()
                .Where(member => member.SegmentGroupId == groupId || tagIds.Contains(member.TagId))
                .ToListAsync(ct);
            db.RemoveRange(memberships);
            await db.SaveChangesAsync(ct);
            db.AddRange(tagIds.Select((tagId, index) => new SegmentStudioSegmentGroupTag
            {
                SegmentGroupId = groupId,
                TagId = tagId,
                SortOrder = index,
            }));
            await db.SaveChangesAsync(ct);
            var updated = (await ListAsync(db, ct)).Single(candidate => candidate.Id == groupId);
            return MutationExecution.Changed(
                new SegmentGroupMutationResult(SegmentGroupMutationStatus.Updated, updated));
        }, ct);
    }

    public static async Task<SegmentGroupMutationResult> ReorderAsync(DbContext db, IReadOnlyList<long> groupIds, CancellationToken ct)
    {
        if (groupIds is null)
            return new(SegmentGroupMutationStatus.Invalid, Error: "The Segment group order is required.");
        if (groupIds.Distinct().Count() != groupIds.Count)
            return new(SegmentGroupMutationStatus.Invalid, Error: "Each Segment group must appear exactly once.");
        return await ExecuteMutationAsync(db, "reorder", async () =>
        {
            var trackedGroups = await db.Set<SegmentStudioSegmentGroup>().OrderBy(group => group.Id).ToListAsync(ct);
            if (trackedGroups.Count != groupIds.Count || trackedGroups.Select(group => group.Id).Except(groupIds).Any())
                return MutationExecution.Unchanged(
                    new SegmentGroupMutationResult(SegmentGroupMutationStatus.Invalid, Error: "The order must include every Segment group exactly once."));
            var temporaryStart = trackedGroups.Count == 0 ? 0 : trackedGroups.Max(group => group.SortOrder) + 1;
            for (var index = 0; index < trackedGroups.Count; index++) trackedGroups[index].SortOrder = temporaryStart + index;
            await db.SaveChangesAsync(ct);
            var byId = trackedGroups.ToDictionary(group => group.Id);
            for (var index = 0; index < groupIds.Count; index++) byId[groupIds[index]].SortOrder = index;
            await db.SaveChangesAsync(ct);
            return MutationExecution.Changed(
                new SegmentGroupMutationResult(SegmentGroupMutationStatus.Updated));
        }, ct);
    }

    public static async Task<bool> DeleteAsync(DbContext db, long groupId, CancellationToken ct)
    {
        return await ExecuteMutationAsync(db, "delete", async () =>
        {
            var group = await db.Set<SegmentStudioSegmentGroup>().SingleOrDefaultAsync(candidate => candidate.Id == groupId, ct);
            if (group is null) return MutationExecution.Unchanged(false);
            db.Remove(group);
            await db.SaveChangesAsync(ct);
            return MutationExecution.Changed(true);
        }, ct);
    }

    private static string? NormalizeName(string? name)
    {
        var normalized = name?.Trim();
        return string.IsNullOrWhiteSpace(normalized) || normalized.Length > 200 ? null : normalized;
    }

    private static async Task<T> ExecuteMutationAsync<T>(
        DbContext db,
        string kind,
        Func<Task<MutationExecution<T>>> mutation,
        CancellationToken ct)
    {
        var operationId = Guid.NewGuid();
        var hasCompletedResult = false;
        T completedResult = default!;
        var strategy = db.Database.CreateExecutionStrategy();
        return await strategy.ExecuteAsync(async () =>
        {
            // A transient failure may retry this delegate with the same scoped DbContext.
            // Reset tracked state before re-reading all mutation inputs under the lock.
            db.ChangeTracker.Clear();
            await using var transaction = db.Database.IsRelational()
                ? await db.Database.BeginTransactionAsync(ct)
                : null;
            if (transaction is not null)
            {
                await db.Database.ExecuteSqlRawAsync(
                    $"SELECT pg_advisory_xact_lock({MutationAdvisoryLockId})",
                    ct);
            }

            var alreadyCommitted = await db.Set<SegmentStudioSegmentGroupOperation>()
                .AsNoTracking()
                .AnyAsync(operation => operation.OperationId == operationId, ct);
            if (alreadyCommitted)
            {
                if (!hasCompletedResult)
                    throw new InvalidOperationException("A Segment group operation receipt exists without its request result.");
                if (transaction is not null) await transaction.CommitAsync(ct);
                return completedResult;
            }

            var execution = await mutation();
            if (execution.Changed)
            {
                db.Add(new SegmentStudioSegmentGroupOperation
                {
                    OperationId = operationId,
                    Kind = kind,
                    CreatedAt = DateTime.UtcNow,
                });
                await db.SaveChangesAsync(ct);
                completedResult = execution.Result;
                hasCompletedResult = true;
            }
            if (transaction is not null) await transaction.CommitAsync(ct);
            return execution.Result;
        });
    }

    private sealed record MutationExecution<T>(T Result, bool Changed);

    private static class MutationExecution
    {
        public static MutationExecution<T> Changed<T>(T result) => new(result, true);
        public static MutationExecution<T> Unchanged<T>(T result) => new(result, false);
    }

    private sealed record SegmentGroupMemberRow(long SegmentGroupId, int TagId, int SortOrder);
}
