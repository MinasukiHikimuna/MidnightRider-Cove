using System.Diagnostics;
using System.Globalization;
using System.Text.Json;

namespace AnimatedTagPreviews;

public static class FfprobeCommandBuilder
{
    public static ProcessStartInfo Build(string executable, string outputPath)
        => Build(executable, outputPath, includeAllStreams: false);

    public static ProcessStartInfo BuildForUpload(string executable, string outputPath)
        => Build(executable, outputPath, includeAllStreams: true);

    private static ProcessStartInfo Build(string executable, string outputPath, bool includeAllStreams)
    {
        var info = new ProcessStartInfo
        {
            FileName = executable,
            UseShellExecute = false,
            RedirectStandardOutput = true,
            RedirectStandardError = true,
            CreateNoWindow = true,
        };
        var arguments = new List<string>
        {
            "-v", "error",
        };
        if (!includeAllStreams)
            arguments.AddRange(["-select_streams", "v:0"]);
        arguments.AddRange([
            "-show_entries", "stream=codec_type,codec_name,width,height,r_frame_rate:format=format_name,duration",
            "-of", "json", outputPath,
        ]);
        foreach (var value in arguments)
            info.ArgumentList.Add(value);
        return info;
    }
}

public static class FfprobeOutputValidator
{
    public static ValidationResult<bool> Validate(ToolRunResult result, PreviewRecipe recipe)
    {
        if (result.TimedOut)
            return ValidationResult<bool>.Failure("Generated preview validation timed out.");
        if (result.ExitCode != 0)
            return ValidationResult<bool>.Failure("FFprobe could not validate the generated preview.");

        try
        {
            using var document = JsonDocument.Parse(result.StandardOutput);
            var stream = document.RootElement.GetProperty("streams").EnumerateArray().First();
            var format = document.RootElement.GetProperty("format");
            var codec = stream.GetProperty("codec_name").GetString();
            var width = stream.GetProperty("width").GetInt32();
            var height = stream.GetProperty("height").GetInt32();
            var formatName = format.GetProperty("format_name").GetString() ?? string.Empty;
            var durationValue = format.GetProperty("duration");
            var duration = durationValue.ValueKind == JsonValueKind.String
                ? double.Parse(durationValue.GetString()!, CultureInfo.InvariantCulture)
                : durationValue.GetDouble();

            if (!string.Equals(codec, "vp9", StringComparison.OrdinalIgnoreCase)
                || width != recipe.Width
                || height != PreviewAspectRatios.OutputHeight(recipe.Width, recipe.AspectRatio)
                || !formatName.Split(',').Contains("webm", StringComparer.OrdinalIgnoreCase)
                || !double.IsFinite(duration)
                || duration <= 0
                || duration > recipe.DurationSeconds / recipe.PlaybackSpeed + 1)
                return ValidationResult<bool>.Failure("The generated file did not match the requested WebM preview recipe.");

            return ValidationResult<bool>.Success(true);
        }
        catch (Exception ex) when (ex is JsonException or KeyNotFoundException or InvalidOperationException or FormatException)
        {
            return ValidationResult<bool>.Failure("FFprobe returned invalid preview metadata.");
        }
    }
}
