using Application.Abstractions.Messaging;
using Application.DTOs.Friends;

namespace Application.Friend.Queries.GetMutualFriends
{
    public sealed record GetMutualFriendsQuery(Guid UserId, Guid OtherUserId) 
        : IQuery<List<FriendResponse>>;
}
