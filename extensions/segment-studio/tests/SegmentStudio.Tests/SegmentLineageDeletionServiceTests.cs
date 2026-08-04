using Cove.Core.Auth;
using Cove.Core.Entities;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using SegmentStudio;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace SegmentStudio.Tests;

public sealed class SegmentLineageDeletionServiceTests
{
    [Theory]
    [InlineData(0, 3, 0, 0)]
    [InlineData(1, 2, 1, 0)]
    [InlineData(2, 1, 2, 1)]
    public async Task DeletingAComponentMemberRemovesOnlyUnsupportedDescendants(
        int selectedIndex,
        int expectedDeleted,
        int expectedRemaining,
        int expectedRemainingEdges)
    {
        await using var fixture = await Fixture.CreateAsync();
        var items = await fixture.AddChainAsync();
        var nodeIds = await fixture.Context.Set<SegmentStudioLineageNode>()
            .Select(node => node.Id)
            .ToListAsync();
        var componentKey = Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(
            string.Join("|", nodeIds.Order()))));
        var now = DateTime.UtcNow;
        fixture.Context.Add(new SegmentStudioLineageIssue
        {
            Id = Guid.NewGuid(),
            IssueFingerprint = Guid.NewGuid().ToString(),
            ComponentKey = componentKey,
            IssueKind = "provenance-mismatch",
            State = "resolved",
            DetailsJson = "{}",
            FirstDetectedAt = now,
            LastDetectedAt = now,
            ResolvedAt = now,
            ResolutionJson = "{}",
        });
        await fixture.Context.SaveChangesAsync();
        var selected = items[selectedIndex];
        var service = new SegmentLineageDeletionService();
        var preview = await service.PreviewAsync(
            fixture.Context,
            selected.Id,
            new SegmentDependencyDeletePreviewRequest(selected.Revision),
            fixture.Principal,
            fixture.Authorization,
            CancellationToken.None);

        var result = await service.ExecuteAsync(
            fixture.Context,
            selected.Id,
            new SegmentDependencyDeleteExecuteRequest(Guid.NewGuid(), preview.Fingerprint),
            fixture.Principal,
            fixture.Authorization,
            CancellationToken.None);

        Assert.Equal(expectedDeleted, result.DeletedSegmentCount);
        Assert.Equal(expectedRemaining, await fixture.Context.Set<SegmentStudioItem>().CountAsync());
        Assert.Equal(expectedRemaining, await fixture.Context.Set<SegmentStudioLineageNode>().CountAsync());
        Assert.Equal(expectedRemainingEdges, await fixture.Context.Set<SegmentStudioDerivationEdge>().CountAsync());
    }

    [Fact]
    public async Task PreviewCoversBranchingMultiParentComponent()
    {
        await using var fixture = await Fixture.CreateAsync();
        var first = await fixture.AddItemNodeAsync(10);
        var second = await fixture.AddItemNodeAsync(11);
        var child = await fixture.AddItemNodeAsync(20);
        await fixture.AddEdgeAsync(first.Node, child.Node);
        await fixture.AddEdgeAsync(second.Node, child.Node);
        var service = new SegmentLineageDeletionService();

        var preview = await service.PreviewAsync(
            fixture.Context,
            child.Item.Id,
            new SegmentDependencyDeletePreviewRequest(1),
            fixture.Principal,
            fixture.Authorization,
            CancellationToken.None);

        Assert.Equal(1, preview.SelectedSegmentCount);
        Assert.Equal(1, preview.DeletedSegmentCount);
        Assert.Equal(2, preview.RemovedEdgeCount);
        Assert.Equal(0, preview.DependentSegmentCount);
        Assert.False(preview.RequiresTypedConfirmation);
    }

    [Fact]
    public async Task PreviewReportsMixedVideoAccessWithoutLeakingAPartialScope()
    {
        await using var fixture = await Fixture.CreateAsync(
            authorization: new VideoAuthorizationService(allowedVideoId: 1));
        var allowed = await fixture.AddItemNodeAsync(10, videoId: 1);
        var denied = await fixture.AddItemNodeAsync(20, videoId: 2);
        await fixture.AddEdgeAsync(allowed.Node, denied.Node);

        var preview = await new SegmentLineageDeletionService().PreviewAsync(
            fixture.Context,
            allowed.Item.Id,
            new SegmentDependencyDeletePreviewRequest(1),
            fixture.Principal,
            fixture.Authorization,
            CancellationToken.None);

        Assert.Equal(2, preview.DeletedSegmentCount);
        Assert.Equal(1, preview.PermissionFailureCount);
    }

    [Fact]
    public async Task RejectedSegmentsArePlannedTogetherWithTheirUnsupportedDescendants()
    {
        await using var fixture = await Fixture.CreateAsync();
        var rejected = await fixture.AddItemNodeAsync(10);
        var dependent = await fixture.AddItemNodeAsync(20);
        await fixture.AddEdgeAsync(rejected.Node, dependent.Node);
        rejected.Item.ReviewState = "rejected";
        await fixture.Context.SaveChangesAsync();
        var service = new SegmentLineageDeletionService();

        var preview = await service.PreviewRejectedAsync(
            fixture.Context,
            1,
            fixture.Principal,
            fixture.Authorization,
            CancellationToken.None);

        Assert.Equal(1, preview.SelectedSegmentCount);
        Assert.Equal(1, preview.DependentSegmentCount);
        Assert.Equal(2, preview.DeletedSegmentCount);

        var result = await service.ExecuteRejectedAsync(
            fixture.Context,
            1,
            new SegmentDependencyDeleteExecuteRequest(Guid.NewGuid(), preview.Fingerprint),
            fixture.Principal,
            fixture.Authorization,
            CancellationToken.None);

        Assert.Equal(2, result.DeletedSegmentCount);
        Assert.Empty(await fixture.Context.Set<SegmentStudioItem>().ToListAsync());
    }

    [Fact]
    public async Task RejectedDeletionSkipsComponentsWithCollectedIncorrectExamples()
    {
        await using var fixture = await Fixture.CreateAsync();
        var protectedRoot = await fixture.AddItemNodeAsync(10);
        var protectedDependent = await fixture.AddItemNodeAsync(20);
        var independent = await fixture.AddItemNodeAsync(30);
        await fixture.AddEdgeAsync(protectedRoot.Node, protectedDependent.Node);
        protectedRoot.Item.ReviewState = "rejected";
        protectedDependent.Item.ReviewState = "rejected";
        independent.Item.ReviewState = "rejected";
        await fixture.ProtectIncorrectExampleAsync(protectedRoot.Item);
        var service = new SegmentLineageDeletionService();

        var preview = await service.PreviewRejectedAsync(
            fixture.Context,
            1,
            fixture.Principal,
            fixture.Authorization,
            CancellationToken.None);

        Assert.Equal(1, preview.SelectedSegmentCount);
        Assert.Equal(1, preview.DeletedSegmentCount);
        Assert.Equal(1, preview.ProtectedIncorrectExampleCount);
        Assert.Equal(2, preview.DeferredRejectedSegmentCount);

        var result = await service.ExecuteRejectedAsync(
            fixture.Context,
            1,
            new SegmentDependencyDeleteExecuteRequest(Guid.NewGuid(), preview.Fingerprint),
            fixture.Principal,
            fixture.Authorization,
            CancellationToken.None);

        Assert.Equal(1, result.DeletedSegmentCount);
        var remainingIds = await fixture.Context.Set<SegmentStudioItem>()
            .Select(item => item.Id)
            .ToListAsync();
        Assert.Equal(
            new[] { protectedRoot.Item.Id, protectedDependent.Item.Id }.Order(),
            remainingIds.Order());
        Assert.Single(await fixture.Context.Set<SegmentStudioIncorrectExample>()
            .ToListAsync());
        Assert.Single(await fixture.Context.Set<SegmentStudioDerivationEdge>()
            .ToListAsync());
    }

    [Fact]
    public async Task RejectedDeletionReturnsAZeroPlanWhenEveryComponentIsProtected()
    {
        await using var fixture = await Fixture.CreateAsync();
        var protectedItem = await fixture.AddItemNodeAsync(10);
        protectedItem.Item.ReviewState = "rejected";
        await fixture.ProtectIncorrectExampleAsync(protectedItem.Item);

        var preview = await new SegmentLineageDeletionService().PreviewRejectedAsync(
            fixture.Context,
            1,
            fixture.Principal,
            fixture.Authorization,
            CancellationToken.None);

        Assert.Equal(0, preview.SelectedSegmentCount);
        Assert.Equal(0, preview.DeletedSegmentCount);
        Assert.Equal(1, preview.ProtectedIncorrectExampleCount);
        Assert.Equal(1, preview.DeferredRejectedSegmentCount);
        Assert.False(preview.RequiresTypedConfirmation);
    }

    [Fact]
    public async Task ClearedFeedbackProtectionMakesTheRejectedComponentEligibleAgain()
    {
        await using var fixture = await Fixture.CreateAsync();
        var protectedRoot = await fixture.AddItemNodeAsync(10);
        var protectedDependent = await fixture.AddItemNodeAsync(20);
        await fixture.AddEdgeAsync(protectedRoot.Node, protectedDependent.Node);
        protectedRoot.Item.ReviewState = "rejected";
        protectedDependent.Item.ReviewState = "rejected";
        await fixture.ProtectIncorrectExampleAsync(protectedRoot.Item);
        var service = new SegmentLineageDeletionService();
        var protectedPreview = await service.PreviewRejectedAsync(
            fixture.Context,
            1,
            fixture.Principal,
            fixture.Authorization,
            CancellationToken.None);
        fixture.Context.Remove(await fixture.Context
            .Set<SegmentStudioIncorrectExample>().SingleAsync());
        await fixture.Context.SaveChangesAsync();

        var conflict = await Assert.ThrowsAsync<LineageConflictException>(() =>
            service.ExecuteRejectedAsync(
                fixture.Context,
                1,
                new SegmentDependencyDeleteExecuteRequest(
                    Guid.NewGuid(), protectedPreview.Fingerprint),
                fixture.Principal,
                fixture.Authorization,
                CancellationToken.None));

        var eligiblePreview = await service.PreviewRejectedAsync(
            fixture.Context,
            1,
            fixture.Principal,
            fixture.Authorization,
            CancellationToken.None);

        Assert.Equal("LINEAGE_COMPONENT_CHANGED", conflict.Code);
        Assert.NotEqual(protectedPreview.Fingerprint, eligiblePreview.Fingerprint);
        Assert.Equal(2, eligiblePreview.SelectedSegmentCount);
        Assert.Equal(2, eligiblePreview.DeletedSegmentCount);
        Assert.Equal(0, eligiblePreview.ProtectedIncorrectExampleCount);
        Assert.Equal(0, eligiblePreview.DeferredRejectedSegmentCount);
    }

    [Fact]
    public async Task RejectedDeletionProtectsCrossVideoFeedbackComponents()
    {
        await using var fixture = await Fixture.CreateAsync();
        fixture.Context.Add(new Video { Id = 2, Title = "Two" });
        await fixture.Context.SaveChangesAsync();
        var rejectedRoot = await fixture.AddItemNodeAsync(10, videoId: 1);
        var protectedDependent = await fixture.AddItemNodeAsync(20, videoId: 2);
        var independent = await fixture.AddItemNodeAsync(30, videoId: 1);
        await fixture.AddEdgeAsync(rejectedRoot.Node, protectedDependent.Node);
        rejectedRoot.Item.ReviewState = "rejected";
        independent.Item.ReviewState = "rejected";
        await fixture.ProtectIncorrectExampleAsync(protectedDependent.Item);
        var service = new SegmentLineageDeletionService();

        var preview = await service.PreviewRejectedAsync(
            fixture.Context,
            1,
            fixture.Principal,
            fixture.Authorization,
            CancellationToken.None);

        Assert.Equal(1, preview.SelectedSegmentCount);
        Assert.Equal(1, preview.DeletedSegmentCount);
        Assert.Equal(1, preview.ProtectedIncorrectExampleCount);
        Assert.Equal(1, preview.DeferredRejectedSegmentCount);

        var result = await service.ExecuteRejectedAsync(
            fixture.Context,
            1,
            new SegmentDependencyDeleteExecuteRequest(Guid.NewGuid(), preview.Fingerprint),
            fixture.Principal,
            fixture.Authorization,
            CancellationToken.None);

        Assert.Equal(1, result.DeletedSegmentCount);
        var remainingIds = await fixture.Context.Set<SegmentStudioItem>()
            .Select(item => item.Id)
            .ToListAsync();
        Assert.Equal(
            new[] { rejectedRoot.Item.Id, protectedDependent.Item.Id }.Order(),
            remainingIds.Order());
        Assert.Single(await fixture.Context.Set<SegmentStudioIncorrectExample>()
            .ToListAsync());
        Assert.Single(await fixture.Context.Set<SegmentStudioDerivationEdge>()
            .ToListAsync());
    }

    [Fact]
    public async Task ClearedCrossVideoProtectionInvalidatesRejectedPreview()
    {
        await using var fixture = await Fixture.CreateAsync();
        fixture.Context.Add(new Video { Id = 2, Title = "Two" });
        await fixture.Context.SaveChangesAsync();
        var rejectedRoot = await fixture.AddItemNodeAsync(10, videoId: 1);
        var protectedDependent = await fixture.AddItemNodeAsync(20, videoId: 2);
        await fixture.AddEdgeAsync(rejectedRoot.Node, protectedDependent.Node);
        rejectedRoot.Item.ReviewState = "rejected";
        await fixture.ProtectIncorrectExampleAsync(protectedDependent.Item);
        var service = new SegmentLineageDeletionService();
        var protectedPreview = await service.PreviewRejectedAsync(
            fixture.Context,
            1,
            fixture.Principal,
            fixture.Authorization,
            CancellationToken.None);
        fixture.Context.Remove(await fixture.Context
            .Set<SegmentStudioIncorrectExample>().SingleAsync());
        await fixture.Context.SaveChangesAsync();

        var conflict = await Assert.ThrowsAsync<LineageConflictException>(() =>
            service.ExecuteRejectedAsync(
                fixture.Context,
                1,
                new SegmentDependencyDeleteExecuteRequest(
                    Guid.NewGuid(), protectedPreview.Fingerprint),
                fixture.Principal,
                fixture.Authorization,
                CancellationToken.None));

        var eligiblePreview = await service.PreviewRejectedAsync(
            fixture.Context,
            1,
            fixture.Principal,
            fixture.Authorization,
            CancellationToken.None);

        Assert.Equal("LINEAGE_COMPONENT_CHANGED", conflict.Code);
        Assert.NotEqual(protectedPreview.Fingerprint, eligiblePreview.Fingerprint);
        Assert.Equal(1, eligiblePreview.SelectedSegmentCount);
        Assert.Equal(2, eligiblePreview.DeletedSegmentCount);
        Assert.Equal(0, eligiblePreview.ProtectedIncorrectExampleCount);
        Assert.Equal(0, eligiblePreview.DeferredRejectedSegmentCount);
    }

    [Fact]
    public async Task SingleDeletionRejectsDirectlyProtectedItem()
    {
        await using var fixture = await Fixture.CreateAsync();
        var protectedItem = await fixture.AddItemNodeAsync(10);
        await fixture.ProtectIncorrectExampleAsync(protectedItem.Item);

        var conflict = await Assert.ThrowsAsync<LineageConflictException>(() =>
            new SegmentLineageDeletionService().PreviewAsync(
                fixture.Context,
                protectedItem.Item.Id,
                new SegmentDependencyDeletePreviewRequest(1),
                fixture.Principal,
                fixture.Authorization,
                CancellationToken.None));

        Assert.Equal("INCORRECT_EXAMPLE_PROTECTED", conflict.Code);
    }

    [Fact]
    public async Task SingleDeletionRejectsComponentContainingProtectedFeedback()
    {
        await using var fixture = await Fixture.CreateAsync();
        var selected = await fixture.AddItemNodeAsync(10);
        var sharedParent = await fixture.AddItemNodeAsync(11);
        var protectedDependent = await fixture.AddItemNodeAsync(20);
        await fixture.AddEdgeAsync(selected.Node, protectedDependent.Node);
        await fixture.AddEdgeAsync(sharedParent.Node, protectedDependent.Node);
        await fixture.ProtectIncorrectExampleAsync(protectedDependent.Item);

        var conflict = await Assert.ThrowsAsync<LineageConflictException>(() =>
            new SegmentLineageDeletionService().PreviewAsync(
                fixture.Context,
                selected.Item.Id,
                new SegmentDependencyDeletePreviewRequest(1),
                fixture.Principal,
                fixture.Authorization,
                CancellationToken.None));

        Assert.Equal("INCORRECT_EXAMPLE_PROTECTED", conflict.Code);
    }

    [Fact]
    public async Task RepairDeletionRejectsComponentContainingProtectedFeedback()
    {
        await using var fixture = await Fixture.CreateAsync();
        var protectedRoot = await fixture.AddItemNodeAsync(10);
        var selected = await fixture.AddItemNodeAsync(20);
        await fixture.AddEdgeAsync(protectedRoot.Node, selected.Node);
        await fixture.ProtectIncorrectExampleAsync(protectedRoot.Item);

        var conflict = await Assert.ThrowsAsync<LineageConflictException>(() =>
            new SegmentLineageDeletionService().PreviewRepairAsync(
                fixture.Context,
                selected.Item.Id,
                expectedRevision: 1,
                fixture.Principal,
                fixture.Authorization,
                CancellationToken.None));

        Assert.Equal("INCORRECT_EXAMPLE_PROTECTED", conflict.Code);
    }

    [Fact]
    public async Task PreviewRejectsAComponentBeyondTheResponseBound()
    {
        await using var fixture = await Fixture.CreateAsync();
        var root = await fixture.AddItemNodeAsync(10);
        var now = DateTime.UtcNow;
        for (var index = 0; index <= 10_000; index++)
        {
            fixture.Context.Add(new SegmentStudioDerivationEdge
            {
                SourceNodeId = root.Node.Id,
                DerivedNodeId = Guid.NewGuid(),
                RuleId = Guid.NewGuid(),
                SourceTagIdAtCreation = 10,
                DerivedTagIdAtCreation = 20,
                MetadataJson = "{}",
                CreatedAt = now,
                UpdatedAt = now,
            });
        }
        await fixture.Context.SaveChangesAsync();

        var conflict = await Assert.ThrowsAsync<LineageConflictException>(() =>
            new SegmentLineageDeletionService().PreviewAsync(
                fixture.Context,
                root.Item.Id,
                new SegmentDependencyDeletePreviewRequest(1),
                fixture.Principal,
                fixture.Authorization,
                CancellationToken.None));

        Assert.Equal("LINEAGE_COMPONENT_TOO_LARGE", conflict.Code);
    }

    [Fact]
    public async Task SingletonPreviewDoesNotRequireTypedConfirmation()
    {
        await using var fixture = await Fixture.CreateAsync();
        var singleton = await fixture.AddItemNodeAsync(10);

        var preview = await new SegmentLineageDeletionService().PreviewAsync(
            fixture.Context,
            singleton.Item.Id,
            new SegmentDependencyDeletePreviewRequest(1),
            fixture.Principal,
            fixture.Authorization,
            CancellationToken.None);

        Assert.False(preview.RequiresTypedConfirmation);
        Assert.Equal(1, preview.DeletedSegmentCount);
    }

    [Fact]
    public async Task PermissionFailureBlocksWithoutPartialDeletion()
    {
        await using var deniedFixture = await Fixture.CreateAsync(
            authorization: new TestAuthorizationService(false));
        var deniedItems = await deniedFixture.AddChainAsync();
        var service = new SegmentLineageDeletionService();
        var deniedPreview = await service.PreviewAsync(
            deniedFixture.Context,
            deniedItems[0].Id,
            new SegmentDependencyDeletePreviewRequest(1),
            deniedFixture.Principal,
            deniedFixture.Authorization,
            CancellationToken.None);
        Assert.Equal(1, deniedPreview.PermissionFailureCount);
        var deniedConflict = await Assert.ThrowsAsync<LineageConflictException>(() =>
            service.ExecuteAsync(
                deniedFixture.Context,
                deniedItems[0].Id,
                new SegmentDependencyDeleteExecuteRequest(Guid.NewGuid(), deniedPreview.Fingerprint),
                deniedFixture.Principal,
                deniedFixture.Authorization,
                CancellationToken.None));
        Assert.Equal("LINEAGE_PERMISSION_DENIED", deniedConflict.Code);
        Assert.Equal(3, await deniedFixture.Context.Set<SegmentStudioItem>().CountAsync());
    }

    [Fact]
    public async Task StaleFingerprintBlocksConcurrentMutation()
    {
        await using var fixture = await Fixture.CreateAsync();
        var items = await fixture.AddChainAsync();
        var service = new SegmentLineageDeletionService();
        var preview = await service.PreviewAsync(
            fixture.Context,
            items[0].Id,
            new SegmentDependencyDeletePreviewRequest(1),
            fixture.Principal,
            fixture.Authorization,
            CancellationToken.None);
        items[1].Revision++;
        items[1].UpdatedAt = items[1].UpdatedAt.AddSeconds(1);
        await fixture.Context.SaveChangesAsync();

        var conflict = await Assert.ThrowsAsync<LineageConflictException>(() =>
            service.ExecuteAsync(
                fixture.Context,
                items[0].Id,
                new SegmentDependencyDeleteExecuteRequest(Guid.NewGuid(), preview.Fingerprint),
                fixture.Principal,
                fixture.Authorization,
                CancellationToken.None));

        Assert.Equal("LINEAGE_COMPONENT_CHANGED", conflict.Code);
        Assert.Equal(3, await fixture.Context.Set<SegmentStudioItem>().CountAsync());
    }

    [Fact]
    public async Task PauseBlocksNewDeletionButPreservesReceiptReplay()
    {
        await using var fixture = await Fixture.CreateAsync();
        var items = await fixture.AddChainAsync();
        var service = new SegmentLineageDeletionService();
        var preview = await service.PreviewAsync(
            fixture.Context,
            items[0].Id,
            new SegmentDependencyDeletePreviewRequest(1),
            fixture.Principal,
            fixture.Authorization,
            CancellationToken.None);
        var request = new SegmentDependencyDeleteExecuteRequest(
            Guid.NewGuid(), preview.Fingerprint);
        await service.ExecuteAsync(
            fixture.Context, items[0].Id, request,
            fixture.Principal, fixture.Authorization, CancellationToken.None);
        await SegmentStudioRolloutService.SetPausedAsync(
            fixture.Context, true, CancellationToken.None);

        var replay = await service.ExecuteAsync(
            fixture.Context, items[0].Id, request,
            fixture.Principal, fixture.Authorization, CancellationToken.None);

        Assert.True(replay.Replayed);

        await using var blockedFixture = await Fixture.CreateAsync();
        var blockedItems = await blockedFixture.AddChainAsync();
        var blockedPreview = await service.PreviewAsync(
            blockedFixture.Context,
            blockedItems[0].Id,
            new SegmentDependencyDeletePreviewRequest(1),
            blockedFixture.Principal,
            blockedFixture.Authorization,
            CancellationToken.None);
        await SegmentStudioRolloutService.SetPausedAsync(
            blockedFixture.Context, true, CancellationToken.None);
        var conflict = await Assert.ThrowsAsync<LineageConflictException>(() =>
            service.ExecuteAsync(
                blockedFixture.Context,
                blockedItems[0].Id,
                new SegmentDependencyDeleteExecuteRequest(
                    Guid.NewGuid(), blockedPreview.Fingerprint),
                blockedFixture.Principal,
                blockedFixture.Authorization,
                CancellationToken.None));
        Assert.Equal("LINEAGE_ROLLOUT_PAUSED", conflict.Code);
    }

    [Fact]
    public async Task MixedNativeOwnedDeletionQueuesBlobsAndReplays()
    {
        await using var fixture = await Fixture.CreateAsync();
        var root = await fixture.AddItemNodeAsync(10, "owned-blob");
        var native = await fixture.AddNativeItemNodeAsync(20, "native-blob");
        await fixture.AddEdgeAsync(root.Node, native.Node);
        using var beforeDocument = JsonDocument.Parse("{\"value\":\"before\"}");
        using var afterDocument = JsonDocument.Parse("{\"value\":\"after\"}");
        await SegmentStudioHistoryService.AppendAsync(
            fixture.Context,
            userId: 7,
            videoId: 1,
            new SegmentStudioHistoryRecordRequest(
                0,
                "segment.update",
                "Changed segment",
                beforeDocument.RootElement.Clone(),
                afterDocument.RootElement.Clone()),
            CancellationToken.None);
        var service = new SegmentLineageDeletionService();
        var preview = await service.PreviewAsync(
            fixture.Context,
            native.Item.Id,
            new SegmentDependencyDeletePreviewRequest(1),
            fixture.Principal,
            fixture.Authorization,
            CancellationToken.None);
        var request = new SegmentDependencyDeleteExecuteRequest(Guid.NewGuid(), preview.Fingerprint);

        var result = await service.ExecuteAsync(
            fixture.Context, native.Item.Id, request,
            fixture.Principal, fixture.Authorization, CancellationToken.None);
        var replay = await service.ExecuteAsync(
            fixture.Context, native.Item.Id, request,
            fixture.Principal, fixture.Authorization, CancellationToken.None);

        Assert.Equal(1, result.DeletedSegmentCount);
        Assert.True(replay.Replayed);
        var blobs = await fixture.Context.Set<SegmentStudioBlobCleanupOutbox>()
            .Select(entry => entry.BlobId)
            .ToListAsync();
        Assert.Contains("native-blob", blobs);
        Assert.DoesNotContain("owned-blob", blobs);
        Assert.Single(await fixture.Context.Set<SegmentStudioItem>().ToListAsync());
        Assert.Empty((await SegmentStudioHistoryService.GetAsync(
            fixture.Context, 7, 1, CancellationToken.None)).Actions);
    }

    [Fact]
    public async Task NativeSingletonWithoutLineageNodeIsAuthorizedAndDeleted()
    {
        await using var fixture = await Fixture.CreateAsync();
        var native = await fixture.AddNativeItemAsync(20, "native-singleton");
        var service = new SegmentLineageDeletionService();
        var preview = await service.PreviewAsync(
            fixture.Context,
            native.Id,
            new SegmentDependencyDeletePreviewRequest(1),
            fixture.Principal,
            fixture.Authorization,
            CancellationToken.None);

        var result = await service.ExecuteAsync(
            fixture.Context,
            native.Id,
            new SegmentDependencyDeleteExecuteRequest(Guid.NewGuid(), preview.Fingerprint),
            fixture.Principal,
            fixture.Authorization,
            CancellationToken.None);

        Assert.Equal(1, preview.AffectedVideoCount);
        Assert.Equal(1, result.DeletedSegmentCount);
        Assert.Empty(await fixture.Context.Set<SegmentStudioItem>().ToListAsync());
        Assert.Empty(await fixture.Context.Set<Segment>().ToListAsync());
    }

    [Fact]
    public async Task FailureBeforeCommitRollsBackTheWholeComponent()
    {
        await using var fixture = await Fixture.CreateAsync();
        var items = await fixture.AddChainAsync();
        var service = new FailingDeletionService();
        var preview = await service.PreviewAsync(
            fixture.Context,
            items[1].Id,
            new SegmentDependencyDeletePreviewRequest(1),
            fixture.Principal,
            fixture.Authorization,
            CancellationToken.None);

        await Assert.ThrowsAsync<InvalidOperationException>(() => service.ExecuteAsync(
            fixture.Context,
            items[1].Id,
            new SegmentDependencyDeleteExecuteRequest(Guid.NewGuid(), preview.Fingerprint),
            fixture.Principal,
            fixture.Authorization,
            CancellationToken.None));

        await using var verification = fixture.CreateVerificationContext();
        Assert.Equal(3, await verification.Set<SegmentStudioItem>().CountAsync());
        Assert.Equal(3, await verification.Set<SegmentStudioLineageNode>().CountAsync());
        Assert.Equal(2, await verification.Set<SegmentStudioDerivationEdge>().CountAsync());
        Assert.Empty(await verification.Set<SegmentStudioSegmentOperation>().ToListAsync());
    }

    private sealed class FailingDeletionService : SegmentLineageDeletionService
    {
        protected override Task BeforeCommitAsync(DbContext db, CancellationToken ct) =>
            throw new InvalidOperationException("Injected deletion failure.");
    }

    private sealed class Fixture : IAsyncDisposable
    {
        private readonly SqliteConnection _connection;

        private Fixture(
            SqliteConnection connection,
            DeletionDbContext context,
            IAuthorizationService authorization)
        {
            _connection = connection;
            Context = context;
            Authorization = authorization;
        }

        public DeletionDbContext Context { get; }
        public IAuthorizationService Authorization { get; }
        public CovePrincipal Principal { get; } = new()
        {
            UserId = 7,
            Username = "tester",
            Kind = PrincipalKind.User,
            Roles = new HashSet<string>(),
            Permissions = new HashSet<string> { Permissions.SegmentsDelete },
            ReadRestrictedEntityKinds = new HashSet<string>(),
            ReadGrantedEntityKinds = new HashSet<string>(),
        };

        public DeletionDbContext CreateVerificationContext() =>
            new(new DbContextOptionsBuilder<DeletionDbContext>().UseSqlite(_connection).Options);

        public static async Task<Fixture> CreateAsync(
            IAuthorizationService? authorization = null)
        {
            var connection = new SqliteConnection("Data Source=:memory:");
            await connection.OpenAsync();
            var options = new DbContextOptionsBuilder<DeletionDbContext>()
                .UseSqlite(connection)
                .Options;
            var context = new DeletionDbContext(options);
            await context.Database.EnsureCreatedAsync();
            context.AddRange(
                new Video { Id = 1, Title = "One" },
                new SegmentStudioInstallationState
                {
                    Id = 1,
                    RequiresLegacyNormalization = false,
                    LineageRolloutPaused = false,
                    UpdatedAt = DateTime.UtcNow,
                });
            await context.SaveChangesAsync();
            return new Fixture(connection, context, authorization ?? new TestAuthorizationService(true));
        }

        public async Task<IReadOnlyList<SegmentStudioItem>> AddChainAsync()
        {
            var root = await AddItemNodeAsync(10);
            var child = await AddItemNodeAsync(20);
            var grandchild = await AddItemNodeAsync(30);
            await AddEdgeAsync(root.Node, child.Node);
            await AddEdgeAsync(child.Node, grandchild.Node);
            return [root.Item, child.Item, grandchild.Item];
        }

        public async Task<(SegmentStudioItem Item, SegmentStudioLineageNode Node)> AddItemNodeAsync(
            int tag,
            string? blobId = null,
            int videoId = 1)
        {
            var now = DateTime.UtcNow;
            var item = new SegmentStudioItem
            {
                VideoId = videoId,
                TagId = tag,
                StartSec = tag,
                Kind = "tag",
                SourceKey = "user",
                ReviewState = "unreviewed",
                ExtensionImageBlobId = blobId,
                Revision = 1,
                CreatedAt = now,
                UpdatedAt = now,
            };
            Context.Add(item);
            await Context.SaveChangesAsync();
            var node = new SegmentStudioLineageNode
            {
                Id = Guid.NewGuid(),
                ItemId = item.Id,
                State = "live",
                LastKnownVideoId = videoId,
                LastKnownTagId = tag,
                LastKnownStartSec = tag,
                CreatedAt = now,
                UpdatedAt = now,
            };
            Context.Add(node);
            await Context.SaveChangesAsync();
            return (item, node);
        }

        public async Task<(SegmentStudioItem Item, SegmentStudioLineageNode Node)> AddNativeItemNodeAsync(
            int tag,
            string blobId)
        {
            var now = DateTime.UtcNow;
            var segment = new Segment
            {
                Id = Random.Shared.Next(1000, int.MaxValue),
                HostType = SegmentHostType.Video,
                HostId = 1,
                Kind = "tag",
                TagId = tag,
                StartSec = tag,
                ImageBlobId = blobId,
                UpdatedAt = now,
            };
            Context.Add(segment);
            await Context.SaveChangesAsync();
            var item = new SegmentStudioItem
            {
                NativeSegmentId = segment.Id,
                Revision = 1,
                CreatedAt = now,
                UpdatedAt = now,
            };
            Context.Add(item);
            await Context.SaveChangesAsync();
            var node = new SegmentStudioLineageNode
            {
                Id = Guid.NewGuid(),
                ItemId = item.Id,
                State = "live",
                LastKnownVideoId = 1,
                LastKnownTagId = tag,
                LastKnownStartSec = tag,
                CreatedAt = now,
                UpdatedAt = now,
            };
            Context.Add(node);
            await Context.SaveChangesAsync();
            return (item, node);
        }

        public async Task<SegmentStudioItem> AddNativeItemAsync(int tag, string blobId)
        {
            var now = DateTime.UtcNow;
            var segment = new Segment
            {
                Id = Random.Shared.Next(1000, int.MaxValue),
                HostType = SegmentHostType.Video,
                HostId = 1,
                Kind = "tag",
                TagId = tag,
                StartSec = tag,
                ImageBlobId = blobId,
                UpdatedAt = now,
            };
            Context.Add(segment);
            await Context.SaveChangesAsync();
            var item = new SegmentStudioItem
            {
                NativeSegmentId = segment.Id,
                Revision = 1,
                CreatedAt = now,
                UpdatedAt = now,
            };
            Context.Add(item);
            await Context.SaveChangesAsync();
            return item;
        }

        public async Task AddEdgeAsync(
            SegmentStudioLineageNode source,
            SegmentStudioLineageNode derived)
        {
            var now = DateTime.UtcNow;
            Context.Add(new SegmentStudioDerivationEdge
            {
                SourceNodeId = source.Id,
                DerivedNodeId = derived.Id,
                RuleId = Guid.NewGuid(),
                SourceTagIdAtCreation = source.LastKnownTagId!.Value,
                DerivedTagIdAtCreation = derived.LastKnownTagId!.Value,
                MetadataJson = "{}",
                CreatedAt = now,
                UpdatedAt = now,
            });
            await Context.SaveChangesAsync();
        }

        public async Task ProtectIncorrectExampleAsync(SegmentStudioItem item)
        {
            Context.Add(new SegmentStudioIncorrectExample
            {
                ItemId = item.Id,
                VideoId = item.VideoId!.Value,
                SnapshotJson = "{}",
                Revision = 1,
                CreatedAt = DateTime.UtcNow,
            });
            await Context.SaveChangesAsync();
        }

        public async ValueTask DisposeAsync()
        {
            await Context.DisposeAsync();
            await _connection.DisposeAsync();
        }
    }

    private sealed class DeletionDbContext(
        DbContextOptions<DeletionDbContext> options) : DbContext(options)
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<SegmentStudioItem>(builder =>
            {
                builder.HasKey(item => item.Id);
                builder.Ignore(item => item.Slots);
                builder.HasOne<Segment>().WithMany()
                    .HasForeignKey(item => item.NativeSegmentId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
            modelBuilder.Entity<SegmentStudioLineageNode>().HasKey(node => node.Id);
            modelBuilder.Entity<SegmentStudioDerivationEdge>().HasKey(edge => edge.Id);
            modelBuilder.Entity<SegmentStudioSegmentProvenance>().HasKey(assertion => assertion.Id);
            modelBuilder.Entity<SegmentStudioLineageIssue>().HasKey(issue => issue.Id);
            modelBuilder.Entity<SegmentStudioIncorrectExample>().HasKey(example => example.Id);
            modelBuilder.Entity<SegmentStudioSegmentOperation>().HasKey(operation => operation.OperationId);
            modelBuilder.Entity<SegmentStudioBlobCleanupOutbox>().HasKey(entry => entry.Id);
            modelBuilder.Entity<SegmentStudioUserPreference>().HasKey(preference => preference.UserId);
            modelBuilder.Entity<SegmentStudioInstallationState>().HasKey(state => state.Id);
            modelBuilder.Entity<SegmentStudioHistorySession>(builder =>
            {
                builder.HasKey(session => session.Id);
                builder.HasIndex(session => new { session.UserId, session.VideoId, session.Mode }).IsUnique();
            });
            modelBuilder.Entity<SegmentStudioHistoryAction>(builder =>
            {
                builder.HasKey(action => action.Id);
                builder.HasOne(action => action.Session).WithMany(session => session.Actions)
                    .HasForeignKey(action => action.SessionId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
            modelBuilder.Entity<Segment>(builder =>
            {
                builder.HasKey(segment => segment.Id);
                builder.Ignore(segment => segment.Payload);
                builder.Ignore(segment => segment.Tag);
            });
            modelBuilder.Entity<Video>(builder =>
            {
                builder.HasKey(video => video.Id);
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
        }
    }

    private sealed class TestAuthorizationService(bool allowed) : IAuthorizationService
    {
        public AuthorizationResult Authorize(CovePrincipal? principal, string permission, EntityRef? entity = null) =>
            throw new NotSupportedException();

        public Task<AuthorizationResult> AuthorizeAsync(
            CovePrincipal? principal,
            string permission,
            EntityRef? entity,
            CancellationToken ct) =>
            Task.FromResult(allowed
                ? AuthorizationResult.Allow()
                : AuthorizationResult.Deny("denied", permission));

        public void Require(CovePrincipal? principal, string permission, EntityRef? entity = null) =>
            throw new NotSupportedException();

        public bool Has(CovePrincipal? principal, string permission) => allowed;
    }

    private sealed class VideoAuthorizationService(int allowedVideoId) : IAuthorizationService
    {
        public AuthorizationResult Authorize(
            CovePrincipal? principal, string permission, EntityRef? entity = null) =>
            throw new NotSupportedException();

        public Task<AuthorizationResult> AuthorizeAsync(
            CovePrincipal? principal,
            string permission,
            EntityRef? entity,
            CancellationToken ct) =>
            Task.FromResult(
                entity?.Id == allowedVideoId.ToString(
                    System.Globalization.CultureInfo.InvariantCulture)
                    ? AuthorizationResult.Allow()
                    : AuthorizationResult.Deny("denied", permission));

        public void Require(
            CovePrincipal? principal, string permission, EntityRef? entity = null) =>
            throw new NotSupportedException();

        public bool Has(CovePrincipal? principal, string permission) => true;
    }
}
