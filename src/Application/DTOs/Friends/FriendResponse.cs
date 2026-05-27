namespace Application.DTOs.Friends;

public sealed record MutualFriendCard(
    string FullName,
    string? AvatarUrl);

public sealed record FriendResponse(
    Guid Id,
    string UserName,
    string FullName,
    string? AvatarUrl,
    int MutualFriendsCount = 0,
    List<MutualFriendCard>? TopMutualFriends = null);