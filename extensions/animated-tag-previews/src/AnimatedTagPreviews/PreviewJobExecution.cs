namespace AnimatedTagPreviews;

public sealed class PreviewJobExecution
{
    private readonly TaskCompletionSource _completion = new(TaskCreationOptions.RunContinuationsAsynchronously);
    private int _state;

    public Task Completion => _completion.Task;

    public bool TryStart() => Interlocked.CompareExchange(ref _state, 1, 0) == 0;

    public void Complete()
    {
        Interlocked.Exchange(ref _state, 2);
        _completion.TrySetResult();
    }

    public void CompleteIfPending()
    {
        if (Interlocked.CompareExchange(ref _state, 2, 0) == 0)
            _completion.TrySetResult();
    }
}
