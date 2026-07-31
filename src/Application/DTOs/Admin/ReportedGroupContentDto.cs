using Domain.Enums;

namespace Application.DTOs.Admin;

/// <summary>
/// The group that was reported — a flattened view for quick admin assessment.
/// </summary>
public record ReportedGroupContentDto(
    long Id,
    ReporterSummaryDto Owner,
    string Name,
    string? Description,
    GroupPrivacyType PrivacyType,
    int MemberCount,
    DateTime CreatedAt,
    bool IsLocked
);
