using Domain.Enums;

namespace Application.DTOs.Admin;

/// <summary>
/// The post that was reported — a flattened view containing everything
/// an admin needs to assess the report without fetching the full post detail.
/// </summary>
public record ReportedPostContentDto(
    long Id,
    ReporterSummaryDto Author,
    string? Content,
    PostVisibility Visibility,
    DateTime CreatedAt,
    int ReactionCount,
    int CommentCount,
    bool IsAnonymous,
    string? GroupName,    // null when Visibility != Group
    long? GroupId,
    bool IsLocked
);
