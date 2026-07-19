using Cove.Core.Interfaces;

namespace AnimatedTagPreviews;

public interface ITemporaryFileProvider
{
    string CreateWebmPath();
    void DeleteIfExists(string path);
}

public sealed class TemporaryFileProvider(CoveConfiguration configuration) : ITemporaryFileProvider
{
    public string CreateWebmPath()
    {
        var directory = Path.Combine(configuration.CachePath, "animated-tag-previews");
        Directory.CreateDirectory(directory);
        return Path.Combine(directory, $"{Guid.NewGuid():N}.webm");
    }

    public void DeleteIfExists(string path)
    {
        try { File.Delete(path); }
        catch (FileNotFoundException) { }
        catch (DirectoryNotFoundException) { }
        catch (UnauthorizedAccessException) { }
        catch (IOException) { }
    }
}
