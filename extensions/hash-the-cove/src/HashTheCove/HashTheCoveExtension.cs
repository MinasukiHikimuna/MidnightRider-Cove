using Cove.Core.Interfaces;
using Cove.Plugins;
using Cove.Sdk;
using Microsoft.Extensions.DependencyInjection;

namespace HashTheCove;

public sealed class HashTheCoveExtension : JobExtensionBase
{
    private IServiceScopeFactory? _scopeFactory;
    private CoveConfiguration? _configuration;

    protected override void DefineJobs() =>
        Job(
            "calculate-hashes",
            "Hash The Cove",
            RunAsync,
            "Calculate enabled hashes for video and gallery files.",
            supportsParameters: false,
            showInTaskList: true);

    public override UIManifest GetUIManifest() =>
        ManifestBuilder()
            .AddSettingsTab(
                "extensions/hash-the-cove",
                "Hash The Cove",
                order: 120,
                icon: "hard-drive",
                description: "Choose which fingerprints Hash The Cove calculates and which file types it processes.",
                searchKeywords: ["hash", "fingerprint", "xxhash", "sha256", "sha1"],
                aliases: ["extensions-hash-the-cove"])
            .AddSettingsSection(
                "extensions/hash-the-cove",
                "Hash The Cove",
                "HashTheCoveSettings",
                order: 50)
            .Build();

    public override void ConfigureServices(IServiceCollection services, ExtensionContext context)
    {
        services.AddScoped<IHashFileRepository, EfHashFileRepository>();
        services.AddScoped<HashJobRunner>();
    }

    public override Task InitializeAsync(IServiceProvider services, CancellationToken ct = default)
    {
        _scopeFactory = services.GetRequiredService<IServiceScopeFactory>();
        _configuration = services.GetRequiredService<CoveConfiguration>();
        return Task.CompletedTask;
    }

    private async Task RunAsync(
        IReadOnlyDictionary<string, string>? parameters,
        Cove.Plugins.IJobProgress progress,
        CancellationToken ct)
    {
        if (_scopeFactory is null || _configuration is null)
            throw new InvalidOperationException("Hash The Cove has not been initialized.");

        using var scope = _scopeFactory.CreateScope();
        var runner = scope.ServiceProvider.GetRequiredService<HashJobRunner>();
        await runner.RunAsync(HashSettings.From(_configuration), progress, ct);
    }
}
