using System.Text.Json.Nodes;

namespace StashFilterImporter;

public sealed record AnalyzeRequest(string? StashDbPath);
public sealed record RuleAnalysis(string Source, string? Target, string Status, string Explanation);
public sealed record SavedFilterPayload(string Mode, string Name, string FindFilter, string ObjectFilter, string UIOptions);
public sealed record FilterAnalysis(
    string SourceId,
    string SourceMode,
    string Name,
    string? TargetMode,
    string Status,
    IReadOnlyList<RuleAnalysis> Rules,
    bool Importable,
    SavedFilterPayload? Payload);
public sealed record AnalysisSummary(int Direct, int Adapted, int Unsupported, int Importable);
public sealed record AnalysisResponse(AnalysisSummary Summary, IReadOnlyList<FilterAnalysis> Filters);

internal sealed record BlobResult(JsonObject? Object, RuleAnalysis? Error);
