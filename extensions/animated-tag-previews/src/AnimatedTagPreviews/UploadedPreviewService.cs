using System.Globalization;
using System.Text.Json;
using Cove.Core.Interfaces;

namespace AnimatedTagPreviews;

public interface IUploadedPreviewService
{
    Task<UploadPreviewResponse> UploadAsync(int tagId, Stream input, long declaredLength, CancellationToken ct);
}

public sealed class UploadedPreviewService(
    ITagRepository tags,
    IBlobService blobs,
    IPreviewStateStore state,
    IExternalToolRunner tools,
    ITemporaryFileProvider temporaryFiles,
    PreviewMutationGate mutations,
    CoveConfiguration configuration) : IUploadedPreviewService
{
    public const long MaximumUploadBytes = 100L * 1024 * 1024;
    private const int ProcessOutputLimit = 16 * 1024;

    public async Task<UploadPreviewResponse> UploadAsync(int tagId, Stream input, long declaredLength, CancellationToken ct)
    {
        if (tagId <= 0 || await tags.GetByIdAsync(tagId, ct) is null)
            throw new UploadedPreviewException("The target tag is no longer available.");
        if (declaredLength <= 0 || declaredLength > MaximumUploadBytes)
            throw new UploadedPreviewException("The WebM must be larger than zero bytes and no larger than 100 MiB.");

        var path = temporaryFiles.CreateWebmPath();
        string? newBlobId = null;
        var published = false;
        try
        {
            await CopyBoundedAsync(input, path, ct);
            var probeExecutable = string.IsNullOrWhiteSpace(configuration.FfprobePath) ? "ffprobe" : configuration.FfprobePath;
            var probe = await tools.RunAsync(
                FfprobeCommandBuilder.BuildForUpload(probeExecutable, path),
                TimeSpan.FromSeconds(15),
                ProcessOutputLimit,
                ct);
            var settings = await state.GetSettingsAsync(ct);
            var metadata = UploadedPreviewValidator.Validate(probe, settings);
            if (!metadata.IsValid)
                throw new UploadedPreviewException(metadata.Errors[0]);

            await using (var stored = new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.Read, 81920, FileOptions.Asynchronous | FileOptions.SequentialScan))
                newBlobId = await blobs.StoreBlobAsync(stored, "video/webm", ct);

            var version = Guid.NewGuid().ToString("N");
            PreviewRecord? replaced;
            await using (var mutation = await mutations.AcquireAsync(ct))
            {
                await state.TrackOwnedBlobAsync(new OwnedBlobRecord(newBlobId, tagId, metadata.Value!.CreatedAt), CancellationToken.None);
                replaced = await state.PublishAsync(
                    new PreviewRecord(tagId, newBlobId, version, Recipe: null, Origin: "uploaded", Upload: metadata.Value),
                    CancellationToken.None);
                published = true;
            }

            if (replaced is not null && !string.Equals(replaced.BlobId, newBlobId, StringComparison.Ordinal))
                await TryDeleteAndUntrackAsync(replaced.BlobId);
            return new UploadPreviewResponse(tagId, version, replaced is not null);
        }
        catch (UploadedPreviewException)
        {
            if (!published && newBlobId is not null) await TryDeleteAndUntrackAsync(newBlobId);
            throw;
        }
        catch (OperationCanceledException)
        {
            if (!published && newBlobId is not null) await TryDeleteAndUntrackAsync(newBlobId);
            throw;
        }
        catch
        {
            if (!published && newBlobId is not null) await TryDeleteAndUntrackAsync(newBlobId);
            throw new UploadedPreviewException("The custom WebM could not be uploaded.");
        }
        finally
        {
            temporaryFiles.DeleteIfExists(path);
        }
    }

    private static async Task CopyBoundedAsync(Stream input, string path, CancellationToken ct)
    {
        await using var output = new FileStream(path, FileMode.CreateNew, FileAccess.Write, FileShare.None, 81920, FileOptions.Asynchronous | FileOptions.SequentialScan);
        var buffer = new byte[81920];
        long total = 0;
        while (true)
        {
            var read = await input.ReadAsync(buffer, ct);
            if (read == 0) break;
            total += read;
            if (total > MaximumUploadBytes)
                throw new UploadedPreviewException("The WebM must be no larger than 100 MiB.");
            await output.WriteAsync(buffer.AsMemory(0, read), ct);
        }
        if (total == 0)
            throw new UploadedPreviewException("The WebM must not be empty.");
        await output.FlushAsync(ct);
    }

    private async Task TryDeleteAndUntrackAsync(string blobId)
    {
        try
        {
            await blobs.DeleteBlobAsync(blobId, CancellationToken.None);
            await state.UntrackOwnedBlobAsync(blobId, CancellationToken.None);
        }
        catch { /* Leave the ownership marker for orphan cleanup. */ }
    }
}

public static class UploadedPreviewValidator
{
    public static ValidationResult<UploadedPreviewMetadata> Validate(ToolRunResult result, PreviewSettings settings)
    {
        if (result.TimedOut) return ValidationResult<UploadedPreviewMetadata>.Failure("Custom WebM validation timed out.");
        if (result.ExitCode != 0) return ValidationResult<UploadedPreviewMetadata>.Failure("FFprobe could not validate the custom WebM.");
        try
        {
            using var document = JsonDocument.Parse(result.StandardOutput);
            var streams = document.RootElement.GetProperty("streams").EnumerateArray().ToArray();
            var videoStreams = streams.Where(stream => stream.GetProperty("codec_type").GetString() == "video").ToArray();
            if (videoStreams.Length != 1 || streams.Length != 1)
                return ValidationResult<UploadedPreviewMetadata>.Failure("The custom WebM must contain exactly one video stream and no audio or attachments.");
            var video = videoStreams[0];
            var codec = video.GetProperty("codec_name").GetString();
            var width = video.GetProperty("width").GetInt32();
            var height = video.GetProperty("height").GetInt32();
            var frameRate = ParseRate(video.GetProperty("r_frame_rate").GetString());
            var format = document.RootElement.GetProperty("format");
            var formatNames = (format.GetProperty("format_name").GetString() ?? "").Split(',');
            var durationElement = format.GetProperty("duration");
            var duration = durationElement.ValueKind == JsonValueKind.String
                ? double.Parse(durationElement.GetString()!, CultureInfo.InvariantCulture)
                : durationElement.GetDouble();

            if (!formatNames.Contains("webm", StringComparer.OrdinalIgnoreCase))
                return ValidationResult<UploadedPreviewMetadata>.Failure("The uploaded file is not a WebM container.");
            if (!string.Equals(codec, "vp9", StringComparison.OrdinalIgnoreCase))
                return ValidationResult<UploadedPreviewMetadata>.Failure("The custom WebM must use the VP9 video codec.");
            if (width <= 0 || height <= 0 || width % 2 != 0 || height % 2 != 0 || width > settings.MaximumWidth || height > settings.MaximumWidth)
                return ValidationResult<UploadedPreviewMetadata>.Failure($"The custom WebM dimensions must be positive, even, and no larger than {settings.MaximumWidth}px.");
            if (!double.IsFinite(duration) || duration <= 0 || duration > settings.MaximumDurationSeconds)
                return ValidationResult<UploadedPreviewMetadata>.Failure($"The custom WebM duration must be no more than {settings.MaximumDurationSeconds} seconds.");
            if (!double.IsFinite(frameRate) || frameRate <= 0 || frameRate > 60)
                return ValidationResult<UploadedPreviewMetadata>.Failure("The custom WebM frame rate must be between 1 and 60 FPS.");

            return ValidationResult<UploadedPreviewMetadata>.Success(new UploadedPreviewMetadata(duration, width, height, "vp9", frameRate, DateTimeOffset.UtcNow));
        }
        catch (Exception ex) when (ex is JsonException or KeyNotFoundException or InvalidOperationException or FormatException or DivideByZeroException)
        {
            return ValidationResult<UploadedPreviewMetadata>.Failure("FFprobe returned invalid custom WebM metadata.");
        }
    }

    private static double ParseRate(string? value)
    {
        var parts = (value ?? "").Split('/');
        if (parts.Length != 2) return double.NaN;
        return double.Parse(parts[0], CultureInfo.InvariantCulture) / double.Parse(parts[1], CultureInfo.InvariantCulture);
    }
}

public sealed class UploadedPreviewException(string message) : Exception(message);
