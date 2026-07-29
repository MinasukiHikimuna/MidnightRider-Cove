using AnimatedTagPreviews;
using System.Text.Json;

namespace AnimatedTagPreviews.Backend.Tests;

public sealed class UploadedPreviewValidatorTests
{
    [Fact]
    public void Upload_probe_requests_every_stream_so_disallowed_streams_are_visible()
    {
        var command = FfprobeCommandBuilder.BuildForUpload("ffprobe", "custom.webm");

        Assert.DoesNotContain("-select_streams", command.ArgumentList);
        Assert.Contains("stream=codec_type,codec_name,width,height,r_frame_rate:format=format_name,duration", command.ArgumentList);
    }

    [Fact]
    public void Accepts_a_single_bounded_vp9_webm_stream_without_reencoding()
    {
        var result = UploadedPreviewValidator.Validate(Probe("video", "vp9", 720, 540, "24/1", "webm", 5), PreviewSettings.Default);

        Assert.True(result.IsValid);
        Assert.Equal(720, result.Value!.Width);
        Assert.Equal(540, result.Value.Height);
        Assert.Equal("vp9", result.Value.VideoCodec);
    }

    [Theory]
    [InlineData("video", "vp8", 720, 540, "24/1", "webm", 5)]
    [InlineData("video", "vp9", 721, 540, "24/1", "webm", 5)]
    [InlineData("video", "vp9", 720, 540, "61/1", "webm", 5)]
    [InlineData("video", "vp9", 720, 540, "24/1", "matroska", 5)]
    [InlineData("video", "vp9", 720, 540, "24/1", "webm", 31)]
    public void Rejects_media_outside_the_custom_webm_contract(string type, string codec, int width, int height, string rate, string format, double duration)
        => Assert.False(UploadedPreviewValidator.Validate(Probe(type, codec, width, height, rate, format, duration), PreviewSettings.Default).IsValid);

    [Fact]
    public void Rejects_audio_or_attachment_streams()
    {
        var json = """{"streams":[{"codec_type":"video","codec_name":"vp9","width":720,"height":540,"r_frame_rate":"24/1"},{"codec_type":"audio","codec_name":"opus"}],"format":{"format_name":"webm","duration":"5"}}""";
        Assert.False(UploadedPreviewValidator.Validate(new ToolRunResult(0, json, "", false), PreviewSettings.Default).IsValid);
    }

    private static ToolRunResult Probe(string type, string codec, int width, int height, string rate, string format, double duration)
        => new(0, JsonSerializer.Serialize(new
        {
            streams = new[] { new { codec_type = type, codec_name = codec, width, height, r_frame_rate = rate } },
            format = new { format_name = format, duration = duration.ToString(System.Globalization.CultureInfo.InvariantCulture) },
        }), "", false);
}
