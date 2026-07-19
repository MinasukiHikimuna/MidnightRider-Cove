using Cove.Core.Entities;

namespace AnimatedTagPreviews;

public sealed record ResolvedPreviewSource(VideoFile File, string Path);

public static class PreviewSourceResolver
{
    public static ValidationResult<ResolvedPreviewSource> Resolve(Video video, int? requestedFileId)
    {
        ArgumentNullException.ThrowIfNull(video);
        var candidates = video.Files
            .Where(file => file.VideoId == video.Id && file.ZipFileId is null && file.Duration > 0 && file.Width > 0 && file.Height > 0)
            .OrderByDescending(file => (long)file.Width * file.Height)
            .ThenByDescending(file => file.BitRate)
            .ThenBy(file => file.Id)
            .ToArray();

        var selected = requestedFileId.HasValue
            ? candidates.FirstOrDefault(file => file.Id == requestedFileId.Value)
            : candidates.FirstOrDefault(file => File.Exists(ResolvePath(file)));

        if (selected is null)
            return ValidationResult<ResolvedPreviewSource>.Failure("The requested source file is unavailable for this video.");

        var path = ResolvePath(selected);
        if (!File.Exists(path))
            return ValidationResult<ResolvedPreviewSource>.Failure("The requested source file is unavailable for this video.");

        return ValidationResult<ResolvedPreviewSource>.Success(new ResolvedPreviewSource(selected, path));
    }

    private static string ResolvePath(VideoFile file)
        => file.ParentFolder is null ? file.Path : Path.Combine(file.ParentFolder.Path, file.Basename);
}
