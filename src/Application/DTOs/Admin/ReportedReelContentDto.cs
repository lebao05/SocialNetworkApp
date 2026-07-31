using Domain.Enums;

namespace Application.DTOs.Admin;

/// <summary>
/// The reel that was reported — a flattened view for quick admin assessment.
/// </summary>
public record ReportedReelContentDto(
    long Id,
    ReporterSummaryDto Author,
    string? Caption,
    string VideoUrl,
    string? ThumbnailUrl,
    string? Duration,
    ReelVisibility Visibility,
    int LikeCount,
    int CommentCount,
    int ViewCount,
    DateTime CreatedAt,
    bool IsLocked
);
