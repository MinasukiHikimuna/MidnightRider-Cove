using AnimatedTagPreviews;
using Cove.Core.Interfaces;
using Cove.Plugins;
using System.Text.Json;

namespace AnimatedTagPreviews.Backend.Tests;

public sealed class PreviewContractTests
{
    [Theory]
    [InlineData(double.NaN, 0.5, 0.5, 1, 5, 720)]
    [InlineData(0, -0.1, 0.5, 1, 5, 720)]
    [InlineData(0, 0.5, 1.1, 1, 5, 720)]
    [InlineData(0, 0.5, 0.5, 0.9, 5, 720)]
    [InlineData(0, 0.5, 0.5, 1, 0, 720)]
    [InlineData(0, 0.5, 0.5, 1, 5, 4096)]
    public void Validation_rejects_unsafe_numeric_inputs(
        double start,
        double anchorX,
        double anchorY,
        double zoom,
        double duration,
        int width)
    {
        var request = new GeneratePreviewRequest(11, start, duration, anchorX, anchorY, zoom, width);

        var result = PreviewRequestValidator.Validate(request, sourceDurationSeconds: 30, PreviewSettings.Default);

        Assert.False(result.IsValid);
    }

    [Fact]
    public void Validation_clamps_duration_to_source_remainder()
    {
        var request = new GeneratePreviewRequest(11, 28, 5, 0.5, 0.25, 1.8, 720);

        var result = PreviewRequestValidator.Validate(request, sourceDurationSeconds: 30, PreviewSettings.Default);

        Assert.True(result.IsValid);
        Assert.Equal(2, result.Value!.DurationSeconds, 6);
    }

    [Fact]
    public void Validation_rejects_playback_speed_outside_slow_motion_range()
    {
        var tooSlow = new GeneratePreviewRequest(11, 1, 5, 0.5, 0.5, 1, 720, 0.1);
        var spedUp = tooSlow with { PlaybackSpeed = 1.1 };

        Assert.Contains(PreviewRequestValidator.Validate(tooSlow, 30, PreviewSettings.Default).Errors, error => error.Contains("playbackSpeed"));
        Assert.Contains(PreviewRequestValidator.Validate(spedUp, 30, PreviewSettings.Default).Errors, error => error.Contains("playbackSpeed"));
    }

    [Fact]
    public void Settings_validation_rejects_null_surfaces_and_excessive_bitrate()
    {
        var invalid = PreviewSettings.Default with
        {
            EnabledSurfaces = null!,
            MaximumBitrateKbps = 20_001,
        };

        var exception = Record.Exception(() => PreviewRequestValidator.ValidateSettings(invalid));

        Assert.Null(exception);
        var result = PreviewRequestValidator.ValidateSettings(invalid);
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, error => error.Contains("enabledSurfaces", StringComparison.Ordinal));
        Assert.Contains(result.Errors, error => error.Contains("bitrate", StringComparison.OrdinalIgnoreCase));
    }

    [Fact]
    public void Temporary_file_cleanup_is_best_effort_when_the_path_cannot_be_deleted_as_a_file()
    {
        var directory = Directory.CreateTempSubdirectory("animated-preview-cleanup-");
        try
        {
            var provider = new TemporaryFileProvider(new CoveConfiguration { CachePath = directory.FullName });

            var exception = Record.Exception(() => provider.DeleteIfExists(directory.FullName));

            Assert.Null(exception);
        }
        finally
        {
            directory.Delete(recursive: true);
        }
    }

    [Fact]
    public void Commit_guard_makes_cancellation_and_publication_mutually_exclusive()
    {
        var cancelledFirst = new PreviewCommitGuard();
        var cancelCalled = false;
        Assert.True(cancelledFirst.TryCancel(() => cancelCalled = true));
        Assert.True(cancelCalled);
        Assert.False(cancelledFirst.TryBeginCommit());

        var committedFirst = new PreviewCommitGuard();
        Assert.True(committedFirst.TryBeginCommit());
        cancelCalled = false;
        Assert.False(committedFirst.TryCancel(() => cancelCalled = true));
        Assert.False(cancelCalled);
    }

    [Fact]
    public async Task Job_execution_does_not_finish_until_started_work_exits()
    {
        var running = new PreviewJobExecution();
        Assert.True(running.TryStart());
        running.CompleteIfPending();
        Assert.False(running.Completion.IsCompleted);
        running.Complete();
        await running.Completion;

        var pending = new PreviewJobExecution();
        pending.CompleteIfPending();
        await pending.Completion;
        Assert.False(pending.TryStart());
    }

    [Fact]
    public void Ffmpeg_arguments_are_deterministic_structured_and_shell_free()
    {
        var recipe = new PreviewRecipe(123, 11, 42.5, 5.4, 0.5, 0.25, 1.8, 720,
            "libvpx-vp9", 2140, 24, DateTimeOffset.UnixEpoch, 0.5);

        var startInfo = FfmpegCommandBuilder.Build("ffmpeg", "/media/a file.mp4", "/tmp/out.webm", recipe);

        Assert.False(startInfo.UseShellExecute);
        Assert.Equal("ffmpeg", startInfo.FileName);
        Assert.Contains("/media/a file.mp4", startInfo.ArgumentList);
        Assert.Contains("/tmp/out.webm", startInfo.ArgumentList);
        Assert.Contains("libvpx-vp9", startInfo.ArgumentList);
        var filter = startInfo.ArgumentList[startInfo.ArgumentList.IndexOf("-vf") + 1];
        Assert.Equal("crop=min(iw\\,ih)/1.8:min(iw\\,ih)/1.8:(iw-min(iw\\,ih)/1.8)*0.5:(ih-min(iw\\,ih)/1.8)*0.25,scale=720:720:flags=lanczos,setpts=PTS/0.5,fps=24", filter);
        Assert.Equal("10.8", startInfo.ArgumentList[startInfo.ArgumentList.IndexOf("-t") + 1]);
    }

    [Fact]
    public void Ffprobe_validation_rejects_wrong_codec_dimensions_container_and_duration()
    {
        var recipe = new PreviewRecipe(1, 2, 0, 5, 0.5, 0.5, 1, 720, "libvpx-vp9", 2140, 24, DateTimeOffset.UnixEpoch);
        var invalid = new ToolRunResult(0,
            "{\"streams\":[{\"codec_name\":\"h264\",\"width\":1280,\"height\":720}],\"format\":{\"format_name\":\"mov,mp4\",\"duration\":\"99\"}}",
            string.Empty,
            false);

        var result = FfprobeOutputValidator.Validate(invalid, recipe);

        Assert.False(result.IsValid);
    }

    [Theory]
    [InlineData("1:1", 720, 720)]
    [InlineData("4:3", 720, 540)]
    [InlineData("16:9", 720, 405)]
    public void Preview_dimensions_follow_the_selected_aspect_ratio(string aspectRatio, int width, int height)
    {
        Assert.Equal(height, PreviewAspectRatios.OutputHeight(width, aspectRatio));
    }

    [Fact]
    public void Ffmpeg_generates_the_default_stash_style_four_by_three_preview()
    {
        var recipe = new PreviewRecipe(1, 2, 0, 5, 0.5, 0.5, 1, 720, "libvpx-vp9", 1605, 24, DateTimeOffset.UnixEpoch, 1, "4:3");
        var info = FfmpegCommandBuilder.Build("ffmpeg", "in.mp4", "out.webm", recipe);
        var filter = info.ArgumentList[info.ArgumentList.IndexOf("-vf") + 1];

        Assert.Contains("crop=min(iw\\,ih*4/3)", filter);
        Assert.Contains("scale=720:540", filter);
    }

    [Fact]
    public void Manifest_contributes_only_generic_player_and_media_extension_points()
    {
        var extension = new AnimatedTagPreviewsExtension();
        ((IManifestAware)extension).ApplyManifest(new ExtensionManifestFile
        {
            Id = "com.midnightrider.animated-tag-previews",
            Name = "Animated Tag Previews",
            Version = "1.0.0",
        });

        var manifest = extension.GetUIManifest();

        Assert.Contains(manifest.Slots, slot => slot.Slot == "media-player-actions" && slot.ComponentName == "AnimatedPreviewPlayerAction");
        Assert.Contains(manifest.Slots, slot => slot.Slot == "media-player-overlay" && slot.ComponentName == "AnimatedPreviewPlayerOverlay");
        Assert.Contains(manifest.ComponentOverrides, component => component.TargetComponent == "entity.media" && component.ComponentName == "AnimatedTagMedia");
        Assert.Contains(manifest.ListFilters, filter => filter.EntityType == "tags"
            && filter.FilterId == "has-preview"
            && filter.CriterionType == "boolean");
        Assert.Contains(manifest.SettingsPanels, panel => panel.ComponentName == "AnimatedPreviewSettings");
    }

    [Fact]
    public void Completed_job_contract_identifies_the_private_candidate_instead_of_a_published_version()
    {
        var response = new PreviewJobResponse(
            "job-1",
            7,
            9,
            "completed",
            1,
            "Preview candidate ready",
            DateTime.UnixEpoch,
            DateTime.UnixEpoch,
            null,
            "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");

        var json = JsonSerializer.Serialize(response, new JsonSerializerOptions(JsonSerializerDefaults.Web));

        Assert.Contains("\"candidateId\":\"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\"", json, StringComparison.Ordinal);
        Assert.DoesNotContain("\"version\"", json, StringComparison.Ordinal);
    }

    [Fact]
    public void Orphan_cleanup_contract_reports_expired_approval_metadata_separately_from_blobs()
    {
        var response = new OrphanCleanupResponse(
            DryRun: true,
            Count: 0,
            BlobIds: [],
            OwnedBlobCount: 1,
            ReferencedBlobCount: 1,
            DeletedBlobCount: 0,
            FailedBlobIds: [],
            SnapshotVersion: "snapshot",
            ExpiredApprovalReceiptCount: 2,
            StalePreviewCandidateCount: 3,
            StalePreviewRecordCount: 4);

        Assert.Equal(0, response.Count);
        Assert.Equal(2, response.ExpiredApprovalReceiptCount);
        Assert.Equal(3, response.StalePreviewCandidateCount);
        Assert.Equal(4, response.StalePreviewRecordCount);
    }
}
