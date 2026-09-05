using Cove.Core.Auth;
using Cove.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

public enum SegmentGroupMutationStatus { Updated, NotFound, Invalid, Conflict, Forbidden }

public sealed record SegmentGroupTagResponse(int TagId, string? TagName, int SortOrder, string? TagSortName = null);
public sealed record SegmentGroupResponse(long Id, string Name, int SortOrder, IReadOnlyList<SegmentGroupTagResponse> Tags);
public sealed record SegmentGroupUpdateRequest(string Name, IReadOnlyList<int> TagIds);
public sealed record SegmentGroupCreateRequest(string Name);
public sealed record SegmentGroupReorderRequest(IReadOnlyList<long> GroupIds);
public sealed record SegmentGroupAssignmentRequest(long? GroupId);
public sealed record SegmentGroupMutationResult(SegmentGroupMutationStatus Status, SegmentGroupResponse? Group = null, string? Error = null);

public static class SegmentGroupService
{
    private const long MutationAdvisoryLockId = 0x5345474D475250;

    public static async Task<IReadOnlyList<SegmentGroupResponse>> ListAsync(DbContext db, CancellationToken ct)
    {
        var groups = await db.Set<TagGroup>().AsNoTracking()
            .OrderBy(group => group.SortOrder).ThenBy(group => group.Name).ThenBy(group => group.Id)
            .Select(group => new { group.Id, group.Name, group.SortOrder }).ToListAsync(ct);
        if (groups.Count == 0) return [];

        var groupIds = groups.Select(group => group.Id).ToArray();
        var members = await db.Set<Tag>().AsNoTracking()
            .Where(tag => tag.TagGroupId.HasValue && groupIds.Contains(tag.TagGroupId.Value))
            .Select(tag => new NativeMember(
                tag.TagGroupId!.Value, tag.Id, tag.Name, tag.SortName,
                tag.TagGroup!.Name, tag.TagGroup.SortOrder))
            .ToListAsync(ct);
        var membersByGroup = members.GroupBy(member => member.GroupId).ToDictionary(
            grouping => grouping.Key,
            grouping => (IReadOnlyList<SegmentGroupTagResponse>)OrderMembers(grouping)
                .Select((member, index) => new SegmentGroupTagResponse(member.Id, member.Name, index, member.SortName))
                .ToList());

        return groups.Select((group, groupIndex) => new SegmentGroupResponse(
            group.Id, group.Name, groupIndex, membersByGroup.GetValueOrDefault(group.Id) ?? [])).ToList();
    }

    public static async Task<IReadOnlyList<SegmentGroupResponse>> ListForTagsAsync(
        DbContext db, IReadOnlyCollection<int> tagIds, CancellationToken ct)
    {
        var relevantTagIds = tagIds.Distinct().ToArray();
        if (relevantTagIds.Length == 0) return [];
        var members = await db.Set<Tag>().AsNoTracking()
            .Where(tag => relevantTagIds.Contains(tag.Id) && tag.TagGroupId.HasValue)
            .Select(tag => new NativeMember(
                tag.TagGroupId!.Value, tag.Id, tag.Name, tag.SortName,
                tag.TagGroup!.Name, tag.TagGroup.SortOrder))
            .ToListAsync(ct);

        var orderedGroups = members.GroupBy(member => new { member.GroupId, member.GroupName, member.GroupSortOrder })
            .OrderBy(grouping => grouping.Key.GroupSortOrder)
            .ThenBy(grouping => grouping.Key.GroupName)
            .ThenBy(grouping => grouping.Key.GroupId)
            .ToList();
        return orderedGroups.Select((grouping, groupIndex) => new SegmentGroupResponse(
                grouping.Key.GroupId,
                grouping.Key.GroupName,
                groupIndex,
                OrderMembers(grouping)
                    .Select((member, index) => new SegmentGroupTagResponse(member.Id, null, index, member.SortName))
                    .ToList()))
            .ToList();
    }

    public static async Task<SegmentGroupResponse> CreateAsync(DbContext db, string name, CancellationToken ct)
    {
        var normalizedName = NormalizeName(name);
        if (normalizedName is null) throw new ArgumentException("Tag group name is required.", nameof(name));
        return await ExecuteMutationAsync(db, "create", async () =>
        {
            if (await db.Set<TagGroup>().AsNoTracking().AnyAsync(group => group.Name == normalizedName, ct))
                throw new InvalidOperationException("A Cove tag group with that name already exists.");
            var nextOrder = await db.Set<TagGroup>().Select(group => (int?)group.SortOrder).MaxAsync(ct) is int maximum
                ? maximum + 10
                : 10;
            var now = DateTime.UtcNow;
            var group = new TagGroup { Name = normalizedName, SortOrder = nextOrder, CreatedAt = now, UpdatedAt = now };
            db.Add(group);
            await db.SaveChangesAsync(ct);
            return MutationExecution.Changed(new SegmentGroupResponse(group.Id, group.Name, group.SortOrder, []));
        }, ct);
    }

    public static async Task<SegmentGroupMutationResult> AssignTagGroupAuthorizedAsync(
        DbContext db,
        int tagId,
        long? groupId,
        Func<IReadOnlyCollection<int>, CancellationToken, Task<AuthorizationResult>> authorizeAffectedTags,
        CancellationToken ct)
    {
        if (tagId <= 0)
            return new(SegmentGroupMutationStatus.NotFound, Error: "Tag not found.");
        if (groupId.HasValue && groupId is <= 0 or > int.MaxValue)
            return new(SegmentGroupMutationStatus.NotFound, Error: "Tag group not found.");
        var nativeGroupId = groupId.HasValue ? (int?)groupId.Value : null;

        return await ExecuteMutationAsync(db, "assign-tag-group", async () =>
        {
            if (nativeGroupId.HasValue &&
                !await db.Set<TagGroup>().AsNoTracking().AnyAsync(group => group.Id == nativeGroupId.Value, ct))
                return MutationExecution.Unchanged(new SegmentGroupMutationResult(
                    SegmentGroupMutationStatus.NotFound, Error: "Tag group not found."));
            var tag = await db.Set<Tag>().SingleOrDefaultAsync(candidate => candidate.Id == tagId, ct);
            if (tag is null)
                return MutationExecution.Unchanged(new SegmentGroupMutationResult(
                    SegmentGroupMutationStatus.NotFound, Error: "Tag not found."));

            var access = await authorizeAffectedTags([tag.Id], ct);
            if (!access.Allowed)
                return MutationExecution.Unchanged(new SegmentGroupMutationResult(
                    SegmentGroupMutationStatus.Forbidden, Error: access.Reason ?? "You cannot change this tag."));

            if (tag.TagGroupId == nativeGroupId)
                return MutationExecution.Unchanged(new SegmentGroupMutationResult(SegmentGroupMutationStatus.Updated));
            tag.TagGroupId = nativeGroupId;
            tag.UpdatedAt = DateTime.UtcNow;
            await db.SaveChangesAsync(ct);
            return MutationExecution.Changed(new SegmentGroupMutationResult(SegmentGroupMutationStatus.Updated));
        }, ct);
    }

    public static async Task<SegmentGroupMutationResult> UpdateAsync(
        DbContext db, long groupId, SegmentGroupUpdateRequest request, CancellationToken ct)
        => await UpdateAsync(db, groupId, request, authorizeAffectedTags: null, ct);

    public static async Task<SegmentGroupMutationResult> UpdateAuthorizedAsync(
        DbContext db, long groupId, SegmentGroupUpdateRequest request,
        Func<IReadOnlyCollection<int>, CancellationToken, Task<AuthorizationResult>> authorizeAffectedTags,
        CancellationToken ct)
        => await UpdateAsync(db, groupId, request, authorizeAffectedTags, ct);

    private static async Task<SegmentGroupMutationResult> UpdateAsync(
        DbContext db, long groupId, SegmentGroupUpdateRequest request,
        Func<IReadOnlyCollection<int>, CancellationToken, Task<AuthorizationResult>>? authorizeAffectedTags,
        CancellationToken ct)
    {
        var normalizedName = NormalizeName(request.Name);
        if (normalizedName is null) return new(SegmentGroupMutationStatus.Invalid, Error: "Tag group name is required.");
        var tagIds = request.TagIds?.Distinct().ToArray() ?? [];
        if (tagIds.Length != (request.TagIds?.Count ?? 0))
            return new(SegmentGroupMutationStatus.Invalid, Error: "Each tag may appear only once in a tag group.");
        if (groupId is <= 0 or > int.MaxValue)
            return new(SegmentGroupMutationStatus.NotFound, Error: "Tag group not found.");
        var nativeGroupId = (int)groupId;

        return await ExecuteMutationAsync(db, "update", async () =>
        {
            var group = await db.Set<TagGroup>().SingleOrDefaultAsync(candidate => candidate.Id == nativeGroupId, ct);
            if (group is null)
                return MutationExecution.Unchanged(new SegmentGroupMutationResult(SegmentGroupMutationStatus.NotFound, Error: "Tag group not found."));
            if (await db.Set<TagGroup>().AnyAsync(candidate => candidate.Id != nativeGroupId && candidate.Name == normalizedName, ct))
                return MutationExecution.Unchanged(new SegmentGroupMutationResult(SegmentGroupMutationStatus.Conflict, Error: "A Cove tag group with that name already exists."));

            var tags = await db.Set<Tag>().Where(tag => tag.TagGroupId == nativeGroupId || tagIds.Contains(tag.Id)).ToListAsync(ct);
            if (tags.Count(tag => tagIds.Contains(tag.Id)) != tagIds.Length)
                return MutationExecution.Unchanged(new SegmentGroupMutationResult(SegmentGroupMutationStatus.Invalid, Error: "One or more tags no longer exist or are not accessible."));
            if (authorizeAffectedTags is not null)
            {
                var access = await authorizeAffectedTags(tags.Select(tag => tag.Id).ToArray(), ct);
                if (!access.Allowed)
                    return MutationExecution.Unchanged(new SegmentGroupMutationResult(
                        SegmentGroupMutationStatus.Forbidden, Error: access.Reason ?? "You cannot change one or more tags."));
            }

            var requestedTagIds = tagIds.ToHashSet();
            var now = DateTime.UtcNow;
            group.Name = normalizedName;
            group.UpdatedAt = now;
            foreach (var tag in tags)
            {
                if (requestedTagIds.Contains(tag.Id)) tag.TagGroupId = nativeGroupId;
                else if (tag.TagGroupId == nativeGroupId) tag.TagGroupId = null;
                tag.UpdatedAt = now;
            }
            await db.SaveChangesAsync(ct);
            var updated = (await ListAsync(db, ct)).Single(candidate => candidate.Id == nativeGroupId);
            return MutationExecution.Changed(new SegmentGroupMutationResult(SegmentGroupMutationStatus.Updated, updated));
        }, ct);
    }

    public static async Task<SegmentGroupMutationResult> ReorderAsync(
        DbContext db, IReadOnlyList<long> groupIds, CancellationToken ct)
    {
        if (groupIds is null)
            return new(SegmentGroupMutationStatus.Invalid, Error: "The tag group order is required.");
        if (groupIds.Distinct().Count() != groupIds.Count || groupIds.Any(id => id is <= 0 or > int.MaxValue))
            return new(SegmentGroupMutationStatus.Invalid, Error: "Each tag group must appear exactly once.");
        return await ExecuteMutationAsync(db, "reorder", async () =>
        {
            var trackedGroups = await db.Set<TagGroup>().OrderBy(group => group.Id).ToListAsync(ct);
            var nativeGroupIds = groupIds.Select(id => (int)id).ToArray();
            if (trackedGroups.Count != nativeGroupIds.Length || trackedGroups.Select(group => group.Id).Except(nativeGroupIds).Any())
                return MutationExecution.Unchanged(new SegmentGroupMutationResult(
                    SegmentGroupMutationStatus.Invalid, Error: "The order must include every Cove tag group exactly once."));
            var byId = trackedGroups.ToDictionary(group => group.Id);
            var now = DateTime.UtcNow;
            for (var index = 0; index < nativeGroupIds.Length; index++)
            {
                byId[nativeGroupIds[index]].SortOrder = index * 10;
                byId[nativeGroupIds[index]].UpdatedAt = now;
            }
            await db.SaveChangesAsync(ct);
            return MutationExecution.Changed(new SegmentGroupMutationResult(SegmentGroupMutationStatus.Updated));
        }, ct);
    }

    public static async Task<bool> DeleteAsync(DbContext db, long groupId, CancellationToken ct)
    {
        if (groupId is <= 0 or > int.MaxValue) return false;
        var nativeGroupId = (int)groupId;
        return await ExecuteMutationAsync(db, "delete", async () =>
        {
            var group = await db.Set<TagGroup>().SingleOrDefaultAsync(candidate => candidate.Id == nativeGroupId, ct);
            if (group is null) return MutationExecution.Unchanged(false);
            db.Remove(group);
            await db.SaveChangesAsync(ct);
            return MutationExecution.Changed(true);
        }, ct);
    }

    private static IOrderedEnumerable<T> OrderMembers<T>(IEnumerable<T> members) where T : IMember =>
        members.OrderBy(member => member.SortName ?? member.Name, StringComparer.OrdinalIgnoreCase)
            .ThenBy(member => member.Id);

    private static string? NormalizeName(string? name)
    {
        var normalized = name?.Trim();
        return string.IsNullOrWhiteSpace(normalized) ? null : normalized;
    }

    private static async Task<T> ExecuteMutationAsync<T>(
        DbContext db, string kind, Func<Task<MutationExecution<T>>> mutation, CancellationToken ct)
    {
        var operationId = Guid.NewGuid();
        var hasCompletedResult = false;
        T completedResult = default!;
        var strategy = db.Database.CreateExecutionStrategy();
        return await strategy.ExecuteAsync(async () =>
        {
            db.ChangeTracker.Clear();
            await using var transaction = db.Database.IsRelational() ? await db.Database.BeginTransactionAsync(ct) : null;
            if (transaction is not null)
                await db.Database.ExecuteSqlRawAsync($"SELECT pg_advisory_xact_lock({MutationAdvisoryLockId})", ct);

            var alreadyCommitted = await db.Set<SegmentStudioSegmentGroupOperation>().AsNoTracking()
                .AnyAsync(operation => operation.OperationId == operationId, ct);
            if (alreadyCommitted)
            {
                if (!hasCompletedResult)
                    throw new InvalidOperationException("A tag group operation receipt exists without its request result.");
                if (transaction is not null) await transaction.CommitAsync(ct);
                return completedResult;
            }

            var execution = await mutation();
            if (execution.Changed)
            {
                db.Add(new SegmentStudioSegmentGroupOperation { OperationId = operationId, Kind = kind, CreatedAt = DateTime.UtcNow });
                await db.SaveChangesAsync(ct);
                completedResult = execution.Result;
                hasCompletedResult = true;
            }
            if (transaction is not null) await transaction.CommitAsync(ct);
            return execution.Result;
        });
    }

    private interface IMember
    {
        int Id { get; }
        string Name { get; }
        string? SortName { get; }
    }

    private sealed record NativeMember(
        int GroupId, int Id, string Name, string? SortName, string GroupName, int GroupSortOrder) : IMember;

    private sealed record MutationExecution<T>(T Result, bool Changed);
    private static class MutationExecution
    {
        public static MutationExecution<T> Changed<T>(T result) => new(result, true);
        public static MutationExecution<T> Unchanged<T>(T result) => new(result, false);
    }
}
