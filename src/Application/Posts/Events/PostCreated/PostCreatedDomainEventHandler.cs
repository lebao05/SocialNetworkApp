using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.Abstractions.SignalR;
using Domain.Entities;
using Domain.Enums;
using Domain.Events;
using Microsoft.Extensions.Logging;

namespace Application.Posts.Events.PostCreated;

internal sealed class PostCreatedDomainEventHandler
    : IDomainEventHandler<PostCreatedDomainEvent>
{
    private readonly INotificationRepository _notificationRepository;
    private readonly INotificationHubNotifier _notificationHubNotifier;
    private readonly ILogger<PostCreatedDomainEventHandler> _logger;

    public PostCreatedDomainEventHandler(
        INotificationRepository notificationRepository,
        INotificationHubNotifier notificationHubNotifier,
        ILogger<PostCreatedDomainEventHandler> logger)
    {
        _notificationRepository = notificationRepository;
        _notificationHubNotifier = notificationHubNotifier;
        _logger = logger;
    }

    public async Task Handle(
        PostCreatedDomainEvent notification,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation(
            "Processing PostCreatedDomainEvent for post {PostId} with {TaggedCount} tagged users",
            notification.PostId, notification.TaggedUserIds.Count);

        if (notification.TaggedUserIds.Count == 0)
        {
            _logger.LogInformation("No tagged users to notify for post {PostId}", notification.PostId);
            return;
        }

        foreach (var taggedUserId in notification.TaggedUserIds)
        {
            // Don't notify the author if they tagged themselves
            if (taggedUserId == notification.AuthorId)
            {
                continue;
            }

            var notificationEntity = new Notification(
                id: 0,
                recipientUserId: taggedUserId,
                actorUserId: notification.AuthorId,
                notificationType: NotificationType.Tag,
                entityType: NotificationEntityType.PostTagged,
                metadata: null
            );

            notificationEntity.SetPostId(notification.PostId);

            await _notificationRepository.AddAsync(notificationEntity, cancellationToken);

            await _notificationHubNotifier.NotifyPostTaggedAsync(
                taggedUserId,
                notificationEntity.Id,
                notification.PostId,
                cancellationToken);

            _logger.LogInformation(
                "Notification created and SignalR notification sent for post {PostId} to tagged user {UserId}",
                notification.PostId, taggedUserId);
        }
    }
}
