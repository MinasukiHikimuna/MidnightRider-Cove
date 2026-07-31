namespace SegmentStudio.Tests;

using System.Data;
using System.Data.Common;
using System.Diagnostics.CodeAnalysis;
using Microsoft.Data.Sqlite;

/// <summary>
/// Makes the provider's generic repeatable-read transaction deferred so WAL-mode tests can
/// commit through a second connection after the first read has established the snapshot.
/// Production uses Npgsql and does not use this test-only connection wrapper.
/// </summary>
internal sealed class DeferredSqliteConnection(string connectionString) : DbConnection
{
    private readonly SqliteConnection _inner = new(connectionString);

    [AllowNull]
    public override string ConnectionString
    {
        get => _inner.ConnectionString;
        set => _inner.ConnectionString = value;
    }

    public override string Database => _inner.Database;
    public override string DataSource => _inner.DataSource;
    public override string ServerVersion => _inner.ServerVersion;
    public override ConnectionState State => _inner.State;
    public override int ConnectionTimeout => _inner.ConnectionTimeout;

    public override void ChangeDatabase(string databaseName) => _inner.ChangeDatabase(databaseName);
    public override void Close() => _inner.Close();
    public override void Open() => _inner.Open();
    public override Task OpenAsync(CancellationToken cancellationToken) =>
        _inner.OpenAsync(cancellationToken);

    protected override DbTransaction BeginDbTransaction(IsolationLevel isolationLevel) =>
        _inner.BeginTransaction(isolationLevel, deferred: true);

    protected override ValueTask<DbTransaction> BeginDbTransactionAsync(
        IsolationLevel isolationLevel,
        CancellationToken cancellationToken) =>
        ValueTask.FromResult<DbTransaction>(
            _inner.BeginTransaction(isolationLevel, deferred: true));

    protected override DbCommand CreateDbCommand() => _inner.CreateCommand();

    protected override void Dispose(bool disposing)
    {
        if (disposing)
            _inner.Dispose();
        base.Dispose(disposing);
    }

    public override async ValueTask DisposeAsync()
    {
        await _inner.DisposeAsync();
        GC.SuppressFinalize(this);
    }
}
