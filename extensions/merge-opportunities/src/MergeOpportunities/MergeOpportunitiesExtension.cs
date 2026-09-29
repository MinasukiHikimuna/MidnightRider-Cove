using System.Net;
using Cove.Core.Auth;
using Cove.Core.Interfaces;
using Cove.Plugins;
using Cove.Sdk;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace MergeOpportunities;

public sealed class MergeOpportunitiesExtension : FullExtensionBase
{
    private const string ApiBase = "/api/plugins/com.midnightrider.merge-opportunities";

    public override UIManifest GetUIManifest()
    {
        return ManifestBuilder()
            .AddPage(new UIPageDefinition("merge-opportunities", "Merge Opportunities", "merge",
                ShowInNav: true, NavOrder: 70,
                RequiredPermission: Permissions.ExtensionsConfigure,
                ComponentName: "MergeOpportunitiesPage"))
            .AddPage(new UIPageDefinition("merge-opportunity", "Merge Opportunity", "merge",
                ShowInNav: false,
                RequiredPermission: Permissions.ExtensionsConfigure,
                ComponentName: "MergeOpportunityDetailPage"))
            .Build();
    }

    public override void ConfigureServices(IServiceCollection services, ExtensionContext context) =>
        services.AddScoped<MergeOpportunityCatalog>();

    public override void ConfigureModel(ModelBuilder builder)
    {
        builder.Entity<MergeOpportunityDecision>(entity =>
        {
            entity.ToTable("merge_opportunities_decisions");
            entity.HasKey(x => x.Key);
        });
    }

    protected override void DefineMigrations()
    {
        Migration("001_decisions", """
            CREATE TABLE IF NOT EXISTS merge_opportunities_decisions (
              "Key" text NOT NULL PRIMARY KEY,
              "Decision" text NOT NULL,
              "TargetEntityId" integer NULL,
              "Note" text NULL,
              "DecidedAt" timestamptz NOT NULL
            );
            """);
    }

    public override void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet(ApiBase + "/candidates",
                (MergeOpportunityCatalog catalog, CancellationToken ct) => ListCandidates(catalog, ct))
            .RequireCovePermission(Permissions.ExtensionsConfigure);
        endpoints.MapGet(ApiBase + "/candidates/{key}",
                (string key, MergeOpportunityCatalog catalog, CancellationToken ct) => GetCandidate(key, catalog, ct))
            .RequireCovePermission(Permissions.ExtensionsConfigure);
        endpoints.MapPost(ApiBase + "/candidates/{key}/decision",
                (string key, DecisionRequest request, MergeOpportunityCatalog catalog, CancellationToken ct) =>
                    SetDecision(key, request, catalog, ct))
            .RequireCovePermission(Permissions.ExtensionsConfigure);
        endpoints.MapDelete(ApiBase + "/candidates/{key}/decision",
                (string key, MergeOpportunityCatalog catalog, CancellationToken ct) => ClearDecision(key, catalog, ct))
            .RequireCovePermission(Permissions.ExtensionsConfigure);
        endpoints.MapPost(ApiBase + "/attach",
                (AttachRequest request, MergeOpportunityCatalog catalog, CancellationToken ct) => Attach(request, catalog, ct))
            .RequireCovePermission(Permissions.ExtensionsConfigure);
    }

    private static async Task<IResult> ListCandidates(MergeOpportunityCatalog catalog, CancellationToken ct)
        => Results.Ok(new CandidateList(await catalog.GetCandidatesAsync(ct)));

    /// <summary>Bound route values keep %2F escaped (ASP.NET Core only unescapes it for path
    /// splitting, not route values), so decode before using the key.</summary>
    internal static string DecodeKey(string key) => WebUtility.UrlDecode(key);

    internal static async Task<IResult> GetCandidate(string key, MergeOpportunityCatalog catalog, CancellationToken ct)
    {
        key = DecodeKey(key);
        var detail = await catalog.GetCandidateAsync(key, ct);
        return detail is null
            ? Results.NotFound(new { message = "Candidate no longer exists (resolved or data changed)." })
            : Results.Ok(detail);
    }

    internal static async Task<IResult> SetDecision(
        string key, DecisionRequest request, MergeOpportunityCatalog catalog, CancellationToken ct)
    {
        key = DecodeKey(key);
        if (!MergeOpportunityCatalog.TryParseKey(key, out _, out _, out _, out _))
            return Results.BadRequest(new { message = "Malformed candidate key." });
        if (!MergeOpportunityCatalog.IsValidDecision(request.Decision))
            return Results.BadRequest(new { message = "decision must be one of: merged, attached, deleted, dismissed." });
        var row = await catalog.UpsertDecisionAsync(key, request.Decision, request.TargetEntityId, request.Note, ct);
        return Results.Ok(new CandidateDecision(row.Decision, row.TargetEntityId, row.DecidedAt));
    }

    internal static async Task<IResult> ClearDecision(string key, MergeOpportunityCatalog catalog, CancellationToken ct)
    {
        key = DecodeKey(key);
        var removed = await catalog.RemoveDecisionAsync(key, ct);
        return removed ? Results.NoContent() : Results.NotFound(new { message = "No recorded decision." });
    }

    private static async Task<IResult> Attach(AttachRequest request, MergeOpportunityCatalog catalog, CancellationToken ct)
    {
        var result = await catalog.AttachRemoteIdsAsync(request.EntityType, request.TargetId, request.SourceIds ?? [], ct);
        return result is null
            ? Results.NotFound(new { message = "Target or source entity not found." })
            : Results.Ok(result);
    }
}
