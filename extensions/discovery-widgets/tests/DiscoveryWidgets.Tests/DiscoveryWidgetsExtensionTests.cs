using System.Net;
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
using MidnightRider.Cove.DiscoveryWidgets;

namespace DiscoveryWidgets.Tests;

public sealed class DiscoveryWidgetsExtensionTests
{
    private const string EndpointPath = "/api/plugins/com.midnightrider.discovery-widgets/performer-connections";

    [Fact]
    public void ManifestDeclaresSixDegreesAsAnExclusiveCanvasWidget()
    {
        var extension = new DiscoveryWidgetsExtension();
        ((IManifestAware)extension).ApplyManifest(new ExtensionManifestFile
        {
            Id = "com.midnightrider.discovery-widgets",
            Name = "Sample Widgets",
            Version = "0.1.0",
        });
        var manifest = extension.GetUIManifest();

        var widget = Assert.Single(manifest.DashboardWidgets, contribution => contribution.Id == "six-degrees");
        Assert.Equal("Six Degrees of Johnny Sins", widget.Label);
        Assert.Equal("SixDegreesWidget", widget.ComponentName);
        Assert.Equal("SixDegreesEditor", widget.EditorComponentName);
        Assert.False(widget.AllowMultiple);
        Assert.Equal([DashboardWidgetPresentation.Canvas], widget.SupportedPresentations);
        Assert.Equal(DashboardWidgetPresentation.Canvas, widget.DefaultPresentation);
        Assert.Equal(PermissionMode.All, widget.RequiredPermissionMode);
        Assert.Equal(
            [Permissions.PerformersRead, Permissions.VideosRead],
            Assert.IsType<string[]>(widget.RequiredPermissions));

        var configuration = Assert.IsType<System.Text.Json.JsonElement>(widget.DefaultConfiguration);
        Assert.Equal("random", configuration.GetProperty("mode").GetString());
        Assert.Equal(6, configuration.GetProperty("maxDegrees").GetInt32());
        Assert.Equal(System.Text.Json.JsonValueKind.Null, configuration.GetProperty("startPerformerId").ValueKind);
        Assert.Equal(System.Text.Json.JsonValueKind.Null, configuration.GetProperty("endPerformerId").ValueKind);
    }

    [Fact]
    public void ManifestIncludesLibraryPulseFlowWidget()
    {
        var extension = new DiscoveryWidgetsExtension();
        ((IManifestAware)extension).ApplyManifest(new ExtensionManifestFile
        {
            Id = "com.midnightrider.discovery-widgets",
            Name = "Sample Widgets",
            Version = "0.1.0",
        });

        var widget = Assert.Single(
            extension.GetUIManifest().DashboardWidgets,
            contribution => contribution.Id == "library-pulse");

        Assert.Equal("Library Pulse", widget.Label);
        Assert.Equal("LibraryPulseWidget", widget.ComponentName);
        Assert.Equal("LibraryPulseEditor", widget.EditorComponentName);
        Assert.True(widget.AllowMultiple);
        Assert.Equal([DashboardWidgetPresentation.Flow], widget.SupportedPresentations);
        Assert.Equal(DashboardWidgetPresentation.Flow, widget.DefaultPresentation);
    }

    [Fact]
    public async Task PerformerConnectionEndpointUsesAnAuthenticatedFilteredAggregatePolicy()
    {
        var builder = WebApplication.CreateBuilder();
        builder.Services.AddScoped<DbContext>(_ => throw new InvalidOperationException("The endpoint is not invoked by this test."));
        builder.Services.AddSingleton(new CoveConfiguration());
        builder.Services.AddSingleton<ICurrentPrincipalAccessor>(new TestPrincipalAccessor(null));
        builder.Services.AddSingleton<IAuditService>(new RecordingAuditService());
        await using var app = builder.Build();
        var routeBuilder = (IEndpointRouteBuilder)app;

        new DiscoveryWidgetsExtension().MapEndpoints(routeBuilder);

        var endpoint = Assert.Single(routeBuilder.DataSources.SelectMany(source => source.Endpoints));
        var routeEndpoint = Assert.IsType<RouteEndpoint>(endpoint);
        Assert.Equal(EndpointPath, routeEndpoint.RoutePattern.RawText);
        Assert.Empty(endpoint.Metadata.OfType<CovePermissionRequirementMetadata>());
        Assert.Single(endpoint.Metadata.OfType<CoveAllowWithoutPermissionMetadata>());
    }

    [Fact]
    public async Task ScopedReadPrincipalCanReachAggregateEndpointValidation()
    {
        var principal = Principal(
            PrincipalKind.User,
            readGrantedEntityKinds: [EntityKinds.Performer, EntityKinds.Video]);
        await using var app = await StartEndpointAppAsync(principal, authEnabled: true);

        var response = await app.GetTestClient().GetAsync($"{EndpointPath}?maxDegrees=7");

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task AggregateEndpointRejectsAndAuditsMissingReadAccess()
    {
        var audit = new RecordingAuditService();
        var principal = Principal(
            PrincipalKind.User,
            readGrantedEntityKinds: [EntityKinds.Performer]);
        await using var app = await StartEndpointAppAsync(principal, authEnabled: true, audit);

        var response = await app.GetTestClient().GetAsync($"{EndpointPath}?maxDegrees=7");

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
        var denial = Assert.Single(audit.Events);
        Assert.Equal(AuditActions.PermissionDeny, denial.Action);
        Assert.Equal(AuditOutcomes.Deny, denial.Outcome);
    }

    [Fact]
    public async Task AggregateEndpointRejectsShareLinkPrincipals()
    {
        var principal = Principal(
            PrincipalKind.ShareLink,
            readGrantedEntityKinds: [EntityKinds.Performer, EntityKinds.Video]);
        await using var app = await StartEndpointAppAsync(principal, authEnabled: true);

        var response = await app.GetTestClient().GetAsync($"{EndpointPath}?maxDegrees=7");

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task AggregateEndpointPreservesAuthDisabledBehavior()
    {
        await using var app = await StartEndpointAppAsync(principal: null, authEnabled: false);

        var response = await app.GetTestClient().GetAsync($"{EndpointPath}?maxDegrees=7");

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    private static async Task<WebApplication> StartEndpointAppAsync(
        CovePrincipal? principal,
        bool authEnabled,
        RecordingAuditService? audit = null)
    {
        var builder = WebApplication.CreateBuilder(new WebApplicationOptions { EnvironmentName = "Testing" });
        builder.WebHost.UseTestServer();
        builder.Services.AddSingleton(new CoveConfiguration { Auth = new AuthConfig { Enabled = authEnabled } });
        builder.Services.AddSingleton<ICurrentPrincipalAccessor>(new TestPrincipalAccessor(principal));
        builder.Services.AddSingleton<IAuditService>(audit ?? new RecordingAuditService());
        builder.Services.AddSingleton<DbContext>(new DbContext(new DbContextOptionsBuilder<DbContext>().Options));
        var app = builder.Build();
        new DiscoveryWidgetsExtension().MapEndpoints(app);
        await app.StartAsync();
        return app;
    }

    private static CovePrincipal Principal(
        PrincipalKind kind,
        string[]? permissions = null,
        string[]? readGrantedEntityKinds = null)
        => new()
        {
            UserId = kind == PrincipalKind.User ? 1 : null,
            Username = "test",
            Kind = kind,
            Roles = new HashSet<string>(),
            Permissions = new HashSet<string>(permissions ?? []),
            ReadGrantedEntityKinds = new HashSet<string>(readGrantedEntityKinds ?? []),
        };

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
