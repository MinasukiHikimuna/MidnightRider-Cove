using Cove.Core.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace MergeOpportunities.Tests;

public sealed class MergeOpportunityCatalogTests
{
    [Fact]
    public async Task Remote_id_duplicates_form_candidates()
    {
        await using var db = CreateDb();
        db.Set<Performer>().AddRange(
            new Performer { Id = 1, Name = "Skye Blue" },
            new Performer { Id = 2, Name = "Skye Blue" },
            new Performer { Id = 3, Name = "Other Person" });
        db.Set<PerformerRemoteId>().AddRange(
            new PerformerRemoteId { Id = 1, PerformerId = 1, Endpoint = "https://stashdb.org", RemoteId = "abc" },
            // Query-string variant of the same endpoint must normalize into the same group
            new PerformerRemoteId { Id = 2, PerformerId = 2, Endpoint = "https://stashdb.org?x=1", RemoteId = "abc" },
            new PerformerRemoteId { Id = 3, PerformerId = 3, Endpoint = "https://theporndb.net/graphql", RemoteId = "zzz" });
        await db.SaveChangesAsync();

        var candidates = await new MergeOpportunityCatalog(db).GetCandidatesAsync(default);

        var remote = Assert.Single(candidates);
        Assert.Equal(MergeOpportunityCatalog.KindRemoteId, remote.Kind);
        Assert.Equal(MergeOpportunityCatalog.PerformerType, remote.EntityType);
        Assert.Equal("performer|remote-id|https://stashdb.org|abc", remote.Key);
        Assert.Equal(2, remote.MemberCount);
        Assert.Equal([1, 2], remote.Members.Select(m => m.EntityId).ToArray());
        Assert.Equal("Skye Blue", remote.Label);
        Assert.Null(remote.Decision);
    }

    [Fact]
    public async Task Name_candidates_require_cross_provider_remote_ids()
    {
        await using var db = CreateDb();
        db.Set<Performer>().AddRange(
            new Performer { Id = 1, Name = "Skye Blue" },
            new Performer { Id = 2, Name = " SKYE BLUE " },
            new Performer { Id = 3, Name = "Same Name" },
            new Performer { Id = 4, Name = "same name" });
        db.Set<PerformerRemoteId>().AddRange(
            new PerformerRemoteId { Id = 1, PerformerId = 1, Endpoint = "https://stashdb.org", RemoteId = "p1" },
            new PerformerRemoteId { Id = 2, PerformerId = 2, Endpoint = "https://theporndb.net/graphql", RemoteId = "p2" },
            // Same provider on both rows: same-name noise, not a candidate
            new PerformerRemoteId { Id = 3, PerformerId = 3, Endpoint = "https://stashdb.org", RemoteId = "p3" },
            new PerformerRemoteId { Id = 4, PerformerId = 4, Endpoint = "https://stashdb.org", RemoteId = "p4" });
        await db.SaveChangesAsync();

        var candidates = await new MergeOpportunityCatalog(db).GetCandidatesAsync(default);

        var name = Assert.Single(candidates, c => c.Kind == MergeOpportunityCatalog.KindName);
        Assert.Equal("performer|name|skye blue", name.Key);
        Assert.Equal(new[] { 1, 2 }, name.Members.Select(m => m.EntityId).ToArray());
    }

    [Fact]
    public async Task Video_counts_and_orphan_flag_are_computed()
    {
        await using var db = CreateDb();
        db.Set<Performer>().AddRange(
            new Performer { Id = 1, Name = "A" },
            new Performer { Id = 2, Name = "a" });
        db.Set<VideoPerformer>().AddRange(
            new VideoPerformer { VideoId = 10, PerformerId = 1 },
            new VideoPerformer { VideoId = 11, PerformerId = 1 });
        db.Set<PerformerRemoteId>().AddRange(
            new PerformerRemoteId { Id = 1, PerformerId = 1, Endpoint = "https://stashdb.org", RemoteId = "r1" },
            new PerformerRemoteId { Id = 2, PerformerId = 2, Endpoint = "https://theporndb.net/graphql", RemoteId = "r2" });
        await db.SaveChangesAsync();

        var group = Assert.Single(await new MergeOpportunityCatalog(db).GetCandidatesAsync(default));

        var m1 = group.Members.Single(m => m.EntityId == 1);
        var m2 = group.Members.Single(m => m.EntityId == 2);
        Assert.Equal(2, m1.VideoCount);
        Assert.False(m1.IsOrphan);
        Assert.Equal(0, m2.VideoCount);
        Assert.True(m2.IsOrphan);
        Assert.Equal(2, group.TotalVideoCount);
        Assert.True(group.Members[0].EntityId == 1, "most-credited member must sort first (default target)");
    }

    [Fact]
    public async Task Studio_remote_id_duplicates_form_candidates()
    {
        await using var db = CreateDb();
        db.Set<Studio>().AddRange(
            new Studio { Id = 1, Name = "Girlfriends" },
            new Studio { Id = 2, Name = "Girlfriends" });
        db.Set<StudioRemoteId>().AddRange(
            new StudioRemoteId { Id = 1, StudioId = 1, Endpoint = "https://theporndb.net/graphql", RemoteId = "b313" },
            new StudioRemoteId { Id = 2, StudioId = 2, Endpoint = "https://theporndb.net/graphql", RemoteId = "b313" });
        await db.SaveChangesAsync();

        var candidates = await new MergeOpportunityCatalog(db).GetCandidatesAsync(default);

        var studio = Assert.Single(candidates);
        Assert.Equal(MergeOpportunityCatalog.StudioType, studio.EntityType);
        Assert.Equal("studio|remote-id|https://theporndb.net/graphql|b313", studio.Key);
        Assert.Equal(2, studio.MemberCount);
        Assert.Equal("/api/studios/1/image?max=640", studio.Members[0].ImageUrl);
    }

    [Fact]
    public async Task Attach_copies_missing_remote_ids_and_is_idempotent()
    {
        await using var db = CreateDb();
        db.Set<Performer>().AddRange(
            new Performer { Id = 1, Name = "Target" },
            new Performer { Id = 2, Name = "Source 1" },
            new Performer { Id = 3, Name = "Source 2" });
        db.Set<PerformerRemoteId>().AddRange(
            new PerformerRemoteId { Id = 1, PerformerId = 1, Endpoint = "https://stashdb.org", RemoteId = "keep" },
            new PerformerRemoteId { Id = 2, PerformerId = 2, Endpoint = "https://theporndb.net/graphql", RemoteId = "copy1" },
            new PerformerRemoteId { Id = 3, PerformerId = 3, Endpoint = "https://theporndb.net/graphql", RemoteId = "copy1" },
            new PerformerRemoteId { Id = 4, PerformerId = 3, Endpoint = "https://stashdb.org?x=1", RemoteId = "keep" });
        await db.SaveChangesAsync();

        var catalog = new MergeOpportunityCatalog(db);
        var result = await catalog.AttachRemoteIdsAsync("performer", 1, new[] { 2, 3 }, default);
        Assert.NotNull(result);
        Assert.Equal(1, result!.Added);
        Assert.Equal(2, await db.Set<PerformerRemoteId>().CountAsync(r => r.PerformerId == 1));

        var again = await catalog.AttachRemoteIdsAsync("performer", 1, new[] { 2, 3 }, default);
        Assert.Equal(0, again!.Added);

        Assert.Null(await catalog.AttachRemoteIdsAsync("performer", 1, new[] { 999 }, default));
        Assert.Null(await catalog.AttachRemoteIdsAsync("performer", 999, new[] { 2 }, default));
        Assert.Null(await catalog.AttachRemoteIdsAsync("performer", 1, Array.Empty<int>(), default));
    }

    [Fact]
    public async Task Decisions_upsert_and_reopen()
    {
        await using var db = CreateDb();
        var catalog = new MergeOpportunityCatalog(db);
        const string key = "performer|name|skye blue";

        var row = await catalog.UpsertDecisionAsync(key, "dismissed", null, "not the same", default);
        Assert.Equal("dismissed", row.Decision);
        Assert.Equal("not the same", row.Note);

        var updated = await catalog.UpsertDecisionAsync(key, "merged", 1, null, default);
        Assert.Equal("merged", updated.Decision);
        Assert.Equal(1, updated.TargetEntityId);
        Assert.Null(updated.Note);
        Assert.Equal(1, await db.Set<MergeOpportunityDecision>().CountAsync());

        Assert.True(await catalog.RemoveDecisionAsync(key, default));
        Assert.False(await catalog.RemoveDecisionAsync(key, default));
        Assert.Equal(0, await db.Set<MergeOpportunityDecision>().CountAsync());
    }

    [Fact]
    public async Task Shared_scene_evidence_lists_titles_credited_to_two_members()
    {
        await using var db = CreateDb();
        db.Set<Studio>().Add(new Studio { Id = 5, Name = "Studio X" });
        db.Set<Performer>().AddRange(
            new Performer { Id = 1, Name = "Skye Blue" },
            new Performer { Id = 2, Name = "SKYE BLUE" });
        db.Set<Video>().AddRange(
            new Video { Id = 10, Title = "Scene One", StudioId = 5 },
            new Video { Id = 11, Title = "Scene Two", StudioId = 5 },
            new Video { Id = 12, Title = "Solo Scene", StudioId = 5 });
        db.Set<VideoPerformer>().AddRange(
            new VideoPerformer { VideoId = 10, PerformerId = 1 },
            new VideoPerformer { VideoId = 11, PerformerId = 1 },
            new VideoPerformer { VideoId = 12, PerformerId = 1 },
            new VideoPerformer { VideoId = 10, PerformerId = 2 },
            new VideoPerformer { VideoId = 11, PerformerId = 2 });
        db.Set<PerformerRemoteId>().AddRange(
            new PerformerRemoteId { Id = 1, PerformerId = 1, Endpoint = "https://stashdb.org", RemoteId = "r1" },
            new PerformerRemoteId { Id = 2, PerformerId = 2, Endpoint = "https://theporndb.net/graphql", RemoteId = "r2" });
        await db.SaveChangesAsync();

        var detail = await new MergeOpportunityCatalog(db).GetCandidateAsync("performer|name|skye blue", default);

        Assert.NotNull(detail);
        var scenes = detail!.SharedScenes;
        Assert.Equal(2, scenes.Count);
        Assert.All(scenes, s => Assert.Equal(2, s.MemberCount));
        var sceneOne = scenes.Single(s => s.Title == "Scene One");
        Assert.Equal(5, sceneOne.StudioId);
        Assert.Equal("Studio X", sceneOne.StudioName);
        Assert.Equal([10], sceneOne.VideoIds);
        Assert.Equal(MergeOpportunityCatalog.KindName, detail.Summary.Kind);
    }

    [Fact]
    public async Task Candidate_disappears_when_source_entities_are_removed()
    {
        await using var db = CreateDb();
        db.Set<Performer>().AddRange(
            new Performer { Id = 1, Name = "P1" },
            new Performer { Id = 2, Name = "P2" });
        db.Set<PerformerRemoteId>().AddRange(
            new PerformerRemoteId { Id = 1, PerformerId = 1, Endpoint = "https://stashdb.org", RemoteId = "x" },
            new PerformerRemoteId { Id = 2, PerformerId = 2, Endpoint = "https://stashdb.org", RemoteId = "x" });
        await db.SaveChangesAsync();
        const string key = "performer|remote-id|https://stashdb.org|x";
        Assert.NotNull(await new MergeOpportunityCatalog(db).GetCandidateAsync(key, default));

        db.Remove(db.Set<Performer>().Single(p => p.Id == 2));
        await db.SaveChangesAsync();

        Assert.Null(await new MergeOpportunityCatalog(db).GetCandidateAsync(key, default));
    }

    [Fact]
    public async Task Handlers_decode_percent_encoded_route_keys()
    {
        // ASP.NET Core keeps %2F escaped in bound route values (it only unescapes it for
        // path splitting), so remote-id keys arrive as
        // "performer|remote-id|https:%2F%2Fstashdb.org%2Fgraphql|abc" and the handlers must
        // decode them back to the group key.
        Assert.Equal(
            "performer|remote-id|https://stashdb.org/graphql|abc",
            MergeOpportunitiesExtension.DecodeKey("performer%7Cremote-id%7Chttps%3A%2F%2Fstashdb.org%2Fgraphql%7Cabc"));

        await using var db = CreateDb();
        db.Set<Performer>().AddRange(
            new Performer { Id = 1, Name = "P1" },
            new Performer { Id = 2, Name = "P2" });
        db.Set<PerformerRemoteId>().AddRange(
            new PerformerRemoteId { Id = 1, PerformerId = 1, Endpoint = "https://stashdb.org/graphql", RemoteId = "abc" },
            new PerformerRemoteId { Id = 2, PerformerId = 2, Endpoint = "https://stashdb.org/graphql", RemoteId = "abc" });
        await db.SaveChangesAsync();
        var catalog = new MergeOpportunityCatalog(db);

        var found = await MergeOpportunitiesExtension.GetCandidate(
            "performer%7Cremote-id%7Chttps%3A%2F%2Fstashdb.org%2Fgraphql%7Cabc", catalog, default);
        // Results.Ok(typed value) returns HttpResults.Ok<T> (a nested namespace in the
        // .NET 10 reference pack), not the MVC OkObjectResult.
        var ok = Assert.IsType<Ok<CandidateDetail>>(found);
        Assert.Equal("performer|remote-id|https://stashdb.org/graphql|abc", ok.Value.Summary.Key);
        Assert.Equal(2, ok.Value.Summary.MemberCount);
    }

    [Theory]
    [InlineData("", false)]
    [InlineData("performer", false)]
    [InlineData("performer|remote-id", false)]
    [InlineData("performer|remote-id|https://stashdb.org", false)]
    [InlineData("performer|bogus|value", false)]
    [InlineData("tag|name|foo", false)]
    [InlineData("performer|remote-id|https://stashdb.org|abc", true)]
    [InlineData("studio|name|girlfriends", true)]
    public static void Key_parsing_accepts_well_formed_keys(string key, bool expected)
        => Assert.Equal(expected, MergeOpportunityCatalog.TryParseKey(key, out _, out _, out _, out _));

    [Theory]
    [InlineData("merged", true)]
    [InlineData("attached", true)]
    [InlineData("deleted", true)]
    [InlineData("dismissed", true)]
    [InlineData("MERGED", false)]
    [InlineData("merge", false)]
    [InlineData("", false)]
    public static void Decision_values_are_validated(string decision, bool expected)
        => Assert.Equal(expected, MergeOpportunityCatalog.IsValidDecision(decision));

    private static TestDb CreateDb() =>
        new(new DbContextOptionsBuilder<TestDb>().UseInMemoryDatabase(Guid.NewGuid().ToString()).Options);

    private sealed class TestDb : DbContext
    {
        public TestDb(DbContextOptions options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            new MergeOpportunitiesExtension().ConfigureModel(modelBuilder);
            // Core entities are host-mapped in production; map a minimal flat
            // view here so catalog queries run against InMemory.
            modelBuilder.Entity<Performer>(e => e.HasKey(x => x.Id));
            IgnoreNavs<Performer>(modelBuilder);
            modelBuilder.Entity<Studio>(e => e.HasKey(x => x.Id));
            IgnoreNavs<Studio>(modelBuilder);
            modelBuilder.Entity<Video>(e => e.HasKey(x => x.Id));
            IgnoreNavs<Video>(modelBuilder);
            modelBuilder.Entity<VideoPerformer>(e => e.HasKey(x => new { x.VideoId, x.PerformerId }));
            IgnoreNavs<VideoPerformer>(modelBuilder);
            modelBuilder.Entity<PerformerRemoteId>(e => e.HasKey(x => x.Id));
            IgnoreNavs<PerformerRemoteId>(modelBuilder);
            modelBuilder.Entity<StudioRemoteId>(e => e.HasKey(x => x.Id));
            IgnoreNavs<StudioRemoteId>(modelBuilder);

            // Core cascades (host DB: ON DELETE CASCADE on these foreign keys)
            modelBuilder.Entity<VideoPerformer>()
                .HasOne<Video>().WithMany().HasForeignKey(x => x.VideoId).OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<VideoPerformer>()
                .HasOne<Performer>().WithMany().HasForeignKey(x => x.PerformerId).OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<PerformerRemoteId>()
                .HasOne<Performer>().WithMany().HasForeignKey(x => x.PerformerId).OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<StudioRemoteId>()
                .HasOne<Studio>().WithMany().HasForeignKey(x => x.StudioId).OnDelete(DeleteBehavior.Cascade);
        }

        private static void IgnoreNavs<TEntity>(ModelBuilder modelBuilder)
            where TEntity : class
        {
            foreach (var p in typeof(TEntity).GetProperties())
            {
                var t = p.PropertyType;
                if (t.IsGenericType && t.GetGenericTypeDefinition() == typeof(ICollection<>))
                {
                    modelBuilder.Entity<TEntity>().Ignore(p.Name);
                }
                else if (t.IsClass && t.Namespace is string ns && ns.StartsWith("Cove.Core.Entities"))
                {
                    modelBuilder.Entity<TEntity>().Ignore(p.Name);
                }
            }
        }
    }
}
