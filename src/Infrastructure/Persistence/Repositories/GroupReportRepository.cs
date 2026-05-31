using Application.Abstractions.Repositories;
using Application.Shared;
using Domain.Entities;
using Domain.Enums;
using Infrastructure.Persistence.Contexts;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories
{
    public sealed class GroupReportRepository : IGroupReportRepository
    {
        private readonly AppDbContext _context;

        public GroupReportRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<ReportedGroupContent?> GetByIdAsync(long id, CancellationToken cancellationToken = default)
        {
            return await _context.ReportedGroupContents
                .FirstOrDefaultAsync(report => report.Id == id, cancellationToken);
        }

        public async Task<PagedList<ReportedGroupContent>> GetByGroupIdPagedAsync(
            long groupId,
            int page,
            int pageSize,
            GroupReportStatus? status = null,
            CancellationToken cancellationToken = default)
        {
            var query = _context.ReportedGroupContents
                .AsNoTracking()
                .Include(report => report.Reporter)
                .Include(report => report.ReviewedBy)
                .Include(report => report.Post)
                    .ThenInclude(post => post.Author)
                .Where(report => report.GroupId == groupId);

            if (status.HasValue)
            {
                query = query.Where(report => report.Status == status.Value);
            }

            query = query
                .OrderByDescending(report => report.CreatedAt)
                .ThenByDescending(report => report.Id);

            return await PagedList<ReportedGroupContent>.CreateAsync(query, page, pageSize, cancellationToken);
        }

        public async Task<bool> ExistsAsync(Guid reporterId, long postId, CancellationToken cancellationToken = default)
        {
            return await _context.ReportedGroupContents
                .AnyAsync(report => report.ReporterId == reporterId && report.PostId == postId, cancellationToken);
        }

        public void Add(ReportedGroupContent report)
        {
            _context.ReportedGroupContents.Add(report);
        }
    }
}
