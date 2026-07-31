namespace SegmentStudio.Tests;

using System.Text.Json;
using Cove.Core.Auth;
using Cove.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Npgsql;

public sealed class DirectSegmentReviewServiceTests
{
    [Fact]
    public async Task BasicNativeCreateProducesOnlyANativeSegment()
    {
        await using var fixture = await DirectFixture.CreateAsync();

        var created = await BasicNativeSegmentService.CreateAsync(
            fixture.Context,
            fixture.VisibleVideoId,
            new(11, 30, 36.25),
            CovePrincipal.System(),
            new RecordingAuthorizationService(AuthorizationResult.Allow()),
            CancellationToken.None);

        var segment = await fixture.Context.Set<Segment>()
            .SingleAsync(candidate => candidate.Id == created.NativeSegmentId);
        Assert.Equal("user", segment.SourceKey);
        Assert.Null(segment.Payload);
        Assert.False(await fixture.Context.Set<SegmentStudioItem>()
            .AnyAsync(item => item.NativeSegmentId == segment.Id));
    }

    [Fact]
    public async Task RejectingNativeRootRejectsOnlyDescendantsWhoseAllSourcesAreRejected()
    {
        await using var fixture = await DirectFixture.CreateAsync();
        var now = fixture.OriginalUpdatedAt;
        var alternate = new Segment
        {
            Id = 102, HostType = SegmentHostType.Video, HostId = fixture.VisibleVideoId,
            Kind = "tag", TagId = 11, StartSec = 20, EndSec = 24, UpdatedAt = now,
        };
        var derived = new Segment
        {
            Id = 103, HostType = SegmentHostType.Video, HostId = fixture.VisibleVideoId,
            Kind = "tag", TagId = 11, StartSec = 20, EndSec = 24, UpdatedAt = now,
        };
        var grandchild = new Segment
        {
            Id = 104, HostType = SegmentHostType.Video, HostId = fixture.VisibleVideoId,
            Kind = "tag", TagId = 11, StartSec = 20, EndSec = 24, UpdatedAt = now,
        };
        var rootNode = new SegmentStudioLineageNode { Id = Guid.NewGuid(), ItemId = 500, State = "live", LastKnownVideoId = 21, CreatedAt = now, UpdatedAt = now };
        var alternateNode = new SegmentStudioLineageNode { Id = Guid.NewGuid(), ItemId = 501, State = "live", LastKnownVideoId = 21, CreatedAt = now, UpdatedAt = now };
        var derivedNode = new SegmentStudioLineageNode { Id = Guid.NewGuid(), ItemId = 502, State = "live", LastKnownVideoId = 21, CreatedAt = now, UpdatedAt = now };
        var grandchildNode = new SegmentStudioLineageNode { Id = Guid.NewGuid(), ItemId = 503, State = "live", LastKnownVideoId = 21, CreatedAt = now, UpdatedAt = now };
        var rule = new SegmentStudioDerivationRule { Id = Guid.NewGuid(), Key = "rule", Version = "1", SourceTagId = 11, DerivedTagId = 11, MetadataJson = "{}", CreatedAt = now, UpdatedAt = now };
        fixture.Context.AddRange(alternate, derived, grandchild,
            new SegmentStudioItem { Id = 500, NativeSegmentId = fixture.SegmentId, CreatedAt = now, UpdatedAt = now },
            new SegmentStudioItem { Id = 501, NativeSegmentId = alternate.Id, CreatedAt = now, UpdatedAt = now },
            new SegmentStudioItem { Id = 502, NativeSegmentId = derived.Id, CreatedAt = now, UpdatedAt = now },
            new SegmentStudioItem { Id = 503, NativeSegmentId = grandchild.Id, CreatedAt = now, UpdatedAt = now },
            rootNode, alternateNode, derivedNode, grandchildNode, rule,
            new SegmentStudioDerivationEdge { SourceNodeId = rootNode.Id, DerivedNodeId = derivedNode.Id, RuleId = rule.Id, SourceTagIdAtCreation = 11, DerivedTagIdAtCreation = 11, MetadataJson = "{}", CreatedAt = now, UpdatedAt = now },
            new SegmentStudioDerivationEdge { SourceNodeId = alternateNode.Id, DerivedNodeId = derivedNode.Id, RuleId = rule.Id, SourceTagIdAtCreation = 11, DerivedTagIdAtCreation = 11, MetadataJson = "{}", CreatedAt = now, UpdatedAt = now },
            new SegmentStudioDerivationEdge { SourceNodeId = derivedNode.Id, DerivedNodeId = grandchildNode.Id, RuleId = rule.Id, SourceTagIdAtCreation = 11, DerivedTagIdAtCreation = 11, MetadataJson = "{}", CreatedAt = now, UpdatedAt = now });
        await fixture.Context.SaveChangesAsync();
        fixture.Context.ChangeTracker.Clear();

        var authorization = new RecordingAuthorizationService(AuthorizationResult.Allow());
        var first = await DirectSegmentReviewService.UpdateAuthorizedAsync(
            fixture.Context, fixture.VisibleVideoId, fixture.SegmentId,
            new("rejected", 12.5, 18.75, fixture.OriginalUpdatedAt), CovePrincipal.System(), authorization, CancellationToken.None);

        Assert.Equal(DirectSegmentMutationStatus.Updated, first.Status);
        Assert.Equal("unreviewed", DirectSegmentReviewService.ReadReviewState(
            (await fixture.Context.Set<Segment>().SingleAsync(segment => segment.Id == derived.Id)).Payload));
        Assert.Equal("unreviewed", DirectSegmentReviewService.ReadReviewState(
            (await fixture.Context.Set<Segment>().SingleAsync(segment => segment.Id == grandchild.Id)).Payload));

        var second = await DirectSegmentReviewService.UpdateAuthorizedAsync(
            fixture.Context, fixture.VisibleVideoId, alternate.Id,
            new("rejected", alternate.StartSec, alternate.EndSec, now), CovePrincipal.System(), authorization, CancellationToken.None);

        Assert.Equal(DirectSegmentMutationStatus.Updated, second.Status);
        Assert.Equal("rejected", DirectSegmentReviewService.ReadReviewState(
            (await fixture.Context.Set<Segment>().SingleAsync(segment => segment.Id == derived.Id)).Payload));
        Assert.Equal("rejected", DirectSegmentReviewService.ReadReviewState(
            (await fixture.Context.Set<Segment>().SingleAsync(segment => segment.Id == grandchild.Id)).Payload));
    }

    [Fact]
    public async Task NativeDuplicateAtPlayheadPreservesDurationAndCanonicalMetadata()
    {
        await using var fixture = await DirectFixture.CreateAsync();
        await fixture.SeedSlotAsync();
        var nodes = new LineageNodeService();
        var provenance = new SegmentProvenanceService();
        var source = await new SegmentSourceRegistry().RegisterAsync(
            fixture.Context,
            new SegmentSourceRegistration(
                "producer/example", "Producer", "model", "Example", null, null, "{}"),
            CancellationToken.None);
        var sourceNode = await nodes.EnsureAsync(fixture.Context, 900, CancellationToken.None);
        await provenance.AppendAsync(
            fixture.Context,
            new SegmentProvenanceAppend(
                sourceNode.Id, source.Id, "origin", null, "model", "example", "7",
                0.84f, fixture.OriginalUpdatedAt, """{"source":"native"}"""),
            CancellationToken.None);

        var result = await DirectSegmentReviewService.DuplicateAuthorizedAsync(
            fixture.Context, fixture.VisibleVideoId, fixture.SegmentId,
            new(fixture.OriginalUpdatedAt, 30), CovePrincipal.System(),
            new RecordingAuthorizationService(AuthorizationResult.Allow()),
            new SegmentDuplicationProvenanceService(nodes, provenance), CancellationToken.None);

        Assert.Equal(DirectSegmentMutationStatus.Updated, result.Status);
        Assert.Equal((30, 36.25), (result.Segment!.StartSec, result.Segment.EndSec));
        var duplicate = await fixture.Context.Set<Segment>().SingleAsync(segment => segment.Id == result.Segment.Id);
        Assert.Equal("producer/example", duplicate.SourceKey);
        Assert.Equal("run-7", duplicate.SourceRunId);
        Assert.Equal(0.84f, duplicate.Confidence);
        Assert.Equal(7, duplicate.Payload!.RootElement.GetProperty("producerField").GetProperty("value").GetInt32());
        var duplicateAnchor = await fixture.Context.Set<SegmentStudioItem>()
            .SingleAsync(item => item.NativeSegmentId == duplicate.Id);
        Assert.True(await fixture.Context.Set<SegmentStudioSegmentSlot>()
            .AnyAsync(slot => slot.ItemId == duplicateAnchor.Id && slot.PerformerId == 41));
        var copied = Assert.Single(await provenance.GetForItemAsync(
            fixture.Context, duplicateAnchor.Id, CancellationToken.None));
        Assert.Equal("producer/example", copied.SourceKey);
        Assert.Equal("origin", copied.Relation);
        Assert.Equal("""{"source":"native"}""", copied.MetadataJson);
    }

    [Fact]
    public async Task BasicNativeDuplicateStripsReviewStateAndDoesNotCopyExtensionMetadata()
    {
        await using var fixture = await DirectFixture.CreateAsync(
            """{"producerField":{"value":7},"segmentStudio":{"schemaVersion":1,"reviewState":"approved"}}""");
        await fixture.SeedSlotAsync();
        var nodes = new LineageNodeService();
        var provenance = new SegmentProvenanceService();

        var result = await DirectSegmentReviewService.DuplicateAuthorizedAsync(
            fixture.Context, fixture.VisibleVideoId, fixture.SegmentId,
            new(fixture.OriginalUpdatedAt, 30), CovePrincipal.System(),
            new RecordingAuthorizationService(AuthorizationResult.Allow()),
            new SegmentDuplicationProvenanceService(nodes, provenance),
            CancellationToken.None,
            preserveExtensionMetadata: false);

        Assert.Equal(DirectSegmentMutationStatus.Updated, result.Status);
        var duplicate = await fixture.Context.Set<Segment>()
            .SingleAsync(segment => segment.Id == result.Segment!.Id);
        Assert.Equal(7, duplicate.Payload!.RootElement
            .GetProperty("producerField").GetProperty("value").GetInt32());
        Assert.False(duplicate.Payload.RootElement.TryGetProperty(
            "segmentStudio", out _));
        Assert.False(await fixture.Context.Set<SegmentStudioItem>()
            .AnyAsync(item => item.NativeSegmentId == duplicate.Id));
        Assert.True(await fixture.Context.Set<SegmentStudioItem>()
            .AnyAsync(item => item.NativeSegmentId == fixture.SegmentId));
    }

    [Fact]
    public async Task BasicNativeUpdateRejectsReviewState()
    {
        await using var fixture = await DirectFixture.CreateAsync(
            """{"segmentStudio":{"schemaVersion":1,"reviewState":"approved"}}""");

        var result = await DirectSegmentReviewService.UpdateAuthorizedAsync(
            fixture.Context, fixture.VisibleVideoId, fixture.SegmentId,
            new("rejected", 12.5, 18.75, fixture.OriginalUpdatedAt),
            CovePrincipal.System(),
            new RecordingAuthorizationService(AuthorizationResult.Allow()),
            CancellationToken.None,
            preserveExtensionMetadata: false);

        Assert.Equal(DirectSegmentMutationStatus.Invalid, result.Status);
        Assert.Equal(
            "Review states are unavailable in Basic mode.",
            result.Error);
        var segment = await fixture.Context.Set<Segment>()
            .SingleAsync(candidate => candidate.Id == fixture.SegmentId);
        Assert.Equal(
            "approved",
            DirectSegmentReviewService.ReadReviewState(segment.Payload));
    }

    [Fact]
    public async Task BasicNativeRetagProtectsHiddenFullMetadata()
    {
        await using var fixture = await DirectFixture.CreateAsync();
        await fixture.SeedSlotAsync();
        fixture.Context.Add(new Tag { Id = 12, Name = "Replacement" });
        await fixture.Context.SaveChangesAsync();

        var result = await DirectSegmentReviewService.UpdateAuthorizedAsync(
            fixture.Context,
            fixture.VisibleVideoId,
            fixture.SegmentId,
            new(
                null,
                12.5,
                18.75,
                fixture.OriginalUpdatedAt,
                TagId: 12),
            CovePrincipal.System(),
            new RecordingAuthorizationService(AuthorizationResult.Allow()),
            CancellationToken.None,
            preserveExtensionMetadata: false);

        Assert.Equal(DirectSegmentMutationStatus.Conflict, result.Status);
        Assert.Equal("FULL_METADATA_PROTECTED", result.Code);
        Assert.Equal(11, (await fixture.Context.Set<Segment>()
            .SingleAsync(segment => segment.Id == fixture.SegmentId)).TagId);
    }

    [Fact]
    public async Task NativeSplitPreservesMetadataOnBothApprovedRanges()
    {
        await using var fixture = await DirectFixture.CreateAsync();
        await fixture.SeedSlotAsync();

        var result = await DirectSegmentReviewService.SplitAuthorizedAsync(
            fixture.Context, fixture.VisibleVideoId, fixture.SegmentId,
            new(fixture.OriginalUpdatedAt, 15), CovePrincipal.System(),
            new RecordingAuthorizationService(AuthorizationResult.Allow()), CancellationToken.None);

        Assert.Equal(DirectSegmentMutationStatus.Updated, result.Status);
        var ranges = await fixture.Context.Set<Segment>().Where(segment => segment.HostId == fixture.VisibleVideoId)
            .OrderBy(segment => segment.StartSec).ToListAsync();
        Assert.Equal([(12.5, (double?)15), (15, (double?)18.75)], ranges.Select(segment => (segment.StartSec, segment.EndSec)).ToArray());
        Assert.All(ranges, segment => Assert.Equal("producer/example", segment.SourceKey));
        Assert.All(ranges, segment => Assert.Equal(7, segment.Payload!.RootElement.GetProperty("producerField").GetProperty("value").GetInt32()));
        var secondAnchor = await fixture.Context.Set<SegmentStudioItem>()
            .SingleAsync(item => item.NativeSegmentId == result.Segment!.Id);
        Assert.True(await fixture.Context.Set<SegmentStudioSegmentSlot>()
            .AnyAsync(slot => slot.ItemId == secondAnchor.Id && slot.PerformerId == 41));
    }

    [Fact]
    public async Task NativeMergeRetainsChronologicallyFirstIdentityAndConsumesSecondRange()
    {
        await using var fixture = await DirectFixture.CreateAsync();
        var second = new Segment
        {
            Id = 102, HostType = SegmentHostType.Video, HostId = fixture.VisibleVideoId,
            StartSec = 20, EndSec = 27, TagId = 11, Kind = "tag", SourceKey = "other",
            CreatedAt = fixture.OriginalUpdatedAt, UpdatedAt = fixture.OriginalUpdatedAt,
        };
        fixture.Context.Add(second);
        await fixture.Context.SaveChangesAsync();

        var result = await DirectSegmentReviewService.MergeAuthorizedAsync(
            fixture.Context, fixture.VisibleVideoId, second.Id,
            new(Guid.NewGuid(), fixture.SegmentId, second.UpdatedAt, fixture.OriginalUpdatedAt),
            CovePrincipal.System(), new RecordingAuthorizationService(AuthorizationResult.Allow()),
            CancellationToken.None);

        Assert.Equal(DirectSegmentMutationStatus.Updated, result.Status);
        Assert.Equal(fixture.SegmentId, result.Segment!.Id);
        Assert.Equal((12.5, (double?)27), (result.Segment.StartSec, result.Segment.EndSec));
        Assert.Equal("user", result.Segment.SourceKey);
        Assert.Null(result.Segment.SourceRunId);
        Assert.Null(result.Segment.Confidence);
        Assert.Equal([fixture.SegmentId], await fixture.Context.Set<Segment>()
            .Where(segment => segment.HostId == fixture.VisibleVideoId).Select(segment => segment.Id).ToArrayAsync());
    }

    [Fact]
    public async Task BasicNativeMergeDoesNotDiscardHiddenFullMetadata()
    {
        await using var fixture = await DirectFixture.CreateAsync();
        var second = new Segment
        {
            Id = 102, HostType = SegmentHostType.Video, HostId = fixture.VisibleVideoId,
            StartSec = 20, EndSec = 27, TagId = 11, Kind = "tag",
            SourceKey = "user", CreatedAt = fixture.OriginalUpdatedAt,
            UpdatedAt = fixture.OriginalUpdatedAt,
        };
        fixture.Context.AddRange(
            second,
            new SegmentStudioItem
            {
                Id = 901,
                NativeSegmentId = second.Id,
                CreatedAt = fixture.OriginalUpdatedAt,
                UpdatedAt = fixture.OriginalUpdatedAt,
            });
        await fixture.Context.SaveChangesAsync();
        fixture.Context.ChangeTracker.Clear();

        var result = await DirectSegmentReviewService.MergeAuthorizedAsync(
            fixture.Context, fixture.VisibleVideoId, fixture.SegmentId,
            new(Guid.NewGuid(), second.Id, fixture.OriginalUpdatedAt,
                fixture.OriginalUpdatedAt),
            CovePrincipal.System(),
            new RecordingAuthorizationService(AuthorizationResult.Allow()),
            CancellationToken.None,
            preserveExtensionMetadata: false);

        Assert.Equal(DirectSegmentMutationStatus.Conflict, result.Status);
        Assert.Equal(2, await fixture.Context.Set<Segment>()
            .CountAsync(segment => segment.HostId == fixture.VisibleVideoId));
        Assert.True(await fixture.Context.Set<SegmentStudioItem>()
            .AnyAsync(item => item.NativeSegmentId == second.Id));
    }

    [Fact]
    public async Task BasicNativeHistoryRestoresAndReappliesMergedCardinalityIdempotently()
    {
        await using var fixture = await DirectFixture.CreateAsync();
        var second = new Segment
        {
            Id = 102, HostType = SegmentHostType.Video, HostId = fixture.VisibleVideoId,
            StartSec = 20, EndSec = 27, TagId = 11, Kind = "tag",
            SourceKey = "producer/second", SourceRunId = "run-2", Confidence = 0.62f,
            RefId = 99,
            Payload = JsonDocument.Parse("""{"custom":"second"}"""),
            Title = "Second title",
            ColorHint = "blue",
            ImageBlobId = "blob-second",
            CreatedAt = fixture.OriginalUpdatedAt.AddDays(-2),
            UpdatedAt = fixture.OriginalUpdatedAt,
        };
        fixture.Context.AddRange(
            second,
            new FieldProvenance
            {
                HostType = AffinityHostType.Segment,
                HostId = second.Id,
                FieldKey = "tag_id",
                ValueJson = "11",
                SourceKey = "producer/second",
                SourceRunId = "run-2",
                ModelKey = "model-2",
                Confidence = 0.62f,
                CreatedAt = fixture.OriginalUpdatedAt.AddHours(-3),
                UpdatedAt = fixture.OriginalUpdatedAt.AddHours(-3),
            });
        await fixture.Context.SaveChangesAsync();
        fixture.Context.ChangeTracker.Clear();
        var before = await NativeHistoryStateAsync(
            fixture.Context, fixture.VisibleVideoId);
        var authorization = new RecordingAuthorizationService(
            AuthorizationResult.Allow());

        var merged = await DirectSegmentReviewService.MergeAuthorizedAsync(
            fixture.Context, fixture.VisibleVideoId, fixture.SegmentId,
            new(Guid.NewGuid(), second.Id, fixture.OriginalUpdatedAt, fixture.OriginalUpdatedAt),
            CovePrincipal.System(), authorization, CancellationToken.None,
            preserveExtensionMetadata: false);
        Assert.Equal(DirectSegmentMutationStatus.Updated, merged.Status);
        fixture.Context.ChangeTracker.Clear();
        var after = await NativeHistoryStateAsync(
            fixture.Context, fixture.VisibleVideoId);

        var history = await fixture.SeedBasicHistoryAsync(before, after);
        var undoRequest = new BasicNativeHistoryRestoreRequest(
            Guid.NewGuid(), history.Revision, history.Sequence, "backward");
        var undone = await BasicNativeHistoryService.RestoreAsync(
            fixture.Context, fixture.VisibleVideoId, undoRequest,
            UserPrincipal(), authorization, CancellationToken.None);

        Assert.Equal(BasicNativeHistoryRestoreStatus.Updated, undone.Status);
        fixture.Context.ChangeTracker.Clear();
        var restored = await fixture.Context.Set<Segment>()
            .Where(segment => segment.HostId == fixture.VisibleVideoId)
            .OrderBy(segment => segment.StartSec)
            .ToListAsync();
        Assert.Equal(
            [(12.5, (double?)18.75), (20, (double?)27)],
            restored.Select(segment => (segment.StartSec, segment.EndSec)).ToArray());
        Assert.Equal("producer/example", restored[0].SourceKey);
        Assert.Equal("producer/second", restored[1].SourceKey);
        Assert.Equal("run-2", restored[1].SourceRunId);
        Assert.Equal(0.62f, restored[1].Confidence);
        Assert.Equal(99, restored[1].RefId);
        Assert.Equal(
            "second",
            restored[1].Payload!.RootElement.GetProperty("custom").GetString());
        Assert.Equal("Second title", restored[1].Title);
        Assert.Equal("blue", restored[1].ColorHint);
        Assert.Equal("blob-second", restored[1].ImageBlobId);
        Assert.Equal(
            fixture.OriginalUpdatedAt.AddDays(-2),
            restored[1].CreatedAt);
        var restoredEvidence = Assert.Single(await fixture.Context
            .Set<FieldProvenance>()
            .Where(row => row.HostId == restored[1].Id)
            .ToListAsync());
        Assert.Equal("model-2", restoredEvidence.ModelKey);

        var replayed = await BasicNativeHistoryService.RestoreAsync(
            fixture.Context, fixture.VisibleVideoId, undoRequest,
            UserPrincipal(), authorization, CancellationToken.None);
        Assert.Equal(BasicNativeHistoryRestoreStatus.Updated, replayed.Status);
        Assert.True(replayed.Replayed);
        Assert.Equal(2, await fixture.Context.Set<Segment>()
            .CountAsync(segment => segment.HostId == fixture.VisibleVideoId));

        fixture.Context.ChangeTracker.Clear();
        var redone = await BasicNativeHistoryService.RestoreAsync(
            fixture.Context, fixture.VisibleVideoId,
            new(
                Guid.NewGuid(),
                undone.History!.Revision,
                history.Sequence,
                "forward"),
            UserPrincipal(), authorization, CancellationToken.None);
        Assert.Equal(BasicNativeHistoryRestoreStatus.Updated, redone.Status);
        Assert.Single(await fixture.Context.Set<Segment>()
            .Where(segment => segment.HostId == fixture.VisibleVideoId)
            .ToListAsync());
    }

    [Fact]
    public async Task BasicNativeHistoryConflictsWithoutChangingStaleState()
    {
        await using var fixture = await DirectFixture.CreateAsync();
        var source = await NativeHistoryStateAsync(
            fixture.Context, fixture.VisibleVideoId);
        var target = JsonSerializer.SerializeToElement(new
        {
            type = "segments",
            segments = new[]
            {
                new
                {
                    identity = new
                    {
                        nativeSegmentId = fixture.SegmentId,
                        updatedAt = fixture.OriginalUpdatedAt,
                    },
                    values = new
                    {
                        startSec = 1.0,
                        endSec = (double?)2,
                        tagId = 11,
                        sourceKey = "user",
                        sourceRunId = (string?)null,
                        confidence = (float?)null,
                        kind = "tag",
                        refId = (string?)null,
                        payloadJson = (string?)null,
                        title = (string?)null,
                        colorHint = (string?)null,
                        imageBlobId = (string?)null,
                        createdAt = fixture.OriginalUpdatedAt,
                        fieldProvenance = Array.Empty<object>(),
                    },
                },
            },
        });
        var segment = await fixture.Context.Set<Segment>()
            .SingleAsync(candidate => candidate.Id == fixture.SegmentId);
        segment.StartSec = 12.75;
        segment.UpdatedAt = fixture.OriginalUpdatedAt.AddSeconds(1);
        await fixture.Context.SaveChangesAsync();
        fixture.Context.ChangeTracker.Clear();

        var result = await BasicNativeHistoryService.RestoreAsync(
            fixture.Context, fixture.VisibleVideoId,
            new(
                Guid.NewGuid(),
                (await fixture.SeedBasicHistoryAsync(target, source)).Revision,
                1,
                "backward"),
            UserPrincipal(),
            new RecordingAuthorizationService(AuthorizationResult.Allow()),
            CancellationToken.None);

        Assert.Equal(BasicNativeHistoryRestoreStatus.Conflict, result.Status);
        var unchanged = await fixture.Context.Set<Segment>()
            .SingleAsync(candidate => candidate.Id == fixture.SegmentId);
        Assert.Equal((12.75, (double?)18.75), (
            unchanged.StartSec, unchanged.EndSec));
    }

    [Fact]
    public async Task BasicNativeHistoryRejectsOutOfOrderForwardReplay()
    {
        await using var fixture = await DirectFixture.CreateAsync();
        var after = await NativeHistoryStateAsync(
            fixture.Context, fixture.VisibleVideoId);
        var empty = JsonSerializer.SerializeToElement(new
        {
            type = "segments",
            segments = Array.Empty<object>(),
        });
        var history = await fixture.SeedBasicHistoryAsync(empty, after);
        var segment = await fixture.Context.Set<Segment>()
            .SingleAsync(candidate => candidate.Id == fixture.SegmentId);
        segment.Title = "Newer title";
        segment.UpdatedAt = fixture.OriginalUpdatedAt.AddSeconds(1);
        await fixture.Context.SaveChangesAsync();
        fixture.Context.ChangeTracker.Clear();

        var result = await BasicNativeHistoryService.RestoreAsync(
            fixture.Context,
            fixture.VisibleVideoId,
            new(
                Guid.NewGuid(),
                history.Revision,
                history.Sequence,
                "forward"),
            UserPrincipal(),
            new RecordingAuthorizationService(AuthorizationResult.Allow()),
            CancellationToken.None);

        Assert.Equal(
            BasicNativeHistoryRestoreStatus.Conflict,
            result.Status);
        var unchanged = await fixture.Context.Set<Segment>()
            .SingleAsync(candidate => candidate.Id == fixture.SegmentId);
        Assert.Equal("Newer title", unchanged.Title);
        Assert.Empty(await fixture.Context
            .Set<SegmentStudioSegmentOperation>()
            .ToListAsync());
    }

    [Fact]
    public async Task BasicNativeHistoryDoesNotRemoveSegmentsWithFullMetadata()
    {
        await using var fixture = await DirectFixture.CreateAsync();
        await fixture.SeedSlotAsync();
        var source = await NativeHistoryStateAsync(
            fixture.Context, fixture.VisibleVideoId);
        var empty = JsonSerializer.SerializeToElement(new
        {
            type = "segments",
            segments = Array.Empty<object>(),
        });

        var result = await BasicNativeHistoryService.RestoreAsync(
            fixture.Context, fixture.VisibleVideoId,
            new(
                Guid.NewGuid(),
                (await fixture.SeedBasicHistoryAsync(empty, source)).Revision,
                1,
                "backward"),
            UserPrincipal(),
            new RecordingAuthorizationService(AuthorizationResult.Allow()),
            CancellationToken.None);

        Assert.Equal(BasicNativeHistoryRestoreStatus.Conflict, result.Status);
        Assert.True(await fixture.Context.Set<Segment>()
            .AnyAsync(segment => segment.Id == fixture.SegmentId));
        Assert.True(await fixture.Context.Set<SegmentStudioItem>()
            .AnyAsync(item => item.NativeSegmentId == fixture.SegmentId));
        Assert.Empty(await fixture.Context.Set<SegmentStudioSegmentOperation>()
            .ToListAsync());
    }

    [Fact]
    public async Task NativeMergeTreatsPointSegmentStartAsItsEffectiveEnd()
    {
        await using var fixture = await DirectFixture.CreateAsync();
        var point = new Segment
        {
            Id = 102, HostType = SegmentHostType.Video, HostId = fixture.VisibleVideoId,
            StartSec = 20, EndSec = null, TagId = 11, Kind = "tag", SourceKey = "other",
            CreatedAt = fixture.OriginalUpdatedAt, UpdatedAt = fixture.OriginalUpdatedAt,
        };
        fixture.Context.Add(point);
        await fixture.Context.SaveChangesAsync();

        var result = await DirectSegmentReviewService.MergeAuthorizedAsync(
            fixture.Context, fixture.VisibleVideoId, point.Id,
            new(Guid.NewGuid(), fixture.SegmentId, point.UpdatedAt, fixture.OriginalUpdatedAt),
            CovePrincipal.System(), new RecordingAuthorizationService(AuthorizationResult.Allow()),
            CancellationToken.None);

        Assert.Equal(DirectSegmentMutationStatus.Updated, result.Status);
        Assert.Equal((12.5, (double?)20), (result.Segment!.StartSec, result.Segment.EndSec));
    }

    [Fact]
    public async Task NativeMergeLocksPostgreSqlRowsAndPreservesAnchorRepresentation()
    {
        var connectionString = Environment.GetEnvironmentVariable("COVE__Postgres__ConnectionString")
            ?? Environment.GetEnvironmentVariable("DATABASE_URL");
        if (string.IsNullOrWhiteSpace(connectionString))
            return;

        var schema = $"segment_studio_direct_merge_test_{Guid.NewGuid():N}";
        var builder = new NpgsqlConnectionStringBuilder(connectionString) { SearchPath = schema };
        await using var admin = new NpgsqlConnection(connectionString);
        await admin.OpenAsync();
        await using (var createSchema = new NpgsqlCommand($"CREATE SCHEMA \"{schema}\"", admin))
            await createSchema.ExecuteNonQueryAsync();
        try
        {
            var options = new DbContextOptionsBuilder<DirectDbContext>()
                .UseNpgsql(builder.ConnectionString).Options;
            await using var context = new DirectDbContext(options, hiddenVideoId: -1);
            await context.Database.ExecuteSqlRawAsync(context.Database.GenerateCreateScript());
            var now = new DateTime(2026, 7, 20, 5, 0, 0, DateTimeKind.Utc);
            var first = new Segment
            {
                Id = 101, HostType = SegmentHostType.Video, HostId = 21,
                StartSec = 12.5, EndSec = 18.75, TagId = 11, Kind = "tag",
                SourceKey = "user", CreatedAt = now, UpdatedAt = now,
            };
            var second = new Segment
            {
                Id = 102, HostType = SegmentHostType.Video, HostId = 21,
                StartSec = 20, EndSec = 27, TagId = 11, Kind = "tag",
                SourceKey = "user", CreatedAt = now, UpdatedAt = now,
            };
            context.AddRange(
                new Video { Id = 21, Title = "Visible" },
                new Tag { Id = 11, Name = "Candidate" },
                first,
                second,
                new SegmentStudioItem
                {
                    Id = 501, NativeSegmentId = first.Id, CreatedAt = now, UpdatedAt = now,
                },
                new SegmentStudioItem
                {
                    Id = 502, NativeSegmentId = second.Id, CreatedAt = now, UpdatedAt = now,
                });
            await context.SaveChangesAsync();

            var result = await DirectSegmentReviewService.MergeAuthorizedAsync(
                context, 21, second.Id,
                new(Guid.NewGuid(), first.Id, second.UpdatedAt, first.UpdatedAt),
                CovePrincipal.System(), new RecordingAuthorizationService(AuthorizationResult.Allow()),
                CancellationToken.None);

            Assert.Equal(DirectSegmentMutationStatus.Updated, result.Status);
            Assert.Equal(first.Id, result.Segment!.Id);
            Assert.Equal([first.Id], await context.Set<Segment>().Select(segment => segment.Id).ToArrayAsync());
            var anchor = Assert.Single(await context.Set<SegmentStudioItem>().ToListAsync());
            Assert.Equal(first.Id, anchor.NativeSegmentId);
            Assert.Null(anchor.SourceKey);
            Assert.Null(anchor.SourceRunId);
            Assert.Null(anchor.Confidence);
        }
        finally
        {
            await using var dropSchema = new NpgsqlCommand($"DROP SCHEMA \"{schema}\" CASCADE", admin);
            await dropSchema.ExecuteNonQueryAsync();
        }
    }

    [Fact]
    public async Task DirectApiCannotRetagDerivedNativeSegment()
    {
        await using var fixture = await DirectFixture.CreateAsync();
        var now = DateTime.UtcNow;
        var sourceNode = new SegmentStudioLineageNode
        {
            Id = Guid.NewGuid(), ItemId = 500, State = "live", LastKnownVideoId = 21,
            LastKnownTagId = 10, CreatedAt = now, UpdatedAt = now,
        };
        var derivedNode = new SegmentStudioLineageNode
        {
            Id = Guid.NewGuid(), ItemId = 501, State = "live", LastKnownVideoId = 21,
            LastKnownTagId = 11, CreatedAt = now, UpdatedAt = now,
        };
        var rule = new SegmentStudioDerivationRule
        {
            Id = Guid.NewGuid(), Key = "derived", Version = "1", SourceTagId = 10,
            DerivedTagId = 11, MetadataJson = "{}", CreatedAt = now, UpdatedAt = now,
        };
        fixture.Context.AddRange(
            new Tag { Id = 12, Name = "Other" },
            new SegmentStudioItem
            {
                Id = 500, VideoId = 21, TagId = 10, StartSec = 1, Kind = "tag",
                ReviewState = "unreviewed", Revision = 1, CreatedAt = now, UpdatedAt = now,
            },
            new SegmentStudioItem
            {
                Id = 501, NativeSegmentId = 101, TagId = 11, StartSec = 12.5, Kind = "tag",
                ReviewState = "unreviewed", Revision = 1, CreatedAt = now, UpdatedAt = now,
            },
            sourceNode,
            derivedNode,
            rule,
            new SegmentStudioDerivationEdge
            {
                SourceNodeId = sourceNode.Id, DerivedNodeId = derivedNode.Id, RuleId = rule.Id,
                SourceTagIdAtCreation = 10, DerivedTagIdAtCreation = 11, MetadataJson = "{}",
                CreatedAt = now, UpdatedAt = now,
            });
        await fixture.Context.SaveChangesAsync();

        var result = await DirectSegmentReviewService.UpdateAuthorizedAsync(
            fixture.Context,
            21,
            101,
            new DirectSegmentMutationRequest(null, 12.5, 18.75, fixture.OriginalUpdatedAt, 12),
            CovePrincipal.System(),
            new RecordingAuthorizationService(AuthorizationResult.Allow()),
            CancellationToken.None);

        Assert.Equal(DirectSegmentMutationStatus.Conflict, result.Status);
        Assert.Equal("DERIVED_TAG_IMMUTABLE", result.Code);
    }

    [Fact]
    public async Task NativeRetagReusesPerformerInMatchingSlot()
    {
        await using var fixture = await DirectFixture.CreateAsync();
        var sourceSetId = Guid.NewGuid();
        var targetSetId = Guid.NewGuid();
        var sourceSlotId = Guid.NewGuid();
        var targetSlotId = Guid.NewGuid();
        fixture.Context.AddRange(
            new Tag { Id = 12, Name = "Similar" },
            new SegmentStudioSlotDefinitionSet
                { Id = sourceSetId, TagId = 11, CreatedAt = fixture.OriginalUpdatedAt },
            new SegmentStudioSlotDefinitionSet
                { Id = targetSetId, TagId = 12, CreatedAt = fixture.OriginalUpdatedAt },
            new SegmentStudioSlotDefinition
                { Id = sourceSlotId, SlotDefinitionSetId = sourceSetId, Label = "Giver", CreatedAt = fixture.OriginalUpdatedAt },
            new SegmentStudioSlotDefinition
                { Id = targetSlotId, SlotDefinitionSetId = targetSetId, Label = "Giver", CreatedAt = fixture.OriginalUpdatedAt },
            new SegmentStudioItem
                { Id = 900, NativeSegmentId = fixture.SegmentId, Revision = 1, CreatedAt = fixture.OriginalUpdatedAt, UpdatedAt = fixture.OriginalUpdatedAt },
            new SegmentStudioSegmentSlot
                { ItemId = 900, SlotDefinitionId = sourceSlotId, PerformerId = 41, CreatedAt = fixture.OriginalUpdatedAt });
        await fixture.Context.SaveChangesAsync();
        fixture.Context.ChangeTracker.Clear();

        var result = await DirectSegmentReviewService.UpdateAuthorizedAsync(
            fixture.Context, fixture.VisibleVideoId, fixture.SegmentId,
            new DirectSegmentMutationRequest(
                null, 12.5, 18.75, fixture.OriginalUpdatedAt, TagId: 12),
            CovePrincipal.System(),
            new RecordingAuthorizationService(AuthorizationResult.Allow()),
            CancellationToken.None);

        Assert.Equal(DirectSegmentMutationStatus.Updated, result.Status);
        var slot = Assert.Single(await fixture.Context.Set<SegmentStudioSegmentSlot>().ToListAsync());
        Assert.Equal(targetSlotId, slot.SlotDefinitionId);
        Assert.Equal(41, slot.PerformerId);
    }

    [Fact]
    public async Task SegmentReadsRequireGlobalAndVideoScopedAuthorization()
    {
        var authorization = new RecordingAuthorizationService(AuthorizationResult.Allow());

        var discovery = await SegmentStudioAuthorization.AuthorizeReadAsync(
            CovePrincipal.System(), authorization, videoId: null, CancellationToken.None);
        Assert.True(discovery.Allowed);
        Assert.Equal(Permissions.SegmentsRead, authorization.Permission);
        Assert.Null(authorization.Entity);

        var editor = await SegmentStudioAuthorization.AuthorizeReadAsync(
            CovePrincipal.System(), authorization, videoId: 21, CancellationToken.None);
        Assert.True(editor.Allowed);
        Assert.Equal(EntityRef.Of(EntityKinds.Video, 21), authorization.Entity);
    }

    [Fact]
    public async Task DeniedSegmentReadAuthorizationStaysDenied()
    {
        var authorization = new RecordingAuthorizationService(
            AuthorizationResult.Deny("denied", Permissions.SegmentsRead));

        var result = await SegmentStudioAuthorization.AuthorizeReadAsync(
            CovePrincipal.System(), authorization, videoId: 21, CancellationToken.None);

        Assert.False(result.Allowed);
        Assert.Equal(Permissions.SegmentsRead, authorization.Permission);
    }

    [Fact]
    public async Task PerformerSlotReadsRequireUnrestrictedPerformerAccess()
    {
        var authorization = new RecordingAuthorizationService(AuthorizationResult.Allow());

        var allowed = await SegmentStudioAuthorization.AuthorizePerformerSlotReadAsync(
            CovePrincipal.System(), authorization, CancellationToken.None);

        Assert.True(allowed.Allowed);
        Assert.Equal(Permissions.PerformersRead, authorization.Permission);
        Assert.Null(authorization.Entity);

        var restrictedPrincipal = new CovePrincipal
        {
            UserId = 7,
            Username = "scoped-user",
            Kind = PrincipalKind.User,
            Roles = new HashSet<string>(),
            Permissions = new HashSet<string> { Permissions.PerformersRead },
            ReadRestrictedEntityKinds = new HashSet<string>([EntityKinds.Performer], StringComparer.OrdinalIgnoreCase),
            ReadGrantedEntityKinds = new HashSet<string>(),
        };
        var restricted = await SegmentStudioAuthorization.AuthorizePerformerSlotReadAsync(
            restrictedPrincipal, authorization, CancellationToken.None);

        Assert.False(restricted.Allowed);
        Assert.Equal(Permissions.PerformersRead, restricted.MissingPermission);
    }

    [Theory]
    [InlineData(true, false, true)]
    [InlineData(false, true, true)]
    [InlineData(false, true, false)]
    public async Task SegmentReadsRejectScopedOrGrantOnlySegmentPrincipals(
        bool readRestricted,
        bool readGranted,
        bool hasDirectPermission)
    {
        var authorization = new RecordingAuthorizationService(AuthorizationResult.Allow());
        var permissions = hasDirectPermission
            ? new HashSet<string>([Permissions.SegmentsRead])
            : new HashSet<string>();
        var principal = new CovePrincipal
        {
            UserId = 7,
            Username = "scoped-user",
            Kind = PrincipalKind.User,
            Roles = new HashSet<string>(),
            Permissions = permissions,
            ReadRestrictedEntityKinds = readRestricted
                ? new HashSet<string>([EntityKinds.Segment], StringComparer.OrdinalIgnoreCase)
                : new HashSet<string>(),
            ReadGrantedEntityKinds = readGranted
                ? new HashSet<string>([EntityKinds.Segment], StringComparer.OrdinalIgnoreCase)
                : new HashSet<string>(),
        };

        var discovery = await SegmentStudioAuthorization.AuthorizeReadAsync(
            principal, authorization, videoId: null, CancellationToken.None);
        var editor = await SegmentStudioAuthorization.AuthorizeReadAsync(
            principal, authorization, videoId: 21, CancellationToken.None);
        var groups = await SegmentStudioAuthorization.AuthorizeSegmentGroupReadAsync(
            principal, authorization, CancellationToken.None);

        Assert.False(discovery.Allowed);
        Assert.False(editor.Allowed);
        Assert.False(groups.Allowed);
        Assert.Equal(Permissions.SegmentsRead, discovery.MissingPermission);
        Assert.Equal(Permissions.SegmentsRead, editor.MissingPermission);
        Assert.Equal(Permissions.SegmentsRead, groups.MissingPermission);
    }

    [Fact]
    public async Task BrowseRejectsRestrictedSegmentPrincipalsBecauseSegmentsHaveNoQueryFilter()
    {
        var authorization = new RecordingAuthorizationService(AuthorizationResult.Allow());
        var principal = new CovePrincipal
        {
            UserId = 7, Username = "scoped", Kind = PrincipalKind.User, Roles = new HashSet<string>(),
            Permissions = new HashSet<string> { Permissions.SegmentsRead, Permissions.TagsRead },
            ReadRestrictedEntityKinds = new HashSet<string>([EntityKinds.Segment]),
        };
        var result = await SegmentStudioAuthorization.AuthorizeBrowseReadAsync(principal, authorization, CancellationToken.None);
        Assert.False(result.Allowed);
        Assert.Equal(Permissions.SegmentsRead, result.MissingPermission);
    }

    [Fact]
    public async Task SlotWritesDeferVideoWriteScopeToExplicitEntityAuthorization()
    {
        var authorization = new RecordingAuthorizationService(AuthorizationResult.Allow());
        var principal = new CovePrincipal
        {
            UserId = 7, Username = "scoped", Kind = PrincipalKind.User, Roles = new HashSet<string>(),
            Permissions = new HashSet<string> { Permissions.SegmentsWrite, Permissions.TagsRead, Permissions.PerformersRead },
            ReadRestrictedEntityKinds = new HashSet<string>([EntityKinds.Video]),
        };
        var definitions = await SegmentStudioAuthorization.AuthorizePerformerSlotDefinitionWriteAsync(principal, authorization, CancellationToken.None);
        var assignments = await SegmentStudioAuthorization.AuthorizePerformerSlotAssignmentWriteAsync(principal, authorization, 21, CancellationToken.None);
        Assert.True(definitions.Allowed);
        Assert.True(assignments.Allowed);
        Assert.Equal(EntityRef.Of(EntityKinds.Video, 21), authorization.Entity);
    }

    [Fact]
    public async Task SlotDefinitionMetadataRejectsRestrictedVideoReaders()
    {
        var authorization = new RecordingAuthorizationService(AuthorizationResult.Allow());
        var principal = new CovePrincipal
        {
            UserId = 7, Username = "scoped", Kind = PrincipalKind.User, Roles = new HashSet<string>(),
            Permissions = new HashSet<string>
            {
                Permissions.SegmentsRead, Permissions.TagsRead, Permissions.PerformersRead, Permissions.VideosRead,
            },
            ReadRestrictedEntityKinds = new HashSet<string>([EntityKinds.Video]),
        };
        var result = await SegmentStudioAuthorization.AuthorizeSlotDefinitionMetadataReadAsync(principal, authorization, CancellationToken.None);
        Assert.False(result.Allowed);
        Assert.Equal(Permissions.VideosRead, result.MissingPermission);
    }

    [Fact]
    public async Task SegmentGroupWritesRequireSegmentWriteAndTagReadPermissions()
    {
        var authorization = new RecordingAuthorizationService(AuthorizationResult.Allow());

        var result = await SegmentStudioAuthorization.AuthorizeSegmentGroupWriteAsync(
            CovePrincipal.System(), authorization, CancellationToken.None);

        Assert.True(result.Allowed);
        Assert.Equal(2, authorization.Calls);
        Assert.Equal(Permissions.TagsRead, authorization.Permission);
        Assert.Null(authorization.Entity);
    }

    [Fact]
    public async Task SegmentGroupReadsRequireSegmentReadAndTagReadPermissions()
    {
        var authorization = new RecordingAuthorizationService(AuthorizationResult.Allow());

        var result = await SegmentStudioAuthorization.AuthorizeSegmentGroupReadAsync(
            CovePrincipal.System(), authorization, CancellationToken.None);

        Assert.True(result.Allowed);
        Assert.Equal(2, authorization.Calls);
        Assert.Equal(Permissions.TagsRead, authorization.Permission);
        Assert.Null(authorization.Entity);
    }

    [Theory]
    [InlineData(true, false)]
    [InlineData(false, true)]
    public async Task SegmentGroupsRejectScopedTagPrincipals(
        bool readRestricted,
        bool readGranted)
    {
        var authorization = new RecordingAuthorizationService(AuthorizationResult.Allow());
        var principal = new CovePrincipal
        {
            UserId = 7,
            Username = "scoped-user",
            Kind = PrincipalKind.User,
            Roles = new HashSet<string>(),
            Permissions = new HashSet<string>
            {
                Permissions.SegmentsRead,
                Permissions.SegmentsWrite,
                Permissions.TagsRead,
            },
            ReadRestrictedEntityKinds = readRestricted
                ? new HashSet<string>([EntityKinds.Tag], StringComparer.OrdinalIgnoreCase)
                : new HashSet<string>(),
            ReadGrantedEntityKinds = readGranted
                ? new HashSet<string>([EntityKinds.Tag], StringComparer.OrdinalIgnoreCase)
                : new HashSet<string>(),
        };

        var read = await SegmentStudioAuthorization.AuthorizeSegmentGroupReadAsync(
            principal, authorization, CancellationToken.None);
        var write = await SegmentStudioAuthorization.AuthorizeSegmentGroupWriteAsync(
            principal, authorization, CancellationToken.None);

        Assert.False(read.Allowed);
        Assert.False(write.Allowed);
        Assert.Equal(Permissions.TagsRead, read.MissingPermission);
        Assert.Equal(Permissions.TagsRead, write.MissingPermission);
    }

    [Fact]
    public async Task UpdatesCanonicalReviewAndTimingWithoutChangingProducerFields()
    {
        await using var fixture = await DirectFixture.CreateAsync();
        var authorization = new RecordingAuthorizationService(AuthorizationResult.Allow());

        var result = await DirectSegmentReviewService.UpdateAuthorizedAsync(
            fixture.Context,
            fixture.VisibleVideoId,
            fixture.SegmentId,
            new DirectSegmentMutationRequest("approved", 2.5, 8.75, fixture.OriginalUpdatedAt),
            CovePrincipal.System(),
            authorization,
            CancellationToken.None);

        Assert.Equal(DirectSegmentMutationStatus.Updated, result.Status);
        Assert.Equal(["end_sec", "payload", "start_sec"], result.ChangedFields!.Keys.Order().ToArray());
        Assert.Equal(Permissions.SegmentsWrite, authorization.Permission);
        Assert.Equal(EntityRef.Of(EntityKinds.Video, fixture.VisibleVideoId), authorization.Entity);

        var segment = await fixture.Context.Set<Segment>().SingleAsync(item => item.Id == fixture.SegmentId);
        Assert.Equal(2.5, segment.StartSec);
        Assert.Equal(8.75, segment.EndSec);
        Assert.Equal("producer/example", segment.SourceKey);
        Assert.Equal("run-7", segment.SourceRunId);
        Assert.Equal(0.84f, segment.Confidence);
        Assert.Equal(11, segment.TagId);
        Assert.Equal("tag", segment.Kind);
        Assert.Equal(7, segment.Payload!.RootElement.GetProperty("producerField").GetProperty("value").GetInt32());
        Assert.Equal("approved", segment.Payload.RootElement.GetProperty("segmentStudio").GetProperty("reviewState").GetString());
    }

    [Fact]
    public async Task EditorCanChangeTagWithoutChangingReviewDisposition()
    {
        await using var fixture = await DirectFixture.CreateAsync();
        fixture.Context.Add(new Tag { Id = 12, Name = "Replacement" });
        await fixture.Context.SaveChangesAsync();
        fixture.Context.ChangeTracker.Clear();

        var result = await DirectSegmentReviewService.UpdateAuthorizedAsync(
            fixture.Context,
            fixture.VisibleVideoId,
            fixture.SegmentId,
            new DirectSegmentMutationRequest("unreviewed", 12.5, 18.75, fixture.OriginalUpdatedAt, TagId: 12),
            CovePrincipal.System(),
            new RecordingAuthorizationService(AuthorizationResult.Allow()),
            CancellationToken.None);

        Assert.Equal(DirectSegmentMutationStatus.Updated, result.Status);
        Assert.Equal(12, result.Segment!.TagId);
        Assert.Equal("Replacement", result.Segment.TagName);
        Assert.Equal(["tag_id"], result.ChangedFields!.Keys);
        Assert.Equal("unreviewed", result.Segment.ReviewState);
    }

    [Fact]
    public async Task UnreviewToleratesFutureSchemaVersionTypes()
    {
        await using var fixture = await DirectFixture.CreateAsync(
            """{"producerField":{"value":7},"segmentStudio":{"schemaVersion":"future","reviewState":"approved"}}""");
        var authorization = new RecordingAuthorizationService(AuthorizationResult.Allow());

        var result = await DirectSegmentReviewService.UpdateAuthorizedAsync(
            fixture.Context,
            fixture.VisibleVideoId,
            fixture.SegmentId,
            new DirectSegmentMutationRequest("unreviewed", 12.5, 18.75, fixture.OriginalUpdatedAt),
            CovePrincipal.System(),
            authorization,
            CancellationToken.None);

        Assert.Equal(DirectSegmentMutationStatus.Updated, result.Status);
        var studio = (await fixture.Context.Set<Segment>().SingleAsync(segment => segment.Id == fixture.SegmentId))
            .Payload!.RootElement.GetProperty("segmentStudio");
        Assert.Equal("future", studio.GetProperty("schemaVersion").GetString());
        Assert.False(studio.TryGetProperty("reviewState", out _));
    }

    [Fact]
    public async Task StaleExpectedTimestampReturnsConflictWithoutMutation()
    {
        await using var fixture = await DirectFixture.CreateAsync();
        var authorization = new RecordingAuthorizationService(AuthorizationResult.Allow());
        var stale = fixture.OriginalUpdatedAt.AddSeconds(-1);

        var result = await DirectSegmentReviewService.UpdateAuthorizedAsync(
            fixture.Context,
            fixture.VisibleVideoId,
            fixture.SegmentId,
            new DirectSegmentMutationRequest("rejected", 100, 110, stale),
            CovePrincipal.System(),
            authorization,
            CancellationToken.None);

        Assert.Equal(DirectSegmentMutationStatus.Conflict, result.Status);
        var segment = await fixture.Context.Set<Segment>().AsNoTracking().SingleAsync(item => item.Id == fixture.SegmentId);
        Assert.Equal(12.5, segment.StartSec);
        Assert.Equal(18.75, segment.EndSec);
        Assert.Equal("unreviewed", DirectSegmentReviewService.ReadReviewState(segment.Payload));
    }

    [Fact]
    public async Task UnreviewRemovesOnlyOwnedStateAndPreservesOtherPayloadFields()
    {
        await using var fixture = await DirectFixture.CreateAsync(
            """{"producerField":{"value":7},"segmentStudio":{"schemaVersion":1,"reviewState":"rejected","future":"keep"}}""");
        var authorization = new RecordingAuthorizationService(AuthorizationResult.Allow());

        var result = await DirectSegmentReviewService.UpdateAuthorizedAsync(
            fixture.Context,
            fixture.VisibleVideoId,
            fixture.SegmentId,
            new DirectSegmentMutationRequest("unreviewed", 12.5, 18.75, fixture.OriginalUpdatedAt),
            CovePrincipal.System(),
            authorization,
            CancellationToken.None);

        Assert.Equal(DirectSegmentMutationStatus.Updated, result.Status);
        var payload = (await fixture.Context.Set<Segment>().SingleAsync(segment => segment.Id == fixture.SegmentId)).Payload!.RootElement;
        Assert.Equal(7, payload.GetProperty("producerField").GetProperty("value").GetInt32());
        var studio = payload.GetProperty("segmentStudio");
        Assert.Equal("keep", studio.GetProperty("future").GetString());
        Assert.False(studio.TryGetProperty("reviewState", out _));
    }

    [Fact]
    public async Task NonObjectPayloadRoundTripsThroughReviewAndUnreview()
    {
        await using var fixture = await DirectFixture.CreateAsync("""["producer",7]""");
        var authorization = new RecordingAuthorizationService(AuthorizationResult.Allow());

        var approved = await DirectSegmentReviewService.UpdateAuthorizedAsync(
            fixture.Context,
            fixture.VisibleVideoId,
            fixture.SegmentId,
            new DirectSegmentMutationRequest("approved", 12.5, 18.75, fixture.OriginalUpdatedAt),
            CovePrincipal.System(),
            authorization,
            CancellationToken.None);
        Assert.Equal(DirectSegmentMutationStatus.Updated, approved.Status);

        var unreviewed = await DirectSegmentReviewService.UpdateAuthorizedAsync(
            fixture.Context,
            fixture.VisibleVideoId,
            fixture.SegmentId,
            new DirectSegmentMutationRequest("unreviewed", 12.5, 18.75, approved.Segment!.UpdatedAt),
            CovePrincipal.System(),
            authorization,
            CancellationToken.None);

        Assert.Equal(DirectSegmentMutationStatus.Updated, unreviewed.Status);
        var payload = (await fixture.Context.Set<Segment>().SingleAsync(segment => segment.Id == fixture.SegmentId)).Payload!.RootElement;
        Assert.Equal(JsonValueKind.Array, payload.ValueKind);
        Assert.Equal("producer", payload[0].GetString());
        Assert.Equal(7, payload[1].GetInt32());
    }

    [Fact]
    public async Task ObjectPayloadNamedLikeTheWrapperIsNeverUnwrapped()
    {
        await using var fixture = await DirectFixture.CreateAsync(
            """{"segmentStudioOriginalPayload":{"producer":"keep"}}""");
        var authorization = new RecordingAuthorizationService(AuthorizationResult.Allow());

        var approved = await DirectSegmentReviewService.UpdateAuthorizedAsync(
            fixture.Context,
            fixture.VisibleVideoId,
            fixture.SegmentId,
            new DirectSegmentMutationRequest("approved", 12.5, 18.75, fixture.OriginalUpdatedAt),
            CovePrincipal.System(),
            authorization,
            CancellationToken.None);
        var unreviewed = await DirectSegmentReviewService.UpdateAuthorizedAsync(
            fixture.Context,
            fixture.VisibleVideoId,
            fixture.SegmentId,
            new DirectSegmentMutationRequest("unreviewed", 12.5, 18.75, approved.Segment!.UpdatedAt),
            CovePrincipal.System(),
            authorization,
            CancellationToken.None);

        Assert.Equal(DirectSegmentMutationStatus.Updated, unreviewed.Status);
        var payload = (await fixture.Context.Set<Segment>().SingleAsync(segment => segment.Id == fixture.SegmentId)).Payload!.RootElement;
        Assert.Equal(JsonValueKind.Object, payload.ValueKind);
        Assert.Equal("keep", payload.GetProperty("segmentStudioOriginalPayload").GetProperty("producer").GetString());
    }

    [Fact]
    public async Task FutureConcurrencyTokensAdvanceByAtLeastPostgresPrecision()
    {
        var future = DateTime.UtcNow.AddMinutes(5);
        await using var fixture = await DirectFixture.CreateAsync(updatedAt: future);
        var authorization = new RecordingAuthorizationService(AuthorizationResult.Allow());

        var result = await DirectSegmentReviewService.UpdateAuthorizedAsync(
            fixture.Context,
            fixture.VisibleVideoId,
            fixture.SegmentId,
            new DirectSegmentMutationRequest("approved", 12.5, 18.75, future),
            CovePrincipal.System(),
            authorization,
            CancellationToken.None);

        Assert.Equal(DirectSegmentMutationStatus.Updated, result.Status);
        Assert.True(result.Segment!.UpdatedAt - future >= TimeSpan.FromTicks(10));
    }

    [Fact]
    public async Task DeniedAuthorizationCreatesNoCanonicalChange()
    {
        await using var fixture = await DirectFixture.CreateAsync();
        var before = await CanonicalSnapshot.CreateAsync(fixture.Context, fixture.SegmentId);
        var authorization = new RecordingAuthorizationService(
            AuthorizationResult.Deny("denied", Permissions.SegmentsWrite));

        var result = await DirectSegmentReviewService.UpdateAuthorizedAsync(
            fixture.Context,
            fixture.VisibleVideoId,
            fixture.SegmentId,
            new DirectSegmentMutationRequest("approved", 1, 2, fixture.OriginalUpdatedAt),
            CovePrincipal.System(),
            authorization,
            CancellationToken.None);

        Assert.Equal(DirectSegmentMutationStatus.Forbidden, result.Status);
        Assert.Equal(before, await CanonicalSnapshot.CreateAsync(fixture.Context, fixture.SegmentId));
    }

    [Fact]
    public async Task HiddenVideoIsRejectedBeforeAuthorization()
    {
        await using var fixture = await DirectFixture.CreateAsync();
        var authorization = new RecordingAuthorizationService(AuthorizationResult.Allow());

        var result = await DirectSegmentReviewService.UpdateAuthorizedAsync(
            fixture.Context,
            fixture.HiddenVideoId,
            fixture.HiddenSegmentId,
            new DirectSegmentMutationRequest("approved", 1, 2, fixture.OriginalUpdatedAt),
            CovePrincipal.System(),
            authorization,
            CancellationToken.None);

        Assert.Equal(DirectSegmentMutationStatus.NotFound, result.Status);
        Assert.Equal(0, authorization.Calls);
    }

    private static async Task<JsonElement> NativeHistoryStateAsync(
        DbContext db,
        int videoId)
    {
        var segments = await db.Set<Segment>()
            .AsNoTracking()
            .Where(segment =>
                segment.HostType == SegmentHostType.Video
                && segment.HostId == videoId
                && segment.Kind == "tag"
                && segment.TagId != null)
            .OrderBy(segment => segment.StartSec)
            .ThenBy(segment => segment.Id)
            .ToArrayAsync();
        var segmentIds = segments.Select(segment => segment.Id).ToArray();
        var provenance = db.Model.FindEntityType(typeof(FieldProvenance)) is null
            ? []
            : await db.Set<FieldProvenance>().AsNoTracking()
                .Where(row =>
                    row.HostType == AffinityHostType.Segment
                    && segmentIds.Contains(row.HostId))
                .OrderBy(row => row.Id)
                .ToListAsync();
        var provenanceBySegment = provenance.ToLookup(row => row.HostId);
        return JsonSerializer.SerializeToElement(new
        {
            type = "segments",
            segments = segments.Select(segment => new
            {
                identity = new
                {
                    nativeSegmentId = (int?)segment.Id,
                    updatedAt = (DateTime?)segment.UpdatedAt,
                },
                values = new
                {
                    startSec = segment.StartSec,
                    endSec = segment.EndSec,
                    tagId = segment.TagId!.Value,
                    kind = segment.Kind,
                    refId = segment.RefId?.ToString(),
                    payloadJson = segment.Payload?.RootElement.GetRawText(),
                    sourceKey = segment.SourceKey,
                    sourceRunId = segment.SourceRunId,
                    confidence = segment.Confidence,
                    title = segment.Title,
                    colorHint = segment.ColorHint,
                    imageBlobId = segment.ImageBlobId,
                    createdAt = segment.CreatedAt,
                    fieldProvenance = provenanceBySegment[segment.Id]
                        .Select(row => new
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
                },
            }),
        });
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

    private sealed record CanonicalSnapshot(
        double StartSec,
        double? EndSec,
        int? TagId,
        string? Kind,
        string SourceKey,
        string? SourceRunId,
        float? Confidence,
        string? Payload,
        DateTime UpdatedAt)
    {
        public static async Task<CanonicalSnapshot> CreateAsync(DbContext db, int segmentId) =>
            await db.Set<Segment>()
                .Where(segment => segment.Id == segmentId)
                .Select(segment => new CanonicalSnapshot(
                    segment.StartSec,
                    segment.EndSec,
                    segment.TagId,
                    segment.Kind,
                    segment.SourceKey,
                    segment.SourceRunId,
                    segment.Confidence,
                    segment.Payload == null ? null : segment.Payload.RootElement.GetRawText(),
                    segment.UpdatedAt))
                .SingleAsync();
    }

    private sealed class DirectFixture : IAsyncDisposable
    {
        public DirectDbContext Context { get; }
        public int VisibleVideoId => 21;
        public int HiddenVideoId => 22;
        public int SegmentId => 101;
        public int HiddenSegmentId => 201;
        public DateTime OriginalUpdatedAt { get; }

        private DirectFixture(DirectDbContext context, DateTime originalUpdatedAt)
        {
            Context = context;
            OriginalUpdatedAt = originalUpdatedAt;
        }

        public async Task SeedSlotAsync()
        {
            var anchor = new SegmentStudioItem
            {
                Id = 900,
                NativeSegmentId = SegmentId,
                Revision = 3,
                CreatedAt = OriginalUpdatedAt,
                UpdatedAt = OriginalUpdatedAt,
            };
            Context.Add(anchor);
            Context.Add(new SegmentStudioSegmentSlot
            {
                ItemId = anchor.Id,
                SlotDefinitionId = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                PerformerId = 41,
                CreatedAt = OriginalUpdatedAt,
            });
            await Context.SaveChangesAsync();
            Context.ChangeTracker.Clear();
        }

        public async Task<(long Revision, long Sequence)>
            SeedBasicHistoryAsync(
                JsonElement before,
                JsonElement after)
        {
            var session = new SegmentStudioHistorySession
            {
                UserId = 7,
                VideoId = VisibleVideoId,
                Mode = SegmentStudioModes.Basic,
                CursorSequence = 1,
                Revision = 1,
                CreatedAt = OriginalUpdatedAt,
                UpdatedAt = OriginalUpdatedAt,
            };
            Context.Add(session);
            await Context.SaveChangesAsync();
            Context.Add(new SegmentStudioHistoryAction
            {
                SessionId = session.Id,
                Sequence = 1,
                ReceiptId = Guid.NewGuid(),
                Kind = "segments.merge",
                Label = "Test native history",
                BeforeJson = before.GetRawText(),
                AfterJson = after.GetRawText(),
                CreatedAt = OriginalUpdatedAt,
            });
            await Context.SaveChangesAsync();
            Context.ChangeTracker.Clear();
            return (session.Revision, 1);
        }

        public static async Task<DirectFixture> CreateAsync(
            string payload = """{"producerField":{"value":7}}""",
            DateTime? updatedAt = null)
        {
            var options = new DbContextOptionsBuilder<DirectDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;
            var context = new DirectDbContext(options, hiddenVideoId: 22);
            var originalUpdatedAt = updatedAt ?? new DateTime(2026, 7, 20, 5, 0, 0, DateTimeKind.Utc);
            context.AddRange(
                new Video { Id = 21, Title = "Visible" },
                new Video { Id = 22, Title = "Hidden" },
                new Tag { Id = 11, Name = "Candidate" },
                new Segment
                {
                    Id = 101,
                    HostType = SegmentHostType.Video,
                    HostId = 21,
                    Kind = "tag",
                    TagId = 11,
                    StartSec = 12.5,
                    EndSec = 18.75,
                    SourceKey = "producer/example",
                    SourceRunId = "run-7",
                    Confidence = 0.84f,
                    Payload = JsonDocument.Parse(payload),
                    UpdatedAt = originalUpdatedAt,
                },
                new Segment
                {
                    Id = 201,
                    HostType = SegmentHostType.Video,
                    HostId = 22,
                    Kind = "tag",
                    TagId = 11,
                    StartSec = 5,
                    SourceKey = "user",
                    UpdatedAt = originalUpdatedAt,
                });
            await context.SaveChangesAsync();
            context.ChangeTracker.Clear();
            return new DirectFixture(context, originalUpdatedAt);
        }

        public async ValueTask DisposeAsync() => await Context.DisposeAsync();
    }

    private sealed class DirectDbContext(DbContextOptions<DirectDbContext> options, int hiddenVideoId) : DbContext(options)
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Video>(builder =>
            {
                builder.HasKey(video => video.Id);
                builder.HasQueryFilter(video => video.Id != hiddenVideoId);
                builder.Ignore(video => video.Studio);
                builder.Ignore(video => video.ParentVideo);
                builder.Ignore(video => video.ChildVideos);
                builder.Ignore(video => video.Urls);
                builder.Ignore(video => video.Files);
                builder.Ignore(video => video.VideoTags);
                builder.Ignore(video => video.VideoPerformers);
                builder.Ignore(video => video.VideoGalleries);
                builder.Ignore(video => video.GroupItems);
                builder.Ignore(video => video.RemoteIds);
                builder.Ignore(video => video.PlayHistory);
            });
            modelBuilder.Entity<Tag>(builder =>
            {
                builder.HasKey(tag => tag.Id);
                builder.Ignore(tag => tag.TagGroup);
                builder.Ignore(tag => tag.Aliases);
                builder.Ignore(tag => tag.ParentRelations);
                builder.Ignore(tag => tag.ChildRelations);
                builder.Ignore(tag => tag.RemoteIds);
                builder.Ignore(tag => tag.VideoTags);
                builder.Ignore(tag => tag.PerformerTags);
                builder.Ignore(tag => tag.ImageTags);
                builder.Ignore(tag => tag.GalleryTags);
                builder.Ignore(tag => tag.StudioTags);
                builder.Ignore(tag => tag.GroupTags);
            });
            modelBuilder.Entity<Segment>(builder =>
            {
                builder.ToTable("segments");
                builder.HasKey(segment => segment.Id);
                builder.Property(segment => segment.Payload).HasConversion(
                    document => document == null ? null : document.RootElement.GetRawText(),
                    json => json == null ? null : JsonDocument.Parse(json));
                builder.Ignore(segment => segment.Tag);
            });
            modelBuilder.Entity<FieldProvenance>(builder =>
            {
                builder.ToTable("field_provenance");
                builder.HasKey(row => row.Id);
            });
            modelBuilder.Entity<SegmentStudioItem>(builder =>
            {
                builder.ToTable("segment_studio_items", table => table.HasCheckConstraint(
                    "CK_segment_studio_items_native_anchor",
                    "\"NativeSegmentId\" IS NULL OR (\"SourceKey\" IS NULL AND \"SourceRunId\" IS NULL AND \"Confidence\" IS NULL)"));
                builder.HasKey(item => item.Id);
                builder.Ignore(item => item.Slots);
            });
            modelBuilder.Entity<SegmentStudioSegmentSlot>(builder =>
            {
                builder.HasKey(slot => new { slot.ItemId, slot.SlotDefinitionId });
                builder.Ignore(slot => slot.Item);
                builder.Ignore(slot => slot.SlotDefinition);
            });
            modelBuilder.Entity<SegmentStudioSlotDefinitionSet>().HasKey(set => set.Id);
            modelBuilder.Entity<SegmentStudioSlotDefinition>(builder =>
            {
                builder.HasKey(definition => definition.Id);
                builder.Ignore(definition => definition.SlotDefinitionSet);
                builder.Ignore(definition => definition.GenderHints);
            });
            modelBuilder.Entity<SegmentStudioSlotDefinitionGenderHint>(builder =>
            {
                builder.HasKey(hint => new { hint.SlotDefinitionId, hint.GenderHint });
                builder.Ignore(hint => hint.SlotDefinition);
            });
            modelBuilder.Entity<Performer>(builder =>
            {
                builder.HasKey(performer => performer.Id);
                builder.Ignore(performer => performer.Urls);
                builder.Ignore(performer => performer.Aliases);
                builder.Ignore(performer => performer.PerformerTags);
                builder.Ignore(performer => performer.VideoPerformers);
                builder.Ignore(performer => performer.ImagePerformers);
                builder.Ignore(performer => performer.GalleryPerformers);
                builder.Ignore(performer => performer.RemoteIds);
            });
            modelBuilder.Entity<SegmentStudioSegmentOperation>().HasKey(operation => operation.OperationId);
            modelBuilder.Entity<SegmentStudioHistorySession>(builder =>
            {
                builder.HasKey(session => session.Id);
                builder.Ignore(session => session.Actions);
            });
            modelBuilder.Entity<SegmentStudioHistoryAction>(builder =>
            {
                builder.HasKey(action => action.Id);
                builder.Ignore(action => action.Session);
            });
            modelBuilder.Entity<SegmentStudioLineageNode>().HasKey(node => node.Id);
            modelBuilder.Entity<SegmentStudioLineageNode>().HasIndex(node => node.ItemId).IsUnique();
            modelBuilder.Entity<SegmentStudioSource>().HasKey(source => source.Id);
            modelBuilder.Entity<SegmentStudioProvenanceActivity>().HasKey(activity => activity.Id);
            modelBuilder.Entity<SegmentStudioSegmentProvenance>().HasKey(assertion => assertion.Id);
            modelBuilder.Entity<SegmentStudioDerivationRule>().HasKey(rule => rule.Id);
            modelBuilder.Entity<SegmentStudioDerivationEdge>().HasKey(edge => edge.Id);
        }
    }

    private sealed class RecordingAuthorizationService(AuthorizationResult result) : IAuthorizationService
    {
        public int Calls { get; private set; }
        public string? Permission { get; private set; }
        public EntityRef? Entity { get; private set; }

        public AuthorizationResult Authorize(CovePrincipal? principal, string permission, EntityRef? entity = null) =>
            throw new NotSupportedException();

        public Task<AuthorizationResult> AuthorizeAsync(
            CovePrincipal? principal,
            string permission,
            EntityRef? entity,
            CancellationToken ct)
        {
            Calls++;
            Permission = permission;
            Entity = entity;
            return Task.FromResult(result);
        }

        public void Require(CovePrincipal? principal, string permission, EntityRef? entity = null) =>
            throw new NotSupportedException();

        public bool Has(CovePrincipal? principal, string permission) =>
            throw new NotSupportedException();
    }
}
