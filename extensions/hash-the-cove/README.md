# Hash The Cove

Hash The Cove calculates lowercase `xxhash` (xxHash64), `sha256`, and `sha1`
fingerprints for Cove video and gallery files. Configure the enabled algorithms
on Cove's Extensions settings page, then run **Hash The Cove** from the task
page.

## Development

```text
dotnet test HashTheCove.slnx --configuration Release
```

Release tags use `com.midnightrider.hash-the-cove/v<version>`.
