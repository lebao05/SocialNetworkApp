using Application.Abstractions.Messaging;
using Application.DTOs.Friends;
using Application.Shared;

namespace Application.Friend.Queries.GetIncomingFriendRequests
{
    public sealed record GetIncomingFriendRequestsQuery(
        Guid ReceiverId,
        int Page = 1
    ) : IQuery<PagedList<FriendRequestDto>>;
}
