using Application.Abstractions.Repositories;
using Application.Abstractions.SignalR;
using Application.Abstractions.Messaging;
using Domain.Entities;
using Domain.Enums;
using Domain.Events;
using Microsoft.Extensions.Logging;

namespace Application.Groups.Events.GroupJoinRequestAccepted;

internal sealed class GroupJoinRequestAcceptedDomainEventHandler
    : IDomainEventHandler<GroupJoinRequestAcceptedDomainEvent>
{
    private readonly INotificationRepository _notificationRepository;
    private readonly IGroupRepository _groupRepository;
    private readonly INotificationHubNotifier _notificationHubNotifier;
    private readonly ILogger<GroupJoinRequestAcceptedDomainEventHandler> _logger;

    public GroupJoinRequestAcceptedDomainEventHandler(
        INotificationRepository notificationRepository,
        IGroupRepository groupRepository,
        INotificationHubNotifier notificationHubNotifier,
        ILogger<GroupJoinRequestAcceptedDomainEventHandler> logger)
    {
        _notificationRepository = notificationRepository;
        _groupRepository = groupRepository;
        _notificationHubNotifier = notificationHubNotifier;
        _logger = logger;
    }

    public async Task Handle(
        GroupJoinRequestAcceptedDomainEvent notification,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation(
            "Processing GroupJoinRequestAcceptedDomainEvent for join request {GroupJoinRequestId}",
            notification.GroupJoinRequestId);

        var group = await _groupRepository.GetByIdAsync(notification.GroupId, cancellationToken);
        if (group == null)
        {
            _logger.LogWarning("Group {GroupId} not found", notification.GroupId);
            return;
        }

            var notificationEntity = new Notification(
                id: 0,
                recipientUserId: notification.UserId,
                actorUserId: notification.ApprovedByUserId,
                notificationType: NotificationType.GroupInvite,
                entityType: NotificationEntityType.GroupJoinRequest,
                metadata: null
            );

        notificationEntity.SetGroupId(notification.GroupId);
        notificationEntity.SetGroupJoinRequestId(notification.GroupJoinRequestId);

        await _notificationRepository.AddAsync(notificationEntity, cancellationToken);

        await _notificationHubNotifier.NotifyGroupJoinRequestAcceptedAsync(
            notification.UserId,
            notificationEntity.Id,
            notification.GroupJoinRequestId,
            notification.GroupId,
            cancellationToken);

        _logger.LogInformation(
            "Notification created and SignalR notification sent for group join request {GroupJoinRequestId} to user {UserId}",
            notification.GroupJoinRequestId, notification.UserId);
    }
}
