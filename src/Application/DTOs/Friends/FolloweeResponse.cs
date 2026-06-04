namespace Application.DTOs.Friends;

public sealed record FolloweeResponse(
    Guid Id,
    string FullName,
    string? AvatarUrl,
    int MutualFriendsCount,
    bool IsFriend);
