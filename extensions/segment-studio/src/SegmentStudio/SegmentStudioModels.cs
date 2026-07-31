using Cove.Core.Entities;
using Cove.Core.Entities.Auth;
using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

public sealed class SegmentStudioReviewSegment
{
    public int SegmentId { get; set; }
    public int VideoId { get; set; }
    public int TagId { get; set; }
    public string ReviewState { get; set; } = "unreviewed";
}

public sealed class SegmentStudioSegmentGroup
{
    public long Id { get; set; }
    public string Name { get; set; } = "";
    public int SortOrder { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public ICollection<SegmentStudioSegmentGroupTag> Tags { get; set; } = [];
}

public sealed class SegmentStudioSegmentGroupTag
{
    public long SegmentGroupId { get; set; }
    public int TagId { get; set; }
    public int SortOrder { get; set; }
    public SegmentStudioSegmentGroup SegmentGroup { get; set; } = null!;
}

public sealed class SegmentStudioSegmentGroupOperation
{
    public Guid OperationId { get; set; }
    public string Kind { get; set; } = "";
    public DateTime CreatedAt { get; set; }
}

public sealed class SegmentStudioItem
{
    public long Id { get; set; }
    public int? NativeSegmentId { get; set; }
    public string? ReviewState { get; set; }
    public int RepresentationSchemaVersion { get; set; } = 1;
    public int? VideoId { get; set; }
    public double? StartSec { get; set; }
    public double? EndSec { get; set; }
    public int? TagId { get; set; }
    public string? Kind { get; set; }
    public long? RefId { get; set; }
    public string? PayloadJson { get; set; }
    public string? SourceKey { get; set; }
    public string? SourceRunId { get; set; }
    public float? Confidence { get; set; }
    public string? Title { get; set; }
    public string? ColorHint { get; set; }
    public string? ExtensionImageBlobId { get; set; }
    public long Revision { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public ICollection<SegmentStudioSegmentSlot> Slots { get; set; } = [];
}

public sealed class SegmentStudioNativeRecycleBinEntry
{
    public long Id { get; set; }
    public int VideoId { get; set; }
    public int TagId { get; set; }
    public double StartSec { get; set; }
    public double? EndSec { get; set; }
    public string Kind { get; set; } = "tag";
    public long? RefId { get; set; }
    public string? PayloadJson { get; set; }
    public string SourceKey { get; set; } = "user";
    public string? SourceRunId { get; set; }
    public float? Confidence { get; set; }
    public string? Title { get; set; }
    public string? ColorHint { get; set; }
    public string? ImageBlobId { get; set; }
    public string FieldProvenanceJson { get; set; } = "[]";
    public string? PreservedAnchorJson { get; set; }
    public long Revision { get; set; } = 1;
    public DateTime NativeCreatedAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public sealed class SegmentStudioSegmentOperation
{
    public Guid OperationId { get; set; }
    public string Kind { get; set; } = "";
    public int? ActorUserId { get; set; }
    public string RequestFingerprint { get; set; } = "";
    public long? ItemId { get; set; }
    public int? SourceNativeSegmentId { get; set; }
    public int? ResultNativeSegmentId { get; set; }
    public string? ResultPayloadJson { get; set; }
    public string? ComponentFingerprint { get; set; }
    public DateTime CreatedAt { get; set; }
}

public sealed class SegmentStudioShotBoundary
{
    public long Id { get; set; }
    public int VideoId { get; set; }
    public double StartSec { get; set; }
    public double EndSec { get; set; }
    public string Source { get; set; } = "manual";
    public string? MetadataJson { get; set; }
    public long Revision { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public sealed class SegmentStudioShotBoundaryOperation
{
    public Guid OperationId { get; set; }
    public int VideoId { get; set; }
    public string Kind { get; set; } = "";
    public string RequestFingerprint { get; set; } = "";
    public DateTime CreatedAt { get; set; }
}

public sealed class SegmentStudioAnalysisRun
{
    public Guid Id { get; set; }
    public int VideoId { get; set; }
    public int VideoFileId { get; set; }
    public string Status { get; set; } = "queued";
    public string AnalysesJson { get; set; } = "[]";
    public string? JobId { get; set; }
    public Guid? ServiceRunId { get; set; }
    public string? SourceFingerprint { get; set; }
    public string? ResultJson { get; set; }
    public string? ErrorCode { get; set; }
    public string? ErrorMessage { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
}

public sealed class SegmentStudioAnalysisCandidate
{
    public long Id { get; set; }
    public Guid RunId { get; set; }
    public long? ItemId { get; set; }
    public int VideoId { get; set; }
    public string CandidateKey { get; set; } = "";
    public string Kind { get; set; } = "";
    public string TagName { get; set; } = "";
    public string Title { get; set; } = "";
    public double StartSec { get; set; }
    public double EndSec { get; set; }
    public double? Confidence { get; set; }
    public string ModelKey { get; set; } = "";
    public int ObservationCount { get; set; }
    public string ReviewState { get; set; } = "unreviewed";
    public DateTime CreatedAt { get; set; }
    public SegmentStudioAnalysisRun Run { get; set; } = null!;
    public SegmentStudioItem? Item { get; set; }
}

public sealed class SegmentStudioHistorySession
{
    public long Id { get; set; }
    public int UserId { get; set; }
    public int VideoId { get; set; }
    public string Mode { get; set; } = SegmentStudioModes.Full;
    public long CursorSequence { get; set; }
    public long Revision { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public ICollection<SegmentStudioHistoryAction> Actions { get; set; } = [];
}

public sealed class SegmentStudioHistoryAction
{
    public long Id { get; set; }
    public long SessionId { get; set; }
    public long Sequence { get; set; }
    public Guid? ReceiptId { get; set; }
    public string Kind { get; set; } = "";
    public string Label { get; set; } = "";
    public string BeforeJson { get; set; } = "{}";
    public string AfterJson { get; set; } = "{}";
    public DateTime CreatedAt { get; set; }
    public SegmentStudioHistorySession Session { get; set; } = null!;
}

public sealed class SegmentStudioIncorrectExample
{
    public long Id { get; set; }
    public long? ItemId { get; set; }
    public long? NativeBinEntryId { get; set; }
    public int VideoId { get; set; }
    public string SnapshotJson { get; set; } = "{}";
    public long Revision { get; set; } = 1;
    public int? CreatedByUserId { get; set; }
    public DateTime CreatedAt { get; set; }
    public SegmentStudioItem? Item { get; set; }
    public SegmentStudioNativeRecycleBinEntry? NativeBinEntry { get; set; }
}

public sealed class SegmentStudioTrainingExport
{
    public Guid Id { get; set; }
    public int VideoId { get; set; }
    public Guid? CaptureOperationId { get; set; }
    public string MetadataJson { get; set; } = "{}";
    public string ManifestJson { get; set; } = "{}";
    public int ExampleCount { get; set; }
    public int? RequestedByUserId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
}

public sealed class SegmentStudioTrainingExportItem
{
    public Guid ExportId { get; set; }
    public long ItemId { get; set; }
    public string? ImageBlobId { get; set; }
    public SegmentStudioTrainingExport Export { get; set; } = null!;
}

public sealed class SegmentStudioTrainingExportExample
{
    public long Id { get; set; }
    public Guid ExportId { get; set; }
    public int Position { get; set; }
    public long CapturedExampleId { get; set; }
    public long CapturedExampleRevision { get; set; }
    public long? ItemId { get; set; }
    public long? NativeBinEntryId { get; set; }
    public string SnapshotJson { get; set; } = "{}";
    public SegmentStudioTrainingExport Export { get; set; } = null!;
    public ICollection<SegmentStudioTrainingExportFrame> Frames { get; set; } = [];
}

public sealed class SegmentStudioTrainingExportFrame
{
    public long Id { get; set; }
    public long ExportExampleId { get; set; }
    public int Position { get; set; }
    public double TimestampSec { get; set; }
    public string ImageBlobId { get; set; } = "";
    public SegmentStudioTrainingExportExample ExportExample { get; set; } = null!;
}

public sealed class SegmentStudioSource
{
    public long Id { get; set; }
    public string Key { get; set; } = "";
    public string DisplayName { get; set; } = "";
    public string? Category { get; set; }
    public string? Provider { get; set; }
    public string? DefaultModelIdentifier { get; set; }
    public string? Description { get; set; }
    public string MetadataJson { get; set; } = "{}";
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public sealed class SegmentStudioProvenanceActivity
{
    public Guid Id { get; set; }
    public string Key { get; set; } = "";
    public string Kind { get; set; } = "";
    public long SourceId { get; set; }
    public string? ExternalRunId { get; set; }
    public string? Status { get; set; }
    public DateTime? StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public string? RequestJson { get; set; }
    public string? ModelsJson { get; set; }
    public string? SummaryJson { get; set; }
    public string MetadataJson { get; set; } = "{}";
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public sealed class SegmentStudioLineageNode
{
    public Guid Id { get; set; }
    public long? ItemId { get; set; }
    public string State { get; set; } = "live";
    public int LastKnownVideoId { get; set; }
    public int? LastKnownTagId { get; set; }
    public double? LastKnownStartSec { get; set; }
    public double? LastKnownEndSec { get; set; }
    public DateTime? MissingSince { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public sealed class SegmentStudioSegmentProvenance
{
    public long Id { get; set; }
    public Guid LineageNodeId { get; set; }
    public long SourceId { get; set; }
    public string Relation { get; set; } = "origin";
    public Guid? ActivityId { get; set; }
    public string? ModelKey { get; set; }
    public string? ModelIdentifier { get; set; }
    public string? ModelVersion { get; set; }
    public float? Confidence { get; set; }
    public DateTime? RecordedAt { get; set; }
    public string MetadataJson { get; set; } = "{}";
    public DateTime? SupersededAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public sealed class SegmentStudioDerivationRule
{
    public Guid Id { get; set; }
    public string Key { get; set; } = "";
    public string Version { get; set; } = "";
    public int SourceTagId { get; set; }
    public int DerivedTagId { get; set; }
    public string MetadataJson { get; set; } = "{}";
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public sealed class SegmentStudioDerivationEdge
{
    public long Id { get; set; }
    public Guid SourceNodeId { get; set; }
    public Guid DerivedNodeId { get; set; }
    public Guid RuleId { get; set; }
    public string RuleVersionAtCreation { get; set; } = "";
    public int SourceTagIdAtCreation { get; set; }
    public int DerivedTagIdAtCreation { get; set; }
    public Guid? ActivityId { get; set; }
    public DateTime? RecordedAt { get; set; }
    public string MetadataJson { get; set; } = "{}";
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public sealed class SegmentStudioLineageIssue
{
    public Guid Id { get; set; }
    public string IssueFingerprint { get; set; } = "";
    public string ComponentKey { get; set; } = "";
    public string IssueKind { get; set; } = "";
    public string State { get; set; } = "open";
    public Guid? LineageNodeId { get; set; }
    public long? EdgeId { get; set; }
    public string DetailsJson { get; set; } = "{}";
    public DateTime FirstDetectedAt { get; set; }
    public DateTime LastDetectedAt { get; set; }
    public DateTime? ResolvedAt { get; set; }
    public string? ResolutionJson { get; set; }
}

public sealed class SegmentStudioLineageScanRun
{
    public Guid Id { get; set; }
    public string Scope { get; set; } = "full";
    public string? ScopeKey { get; set; }
    public string State { get; set; } = "pending";
    public string? CursorJson { get; set; }
    public string? SourceFingerprint { get; set; }
    public string CountsJson { get; set; } = "{}";
    public int? RequestedByUserId { get; set; }
    public DateTime? StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public string? LastError { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public sealed class SegmentStudioBlobCleanupOutbox
{
    public long Id { get; set; }
    public string BlobId { get; set; } = "";
    public string Status { get; set; } = "pending";
    public int AttemptCount { get; set; }
    public string? LastError { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public sealed class SegmentStudioInstallationState
{
    public short Id { get; set; } = 1;
    public bool RequiresLegacyNormalization { get; set; }
    public bool LineageRolloutPaused { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public sealed class SegmentStudioUserPreference
{
    public int UserId { get; set; }
    public string Mode { get; set; } = "editor";
    public DateTime UpdatedAt { get; set; }
}

public sealed record SegmentStudioPreferenceUpdateRequest(
    string Mode,
    bool ConfirmHiddenExtensionOwnedSegments = false,
    bool ConfirmBasicHistoryCleanup = false,
    bool EmptyRecyclingBin = false,
    Guid? OperationId = null,
    string? ExpectedRecyclingBinFingerprint = null);

public sealed record SegmentSourceRegistrationRequest(
    string Key,
    string DisplayName,
    string? Category,
    string? Provider,
    string? DefaultModelIdentifier,
    string? Description,
    string MetadataJson);

public sealed record SegmentSourceDto(
    string Key,
    string DisplayName,
    string? Category,
    string? Provider,
    string? DefaultModelIdentifier,
    string? Description,
    string MetadataJson);

public sealed record SegmentProvenanceCreateRequest(
    string SourceKey,
    string Relation,
    Guid? ActivityId,
    string? ModelKey,
    string? ModelIdentifier,
    string? ModelVersion,
    float? Confidence,
    DateTime? RecordedAt,
    string MetadataJson);

public sealed class SegmentStudioSlotDefinitionSet
{
    public Guid Id { get; set; }
    public int TagId { get; set; }
    public bool AllowSamePerformerInMultipleSlots { get; set; }
    public DateTime CreatedAt { get; set; }
    public ICollection<SegmentStudioSlotDefinition> Definitions { get; set; } = [];
}

public sealed class SegmentStudioSlotDefinition
{
    public Guid Id { get; set; }
    public Guid SlotDefinitionSetId { get; set; }
    public string? Label { get; set; }
    public int SortOrder { get; set; }
    public DateTime CreatedAt { get; set; }
    public SegmentStudioSlotDefinitionSet SlotDefinitionSet { get; set; } = null!;
    public ICollection<SegmentStudioSlotDefinitionGenderHint> GenderHints { get; set; } = [];
}

public sealed class SegmentStudioSlotDefinitionGenderHint
{
    public Guid SlotDefinitionId { get; set; }
    public string GenderHint { get; set; } = "";
    public SegmentStudioSlotDefinition SlotDefinition { get; set; } = null!;
}

public sealed class SegmentStudioSegmentSlot
{
    public long ItemId { get; set; }
    public Guid SlotDefinitionId { get; set; }
    public int PerformerId { get; set; }
    public DateTime CreatedAt { get; set; }
    public SegmentStudioItem Item { get; set; } = null!;
    public SegmentStudioSlotDefinition SlotDefinition { get; set; } = null!;
}

public static class SegmentStudioModelConfiguration
{
    public static void Configure(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<SegmentStudioReviewSegment>(builder =>
        {
            builder.HasNoKey();
            builder.ToView("segment_studio_review_segments");
            builder.Property(segment => segment.SegmentId).HasColumnName("segment_id");
            builder.Property(segment => segment.VideoId).HasColumnName("video_id");
            builder.Property(segment => segment.TagId).HasColumnName("tag_id");
            builder.Property(segment => segment.ReviewState).HasColumnName("review_state");
        });

        modelBuilder.Entity<SegmentStudioSegmentGroup>(builder =>
        {
            builder.ToTable("segment_studio_segment_groups");
            builder.HasKey(group => group.Id);
            builder.Property(group => group.Id).HasColumnName("id");
            builder.Property(group => group.Name).HasColumnName("name").HasMaxLength(200);
            builder.Property(group => group.SortOrder).HasColumnName("sort_order");
            builder.Property(group => group.CreatedAt).HasColumnName("created_at");
            builder.Property(group => group.UpdatedAt).HasColumnName("updated_at");
            builder.HasIndex(group => group.Name).IsUnique();
            builder.HasIndex(group => group.SortOrder).IsUnique();
        });

        modelBuilder.Entity<SegmentStudioSegmentGroupTag>(builder =>
        {
            builder.ToTable("segment_studio_segment_group_tags");
            builder.HasKey(member => new { member.SegmentGroupId, member.TagId });
            builder.Property(member => member.SegmentGroupId).HasColumnName("segment_group_id");
            builder.Property(member => member.TagId).HasColumnName("tag_id");
            builder.Property(member => member.SortOrder).HasColumnName("sort_order");
            builder.HasIndex(member => member.TagId).IsUnique();
            builder.HasIndex(member => new { member.SegmentGroupId, member.SortOrder }).IsUnique();
            builder.HasOne(member => member.SegmentGroup)
                .WithMany(group => group.Tags)
                .HasForeignKey(member => member.SegmentGroupId)
                .OnDelete(DeleteBehavior.Cascade);
            builder.HasOne<Tag>()
                .WithMany()
                .HasForeignKey(member => member.TagId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<SegmentStudioSegmentGroupOperation>(builder =>
        {
            builder.ToTable("segment_studio_segment_group_operations");
            builder.HasKey(operation => operation.OperationId);
            builder.Property(operation => operation.OperationId).HasColumnName("operation_id");
            builder.Property(operation => operation.Kind).HasColumnName("kind").HasMaxLength(32);
            builder.Property(operation => operation.CreatedAt).HasColumnName("created_at");
        });

        modelBuilder.Entity<SegmentStudioItem>(builder =>
        {
            builder.ToTable("segment_studio_items", table => table.HasCheckConstraint(
                "CK_segment_studio_items_representation",
                "(native_segment_id IS NOT NULL AND review_state IS NULL AND video_id IS NULL AND start_sec IS NULL AND end_sec IS NULL AND tag_id IS NULL AND kind IS NULL AND ref_id IS NULL AND payload IS NULL AND source_key IS NULL AND source_run_id IS NULL AND confidence IS NULL AND title IS NULL AND color_hint IS NULL AND extension_image_blob_id IS NULL) OR " +
                "(native_segment_id IS NULL AND review_state IN ('unreviewed', 'approved', 'rejected') AND video_id IS NOT NULL AND start_sec IS NOT NULL AND tag_id IS NOT NULL AND kind IS NOT NULL AND source_key IS NOT NULL)"));
            builder.HasKey(item => item.Id);
            builder.Property(item => item.Id).HasColumnName("id");
            builder.Property(item => item.NativeSegmentId).HasColumnName("native_segment_id");
            builder.Property(item => item.ReviewState).HasColumnName("review_state").HasMaxLength(32);
            builder.Property(item => item.RepresentationSchemaVersion).HasColumnName("representation_schema_version");
            builder.Property(item => item.VideoId).HasColumnName("video_id");
            builder.Property(item => item.StartSec).HasColumnName("start_sec");
            builder.Property(item => item.EndSec).HasColumnName("end_sec");
            builder.Property(item => item.TagId).HasColumnName("tag_id");
            builder.Property(item => item.Kind).HasColumnName("kind");
            builder.Property(item => item.RefId).HasColumnName("ref_id");
            builder.Property(item => item.PayloadJson).HasColumnName("payload").HasColumnType("jsonb");
            builder.Property(item => item.SourceKey).HasColumnName("source_key");
            builder.Property(item => item.SourceRunId).HasColumnName("source_run_id");
            builder.Property(item => item.Confidence).HasColumnName("confidence");
            builder.Property(item => item.Title).HasColumnName("title");
            builder.Property(item => item.ColorHint).HasColumnName("color_hint");
            builder.Property(item => item.ExtensionImageBlobId).HasColumnName("extension_image_blob_id");
            builder.Property(item => item.Revision).HasColumnName("revision");
            builder.Property(item => item.CreatedAt).HasColumnName("created_at");
            builder.Property(item => item.UpdatedAt).HasColumnName("updated_at");
            builder.HasIndex(item => item.NativeSegmentId).IsUnique();
            builder.HasIndex(item => item.ExtensionImageBlobId).IsUnique();
            builder.HasOne<Segment>()
                .WithMany()
                .HasForeignKey(item => item.NativeSegmentId)
                .OnDelete(DeleteBehavior.Cascade);
            builder.HasOne<Video>()
                .WithMany()
                .HasForeignKey(item => item.VideoId)
                .OnDelete(DeleteBehavior.Cascade);
            builder.HasOne<Tag>()
                .WithMany()
                .HasForeignKey(item => item.TagId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<SegmentStudioNativeRecycleBinEntry>(builder =>
        {
            builder.ToTable("segment_studio_native_recycle_bin");
            builder.HasKey(entry => entry.Id);
            builder.Property(entry => entry.Id).HasColumnName("id");
            builder.Property(entry => entry.VideoId).HasColumnName("video_id");
            builder.Property(entry => entry.TagId).HasColumnName("tag_id");
            builder.Property(entry => entry.StartSec).HasColumnName("start_sec");
            builder.Property(entry => entry.EndSec).HasColumnName("end_sec");
            builder.Property(entry => entry.Kind).HasColumnName("kind");
            builder.Property(entry => entry.RefId).HasColumnName("ref_id");
            builder.Property(entry => entry.PayloadJson).HasColumnName("payload").HasColumnType("jsonb");
            builder.Property(entry => entry.SourceKey).HasColumnName("source_key");
            builder.Property(entry => entry.SourceRunId).HasColumnName("source_run_id");
            builder.Property(entry => entry.Confidence).HasColumnName("confidence");
            builder.Property(entry => entry.Title).HasColumnName("title");
            builder.Property(entry => entry.ColorHint).HasColumnName("color_hint");
            builder.Property(entry => entry.ImageBlobId).HasColumnName("image_blob_id");
            builder.Property(entry => entry.FieldProvenanceJson)
                .HasColumnName("field_provenance")
                .HasColumnType("jsonb");
            builder.Property(entry => entry.PreservedAnchorJson)
                .HasColumnName("preserved_anchor")
                .HasColumnType("jsonb");
            builder.Property(entry => entry.Revision).HasColumnName("revision");
            builder.Property(entry => entry.NativeCreatedAt)
                .HasColumnName("native_created_at");
            builder.Property(entry => entry.CreatedAt).HasColumnName("created_at");
            builder.Property(entry => entry.UpdatedAt).HasColumnName("updated_at");
            builder.HasIndex(entry => new { entry.VideoId, entry.UpdatedAt });
            builder.HasIndex(entry => entry.ImageBlobId).IsUnique();
            builder.HasOne<Video>().WithMany().HasForeignKey(entry => entry.VideoId)
                .OnDelete(DeleteBehavior.Cascade);
            builder.HasOne<Tag>().WithMany().HasForeignKey(entry => entry.TagId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<SegmentStudioSegmentOperation>(builder =>
        {
            builder.ToTable("segment_studio_segment_operations");
            builder.HasKey(operation => operation.OperationId);
            builder.Property(operation => operation.OperationId).HasColumnName("operation_id");
            builder.Property(operation => operation.Kind).HasColumnName("kind").HasMaxLength(64);
            builder.Property(operation => operation.ActorUserId).HasColumnName("actor_user_id");
            builder.Property(operation => operation.RequestFingerprint).HasColumnName("request_fingerprint");
            builder.Property(operation => operation.ItemId).HasColumnName("item_id");
            builder.Property(operation => operation.SourceNativeSegmentId).HasColumnName("source_native_segment_id");
            builder.Property(operation => operation.ResultNativeSegmentId).HasColumnName("result_native_segment_id");
            builder.Property(operation => operation.ResultPayloadJson).HasColumnName("result_payload").HasColumnType("jsonb");
            builder.Property(operation => operation.ComponentFingerprint).HasColumnName("component_fingerprint");
            builder.Property(operation => operation.CreatedAt).HasColumnName("created_at");
            builder.HasIndex(operation => operation.CreatedAt);
            builder.HasOne<SegmentStudioItem>().WithMany().HasForeignKey(operation => operation.ItemId).OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<SegmentStudioShotBoundary>(builder =>
        {
            builder.ToTable("segment_studio_shot_boundaries");
            builder.HasKey(row => row.Id);
            builder.Property(row => row.Id).HasColumnName("id");
            builder.Property(row => row.VideoId).HasColumnName("video_id");
            builder.Property(row => row.StartSec).HasColumnName("start_sec");
            builder.Property(row => row.EndSec).HasColumnName("end_sec");
            builder.Property(row => row.Source).HasColumnName("source").HasMaxLength(32);
            builder.Property(row => row.MetadataJson).HasColumnName("metadata").HasColumnType("jsonb");
            builder.Property(row => row.Revision).HasColumnName("revision");
            builder.Property(row => row.CreatedAt).HasColumnName("created_at");
            builder.Property(row => row.UpdatedAt).HasColumnName("updated_at");
            builder.HasIndex(row => new { row.VideoId, row.StartSec }).IsUnique();
            builder.HasOne<Video>().WithMany().HasForeignKey(row => row.VideoId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<SegmentStudioShotBoundaryOperation>(builder =>
        {
            builder.ToTable("segment_studio_shot_boundary_operations");
            builder.HasKey(row => row.OperationId);
            builder.Property(row => row.OperationId).HasColumnName("operation_id");
            builder.Property(row => row.VideoId).HasColumnName("video_id");
            builder.Property(row => row.Kind).HasColumnName("kind").HasMaxLength(32);
            builder.Property(row => row.RequestFingerprint).HasColumnName("request_fingerprint");
            builder.Property(row => row.CreatedAt).HasColumnName("created_at");
            builder.HasOne<Video>().WithMany().HasForeignKey(row => row.VideoId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<SegmentStudioAnalysisRun>(builder =>
        {
            builder.ToTable("segment_studio_analysis_runs");
            builder.HasKey(run => run.Id);
            builder.Property(run => run.Id).HasColumnName("id");
            builder.Property(run => run.VideoId).HasColumnName("video_id");
            builder.Property(run => run.VideoFileId).HasColumnName("video_file_id");
            builder.Property(run => run.Status).HasColumnName("status").HasMaxLength(32);
            builder.Property(run => run.AnalysesJson).HasColumnName("analyses").HasColumnType("jsonb");
            builder.Property(run => run.JobId).HasColumnName("job_id").HasMaxLength(100);
            builder.Property(run => run.ServiceRunId).HasColumnName("service_run_id");
            builder.Property(run => run.SourceFingerprint).HasColumnName("source_fingerprint");
            builder.Property(run => run.ResultJson).HasColumnName("result").HasColumnType("jsonb");
            builder.Property(run => run.ErrorCode).HasColumnName("error_code").HasMaxLength(100);
            builder.Property(run => run.ErrorMessage).HasColumnName("error_message");
            builder.Property(run => run.CreatedAt).HasColumnName("created_at");
            builder.Property(run => run.UpdatedAt).HasColumnName("updated_at");
            builder.Property(run => run.CompletedAt).HasColumnName("completed_at");
            builder.HasIndex(run => new { run.VideoId, run.CreatedAt });
            builder.HasIndex(run => run.JobId);
            builder.HasOne<Video>().WithMany().HasForeignKey(run => run.VideoId).OnDelete(DeleteBehavior.Cascade);
            builder.HasOne<VideoFile>().WithMany().HasForeignKey(run => run.VideoFileId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<SegmentStudioAnalysisCandidate>(builder =>
        {
            builder.ToTable("segment_studio_analysis_candidates");
            builder.HasKey(candidate => candidate.Id);
            builder.Property(candidate => candidate.Id).HasColumnName("id");
            builder.Property(candidate => candidate.RunId).HasColumnName("run_id");
            builder.Property(candidate => candidate.ItemId).HasColumnName("item_id");
            builder.Property(candidate => candidate.VideoId).HasColumnName("video_id");
            builder.Property(candidate => candidate.CandidateKey).HasColumnName("candidate_key");
            builder.Property(candidate => candidate.Kind).HasColumnName("kind").HasMaxLength(64);
            builder.Property(candidate => candidate.TagName).HasColumnName("tag_name");
            builder.Property(candidate => candidate.Title).HasColumnName("title");
            builder.Property(candidate => candidate.StartSec).HasColumnName("start_sec");
            builder.Property(candidate => candidate.EndSec).HasColumnName("end_sec");
            builder.Property(candidate => candidate.Confidence).HasColumnName("confidence");
            builder.Property(candidate => candidate.ModelKey).HasColumnName("model_key");
            builder.Property(candidate => candidate.ObservationCount).HasColumnName("observation_count");
            builder.Property(candidate => candidate.ReviewState).HasColumnName("review_state").HasMaxLength(32);
            builder.Property(candidate => candidate.CreatedAt).HasColumnName("created_at");
            builder.HasIndex(candidate => new { candidate.RunId, candidate.CandidateKey }).IsUnique();
            builder.HasIndex(candidate => candidate.ItemId);
            builder.HasIndex(candidate => new { candidate.VideoId, candidate.ReviewState });
            builder.HasOne(candidate => candidate.Run).WithMany().HasForeignKey(candidate => candidate.RunId).OnDelete(DeleteBehavior.Cascade);
            builder.HasOne(candidate => candidate.Item).WithMany().HasForeignKey(candidate => candidate.ItemId).OnDelete(DeleteBehavior.SetNull);
            builder.HasOne<Video>().WithMany().HasForeignKey(candidate => candidate.VideoId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<SegmentStudioHistorySession>(builder =>
        {
            builder.ToTable("segment_studio_history_sessions");
            builder.HasKey(session => session.Id);
            builder.Property(session => session.Id).HasColumnName("id");
            builder.Property(session => session.UserId).HasColumnName("user_id");
            builder.Property(session => session.VideoId).HasColumnName("video_id");
            builder.Property(session => session.Mode).HasColumnName("mode").HasMaxLength(16);
            builder.Property(session => session.CursorSequence).HasColumnName("cursor_sequence");
            builder.Property(session => session.Revision).HasColumnName("revision");
            builder.Property(session => session.CreatedAt).HasColumnName("created_at");
            builder.Property(session => session.UpdatedAt).HasColumnName("updated_at");
            builder.HasIndex(session => new { session.UserId, session.VideoId, session.Mode }).IsUnique();
            if (modelBuilder.Model.FindEntityType(typeof(User)) is not null)
            {
                builder.HasOne<User>().WithMany()
                    .HasForeignKey(session => session.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            }
            builder.HasOne<Video>().WithMany().HasForeignKey(session => session.VideoId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<SegmentStudioHistoryAction>(builder =>
        {
            builder.ToTable("segment_studio_history_actions");
            builder.HasKey(action => action.Id);
            builder.Property(action => action.Id).HasColumnName("id");
            builder.Property(action => action.SessionId).HasColumnName("session_id");
            builder.Property(action => action.Sequence).HasColumnName("sequence");
            builder.Property(action => action.ReceiptId).HasColumnName("receipt_id");
            builder.Property(action => action.Kind).HasColumnName("kind").HasMaxLength(64);
            builder.Property(action => action.Label).HasColumnName("label").HasMaxLength(256);
            builder.Property(action => action.BeforeJson).HasColumnName("before_state").HasColumnType("jsonb");
            builder.Property(action => action.AfterJson).HasColumnName("after_state").HasColumnType("jsonb");
            builder.Property(action => action.CreatedAt).HasColumnName("created_at");
            builder.HasIndex(action => new { action.SessionId, action.Sequence }).IsUnique();
            builder.HasIndex(action => action.ReceiptId)
                .IsUnique()
                .HasFilter("receipt_id IS NOT NULL");
            builder.HasOne(action => action.Session).WithMany(session => session.Actions)
                .HasForeignKey(action => action.SessionId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<SegmentStudioIncorrectExample>(builder =>
        {
            builder.ToTable("segment_studio_incorrect_examples");
            builder.HasKey(row => row.Id);
            builder.Property(row => row.Id).HasColumnName("id");
            builder.Property(row => row.ItemId).HasColumnName("item_id");
            builder.Property(row => row.NativeBinEntryId).HasColumnName("native_bin_entry_id");
            builder.Property(row => row.VideoId).HasColumnName("video_id");
            builder.Property(row => row.SnapshotJson).HasColumnName("snapshot").HasColumnType("jsonb");
            builder.Property(row => row.Revision).HasColumnName("revision");
            builder.Property(row => row.CreatedByUserId).HasColumnName("created_by_user_id");
            builder.Property(row => row.CreatedAt).HasColumnName("created_at");
            builder.HasIndex(row => row.ItemId).IsUnique().HasFilter("item_id IS NOT NULL");
            builder.HasIndex(row => row.NativeBinEntryId).IsUnique().HasFilter("native_bin_entry_id IS NOT NULL");
            builder.HasIndex(row => new { row.VideoId, row.CreatedAt });
            builder.HasOne(row => row.Item).WithMany().HasForeignKey(row => row.ItemId).OnDelete(DeleteBehavior.Restrict);
            builder.HasOne(row => row.NativeBinEntry).WithMany().HasForeignKey(row => row.NativeBinEntryId).OnDelete(DeleteBehavior.Restrict);
            builder.HasOne<Video>().WithMany().HasForeignKey(row => row.VideoId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<SegmentStudioTrainingExport>(builder =>
        {
            builder.ToTable("segment_studio_training_exports");
            builder.HasKey(row => row.Id);
            builder.Property(row => row.Id).HasColumnName("id");
            builder.Property(row => row.VideoId).HasColumnName("video_id");
            builder.Property(row => row.CaptureOperationId).HasColumnName("capture_operation_id");
            builder.Property(row => row.MetadataJson).HasColumnName("metadata").HasColumnType("jsonb");
            builder.Property(row => row.ManifestJson).HasColumnName("manifest").HasColumnType("jsonb");
            builder.Property(row => row.ExampleCount).HasColumnName("example_count");
            builder.Property(row => row.RequestedByUserId).HasColumnName("requested_by_user_id");
            builder.Property(row => row.CreatedAt).HasColumnName("created_at");
            builder.Property(row => row.CompletedAt).HasColumnName("completed_at");
            builder.HasIndex(row => row.CaptureOperationId).IsUnique().HasFilter("capture_operation_id IS NOT NULL");
            builder.HasIndex(row => new { row.VideoId, row.CreatedAt });
            builder.HasOne<Video>().WithMany().HasForeignKey(row => row.VideoId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<SegmentStudioTrainingExportItem>(builder =>
        {
            builder.ToTable("segment_studio_training_export_items");
            builder.HasKey(row => new { row.ExportId, row.ItemId });
            builder.Property(row => row.ExportId).HasColumnName("export_id");
            builder.Property(row => row.ItemId).HasColumnName("item_id");
            builder.Property(row => row.ImageBlobId).HasColumnName("image_blob_id");
            builder.HasOne(row => row.Export).WithMany().HasForeignKey(row => row.ExportId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<SegmentStudioTrainingExportExample>(builder =>
        {
            builder.ToTable("segment_studio_training_export_examples");
            builder.HasKey(row => row.Id);
            builder.Property(row => row.Id).HasColumnName("id");
            builder.Property(row => row.ExportId).HasColumnName("export_id");
            builder.Property(row => row.Position).HasColumnName("position");
            builder.Property(row => row.CapturedExampleId).HasColumnName("captured_example_id");
            builder.Property(row => row.CapturedExampleRevision).HasColumnName("captured_example_revision");
            builder.Property(row => row.ItemId).HasColumnName("item_id");
            builder.Property(row => row.NativeBinEntryId).HasColumnName("native_bin_entry_id");
            builder.Property(row => row.SnapshotJson).HasColumnName("snapshot").HasColumnType("jsonb");
            builder.HasIndex(row => new { row.ExportId, row.Position }).IsUnique();
            builder.HasIndex(row => row.CapturedExampleId);
            builder.HasOne(row => row.Export).WithMany().HasForeignKey(row => row.ExportId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<SegmentStudioTrainingExportFrame>(builder =>
        {
            builder.ToTable("segment_studio_training_export_frames");
            builder.HasKey(row => row.Id);
            builder.Property(row => row.Id).HasColumnName("id");
            builder.Property(row => row.ExportExampleId).HasColumnName("export_example_id");
            builder.Property(row => row.Position).HasColumnName("position");
            builder.Property(row => row.TimestampSec).HasColumnName("timestamp_sec");
            builder.Property(row => row.ImageBlobId).HasColumnName("image_blob_id");
            builder.HasIndex(row => new { row.ExportExampleId, row.Position }).IsUnique();
            builder.HasOne(row => row.ExportExample).WithMany(example => example.Frames)
                .HasForeignKey(row => row.ExportExampleId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<SegmentStudioSource>(builder =>
        {
            builder.ToTable("segment_studio_sources");
            builder.HasKey(source => source.Id);
            builder.Property(source => source.Id).HasColumnName("id");
            builder.Property(source => source.Key).HasColumnName("key");
            builder.Property(source => source.DisplayName).HasColumnName("display_name");
            builder.Property(source => source.Category).HasColumnName("category");
            builder.Property(source => source.Provider).HasColumnName("provider");
            builder.Property(source => source.DefaultModelIdentifier).HasColumnName("default_model_identifier");
            builder.Property(source => source.Description).HasColumnName("description");
            builder.Property(source => source.MetadataJson).HasColumnName("metadata").HasColumnType("jsonb");
            builder.Property(source => source.CreatedAt).HasColumnName("created_at");
            builder.Property(source => source.UpdatedAt).HasColumnName("updated_at");
            builder.HasIndex(source => source.Key).IsUnique();
            builder.HasIndex(source => source.Category);
        });

        modelBuilder.Entity<SegmentStudioProvenanceActivity>(builder =>
        {
            builder.ToTable("segment_studio_provenance_activities");
            builder.HasKey(activity => activity.Id);
            builder.Property(activity => activity.Id).HasColumnName("id");
            builder.Property(activity => activity.Key).HasColumnName("key");
            builder.Property(activity => activity.Kind).HasColumnName("kind");
            builder.Property(activity => activity.SourceId).HasColumnName("source_id");
            builder.Property(activity => activity.ExternalRunId).HasColumnName("external_run_id");
            builder.Property(activity => activity.Status).HasColumnName("status");
            builder.Property(activity => activity.StartedAt).HasColumnName("started_at");
            builder.Property(activity => activity.CompletedAt).HasColumnName("completed_at");
            builder.Property(activity => activity.RequestJson).HasColumnName("request").HasColumnType("jsonb");
            builder.Property(activity => activity.ModelsJson).HasColumnName("models").HasColumnType("jsonb");
            builder.Property(activity => activity.SummaryJson).HasColumnName("summary").HasColumnType("jsonb");
            builder.Property(activity => activity.MetadataJson).HasColumnName("metadata").HasColumnType("jsonb");
            builder.Property(activity => activity.CreatedAt).HasColumnName("created_at");
            builder.Property(activity => activity.UpdatedAt).HasColumnName("updated_at");
            builder.HasIndex(activity => activity.Key).IsUnique();
            builder.HasIndex(activity => new { activity.SourceId, activity.ExternalRunId })
                .IsUnique()
                .HasFilter("external_run_id IS NOT NULL");
            builder.HasIndex(activity => activity.Kind);
            builder.HasOne<SegmentStudioSource>().WithMany().HasForeignKey(activity => activity.SourceId).OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<SegmentStudioLineageNode>(builder =>
        {
            builder.ToTable("segment_studio_lineage_nodes");
            builder.HasKey(node => node.Id);
            builder.Property(node => node.Id).HasColumnName("id");
            builder.Property(node => node.ItemId).HasColumnName("item_id");
            builder.Property(node => node.State).HasColumnName("state");
            builder.Property(node => node.LastKnownVideoId).HasColumnName("last_known_video_id");
            builder.Property(node => node.LastKnownTagId).HasColumnName("last_known_tag_id");
            builder.Property(node => node.LastKnownStartSec).HasColumnName("last_known_start_sec");
            builder.Property(node => node.LastKnownEndSec).HasColumnName("last_known_end_sec");
            builder.Property(node => node.MissingSince).HasColumnName("missing_since");
            builder.Property(node => node.CreatedAt).HasColumnName("created_at");
            builder.Property(node => node.UpdatedAt).HasColumnName("updated_at");
            builder.HasIndex(node => node.ItemId)
                .IsUnique()
                .HasFilter("item_id IS NOT NULL");
            builder.HasIndex(node => node.State);
            builder.HasIndex(node => node.LastKnownVideoId);
            builder.HasIndex(node => node.LastKnownTagId);
            builder.HasOne<SegmentStudioItem>().WithMany().HasForeignKey(node => node.ItemId).OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<SegmentStudioSegmentProvenance>(builder =>
        {
            builder.ToTable("segment_studio_segment_provenance");
            builder.HasKey(assertion => assertion.Id);
            builder.Property(assertion => assertion.Id).HasColumnName("id");
            builder.Property(assertion => assertion.LineageNodeId).HasColumnName("lineage_node_id");
            builder.Property(assertion => assertion.SourceId).HasColumnName("source_id");
            builder.Property(assertion => assertion.Relation).HasColumnName("relation");
            builder.Property(assertion => assertion.ActivityId).HasColumnName("activity_id");
            builder.Property(assertion => assertion.ModelKey).HasColumnName("model_key");
            builder.Property(assertion => assertion.ModelIdentifier).HasColumnName("model_identifier");
            builder.Property(assertion => assertion.ModelVersion).HasColumnName("model_version");
            builder.Property(assertion => assertion.Confidence).HasColumnName("confidence");
            builder.Property(assertion => assertion.RecordedAt).HasColumnName("recorded_at");
            builder.Property(assertion => assertion.MetadataJson).HasColumnName("metadata").HasColumnType("jsonb");
            builder.Property(assertion => assertion.SupersededAt).HasColumnName("superseded_at");
            builder.Property(assertion => assertion.CreatedAt).HasColumnName("created_at");
            builder.Property(assertion => assertion.UpdatedAt).HasColumnName("updated_at");
            builder.HasIndex(assertion => assertion.LineageNodeId);
            builder.HasIndex(assertion => assertion.SourceId);
            builder.HasIndex(assertion => assertion.ActivityId);
            builder.HasIndex(assertion => assertion.ModelIdentifier);
            builder.HasIndex(assertion => assertion.RecordedAt);
            builder.HasIndex(assertion => new
                {
                    assertion.LineageNodeId,
                    assertion.SourceId,
                    assertion.Relation,
                    assertion.ActivityId,
                    assertion.ModelKey,
                    assertion.ModelIdentifier,
                    assertion.ModelVersion,
                })
                .IsUnique()
                .HasFilter("superseded_at IS NULL");
            builder.HasOne<SegmentStudioLineageNode>().WithMany().HasForeignKey(assertion => assertion.LineageNodeId).OnDelete(DeleteBehavior.Cascade);
            builder.HasOne<SegmentStudioSource>().WithMany().HasForeignKey(assertion => assertion.SourceId).OnDelete(DeleteBehavior.Restrict);
            builder.HasOne<SegmentStudioProvenanceActivity>().WithMany().HasForeignKey(assertion => assertion.ActivityId).OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<SegmentStudioDerivationRule>(builder =>
        {
            builder.ToTable("segment_studio_derivation_rules");
            builder.HasKey(rule => rule.Id);
            builder.Property(rule => rule.Id).HasColumnName("id");
            builder.Property(rule => rule.Key).HasColumnName("key");
            builder.Property(rule => rule.Version).HasColumnName("version");
            builder.Property(rule => rule.SourceTagId).HasColumnName("source_tag_id");
            builder.Property(rule => rule.DerivedTagId).HasColumnName("derived_tag_id");
            builder.Property(rule => rule.MetadataJson).HasColumnName("metadata").HasColumnType("jsonb");
            builder.Property(rule => rule.CreatedAt).HasColumnName("created_at");
            builder.Property(rule => rule.UpdatedAt).HasColumnName("updated_at");
            builder.HasIndex(rule => new { rule.Key, rule.Version, rule.SourceTagId, rule.DerivedTagId }).IsUnique();
            builder.HasIndex(rule => rule.SourceTagId);
            builder.HasIndex(rule => rule.DerivedTagId);
            builder.HasIndex(rule => new { rule.SourceTagId, rule.DerivedTagId })
                .IsUnique()
                .HasDatabaseName("IX_segment_studio_derivation_rules_relationship");
            builder.HasOne<Tag>().WithMany().HasForeignKey(rule => rule.SourceTagId).OnDelete(DeleteBehavior.Restrict);
            builder.HasOne<Tag>().WithMany().HasForeignKey(rule => rule.DerivedTagId).OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<SegmentStudioDerivationEdge>(builder =>
        {
            builder.ToTable("segment_studio_derivation_edges");
            builder.HasKey(edge => edge.Id);
            builder.Property(edge => edge.Id).HasColumnName("id");
            builder.Property(edge => edge.SourceNodeId).HasColumnName("source_node_id");
            builder.Property(edge => edge.DerivedNodeId).HasColumnName("derived_node_id");
            builder.Property(edge => edge.RuleId).HasColumnName("rule_id");
            builder.Property(edge => edge.RuleVersionAtCreation).HasColumnName("rule_version_at_creation");
            builder.Property(edge => edge.SourceTagIdAtCreation).HasColumnName("source_tag_id_at_creation");
            builder.Property(edge => edge.DerivedTagIdAtCreation).HasColumnName("derived_tag_id_at_creation");
            builder.Property(edge => edge.ActivityId).HasColumnName("activity_id");
            builder.Property(edge => edge.RecordedAt).HasColumnName("recorded_at");
            builder.Property(edge => edge.MetadataJson).HasColumnName("metadata").HasColumnType("jsonb");
            builder.Property(edge => edge.CreatedAt).HasColumnName("created_at");
            builder.Property(edge => edge.UpdatedAt).HasColumnName("updated_at");
            builder.HasIndex(edge => new { edge.SourceNodeId, edge.DerivedNodeId, edge.RuleId }).IsUnique();
            builder.HasIndex(edge => edge.SourceNodeId);
            builder.HasIndex(edge => edge.DerivedNodeId);
            builder.HasIndex(edge => edge.RuleId);
            builder.HasIndex(edge => edge.ActivityId);
            builder.HasOne<SegmentStudioLineageNode>().WithMany().HasForeignKey(edge => edge.SourceNodeId).OnDelete(DeleteBehavior.Cascade);
            builder.HasOne<SegmentStudioLineageNode>().WithMany().HasForeignKey(edge => edge.DerivedNodeId).OnDelete(DeleteBehavior.Cascade);
            builder.HasOne<SegmentStudioDerivationRule>().WithMany().HasForeignKey(edge => edge.RuleId).OnDelete(DeleteBehavior.Restrict);
            builder.HasOne<SegmentStudioProvenanceActivity>().WithMany().HasForeignKey(edge => edge.ActivityId).OnDelete(DeleteBehavior.Restrict);
            builder.HasOne<Tag>().WithMany().HasForeignKey(edge => edge.SourceTagIdAtCreation).OnDelete(DeleteBehavior.Restrict);
            builder.HasOne<Tag>().WithMany().HasForeignKey(edge => edge.DerivedTagIdAtCreation).OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<SegmentStudioLineageIssue>(builder =>
        {
            builder.ToTable("segment_studio_lineage_issues");
            builder.HasKey(issue => issue.Id);
            builder.Property(issue => issue.Id).HasColumnName("id");
            builder.Property(issue => issue.IssueFingerprint).HasColumnName("issue_fingerprint");
            builder.Property(issue => issue.ComponentKey).HasColumnName("component_key");
            builder.Property(issue => issue.IssueKind).HasColumnName("issue_kind");
            builder.Property(issue => issue.State).HasColumnName("state");
            builder.Property(issue => issue.LineageNodeId).HasColumnName("lineage_node_id");
            builder.Property(issue => issue.EdgeId).HasColumnName("edge_id");
            builder.Property(issue => issue.DetailsJson).HasColumnName("details").HasColumnType("jsonb");
            builder.Property(issue => issue.FirstDetectedAt).HasColumnName("first_detected_at");
            builder.Property(issue => issue.LastDetectedAt).HasColumnName("last_detected_at");
            builder.Property(issue => issue.ResolvedAt).HasColumnName("resolved_at");
            builder.Property(issue => issue.ResolutionJson).HasColumnName("resolution").HasColumnType("jsonb");
            builder.HasIndex(issue => issue.IssueFingerprint)
                .IsUnique()
                .HasFilter("state = 'open'");
            builder.HasIndex(issue => issue.State);
            builder.HasIndex(issue => issue.IssueKind);
            builder.HasIndex(issue => issue.ComponentKey);
            builder.HasIndex(issue => issue.LineageNodeId);
            builder.HasIndex(issue => issue.EdgeId);
            builder.HasOne<SegmentStudioLineageNode>().WithMany().HasForeignKey(issue => issue.LineageNodeId).OnDelete(DeleteBehavior.SetNull);
            builder.HasOne<SegmentStudioDerivationEdge>().WithMany().HasForeignKey(issue => issue.EdgeId).OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<SegmentStudioLineageScanRun>(builder =>
        {
            builder.ToTable("segment_studio_lineage_scan_runs");
            builder.HasKey(run => run.Id);
            builder.Property(run => run.Id).HasColumnName("id");
            builder.Property(run => run.Scope).HasColumnName("scope");
            builder.Property(run => run.ScopeKey).HasColumnName("scope_key");
            builder.Property(run => run.State).HasColumnName("state");
            builder.Property(run => run.CursorJson).HasColumnName("cursor").HasColumnType("jsonb");
            builder.Property(run => run.SourceFingerprint).HasColumnName("source_fingerprint");
            builder.Property(run => run.CountsJson).HasColumnName("counts").HasColumnType("jsonb");
            builder.Property(run => run.RequestedByUserId).HasColumnName("requested_by_user_id");
            builder.Property(run => run.StartedAt).HasColumnName("started_at");
            builder.Property(run => run.CompletedAt).HasColumnName("completed_at");
            builder.Property(run => run.LastError).HasColumnName("last_error");
            builder.Property(run => run.CreatedAt).HasColumnName("created_at");
            builder.Property(run => run.UpdatedAt).HasColumnName("updated_at");
            builder.HasIndex(run => run.Scope)
                .IsUnique()
                .HasFilter("scope = 'full' AND state IN ('pending', 'running')");
            if (modelBuilder.Model.FindEntityType(typeof(User)) is not null)
            {
                builder.HasOne<User>()
                    .WithMany()
                    .HasForeignKey(run => run.RequestedByUserId)
                    .OnDelete(DeleteBehavior.SetNull);
            }
        });

        modelBuilder.Entity<SegmentStudioBlobCleanupOutbox>(builder =>
        {
            builder.ToTable("segment_studio_blob_cleanup_outbox");
            builder.HasKey(entry => entry.Id);
            builder.Property(entry => entry.Id).HasColumnName("id");
            builder.Property(entry => entry.BlobId).HasColumnName("blob_id");
            builder.Property(entry => entry.Status).HasColumnName("status").HasMaxLength(32);
            builder.Property(entry => entry.AttemptCount).HasColumnName("attempt_count");
            builder.Property(entry => entry.LastError).HasColumnName("last_error");
            builder.Property(entry => entry.CreatedAt).HasColumnName("created_at");
            builder.Property(entry => entry.UpdatedAt).HasColumnName("updated_at");
            builder.HasIndex(entry => entry.BlobId).IsUnique();
            builder.HasIndex(entry => new { entry.Status, entry.CreatedAt });
        });

        modelBuilder.Entity<SegmentStudioInstallationState>(builder =>
        {
            builder.ToTable("segment_studio_installation_state");
            builder.HasKey(state => state.Id);
            builder.Property(state => state.Id).HasColumnName("id");
            builder.Property(state => state.RequiresLegacyNormalization).HasColumnName("requires_legacy_normalization");
            builder.Property(state => state.LineageRolloutPaused).HasColumnName("lineage_rollout_paused");
            builder.Property(state => state.UpdatedAt).HasColumnName("updated_at");
        });

        modelBuilder.Entity<SegmentStudioUserPreference>(builder =>
        {
            builder.ToTable("segment_studio_user_preferences");
            builder.HasKey(preference => preference.UserId);
            builder.Property(preference => preference.UserId).HasColumnName("user_id");
            builder.Property(preference => preference.Mode).HasColumnName("mode").HasMaxLength(32);
            builder.Property(preference => preference.UpdatedAt).HasColumnName("updated_at");
        });

        modelBuilder.Entity<SegmentStudioSlotDefinitionSet>(builder =>
        {
            builder.ToTable("segment_studio_slot_definition_sets");
            builder.HasKey(set => set.Id);
            builder.Property(set => set.Id).HasColumnName("id");
            builder.Property(set => set.TagId).HasColumnName("tag_id");
            builder.Property(set => set.AllowSamePerformerInMultipleSlots).HasColumnName("allow_same_performer_in_multiple_slots");
            builder.Property(set => set.CreatedAt).HasColumnName("created_at");
            builder.HasIndex(set => set.TagId).IsUnique();
            builder.HasOne<Tag>().WithMany().HasForeignKey(set => set.TagId).OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<SegmentStudioSlotDefinition>(builder =>
        {
            builder.ToTable("segment_studio_slot_definitions");
            builder.HasKey(definition => definition.Id);
            builder.Property(definition => definition.Id).HasColumnName("id");
            builder.Property(definition => definition.SlotDefinitionSetId).HasColumnName("slot_definition_set_id");
            builder.Property(definition => definition.Label).HasColumnName("label");
            builder.Property(definition => definition.SortOrder).HasColumnName("sort_order");
            builder.Property(definition => definition.CreatedAt).HasColumnName("created_at");
            builder.HasIndex(definition => new { definition.SlotDefinitionSetId, definition.SortOrder }).IsUnique();
            builder.HasOne(definition => definition.SlotDefinitionSet)
                .WithMany(set => set.Definitions)
                .HasForeignKey(definition => definition.SlotDefinitionSetId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<SegmentStudioSlotDefinitionGenderHint>(builder =>
        {
            builder.ToTable("segment_studio_slot_definition_gender_hints");
            builder.HasKey(hint => new { hint.SlotDefinitionId, hint.GenderHint });
            builder.Property(hint => hint.SlotDefinitionId).HasColumnName("slot_definition_id");
            builder.Property(hint => hint.GenderHint).HasColumnName("gender_hint").HasMaxLength(32);
            builder.HasOne(hint => hint.SlotDefinition)
                .WithMany(definition => definition.GenderHints)
                .HasForeignKey(hint => hint.SlotDefinitionId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<SegmentStudioSegmentSlot>(builder =>
        {
            builder.ToTable("segment_studio_segment_slots");
            builder.HasKey(slot => new { slot.ItemId, slot.SlotDefinitionId });
            builder.Property(slot => slot.ItemId).HasColumnName("item_id");
            builder.Property(slot => slot.SlotDefinitionId).HasColumnName("slot_definition_id");
            builder.Property(slot => slot.PerformerId).HasColumnName("performer_id");
            builder.Property(slot => slot.CreatedAt).HasColumnName("created_at");
            builder.HasIndex(slot => new { slot.SlotDefinitionId, slot.PerformerId, slot.ItemId });
            builder.HasIndex(slot => slot.PerformerId);
            builder.HasOne(slot => slot.Item).WithMany(item => item.Slots).HasForeignKey(slot => slot.ItemId).OnDelete(DeleteBehavior.Cascade);
            builder.HasOne(slot => slot.SlotDefinition)
                .WithMany()
                .HasForeignKey(slot => slot.SlotDefinitionId)
                .OnDelete(DeleteBehavior.Cascade);
            builder.HasOne<Performer>().WithMany().HasForeignKey(slot => slot.PerformerId).OnDelete(DeleteBehavior.Restrict);
        });
    }
}
