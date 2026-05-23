using Application.Abstractions.Messaging;
using Application.DTOs.Friends;

namespace Application.Friend.Queries.GetShortestPath
{
    public sealed record GetShortestPathQuery(Guid StartUserId, Guid EndUserId) 
        : IQuery<List<FriendResponse>>;
}
