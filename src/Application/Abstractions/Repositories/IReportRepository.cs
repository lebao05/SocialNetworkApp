using Application.DTOs.Admin;
using Application.Shared;
using Domain.Entities;
using Domain.Enums;

namespace Application.Abstractions.Repositories;

public interface IReportRepository
{
    Task<PagedList<Report>> GetModerationReportsAsync(
        ReportType? reportType,
        ReportStatus? status,
        DateTime? fromDate,
        DateTime? toDate,
        int page,
        int pageSize,
        CancellationToken cancellationToken = default);

    Task<Report?> GetByIdWithContentAsync(long id, CancellationToken cancellationToken = default);

    Task<int> GetDistinctReporterCountAsync(
        ReportType reportType,
        long? postId,
        long? reelId,
        Guid? userId,
        long? groupId,
        CancellationToken cancellationToken = default);

    void Update(Report report);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}
