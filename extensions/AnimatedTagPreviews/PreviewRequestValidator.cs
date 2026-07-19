namespace AnimatedTagPreviews;

public static class PreviewRequestValidator
{
    private const double MaximumZoom = 12;
    private const int MinimumWidth = 64;

    public static ValidationResult<GeneratePreviewRequest> Validate(
        GeneratePreviewRequest request,
        double sourceDurationSeconds,
        PreviewSettings settings)
    {
        ArgumentNullException.ThrowIfNull(request);
        ArgumentNullException.ThrowIfNull(settings);

        var errors = new List<string>();
        if (request.SourceFileId is <= 0)
            errors.Add("sourceFileId must be a positive integer when provided.");
        if (!IsFinite(sourceDurationSeconds) || sourceDurationSeconds <= 0)
            errors.Add("The selected source file has no usable duration.");
        if (!IsFinite(request.StartSeconds) || request.StartSeconds < 0)
            errors.Add("startSeconds must be a finite, non-negative number.");
        if (!IsFinite(request.DurationSeconds) || request.DurationSeconds <= 0 || request.DurationSeconds > settings.MaximumDurationSeconds)
            errors.Add($"durationSeconds must be greater than zero and no more than {settings.MaximumDurationSeconds}.");
        if (!IsFinite(request.PlaybackSpeed) || request.PlaybackSpeed is < 0.25 or > 1)
            errors.Add("playbackSpeed must be between 0.25 and 1.");
        if (!IsNormalized(request.AnchorX))
            errors.Add("anchorX must be between zero and one.");
        if (!IsNormalized(request.AnchorY))
            errors.Add("anchorY must be between zero and one.");
        if (!IsFinite(request.Zoom) || request.Zoom < 1 || request.Zoom > MaximumZoom)
            errors.Add($"zoom must be between 1 and {MaximumZoom}.");
        var width = request.Width ?? settings.DefaultWidth;
        if (width < MinimumWidth || width > settings.MaximumWidth)
            errors.Add($"width must be between {MinimumWidth} and {settings.MaximumWidth}.");
        else if (width % 2 != 0)
            errors.Add("width must be an even number for VP9 yuv420p output.");
        if (IsFinite(sourceDurationSeconds) && IsFinite(request.StartSeconds) && request.StartSeconds >= sourceDurationSeconds)
            errors.Add("startSeconds must be before the end of the selected source file.");

        if (errors.Count > 0)
            return new ValidationResult<GeneratePreviewRequest>(null, errors);

        var duration = Math.Min(request.DurationSeconds, sourceDurationSeconds - request.StartSeconds);
        if (duration <= 0)
            return ValidationResult<GeneratePreviewRequest>.Failure("The selected time range is empty.");

        return ValidationResult<GeneratePreviewRequest>.Success(request with { DurationSeconds = duration, Width = width });
    }

    public static ValidationResult<PreviewSettings> ValidateSettings(PreviewSettings settings)
    {
        ArgumentNullException.ThrowIfNull(settings);
        var errors = new List<string>();
        if (!IsFinite(settings.DefaultDurationSeconds) || settings.DefaultDurationSeconds <= 0)
            errors.Add("defaultDurationSeconds must be positive.");
        if (!IsFinite(settings.MaximumDurationSeconds) || settings.MaximumDurationSeconds is < 1 or > 30)
            errors.Add("maximumDurationSeconds must be between 1 and 30.");
        if (settings.DefaultDurationSeconds > settings.MaximumDurationSeconds)
            errors.Add("defaultDurationSeconds cannot exceed maximumDurationSeconds.");
        if (settings.MaximumWidth is < MinimumWidth or > 2160)
            errors.Add("maximumWidth must be between 64 and 2160.");
        if (settings.DefaultWidth is < MinimumWidth || settings.DefaultWidth > settings.MaximumWidth)
            errors.Add("defaultWidth must be between 64 and maximumWidth.");
        else if (settings.DefaultWidth % 2 != 0)
            errors.Add("defaultWidth must be an even number.");
        if (settings.FrameRate is < 1 or > 60)
            errors.Add("frameRate must be between 1 and 60.");
        if (settings.MinimumBitrateKbps is < 50 or > 20000
            || settings.MaximumBitrateKbps < settings.MinimumBitrateKbps
            || settings.MaximumBitrateKbps > 20000)
            errors.Add("The bitrate bounds are invalid.");
        if (settings.EncodingTimeoutSeconds is < 10 or > 1800)
            errors.Add("encodingTimeoutSeconds must be between 10 and 1800.");
        if (!PreviewAspectRatios.Supported.ContainsKey(settings.AspectRatio))
            errors.Add("aspectRatio must be 1:1, 4:3, or 16:9.");
        if (settings.CardFit is not ("inherit" or "cover" or "contain"))
            errors.Add("cardFit must be inherit, cover, or contain.");

        var allowedSurfaces = new HashSet<string>(["card", "hero", "list", "picker", "recommendation", "dialog"], StringComparer.Ordinal);
        if (settings.EnabledSurfaces is null)
            errors.Add("enabledSurfaces is required.");
        else if (settings.EnabledSurfaces.Any(surface => !allowedSurfaces.Contains(surface)))
            errors.Add("enabledSurfaces contains an unsupported surface.");

        return errors.Count == 0
            ? ValidationResult<PreviewSettings>.Success(settings with { EnabledSurfaces = settings.EnabledSurfaces!.Distinct(StringComparer.Ordinal).ToArray() })
            : new ValidationResult<PreviewSettings>(null, errors);
    }

    private static bool IsNormalized(double value) => IsFinite(value) && value is >= 0 and <= 1;
    private static bool IsFinite(double value) => !double.IsNaN(value) && !double.IsInfinity(value);
}
