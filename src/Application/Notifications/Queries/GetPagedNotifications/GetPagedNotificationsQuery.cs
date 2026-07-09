using Application.Abstractions.Messaging;
using Application.DTOs.Notifications;
using Application.Shared;

namespace Application.Notifications.Queries.GetPagedNotifications
{
    public sealed record GetPagedNotificationsQuery(
        Guid UserId,
        int Page = 1,
        int PageSize = 20,
        bool? IsSeen = null
    ) : IQuery<PagedList<NotificationDto>>;
}
