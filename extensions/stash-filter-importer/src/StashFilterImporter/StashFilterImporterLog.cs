using Microsoft.Extensions.Logging;

namespace StashFilterImporter;

internal static partial class StashFilterImporterLog
{
    [LoggerMessage(100, LogLevel.Warning,
        "Stash filter analysis rejected because no database path was supplied.")]
    internal static partial void MissingPath(ILogger logger);

    [LoggerMessage(101, LogLevel.Warning,
        "Stash filter analysis rejected because the database file is unavailable.")]
    internal static partial void MissingFile(ILogger logger);

    [LoggerMessage(102, LogLevel.Information, "Started Stash filter analysis.")]
    internal static partial void Started(ILogger logger);

    [LoggerMessage(114, LogLevel.Debug, "Read Stash database metadata. DatabaseBytes={DatabaseBytes}")]
    internal static partial void DatabaseMetadata(ILogger logger, long databaseBytes);

    [LoggerMessage(103, LogLevel.Information,
        "Completed Stash filter analysis. ElapsedMs={ElapsedMs} Filters={FilterCount} Direct={DirectCount} Adapted={AdaptedCount} Unsupported={UnsupportedCount} Importable={ImportableCount}")]
    internal static partial void Completed(ILogger logger, long elapsedMs, int filterCount,
        int directCount, int adaptedCount, int unsupportedCount, int importableCount);

    [LoggerMessage(104, LogLevel.Warning,
        "Stash filter analysis could not read the supplied database.")]
    internal static partial void Unreadable(ILogger logger);

    [LoggerMessage(105, LogLevel.Warning,
        "Stash filter analysis could not access the supplied database.")]
    internal static partial void Unauthorized(ILogger logger);

    [LoggerMessage(106, LogLevel.Warning,
        "Stash filter analysis could not read the supplied database.")]
    internal static partial void Io(ILogger logger);

    [LoggerMessage(107, LogLevel.Error,
        "Stash filter analysis failed unexpectedly. ExceptionType={ExceptionType}")]
    internal static partial void Unexpected(ILogger logger, string exceptionType);

    [LoggerMessage(108, LogLevel.Warning,
        "Stash filter analysis rejected the supplied database.")]
    internal static partial void Rejected(ILogger logger);

    [LoggerMessage(109, LogLevel.Debug,
        "Stash filter analysis was canceled. ElapsedMs={ElapsedMs}")]
    internal static partial void Canceled(ILogger logger, long elapsedMs);

    [LoggerMessage(110, LogLevel.Debug,
        "Stash filter analysis phase completed. Phase={Phase} ElapsedMs={ElapsedMs} ItemCount={ItemCount}")]
    internal static partial void PhaseCompleted(
        ILogger logger, string phase, long elapsedMs, int itemCount);

    [LoggerMessage(111, LogLevel.Debug,
        "Collected filter dependencies. PerformerIds={PerformerIds} StudioIds={StudioIds} TagIds={TagIds} TagNames={TagNames} MarkerTagIds={MarkerTagIds} RecursiveMarkerRoots={RecursiveMarkerRoots}")]
    internal static partial void Dependencies(ILogger logger, int performerIds, int studioIds,
        int tagIds, int tagNames, int markerTagIds, int recursiveMarkerRoots);

    [LoggerMessage(112, LogLevel.Trace,
        "Stash filter analysis phase started. Phase={Phase}")]
    internal static partial void PhaseStarted(ILogger logger, string phase);

    [LoggerMessage(113, LogLevel.Trace,
        "Translated saved filter. Ordinal={Ordinal} Mode={Mode} Status={Status} RuleCount={RuleCount} Importable={Importable} ElapsedMs={ElapsedMs}")]
    internal static partial void FilterTranslated(ILogger logger, int ordinal, string mode,
        string status, int ruleCount, bool importable, long elapsedMs);
}
