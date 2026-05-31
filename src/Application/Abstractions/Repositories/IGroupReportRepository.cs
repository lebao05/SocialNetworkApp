using Domain.Entities;
using Domain.Enums;
using Application.Shared;

namespace Application.Abstractions.Repositories
{
    public interface IGroupReportRepository
    {
        Task<ReportedGroupContent?> GetByIdAsync(long id, CancellationToken cancellationToken = default);
        Task<PagedList<ReportedGroupContent>> GetByGroupIdPagedAsync(long groupId, int page, int pageSize, GroupReportStatus? status = null, CancellationToken cancellationToken = default);
        Task<bool> ExistsAsync(Guid reporterId, long postId, CancellationToken cancellationToken = default);
        void Add(ReportedGroupContent report);
    }
}
