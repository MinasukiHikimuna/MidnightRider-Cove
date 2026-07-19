namespace AnimatedTagPreviews;

public sealed class PreviewCommitGuard
{
    private readonly object _lock = new();
    private bool _commitStarted;
    private bool _cancellationRequested;

    public bool TryBeginCommit()
    {
        lock (_lock)
        {
            if (_cancellationRequested)
                return false;
            _commitStarted = true;
            return true;
        }
    }

    public bool TryCancel(Func<bool> cancel)
    {
        ArgumentNullException.ThrowIfNull(cancel);
        lock (_lock)
        {
            if (_commitStarted)
                return false;
            _cancellationRequested = true;
            return cancel();
        }
    }
}
