using System.Diagnostics;
using Cove.Core.Interfaces;

namespace AnimatedTagPreviews;

public interface IPreviewHealthService
{
    Task<PreviewHealthResponse> GetAsync(CancellationToken ct);
}

public sealed class PreviewHealthService(IExternalToolRunner tools, CoveConfiguration configuration) : IPreviewHealthService
{
    private const int HealthOutputLimit = 64 * 1024;

    public async Task<PreviewHealthResponse> GetAsync(CancellationToken ct)
    {
        var ffmpeg = await ProbeAsync(
            string.IsNullOrWhiteSpace(configuration.FfmpegPath) ? "ffmpeg" : configuration.FfmpegPath,
            ["-hide_banner", "-encoders"],
            ct);
        var ffprobe = await ProbeAsync(
            string.IsNullOrWhiteSpace(configuration.FfprobePath) ? "ffprobe" : configuration.FfprobePath,
            ["-version"],
            ct);
        var hasVp9 = ffmpeg.Output.Contains("libvpx-vp9", StringComparison.OrdinalIgnoreCase);

        var ffmpegHealth = new ToolHealth(ffmpeg.Available, ffmpeg.Success, ffmpeg.Version,
            ffmpeg.Success ? null : "FFmpeg is unavailable or failed its capability probe.");
        var ffprobeHealth = new ToolHealth(ffprobe.Available, ffprobe.Success, ffprobe.Version,
            ffprobe.Success ? null : "FFprobe is unavailable or failed its version probe.");
        var vp9Health = new ToolHealth(ffmpeg.Available, hasVp9, null,
            hasVp9 ? null : "FFmpeg does not advertise the required libvpx-vp9 encoder.");
        return new PreviewHealthResponse(ffmpeg.Success && ffprobe.Success && hasVp9, ffmpegHealth, ffprobeHealth, vp9Health);
    }

    private async Task<ProbeResult> ProbeAsync(string executable, IReadOnlyList<string> arguments, CancellationToken ct)
    {
        var info = new ProcessStartInfo
        {
            FileName = executable,
            UseShellExecute = false,
            RedirectStandardOutput = true,
            RedirectStandardError = true,
            CreateNoWindow = true,
        };
        foreach (var argument in arguments)
            info.ArgumentList.Add(argument);

        try
        {
            var result = await tools.RunAsync(info, TimeSpan.FromSeconds(10), HealthOutputLimit, ct);
            var output = string.Concat(result.StandardOutput, "\n", result.StandardError);
            var versionLine = output.Split(['\r', '\n'], StringSplitOptions.RemoveEmptyEntries)
                .FirstOrDefault(line => line.Contains("version", StringComparison.OrdinalIgnoreCase));
            var version = ExtractVersion(versionLine);
            return new ProbeResult(true, !result.TimedOut && result.ExitCode == 0, version, output);
        }
        catch (OperationCanceledException) when (ct.IsCancellationRequested)
        {
            throw;
        }
        catch
        {
            return new ProbeResult(false, false, null, string.Empty);
        }
    }

    private static string? ExtractVersion(string? line)
    {
        if (string.IsNullOrWhiteSpace(line))
            return null;
        var marker = line.IndexOf("version", StringComparison.OrdinalIgnoreCase);
        if (marker < 0)
            return null;
        var token = line[(marker + "version".Length)..].TrimStart()
            .Split((char[]?)null, StringSplitOptions.RemoveEmptyEntries)
            .FirstOrDefault();
        return token is { Length: > 0 and <= 64 } && token.All(ch => char.IsLetterOrDigit(ch) || ".-_+".Contains(ch))
            ? token
            : null;
    }

    private sealed record ProbeResult(bool Available, bool Success, string? Version, string Output);
}
