namespace Application.Abstractions.SignalR;

public interface INotificationHubNotifier
{
    Task NotifyFriendRequestReceivedAsync(Guid recipientUserId, long notificationId, long friendRequestId, CancellationToken cancellationToken = default);
    Task NotifyGroupJoinRequestAcceptedAsync(Guid recipientUserId, long notificationId, long groupJoinRequestId, long groupId, CancellationToken cancellationToken = default);
    Task NotifyPostTaggedAsync(Guid recipientUserId, long notificationId, long postId, CancellationToken cancellationToken = default);
    Task NotifyCommentCreatedAsync(Guid recipientUserId, long notificationId, long postId, long commentId, Domain.Enums.NotificationType notificationType, CancellationToken cancellationToken = default);
}
