using Cove.Core.Interfaces;

namespace AnimatedTagPreviews;

public sealed record PreviewGenerationResult(PreviewRecord Record, bool ReplacedExisting);

public interface IPreviewGenerationService
{
    Task<PreviewGenerationResult> GenerateAsync(
        int videoId,
        int tagId,
        GeneratePreviewRequest request,
        PreviewCommitGuard commitGuard,
        IJobProgress progress,
        CancellationToken ct);
}

public sealed class PreviewGenerationService(
    IVideoRepository videos,
    ITagRepository tags,
    IBlobService blobs,
    IPreviewStateStore state,
    IExternalToolRunner tools,
    IPreviewHealthService health,
    PreviewMutationGate mutations,
    ITemporaryFileProvider temporaryFiles,
    CoveConfiguration configuration) : IPreviewGenerationService
{
    private const int ProcessOutputLimit = 16 * 1024;

    public async Task<PreviewGenerationResult> GenerateAsync(
        int videoId,
        int tagId,
        GeneratePreviewRequest request,
        PreviewCommitGuard commitGuard,
        IJobProgress progress,
        CancellationToken ct)
    {
        progress.Report(0.02, "Validating source media");
        var dependencyHealth = await health.GetAsync(ct);
        if (!dependencyHealth.Healthy)
            throw new PreviewGenerationException("FFmpeg, FFprobe, and the libvpx-vp9 encoder are required to generate previews.");
        var video = await videos.GetByIdWithRelationsAsync(videoId, ct)
            ?? throw new PreviewGenerationException("The source video is no longer available.");
        if (await tags.GetByIdAsync(tagId, ct) is null)
            throw new PreviewGenerationException("The target tag is no longer available.");

        var resolved = PreviewSourceResolver.Resolve(video, request.SourceFileId);
        if (!resolved.IsValid)
            throw new PreviewGenerationException(resolved.Errors[0]);

        var settings = await state.GetSettingsAsync(ct);
        var validated = PreviewRequestValidator.Validate(request, resolved.Value!.File.Duration, settings);
        if (!validated.IsValid)
            throw new PreviewGenerationException(validated.Errors[0]);
        request = validated.Value!;

        var outputWidth = request.Width!.Value;
        var bitrate = CalculateBitrate(outputWidth, settings);
        var recipe = new PreviewRecipe(
            videoId,
            resolved.Value.File.Id,
            request.StartSeconds,
            request.DurationSeconds,
            request.AnchorX,
            request.AnchorY,
            request.Zoom,
            outputWidth,
            "libvpx-vp9",
            bitrate,
            settings.FrameRate,
            DateTimeOffset.UtcNow,
            request.PlaybackSpeed,
            settings.AspectRatio);

        var outputPath = temporaryFiles.CreateWebmPath();
        string? newBlobId = null;
        var published = false;
        try
        {
            var executable = string.IsNullOrWhiteSpace(configuration.FfmpegPath) ? "ffmpeg" : configuration.FfmpegPath;
            var startInfo = FfmpegCommandBuilder.Build(executable, resolved.Value.Path, outputPath, recipe);
            progress.Report(0.1, "Encoding VP9 preview");
            var run = await tools.RunAsync(startInfo, TimeSpan.FromSeconds(settings.EncodingTimeoutSeconds), ProcessOutputLimit, ct);
            if (run.TimedOut)
                throw new PreviewGenerationException("Preview encoding timed out.");
            if (run.ExitCode != 0 || !File.Exists(outputPath) || new FileInfo(outputPath).Length == 0)
                throw new PreviewGenerationException("FFmpeg could not generate a valid preview.");

            progress.Report(0.8, "Validating generated preview");
            var probeExecutable = string.IsNullOrWhiteSpace(configuration.FfprobePath) ? "ffprobe" : configuration.FfprobePath;
            var probe = await tools.RunAsync(
                FfprobeCommandBuilder.Build(probeExecutable, outputPath),
                TimeSpan.FromSeconds(15),
                ProcessOutputLimit,
                ct);
            var outputValidation = FfprobeOutputValidator.Validate(probe, recipe);
            if (!outputValidation.IsValid)
                throw new PreviewGenerationException(outputValidation.Errors[0]);

            progress.Report(0.85, "Storing generated preview");
            await using (var input = new FileStream(outputPath, FileMode.Open, FileAccess.Read, FileShare.Read, 81920, FileOptions.Asynchronous | FileOptions.SequentialScan))
                newBlobId = await blobs.StoreBlobAsync(input, "video/webm", ct);

            var version = Guid.NewGuid().ToString("N");
            var record = new PreviewRecord(tagId, newBlobId, version, recipe);
            ct.ThrowIfCancellationRequested();
            PreviewRecord? old;
            await using (var mutation = await mutations.AcquireAsync(ct))
            {
                ct.ThrowIfCancellationRequested();
                if (!commitGuard.TryBeginCommit())
                    throw new OperationCanceledException("Preview generation was cancelled before publication.", ct);
                await state.TrackOwnedBlobAsync(new OwnedBlobRecord(newBlobId, tagId, DateTimeOffset.UtcNow), CancellationToken.None);
                old = await state.PublishAsync(record, CancellationToken.None);
                published = true;
                await TryTouchTagAsync(tagId);

                if (old is not null && !string.Equals(old.BlobId, newBlobId, StringComparison.Ordinal))
                {
                    try
                    {
                        await blobs.DeleteBlobAsync(old.BlobId, CancellationToken.None);
                        await state.UntrackOwnedBlobAsync(old.BlobId, CancellationToken.None);
                    }
                    catch
                    {
                        // The durable new mapping wins. The owned marker intentionally remains for dry-run cleanup.
                    }
                }
            }

            progress.Report(1, "Preview ready");
            return new PreviewGenerationResult(record, old is not null);
        }
        catch (OperationCanceledException)
        {
            if (!published && newBlobId is not null)
                await SafeDeleteNewBlobAsync(newBlobId);
            throw;
        }
        catch (PreviewGenerationException)
        {
            if (!published && newBlobId is not null)
                await SafeDeleteNewBlobAsync(newBlobId);
            throw;
        }
        catch
        {
            if (!published && newBlobId is not null)
                await SafeDeleteNewBlobAsync(newBlobId);
            throw new PreviewGenerationException("Preview generation failed.");
        }
        finally
        {
            temporaryFiles.DeleteIfExists(outputPath);
        }
    }

    private async Task SafeDeleteNewBlobAsync(string blobId)
    {
        try { await blobs.DeleteBlobAsync(blobId, CancellationToken.None); }
        catch { }
        try { await state.UntrackOwnedBlobAsync(blobId, CancellationToken.None); }
        catch { }
    }

    private async Task TryTouchTagAsync(int tagId)
    {
        try { await tags.TouchAsync(tagId, CancellationToken.None); }
        catch { }
    }

    private static int CalculateBitrate(int width, PreviewSettings settings)
    {
        var height = PreviewAspectRatios.OutputHeight(width, settings.AspectRatio);
        var defaultHeight = PreviewAspectRatios.OutputHeight(720, "1:1");
        var scaled = (int)Math.Round(2140d * width * height / (720d * defaultHeight));
        return Math.Clamp(scaled, settings.MinimumBitrateKbps, settings.MaximumBitrateKbps);
    }
}

public sealed class PreviewGenerationException(string message) : Exception(message);
