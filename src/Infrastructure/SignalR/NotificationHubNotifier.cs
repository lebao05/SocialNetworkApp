using Application.Abstractions.SignalR;
using Domain.Enums;
using Microsoft.AspNetCore.SignalR;

namespace Infrastructure.SignalR;

public class NotificationHubNotifier : INotificationHubNotifier
{
    private readonly IHubContext<NotificationHub> _hubContext;
    private readonly IPresenceTracker _presenceTracker;

    public NotificationHubNotifier(
        IHubContext<NotificationHub> hubContext,
        IPresenceTracker presenceTracker)
    {
        _hubContext = hubContext;
        _presenceTracker = presenceTracker;
    }

    public async Task NotifyFriendRequestReceivedAsync(
        Guid recipientUserId,
        long notificationId,
        long friendRequestId,
        CancellationToken cancellationToken = default)
    {
        var connectionIds = _presenceTracker.GetConnections(recipientUserId.ToString());
        foreach (var connectionId in connectionIds)
        {
            await _hubContext.Clients
                .Client(connectionId)
                .SendAsync(
                    "FriendRequestReceived",
                    new
                    {
                        notificationId,
                        friendRequestId
                    },
                    cancellationToken);
        }
    }

    public async Task NotifyGroupJoinRequestAcceptedAsync(
        Guid recipientUserId,
        long notificationId,
        long groupJoinRequestId,
        long groupId,
        CancellationToken cancellationToken = default)
    {
        var connectionIds = _presenceTracker.GetConnections(recipientUserId.ToString());
        foreach (var connectionId in connectionIds)
        {
            await _hubContext.Clients
                .Client(connectionId)
                .SendAsync(
                    "GroupJoinRequestAccepted",
                    new
                    {
                        notificationId,
                        groupJoinRequestId,
                        groupId
                    },
                    cancellationToken);
        }
    }

    public async Task NotifyPostTaggedAsync(
        Guid recipientUserId,
        long notificationId,
        long postId,
        CancellationToken cancellationToken = default)
    {
        var connectionIds = _presenceTracker.GetConnections(recipientUserId.ToString());
        foreach (var connectionId in connectionIds)
        {
            await _hubContext.Clients
                .Client(connectionId)
                .SendAsync(
                    "PostTagged",
                    new
                    {
                        notificationId,
                        postId
                    },
                    cancellationToken);
        }
    }

    public async Task NotifyCommentCreatedAsync(
        Guid recipientUserId,
        long notificationId,
        long postId,
        long commentId,
        NotificationType notificationType,
        CancellationToken cancellationToken = default)
    {
        var connectionIds = _presenceTracker.GetConnections(recipientUserId.ToString());
        foreach (var connectionId in connectionIds)
        {
            var eventName = notificationType == NotificationType.CommentReply
                ? "CommentReply"
                : "CommentCreated";

            await _hubContext.Clients
                .Client(connectionId)
                .SendAsync(
                    eventName,
                    new
                    {
                        notificationId,
                        postId,
                        commentId,
                        notificationType
                    },
                    cancellationToken);
        }
    }
}
