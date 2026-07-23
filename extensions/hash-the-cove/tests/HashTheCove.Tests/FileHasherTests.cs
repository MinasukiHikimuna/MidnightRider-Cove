using System.Text;

namespace HashTheCove.Tests;

public sealed class FileHasherTests
{
    [Fact]
    public async Task HashesKnownVectorWithLowercaseValues()
    {
        var path = Path.GetTempFileName();
        try
        {
            await File.WriteAllTextAsync(path, "hello", Encoding.ASCII);

            var hashes = await FileHasher.HashAsync(path, ["xxhash", "sha256", "sha1"]);

            Assert.Equal("26c7827d889f6da3", hashes["xxhash"]);
            Assert.Equal("2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824", hashes["sha256"]);
            Assert.Equal("aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d", hashes["sha1"]);
        }
        finally
        {
            File.Delete(path);
        }
    }

    [Theory]
    [InlineData(0, "ef46db3751d8e999")]
    [InlineData(1, "e934a84adb052768")]
    [InlineData(31, "c346d2b59b4d8ee1")]
    [InlineData(32, "cbf59c5116ff32b4")]
    [InlineData(33, "0c535d1acafb8ead")]
    [InlineData(131071, "858c276bdf28e3bc")]
    [InlineData(131072, "822c00ad05d633b9")]
    [InlineData(131073, "e06921c1a74a1143")]
    public async Task MatchesOfficialXxHash083AcrossBlockAndStreamBoundaries(int length, string expected)
    {
        var path = Path.GetTempFileName();
        try
        {
            var bytes = Enumerable.Range(0, length).Select(index => (byte)(index % 251)).ToArray();
            await File.WriteAllBytesAsync(path, bytes);

            var hashes = await FileHasher.HashAsync(path, ["xxhash"]);

            Assert.Equal(expected, hashes["xxhash"]);
        }
        finally
        {
            File.Delete(path);
        }
    }
}
