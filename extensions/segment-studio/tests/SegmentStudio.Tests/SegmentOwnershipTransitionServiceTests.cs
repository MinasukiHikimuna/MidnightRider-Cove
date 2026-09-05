namespace SegmentStudio.Tests;

using System.IO.Compression;
using System.Text;
using System.Text.Json;
using Cove.Core.Auth;
using Cove.Core.Entities;
using Cove.Core.Interfaces;
using Microsoft.EntityFrameworkCore;
using Npgsql;

public sealed class SegmentOwnershipTransitionServiceTests
{
    [Fact]
    public void TrainingExportReusesOneFolderForRepeatedTagNames()
    {
        var method = typeof(IncorrectExampleService).GetMethod(
            "UniqueTagFolders",
            System.Reflection.BindingFlags.NonPublic
            | System.Reflection.BindingFlags.Static);

        Assert.NotNull(method);
        var folders = Assert.IsAssignableFrom<IReadOnlyList<string>>(
            method.Invoke(null, [new[] { "Example tag", "Example tag", "Example tag!" }]));

        Assert.Equal(
            ["Example tag", "Example tag", "Example tag-2"],
            folders);
    }

    [Fact]
    public async Task MovingNativeLineageSourceToBasicBinPrunesItsOwnedDerivations()
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        var now = fixture.UpdatedAt;
        var rootNode = new SegmentStudioLineageNode { Id = Guid.NewGuid(), ItemId = 500, State = "live", LastKnownVideoId = fixture.VideoId, CreatedAt = now, UpdatedAt = now };
        var childNode = new SegmentStudioLineageNode { Id = Guid.NewGuid(), ItemId = 501, State = "live", LastKnownVideoId = fixture.VideoId, CreatedAt = now, UpdatedAt = now };
        var rule = new SegmentStudioDerivationRule { Id = Guid.NewGuid(), Key = "rule", Version = "1", SourceTagId = 11, DerivedTagId = 11, MetadataJson = "{}", CreatedAt = now, UpdatedAt = now };
        fixture.Context.AddRange(
            new SegmentStudioItem { Id = 500, NativeSegmentId = fixture.SegmentId, CreatedAt = now, UpdatedAt = now },
            new SegmentStudioItem { Id = 501, VideoId = fixture.VideoId, TagId = 11, StartSec = 10, Kind = "tag", ReviewState = "unreviewed", Revision = 1, CreatedAt = now, UpdatedAt = now },
            rootNode, childNode, rule,
            new SegmentStudioDerivationEdge { SourceNodeId = rootNode.Id, DerivedNodeId = childNode.Id, RuleId = rule.Id, SourceTagIdAtCreation = 11, DerivedTagIdAtCreation = 11, MetadataJson = "{}", CreatedAt = now, UpdatedAt = now });
        await fixture.Context.SaveChangesAsync();
        fixture.Context.ChangeTracker.Clear();

        var moved = await SegmentOwnershipTransitionService.MoveNativeToOwnedAsync(
            fixture.Context, fixture.VideoId, fixture.SegmentId,
            new(Guid.NewGuid(), fixture.UpdatedAt), CovePrincipal.System(), fixture.Authorization, fixture.Blobs, CancellationToken.None);

        Assert.Equal(SegmentTransitionStatus.Updated, moved.Status);
        Assert.False(await fixture.Context.Set<Segment>().AnyAsync(
            segment => segment.Id == fixture.SegmentId));
        var archived = await fixture.Context.Set<SegmentStudioItem>().SingleAsync(item => item.Id == 500);
        Assert.Null(archived.NativeSegmentId);
        Assert.Equal("rejected", archived.ReviewState);
        Assert.False(await fixture.Context.Set<SegmentStudioItem>().AnyAsync(item => item.Id == 501));
        Assert.Empty(await fixture.Context.Set<SegmentStudioDerivationEdge>().ToListAsync());
        Assert.NotNull(await fixture.Context.Set<SegmentStudioLineageNode>()
            .SingleOrDefaultAsync(node => node.ItemId == 500));
    }

    [Fact]
    public async Task BulkNativeToOwnedTransitionRetainsDerivedSegmentsSupportedByAnotherNativeSource()
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        var now = fixture.UpdatedAt;
        var secondSegment = new Segment
        {
            Id = 102, HostType = SegmentHostType.Video, HostId = fixture.VideoId,
            StartSec = 10, EndSec = 12, TagId = 11, Kind = "tag",
            SourceKey = "user", CreatedAt = now, UpdatedAt = now,
        };
        var firstItem = new SegmentStudioItem
        {
            Id = 500, NativeSegmentId = fixture.SegmentId, CreatedAt = now, UpdatedAt = now,
        };
        var secondItem = new SegmentStudioItem
        {
            Id = 501, NativeSegmentId = secondSegment.Id, CreatedAt = now, UpdatedAt = now,
        };
        var sharedItem = new SegmentStudioItem
        {
            Id = 502, VideoId = fixture.VideoId, TagId = 12, StartSec = 10, EndSec = 12,
            Kind = "tag", ReviewState = "unreviewed", Revision = 1, CreatedAt = now, UpdatedAt = now,
        };
        var firstNode = new SegmentStudioLineageNode
        {
            Id = Guid.NewGuid(), ItemId = firstItem.Id, State = "live",
            LastKnownVideoId = fixture.VideoId, LastKnownTagId = 11,
            LastKnownStartSec = 10, LastKnownEndSec = 12, CreatedAt = now, UpdatedAt = now,
        };
        var secondNode = new SegmentStudioLineageNode
        {
            Id = Guid.NewGuid(), ItemId = secondItem.Id, State = "live",
            LastKnownVideoId = fixture.VideoId, LastKnownTagId = 11,
            LastKnownStartSec = 10, LastKnownEndSec = 12, CreatedAt = now, UpdatedAt = now,
        };
        var sharedNode = new SegmentStudioLineageNode
        {
            Id = Guid.NewGuid(), ItemId = sharedItem.Id, State = "live",
            LastKnownVideoId = fixture.VideoId, LastKnownTagId = 12,
            LastKnownStartSec = 10, LastKnownEndSec = 12, CreatedAt = now, UpdatedAt = now,
        };
        var rule = new SegmentStudioDerivationRule
        {
            Id = Guid.NewGuid(), Key = "shared", Version = "1",
            SourceTagId = 11, DerivedTagId = 12, MetadataJson = "{}",
            CreatedAt = now, UpdatedAt = now,
        };
        fixture.Context.AddRange(
            new Tag { Id = 12, Name = "Derived" },
            secondSegment, firstItem, secondItem, sharedItem,
            firstNode, secondNode, sharedNode, rule,
            new SegmentStudioDerivationEdge
            {
                SourceNodeId = firstNode.Id, DerivedNodeId = sharedNode.Id,
                RuleId = rule.Id, SourceTagIdAtCreation = 11, DerivedTagIdAtCreation = 12,
                MetadataJson = "{}", CreatedAt = now, UpdatedAt = now,
            },
            new SegmentStudioDerivationEdge
            {
                SourceNodeId = secondNode.Id, DerivedNodeId = sharedNode.Id,
                RuleId = rule.Id, SourceTagIdAtCreation = 11, DerivedTagIdAtCreation = 12,
                MetadataJson = "{}", CreatedAt = now, UpdatedAt = now,
            });
        await fixture.Context.SaveChangesAsync();
        fixture.Context.ChangeTracker.Clear();

        var moved = await SegmentOwnershipTransitionService.MoveManyNativeToOwnedAsync(
            fixture.Context,
            fixture.VideoId,
            new NativeToOwnedTransitionBatchRequest(
                Guid.NewGuid(),
                [new(fixture.SegmentId, fixture.UpdatedAt)]),
            CovePrincipal.System(),
            fixture.Authorization,
            fixture.Blobs,
            CancellationToken.None);

        Assert.Equal(SegmentTransitionStatus.Updated, moved.Status);
        Assert.True(await fixture.Context.Set<SegmentStudioItem>().AnyAsync(item => item.Id == sharedItem.Id));
        Assert.True(await fixture.Context.Set<Segment>().AnyAsync(segment => segment.Id == secondSegment.Id));
        var retainedEdge = Assert.Single(await fixture.Context.Set<SegmentStudioDerivationEdge>().ToListAsync());
        Assert.Equal(secondNode.Id, retainedEdge.SourceNodeId);
        Assert.Equal(sharedNode.Id, retainedEdge.DerivedNodeId);
    }

    [Fact]
    public async Task IncorrectExampleToggleIsDurableRejectsAndUnrejects()
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        var operationId = Guid.NewGuid();
        var collected = await IncorrectExampleService.ToggleAsync(
            fixture.Context, fixture.VideoId,
            new(operationId, fixture.SegmentId, null, fixture.UpdatedAt, null),
            CovePrincipal.System(), fixture.Authorization, fixture.Blobs, CancellationToken.None);

        Assert.Equal(SegmentTransitionStatus.Updated, collected.Status);
        Assert.True(collected.Collected);
        var item = await fixture.Context.Set<SegmentStudioItem>().SingleAsync();
        Assert.Equal("rejected", item.ReviewState);
        Assert.Equal("blob-1", item.ExtensionImageBlobId);
        var listed = await IncorrectExampleService.ListAsync(fixture.Context, fixture.VideoId, CancellationToken.None);
        Assert.Single(listed);
        Assert.Equal(item.Id, listed[0].ItemId);
        var deniedReplay = await IncorrectExampleService.ToggleAsync(
            fixture.Context, fixture.VideoId,
            new(operationId, fixture.SegmentId, null, fixture.UpdatedAt, null),
            CovePrincipal.System(), new DeniedAuthorization(), fixture.Blobs, CancellationToken.None);
        Assert.Equal(SegmentTransitionStatus.Forbidden, deniedReplay.Status);

        var removed = await IncorrectExampleService.ToggleAsync(
            fixture.Context, fixture.VideoId,
            new(Guid.NewGuid(), null, item.Id, null, item.Revision),
            CovePrincipal.System(), fixture.Authorization, fixture.Blobs, CancellationToken.None);

        Assert.Equal(SegmentTransitionStatus.Updated, removed.Status);
        Assert.False(removed.Collected);
        Assert.Empty(await IncorrectExampleService.ListAsync(fixture.Context, fixture.VideoId, CancellationToken.None));
        Assert.Equal("unreviewed", (await fixture.Context.Set<SegmentStudioItem>().SingleAsync()).ReviewState);
    }

    [Fact]
    public async Task IncorrectExampleSetOperationsNeverReverseStaleIntent()
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        var collected = await IncorrectExampleService.CollectAsync(
            fixture.Context, fixture.VideoId,
            new(Guid.NewGuid(), fixture.SegmentId, null, fixture.UpdatedAt, null),
            CovePrincipal.System(), fixture.Authorization, fixture.Blobs,
            CancellationToken.None);
        var repeatedCollect = await IncorrectExampleService.CollectAsync(
            fixture.Context, fixture.VideoId,
            new(Guid.NewGuid(), null, collected.ItemId, null, collected.Revision),
            CovePrincipal.System(), fixture.Authorization, fixture.Blobs,
            CancellationToken.None);

        Assert.NotNull(collected.EditorDelta);
        var collectedDelta = collected.EditorDelta!;
        Assert.Contains((long)fixture.SegmentId, collectedDelta.RemovedSegmentIds);
        var collectedSegment = Assert.Single(collectedDelta.UpsertedSegments);
        Assert.Equal(-collected.ItemId, collectedSegment.Id);
        Assert.Equal("rejected", collectedSegment.ReviewState);
        Assert.Equal(SegmentTransitionStatus.Updated, repeatedCollect.Status);
        Assert.True(repeatedCollect.Collected);
        var example = Assert.Single(await fixture.Context
            .Set<SegmentStudioIncorrectExample>().ToListAsync());
        var removed = await IncorrectExampleService.RemoveAsync(
            fixture.Context, fixture.VideoId, example.Id,
            new(Guid.NewGuid(), example.Revision, repeatedCollect.Revision!.Value),
            CovePrincipal.System(), fixture.Authorization, fixture.Blobs,
            CancellationToken.None);
        var repeatedRemove = await IncorrectExampleService.RemoveAsync(
            fixture.Context, fixture.VideoId, example.Id,
            new(Guid.NewGuid(), example.Revision, removed.Revision!.Value),
            CovePrincipal.System(), fixture.Authorization, fixture.Blobs,
            CancellationToken.None);

        Assert.Equal(SegmentTransitionStatus.Updated, removed.Status);
        Assert.False(removed.Collected);
        Assert.NotNull(removed.EditorDelta);
        var removedDelta = removed.EditorDelta!;
        Assert.Empty(removedDelta.RemovedSegmentIds);
        var restoredSegment = Assert.Single(removedDelta.UpsertedSegments);
        Assert.Equal(-collected.ItemId, restoredSegment.Id);
        Assert.Equal("unreviewed", restoredSegment.ReviewState);
        Assert.Equal(SegmentTransitionStatus.NotFound, repeatedRemove.Status);
        Assert.Empty(await fixture.Context.Set<SegmentStudioIncorrectExample>()
            .ToListAsync());
        Assert.Equal("unreviewed", (await fixture.Context
            .Set<SegmentStudioItem>().SingleAsync()).ReviewState);
    }

    [Fact]
    public async Task IncorrectExampleReplayRequiresEditorReload()
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        var operationId = Guid.NewGuid();
        var request = new ToggleIncorrectExampleRequest(
            operationId, fixture.SegmentId, null, fixture.UpdatedAt, null);
        var collected = await IncorrectExampleService.CollectAsync(
            fixture.Context, fixture.VideoId, request,
            CovePrincipal.System(), fixture.Authorization, fixture.Blobs,
            CancellationToken.None);
        var replay = await IncorrectExampleService.CollectAsync(
            fixture.Context, fixture.VideoId, request,
            CovePrincipal.System(), fixture.Authorization, fixture.Blobs,
            CancellationToken.None);

        Assert.Equal(SegmentTransitionStatus.Updated, collected.Status);
        Assert.Equal(SegmentTransitionStatus.Conflict, replay.Status);
        Assert.True(replay.Replayed);
        Assert.Equal("OPERATION_REPLAYED", replay.Code);
        Assert.Null(replay.EditorDelta);
    }

    [Fact]
    public async Task BasicIncorrectExampleDeltaHonorsProvenancePermission()
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        fixture.Context.Add(new FieldProvenance
        {
            HostType = AffinityHostType.Segment,
            HostId = fixture.SegmentId,
            FieldKey = "tag_id",
            ValueJson = "11",
            SourceKey = "producer/example",
            SourceRunId = "run-3",
            ModelKey = "model-7",
            CreatedAt = fixture.UpdatedAt,
            UpdatedAt = fixture.UpdatedAt,
        });
        await fixture.Context.SaveChangesAsync();
        var collected = await IncorrectExampleService.CollectAsync(
            fixture.Context, fixture.VideoId,
            new(Guid.NewGuid(), fixture.SegmentId, null, fixture.UpdatedAt, null),
            CovePrincipal.System(), fixture.Authorization, fixture.Blobs,
            CancellationToken.None, SegmentStudioModes.Basic);
        var example = await fixture.Context.Set<SegmentStudioIncorrectExample>()
            .SingleAsync();

        var removed = await IncorrectExampleService.RemoveAsync(
            fixture.Context, fixture.VideoId, example.Id,
            new(Guid.NewGuid(), example.Revision, collected.Revision!.Value),
            CovePrincipal.System(), new NoProvenanceAuthorization(), fixture.Blobs,
            CancellationToken.None);

        Assert.Equal(SegmentTransitionStatus.Updated, removed.Status);
        Assert.Empty(Assert.Single(
            removed.EditorDelta!.UpsertedBasicSegments!).FieldProvenance);
    }

    [Fact]
    public async Task IncorrectExampleCollectionCanRetryASelectedDescendantRejectedByItsParent()
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        var parent = new SegmentStudioItem
        {
            Id = 800,
            VideoId = fixture.VideoId,
            TagId = 11,
            StartSec = 12,
            EndSec = 14,
            Kind = "tag",
            ReviewState = "unreviewed",
            Revision = 1,
            CreatedAt = fixture.UpdatedAt,
            UpdatedAt = fixture.UpdatedAt,
        };
        var child = new SegmentStudioItem
        {
            Id = 801,
            VideoId = fixture.VideoId,
            TagId = 11,
            StartSec = 12,
            EndSec = 14,
            Kind = "tag",
            ReviewState = "unreviewed",
            Revision = 1,
            CreatedAt = fixture.UpdatedAt,
            UpdatedAt = fixture.UpdatedAt,
        };
        var parentNode = new SegmentStudioLineageNode
        {
            Id = Guid.NewGuid(),
            ItemId = parent.Id,
            State = "live",
            LastKnownVideoId = fixture.VideoId,
            CreatedAt = fixture.UpdatedAt,
            UpdatedAt = fixture.UpdatedAt,
        };
        var childNode = new SegmentStudioLineageNode
        {
            Id = Guid.NewGuid(),
            ItemId = child.Id,
            State = "live",
            LastKnownVideoId = fixture.VideoId,
            CreatedAt = fixture.UpdatedAt,
            UpdatedAt = fixture.UpdatedAt,
        };
        var rule = new SegmentStudioDerivationRule
        {
            Id = Guid.NewGuid(),
            Key = "feedback-retry",
            Version = "1",
            SourceTagId = 11,
            DerivedTagId = 11,
            MetadataJson = "{}",
            CreatedAt = fixture.UpdatedAt,
            UpdatedAt = fixture.UpdatedAt,
        };
        fixture.Context.AddRange(
            parent,
            child,
            parentNode,
            childNode,
            rule,
            new SegmentStudioDerivationEdge
            {
                SourceNodeId = parentNode.Id,
                DerivedNodeId = childNode.Id,
                RuleId = rule.Id,
                SourceTagIdAtCreation = 11,
                DerivedTagIdAtCreation = 11,
                MetadataJson = "{}",
                CreatedAt = fixture.UpdatedAt,
                UpdatedAt = fixture.UpdatedAt,
            },
            new SegmentStudioSegmentProvenance
            {
                LineageNodeId = parentNode.Id,
                SourceId = 1,
                Relation = "origin",
                MetadataJson = "{}",
                CreatedAt = fixture.UpdatedAt,
                UpdatedAt = fixture.UpdatedAt,
            },
            new SegmentStudioSegmentProvenance
            {
                LineageNodeId = childNode.Id,
                SourceId = 1,
                Relation = "inherited",
                MetadataJson = "{}",
                CreatedAt = fixture.UpdatedAt,
                UpdatedAt = fixture.UpdatedAt,
            });
        await fixture.Context.SaveChangesAsync();

        var parentResult = await IncorrectExampleService.CollectAsync(
            fixture.Context, fixture.VideoId,
            new(Guid.NewGuid(), null, parent.Id, null, parent.Revision),
            CovePrincipal.System(), fixture.Authorization, fixture.Blobs,
            CancellationToken.None);
        var staleChildResult = await IncorrectExampleService.CollectAsync(
            fixture.Context, fixture.VideoId,
            new(Guid.NewGuid(), null, child.Id, null, 1),
            CovePrincipal.System(), fixture.Authorization, fixture.Blobs,
            CancellationToken.None);
        var currentChild = await fixture.Context.Set<SegmentStudioItem>()
            .SingleAsync(item => item.Id == child.Id);
        var retryChildResult = await IncorrectExampleService.CollectAsync(
            fixture.Context, fixture.VideoId,
            new(Guid.NewGuid(), null, child.Id, null, currentChild.Revision),
            CovePrincipal.System(), fixture.Authorization, fixture.Blobs,
            CancellationToken.None);

        Assert.Equal(SegmentTransitionStatus.Updated, parentResult.Status);
        Assert.NotNull(parentResult.EditorDelta);
        Assert.Equal(
            new[] { parent.Id, child.Id },
            parentResult.EditorDelta!.UpsertedSegments
                .Select(segment => segment.ItemId!.Value)
                .OrderBy(id => id));
        Assert.All(
            parentResult.EditorDelta.UpsertedSegments,
            segment => Assert.Equal("rejected", segment.ReviewState));
        Assert.Equal(SegmentTransitionStatus.Conflict, staleChildResult.Status);
        Assert.Equal(SegmentTransitionStatus.Updated, retryChildResult.Status);
        Assert.Equal(2, await fixture.Context
            .Set<SegmentStudioIncorrectExample>().CountAsync());
    }

    [Fact]
    public async Task IncorrectExampleRequiresRegisteredAiProvenanceWithoutGuessingNames()
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        var segment = await fixture.Context.Set<Segment>().SingleAsync();
        segment.SourceKey = "manual";
        segment.Title = "Looks_AI";
        await fixture.Context.SaveChangesAsync();
        var result = await IncorrectExampleService.ToggleAsync(
            fixture.Context,
            fixture.VideoId,
            new(Guid.NewGuid(), segment.Id, null, segment.UpdatedAt, null),
            CovePrincipal.System(),
            fixture.Authorization,
            fixture.Blobs,
            CancellationToken.None);

        Assert.Equal(SegmentTransitionStatus.Invalid, result.Status);
        Assert.Equal("AI_PROVENANCE_REQUIRED", result.Code);
        Assert.Single(await fixture.Context.Set<Segment>().ToListAsync());
        Assert.Empty(await fixture.Context.Set<SegmentStudioIncorrectExample>().ToListAsync());
        Assert.Empty(await fixture.Context.Set<SegmentStudioNativeRecycleBinEntry>().ToListAsync());
        Assert.Empty(await fixture.Context.Set<SegmentStudioItem>().ToListAsync());
    }

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public async Task IncorrectExampleDoesNotRegisterAiEligibilityFromAnExtAiKey(
        bool registerAsManual)
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        var segment = await fixture.Context.Set<Segment>().SingleAsync();
        segment.SourceKey = "ext:ai.untrusted";
        segment.Payload = JsonDocument.Parse("""{"modelKey":"bodyparts"}""");
        if (registerAsManual)
        {
            fixture.Context.Add(new SegmentStudioSource
            {
                Id = 2,
                Key = segment.SourceKey,
                DisplayName = "Non-AI source",
                Category = "manual",
                MetadataJson = "{}",
                CreatedAt = fixture.UpdatedAt,
                UpdatedAt = fixture.UpdatedAt,
            });
        }
        await fixture.Context.SaveChangesAsync();

        var result = await IncorrectExampleService.ToggleAsync(
            fixture.Context,
            fixture.VideoId,
            new(Guid.NewGuid(), segment.Id, null, segment.UpdatedAt, null),
            CovePrincipal.System(),
            fixture.Authorization,
            fixture.Blobs,
            CancellationToken.None,
            SegmentStudioModes.Basic,
            fixture.NativeAiIngestion);

        Assert.Equal(SegmentTransitionStatus.Invalid, result.Status);
        Assert.Equal("AI_PROVENANCE_REQUIRED", result.Code);
        Assert.True(await fixture.Context.Set<Segment>()
            .AnyAsync(candidate => candidate.Id == segment.Id));
        Assert.False(await fixture.Context.Set<SegmentStudioIncorrectExample>()
            .AnyAsync());
        Assert.Equal(
            registerAsManual ? "manual" : null,
            await fixture.Context.Set<SegmentStudioSource>()
                .Where(source => source.Key == segment.SourceKey)
                .Select(source => source.Category)
                .SingleOrDefaultAsync());
    }

    [Fact]
    public async Task BasicIncorrectExampleRestoresNativeContentAndFieldProvenanceAtomically()
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        var provenanceCreatedAt = fixture.UpdatedAt.AddHours(-2);
        fixture.Context.Add(new FieldProvenance
        {
            HostType = AffinityHostType.Segment,
            HostId = fixture.SegmentId,
            FieldKey = "tag_id",
            ValueJson = "11",
            SourceKey = "producer/example",
            SourceRunId = "run-3",
            ModelKey = "model-7",
            Confidence = 0.82f,
            CreatedAt = provenanceCreatedAt,
            UpdatedAt = provenanceCreatedAt,
        });
        await fixture.Context.SaveChangesAsync();

        var collected = await IncorrectExampleService.ToggleAsync(
            fixture.Context,
            fixture.VideoId,
            new(Guid.NewGuid(), fixture.SegmentId, null, fixture.UpdatedAt, null),
            CovePrincipal.System(),
            fixture.Authorization,
            fixture.Blobs,
            CancellationToken.None,
            SegmentStudioModes.Basic);

        Assert.Equal(SegmentTransitionStatus.Updated, collected.Status);
        Assert.Equal("basicNativeBin", collected.Representation);
        Assert.Empty(await fixture.Context.Set<Segment>().ToListAsync());
        Assert.Empty(await fixture.Context.Set<SegmentStudioItem>().ToListAsync());
        var example = Assert.Single(await fixture.Context
            .Set<SegmentStudioIncorrectExample>().ToListAsync());
        var entry = Assert.Single(await fixture.Context
            .Set<SegmentStudioNativeRecycleBinEntry>().ToListAsync());
        Assert.Equal(entry.Id, example.NativeBinEntryId);
        Assert.Contains("model-7", example.SnapshotJson);
        var unprotectedUpdatedAt = fixture.UpdatedAt.AddMinutes(1);
        fixture.Context.Add(new Segment
        {
            Id = 102,
            HostType = SegmentHostType.Video,
            HostId = fixture.VideoId,
            StartSec = 20,
            EndSec = 22,
            TagId = 11,
            Kind = "tag",
            SourceKey = "manual",
            CreatedAt = unprotectedUpdatedAt,
            UpdatedAt = unprotectedUpdatedAt,
        });
        await fixture.Context.SaveChangesAsync();
        var movedUnprotected = await BasicNativeRecycleBinService.MoveAsync(
            fixture.Context,
            fixture.VideoId,
            102,
            new(Guid.NewGuid(), unprotectedUpdatedAt),
            CovePrincipal.System(),
            fixture.Authorization,
            fixture.Blobs,
            CancellationToken.None);
        Assert.Equal(SegmentTransitionStatus.Updated, movedUnprotected.Status);
        var transition = await SegmentStudioModeTransitionService.PreviewAsync(
            fixture.Context,
            SegmentStudioModes.Basic,
            SegmentStudioModes.Full,
            CovePrincipal.System(),
            fixture.Authorization,
            CancellationToken.None);
        Assert.Equal(1, transition.RecyclingBinCount);
        Assert.Equal(1, transition.ProtectedRecyclingBinCount);
        var modeSwitchEmpty = await BasicNativeRecycleBinService.EmptyAsync(
            fixture.Context,
            new(Guid.NewGuid(), transition.RecyclingBinFingerprint),
            CovePrincipal.System(),
            fixture.Authorization,
            CancellationToken.None,
            preserveIncorrectExamples: true);
        Assert.Equal(SegmentTransitionStatus.Updated, modeSwitchEmpty.Status);
        Assert.Equal(1, modeSwitchEmpty.DeletedCount);
        Assert.Equal(entry.Id, Assert.Single(await fixture.Context
            .Set<SegmentStudioNativeRecycleBinEntry>().ToListAsync()).Id);

        var ordinaryRestore = await BasicNativeRecycleBinService.RestoreAsync(
            fixture.Context,
            entry.Id,
            new(Guid.NewGuid(), entry.Revision),
            CovePrincipal.System(),
            fixture.Authorization,
            fixture.Blobs,
            CancellationToken.None);
        var ordinaryPurge = await BasicNativeRecycleBinService.PurgeAsync(
            fixture.Context,
            entry.Id,
            new(Guid.NewGuid(), entry.Revision),
            CovePrincipal.System(),
            fixture.Authorization,
            CancellationToken.None);
        var snapshot = await BasicNativeRecycleBinService.GetAsync(
            fixture.Context,
            null,
            CovePrincipal.System(),
            fixture.Authorization,
            CancellationToken.None);
        var ordinaryEmpty = await BasicNativeRecycleBinService.EmptyAsync(
            fixture.Context,
            new(Guid.NewGuid(), snapshot.Fingerprint),
            CovePrincipal.System(),
            fixture.Authorization,
            CancellationToken.None);
        Assert.Equal("INCORRECT_EXAMPLE_PROTECTED", ordinaryRestore.Code);
        Assert.Equal("INCORRECT_EXAMPLE_PROTECTED", ordinaryPurge.Code);
        Assert.Equal(SegmentTransitionStatus.Conflict, ordinaryEmpty.Status);

        var removed = await IncorrectExampleService.RemoveAsync(
            fixture.Context,
            fixture.VideoId,
            example.Id,
            new(Guid.NewGuid(), example.Revision, entry.Revision),
            CovePrincipal.System(),
            fixture.Authorization,
            fixture.Blobs,
            CancellationToken.None);

        Assert.Equal(SegmentTransitionStatus.Updated, removed.Status);
        Assert.Equal("native", removed.Representation);
        Assert.NotNull(removed.EditorDelta);
        var basicDelta = removed.EditorDelta;
        Assert.Empty(basicDelta.UpsertedSegments);
        Assert.NotNull(basicDelta.UpsertedBasicSegments);
        var restoredEditorSegment = Assert.Single(
            basicDelta.UpsertedBasicSegments);
        Assert.Equal("tag", restoredEditorSegment.Kind);
        Assert.Equal("42", restoredEditorSegment.RefId);
        Assert.Equal("""{"producer":7}""", restoredEditorSegment.PayloadJson);
        Assert.Equal("blob-1", restoredEditorSegment.ImageBlobId);
        Assert.Equal(fixture.UpdatedAt.AddDays(-1), restoredEditorSegment.CreatedAt);
        var editorProvenance = Assert.Single(
            restoredEditorSegment.FieldProvenance);
        Assert.Equal("tag_id", editorProvenance.FieldKey);
        Assert.Equal("11", editorProvenance.ValueJson);
        Assert.Equal("model-7", editorProvenance.ModelKey);
        Assert.Empty(await fixture.Context
            .Set<SegmentStudioIncorrectExample>().ToListAsync());
        Assert.Empty(await fixture.Context
            .Set<SegmentStudioNativeRecycleBinEntry>().ToListAsync());
        var restored = Assert.Single(await fixture.Context.Set<Segment>().ToListAsync());
        Assert.Equal(4.25, restored.StartSec);
        Assert.Equal(9.5, restored.EndSec);
        Assert.Equal(11, restored.TagId);
        Assert.Equal("""{"producer":7}""", restored.Payload!.RootElement.GetRawText());
        Assert.Equal("producer/example", restored.SourceKey);
        Assert.Equal("run-3", restored.SourceRunId);
        Assert.Equal(0.82f, restored.Confidence);
        Assert.Equal("blob-1", restored.ImageBlobId);
        Assert.Equal(fixture.UpdatedAt.AddDays(-1), restored.CreatedAt);
        var restoredProvenance = Assert.Single(
            await fixture.Context.Set<FieldProvenance>().ToListAsync());
        Assert.Equal(restored.Id, restoredProvenance.HostId);
        Assert.Equal("model-7", restoredProvenance.ModelKey);
        Assert.Equal(provenanceCreatedAt, restoredProvenance.CreatedAt);
    }

    [Fact]
    public async Task BasicNativeAiCollectionEnrichesTheExportManifestFromItsRun()
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        var segment = await fixture.Context.Set<Segment>().SingleAsync();
        segment.SourceKey = "ext:ai.tagging";
        segment.SourceRunId = "feedback-run";
        segment.Payload = JsonDocument.Parse(
            """{"modelKey":"bodyparts","observationCount":1}""");
        segment.Confidence = 0.91f;
        fixture.Context.AddRange(
            new SegmentStudioSource
            {
                Id = 2,
                Key = "ext:ai.tagging",
                DisplayName = "Cove AI Tagging",
                Category = "ai",
                Provider = "Cove",
                MetadataJson = "{}",
                CreatedAt = fixture.UpdatedAt,
                UpdatedAt = fixture.UpdatedAt,
            },
            new AiRun
            {
                RunKey = segment.SourceRunId,
                SourceKey = "ext:ai.core",
                TargetType = AiRunTargetType.Video,
                TargetId = fixture.VideoId,
                Status = AiRunStatus.Completed,
                Models = JsonDocument.Parse(
                    """[{"name":"body-model","identifier":401,"version":"1.0","categories":["bodyparts"]}]"""),
                StartedAt = fixture.UpdatedAt.AddMinutes(-2),
                CompletedAt = fixture.UpdatedAt.AddMinutes(-1),
                CreatedAt = fixture.UpdatedAt.AddMinutes(-2),
                UpdatedAt = fixture.UpdatedAt.AddMinutes(-1),
            });
        await fixture.Context.SaveChangesAsync();
        fixture.Context.ChangeTracker.Clear();

        var collected = await IncorrectExampleService.ToggleAsync(
            fixture.Context,
            fixture.VideoId,
            new(Guid.NewGuid(), segment.Id, null, segment.UpdatedAt, null),
            CovePrincipal.System(),
            fixture.Authorization,
            fixture.Blobs,
            CancellationToken.None,
            SegmentStudioModes.Basic,
            fixture.NativeAiIngestion);

        Assert.Equal(SegmentTransitionStatus.Updated, collected.Status);
        var example = await fixture.Context.Set<SegmentStudioIncorrectExample>()
            .SingleAsync();
        var entry = await fixture.Context.Set<SegmentStudioNativeRecycleBinEntry>()
            .SingleAsync();
        var timestamp = Assert.Single(
            IncorrectExampleService.FrameTimestamps(entry.StartSec, entry.EndSec));
        var captured = await IncorrectExampleService.CaptureExportAsync(
            fixture.Context,
            fixture.VideoId,
            null,
            new(
                Guid.NewGuid(),
                [
                    new(
                        example.Id,
                        example.Revision,
                        entry.Revision,
                        [new("frame-1", timestamp)]),
                ]),
            [new("frame-1", "image/jpeg", [0xff, 0xd8, 0xff, 0xd9])],
            fixture.Blobs,
            CancellationToken.None);
        var download = await IncorrectExampleService.BuildDownloadAsync(
            fixture.Context, captured.Id, fixture.Blobs, CancellationToken.None);

        Assert.NotNull(download);
        using var archive = new ZipArchive(
            new MemoryStream(download.Content), ZipArchiveMode.Read);
        using var reader = new StreamReader(
            archive.GetEntry("manifest.json")!.Open(), Encoding.UTF8);
        using var manifest = JsonDocument.Parse(await reader.ReadToEndAsync());
        var provenance = manifest.RootElement
            .GetProperty("examples")[0]
            .GetProperty("provenance")[0];
        Assert.Equal("origin", provenance.GetProperty("relation").GetString());
        Assert.Equal("feedback-run", provenance.GetProperty("run").GetString());
        Assert.Equal("bodyparts", provenance.GetProperty("modelKey").GetString());
        Assert.Equal("401", provenance.GetProperty("model").GetString());
        Assert.Equal("1.0", provenance.GetProperty("modelVersion").GetString());
        Assert.Equal(segment.CreatedAt, provenance.GetProperty("recordedAt").GetDateTime());
    }

    [Fact]
    public async Task NativeAiFallbackRemainsVisibleWhenActiveAssertionsAreNotAi()
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        var segment = await fixture.Context.Set<Segment>().SingleAsync();
        var item = new SegmentStudioItem
        {
            Id = 800,
            NativeSegmentId = segment.Id,
            Revision = 3,
            CreatedAt = fixture.UpdatedAt,
            UpdatedAt = fixture.UpdatedAt,
        };
        var node = new SegmentStudioLineageNode
        {
            Id = Guid.NewGuid(),
            ItemId = item.Id,
            State = "live",
            LastKnownVideoId = fixture.VideoId,
            LastKnownTagId = segment.TagId,
            LastKnownStartSec = segment.StartSec,
            LastKnownEndSec = segment.EndSec,
            CreatedAt = fixture.UpdatedAt,
            UpdatedAt = fixture.UpdatedAt,
        };
        var manualSource = new SegmentStudioSource
        {
            Id = 2,
            Key = "manual/example",
            DisplayName = "Manual example",
            Category = "manual",
            MetadataJson = "{}",
            CreatedAt = fixture.UpdatedAt,
            UpdatedAt = fixture.UpdatedAt,
        };
        fixture.Context.AddRange(
            item,
            node,
            manualSource,
            new SegmentStudioSegmentProvenance
            {
                LineageNodeId = node.Id,
                SourceId = manualSource.Id,
                Relation = "origin",
                MetadataJson = "{}",
                CreatedAt = fixture.UpdatedAt,
                UpdatedAt = fixture.UpdatedAt,
            });
        await fixture.Context.SaveChangesAsync();
        fixture.Context.ChangeTracker.Clear();

        var collected = await IncorrectExampleService.ToggleAsync(
            fixture.Context,
            fixture.VideoId,
            new(Guid.NewGuid(), segment.Id, null, segment.UpdatedAt, null),
            CovePrincipal.System(),
            fixture.Authorization,
            fixture.Blobs,
            CancellationToken.None,
            SegmentStudioModes.Basic);
        Assert.Equal(SegmentTransitionStatus.Updated, collected.Status);
        var example = await fixture.Context.Set<SegmentStudioIncorrectExample>()
            .SingleAsync();
        var entry = await fixture.Context.Set<SegmentStudioNativeRecycleBinEntry>()
            .SingleAsync();
        var timestamp = Assert.Single(
            IncorrectExampleService.FrameTimestamps(entry.StartSec, entry.EndSec));
        var captured = await IncorrectExampleService.CaptureExportAsync(
            fixture.Context,
            fixture.VideoId,
            null,
            new(
                Guid.NewGuid(),
                [
                    new(
                        example.Id,
                        example.Revision,
                        entry.Revision,
                        [new("frame-1", timestamp)]),
                ]),
            [new("frame-1", "image/jpeg", [0xff, 0xd8, 0xff, 0xd9])],
            fixture.Blobs,
            CancellationToken.None);
        var download = await IncorrectExampleService.BuildDownloadAsync(
            fixture.Context, captured.Id, fixture.Blobs, CancellationToken.None);

        Assert.NotNull(download);
        using var archive = new ZipArchive(
            new MemoryStream(download.Content), ZipArchiveMode.Read);
        using var reader = new StreamReader(
            archive.GetEntry("manifest.json")!.Open(), Encoding.UTF8);
        using var manifest = JsonDocument.Parse(await reader.ReadToEndAsync());
        var provenance = manifest.RootElement
            .GetProperty("examples")[0]
            .GetProperty("provenance");
        Assert.Contains(provenance.EnumerateArray(), assertion =>
            assertion.GetProperty("source").GetString() == "producer/example"
            && assertion.GetProperty("sourceCategory").GetString() == "ai"
            && assertion.GetProperty("relation").GetString() == "native");
    }

    [Fact]
    public async Task ExtensionOwnedInheritedAiExampleKeepsLineageThroughRejectAndUnreview()
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        var item = new SegmentStudioItem
        {
            Id = 800,
            VideoId = fixture.VideoId,
            StartSec = 12,
            EndSec = 18,
            TagId = 11,
            Kind = "tag",
            SourceKey = "derived/example",
            ReviewState = "unreviewed",
            Revision = 4,
            CreatedAt = fixture.UpdatedAt,
            UpdatedAt = fixture.UpdatedAt,
        };
        var node = new SegmentStudioLineageNode
        {
            Id = Guid.NewGuid(),
            ItemId = item.Id,
            State = "live",
            LastKnownVideoId = fixture.VideoId,
            LastKnownTagId = 11,
            LastKnownStartSec = 12,
            LastKnownEndSec = 18,
            CreatedAt = fixture.UpdatedAt,
            UpdatedAt = fixture.UpdatedAt,
        };
        var assertion = new SegmentStudioSegmentProvenance
        {
            LineageNodeId = node.Id,
            SourceId = 1,
            Relation = "inherited",
            ModelKey = "classifier",
            ModelIdentifier = "model/example",
            ModelVersion = "2",
            Confidence = 0.73f,
            RecordedAt = fixture.UpdatedAt,
            MetadataJson = "{}",
            CreatedAt = fixture.UpdatedAt,
            UpdatedAt = fixture.UpdatedAt,
        };
        fixture.Context.AddRange(item, node, assertion);
        await fixture.Context.SaveChangesAsync();

        var collected = await IncorrectExampleService.ToggleAsync(
            fixture.Context,
            fixture.VideoId,
            new(Guid.NewGuid(), null, item.Id, null, item.Revision),
            CovePrincipal.System(),
            fixture.Authorization,
            fixture.Blobs,
            CancellationToken.None);
        var removed = await IncorrectExampleService.ToggleAsync(
            fixture.Context,
            fixture.VideoId,
            new(Guid.NewGuid(), null, item.Id, null, collected.Revision),
            CovePrincipal.System(),
            fixture.Authorization,
            fixture.Blobs,
            CancellationToken.None);

        Assert.Equal(SegmentTransitionStatus.Updated, removed.Status);
        Assert.Equal("unreviewed", (await fixture.Context.Set<SegmentStudioItem>()
            .SingleAsync(candidate => candidate.Id == item.Id)).ReviewState);
        Assert.Equal(item.Id, (await fixture.Context.Set<SegmentStudioLineageNode>()
            .SingleAsync(candidate => candidate.Id == node.Id)).ItemId);
        var retained = await fixture.Context.Set<SegmentStudioSegmentProvenance>()
            .SingleAsync(candidate => candidate.Id == assertion.Id);
        Assert.Equal("inherited", retained.Relation);
        Assert.Null(retained.SupersededAt);
    }

    [Fact]
    public async Task BasicNativeExampleTemporarilyDetachesAndRestoresStableAiAnchor()
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        var segment = await fixture.Context.Set<Segment>().SingleAsync();
        segment.SourceKey = "manual";
        var item = new SegmentStudioItem
        {
            Id = 800,
            NativeSegmentId = segment.Id,
            RepresentationSchemaVersion = 2,
            Revision = 7,
            CreatedAt = fixture.UpdatedAt.AddDays(-3),
            UpdatedAt = fixture.UpdatedAt.AddDays(-2),
        };
        var node = new SegmentStudioLineageNode
        {
            Id = Guid.NewGuid(),
            ItemId = item.Id,
            State = "live",
            LastKnownVideoId = fixture.VideoId,
            LastKnownTagId = segment.TagId,
            LastKnownStartSec = segment.StartSec,
            LastKnownEndSec = segment.EndSec,
            CreatedAt = fixture.UpdatedAt.AddDays(-2),
            UpdatedAt = fixture.UpdatedAt.AddDays(-2),
        };
        var assertion = new SegmentStudioSegmentProvenance
        {
            LineageNodeId = node.Id,
            SourceId = 1,
            Relation = "inherited",
            ModelKey = "classifier",
            ModelIdentifier = "model/example",
            ModelVersion = "3",
            Confidence = 0.88f,
            RecordedAt = fixture.UpdatedAt,
            MetadataJson = """{"inherited":true}""",
            CreatedAt = fixture.UpdatedAt,
            UpdatedAt = fixture.UpdatedAt,
        };
        fixture.Context.AddRange(item, node, assertion);
        await fixture.Context.SaveChangesAsync();

        var collected = await IncorrectExampleService.ToggleAsync(
            fixture.Context,
            fixture.VideoId,
            new(Guid.NewGuid(), segment.Id, null, segment.UpdatedAt, null),
            CovePrincipal.System(),
            fixture.Authorization,
            fixture.Blobs,
            CancellationToken.None,
            SegmentStudioModes.Basic);

        Assert.Equal(SegmentTransitionStatus.Updated, collected.Status);
        Assert.Equal("basicNativeBin", collected.Representation);
        Assert.False(await fixture.Context.Set<SegmentStudioItem>().AnyAsync());
        var missingNode = await fixture.Context.Set<SegmentStudioLineageNode>()
            .SingleAsync(candidate => candidate.Id == node.Id);
        Assert.Equal("missing", missingNode.State);
        Assert.Null(missingNode.ItemId);
        Assert.NotNull(missingNode.MissingSince);
        var entry = await fixture.Context.Set<SegmentStudioNativeRecycleBinEntry>()
            .SingleAsync();
        Assert.Contains("\"ItemId\":800", entry.PreservedAnchorJson);
        var example = await fixture.Context.Set<SegmentStudioIncorrectExample>()
            .SingleAsync();
        Assert.Contains("model/example", example.SnapshotJson);
        var timestamps = IncorrectExampleService.FrameTimestamps(
            entry.StartSec, entry.EndSec);
        var captureFrames = timestamps.Select((timestamp, index) =>
            new TrainingExportCaptureFrame(
                $"linked-frame-{index + 1}", timestamp)).ToArray();
        var captured = await IncorrectExampleService.CaptureExportAsync(
            fixture.Context,
            fixture.VideoId,
            null,
            new(
                Guid.NewGuid(),
                [
                    new(
                        example.Id,
                        example.Revision,
                        entry.Revision,
                        captureFrames),
                ]),
            captureFrames.Select(frame => new TrainingFrameUpload(
                frame.FieldName,
                "image/jpeg",
                [0xff, 0xd8, 0xff, 0xd9])).ToArray(),
            fixture.Blobs,
            CancellationToken.None);
        Assert.Equal(timestamps.Count, captured.FrameCount);

        var removed = await IncorrectExampleService.RemoveAsync(
            fixture.Context,
            fixture.VideoId,
            example.Id,
            new(Guid.NewGuid(), example.Revision, entry.Revision),
            CovePrincipal.System(),
            fixture.Authorization,
            fixture.Blobs,
            CancellationToken.None);

        Assert.Equal(SegmentTransitionStatus.Updated, removed.Status);
        var restoredItem = await fixture.Context.Set<SegmentStudioItem>()
            .SingleAsync();
        Assert.Equal(item.Id, restoredItem.Id);
        Assert.Equal(2, restoredItem.RepresentationSchemaVersion);
        Assert.Equal(7, restoredItem.Revision);
        Assert.Equal(item.CreatedAt, restoredItem.CreatedAt);
        Assert.Equal(item.UpdatedAt, restoredItem.UpdatedAt);
        var restoredNode = await fixture.Context.Set<SegmentStudioLineageNode>()
            .SingleAsync(candidate => candidate.Id == node.Id);
        Assert.Equal("live", restoredNode.State);
        Assert.Equal(item.Id, restoredNode.ItemId);
        Assert.Null(restoredNode.MissingSince);
        var retainedAssertion = await fixture.Context
            .Set<SegmentStudioSegmentProvenance>()
            .SingleAsync(candidate => candidate.Id == assertion.Id);
        Assert.Equal("inherited", retainedAssertion.Relation);
        Assert.Null(retainedAssertion.SupersededAt);
    }

    [Fact]
    public async Task TrainingExportRetainsImmutableExampleSnapshot()
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        var collected = await IncorrectExampleService.ToggleAsync(
            fixture.Context, fixture.VideoId,
            new(Guid.NewGuid(), fixture.SegmentId, null, fixture.UpdatedAt, null),
            CovePrincipal.System(), fixture.Authorization, fixture.Blobs, CancellationToken.None);
        var frameField = "frame-1";
        var captured = await IncorrectExampleService.CaptureExportAsync(
            fixture.Context,
            fixture.VideoId,
            null,
            new(
                Guid.NewGuid(),
                [
                    new(
                        collected.ExampleId!.Value,
                        collected.ExampleRevision!.Value,
                        collected.Revision!.Value,
                        [new(frameField, 8.25)]),
                ]),
            [new(frameField, "image/jpeg", [0xff, 0xd8, 0xff, 0xd9])],
            fixture.Blobs,
            CancellationToken.None);
        Assert.Equal(1, captured.ExampleCount);
        var stored = await fixture.Context.Set<SegmentStudioTrainingExport>().SingleAsync();
        Assert.Contains("\"tagName\": \"Activity\"", stored.ManifestJson);
        Assert.DoesNotContain("Visible", stored.ManifestJson);
        Assert.DoesNotContain($"\"videoId\": {fixture.VideoId}", stored.ManifestJson);
        Assert.Equal(1, stored.ExampleCount);
        var exportedExample = Assert.Single(await fixture.Context
            .Set<SegmentStudioTrainingExportExample>().ToListAsync());
        Assert.Equal(collected.ExampleId, exportedExample.CapturedExampleId);
        Assert.Equal(collected.ItemId, exportedExample.ItemId);
        Assert.True(await fixture.Context.Set<SegmentStudioTrainingExportFrame>()
            .AnyAsync(row => row.ExportExampleId == exportedExample.Id
                && row.ImageBlobId == "export-blob-1"));
        var download = await IncorrectExampleService.BuildDownloadAsync(
            fixture.Context, stored.Id, fixture.Blobs, CancellationToken.None);
        Assert.NotNull(download);
        Assert.Equal(
            $"segment-studio-ai-feedback-{stored.CreatedAt:yyyyMMddTHHmmssZ}-{stored.Id:N}.zip",
            download.FileName);
        using (var archive = new ZipArchive(
                   new MemoryStream(download.Content), ZipArchiveMode.Read))
        {
            Assert.NotNull(archive.GetEntry("metadata.json"));
            Assert.NotNull(archive.GetEntry("manifest.json"));
            Assert.Contains(archive.Entries, entry =>
                entry.FullName.StartsWith("frames/Activity/", StringComparison.Ordinal)
                && entry.FullName.EndsWith(".jpg", StringComparison.Ordinal));
            using var reader = new StreamReader(
                archive.GetEntry("manifest.json")!.Open(), Encoding.UTF8);
            var manifest = await reader.ReadToEndAsync();
            Assert.DoesNotContain("Visible", manifest);
            Assert.DoesNotContain($"\"videoId\": {fixture.VideoId}", manifest);
            Assert.DoesNotContain($"\"itemId\": {collected.ItemId}", manifest);
        }
        var completed = await IncorrectExampleService.CompleteExportAsync(
            fixture.Context, stored.Id, CancellationToken.None);
        Assert.NotNull(completed);
        Assert.Equal(1, completed.ClearedExampleCount);
        Assert.Empty(await fixture.Context.Set<SegmentStudioIncorrectExample>().ToListAsync());
        var item = await fixture.Context.Set<SegmentStudioItem>().SingleAsync();
        Assert.Equal("rejected", item.ReviewState);
        var purge = await SegmentOwnershipTransitionService.PurgeAsync(
            fixture.Context, item.Id, new(Guid.NewGuid(), item.Revision),
            CovePrincipal.System(), fixture.Authorization, CancellationToken.None);
        Assert.Equal(SegmentTransitionStatus.Updated, purge.Status);
        Assert.False(await fixture.Context.Set<SegmentStudioItem>().AnyAsync());
        Assert.Equal("export-blob-1", (await fixture.Context
            .Set<SegmentStudioTrainingExportFrame>().SingleAsync()).ImageBlobId);
    }

    [Fact]
    public async Task TrainingExportCompletionReloadsStateAfterTakingTheLock()
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        var exportId = Guid.NewGuid();
        fixture.Context.Add(new SegmentStudioTrainingExport
        {
            Id = exportId,
            VideoId = fixture.VideoId,
            MetadataJson = "{}",
            ManifestJson = "{}",
            ExampleCount = 0,
            CreatedAt = fixture.UpdatedAt,
        });
        await fixture.Context.SaveChangesAsync();
        var tracked = await fixture.Context.Set<SegmentStudioTrainingExport>()
            .SingleAsync(row => row.Id == exportId);
        Assert.Null(tracked.CompletedAt);
        var completedAt = fixture.UpdatedAt.AddMinutes(1);
        await using (var sibling = fixture.CreateSiblingContext())
        {
            var completed = await sibling.Set<SegmentStudioTrainingExport>()
                .SingleAsync(row => row.Id == exportId);
            completed.CompletedAt = completedAt;
            await sibling.SaveChangesAsync();
        }

        var result = await IncorrectExampleService.CompleteExportAsync(
            fixture.Context, exportId, CancellationToken.None);

        Assert.NotNull(result);
        Assert.True(result.Replayed);
        Assert.Equal(0, result.ClearedExampleCount);
        Assert.Equal(completedAt, result.CompletedAt);
    }

    [Fact]
    public async Task LegacyExportManifestListsOnlyItsStoredFrame()
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        var exportId = Guid.NewGuid();
        fixture.Context.AddRange(
            new SegmentStudioTrainingExport
            {
                Id = exportId,
                VideoId = fixture.VideoId,
                MetadataJson = "{}",
                ManifestJson =
                    """
                    {
                      "examples": [
                        {
                          "tagName": "Activity",
                          "tagId": 11,
                          "startSec": 0,
                          "endSec": 200,
                          "sourceKey": "producer/example",
                          "sourceRunId": "run-3",
                          "confidence": 0.82,
                          "capturedAt": "2026-07-22T09:00:00Z"
                        }
                      ]
                    }
                    """,
                ExampleCount = 1,
                CreatedAt = fixture.UpdatedAt,
            },
            new SegmentStudioTrainingExportItem
            {
                ExportId = exportId,
                ItemId = 900,
                ImageBlobId = "legacy-frame",
            });
        await fixture.Context.SaveChangesAsync();

        var download = await IncorrectExampleService.BuildDownloadAsync(
            fixture.Context, exportId, fixture.Blobs, CancellationToken.None);

        Assert.NotNull(download);
        using var archive = new ZipArchive(
            new MemoryStream(download.Content), ZipArchiveMode.Read);
        Assert.Single(archive.Entries, entry =>
            entry.FullName.StartsWith("frames/", StringComparison.Ordinal));
        using var reader = new StreamReader(
            archive.GetEntry("manifest.json")!.Open(), Encoding.UTF8);
        using var manifest = JsonDocument.Parse(await reader.ReadToEndAsync());
        var timestamps = manifest.RootElement
            .GetProperty("examples")[0]
            .GetProperty("frameTimestamps");
        Assert.Equal(1, timestamps.GetArrayLength());
        Assert.Equal(4, timestamps[0].GetDouble());
    }

    [Fact]
    public async Task IncorrectExampleRejectsEmptyOperationId()
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        var result = await IncorrectExampleService.ToggleAsync(
            fixture.Context, fixture.VideoId,
            new(Guid.Empty, fixture.SegmentId, null, fixture.UpdatedAt, null),
            CovePrincipal.System(), fixture.Authorization, fixture.Blobs, CancellationToken.None);

        Assert.Equal(SegmentTransitionStatus.Invalid, result.Status);
        Assert.True(await fixture.Context.Set<Segment>().AnyAsync(row => row.Id == fixture.SegmentId));
    }

    [Fact]
    public async Task NativeToOwnedTransitionAndRestorePreserveCanonicalContentAndStableItem()
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        var moveOperationId = Guid.NewGuid();

        var moved = await SegmentOwnershipTransitionService.MoveNativeToOwnedAsync(
            fixture.Context, fixture.VideoId, fixture.SegmentId,
            new(moveOperationId, fixture.UpdatedAt), CovePrincipal.System(),
            fixture.Authorization, fixture.Blobs, CancellationToken.None);

        Assert.Equal(SegmentTransitionStatus.Updated, moved.Status);
        Assert.False(await fixture.Context.Set<Segment>().AnyAsync(segment => segment.Id == fixture.SegmentId));
        var rejected = await fixture.Context.Set<SegmentStudioItem>().SingleAsync();
        Assert.Equal("rejected", rejected.ReviewState);
        Assert.Null(rejected.NativeSegmentId);
        Assert.Equal(fixture.VideoId, rejected.VideoId);
        Assert.Equal(4.25, rejected.StartSec);
        Assert.Equal(9.5, rejected.EndSec);
        Assert.Equal(11, rejected.TagId);
        Assert.Equal("tag", rejected.Kind);
        Assert.Equal(42, rejected.RefId);
        Assert.Equal("producer/example", rejected.SourceKey);
        Assert.Equal("run-3", rejected.SourceRunId);
        Assert.Equal(0.82f, rejected.Confidence);
        Assert.Equal("Example", rejected.Title);
        Assert.Equal("purple", rejected.ColorHint);
        Assert.Equal("blob-1", rejected.ExtensionImageBlobId);
        Assert.Equal(7, rejected.PayloadJson is null ? -1 : JsonDocument.Parse(rejected.PayloadJson).RootElement.GetProperty("producer").GetInt32());

        var restored = await SegmentOwnershipTransitionService.RestoreAsync(
            fixture.Context, rejected.Id, new(Guid.NewGuid(), rejected.Revision),
            CovePrincipal.System(), fixture.Authorization, fixture.Blobs, CancellationToken.None);

        Assert.Equal(SegmentTransitionStatus.Updated, restored.Status);
        Assert.NotNull(restored.NativeSegmentId);
        Assert.NotEqual(fixture.SegmentId, restored.NativeSegmentId);
        var native = await fixture.Context.Set<Segment>().SingleAsync(segment => segment.Id == restored.NativeSegmentId);
        Assert.Equal("blob-1", native.ImageBlobId);
        Assert.Equal("producer/example", native.SourceKey);
        Assert.Equal(7, native.Payload!.RootElement.GetProperty("producer").GetInt32());
        var anchor = await fixture.Context.Set<SegmentStudioItem>().SingleAsync();
        Assert.Equal(restored.NativeSegmentId, anchor.NativeSegmentId);
        Assert.Null(anchor.ReviewState);
        Assert.Null(anchor.VideoId);
        Assert.Null(anchor.ExtensionImageBlobId);
    }

    [Fact]
    public async Task RepeatedMoveOperationReturnsReceiptWithoutDeletingAnythingElse()
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        var operationId = Guid.NewGuid();
        var request = new NativeToOwnedTransitionRequest(operationId, fixture.UpdatedAt);

        var first = await SegmentOwnershipTransitionService.MoveNativeToOwnedAsync(
            fixture.Context, fixture.VideoId, fixture.SegmentId, request,
            CovePrincipal.System(), fixture.Authorization, fixture.Blobs, CancellationToken.None);
        var retry = await SegmentOwnershipTransitionService.MoveNativeToOwnedAsync(
            fixture.Context, fixture.VideoId, fixture.SegmentId, request,
            CovePrincipal.System(), fixture.Authorization, fixture.Blobs, CancellationToken.None);

        Assert.Equal(SegmentTransitionStatus.Updated, retry.Status);
        Assert.Equal(first.ItemId, retry.ItemId);
        Assert.Single(await fixture.Context.Set<SegmentStudioItem>().ToListAsync());
        Assert.Single(await fixture.Context.Set<SegmentStudioSegmentOperation>().ToListAsync());
    }

    [Fact]
    public async Task ConcurrentRelationalMoveRetryReplaysReceiptAfterWaitingForSourceLock()
    {
        var connectionString = Environment.GetEnvironmentVariable("COVE__Postgres__ConnectionString")
            ?? Environment.GetEnvironmentVariable("DATABASE_URL");
        if (string.IsNullOrWhiteSpace(connectionString))
            return;

        var schema = $"segment_studio_test_{Guid.NewGuid():N}";
        var builder = new NpgsqlConnectionStringBuilder(connectionString) { SearchPath = schema };
        await using var admin = new NpgsqlConnection(connectionString);
        await admin.OpenAsync();
        await using (var createSchema = new NpgsqlCommand($"CREATE SCHEMA \"{schema}\"", admin))
            await createSchema.ExecuteNonQueryAsync();

        try
        {
            var options = new DbContextOptionsBuilder<TransitionDbContext>()
                .UseNpgsql(builder.ConnectionString).Options;
            await using (var setup = new TransitionDbContext(options))
            {
                await setup.Database.ExecuteSqlRawAsync(setup.Database.GenerateCreateScript());
                var updatedAt = new DateTime(2026, 7, 22, 9, 0, 0, DateTimeKind.Utc);
                setup.AddRange(
                    new SegmentStudioInstallationState { Id = 1, RequiresLegacyNormalization = false, UpdatedAt = updatedAt },
                    new Video { Id = 21, Title = "Visible" },
                    new Tag { Id = 11, Name = "Activity" },
                    new Segment
                    {
                        Id = 101, HostType = SegmentHostType.Video, HostId = 21,
                        StartSec = 4.25, EndSec = 9.5, TagId = 11, Kind = "tag",
                        SourceKey = "user", CreatedAt = updatedAt.AddDays(-1), UpdatedAt = updatedAt,
                    });
                await setup.SaveChangesAsync();
            }

            await using var firstContext = new TransitionDbContext(options);
            await using var retryContext = new TransitionDbContext(options);
            await using var firstTransaction = await firstContext.Database.BeginTransactionAsync();
            var operationId = Guid.NewGuid();
            var request = new NativeToOwnedTransitionRequest(operationId, new DateTime(2026, 7, 22, 9, 0, 0, DateTimeKind.Utc));
            var authorization = new RecordingAuthorization();
            var blobs = new FakeBlobService(exists: true);

            var first = await SegmentOwnershipTransitionService.MoveNativeToOwnedAsync(
                firstContext, 21, 101, request, CovePrincipal.System(),
                authorization, blobs, CancellationToken.None);
            Assert.Equal(SegmentTransitionStatus.Updated, first.Status);

            await using var retryTransaction = await retryContext.Database.BeginTransactionAsync();
            var retryTask = SegmentOwnershipTransitionService.MoveNativeToOwnedAsync(
                retryContext, 21, 101, request, CovePrincipal.System(),
                authorization, blobs, CancellationToken.None);
            await Task.Delay(100);
            Assert.False(retryTask.IsCompleted);

            await firstTransaction.CommitAsync();
            var retry = await retryTask.WaitAsync(TimeSpan.FromSeconds(5));
            await retryTransaction.CommitAsync();

            Assert.Equal(SegmentTransitionStatus.Updated, retry.Status);
            Assert.True(retry.Replayed);
            Assert.Equal(first.ItemId, retry.ItemId);

            await using var createContext = new TransitionDbContext(options);
            await using var createRetryContext = new TransitionDbContext(options);
            await using var createTransaction = await createContext.Database.BeginTransactionAsync();
            var createRequest = new CreateSegmentDraftRequest(Guid.NewGuid(), 11, 30, 31);
            var created = await SegmentStudioDraftService.CreateAsync(
                createContext, 21, createRequest, CovePrincipal.System(),
                authorization, CancellationToken.None);
            Assert.Equal(SegmentDraftMutationStatus.Updated, created.Status);

            await using var createRetryTransaction = await createRetryContext.Database.BeginTransactionAsync();
            var createRetryTask = SegmentStudioDraftService.CreateAsync(
                createRetryContext, 21, createRequest, CovePrincipal.System(),
                authorization, CancellationToken.None);
            await Task.Delay(100);
            Assert.False(createRetryTask.IsCompleted);

            await createTransaction.CommitAsync();
            var createRetry = await createRetryTask.WaitAsync(TimeSpan.FromSeconds(5));
            await createRetryTransaction.CommitAsync();
            Assert.True(createRetry.Replayed);
            Assert.Equal(created.Draft!.ItemId, createRetry.Draft!.ItemId);
        }
        finally
        {
            await using var dropSchema = new NpgsqlCommand($"DROP SCHEMA \"{schema}\" CASCADE", admin);
            await dropSchema.ExecuteNonQueryAsync();
        }
    }

    [Fact]
    public async Task ReplayedMoveStillRequiresDeleteAuthorization()
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        var request = new NativeToOwnedTransitionRequest(Guid.NewGuid(), fixture.UpdatedAt);
        await SegmentOwnershipTransitionService.MoveNativeToOwnedAsync(
            fixture.Context, fixture.VideoId, fixture.SegmentId, request,
            CovePrincipal.System(), fixture.Authorization, fixture.Blobs, CancellationToken.None);

        var denied = await SegmentOwnershipTransitionService.MoveNativeToOwnedAsync(
            fixture.Context, fixture.VideoId, fixture.SegmentId, request,
            CovePrincipal.System(), new DeniedAuthorization(), fixture.Blobs, CancellationToken.None);

        Assert.Equal(SegmentTransitionStatus.Forbidden, denied.Status);
    }

    [Fact]
    public async Task RepeatedRestoreAndPurgeOperationsReplayTheirReceipts()
    {
        await using var restoreFixture = await TransitionFixture.CreateAsync();
        var moved = await SegmentOwnershipTransitionService.MoveNativeToOwnedAsync(
            restoreFixture.Context, restoreFixture.VideoId, restoreFixture.SegmentId,
            new(Guid.NewGuid(), restoreFixture.UpdatedAt), CovePrincipal.System(),
            restoreFixture.Authorization, restoreFixture.Blobs, CancellationToken.None);
        var restoreRequest = new OwnedSegmentMutationRequest(Guid.NewGuid(), moved.Revision!.Value);
        var restored = await SegmentOwnershipTransitionService.RestoreAsync(
            restoreFixture.Context, moved.ItemId!.Value, restoreRequest,
            CovePrincipal.System(), restoreFixture.Authorization, restoreFixture.Blobs, CancellationToken.None);
        var restoreRetry = await SegmentOwnershipTransitionService.RestoreAsync(
            restoreFixture.Context, moved.ItemId.Value, restoreRequest,
            CovePrincipal.System(), restoreFixture.Authorization, restoreFixture.Blobs, CancellationToken.None);
        Assert.Equal(restored.NativeSegmentId, restoreRetry.NativeSegmentId);
        Assert.True(restoreRetry.Replayed);
        Assert.Single(await restoreFixture.Context.Set<Segment>().ToListAsync());

        await using var purgeFixture = await TransitionFixture.CreateAsync();
        var rejected = await SegmentOwnershipTransitionService.MoveNativeToOwnedAsync(
            purgeFixture.Context, purgeFixture.VideoId, purgeFixture.SegmentId,
            new(Guid.NewGuid(), purgeFixture.UpdatedAt), CovePrincipal.System(),
            purgeFixture.Authorization, purgeFixture.Blobs, CancellationToken.None);
        var purgeRequest = new OwnedSegmentMutationRequest(Guid.NewGuid(), rejected.Revision!.Value);
        await SegmentOwnershipTransitionService.PurgeAsync(
            purgeFixture.Context, rejected.ItemId!.Value, purgeRequest,
            CovePrincipal.System(), purgeFixture.Authorization, CancellationToken.None);
        var purgeRetry = await SegmentOwnershipTransitionService.PurgeAsync(
            purgeFixture.Context, rejected.ItemId.Value, purgeRequest,
            CovePrincipal.System(), purgeFixture.Authorization, CancellationToken.None);
        Assert.Equal(SegmentTransitionStatus.Updated, purgeRetry.Status);
        Assert.True(purgeRetry.Replayed);
        Assert.Empty(await purgeFixture.Context.Set<SegmentStudioItem>().ToListAsync());
    }

    [Fact]
    public async Task StaleMoveLeavesNativeSegmentUntouched()
    {
        await using var fixture = await TransitionFixture.CreateAsync();

        var result = await SegmentOwnershipTransitionService.MoveNativeToOwnedAsync(
            fixture.Context, fixture.VideoId, fixture.SegmentId,
            new(Guid.NewGuid(), fixture.UpdatedAt.AddSeconds(-1)), CovePrincipal.System(),
            fixture.Authorization, fixture.Blobs, CancellationToken.None);

        Assert.Equal(SegmentTransitionStatus.Conflict, result.Status);
        Assert.True(await fixture.Context.Set<Segment>().AnyAsync(segment => segment.Id == fixture.SegmentId));
        Assert.Empty(await fixture.Context.Set<SegmentStudioItem>().ToListAsync());
    }

    [Fact]
    public async Task MissingImageStopsMoveBeforeNativeDeletion()
    {
        await using var fixture = await TransitionFixture.CreateAsync(blobExists: false);

        var result = await SegmentOwnershipTransitionService.MoveNativeToOwnedAsync(
            fixture.Context, fixture.VideoId, fixture.SegmentId,
            new(Guid.NewGuid(), fixture.UpdatedAt), CovePrincipal.System(),
            fixture.Authorization, fixture.Blobs, CancellationToken.None);

        Assert.Equal(SegmentTransitionStatus.MissingImage, result.Status);
        Assert.True(await fixture.Context.Set<Segment>().AnyAsync(segment => segment.Id == fixture.SegmentId));
        Assert.Empty(await fixture.Context.Set<SegmentStudioItem>().ToListAsync());
    }

    [Fact]
    public async Task PurgeDeletesRejectedItemAndQueuesBlobCleanup()
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        var moved = await SegmentOwnershipTransitionService.MoveNativeToOwnedAsync(
            fixture.Context, fixture.VideoId, fixture.SegmentId,
            new(Guid.NewGuid(), fixture.UpdatedAt), CovePrincipal.System(),
            fixture.Authorization, fixture.Blobs, CancellationToken.None);

        var purged = await SegmentOwnershipTransitionService.PurgeAsync(
            fixture.Context, moved.ItemId!.Value, new(Guid.NewGuid(), moved.Revision!.Value),
            CovePrincipal.System(), fixture.Authorization, CancellationToken.None);

        Assert.Equal(SegmentTransitionStatus.Updated, purged.Status);
        Assert.Empty(await fixture.Context.Set<SegmentStudioItem>().ToListAsync());
        Assert.Equal("blob-1", (await fixture.Context.Set<SegmentStudioBlobCleanupOutbox>().SingleAsync()).BlobId);
    }

    [Fact]
    public async Task BinListingOmitsRejectedItemsFromInaccessibleVideos()
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        await SegmentOwnershipTransitionService.MoveNativeToOwnedAsync(
            fixture.Context, fixture.VideoId, fixture.SegmentId,
            new(Guid.NewGuid(), fixture.UpdatedAt), CovePrincipal.System(),
            fixture.Authorization, fixture.Blobs, CancellationToken.None);
        fixture.Context.AddRange(
            new Video { Id = 22, Title = "Hidden" },
            new SegmentStudioItem
            {
                ReviewState = "rejected", VideoId = 22, StartSec = 1, EndSec = 2,
                TagId = 11, Kind = "tag", SourceKey = "user", Revision = 1,
                CreatedAt = fixture.UpdatedAt, UpdatedAt = fixture.UpdatedAt,
            });
        await fixture.Context.SaveChangesAsync();

        var listed = await SegmentOwnershipTransitionService.ListRejectedAsync(
            fixture.Context, null, CovePrincipal.System(), new VideoVisibilityAuthorization(22), CancellationToken.None);

        Assert.Single(listed);
        Assert.Equal(fixture.VideoId, listed[0].VideoId);
    }

    [Fact]
    public async Task BinSnapshotHasStableFingerprintAndAtomicEmptyReplay()
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        await SegmentOwnershipTransitionService.MoveNativeToOwnedAsync(
            fixture.Context, fixture.VideoId, fixture.SegmentId,
            new(Guid.NewGuid(), fixture.UpdatedAt), CovePrincipal.System(),
            fixture.Authorization, fixture.Blobs, CancellationToken.None);
        var second = new SegmentStudioItem
        {
            ReviewState = "rejected", VideoId = fixture.VideoId, StartSec = 12, EndSec = 14,
            TagId = 11, Kind = "tag", SourceKey = "user", ExtensionImageBlobId = "blob-2",
            Revision = 2, CreatedAt = fixture.UpdatedAt, UpdatedAt = fixture.UpdatedAt,
        };
        fixture.Context.Add(second);
        await fixture.Context.SaveChangesAsync();

        var snapshot = await SegmentOwnershipTransitionService.GetBinAsync(
            fixture.Context, null, CovePrincipal.System(), fixture.Authorization, CancellationToken.None);
        var repeatedSnapshot = await SegmentOwnershipTransitionService.GetBinAsync(
            fixture.Context, null, CovePrincipal.System(), fixture.Authorization, CancellationToken.None);
        Assert.Equal(2, snapshot.TotalCount);
        Assert.Equal(snapshot.Fingerprint, repeatedSnapshot.Fingerprint);

        var operationId = Guid.NewGuid();
        var emptied = await SegmentOwnershipTransitionService.EmptyBinAsync(
            fixture.Context, new(operationId, snapshot.Fingerprint), CovePrincipal.System(),
            fixture.Authorization, CancellationToken.None);
        var replay = await SegmentOwnershipTransitionService.EmptyBinAsync(
            fixture.Context, new(operationId, snapshot.Fingerprint), CovePrincipal.System(),
            fixture.Authorization, CancellationToken.None);

        Assert.Equal(SegmentTransitionStatus.Updated, emptied.Status);
        Assert.Equal(2, emptied.DeletedCount);
        Assert.True(replay.Replayed);
        Assert.Empty(await fixture.Context.Set<SegmentStudioItem>().ToListAsync());
        Assert.Equal(2, await fixture.Context.Set<SegmentStudioBlobCleanupOutbox>().CountAsync());
    }

    [Fact]
    public async Task EmptyBinRejectsStaleFingerprintWithoutDeletingAnything()
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        await SegmentOwnershipTransitionService.MoveNativeToOwnedAsync(
            fixture.Context, fixture.VideoId, fixture.SegmentId,
            new(Guid.NewGuid(), fixture.UpdatedAt), CovePrincipal.System(),
            fixture.Authorization, fixture.Blobs, CancellationToken.None);
        var snapshot = await SegmentOwnershipTransitionService.GetBinAsync(
            fixture.Context, null, CovePrincipal.System(), fixture.Authorization, CancellationToken.None);
        var item = await fixture.Context.Set<SegmentStudioItem>().SingleAsync();
        item.Revision++;
        await fixture.Context.SaveChangesAsync();

        var result = await SegmentOwnershipTransitionService.EmptyBinAsync(
            fixture.Context, new(Guid.NewGuid(), snapshot.Fingerprint), CovePrincipal.System(),
            fixture.Authorization, CancellationToken.None);

        Assert.Equal(SegmentTransitionStatus.Conflict, result.Status);
        Assert.Single(await fixture.Context.Set<SegmentStudioItem>().ToListAsync());
    }

    [Fact]
    public async Task EmptyBinAuthorizationFailureDoesNotPartiallyDelete()
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        await SegmentOwnershipTransitionService.MoveNativeToOwnedAsync(
            fixture.Context, fixture.VideoId, fixture.SegmentId,
            new(Guid.NewGuid(), fixture.UpdatedAt), CovePrincipal.System(),
            fixture.Authorization, fixture.Blobs, CancellationToken.None);
        var snapshot = await SegmentOwnershipTransitionService.GetBinAsync(
            fixture.Context, null, CovePrincipal.System(), fixture.Authorization, CancellationToken.None);

        var result = await SegmentOwnershipTransitionService.EmptyBinAsync(
            fixture.Context, new(Guid.NewGuid(), snapshot.Fingerprint), CovePrincipal.System(),
            new DeleteDeniedAuthorization(), CancellationToken.None);

        Assert.Equal(SegmentTransitionStatus.Forbidden, result.Status);
        Assert.Single(await fixture.Context.Set<SegmentStudioItem>().ToListAsync());
        Assert.Empty(await fixture.Context.Set<SegmentStudioBlobCleanupOutbox>().ToListAsync());
    }

    [Fact]
    public async Task EmptyBinLeavesEveryItemWhenAnIncorrectExampleIsProtected()
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        var moved = await SegmentOwnershipTransitionService.MoveNativeToOwnedAsync(
            fixture.Context, fixture.VideoId, fixture.SegmentId,
            new(Guid.NewGuid(), fixture.UpdatedAt), CovePrincipal.System(),
            fixture.Authorization, fixture.Blobs, CancellationToken.None);
        fixture.Context.Add(new SegmentStudioIncorrectExample
        {
            ItemId = moved.ItemId!.Value,
            VideoId = fixture.VideoId,
            CreatedAt = fixture.UpdatedAt,
        });
        await fixture.Context.SaveChangesAsync();
        var snapshot = await SegmentOwnershipTransitionService.GetBinAsync(
            fixture.Context, null, CovePrincipal.System(), fixture.Authorization, CancellationToken.None);

        var result = await SegmentOwnershipTransitionService.EmptyBinAsync(
            fixture.Context, new(Guid.NewGuid(), snapshot.Fingerprint), CovePrincipal.System(),
            fixture.Authorization, CancellationToken.None);

        Assert.Equal(SegmentTransitionStatus.Conflict, result.Status);
        Assert.Single(await fixture.Context.Set<SegmentStudioItem>().ToListAsync());
        Assert.Single(await fixture.Context.Set<SegmentStudioIncorrectExample>().ToListAsync());
    }

    [Fact]
    public async Task BlobCleanupReclaimsStaleProcessingEntries()
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        fixture.Context.Add(new SegmentStudioBlobCleanupOutbox
        {
            BlobId = "stale-blob", Status = "processing", AttemptCount = 1,
            CreatedAt = fixture.UpdatedAt.AddHours(-1), UpdatedAt = DateTime.UtcNow.AddMinutes(-10),
        });
        await fixture.Context.SaveChangesAsync();

        var completed = await SegmentOwnershipTransitionService.ProcessPendingBlobCleanupAsync(
            fixture.Context, fixture.Blobs, 10, CancellationToken.None);

        Assert.Equal(1, completed);
        var entry = await fixture.Context.Set<SegmentStudioBlobCleanupOutbox>().SingleAsync();
        Assert.Equal("completed", entry.Status);
        Assert.Contains("stale-blob", fixture.Blobs.DeletedBlobIds);
    }

    [Fact]
    public async Task FailedBlobCleanupRemainsRetryable()
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        fixture.Context.Add(new SegmentStudioBlobCleanupOutbox
        {
            BlobId = "retry-blob",
            Status = "pending",
            CreatedAt = fixture.UpdatedAt,
            UpdatedAt = fixture.UpdatedAt,
        });
        await fixture.Context.SaveChangesAsync();
        var blobs = new FakeBlobService(true, failures: 1);

        Assert.Equal(0, await SegmentOwnershipTransitionService.ProcessPendingBlobCleanupAsync(
            fixture.Context, blobs, 10, CancellationToken.None));
        var failed = await fixture.Context.Set<SegmentStudioBlobCleanupOutbox>().SingleAsync();
        Assert.Equal("failed", failed.Status);
        Assert.Equal(1, failed.AttemptCount);

        Assert.Equal(1, await SegmentOwnershipTransitionService.ProcessPendingBlobCleanupAsync(
            fixture.Context, blobs, 10, CancellationToken.None));
        Assert.Equal("completed", failed.Status);
        Assert.Equal(2, failed.AttemptCount);
        Assert.Contains("retry-blob", blobs.DeletedBlobIds);
    }

    [Fact]
    public async Task InstallationNormalizationStateRequiresCompatibilityUi()
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        Assert.False(await SegmentStudioCompatibilityService.RequiresLegacyUiAsync(
            fixture.Context, CancellationToken.None));
        var state = await fixture.Context.Set<SegmentStudioInstallationState>().SingleAsync();
        state.RequiresLegacyNormalization = true;
        await fixture.Context.SaveChangesAsync();

        Assert.True(await SegmentStudioCompatibilityService.RequiresLegacyUiAsync(
            fixture.Context, CancellationToken.None));
    }

    [Fact]
    public async Task ManuallyCreatedDraftIsUnpublishedApprovedAndIdempotent()
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        var request = new CreateSegmentDraftRequest(Guid.NewGuid(), 11, 14.5, 20.0);

        var created = await SegmentStudioDraftService.CreateAsync(
            fixture.Context, fixture.VideoId, request, CovePrincipal.System(),
            fixture.Authorization, CancellationToken.None);
        var replay = await SegmentStudioDraftService.CreateAsync(
            fixture.Context, fixture.VideoId, request, CovePrincipal.System(),
            fixture.Authorization, CancellationToken.None);

        Assert.Equal(SegmentDraftMutationStatus.Updated, created.Status);
        Assert.NotNull(created.Draft);
        Assert.Equal("approved", created.Draft.ReviewState);
        Assert.False(created.Draft.Published);
        Assert.Null(created.Draft.NativeSegmentId);
        Assert.True(replay.Replayed);
        Assert.Equal(created.Draft.ItemId, replay.Draft!.ItemId);
    }

    [Fact]
    public async Task EditingApprovedDraftTimingPreservesApprovalAndOwnedMetadata()
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        var created = await SegmentStudioDraftService.CreateAsync(
            fixture.Context, fixture.VideoId,
            new(Guid.NewGuid(), 11, 14.5, 20.0), CovePrincipal.System(),
            fixture.Authorization, CancellationToken.None);
        var item = await fixture.Context.Set<SegmentStudioItem>().SingleAsync(candidate => candidate.Id == created.Draft!.ItemId);
        item.ReviewState = "approved";
        item.PayloadJson = "{\"producer\":7}";
        item.Title = "Owned title";
        item.ExtensionImageBlobId = "owned-image";
        await fixture.Context.SaveChangesAsync();
        fixture.Context.ChangeTracker.Clear();

        var edited = await SegmentStudioDraftService.UpdateAsync(
            fixture.Context, fixture.VideoId, item.Id,
            new(Guid.NewGuid(), item.Revision, 16, 21, 11), CovePrincipal.System(),
            fixture.Authorization, CancellationToken.None);

        Assert.Equal(SegmentDraftMutationStatus.Updated, edited.Status);
        Assert.Equal("approved", edited.Draft!.ReviewState);
        var saved = await fixture.Context.Set<SegmentStudioItem>().SingleAsync(candidate => candidate.Id == item.Id);
        Assert.Equal("{\"producer\":7}", saved.PayloadJson);
        Assert.Equal("Owned title", saved.Title);
        Assert.Equal("owned-image", saved.ExtensionImageBlobId);
    }

    [Fact]
    public async Task NoOpDraftEditDoesNotResetApprovalOrAdvanceRevision()
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        var created = await SegmentStudioDraftService.CreateAsync(
            fixture.Context, fixture.VideoId,
            new(Guid.NewGuid(), 11, 14.5, 20.0), CovePrincipal.System(),
            fixture.Authorization, CancellationToken.None);
        var item = await fixture.Context.Set<SegmentStudioItem>().SingleAsync(candidate => candidate.Id == created.Draft!.ItemId);
        item.ReviewState = "approved";
        await fixture.Context.SaveChangesAsync();
        fixture.Context.ChangeTracker.Clear();

        var edited = await SegmentStudioDraftService.UpdateAsync(
            fixture.Context, fixture.VideoId, item.Id,
            new(Guid.NewGuid(), item.Revision, 14.5, 20.0, 11), CovePrincipal.System(),
            fixture.Authorization, CancellationToken.None);

        Assert.Equal("approved", edited.Draft!.ReviewState);
        Assert.Equal(item.Revision, edited.Draft.Revision);
    }

    [Fact]
    public async Task TimingEditCanRetainApprovedStateExplicitly()
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        var created = await SegmentStudioDraftService.CreateAsync(
            fixture.Context, fixture.VideoId,
            new(Guid.NewGuid(), 11, 14.5, 20.0), CovePrincipal.System(),
            fixture.Authorization, CancellationToken.None);
        var item = await fixture.Context.Set<SegmentStudioItem>()
            .SingleAsync(candidate => candidate.Id == created.Draft!.ItemId);
        item.ReviewState = "approved";
        await fixture.Context.SaveChangesAsync();
        fixture.Context.ChangeTracker.Clear();

        var edited = await SegmentStudioDraftService.UpdateAsync(
            fixture.Context, fixture.VideoId, item.Id,
            new(Guid.NewGuid(), item.Revision, 15, 20.0, 11, "approved"),
            CovePrincipal.System(), fixture.Authorization, CancellationToken.None);

        Assert.Equal("approved", edited.Draft!.ReviewState);
        Assert.Equal(item.Revision + 1, edited.Draft.Revision);
    }

    [Theory]
    [InlineData("unreviewed")]
    [InlineData("approved")]
    [InlineData("rejected")]
    public async Task TagEditPreservesReviewState(string reviewState)
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        fixture.Context.Add(new Tag { Id = 12, Name = "Other activity" });
        await fixture.Context.SaveChangesAsync();
        var created = await SegmentStudioDraftService.CreateAsync(
            fixture.Context, fixture.VideoId,
            new(Guid.NewGuid(), 11, 14.5, 20.0), CovePrincipal.System(),
            fixture.Authorization, CancellationToken.None);
        var item = await fixture.Context.Set<SegmentStudioItem>()
            .SingleAsync(candidate => candidate.Id == created.Draft!.ItemId);
        item.ReviewState = reviewState;
        await fixture.Context.SaveChangesAsync();
        fixture.Context.ChangeTracker.Clear();

        var edited = await SegmentStudioDraftService.UpdateAsync(
            fixture.Context, fixture.VideoId, item.Id,
            new(Guid.NewGuid(), item.Revision, 14.5, 20.0, 12),
            CovePrincipal.System(), fixture.Authorization, CancellationToken.None);

        Assert.Equal(reviewState, edited.Draft!.ReviewState);
        Assert.Equal(12, edited.Draft.TagId);
    }

    [Fact]
    public async Task TagEditReusesPerformersInMatchingSlots()
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        var sourceSetId = Guid.NewGuid();
        var targetSetId = Guid.NewGuid();
        var sourceGiverId = Guid.NewGuid();
        var sourceReceiverId = Guid.NewGuid();
        var targetGiverId = Guid.NewGuid();
        var targetReceiverId = Guid.NewGuid();
        fixture.Context.AddRange(
            new Tag { Id = 12, Name = "Similar activity" },
            new Performer { Id = 17, Name = "First" },
            new Performer { Id = 23, Name = "Second" },
            new SegmentStudioSlotDefinitionSet { Id = sourceSetId, TagId = 11, CreatedAt = fixture.UpdatedAt },
            new SegmentStudioSlotDefinitionSet { Id = targetSetId, TagId = 12, CreatedAt = fixture.UpdatedAt },
            new SegmentStudioSlotDefinition
                { Id = sourceGiverId, SlotDefinitionSetId = sourceSetId, Label = "Giver", SortOrder = 0, CreatedAt = fixture.UpdatedAt },
            new SegmentStudioSlotDefinition
                { Id = sourceReceiverId, SlotDefinitionSetId = sourceSetId, Label = "Receiver", SortOrder = 1, CreatedAt = fixture.UpdatedAt },
            new SegmentStudioSlotDefinition
                { Id = targetGiverId, SlotDefinitionSetId = targetSetId, Label = "Giver", SortOrder = 0, CreatedAt = fixture.UpdatedAt },
            new SegmentStudioSlotDefinition
                { Id = targetReceiverId, SlotDefinitionSetId = targetSetId, Label = "Receiver", SortOrder = 1, CreatedAt = fixture.UpdatedAt });
        await fixture.Context.SaveChangesAsync();
        var created = await SegmentStudioDraftService.CreateAsync(
            fixture.Context, fixture.VideoId,
            new(Guid.NewGuid(), 11, 14.5, 20.0), CovePrincipal.System(),
            fixture.Authorization, CancellationToken.None);
        fixture.Context.AddRange(
            new SegmentStudioSegmentSlot
                { ItemId = created.Draft!.ItemId, SlotDefinitionId = sourceGiverId, PerformerId = 17, CreatedAt = fixture.UpdatedAt },
            new SegmentStudioSegmentSlot
                { ItemId = created.Draft.ItemId, SlotDefinitionId = sourceReceiverId, PerformerId = 23, CreatedAt = fixture.UpdatedAt });
        await fixture.Context.SaveChangesAsync();
        fixture.Context.ChangeTracker.Clear();

        var edited = await SegmentStudioDraftService.UpdateAsync(
            fixture.Context, fixture.VideoId, created.Draft.ItemId,
            new(Guid.NewGuid(), created.Draft.Revision, 14.5, 20.0, 12),
            CovePrincipal.System(), fixture.Authorization, CancellationToken.None);

        Assert.Equal(SegmentDraftMutationStatus.Updated, edited.Status);
        Assert.Equal("approved", edited.Draft!.ReviewState);
        var slots = await fixture.Context.Set<SegmentStudioSegmentSlot>()
            .Where(slot => slot.ItemId == created.Draft.ItemId)
            .OrderBy(slot => slot.SlotDefinitionId)
            .ToDictionaryAsync(slot => slot.SlotDefinitionId, slot => slot.PerformerId);
        Assert.Equal(17, slots[targetGiverId]);
        Assert.Equal(23, slots[targetReceiverId]);
        Assert.DoesNotContain(sourceGiverId, slots.Keys);
        Assert.DoesNotContain(sourceReceiverId, slots.Keys);
    }

    [Fact]
    public async Task ReviewDecisionUpdatesOwnedDraftWithoutPublishingIt()
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        var created = await SegmentStudioDraftService.CreateAsync(
            fixture.Context, fixture.VideoId,
            new(Guid.NewGuid(), 11, 14.5, 20.0), CovePrincipal.System(),
            fixture.Authorization, CancellationToken.None);

        var operationId = Guid.NewGuid();
        var approved = await SegmentStudioDraftService.UpdateAsync(
            fixture.Context, fixture.VideoId, created.Draft!.ItemId,
            new(operationId, created.Draft.Revision, 14.5, 20.0, 11, "approved"),
            CovePrincipal.System(), fixture.Authorization, CancellationToken.None);
        var replay = await SegmentStudioDraftService.UpdateAsync(
            fixture.Context, fixture.VideoId, created.Draft.ItemId,
            new(operationId, created.Draft.Revision, 14.5, 20.0, 11, "approved"),
            CovePrincipal.System(), fixture.Authorization, CancellationToken.None);

        Assert.Equal(SegmentDraftMutationStatus.Updated, approved.Status);
        Assert.Equal("approved", approved.Draft!.ReviewState);
        Assert.False(approved.Draft.Published);
        Assert.Null(approved.Draft.NativeSegmentId);
        Assert.NotNull(approved.ApprovedSetVersion);
        Assert.True(replay.Replayed);
        Assert.Equal(approved.ApprovedSetVersion, replay.ApprovedSetVersion);
        Assert.False(await fixture.Context.Set<Segment>().AnyAsync(segment => segment.StartSec == 14.5));
    }

    [Fact]
    public async Task StaleDraftEditDoesNotChangeOwnedRepresentation()
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        var created = await SegmentStudioDraftService.CreateAsync(
            fixture.Context, fixture.VideoId,
            new(Guid.NewGuid(), 11, 14.5, 20.0), CovePrincipal.System(),
            fixture.Authorization, CancellationToken.None);

        var stale = await SegmentStudioDraftService.UpdateAsync(
            fixture.Context, fixture.VideoId, created.Draft!.ItemId,
            new(Guid.NewGuid(), created.Draft.Revision - 1, 30, 31, 11), CovePrincipal.System(),
            fixture.Authorization, CancellationToken.None);

        Assert.Equal(SegmentDraftMutationStatus.Conflict, stale.Status);
        Assert.Equal(14.5, stale.Draft!.StartSec);
    }

    [Theory]
    [InlineData("unreviewed")]
    [InlineData("approved")]
    [InlineData("rejected")]
    public async Task ManualSplitPreservesReviewStateOnBothRanges(string reviewState)
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        var created = await SegmentStudioDraftService.CreateAsync(
            fixture.Context, fixture.VideoId,
            new(Guid.NewGuid(), 11, 14, 22), CovePrincipal.System(),
            fixture.Authorization, CancellationToken.None);
        var source = await fixture.Context.Set<SegmentStudioItem>().SingleAsync(candidate => candidate.Id == created.Draft!.ItemId);
        source.ReviewState = reviewState;
        source.PayloadJson = "{\"unknown\":true}";
        source.Title = "Copied";
        source.ExtensionImageBlobId = "split-image";
        var slotDefinitionId = Guid.NewGuid();
        fixture.Context.Add(new SegmentStudioSegmentSlot
        {
            ItemId = source.Id,
            SlotDefinitionId = slotDefinitionId,
            PerformerId = 17,
            CreatedAt = fixture.UpdatedAt,
        });
        await fixture.Context.SaveChangesAsync();
        fixture.Context.ChangeTracker.Clear();

        var split = await SegmentStudioDraftService.SplitAsync(
            fixture.Context, fixture.VideoId, source.Id,
            new(Guid.NewGuid(), source.Revision, 18), CovePrincipal.System(),
            fixture.Authorization, CancellationToken.None);

        Assert.Equal(SegmentDraftMutationStatus.Updated, split.Status);
        Assert.Equal(source.Id, split.Draft!.ItemId);
        Assert.Equal((14, 18), (split.Draft.StartSec, split.Draft.EndSec));
        Assert.Equal((18, 22), (split.CreatedDraft!.StartSec, split.CreatedDraft.EndSec));
        Assert.Equal(reviewState, split.Draft.ReviewState);
        Assert.Equal(reviewState, split.CreatedDraft.ReviewState);
        var rows = await fixture.Context.Set<SegmentStudioItem>().Where(item => item.VideoId == fixture.VideoId).OrderBy(item => item.StartSec).ToListAsync();
        Assert.Equal("{\"unknown\":true}", rows[1].PayloadJson);
        Assert.Equal("Copied", rows[1].Title);
        Assert.Null(rows[1].ExtensionImageBlobId);
        Assert.Equal("split-image", rows[0].ExtensionImageBlobId);
        var slots = await fixture.Context.Set<SegmentStudioSegmentSlot>().OrderBy(slot => slot.ItemId).ToListAsync();
        Assert.Equal(2, slots.Count);
        Assert.All(slots, slot =>
        {
            Assert.Equal(slotDefinitionId, slot.SlotDefinitionId);
            Assert.Equal(17, slot.PerformerId);
        });
        Assert.Equal(rows.Select(row => row.Id), slots.Select(slot => slot.ItemId));
    }

    [Fact]
    public async Task ManualDuplicateCreatesDistinctApprovedItemWithoutChangingSourceDecision()
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        var created = await SegmentStudioDraftService.CreateAsync(
            fixture.Context, fixture.VideoId,
            new(Guid.NewGuid(), 11, 14, 22), CovePrincipal.System(),
            fixture.Authorization, CancellationToken.None);
        var source = await fixture.Context.Set<SegmentStudioItem>().SingleAsync(candidate => candidate.Id == created.Draft!.ItemId);
        source.ReviewState = "approved";
        source.PayloadJson = "{\"unknown\":true}";
        source.ExtensionImageBlobId = "duplicate-image";
        var slotDefinitionId = Guid.NewGuid();
        fixture.Context.Add(new SegmentStudioSegmentSlot
        {
            ItemId = source.Id,
            SlotDefinitionId = slotDefinitionId,
            PerformerId = 23,
            CreatedAt = fixture.UpdatedAt,
        });
        await fixture.Context.SaveChangesAsync();
        fixture.Context.ChangeTracker.Clear();

        var nodes = new LineageNodeService();
        var provenance = new SegmentProvenanceService();
        var sourceDefinition = await new SegmentSourceRegistry().RegisterAsync(
            fixture.Context,
            new SegmentSourceRegistration(
                "stash-marker-studio", "Stash Marker Studio", "migration", "Stash",
                null, null, "{}"),
            CancellationToken.None);
        var sourceNode = await nodes.EnsureAsync(fixture.Context, source.Id, CancellationToken.None);
        await provenance.AppendAsync(
            fixture.Context,
            new SegmentProvenanceAppend(
                sourceNode.Id, sourceDefinition.Id, "origin", null, null, null, null,
                0.91f, fixture.UpdatedAt, """{"classification":"ai"}"""),
            CancellationToken.None);
        var duplicateProvenance = new SegmentDuplicationProvenanceService(nodes, provenance);

        var request = new DuplicateSegmentDraftRequest(Guid.NewGuid(), source.Revision, 30);
        var duplicated = await SegmentStudioDraftService.DuplicateAsync(
            fixture.Context, fixture.VideoId, source.Id, request,
            CovePrincipal.System(), fixture.Authorization, duplicateProvenance,
            CancellationToken.None);
        var installationState = await fixture.Context.Set<SegmentStudioInstallationState>()
            .SingleAsync(candidate => candidate.Id == 1);
        installationState.LineageRolloutPaused = true;
        await fixture.Context.SaveChangesAsync();
        var replay = await SegmentStudioDraftService.DuplicateAsync(
            fixture.Context, fixture.VideoId, source.Id, request,
            CovePrincipal.System(), fixture.Authorization, duplicateProvenance,
            CancellationToken.None);

        Assert.Equal(SegmentDraftMutationStatus.Updated, duplicated.Status);
        Assert.NotEqual(source.Id, duplicated.CreatedDraft!.ItemId);
        Assert.Equal("approved", duplicated.CreatedDraft.ReviewState);
        Assert.Equal((30, 38), (duplicated.CreatedDraft.StartSec, duplicated.CreatedDraft.EndSec));
        Assert.True(replay.Replayed);
        var savedSource = await fixture.Context.Set<SegmentStudioItem>().SingleAsync(item => item.Id == source.Id);
        var savedDuplicate = await fixture.Context.Set<SegmentStudioItem>().SingleAsync(item => item.Id == duplicated.CreatedDraft.ItemId);
        Assert.Equal("approved", savedSource.ReviewState);
        Assert.Equal("{\"unknown\":true}", savedDuplicate.PayloadJson);
        Assert.Null(savedDuplicate.ExtensionImageBlobId);
        Assert.Equal("duplicate-image", savedSource.ExtensionImageBlobId);
        var slots = await fixture.Context.Set<SegmentStudioSegmentSlot>().OrderBy(slot => slot.ItemId).ToListAsync();
        Assert.Equal(2, slots.Count);
        Assert.All(slots, slot =>
        {
            Assert.Equal(slotDefinitionId, slot.SlotDefinitionId);
            Assert.Equal(23, slot.PerformerId);
        });
        Assert.Equal(new[] { savedSource.Id, savedDuplicate.Id }.Order(), slots.Select(slot => slot.ItemId));
        var copiedProvenance = await provenance.GetForItemAsync(
            fixture.Context, savedDuplicate.Id, CancellationToken.None);
        var copied = Assert.Single(copiedProvenance);
        Assert.Equal("stash-marker-studio", copied.SourceKey);
        Assert.Equal("origin", copied.Relation);
        Assert.Equal(0.91f, copied.Confidence);
        Assert.Equal("""{"classification":"ai"}""", copied.MetadataJson);
    }

    [Fact]
    public async Task ManualDuplicateDoesNotCreateAnItemWhileLineageWritesArePaused()
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        var created = await SegmentStudioDraftService.CreateAsync(
            fixture.Context, fixture.VideoId,
            new(Guid.NewGuid(), 11, 14, 22), CovePrincipal.System(),
            fixture.Authorization, CancellationToken.None);
        var source = await fixture.Context.Set<SegmentStudioItem>()
            .SingleAsync(candidate => candidate.Id == created.Draft!.ItemId);
        var state = await fixture.Context.Set<SegmentStudioInstallationState>()
            .SingleAsync(candidate => candidate.Id == 1);
        state.LineageRolloutPaused = true;
        await fixture.Context.SaveChangesAsync();
        var itemCount = await fixture.Context.Set<SegmentStudioItem>().CountAsync();

        var result = await SegmentStudioDraftService.DuplicateAsync(
                fixture.Context, fixture.VideoId, source.Id,
                new(Guid.NewGuid(), source.Revision, null),
                CovePrincipal.System(), fixture.Authorization,
                new SegmentDuplicationProvenanceService(
                    new LineageNodeService(), new SegmentProvenanceService()),
                CancellationToken.None);

        Assert.Equal(SegmentDraftMutationStatus.Conflict, result.Status);
        Assert.Equal("LINEAGE_ROLLOUT_PAUSED", result.Code);
        Assert.Equal(itemCount, await fixture.Context.Set<SegmentStudioItem>().CountAsync());
    }

    [Fact]
    public async Task ManualMergeRetainsChronologicallyFirstDraftAndReplaysIdempotently()
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        var first = await SegmentStudioDraftService.CreateAsync(
            fixture.Context, fixture.VideoId, new(Guid.NewGuid(), 11, 14, 18),
            CovePrincipal.System(), fixture.Authorization, CancellationToken.None);
        var second = await SegmentStudioDraftService.CreateAsync(
            fixture.Context, fixture.VideoId, new(Guid.NewGuid(), 11, 20, 27),
            CovePrincipal.System(), fixture.Authorization, CancellationToken.None);
        var operationId = Guid.NewGuid();
        var request = new MergeSegmentDraftRequest(
            operationId, first.Draft!.ItemId, second.Draft!.Revision, first.Draft.Revision);

        var merged = await SegmentStudioDraftService.MergeAsync(
            fixture.Context, fixture.VideoId, second.Draft.ItemId, request,
            CovePrincipal.System(), fixture.Authorization, CancellationToken.None);
        var replay = await SegmentStudioDraftService.MergeAsync(
            fixture.Context, fixture.VideoId, second.Draft.ItemId, request,
            CovePrincipal.System(), fixture.Authorization, CancellationToken.None);

        Assert.Equal(SegmentDraftMutationStatus.Updated, merged.Status);
        Assert.Equal(first.Draft.ItemId, merged.Draft!.ItemId);
        Assert.Equal((14, (double?)27), (merged.Draft.StartSec, merged.Draft.EndSec));
        Assert.Equal("approved", merged.Draft.ReviewState);
        Assert.True(replay.Replayed);
        Assert.Single(await fixture.Context.Set<SegmentStudioItem>().Where(item => item.VideoId == fixture.VideoId).ToListAsync());
    }

    [Fact]
    public async Task ManualMergeTreatsPointDraftStartAsItsEffectiveEnd()
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        var first = await SegmentStudioDraftService.CreateAsync(
            fixture.Context, fixture.VideoId, new(Guid.NewGuid(), 11, 14, 18),
            CovePrincipal.System(), fixture.Authorization, CancellationToken.None);
        var point = await SegmentStudioDraftService.CreateAsync(
            fixture.Context, fixture.VideoId, new(Guid.NewGuid(), 11, 20, null),
            CovePrincipal.System(), fixture.Authorization, CancellationToken.None);

        var merged = await SegmentStudioDraftService.MergeAsync(
            fixture.Context, fixture.VideoId, first.Draft!.ItemId,
            new(Guid.NewGuid(), point.Draft!.ItemId, first.Draft.Revision, point.Draft.Revision),
            CovePrincipal.System(), fixture.Authorization, CancellationToken.None);

        Assert.Equal(SegmentDraftMutationStatus.Updated, merged.Status);
        Assert.Equal((14, (double?)20), (merged.Draft!.StartSec, merged.Draft.EndSec));
    }

    [Fact]
    public async Task ManualMergeConsolidatesStandaloneRootLineageMembers()
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        var first = await SegmentStudioDraftService.CreateAsync(
            fixture.Context, fixture.VideoId, new(Guid.NewGuid(), 11, 14, 18),
            CovePrincipal.System(), fixture.Authorization, CancellationToken.None);
        var second = await SegmentStudioDraftService.CreateAsync(
            fixture.Context, fixture.VideoId, new(Guid.NewGuid(), 11, 20, 27),
            CovePrincipal.System(), fixture.Authorization, CancellationToken.None);
        var firstNodeId = Guid.NewGuid();
        var secondNodeId = Guid.NewGuid();
        fixture.Context.AddRange(
        new SegmentStudioLineageNode
        {
            Id = firstNodeId, ItemId = first.Draft!.ItemId, State = "live",
            LastKnownVideoId = fixture.VideoId, LastKnownTagId = 11,
            CreatedAt = fixture.UpdatedAt, UpdatedAt = fixture.UpdatedAt,
        },
        new SegmentStudioLineageNode
        {
            Id = secondNodeId, ItemId = second.Draft!.ItemId, State = "live",
            LastKnownVideoId = fixture.VideoId, LastKnownTagId = 11,
            CreatedAt = fixture.UpdatedAt, UpdatedAt = fixture.UpdatedAt,
        },
        new SegmentStudioSegmentProvenance
        {
            LineageNodeId = firstNodeId, SourceId = 101, Relation = "origin",
            MetadataJson = "{}", CreatedAt = fixture.UpdatedAt, UpdatedAt = fixture.UpdatedAt,
        },
        new SegmentStudioSegmentProvenance
        {
            LineageNodeId = secondNodeId, SourceId = 202, Relation = "origin",
            MetadataJson = "{}", CreatedAt = fixture.UpdatedAt, UpdatedAt = fixture.UpdatedAt,
        },
        new SegmentStudioSegmentProvenance
        {
            LineageNodeId = secondNodeId, SourceId = 101, Relation = "origin",
            MetadataJson = "{}", CreatedAt = fixture.UpdatedAt, UpdatedAt = fixture.UpdatedAt,
        });
        await fixture.Context.SaveChangesAsync();

        var result = await SegmentStudioDraftService.MergeAsync(
            fixture.Context, fixture.VideoId, second.Draft!.ItemId,
            new(Guid.NewGuid(), first.Draft.ItemId, second.Draft.Revision, first.Draft.Revision),
            CovePrincipal.System(), fixture.Authorization, CancellationToken.None);

        Assert.Equal(SegmentDraftMutationStatus.Updated, result.Status);
        Assert.Equal(first.Draft.ItemId, result.Draft!.ItemId);
        Assert.Equal(1, await fixture.Context.Set<SegmentStudioItem>()
            .CountAsync(item => item.VideoId == fixture.VideoId));
        var node = Assert.Single(await fixture.Context.Set<SegmentStudioLineageNode>().ToListAsync());
        Assert.Equal(first.Draft.ItemId, node.ItemId);
        Assert.Equal((double?)27, node.LastKnownEndSec);
        Assert.Empty(await fixture.Context.Set<SegmentStudioSegmentProvenance>()
            .Where(assertion => assertion.LineageNodeId == node.Id).ToListAsync());
        var survivor = await fixture.Context.Set<SegmentStudioItem>().SingleAsync(item => item.Id == result.Draft.ItemId);
        Assert.Equal("user", survivor.SourceKey);
        Assert.Null(survivor.SourceRunId);
        Assert.Null(survivor.Confidence);
    }

    [Fact]
    public async Task ManualMergeReparentsConsumedOnlyRootLineage()
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        var first = await SegmentStudioDraftService.CreateAsync(
            fixture.Context, fixture.VideoId, new(Guid.NewGuid(), 11, 14, 18),
            CovePrincipal.System(), fixture.Authorization, CancellationToken.None);
        var second = await SegmentStudioDraftService.CreateAsync(
            fixture.Context, fixture.VideoId, new(Guid.NewGuid(), 11, 20, 27),
            CovePrincipal.System(), fixture.Authorization, CancellationToken.None);
        var nodeId = Guid.NewGuid();
        fixture.Context.Add(new SegmentStudioLineageNode
        {
            Id = nodeId, ItemId = second.Draft!.ItemId, State = "live",
            LastKnownVideoId = fixture.VideoId, LastKnownTagId = 11,
            CreatedAt = fixture.UpdatedAt, UpdatedAt = fixture.UpdatedAt,
        });
        await fixture.Context.SaveChangesAsync();

        var result = await SegmentStudioDraftService.MergeAsync(
            fixture.Context, fixture.VideoId, second.Draft.ItemId,
            new(Guid.NewGuid(), first.Draft!.ItemId, second.Draft.Revision, first.Draft.Revision),
            CovePrincipal.System(), fixture.Authorization, CancellationToken.None);

        Assert.Equal(SegmentDraftMutationStatus.Updated, result.Status);
        var node = Assert.Single(await fixture.Context.Set<SegmentStudioLineageNode>().ToListAsync());
        Assert.Equal(nodeId, node.Id);
        Assert.Equal(first.Draft.ItemId, node.ItemId);
    }

    [Fact]
    public async Task CompleteReviewPublishesOnlyApprovedDraftsAndLeavesRejectedUntouched()
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        var now = fixture.UpdatedAt.AddMinutes(1);
        var approved = new SegmentStudioItem
        {
            ReviewState = "approved", VideoId = fixture.VideoId, StartSec = 10, EndSec = 12,
            TagId = 11, Kind = "tag", SourceKey = "marker-studio/import", SourceRunId = "run-7",
            PayloadJson = "{\"producer\":7}", Title = "Approved draft", ColorHint = "green",
            ExtensionImageBlobId = "approved-image", Revision = 3, CreatedAt = now, UpdatedAt = now,
        };
        var unreviewed = new SegmentStudioItem
        {
            ReviewState = "unreviewed", VideoId = fixture.VideoId, StartSec = 13, EndSec = 14,
            TagId = 11, Kind = "tag", SourceKey = "marker-studio/import",
            Revision = 4, CreatedAt = now, UpdatedAt = now,
        };
        var rejected = new SegmentStudioItem
        {
            ReviewState = "rejected", VideoId = fixture.VideoId, StartSec = 15, EndSec = 16,
            TagId = 11, Kind = "tag", SourceKey = "marker-studio/import",
            PayloadJson = "{\"rejected\":true}", Revision = 5, CreatedAt = now, UpdatedAt = now,
        };
        fixture.Context.AddRange(approved, unreviewed, rejected);
        await fixture.Context.SaveChangesAsync();
        var version = await SegmentStudioReviewCompletionService.GetApprovedSetVersionAsync(
            fixture.Context, fixture.VideoId, CancellationToken.None);

        var completed = await SegmentStudioReviewCompletionService.CompleteAsync(
            fixture.Context, fixture.VideoId,
            new(Guid.NewGuid(), version), CovePrincipal.System(), fixture.Authorization,
            fixture.Blobs, CancellationToken.None);

        Assert.Equal(ReviewCompletionStatus.Completed, completed.Status);
        Assert.Single(completed.Published);
        Assert.Equal(approved.Id, completed.Published[0].ItemId);
        var native = await fixture.Context.Set<Segment>().SingleAsync(
            segment => segment.Id == completed.Published[0].NativeSegmentId);
        Assert.Equal("approved-image", native.ImageBlobId);
        Assert.Equal(7, native.Payload!.RootElement.GetProperty("producer").GetInt32());
        var anchor = await fixture.Context.Set<SegmentStudioItem>().SingleAsync(item => item.Id == approved.Id);
        Assert.Equal(native.Id, anchor.NativeSegmentId);
        Assert.Null(anchor.ReviewState);
        var savedUnreviewed = await fixture.Context.Set<SegmentStudioItem>().SingleAsync(item => item.Id == unreviewed.Id);
        var savedRejected = await fixture.Context.Set<SegmentStudioItem>().SingleAsync(item => item.Id == rejected.Id);
        Assert.Equal(("unreviewed", 4L, 13d), (savedUnreviewed.ReviewState, savedUnreviewed.Revision, savedUnreviewed.StartSec));
        Assert.Equal(("rejected", 5L, "{\"rejected\":true}"), (savedRejected.ReviewState, savedRejected.Revision, savedRejected.PayloadJson));
    }

    [Fact]
    public async Task CompleteReviewIsIdempotentAndConflictsWhenApprovedSetChanges()
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        var now = fixture.UpdatedAt.AddMinutes(1);
        var first = new SegmentStudioItem
        {
            ReviewState = "approved", VideoId = fixture.VideoId, StartSec = 10, EndSec = 12,
            TagId = 11, Kind = "tag", SourceKey = "marker-studio/import",
            Revision = 1, CreatedAt = now, UpdatedAt = now,
        };
        fixture.Context.Add(first);
        await fixture.Context.SaveChangesAsync();
        var version = await SegmentStudioReviewCompletionService.GetApprovedSetVersionAsync(
            fixture.Context, fixture.VideoId, CancellationToken.None);
        var request = new CompleteReviewRequest(Guid.NewGuid(), version);

        var completed = await SegmentStudioReviewCompletionService.CompleteAsync(
            fixture.Context, fixture.VideoId, request, CovePrincipal.System(),
            fixture.Authorization, fixture.Blobs, CancellationToken.None);
        var replay = await SegmentStudioReviewCompletionService.CompleteAsync(
            fixture.Context, fixture.VideoId, request, CovePrincipal.System(),
            fixture.Authorization, fixture.Blobs, CancellationToken.None);
        var deniedReplay = await SegmentStudioReviewCompletionService.CompleteAsync(
            fixture.Context, fixture.VideoId, request, CovePrincipal.System(),
            new DeniedAuthorization(), fixture.Blobs, CancellationToken.None);

        Assert.Equal(ReviewCompletionStatus.Completed, completed.Status);
        Assert.True(replay.Replayed);
        Assert.Equal(completed.Published, replay.Published);
        Assert.Equal(ReviewCompletionStatus.Forbidden, deniedReplay.Status);

        fixture.Context.Add(new SegmentStudioItem
        {
            ReviewState = "approved", VideoId = fixture.VideoId, StartSec = 20, EndSec = 21,
            TagId = 11, Kind = "tag", SourceKey = "marker-studio/import",
            Revision = 1, CreatedAt = now, UpdatedAt = now,
        });
        await fixture.Context.SaveChangesAsync();
        var stale = await SegmentStudioReviewCompletionService.CompleteAsync(
            fixture.Context, fixture.VideoId, new(Guid.NewGuid(), completed.ApprovedSetVersion),
            CovePrincipal.System(), fixture.Authorization, fixture.Blobs, CancellationToken.None);

        Assert.Equal(ReviewCompletionStatus.Conflict, stale.Status);
    }

    [Fact]
    public async Task NativeImportAsApprovedCreatesAnchorAndKeepsNativeSegment()
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        var importer = new NativeSegmentImportService(new NoOpNativeAiIngestion());

        var result = await importer.ImportAsync(
            fixture.Context, fixture.VideoId,
            new(Guid.NewGuid(), "approved"), CovePrincipal.System(),
            fixture.Authorization, fixture.Blobs, CancellationToken.None);

        Assert.Equal(1, result.ImportedCount);
        Assert.Equal(0, await importer.CountAvailableAsync(
            fixture.Context, fixture.VideoId, CancellationToken.None));
        Assert.True(await fixture.Context.Set<Segment>()
            .AnyAsync(segment => segment.Id == fixture.SegmentId));
        Assert.Equal(fixture.SegmentId,
            Assert.Single(await fixture.Context.Set<SegmentStudioItem>().ToListAsync()).NativeSegmentId);
    }

    [Fact]
    public async Task BulkNativeToOwnedTransitionConvertsEveryNativeSegmentInOneIdempotentOperation()
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        var secondUpdatedAt = fixture.UpdatedAt.AddSeconds(1);
        fixture.Context.AddRange(
            new SegmentStudioItem
            {
                Id = 500, NativeSegmentId = fixture.SegmentId,
                CreatedAt = fixture.UpdatedAt, UpdatedAt = fixture.UpdatedAt,
            },
            new Segment
            {
                Id = 102, HostType = SegmentHostType.Video, HostId = fixture.VideoId,
                StartSec = 12, EndSec = 14, TagId = 11, Kind = "tag",
                SourceKey = "producer/example", Confidence = 0.7f,
                CreatedAt = fixture.UpdatedAt, UpdatedAt = secondUpdatedAt,
            },
            new SegmentStudioItem
            {
                Id = 501, NativeSegmentId = 102,
                CreatedAt = fixture.UpdatedAt, UpdatedAt = fixture.UpdatedAt,
            });
        await fixture.Context.SaveChangesAsync();
        fixture.Context.ChangeTracker.Clear();
        var request = new NativeToOwnedTransitionBatchRequest(
            Guid.NewGuid(),
            [new(fixture.SegmentId, fixture.UpdatedAt), new(102, secondUpdatedAt)]);

        var moved = await SegmentOwnershipTransitionService.MoveManyNativeToOwnedAsync(
            fixture.Context, fixture.VideoId, request, CovePrincipal.System(),
            fixture.Authorization, fixture.Blobs, CancellationToken.None);
        var replay = await SegmentOwnershipTransitionService.MoveManyNativeToOwnedAsync(
            fixture.Context, fixture.VideoId, request, CovePrincipal.System(),
            fixture.Authorization, fixture.Blobs, CancellationToken.None);

        Assert.Equal(SegmentTransitionStatus.Updated, moved.Status);
        Assert.Equal(2, moved.Items!.Count);
        Assert.True(replay.Replayed);
        Assert.Equal(moved.Items, replay.Items);
        Assert.Empty(await fixture.Context.Set<Segment>().ToListAsync());
        var drafts = await fixture.Context.Set<SegmentStudioItem>().OrderBy(item => item.Id).ToListAsync();
        Assert.Equal(2, drafts.Count);
        Assert.All(drafts, draft =>
        {
            Assert.Null(draft.NativeSegmentId);
            Assert.Equal("rejected", draft.ReviewState);
            Assert.Equal(1, draft.Revision);
        });
        Assert.Single(await fixture.Context.Set<SegmentStudioSegmentOperation>().ToListAsync());
    }

    [Fact]
    public async Task BulkNativeToOwnedTransitionTransparentlyArchivesUnregisteredNativeSegments()
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        var request = new NativeToOwnedTransitionBatchRequest(
            Guid.NewGuid(),
            [new(fixture.SegmentId, fixture.UpdatedAt)]);

        var moved = await SegmentOwnershipTransitionService.MoveManyNativeToOwnedAsync(
            fixture.Context, fixture.VideoId, request, CovePrincipal.System(),
            fixture.Authorization, fixture.Blobs, CancellationToken.None);

        Assert.Equal(SegmentTransitionStatus.Updated, moved.Status);
        Assert.Empty(await fixture.Context.Set<Segment>().ToListAsync());
        var archived = Assert.Single(await fixture.Context.Set<SegmentStudioItem>().ToListAsync());
        Assert.Null(archived.NativeSegmentId);
        Assert.Equal(fixture.VideoId, archived.VideoId);
        Assert.Equal(11, archived.TagId);
        Assert.Equal("rejected", archived.ReviewState);
        Assert.Equal(1, archived.Revision);
        Assert.Equal(archived.Id, Assert.Single(moved.Items!).ItemId);
    }

    [Fact]
    public async Task BasicMoveUsesNativeRecycleStorageAndRestoresWithoutReviewItem()
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        var provenanceCreatedAt = fixture.UpdatedAt.AddHours(-2);
        fixture.Context.Add(new FieldProvenance
        {
            HostType = AffinityHostType.Segment,
            HostId = fixture.SegmentId,
            FieldKey = "tag_id",
            ValueJson = "11",
            SourceKey = "producer/example",
            SourceRunId = "run-3",
            ModelKey = "model-7",
            Confidence = 0.82f,
            CreatedAt = provenanceCreatedAt,
            UpdatedAt = provenanceCreatedAt,
        });
        await fixture.Context.SaveChangesAsync();
        var moved = await BasicNativeRecycleBinService.MoveAsync(
            fixture.Context,
            fixture.VideoId,
            fixture.SegmentId,
            new(Guid.NewGuid(), fixture.UpdatedAt),
            CovePrincipal.System(),
            fixture.Authorization,
            fixture.Blobs,
            CancellationToken.None);

        Assert.Equal(SegmentTransitionStatus.Updated, moved.Status);
        Assert.Empty(await fixture.Context.Set<Segment>().ToListAsync());
        Assert.Empty(await fixture.Context.Set<SegmentStudioItem>().ToListAsync());
        var entry = Assert.Single(await fixture.Context
            .Set<SegmentStudioNativeRecycleBinEntry>().ToListAsync());
        Assert.Equal(fixture.VideoId, entry.VideoId);
        Assert.Equal(11, entry.TagId);
        Assert.Equal("""{"producer":7}""", entry.PayloadJson);
        Assert.Contains("tag_id", entry.FieldProvenanceJson);
        Assert.Empty(await fixture.Context.Set<FieldProvenance>().ToListAsync());

        var restored = await BasicNativeRecycleBinService.RestoreAsync(
            fixture.Context,
            entry.Id,
            new(Guid.NewGuid(), entry.Revision),
            CovePrincipal.System(),
            fixture.Authorization,
            fixture.Blobs,
            CancellationToken.None);

        Assert.Equal(SegmentTransitionStatus.Updated, restored.Status);
        Assert.Empty(await fixture.Context
            .Set<SegmentStudioNativeRecycleBinEntry>().ToListAsync());
        var native = Assert.Single(await fixture.Context.Set<Segment>().ToListAsync());
        Assert.Equal(11, native.TagId);
        Assert.Equal("blob-1", native.ImageBlobId);
        Assert.Empty(await fixture.Context.Set<SegmentStudioItem>().ToListAsync());
        var restoredProvenance = Assert.Single(
            await fixture.Context.Set<FieldProvenance>().ToListAsync());
        Assert.Equal(native.Id, restoredProvenance.HostId);
        Assert.Equal("tag_id", restoredProvenance.FieldKey);
        Assert.Equal("model-7", restoredProvenance.ModelKey);
        Assert.Equal(provenanceCreatedAt, restoredProvenance.CreatedAt);
    }

    [Fact]
    public async Task BasicRestoreRejectsUnreadablePreservedAnchorBeforeMutation()
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        var moved = await BasicNativeRecycleBinService.MoveAsync(
            fixture.Context,
            fixture.VideoId,
            fixture.SegmentId,
            new(Guid.NewGuid(), fixture.UpdatedAt),
            CovePrincipal.System(),
            fixture.Authorization,
            fixture.Blobs,
            CancellationToken.None);
        Assert.Equal(SegmentTransitionStatus.Updated, moved.Status);
        var entry = await fixture.Context
            .Set<SegmentStudioNativeRecycleBinEntry>().SingleAsync();
        entry.PreservedAnchorJson = "null";
        await fixture.Context.SaveChangesAsync();

        var restored = await BasicNativeRecycleBinService.RestoreAsync(
            fixture.Context,
            entry.Id,
            new(Guid.NewGuid(), entry.Revision),
            CovePrincipal.System(),
            fixture.Authorization,
            fixture.Blobs,
            CancellationToken.None);

        Assert.Equal(SegmentTransitionStatus.Invalid, restored.Status);
        Assert.Empty(await fixture.Context.Set<Segment>().ToListAsync());
        Assert.Single(await fixture.Context
            .Set<SegmentStudioNativeRecycleBinEntry>().ToListAsync());
    }

    [Fact]
    public async Task ExpiringBasicHistoryReceiptsSkipsAlreadyTrackedExpiredRows()
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        var emptyState = JsonSerializer.SerializeToElement(new
        {
            type = "segments",
            segments = Array.Empty<object>(),
        });
        await BasicNativeHistoryReceiptService.RecordAsync(
            fixture.Context,
            Guid.NewGuid(),
            userId: 1,
            new(
                fixture.VideoId,
                "move",
                "Move segment",
                emptyState,
                emptyState),
            CancellationToken.None);

        await BasicNativeHistoryReceiptService.ExpireForVideoAsync(
            fixture.Context, fixture.VideoId, userId: null,
            CancellationToken.None);
        await BasicNativeHistoryReceiptService.ExpireForVideoAsync(
            fixture.Context, fixture.VideoId + 1, userId: null,
            CancellationToken.None);

        var expired = await fixture.Context
            .Set<SegmentStudioSegmentOperation>().SingleAsync();
        Assert.Equal("basic-native-history-receipt-expired", expired.Kind);
        Assert.Null(expired.ResultPayloadJson);
    }

    [Fact]
    public async Task BasicMoveHistoryAtomicallyRestoresReorderedBulkWithDiscardedImages()
    {
        await using var fixture =
            await TransitionFixture.CreateAsync(blobExists: false);
        var secondUpdatedAt = fixture.UpdatedAt.AddMinutes(1);
        fixture.Context.Add(new Segment
        {
            Id = 102,
            HostType = SegmentHostType.Video,
            HostId = fixture.VideoId,
            StartSec = 12,
            EndSec = 15,
            TagId = 11,
            Kind = "tag",
            SourceKey = "producer/second",
            SourceRunId = "run-4",
            Confidence = 0.64f,
            Title = "Second",
            ImageBlobId = "blob-2",
            CreatedAt = fixture.UpdatedAt.AddDays(-2),
            UpdatedAt = secondUpdatedAt,
        });
        await fixture.Context.SaveChangesAsync();
        fixture.Context.ChangeTracker.Clear();
        var principal = UserPrincipal();
        var before =
            await BasicNativeHistoryReceiptService.CaptureNativeStateAsync(
                fixture.Context,
                fixture.VideoId,
                [102, fixture.SegmentId],
                CancellationToken.None);
        var moved = await BasicNativeRecycleBinService.MoveManyAsync(
            fixture.Context,
            fixture.VideoId,
            new(
                Guid.NewGuid(),
                [
                    new(102, secondUpdatedAt),
                    new(fixture.SegmentId, fixture.UpdatedAt),
                ],
                DiscardMissingImage: true),
            principal,
            fixture.Authorization,
            fixture.Blobs,
            CancellationToken.None);
        Assert.Equal(SegmentTransitionStatus.Updated, moved.Status);
        var after =
            await BasicNativeHistoryReceiptService.CaptureBinStateAsync(
                fixture.Context,
                moved.Items!.Select(item => item.ItemId),
                CancellationToken.None);
        var session = new SegmentStudioHistorySession
        {
            UserId = principal.UserId!.Value,
            VideoId = fixture.VideoId,
            Mode = SegmentStudioModes.Basic,
            CursorSequence = 1,
            Revision = 1,
            CreatedAt = fixture.UpdatedAt,
            UpdatedAt = fixture.UpdatedAt,
        };
        fixture.Context.Add(session);
        await fixture.Context.SaveChangesAsync();
        fixture.Context.Add(new SegmentStudioHistoryAction
        {
            SessionId = session.Id,
            Sequence = 1,
            ReceiptId = Guid.NewGuid(),
            Kind = "segments.moveToBin",
            Label = "Moved 2 segments to recycling bin",
            BeforeJson = before.GetRawText(),
            AfterJson = after.GetRawText(),
            CreatedAt = fixture.UpdatedAt,
        });
        await fixture.Context.SaveChangesAsync();
        fixture.Context.ChangeTracker.Clear();

        var undoRequest = new BasicNativeHistoryRestoreRequest(
            Guid.NewGuid(),
            ExpectedHistoryRevision: 1,
            ActionSequence: 1,
            Direction: "backward");
        var undone = await BasicNativeHistoryService.RestoreAsync(
            fixture.Context,
            fixture.VideoId,
            undoRequest,
            principal,
            fixture.Authorization,
            fixture.Blobs,
            CancellationToken.None);

        Assert.Equal(BasicNativeHistoryRestoreStatus.Updated, undone.Status);
        Assert.Equal(0, undone.History!.CursorSequence);
        Assert.Equal(2, undone.History.Revision);
        Assert.Empty(await fixture.Context
            .Set<SegmentStudioNativeRecycleBinEntry>().ToListAsync());
        var restored = await fixture.Context.Set<Segment>()
            .OrderBy(segment => segment.StartSec)
            .ToListAsync();
        Assert.Equal(2, restored.Count);
        Assert.All(restored, segment => Assert.Null(segment.ImageBlobId));

        var replayed = await BasicNativeHistoryService.RestoreAsync(
            fixture.Context,
            fixture.VideoId,
            undoRequest,
            principal,
            fixture.Authorization,
            fixture.Blobs,
            CancellationToken.None);
        Assert.Equal(BasicNativeHistoryRestoreStatus.Updated, replayed.Status);
        Assert.True(replayed.Replayed);
        Assert.Equal(2, await fixture.Context.Set<Segment>().CountAsync());

        fixture.Context.ChangeTracker.Clear();
        var redone = await BasicNativeHistoryService.RestoreAsync(
            fixture.Context,
            fixture.VideoId,
            new(
                Guid.NewGuid(),
                ExpectedHistoryRevision: undone.History.Revision,
                ActionSequence: 1,
                Direction: "forward"),
            principal,
            fixture.Authorization,
            fixture.Blobs,
            CancellationToken.None);
        Assert.Equal(BasicNativeHistoryRestoreStatus.Updated, redone.Status);
        Assert.Equal(1, redone.History!.CursorSequence);
        Assert.Empty(await fixture.Context.Set<Segment>().ToListAsync());
        Assert.Equal(2, await fixture.Context
            .Set<SegmentStudioNativeRecycleBinEntry>().CountAsync());

        fixture.Context.ChangeTracker.Clear();
        var undoneAgain = await BasicNativeHistoryService.RestoreAsync(
            fixture.Context,
            fixture.VideoId,
            new(
                Guid.NewGuid(),
                ExpectedHistoryRevision: redone.History.Revision,
                ActionSequence: 1,
                Direction: "backward"),
            principal,
            fixture.Authorization,
            fixture.Blobs,
            CancellationToken.None);
        Assert.Equal(BasicNativeHistoryRestoreStatus.Updated, undoneAgain.Status);
        Assert.Equal(2, await fixture.Context.Set<Segment>().CountAsync());
        Assert.Empty(await fixture.Context
            .Set<SegmentStudioNativeRecycleBinEntry>().ToListAsync());
    }

    [Fact]
    public async Task BasicMoveProtectsHiddenFullMetadata()
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        fixture.Context.Add(new SegmentStudioItem
        {
            NativeSegmentId = fixture.SegmentId,
            CreatedAt = fixture.UpdatedAt,
            UpdatedAt = fixture.UpdatedAt,
        });
        await fixture.Context.SaveChangesAsync();

        var result = await BasicNativeRecycleBinService.MoveAsync(
            fixture.Context,
            fixture.VideoId,
            fixture.SegmentId,
            new(Guid.NewGuid(), fixture.UpdatedAt),
            CovePrincipal.System(),
            fixture.Authorization,
            fixture.Blobs,
            CancellationToken.None);

        Assert.Equal(SegmentTransitionStatus.Conflict, result.Status);
        Assert.Equal("FULL_METADATA_PROTECTED", result.Code);
        Assert.Single(await fixture.Context.Set<Segment>().ToListAsync());
        Assert.Empty(await fixture.Context
            .Set<SegmentStudioNativeRecycleBinEntry>().ToListAsync());
    }

    [Fact]
    public async Task BulkTagChangeUpdatesNativeAndDraftSegmentsAndReplays()
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        fixture.Context.AddRange(
            new Tag { Id = 12, Name = "Replacement" },
            new SegmentStudioItem
            {
                Id = 502,
                VideoId = fixture.VideoId,
                TagId = 11,
                StartSec = 12,
                EndSec = 14,
                Kind = "tag",
                SourceKey = "user",
                ReviewState = "unreviewed",
                Revision = 1,
                CreatedAt = fixture.UpdatedAt,
                UpdatedAt = fixture.UpdatedAt,
            },
            new SegmentStudioItem
            {
                Id = 503,
                VideoId = fixture.VideoId,
                TagId = 12,
                StartSec = 16,
                EndSec = 18,
                Kind = "tag",
                SourceKey = "user",
                ReviewState = "approved",
                Revision = 1,
                CreatedAt = fixture.UpdatedAt,
                UpdatedAt = fixture.UpdatedAt,
            });
        await fixture.Context.SaveChangesAsync();
        fixture.Context.ChangeTracker.Clear();
        var request = new BulkSegmentTagRequest(
            Guid.NewGuid(),
            12,
            [
                new(fixture.SegmentId, null, fixture.UpdatedAt, null),
                new(null, 502, null, 1),
                new(null, 503, null, 1),
            ]);

        var updated = await BulkSegmentTagService.UpdateAsync(
            fixture.Context, fixture.VideoId, request, CovePrincipal.System(),
            fixture.Authorization, CancellationToken.None);
        var replay = await BulkSegmentTagService.UpdateAsync(
            fixture.Context, fixture.VideoId, request, CovePrincipal.System(),
            fixture.Authorization, CancellationToken.None);

        Assert.Equal(BulkSegmentTagStatus.Updated, updated.Status);
        Assert.Equal(2, updated.UpdatedCount);
        Assert.True(replay.Replayed);
        Assert.Equal(12, (await fixture.Context.Set<Segment>()
            .SingleAsync(segment => segment.Id == fixture.SegmentId)).TagId);
        var draft = await fixture.Context.Set<SegmentStudioItem>().SingleAsync(item => item.Id == 502);
        Assert.Equal(12, draft.TagId);
        Assert.Equal(2, draft.Revision);
        Assert.Equal(1, (await fixture.Context.Set<SegmentStudioItem>()
            .SingleAsync(item => item.Id == 503)).Revision);
        Assert.Equal(2, await fixture.Context.Set<SegmentStudioSegmentOperation>().CountAsync());
    }

    [Fact]
    public async Task BasicBulkTagChangeRejectsExtensionOwnedIdentity()
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        fixture.Context.Add(new Tag { Id = 12, Name = "Replacement" });
        await fixture.Context.SaveChangesAsync();
        var request = new BulkSegmentTagRequest(
            Guid.NewGuid(),
            12,
            [
                new(fixture.SegmentId, null, fixture.UpdatedAt, null),
                new(null, 502, null, 1),
            ]);

        var result = await BulkSegmentTagService.UpdateAsync(
            fixture.Context, fixture.VideoId, request, CovePrincipal.System(),
            fixture.Authorization, CancellationToken.None,
            preserveExtensionMetadata: false);

        Assert.Equal(BulkSegmentTagStatus.Invalid, result.Status);
        Assert.Contains("only native", result.Error, StringComparison.OrdinalIgnoreCase);
        Assert.Equal(11, (await fixture.Context.Set<Segment>()
            .SingleAsync(segment => segment.Id == fixture.SegmentId)).TagId);
    }

    [Fact]
    public async Task BulkReviewAppliesOneStateToMixedDraftsAndReplaysOneHistoryAction()
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        fixture.Context.AddRange(
            Draft(501, "approved", 2),
            Draft(502, "unreviewed", 4),
            Draft(503, "rejected", 6));
        await fixture.Context.SaveChangesAsync();
        fixture.Context.ChangeTracker.Clear();
        var request = new BulkSegmentReviewRequest(
            Guid.NewGuid(),
            0,
            "rejected",
            [
                new(null, 501, null, 2),
                new(null, 502, null, 4),
                new(null, 503, null, 6),
            ]);

        var updated = await BulkSegmentReviewService.UpdateAsync(
            fixture.Context, fixture.VideoId, request, UserPrincipal(),
            fixture.Authorization, fixture.Blobs, CancellationToken.None);
        var replay = await BulkSegmentReviewService.UpdateAsync(
            fixture.Context, fixture.VideoId, request, UserPrincipal(),
            fixture.Authorization, fixture.Blobs, CancellationToken.None);

        Assert.Equal(BulkSegmentReviewStatus.Updated, updated.Status);
        Assert.Equal(2, updated.UpdatedCount);
        Assert.Equal(
            await SegmentStudioReviewCompletionService.GetApprovedSetVersionAsync(
                fixture.Context, fixture.VideoId, CancellationToken.None),
            updated.ApprovedSetVersion);
        Assert.True(replay.Replayed);
        Assert.Equal(updated.ApprovedSetVersion, replay.ApprovedSetVersion);
        var drafts = await fixture.Context.Set<SegmentStudioItem>()
            .Where(item => item.Id >= 501 && item.Id <= 503)
            .OrderBy(item => item.Id)
            .ToArrayAsync();
        Assert.All(drafts, item => Assert.Equal("rejected", item.ReviewState));
        Assert.Equal([3L, 5L, 6L], drafts.Select(item => item.Revision));
        var action = Assert.Single(await fixture.Context.Set<SegmentStudioHistoryAction>().ToListAsync());
        Assert.Equal("segments.review", action.Kind);
        Assert.Equal("Rejected 2 segments", action.Label);
        Assert.Single(await fixture.Context.Set<SegmentStudioSegmentOperation>()
            .Where(operation => operation.Kind == "bulk-review-state").ToListAsync());

        SegmentStudioItem Draft(long id, string state, long revision) => new()
        {
            Id = id,
            VideoId = fixture.VideoId,
            TagId = 11,
            StartSec = id,
            EndSec = id + 1,
            Kind = "tag",
            SourceKey = "user",
            ReviewState = state,
            Revision = revision,
            CreatedAt = fixture.UpdatedAt,
            UpdatedAt = fixture.UpdatedAt,
        };
    }

    [Fact]
    public async Task BulkReviewRejectsAStaleSelectionBeforeChangingAnyDraft()
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        fixture.Context.AddRange(
            new SegmentStudioItem
            {
                Id = 511, VideoId = fixture.VideoId, TagId = 11,
                StartSec = 1, EndSec = 2, Kind = "tag", SourceKey = "user",
                ReviewState = "unreviewed", Revision = 1,
                CreatedAt = fixture.UpdatedAt, UpdatedAt = fixture.UpdatedAt,
            },
            new SegmentStudioItem
            {
                Id = 512, VideoId = fixture.VideoId, TagId = 11,
                StartSec = 2, EndSec = 3, Kind = "tag", SourceKey = "user",
                ReviewState = "approved", Revision = 2,
                CreatedAt = fixture.UpdatedAt, UpdatedAt = fixture.UpdatedAt,
            });
        await fixture.Context.SaveChangesAsync();
        fixture.Context.ChangeTracker.Clear();

        var result = await BulkSegmentReviewService.UpdateAsync(
            fixture.Context,
            fixture.VideoId,
            new BulkSegmentReviewRequest(
                Guid.NewGuid(), 0, "rejected",
                [new(null, 511, null, 1), new(null, 512, null, 1)]),
            UserPrincipal(), fixture.Authorization, fixture.Blobs,
            CancellationToken.None);

        Assert.Equal(BulkSegmentReviewStatus.Conflict, result.Status);
        var states = await fixture.Context.Set<SegmentStudioItem>()
            .Where(item => item.Id == 511 || item.Id == 512)
            .OrderBy(item => item.Id)
            .Select(item => item.ReviewState)
            .ToArrayAsync();
        Assert.Equal(new string?[] { "unreviewed", "approved" }, states);
        Assert.Empty(await fixture.Context.Set<SegmentStudioHistoryAction>().ToListAsync());
        Assert.Empty(await fixture.Context.Set<SegmentStudioSegmentOperation>()
            .Where(operation => operation.Kind == "bulk-review-state").ToListAsync());
    }

    [Fact]
    public async Task BulkReviewSupportsMoreThanFiveThousandDraftsInOneOperation()
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        const int count = 5_001;
        var drafts = Enumerable.Range(10_000, count).Select(id => new SegmentStudioItem
        {
            Id = id,
            VideoId = fixture.VideoId,
            TagId = 11,
            StartSec = id,
            EndSec = id + 1,
            Kind = "tag",
            SourceKey = "user",
            ReviewState = "unreviewed",
            Revision = 1,
            CreatedAt = fixture.UpdatedAt,
            UpdatedAt = fixture.UpdatedAt,
        }).ToArray();
        fixture.Context.AddRange(drafts);
        await fixture.Context.SaveChangesAsync();
        fixture.Context.ChangeTracker.Clear();
        var request = new BulkSegmentReviewRequest(
            Guid.NewGuid(),
            0,
            "rejected",
            drafts.Select(item => new BulkSegmentReviewTarget(
                null, item.Id, null, item.Revision)).ToArray());

        var result = await BulkSegmentReviewService.UpdateAsync(
            fixture.Context, fixture.VideoId, request, UserPrincipal(),
            fixture.Authorization, fixture.Blobs, CancellationToken.None);

        Assert.Equal(BulkSegmentReviewStatus.Updated, result.Status);
        Assert.Equal(count, result.UpdatedCount);
        Assert.Equal(count, await fixture.Context.Set<SegmentStudioItem>()
            .CountAsync(item => item.Id >= 10_000 && item.ReviewState == "rejected"));
        Assert.Single(await fixture.Context.Set<SegmentStudioHistoryAction>().ToListAsync());
    }

    [Fact]
    public async Task BulkReviewRejectsPublishedAndDraftSegmentsTogether()
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        fixture.Context.Add(new SegmentStudioItem
        {
            Id = 520,
            VideoId = fixture.VideoId,
            TagId = 11,
            StartSec = 20,
            EndSec = 21,
            Kind = "tag",
            SourceKey = "user",
            ReviewState = "approved",
            Revision = 3,
            CreatedAt = fixture.UpdatedAt,
            UpdatedAt = fixture.UpdatedAt,
        });
        await fixture.Context.SaveChangesAsync();
        fixture.Context.ChangeTracker.Clear();

        var result = await BulkSegmentReviewService.UpdateAsync(
            fixture.Context,
            fixture.VideoId,
            new BulkSegmentReviewRequest(
                Guid.NewGuid(),
                0,
                "rejected",
                [
                    new(fixture.SegmentId, null, fixture.UpdatedAt, null),
                    new(null, 520, null, 3),
                ]),
            UserPrincipal(), fixture.Authorization, fixture.Blobs,
            CancellationToken.None);

        Assert.Equal(BulkSegmentReviewStatus.Updated, result.Status);
        Assert.Equal(2, result.UpdatedCount);
        Assert.False(await fixture.Context.Set<Segment>()
            .AnyAsync(segment => segment.Id == fixture.SegmentId));
        var rejected = await fixture.Context.Set<SegmentStudioItem>()
            .Where(item => item.ReviewState == "rejected")
            .OrderBy(item => item.Id)
            .ToArrayAsync();
        Assert.Equal(2, rejected.Length);
        Assert.Contains(result.Items!, item =>
            item.RequestedNativeSegmentId == fixture.SegmentId
            && item.NativeSegmentId == null
            && item.ItemId != null);
        Assert.Single(await fixture.Context.Set<SegmentStudioHistoryAction>().ToListAsync());
    }

    [Fact]
    public async Task BulkReviewApprovesPublishedAndDraftSegmentsTogether()
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        fixture.Context.Add(new SegmentStudioItem
        {
            Id = 521,
            VideoId = fixture.VideoId,
            TagId = 11,
            StartSec = 22,
            EndSec = 23,
            Kind = "tag",
            SourceKey = "user",
            ReviewState = "rejected",
            Revision = 4,
            CreatedAt = fixture.UpdatedAt,
            UpdatedAt = fixture.UpdatedAt,
        });
        await fixture.Context.SaveChangesAsync();
        fixture.Context.ChangeTracker.Clear();

        var result = await BulkSegmentReviewService.UpdateAsync(
            fixture.Context,
            fixture.VideoId,
            new BulkSegmentReviewRequest(
                Guid.NewGuid(),
                0,
                "approved",
                [
                    new(fixture.SegmentId, null, fixture.UpdatedAt, null),
                    new(null, 521, null, 4),
                ]),
            UserPrincipal(), fixture.Authorization, fixture.Blobs,
            CancellationToken.None);

        Assert.Equal(BulkSegmentReviewStatus.Updated, result.Status);
        Assert.Equal(2, result.UpdatedCount);
        var native = await fixture.Context.Set<Segment>()
            .SingleAsync(segment => segment.Id == fixture.SegmentId);
        Assert.Equal("approved", DirectSegmentReviewService.ReadReviewState(native.Payload));
        Assert.Equal("approved", (await fixture.Context.Set<SegmentStudioItem>()
            .SingleAsync(item => item.Id == 521)).ReviewState);
        Assert.Single(await fixture.Context.Set<SegmentStudioHistoryAction>().ToListAsync());
    }

    [Fact]
    public async Task NativeImportForReviewMovesSegmentToUnreviewedDraft()
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        var importer = new NativeSegmentImportService(new NoOpNativeAiIngestion());

        var result = await importer.ImportAsync(
            fixture.Context, fixture.VideoId,
            new(Guid.NewGuid(), "unreviewed"), CovePrincipal.System(),
            fixture.Authorization, fixture.Blobs, CancellationToken.None);

        Assert.Equal(1, result.ImportedCount);
        Assert.Empty(await fixture.Context.Set<Segment>().ToListAsync());
        var draft = Assert.Single(await fixture.Context.Set<SegmentStudioItem>().ToListAsync());
        Assert.Null(draft.NativeSegmentId);
        Assert.Equal("unreviewed", draft.ReviewState);
        Assert.Equal(fixture.VideoId, draft.VideoId);
        Assert.Equal("producer/example", draft.SourceKey);
    }

    [Fact]
    public async Task NativeImportForReviewBatchesAiProvenanceAndPreservesUnrelatedRejectedItem()
    {
        await using var fixture = await TransitionFixture.CreateAsync();
        var first = await fixture.Context.Set<Segment>()
            .SingleAsync(segment => segment.Id == fixture.SegmentId);
        first.SourceKey = "ext:ai.tagging";
        var secondUpdatedAt = fixture.UpdatedAt.AddSeconds(1);
        fixture.Context.AddRange(
            new Segment
            {
                Id = 102, HostType = SegmentHostType.Video, HostId = fixture.VideoId,
                StartSec = 12, EndSec = 14, TagId = 11, Kind = "tag",
                SourceKey = "ext:ai.tagging", SourceRunId = "run-3", Confidence = 0.7f,
                CreatedAt = fixture.UpdatedAt, UpdatedAt = secondUpdatedAt,
            },
            new SegmentStudioItem
            {
                Id = 900, VideoId = fixture.VideoId, StartSec = 20, EndSec = 21,
                TagId = 11, Kind = "tag", SourceKey = "producer/example",
                ReviewState = "rejected", Revision = 7,
                PayloadJson = "{\"unrelated\":true}",
                CreatedAt = fixture.UpdatedAt, UpdatedAt = fixture.UpdatedAt,
            });
        await fixture.Context.SaveChangesAsync();
        fixture.Context.ChangeTracker.Clear();
        var callerEditedTag = await fixture.Context.Set<Tag>()
            .SingleAsync(tag => tag.Id == 11);
        callerEditedTag.Name = "Caller edit retained";
        var ingestion = new RecordingNativeAiIngestion();
        var importer = new NativeSegmentImportService(ingestion);

        var result = await importer.ImportAsync(
            fixture.Context, fixture.VideoId,
            new(Guid.NewGuid(), "unreviewed"), CovePrincipal.System(),
            fixture.Authorization, fixture.Blobs, CancellationToken.None);

        Assert.Equal(2, result.ImportedCount);
        var ingestionRequest = Assert.Single(ingestion.Requests);
        Assert.Null(ingestionRequest.SegmentId);
        Assert.Equal(fixture.VideoId, ingestionRequest.VideoId);
        Assert.Equal(2, ingestionRequest.BatchSize);
        Assert.Equal([fixture.SegmentId, 102], ingestionRequest.SegmentIds);
        Assert.Empty(await fixture.Context.Set<Segment>().ToListAsync());
        var imported = await fixture.Context.Set<SegmentStudioItem>()
            .Where(item => item.ReviewState == "unreviewed")
            .OrderBy(item => item.StartSec)
            .ToListAsync();
        Assert.Equal(2, imported.Count);
        Assert.All(imported, item => Assert.Null(item.NativeSegmentId));
        var unrelated = await fixture.Context.Set<SegmentStudioItem>()
            .SingleAsync(item => item.Id == 900);
        Assert.Equal("rejected", unrelated.ReviewState);
        Assert.Equal(7, unrelated.Revision);
        Assert.Equal("{\"unrelated\":true}", unrelated.PayloadJson);
        Assert.Equal(20, unrelated.StartSec);
        Assert.Equal(21, unrelated.EndSec);
        Assert.Equal(
            "Caller edit retained",
            (await fixture.Context.Set<Tag>().AsNoTracking()
                .SingleAsync(tag => tag.Id == 11)).Name);
    }

    private static CovePrincipal UserPrincipal() => new()
    {
        UserId = 7,
        Username = "history-user",
        Kind = PrincipalKind.User,
        Roles = new HashSet<string>(),
        Permissions = new HashSet<string>
        {
            Permissions.SegmentsRead,
            Permissions.SegmentsWrite,
            Permissions.SegmentsDelete,
        },
    };

    private sealed class NoOpNativeAiIngestion : INativeAiProvenanceIngestionService
    {
        public Task<NativeAiIngestionResult> IngestAsync(
            DbContext db, NativeAiIngestionRequest request, CancellationToken ct) =>
            Task.FromResult(new NativeAiIngestionResult(0, 0, 0, null, false, []));
    }

    private sealed class RecordingNativeAiIngestion : INativeAiProvenanceIngestionService
    {
        public List<NativeAiIngestionRequest> Requests { get; } = [];

        public Task<NativeAiIngestionResult> IngestAsync(
            DbContext db, NativeAiIngestionRequest request, CancellationToken ct)
        {
            Requests.Add(request);
            return Task.FromResult(new NativeAiIngestionResult(0, 0, 0, null, false, []));
        }
    }

    private sealed class TransitionFixture : IAsyncDisposable
    {
        private readonly DbContextOptions<TransitionDbContext> _options;
        public TransitionDbContext Context { get; }
        public RecordingAuthorization Authorization { get; } = new();
        public FakeBlobService Blobs { get; }
        public INativeAiProvenanceIngestionService NativeAiIngestion { get; } =
            new NativeAiProvenanceIngestionService(
                new SegmentSourceRegistry(),
                new ProvenanceActivityService(),
                new LineageNodeService(),
                new SegmentProvenanceService());
        public int VideoId => 21;
        public int SegmentId => 101;
        public DateTime UpdatedAt { get; } = new(2026, 7, 22, 9, 0, 0, DateTimeKind.Utc);

        private TransitionFixture(
            TransitionDbContext context,
            DbContextOptions<TransitionDbContext> options,
            bool blobExists)
        {
            Context = context;
            _options = options;
            Blobs = new(blobExists);
        }

        public TransitionDbContext CreateSiblingContext() => new(_options);

        public static async Task<TransitionFixture> CreateAsync(bool blobExists = true)
        {
            var options = new DbContextOptionsBuilder<TransitionDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString()).Options;
            var fixture = new TransitionFixture(new(options), options, blobExists);
            fixture.Context.AddRange(
                new SegmentStudioInstallationState { Id = 1, RequiresLegacyNormalization = false, UpdatedAt = fixture.UpdatedAt },
                new SegmentStudioSource
                {
                    Id = 1,
                    Key = "producer/example",
                    DisplayName = "Example AI",
                    Category = "ai",
                    MetadataJson = "{}",
                    CreatedAt = fixture.UpdatedAt,
                    UpdatedAt = fixture.UpdatedAt,
                },
                new Video { Id = fixture.VideoId, Title = "Visible" },
                new Tag { Id = 11, Name = "Activity" },
                new Segment
                {
                    Id = fixture.SegmentId, HostType = SegmentHostType.Video, HostId = fixture.VideoId,
                    StartSec = 4.25, EndSec = 9.5, TagId = 11, Kind = "tag", RefId = 42,
                    Payload = JsonDocument.Parse("""{"producer":7}"""), SourceKey = "producer/example",
                    SourceRunId = "run-3", Confidence = 0.82f, Title = "Example", ColorHint = "purple",
                    ImageBlobId = "blob-1", CreatedAt = fixture.UpdatedAt.AddDays(-1), UpdatedAt = fixture.UpdatedAt,
                });
            await fixture.Context.SaveChangesAsync();
            fixture.Context.ChangeTracker.Clear();
            return fixture;
        }

        public async ValueTask DisposeAsync() => await Context.DisposeAsync();
    }

    private sealed class TransitionDbContext(DbContextOptions<TransitionDbContext> options) : DbContext(options)
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Ignore<Group>();
            modelBuilder.Entity<Video>(builder => { builder.ToTable("videos"); builder.HasKey(video => video.Id); builder.Ignore(video => video.Studio); builder.Ignore(video => video.ParentVideo); builder.Ignore(video => video.ChildVideos); builder.Ignore(video => video.Urls); builder.Ignore(video => video.Files); builder.Ignore(video => video.VideoTags); builder.Ignore(video => video.VideoPerformers); builder.Ignore(video => video.VideoGalleries); builder.Ignore(video => video.GroupItems); builder.Ignore(video => video.RemoteIds); builder.Ignore(video => video.PlayHistory); });
            modelBuilder.Entity<Tag>(builder => { builder.ToTable("tags"); builder.HasKey(tag => tag.Id); builder.Ignore(tag => tag.TagGroup); builder.Ignore(tag => tag.Aliases); builder.Ignore(tag => tag.ParentRelations); builder.Ignore(tag => tag.ChildRelations); builder.Ignore(tag => tag.RemoteIds); builder.Ignore(tag => tag.VideoTags); builder.Ignore(tag => tag.PerformerTags); builder.Ignore(tag => tag.ImageTags); builder.Ignore(tag => tag.GalleryTags); builder.Ignore(tag => tag.StudioTags); builder.Ignore(tag => tag.GroupTags); });
            modelBuilder.Entity<Segment>(builder => { builder.ToTable("segments"); builder.HasKey(segment => segment.Id); builder.Ignore(segment => segment.Tag); builder.Property(segment => segment.Payload).HasConversion(document => document == null ? null : document.RootElement.GetRawText(), json => json == null ? null : JsonDocument.Parse(json)); });
            modelBuilder.Entity<AiRun>(builder =>
            {
                builder.HasKey(run => run.Id);
                builder.Property(run => run.Request).HasConversion(
                    value => value == null ? null : value.RootElement.GetRawText(),
                    value => value == null ? null : JsonDocument.Parse(value, default));
                builder.Property(run => run.Models).HasConversion(
                    value => value == null ? null : value.RootElement.GetRawText(),
                    value => value == null ? null : JsonDocument.Parse(value, default));
                builder.Property(run => run.Summary).HasConversion(
                    value => value == null ? null : value.RootElement.GetRawText(),
                    value => value == null ? null : JsonDocument.Parse(value, default));
            });
            modelBuilder.Entity<FieldProvenance>(builder =>
            {
                builder.ToTable("field_provenance");
                builder.HasKey(row => row.Id);
            });
            modelBuilder.Entity<Performer>(builder => { builder.ToTable("performers"); builder.HasKey(performer => performer.Id); builder.Ignore(performer => performer.Urls); builder.Ignore(performer => performer.Aliases); builder.Ignore(performer => performer.PerformerTags); builder.Ignore(performer => performer.VideoPerformers); builder.Ignore(performer => performer.AudioPerformers); builder.Ignore(performer => performer.TextPerformers); builder.Ignore(performer => performer.ImagePerformers); builder.Ignore(performer => performer.GalleryPerformers); builder.Ignore(performer => performer.RemoteIds); });
            modelBuilder.Entity<VideoPerformer>(builder => { builder.ToTable("video_performers"); builder.HasKey(link => new { link.VideoId, link.PerformerId }); builder.Ignore(link => link.Video); builder.Ignore(link => link.Performer); });
            SegmentStudioModelConfiguration.Configure(modelBuilder);
        }
    }

    private sealed class RecordingAuthorization : IAuthorizationService
    {
        public AuthorizationResult Authorize(CovePrincipal? principal, string permission, EntityRef? entity = null) => AuthorizationResult.Allow();
        public Task<AuthorizationResult> AuthorizeAsync(CovePrincipal? principal, string permission, EntityRef? entity, CancellationToken ct) => Task.FromResult(AuthorizationResult.Allow());
        public void Require(CovePrincipal? principal, string permission, EntityRef? entity = null) { }
        public bool Has(CovePrincipal? principal, string permission) => true;
    }

    private sealed class DeniedAuthorization : IAuthorizationService
    {
        public AuthorizationResult Authorize(CovePrincipal? principal, string permission, EntityRef? entity = null) => AuthorizationResult.Deny("Denied", permission);
        public Task<AuthorizationResult> AuthorizeAsync(CovePrincipal? principal, string permission, EntityRef? entity, CancellationToken ct) => Task.FromResult(AuthorizationResult.Deny("Denied", permission));
        public void Require(CovePrincipal? principal, string permission, EntityRef? entity = null) => throw new NotSupportedException();
        public bool Has(CovePrincipal? principal, string permission) => false;
    }

    private sealed class DeleteDeniedAuthorization : IAuthorizationService
    {
        private static AuthorizationResult Result(string permission) =>
            permission == Permissions.SegmentsDelete
                ? AuthorizationResult.Deny("Denied", permission)
                : AuthorizationResult.Allow();
        public AuthorizationResult Authorize(CovePrincipal? principal, string permission, EntityRef? entity = null) => Result(permission);
        public Task<AuthorizationResult> AuthorizeAsync(CovePrincipal? principal, string permission, EntityRef? entity, CancellationToken ct) => Task.FromResult(Result(permission));
        public void Require(CovePrincipal? principal, string permission, EntityRef? entity = null)
        {
            if (!Result(permission).Allowed)
                throw new NotSupportedException();
        }
        public bool Has(CovePrincipal? principal, string permission) => Result(permission).Allowed;
    }

    private sealed class NoProvenanceAuthorization : IAuthorizationService
    {
        private static AuthorizationResult Result(string permission) =>
            permission == SegmentStudioExtension.ProvenanceReadPermission
                ? AuthorizationResult.Deny("Denied", permission)
                : AuthorizationResult.Allow();
        public AuthorizationResult Authorize(CovePrincipal? principal, string permission, EntityRef? entity = null) => Result(permission);
        public Task<AuthorizationResult> AuthorizeAsync(CovePrincipal? principal, string permission, EntityRef? entity, CancellationToken ct) => Task.FromResult(Result(permission));
        public void Require(CovePrincipal? principal, string permission, EntityRef? entity = null) { }
        public bool Has(CovePrincipal? principal, string permission) => Result(permission).Allowed;
    }

    private sealed class VideoVisibilityAuthorization(int hiddenVideoId) : IAuthorizationService
    {
        private AuthorizationResult Result(EntityRef? entity) => entity?.Id == hiddenVideoId.ToString()
            ? AuthorizationResult.Deny("Hidden", Permissions.SegmentsRead)
            : AuthorizationResult.Allow();
        public AuthorizationResult Authorize(CovePrincipal? principal, string permission, EntityRef? entity = null) => Result(entity);
        public Task<AuthorizationResult> AuthorizeAsync(CovePrincipal? principal, string permission, EntityRef? entity, CancellationToken ct) => Task.FromResult(Result(entity));
        public void Require(CovePrincipal? principal, string permission, EntityRef? entity = null) { }
        public bool Has(CovePrincipal? principal, string permission) => true;
    }

    private sealed class FakeBlobService(bool exists, int failures = 0) : IBlobService
    {
        private int _failures = failures;
        public List<string> DeletedBlobIds { get; } = [];
        public Task<string> StoreBlobAsync(Stream data, string contentType, CancellationToken ct = default) =>
            Task.FromResult("export-blob-1");
        public Task<(Stream Stream, string ContentType)?> GetBlobAsync(string blobId, CancellationToken ct = default) =>
            Task.FromResult<(Stream, string)?>(exists ? (new MemoryStream([1]), "image/jpeg") : null);
        public Task DeleteBlobAsync(string blobId, CancellationToken ct = default)
        {
            if (_failures-- > 0)
                throw new InvalidOperationException("Injected blob deletion failure.");
            DeletedBlobIds.Add(blobId);
            return Task.CompletedTask;
        }
    }
}
