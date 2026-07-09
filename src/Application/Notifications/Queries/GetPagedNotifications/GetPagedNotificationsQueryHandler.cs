using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Notifications;
using Application.Shared;
using Domain.Entities;
using Domain.Shared;

namespace Application.Notifications.Queries.GetPagedNotifications
{
    internal sealed class GetPagedNotificationsQueryHandler
        : IQueryHandler<GetPagedNotificationsQuery, PagedList<NotificationDto>>
    {
        private readonly INotificationRepository _notificationRepository;

        public GetPagedNotificationsQueryHandler(INotificationRepository notificationRepository)
        {
            _notificationRepository = notificationRepository;
        }

        public async Task<Result<PagedList<NotificationDto>>> Handle(
            GetPagedNotificationsQuery request,
            CancellationToken cancellationToken)
        {
            var page = Math.Max(1, request.Page);
            var pageSize = Math.Clamp(request.PageSize, 1, 50);

            var notifications = await _notificationRepository.GetPagedAsync(
                request.UserId,
                page,
                pageSize,
                request.IsSeen,
                cancellationToken);

            var items = notifications.Items.Select(MapToDto).ToList();

            return Result.Success(new PagedList<NotificationDto>(
                items,
                notifications.PageNumber,
                notifications.PageSize,
                notifications.TotalCount));
        }

        private static NotificationDto MapToDto(Notification notification)
        {
            return new NotificationDto(
                Id: notification.Id,
                RecipientUserId: notification.RecipientUserId,
                ActorUserId: notification.ActorUserId,
                ActorFirstName: notification.ActorUser?.FirstName,
                ActorLastName: notification.ActorUser?.LastName,
                ActorAvatarUrl: notification.ActorUser?.AvatarUrl,
                NotificationType: notification.NotificationType,
                EntityType: notification.EntityType,
                FriendRequestId: notification.FriendRequestId,
                FriendRequestStatus: notification.FriendRequest?.Status,
                GroupJoinRequestId: notification.GroupJoinRequestId,
                GroupId: notification.GroupId,
                GroupName: notification.Group?.Name,
                PostId: notification.PostId,
                CommentId: notification.CommentId,
                Metadata: notification.Metadata,
                IsSeen: notification.IsSeen,
                CreatedAt: notification.CreatedAt);
        }
    }
}
