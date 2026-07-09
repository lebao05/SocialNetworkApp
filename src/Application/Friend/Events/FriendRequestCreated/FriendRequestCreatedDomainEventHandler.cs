using Application.Abstractions.Repositories;
using Application.Abstractions.SignalR;
using Application.Abstractions.Messaging;
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
    private readonly IUserRepository _userRepository;
    private readonly INotificationHubNotifier _notificationHubNotifier;
    private readonly ILogger<FriendRequestCreatedDomainEventHandler> _logger;

    public FriendRequestCreatedDomainEventHandler(
        INotificationRepository notificationRepository,
        IFriendRequestRepository friendRequestRepository,
        IUserRepository userRepository,
        INotificationHubNotifier notificationHubNotifier,
        ILogger<FriendRequestCreatedDomainEventHandler> logger)
    {
        _notificationRepository = notificationRepository;
        _friendRequestRepository = friendRequestRepository;
        _userRepository = userRepository;
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

        var sender = await _userRepository.GetByIdAsync(notification.SenderId, cancellationToken);
        if (sender == null)
        {
            _logger.LogWarning("Sender {SenderId} not found", notification.SenderId);
            return;
        }

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

        // Set the FriendRequestId after creation
        notificationEntity.SetFriendRequestId(friendRequest.Id);

        await _notificationRepository.AddAsync(notificationEntity, cancellationToken);

        await _notificationHubNotifier.NotifyFriendRequestReceivedAsync(
            notification.ReceiverId,
            notificationEntity.Id,
            friendRequest.Id,
            cancellationToken);

        _logger.LogInformation(
            "Notification created and SignalR notification sent for friend request {FriendRequestId} to user {ReceiverId}",
            friendRequest.Id, notification.ReceiverId);
    }
}
