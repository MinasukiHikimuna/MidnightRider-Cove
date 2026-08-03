using Cove.Core.Auth;
using Cove.Plugins;
using Cove.Sdk;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;

namespace StashFilterImporter;

public sealed class StashFilterImporterExtension : FullExtensionBase
{
    public override UIManifest GetUIManifest() => ManifestBuilder()
        .AddPage(new UIPageDefinition(
            "stash-filter-importer", "Stash Filter Importer", "filter", ShowInNav: true, NavOrder: 70,
            ComponentName: "StashFilterImporterPage")
        {
            RequiredPermissions =
            [
                Permissions.ImportStash,
                Permissions.SavedFiltersWrite,
                Permissions.PerformersRead,
                Permissions.TagsRead,
                Permissions.StudiosRead
            ],
            RequiredPermissionMode = PermissionMode.All
        })
        .Build();

    public override void ConfigureServices(IServiceCollection services, ExtensionContext context)
    {
        services.AddScoped<IPerformerReferenceResolver, CovePerformerReferenceResolver>();
        services.AddScoped<ITagReferenceResolver, CoveTagReferenceResolver>();
        services.AddScoped<IStudioReferenceResolver, CoveStudioReferenceResolver>();
        services.AddScoped<StashFilterAnalyzer>();
    }

    public override void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        endpoints.MapPost(
                "/api/plugins/com.midnightrider.stash-filter-importer/analyze",
                async (AnalyzeRequest request, StashFilterAnalyzer analyzer, CancellationToken ct) =>
                {
                    try
                    {
                        return Results.Ok(await analyzer.AnalyzeAsync(request.StashDbPath ?? "", ct));
                    }
                    catch (AnalysisException exception)
                    {
                        return Results.BadRequest(new { message = exception.Message });
                    }
                })
            .RequireCovePermission(
                PermissionMode.All,
                Permissions.ImportStash,
                Permissions.SavedFiltersWrite,
                Permissions.PerformersRead,
                Permissions.TagsRead,
                Permissions.StudiosRead);
    }
}
