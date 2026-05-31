using Domain.Enums;

namespace Application.DTOs.Groups
{
    public sealed record ReportedGroupContentDto(
        long Id,
        long GroupId,
        long PostId,
        Guid ReporterId,
        string ReporterName,
        string? ReporterAvatarUrl,
        Guid PostAuthorId,
        string PostAuthorName,
        string? PostContent,
        GroupReportReason Reason,
        string? AdditionalDetail,
        GroupReportStatus Status,
        Guid? ReviewedByUserId,
        string? ReviewedByName,
        DateTime? ReviewedAt,
        string? ReviewNote,
        DateTime CreatedAt
    );
}
