namespace Application.DTOs.Friends;

/// <summary>
/// Response DTO for the GetFollowees query. Followees are users the
/// target account follows who may or may not be mutual friends.
/// IsFollowing indicates whether the requesting user follows this followee.
/// </summary>
public sealed record GetFolloweesResponseDto(
    Guid Id,
    string FullName,
    string? AvatarUrl,
    int MutualFriendsCount,
    bool IsFollowing);
