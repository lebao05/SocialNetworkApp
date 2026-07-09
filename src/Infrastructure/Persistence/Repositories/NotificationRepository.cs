using Application.Abstractions.Repositories;
using Application.Shared;
using Domain.Entities;
using Infrastructure.Persistence.Contexts;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories;

public class NotificationRepository : INotificationRepository
{
    private readonly AppDbContext _context;

    public NotificationRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Notification?> GetByIdAsync(long id, CancellationToken cancellationToken = default)
    {
        return await _context.Notifications
            .FirstOrDefaultAsync(n => n.Id == id, cancellationToken);
    }

    public async Task AddAsync(Notification notification, CancellationToken cancellationToken = default)
    {
        await _context.Notifications.AddAsync(notification, cancellationToken);
    }

    public async Task<PagedList<Notification>> GetPagedAsync(
        Guid userId,
        int pageNumber,
        int pageSize,
        bool? isSeen = null,
        CancellationToken cancellationToken = default)
    {
        var query = _context.Notifications
            .Include(n => n.ActorUser)
            .Include(n => n.Group)
            .Include(n => n.FriendRequest)
            .Where(n => n.RecipientUserId == userId);

        if (isSeen.HasValue)
        {
            query = query.Where(n => n.IsSeen == isSeen.Value);
        }

        query = query.OrderByDescending(n => n.CreatedAt);

        return await PagedList<Notification>.CreateAsync(query, pageNumber, pageSize, cancellationToken);
    }

    public async Task<int> GetUnseenCountAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Notifications
            .CountAsync(n => n.RecipientUserId == userId && !n.IsSeen, cancellationToken);
    }

    public async Task MarkAsSeenAsync(long notificationId, Guid userId, CancellationToken cancellationToken = default)
    {
        var notification = await _context.Notifications
            .FirstOrDefaultAsync(n => n.Id == notificationId && n.RecipientUserId == userId, cancellationToken);

        if (notification != null)
        {
            notification.MarkAsSeen();
        }
    }
}
