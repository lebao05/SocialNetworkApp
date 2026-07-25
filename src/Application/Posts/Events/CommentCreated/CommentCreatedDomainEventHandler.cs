using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.Abstractions.SignalR;
using Application.DTOs.Notifications;
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
    private readonly IUserRepository _userRepository;
    private readonly INotificationHubNotifier _notificationHubNotifier;
    private readonly ILogger<CommentCreatedDomainEventHandler> _logger;

    public CommentCreatedDomainEventHandler(
        INotificationRepository notificationRepository,
        IPostRepository postRepository,
        IUserRepository userRepository,
        INotificationHubNotifier notificationHubNotifier,
        ILogger<CommentCreatedDomainEventHandler> logger)
    {
        _notificationRepository = notificationRepository;
        _postRepository = postRepository;
        _userRepository = userRepository;
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

        var post = await _postRepository.GetByIdAsync(notification.PostId, cancellationToken);

        // Notify post owner
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

        var actor = await _userRepository.GetByIdAsync(actorUserId, cancellationToken);
        var dto = new NotificationDto(
            Id: notificationEntity.Id,
            RecipientUserId: recipientUserId,
            ActorUserId: actorUserId,
            ActorFirstName: actor?.FirstName,
            ActorLastName: actor?.LastName,
            ActorAvatarUrl: actor?.AvatarUrl,
            NotificationType: notificationType,
            EntityType: entityType,
            FriendRequestId: null,
            FriendRequestStatus: null,
            GroupJoinRequestId: null,
            GroupId: null,
            GroupName: null,
            PostId: postId,
            CommentId: commentId,
            Metadata: null,
            IsSeen: false,
            CreatedAt: notificationEntity.CreatedAt);

        await _notificationHubNotifier.NotifyAsync(dto, cancellationToken);

        _logger.LogInformation(
            "Notification created and SignalR notification sent for comment {CommentId} to user {UserId}",
            commentId, recipientUserId);
    }
}
