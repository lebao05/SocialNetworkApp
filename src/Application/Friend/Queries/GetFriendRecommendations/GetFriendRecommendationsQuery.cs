using Application.Abstractions.Messaging;
using Application.DTOs.Friends;

namespace Application.Friend.Queries.GetFriendRecommendations
{
    public sealed record GetFriendRecommendationsQuery(Guid UserId, int Limit = 10) 
        : IQuery<List<FriendResponse>>;
}
