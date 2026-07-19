using System.Diagnostics;
using System.Globalization;

namespace AnimatedTagPreviews;

public static class FfmpegCommandBuilder
{
    public static ProcessStartInfo Build(string executable, string inputPath, string outputPath, PreviewRecipe recipe)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(executable);
        ArgumentException.ThrowIfNullOrWhiteSpace(inputPath);
        ArgumentException.ThrowIfNullOrWhiteSpace(outputPath);
        ArgumentNullException.ThrowIfNull(recipe);

        var zoom = Format(recipe.Zoom);
        var anchorX = Format(recipe.AnchorX);
        var anchorY = Format(recipe.AnchorY);
        var playbackSpeed = Format(recipe.PlaybackSpeed);
        var ratio = PreviewAspectRatios.Get(recipe.AspectRatio);
        var cropWidth = ratio.Width == ratio.Height ? $"min(iw\\,ih)/{zoom}" : $"min(iw\\,ih*{ratio.Width}/{ratio.Height})/{zoom}";
        var cropHeight = ratio.Width == ratio.Height ? cropWidth : $"{cropWidth}*{ratio.Height}/{ratio.Width}";
        var outputHeight = PreviewAspectRatios.OutputHeight(recipe.Width, recipe.AspectRatio);
        var filter = $"crop={cropWidth}:{cropHeight}:(iw-{cropWidth})*{anchorX}:(ih-{cropHeight})*{anchorY},scale={recipe.Width}:{outputHeight}:flags=lanczos,setpts=PTS/{playbackSpeed},fps={recipe.FrameRate}";

        var info = new ProcessStartInfo
        {
            FileName = executable,
            UseShellExecute = false,
            RedirectStandardOutput = true,
            RedirectStandardError = true,
            CreateNoWindow = true,
        };

        Add(info,
            "-hide_banner", "-nostdin", "-y", "-loglevel", "error",
            "-ss", Format(recipe.StartSeconds),
            "-i", inputPath,
            "-t", Format(recipe.DurationSeconds / recipe.PlaybackSpeed),
            "-an",
            "-vf", filter,
            "-c:v", recipe.VideoCodec,
            "-b:v", $"{recipe.BitrateKbps.ToString(CultureInfo.InvariantCulture)}k",
            "-deadline", "good",
            "-cpu-used", "2",
            "-row-mt", "1",
            "-pix_fmt", "yuv420p",
            outputPath);
        return info;
    }

    private static void Add(ProcessStartInfo info, params string[] values)
    {
        foreach (var value in values)
            info.ArgumentList.Add(value);
    }

    private static string Format(double value) => value.ToString("0.######", CultureInfo.InvariantCulture);
}
