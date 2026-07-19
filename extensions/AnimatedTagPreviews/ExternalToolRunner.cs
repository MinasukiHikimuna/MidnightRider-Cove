using System.Diagnostics;
using System.Text;

namespace AnimatedTagPreviews;

public sealed record ToolRunResult(int ExitCode, string StandardOutput, string StandardError, bool TimedOut);

public interface IExternalToolRunner
{
    Task<ToolRunResult> RunAsync(ProcessStartInfo startInfo, TimeSpan timeout, int outputLimit, CancellationToken ct);
}

public sealed class ExternalToolRunner : IExternalToolRunner
{
    public async Task<ToolRunResult> RunAsync(ProcessStartInfo startInfo, TimeSpan timeout, int outputLimit, CancellationToken ct)
    {
        ArgumentNullException.ThrowIfNull(startInfo);
        if (startInfo.UseShellExecute)
            throw new ArgumentException("External tools must not use a shell.", nameof(startInfo));
        if (outputLimit <= 0)
            throw new ArgumentOutOfRangeException(nameof(outputLimit));

        using var process = new Process { StartInfo = startInfo };
        if (!process.Start())
            throw new InvalidOperationException("The external tool process could not be started.");

        var stdoutTask = ReadBoundedAsync(process.StandardOutput, outputLimit);
        var stderrTask = ReadBoundedAsync(process.StandardError, outputLimit);
        using var timeoutCts = new CancellationTokenSource(timeout);
        using var linkedCts = CancellationTokenSource.CreateLinkedTokenSource(ct, timeoutCts.Token);
        try
        {
            await process.WaitForExitAsync(linkedCts.Token);
        }
        catch (OperationCanceledException)
        {
            TryKillTree(process);
            try { await process.WaitForExitAsync(CancellationToken.None).WaitAsync(TimeSpan.FromSeconds(5)); }
            catch (InvalidOperationException) { }
            catch (TimeoutException) { }
            await DrainAfterTerminationAsync(stdoutTask, stderrTask);
            ct.ThrowIfCancellationRequested();
            if (timeoutCts.IsCancellationRequested && !ct.IsCancellationRequested)
                return new ToolRunResult(-1, CompletedOrEmpty(stdoutTask), CompletedOrEmpty(stderrTask), TimedOut: true);
            throw;
        }

        return new ToolRunResult(process.ExitCode, await stdoutTask, await stderrTask, TimedOut: false);
    }

    private static async Task<string> ReadBoundedAsync(StreamReader reader, int limit)
    {
        var retained = new StringBuilder(Math.Min(limit, 4096));
        var buffer = new char[4096];
        while (true)
        {
            var read = await reader.ReadAsync(buffer);
            if (read == 0)
                break;
            retained.Append(buffer, 0, read);
            if (retained.Length > limit)
                retained.Remove(0, retained.Length - limit);
        }
        return retained.ToString();
    }

    private static void TryKillTree(Process process)
    {
        try
        {
            if (!process.HasExited)
                process.Kill(entireProcessTree: true);
        }
        catch (InvalidOperationException) { }
        catch (System.ComponentModel.Win32Exception) { }
    }

    private static string CompletedOrEmpty(Task<string> task)
        => task.Status == TaskStatus.RanToCompletion ? task.Result : string.Empty;

    private static async Task DrainAfterTerminationAsync(Task<string> stdout, Task<string> stderr)
    {
        try { await Task.WhenAll(stdout, stderr).WaitAsync(TimeSpan.FromSeconds(5)); }
        catch (IOException) { }
        catch (TimeoutException) { }
    }
}
