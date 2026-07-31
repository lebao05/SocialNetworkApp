using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.Abstractions.SignalR;
using Application.DTOs.Notifications;
using Domain.Entities;
using Domain.Enums;
using Domain.Events;
using Microsoft.Extensions.Logging;

namespace Application.Friend.Events.FriendRequestCreated;

internal sealed class FriendRequestCreatedDomainEventHandler
    : IDomainEventHandler<FriendRequestCreatedDomainEvent>
{
    private readonly INotificationRepository _notificationRepository;
    private readonly IFriendRequestRepository _friendRequestRepository;
    private readonly INotificationHubNotifier _notificationHubNotifier;
    private readonly ILogger<FriendRequestCreatedDomainEventHandler> _logger;

    public FriendRequestCreatedDomainEventHandler(
        INotificationRepository notificationRepository,
        IFriendRequestRepository friendRequestRepository,
        INotificationHubNotifier notificationHubNotifier,
        ILogger<FriendRequestCreatedDomainEventHandler> logger)
    {
        _notificationRepository = notificationRepository;
        _friendRequestRepository = friendRequestRepository;
        _notificationHubNotifier = notificationHubNotifier;
        _logger = logger;
    }

    public async Task Handle(
        FriendRequestCreatedDomainEvent notification,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation(
            "Processing FriendRequestCreatedDomainEvent for friend request from {SenderId} to {ReceiverId}",
            notification.SenderId, notification.ReceiverId);

        var friendRequest = await _friendRequestRepository.GetBySenderAndReceiverAsync(
            notification.SenderId, notification.ReceiverId);
        if (friendRequest == null)
        {
            _logger.LogWarning("Friend request from {SenderId} to {ReceiverId} not found",
                notification.SenderId, notification.ReceiverId);
            return;
        }

        var notificationEntity = new Notification(
            id: 0,
            recipientUserId: notification.ReceiverId,
            actorUserId: notification.SenderId,
            notificationType: NotificationType.FriendRequest,
            entityType: NotificationEntityType.FriendRequest,
            metadata: null
        );

        notificationEntity.SetFriendRequestId(friendRequest.Id);

        var saved = await _notificationRepository.AddAsync(notificationEntity, cancellationToken);
        if (saved is null)
        {
            _logger.LogError("Failed to persist notification for friend request {FriendRequestId}", friendRequest.Id);
            return;
        }
        notificationEntity = saved;

        var dto = new NotificationDto(
            Id: notificationEntity.Id,
            RecipientUserId: notification.ReceiverId,
            ActorUserId: notification.SenderId,
            ActorFirstName: friendRequest.Sender?.FirstName,
            ActorLastName: friendRequest.Sender?.LastName,
            ActorAvatarUrl: friendRequest.Sender?.AvatarUrl,
            NotificationType: NotificationType.FriendRequest,
            EntityType: NotificationEntityType.FriendRequest,
            FriendRequestId: friendRequest.Id,
            FriendRequestStatus: friendRequest.Status,
            GroupJoinRequestId: null,
            GroupId: null,
            GroupName: null,
            PostId: null,
            CommentId: null,
            Metadata: null,
            IsSeen: false,
            CreatedAt: notificationEntity.CreatedAt);

        await _notificationHubNotifier.NotifyAsync(dto, cancellationToken);

        _logger.LogInformation(
            "Notification created and SignalR notification sent for friend request {FriendRequestId} to user {ReceiverId}",
            friendRequest.Id, notification.ReceiverId);
    }
}
