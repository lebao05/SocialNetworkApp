using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.Abstractions.SignalR;
using Application.DTOs.Notifications;
using Domain.Entities;
using Domain.Enums;
using Domain.Events;
using Microsoft.Extensions.Logging;

namespace Application.Friend.Events.FriendshipCreated;

internal sealed class FriendshipCreatedDomainEventHandler
    : IDomainEventHandler<FriendshipCreatedDomainEvent>
{
    private readonly IFriendGraphService _friendGraphService;
    private readonly INotificationRepository _notificationRepository;
    private readonly IUserRepository _userRepository;
    private readonly INotificationHubNotifier _notificationHubNotifier;
    private readonly ILogger<FriendshipCreatedDomainEventHandler> _logger;

    public FriendshipCreatedDomainEventHandler(
        IFriendGraphService friendGraphService,
        INotificationRepository notificationRepository,
        IUserRepository userRepository,
        INotificationHubNotifier notificationHubNotifier,
        ILogger<FriendshipCreatedDomainEventHandler> logger)
    {
        _friendGraphService = friendGraphService;
        _notificationRepository = notificationRepository;
        _userRepository = userRepository;
        _notificationHubNotifier = notificationHubNotifier;
        _logger = logger;
    }

    public async Task Handle(
        FriendshipCreatedDomainEvent notification,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation(
            "Processing FriendshipCreatedDomainEvent for {SenderId} and {ReceiverId}",
            notification.SenderId, notification.ReceiverId);

        var receiver = await _userRepository.GetByIdAsync(notification.ReceiverId, cancellationToken);

        var notificationEntity = new Notification(
            id: 0,
            recipientUserId: notification.ReceiverId,
            actorUserId: notification.SenderId,
            notificationType: NotificationType.FriendRequest,
            entityType: NotificationEntityType.FriendRequest,
            metadata: null
        );

        var saved = await _notificationRepository.AddAsync(notificationEntity, cancellationToken);
        if (saved is null)
        {
            _logger.LogError("Failed to persist friendship notification for {SenderId} → {ReceiverId}",
                notification.SenderId, notification.ReceiverId);
            return;
        }
        notificationEntity = saved;

        var dto = new NotificationDto(
            Id: notificationEntity.Id,
            RecipientUserId: notification.ReceiverId,
            ActorUserId: notification.SenderId,
            ActorFirstName: receiver?.FirstName,
            ActorLastName: receiver?.LastName,
            ActorAvatarUrl: receiver?.AvatarUrl,
            NotificationType: NotificationType.FriendRequest,
            EntityType: NotificationEntityType.FriendRequest,
            FriendRequestId: null,
            FriendRequestStatus: FriendRequestStatus.Accepted,
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
            "Friendship accepted: notification created and SignalR notification sent to {ReceiverId}",
            notification.ReceiverId);

        try
        {
            await _friendGraphService.SyncFriendshipAsync(
                notification.SenderId,
                notification.ReceiverId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,
                "Failed to sync friendship between {SenderId} and {ReceiverId} to Neo4j social graph via Outbox",
                notification.SenderId, notification.ReceiverId);
            throw;
        }
    }
}
