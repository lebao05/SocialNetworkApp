using Domain.Entities;
using Application.Shared;

namespace Application.Abstractions.Repositories;

public interface INotificationRepository
{
    Task<Notification?> GetByIdAsync(long id, CancellationToken cancellationToken = default);
    Task AddAsync(Notification notification, CancellationToken cancellationToken = default);
    Task<PagedList<Notification>> GetPagedAsync(Guid userId, int pageNumber, int pageSize, bool? isSeen = null, CancellationToken cancellationToken = default);
    Task<int> GetUnseenCountAsync(Guid userId, CancellationToken cancellationToken = default);
    Task MarkAsSeenAsync(long notificationId, Guid userId, CancellationToken cancellationToken = default);
}
