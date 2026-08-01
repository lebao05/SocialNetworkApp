using Application.DTOs.Admin;
using Application.Shared;
using Domain.Enums;

namespace Application.Abstractions.Repositories;

public interface IReportRepository
{
    Task<PagedList<Domain.Entities.Report>> GetModerationReportsAsync(
        ReportType? reportType,
        ReportStatus? status,
        DateTime? fromDate,
        DateTime? toDate,
        int page,
        int pageSize,
        CancellationToken cancellationToken = default);

    Task<Domain.Entities.Report?> GetByIdWithContentAsync(long id, CancellationToken cancellationToken = default);

    Task<int> GetDistinctReporterCountAsync(
        ReportType reportType,
        long? postId,
        long? reelId,
        Guid? userId,
        long? groupId,
        CancellationToken cancellationToken = default);

    /// <summary>Checks whether the reporter has already submitted a report for this target.</summary>
    Task<bool> ExistsAsync(
        Guid reporterId,
        ReportType reportType,
        long? postId = null,
        long? reelId = null,
        Guid? userId = null,
        long? groupId = null,
        CancellationToken cancellationToken = default);

    Task AddAsync(Domain.Entities.Report report, CancellationToken cancellationToken = default);
    void Update(Domain.Entities.Report report);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}
