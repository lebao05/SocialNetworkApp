using Domain.Enums;

namespace Application.DTOs.Friends;

/// <summary>
/// Response DTO for the GetIncomingFriendRequests query. Each entry is
/// a pending request sent to the user, with sender metadata and the
/// number of mutual friends shared with that sender.
/// </summary>
public sealed record GetIncomingFriendRequestsResponseDto(
    long Id,
    Guid SenderId,
    string SenderFirstName,
    string SenderLastName,
    string? SenderAvatarUrl,
    Guid ReceiverId,
    FriendRequestStatus Status,
    DateTime CreatedAt,
    int MutualFriendsCount);