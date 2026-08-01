using Application.Abstractions.Repositories;
using Application.DTOs.Admin;
using Application.Shared;
using Domain.Entities;
using Domain.Enums;
using Infrastructure.Persistence.Contexts;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories;

public class ReportRepository : IReportRepository
{
    private readonly AppDbContext _db;

    public ReportRepository(AppDbContext db) => _db = db;

    public async Task<PagedList<Report>> GetModerationReportsAsync(
        ReportType? reportType,
        ReportStatus? status,
        DateTime? fromDate,
        DateTime? toDate,
        int page,
        int pageSize,
        CancellationToken cancellationToken = default)
    {
        var query = _db.Reports
            .AsNoTracking()
            .Include(r => r.Reporter)
            .Include(r => r.Post).ThenInclude(p => p!.Author)
            .Include(r => r.Post).ThenInclude(p => p!.Group)
            .Include(r => r.Post).ThenInclude(p => p!.Comments)
            .Include(r => r.Post).ThenInclude(p => p!.Reactions)
            .Include(r => r.Reel).ThenInclude(r => r!.Author)
            .Include(r => r.Reel).ThenInclude(r => r!.Comments)
            .Include(r => r.Reel).ThenInclude(r => r!.Reactions)
            .Include(r => r.ReportedUser)
            .Include(r => r.Group).ThenInclude(g => g!.Owner)
            .Include(r => r.Group).ThenInclude(g => g!.Members)
            .Include(r => r.ReviewedBy)
            .AsQueryable();

        if (reportType.HasValue)
            query = query.Where(r => r.ReportType == reportType.Value);

        if (status.HasValue)
            query = query.Where(r => r.Status == status.Value);

        if (fromDate.HasValue)
            query = query.Where(r => r.CreatedAt >= fromDate.Value);

        if (toDate.HasValue)
            query = query.Where(r => r.CreatedAt <= toDate.Value);

        return await PagedList<Report>.CreateAsync(query.OrderByDescending(r => r.CreatedAt), page, pageSize, cancellationToken);
    }

    public async Task<Report?> GetByIdWithContentAsync(long id, CancellationToken cancellationToken = default)
        => await _db.Reports
            .Include(r => r.Reporter)
            .Include(r => r.Post).ThenInclude(p => p!.Author)
            .Include(r => r.Reel).ThenInclude(r => r!.Author)
            .Include(r => r.ReportedUser)
            .Include(r => r.Group).ThenInclude(g => g!.Owner)
            .Include(r => r.ReviewedBy)
            .FirstOrDefaultAsync(r => r.Id == id, cancellationToken);

    public async Task<int> GetDistinctReporterCountAsync(
        ReportType reportType,
        long? postId,
        long? reelId,
        Guid? userId,
        long? groupId,
        CancellationToken cancellationToken = default)
    {
        var query = _db.Reports
            .AsNoTracking()
            .Where(r => r.ReportType == reportType);

        if (postId.HasValue)       query = query.Where(r => r.PostId   == postId);
        else if (reelId.HasValue)  query = query.Where(r => r.ReelId   == reelId);
        else if (userId.HasValue)  query = query.Where(r => r.UserId   == userId);
        else if (groupId.HasValue) query = query.Where(r => r.GroupId  == groupId);

        return await query.Select(r => r.ReporterId).Distinct().CountAsync(cancellationToken);
    }

    public void Update(Report report) => _db.Reports.Update(report);

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
        => await _db.SaveChangesAsync(cancellationToken);

    public async Task<bool> ExistsAsync(
        Guid reporterId,
        ReportType reportType,
        long? postId = null,
        long? reelId = null,
        Guid? userId = null,
        long? groupId = null,
        CancellationToken cancellationToken = default)
    {
        var query = _db.Reports
            .AsNoTracking()
            .Where(r => r.ReporterId == reporterId && r.ReportType == reportType);

        if (postId.HasValue)       query = query.Where(r => r.PostId   == postId);
        else if (reelId.HasValue)  query = query.Where(r => r.ReelId   == reelId);
        else if (userId.HasValue)  query = query.Where(r => r.UserId   == userId);
        else if (groupId.HasValue) query = query.Where(r => r.GroupId  == groupId);

        return await query.AnyAsync(cancellationToken);
    }

    public async Task AddAsync(Report report, CancellationToken cancellationToken = default)
        => await _db.Reports.AddAsync(report, cancellationToken);
}
