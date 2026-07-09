using Domain.Enums;

namespace Application.DTOs.Notifications
{
    public sealed record NotificationDto(
        long Id,
        Guid RecipientUserId,
        Guid? ActorUserId,
        string? ActorFirstName,
        string? ActorLastName,
        string? ActorAvatarUrl,
        NotificationType NotificationType,
        NotificationEntityType EntityType,
        long? FriendRequestId,
        FriendRequestStatus? FriendRequestStatus,
        long? GroupJoinRequestId,
        long? GroupId,
        string? GroupName,
        long? PostId,
        long? CommentId,
        string? Metadata,
        bool IsSeen,
        DateTime CreatedAt
    );
}
