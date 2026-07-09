using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.Abstractions.SignalR;
using Domain.Entities;
using Domain.Enums;
using Domain.Events;
using Microsoft.Extensions.Logging;

namespace Application.Posts.Events.CommentCreated;

internal sealed class CommentCreatedDomainEventHandler
    : IDomainEventHandler<CommentCreatedDomainEvent>
{
    private readonly INotificationRepository _notificationRepository;
    private readonly IPostRepository _postRepository;
    private readonly INotificationHubNotifier _notificationHubNotifier;
    private readonly ILogger<CommentCreatedDomainEventHandler> _logger;

    public CommentCreatedDomainEventHandler(
        INotificationRepository notificationRepository,
        IPostRepository postRepository,
        INotificationHubNotifier notificationHubNotifier,
        ILogger<CommentCreatedDomainEventHandler> logger)
    {
        _notificationRepository = notificationRepository;
        _postRepository = postRepository;
        _notificationHubNotifier = notificationHubNotifier;
        _logger = logger;
    }

    public async Task Handle(
        CommentCreatedDomainEvent notification,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation(
            "Processing CommentCreatedDomainEvent for comment {CommentId} on post {PostId}",
            notification.CommentId, notification.PostId);

        // Notify post owner
        var post = await _postRepository.GetByIdAsync(notification.PostId, cancellationToken);
        if (post != null && post.AuthorId != notification.CommenterId)
        {
            await NotifyUserAsync(
                recipientUserId: post.AuthorId,
                actorUserId: notification.CommenterId,
                postId: notification.PostId,
                commentId: notification.CommentId,
                notificationType: NotificationType.Comment,
                entityType: NotificationEntityType.Comment,
                cancellationToken);
        }

        // Notify replied user (if this is a reply)
        if (notification.RepliedUserId.HasValue && notification.RepliedUserId.Value != notification.CommenterId)
        {
            // Don't notify if replied user is the post owner (already notified above)
            if (post == null || notification.RepliedUserId.Value != post.AuthorId)
            {
                await NotifyUserAsync(
                    recipientUserId: notification.RepliedUserId.Value,
                    actorUserId: notification.CommenterId,
                    postId: notification.PostId,
                    commentId: notification.CommentId,
                    notificationType: NotificationType.CommentReply,
                    entityType: NotificationEntityType.Comment,
                    cancellationToken);
            }
        }
    }

    private async Task NotifyUserAsync(
        Guid recipientUserId,
        Guid actorUserId,
        long postId,
        long commentId,
        NotificationType notificationType,
        NotificationEntityType entityType,
        CancellationToken cancellationToken)
    {
        var notificationEntity = new Notification(
            id: 0,
            recipientUserId: recipientUserId,
            actorUserId: actorUserId,
            notificationType: notificationType,
            entityType: entityType,
            metadata: null
        );

        notificationEntity.SetPostId(postId);
        notificationEntity.SetCommentId(commentId);

        await _notificationRepository.AddAsync(notificationEntity, cancellationToken);

        await _notificationHubNotifier.NotifyCommentCreatedAsync(
            recipientUserId,
            notificationEntity.Id,
            postId,
            commentId,
            notificationType,
            cancellationToken);

        _logger.LogInformation(
            "Notification created and SignalR notification sent for comment {CommentId} to user {UserId}",
            commentId, recipientUserId);
    }
}
