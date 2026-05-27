using Application.DTOs.Friends;

namespace Application.DTOs.Users
{
    public sealed record MutualFriendCard(
        string FullName,
        string? AvatarUrl);

    public sealed record UserHoverCardResponse(
        Guid Id,
        string FirstName,
        string LastName,
        string? AvatarUrl,
        int MutualFriendsCount,
        List<MutualFriendCard> TopMutualFriends,
        bool IsFriend,
        bool IsFollowing);
}
