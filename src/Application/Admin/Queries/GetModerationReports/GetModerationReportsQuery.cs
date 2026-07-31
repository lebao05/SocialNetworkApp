using Application.Abstractions.Messaging;
using Application.DTOs.Admin;
using Domain.Enums;

namespace Application.Admin.Queries.GetModerationReports;

/// <summary>
/// Filter options for the admin moderation page.
/// </summary>
public sealed record GetModerationReportsQuery(
    ReportType? ReportType,
    ReportStatus? Status,
    DateTime? FromDate,
    DateTime? ToDate,
    int Page = 1,
    int PageSize = 20
) : IQuery<ModerationReportsResult>;

public sealed record ModerationReportsResult(
    IReadOnlyList<ReportDto> Items,
    long TotalCount,
    int Page,
    int PageSize
);
