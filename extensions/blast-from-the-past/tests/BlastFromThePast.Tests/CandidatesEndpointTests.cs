using System.Net;
using System.Net.Http.Json;
using Cove.Core.Auth;
using Cove.Core.Entities;
using Cove.Core.Interfaces;
using Cove.Plugins;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using MidnightRider.Cove.BlastFromThePast;

namespace BlastFromThePast.Tests;

public sealed class CandidatesEndpointTests
{
    private const string EndpointPath = "/api/plugins/com.midnightrider.blast-from-the-past/candidates";
    private const int Me = 1;
    private const int Someone = 2;
    private static readonly DateTime Start = new(2026, 8, 1, 20, 0, 0, DateTimeKind.Utc);

    [Fact]
    public async Task EndpointDeclaresItsOwnAccessCheck()
    {
        var builder = WebApplication.CreateBuilder();
        builder.Services.AddScoped<DbContext>(_ => throw new InvalidOperationException("The endpoint is not invoked by this test."));
        builder.Services.AddSingleton(new CoveConfiguration());
        builder.Services.AddSingleton<ICurrentPrincipalAccessor>(new TestPrincipalAccessor(null));
        builder.Services.AddSingleton<IAuditService>(new RecordingAuditService());
        await using var app = builder.Build();
        var routeBuilder = (IEndpointRouteBuilder)app;

        new BlastFromThePastExtension().MapEndpoints(routeBuilder);

        var endpoint = Assert.IsType<RouteEndpoint>(Assert.Single(routeBuilder.DataSources.SelectMany(source => source.Endpoints)));
        Assert.Equal(EndpointPath, endpoint.RoutePattern.RawText);
        Assert.Empty(endpoint.Metadata.OfType<CovePermissionRequirementMetadata>());
        Assert.Single(endpoint.Metadata.OfType<CoveAllowWithoutPermissionMetadata>());
    }

    [Fact]
    public async Task ReturnsVideosLikedDuringOrJustAroundTheUsersOwnSessions()
    {
        var databaseName = Seed(db =>
        {
            // Liked mid-session, and liked again in the same session: listed once.
            db.AddRange(Session(Me, 10, Start, Start.AddMinutes(10)), Like(Me, 10, Start.AddMinutes(4)), Like(Me, 10, Start.AddMinutes(9)));
            // Liked 10s before the session started, and 2 min after an ended session.
            db.AddRange(Session(Me, 11, Start, Start.AddMinutes(10)), Like(Me, 11, Start.AddSeconds(-10)));
            db.AddRange(Session(Me, 12, Start, Start.AddMinutes(10)), Like(Me, 12, Start.AddMinutes(12)));
            // A session that never ended is measured to when it was last seen.
            db.AddRange(Session(Me, 13, Start, endedAt: null, lastSeenAt: Start.AddMinutes(5)), Like(Me, 13, Start.AddMinutes(6)));
            // Just outside the window on either side.
            db.AddRange(Session(Me, 20, Start, Start.AddMinutes(10)), Like(Me, 20, Start.AddSeconds(-11)));
            db.AddRange(Session(Me, 21, Start, Start.AddMinutes(10)), Like(Me, 21, Start.AddMinutes(12).AddSeconds(1)));
            // An imported like with no session, and a session of another video around the like.
            db.Add(Like(Me, 22, Start));
            db.AddRange(Session(Me, 23, Start, Start.AddMinutes(10)), Like(Me, 24, Start.AddMinutes(5)));
            // A like interaction on an image, and a pause instead of a like.
            db.AddRange(Session(Me, 25, Start, Start.AddMinutes(10), InteractionHostType.Image), Like(Me, 25, Start.AddMinutes(5), InteractionHostType.Image));
            db.AddRange(Session(Me, 26, Start, Start.AddMinutes(10)), Like(Me, 26, Start.AddMinutes(5), kind: InteractionKind.Pause));
        });
        await using var app = await StartAsync(Principal(PrincipalKind.User, Me, Permissions.VideosRead), authEnabled: true, databaseName);

        Assert.Equal([10, 11, 12, 13], await VideoIdsAsync(app));
    }

    [Fact]
    public async Task IgnoresOtherUsersLikesAndSessions()
    {
        var databaseName = Seed(db =>
        {
            db.AddRange(Session(Someone, 30, Start, Start.AddMinutes(10)), Like(Me, 30, Start.AddMinutes(5)));
            db.AddRange(Session(Me, 31, Start, Start.AddMinutes(10)), Like(Someone, 31, Start.AddMinutes(5)));
            db.AddRange(Session(Someone, 32, Start, Start.AddMinutes(10)), Like(Someone, 32, Start.AddMinutes(5)));
            db.AddRange(Session(Me, 33, Start, Start.AddMinutes(10)), Like(Me, 33, Start.AddMinutes(5)));
        });

        await using (var app = await StartAsync(Principal(PrincipalKind.User, Me, Permissions.VideosRead), authEnabled: true, databaseName))
            Assert.Equal([33], await VideoIdsAsync(app));
        await using (var app = await StartAsync(Principal(PrincipalKind.User, Someone, Permissions.VideosRead), authEnabled: true, databaseName))
            Assert.Equal([32], await VideoIdsAsync(app));
    }

    [Fact]
    public async Task ScopedVideoReadGrantIsEnough()
    {
        var databaseName = Seed(db => db.AddRange(Session(Me, 40, Start, Start.AddMinutes(10)), Like(Me, 40, Start.AddMinutes(5))));
        await using var app = await StartAsync(Principal(PrincipalKind.User, Me, readGrants: [EntityKinds.Video]), authEnabled: true, databaseName);

        Assert.Equal([40], await VideoIdsAsync(app));
    }

    [Fact]
    public async Task RejectsAnonymousCallers()
    {
        await using var app = await StartAsync(Principal(PrincipalKind.Anonymous, userId: null), authEnabled: true, Seed(_ => { }));

        var response = await app.GetTestClient().GetAsync(EndpointPath);

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task RejectsAndAuditsCallersWithoutVideoReadAccess()
    {
        var audit = new RecordingAuditService();
        await using var app = await StartAsync(Principal(PrincipalKind.User, Me, Permissions.PerformersRead), authEnabled: true, Seed(_ => { }), audit);

        var response = await app.GetTestClient().GetAsync(EndpointPath);

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
        var denial = Assert.Single(audit.Events);
        Assert.Equal(AuditActions.PermissionDeny, denial.Action);
        Assert.Equal(AuditOutcomes.Deny, denial.Outcome);
    }

    [Fact]
    public async Task RejectsShareLinks()
    {
        await using var app = await StartAsync(Principal(PrincipalKind.ShareLink, userId: null, Permissions.VideosRead), authEnabled: true, Seed(_ => { }));

        var response = await app.GetTestClient().GetAsync(EndpointPath);

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task WithSignInOffUsesTheLocalPrincipalAndNeverFallsBackToEveryone()
    {
        var databaseName = Seed(db =>
        {
            db.AddRange(Session(Me, 50, Start, Start.AddMinutes(10)), Like(Me, 50, Start.AddMinutes(5)));
            db.AddRange(Session(Someone, 51, Start, Start.AddMinutes(10)), Like(Someone, 51, Start.AddMinutes(5)));
        });

        await using (var app = await StartAsync(Principal(PrincipalKind.User, Me), authEnabled: false, databaseName))
            Assert.Equal([50], await VideoIdsAsync(app));
        await using (var app = await StartAsync(principal: null, authEnabled: false, databaseName))
            Assert.Empty(await VideoIdsAsync(app));
    }

    private static async Task<List<int>> VideoIdsAsync(WebApplication app)
    {
        var response = await app.GetTestClient().GetAsync(EndpointPath);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<CandidatesResponse>();
        return Assert.IsType<List<int>>(body?.VideoIds);
    }

    private static string Seed(Action<TestDb> seed)
    {
        var databaseName = Guid.NewGuid().ToString();
        using var db = CreateDb(databaseName);
        seed(db);
        db.SaveChanges();
        return databaseName;
    }

    private static PlaybackSession Session(
        int userId, int videoId, DateTime startedAt, DateTime? endedAt,
        InteractionHostType hostType = InteractionHostType.Video, DateTime? lastSeenAt = null)
        => new()
        {
            UserId = userId,
            HostType = hostType,
            HostId = videoId,
            SessionId = Guid.NewGuid(),
            StartedAt = startedAt,
            LastSeenAt = lastSeenAt ?? endedAt ?? startedAt,
            EndedAt = endedAt,
        };

    private static Interaction Like(
        int userId, int videoId, DateTime at,
        InteractionHostType hostType = InteractionHostType.Video, InteractionKind kind = InteractionKind.LikeCount)
        => new() { UserId = userId, HostType = hostType, HostId = videoId, Kind = kind, At = at };

    private static CovePrincipal Principal(PrincipalKind kind, int? userId, string? permission = null, string[]? readGrants = null)
        => new()
        {
            UserId = userId,
            Username = "test",
            Kind = kind,
            Roles = new HashSet<string>(),
            Permissions = new HashSet<string>(permission is null ? [] : [permission]),
            ReadGrantedEntityKinds = new HashSet<string>(readGrants ?? []),
        };

    private static async Task<WebApplication> StartAsync(
        CovePrincipal? principal, bool authEnabled, string databaseName, RecordingAuditService? audit = null)
    {
        var builder = WebApplication.CreateBuilder(new WebApplicationOptions { EnvironmentName = "Testing" });
        builder.WebHost.UseTestServer();
        builder.Services.AddSingleton(new CoveConfiguration { Auth = new AuthConfig { Enabled = authEnabled } });
        builder.Services.AddSingleton<ICurrentPrincipalAccessor>(new TestPrincipalAccessor(principal));
        builder.Services.AddSingleton<IAuditService>(audit ?? new RecordingAuditService());
        builder.Services.AddScoped<DbContext>(_ => CreateDb(databaseName));
        var app = builder.Build();
        new BlastFromThePastExtension().MapEndpoints(app);
        await app.StartAsync();
        return app;
    }

    private static TestDb CreateDb(string databaseName)
        => new(new DbContextOptionsBuilder<TestDb>().UseInMemoryDatabase(databaseName).Options);

    private sealed record CandidatesResponse(List<int>? VideoIds);

    private sealed class TestDb(DbContextOptions options) : DbContext(options)
    {
        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Interaction>().Ignore(interaction => interaction.Meta);
            builder.Entity<PlaybackSession>(session =>
            {
                session.Ignore(item => item.Context);
                session.Ignore(item => item.Intervals);
            });
        }
    }

    private sealed class TestPrincipalAccessor(CovePrincipal? current) : ICurrentPrincipalAccessor
    {
        public CovePrincipal? Current { get; private set; } = current;
        public void Set(CovePrincipal? principal) => Current = principal;
    }

    private sealed class RecordingAuditService : IAuditService
    {
        public List<(string Action, string Outcome)> Events { get; } = [];

        public Task LogAsync(
            string action,
            string outcome,
            CovePrincipal? actor = null,
            string? targetKind = null,
            string? targetId = null,
            object? detail = null,
            CancellationToken ct = default)
        {
            Events.Add((action, outcome));
            return Task.CompletedTask;
        }
    }
}
