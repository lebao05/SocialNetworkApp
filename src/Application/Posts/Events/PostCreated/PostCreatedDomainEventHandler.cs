using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.Abstractions.SignalR;
using Application.DTOs.Notifications;
using Domain.Entities;
using Domain.Enums;
using Domain.Events;
using Microsoft.Extensions.Logging;

namespace Application.Posts.Events.PostCreated;

internal sealed class PostCreatedDomainEventHandler
    : IDomainEventHandler<PostCreatedDomainEvent>
{
    private readonly INotificationRepository _notificationRepository;
    private readonly IUserRepository _userRepository;
    private readonly IPostRepository _postRepository;
    private readonly INotificationHubNotifier _notificationHubNotifier;
    private readonly ILogger<PostCreatedDomainEventHandler> _logger;

    public PostCreatedDomainEventHandler(
        INotificationRepository notificationRepository,
        IUserRepository userRepository,
        IPostRepository postRepository,
        INotificationHubNotifier notificationHubNotifier,
        ILogger<PostCreatedDomainEventHandler> logger)
    {
        _notificationRepository = notificationRepository;
        _userRepository = userRepository;
        _postRepository = postRepository;
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

        var post = await _postRepository.GetByIdAsync(notification.PostId, cancellationToken);
        if (post is null)
        {
            _logger.LogWarning(
                "Post {PostId} no longer exists, skipping tag notifications",
                notification.PostId);
            return;
        }

        var author = await _userRepository.GetByIdAsync(notification.AuthorId, cancellationToken);

        foreach (var taggedUserId in notification.TaggedUserIds)
        {
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

            var saved = await _notificationRepository.AddAsync(notificationEntity, cancellationToken);
            if (saved is null)
            {
                _logger.LogError("Failed to persist post-tag notification for post {PostId} → user {UserId}",
                    notification.PostId, taggedUserId);
                continue;
            }
            notificationEntity = saved;

            var dto = new NotificationDto(
                Id: notificationEntity.Id,
                RecipientUserId: taggedUserId,
                ActorUserId: notification.AuthorId,
                ActorFirstName: author?.FirstName,
                ActorLastName: author?.LastName,
                ActorAvatarUrl: author?.AvatarUrl,
                NotificationType: NotificationType.Tag,
                EntityType: NotificationEntityType.PostTagged,
                FriendRequestId: null,
                FriendRequestStatus: null,
                GroupJoinRequestId: null,
                GroupId: null,
                GroupName: null,
                PostId: notification.PostId,
                CommentId: null,
                Metadata: null,
                IsSeen: false,
                CreatedAt: notificationEntity.CreatedAt);

            await _notificationHubNotifier.NotifyAsync(dto, cancellationToken);

            _logger.LogInformation(
                "Notification created and SignalR notification sent for post {PostId} to tagged user {UserId}",
                notification.PostId, taggedUserId);
        }
    }
}
