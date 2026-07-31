# Segment Studio

Segment Studio is a native Cove extension for direct segment editing, review,
performer-slot assignment, provenance, and derivation lineage. It supports a
streamlined basic workflow for canonical Cove segments and a full workflow for
extension-owned drafts and derived segments.

Its extension ID intentionally remains `segment-studio` so pre-release installs,
API routes, and migration receipts retain one continuous identity.

The extension includes video discovery, a timeline-first editor, review and
recycling-bin workflows, segment groups, provenance inspection, integrity
scanning, and AI feedback exports. See the packaged `docs` directory for the
user guide, administrator guide, and detailed design plans.

## Development

Run the complete .NET and UI suites from this package directory:

```bash
dotnet test SegmentStudio.slnx --configuration Release
node --test tests/SegmentStudio.Tests/SegmentStudioUi.test.mjs
```

The private migration operators under `scripts/` are not installed with the
extension. Their PostgreSQL integration tests require
`SEGMENT_STUDIO_MIGRATION_TEST_DATABASE_URL` to name an isolated PostgreSQL
database whose role can create temporary databases.

Before applying the pre-release migration rebaseline, stop Cove and retain a
database backup. The rebaseline accepts only the exact 36-migration development
chain and replaces it with the public `001_initial_schema` receipt.
