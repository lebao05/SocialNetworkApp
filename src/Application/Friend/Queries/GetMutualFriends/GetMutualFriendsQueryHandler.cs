using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.DTOs.Friends;
using Domain.Shared;

namespace Application.Friend.Queries.GetMutualFriends
{
    internal sealed class GetMutualFriendsQueryHandler
        : IQueryHandler<GetMutualFriendsQuery, List<FriendResponse>>
    {
        private readonly IFriendGraphService _friendGraphService;

        public GetMutualFriendsQueryHandler(IFriendGraphService friendGraphService)
        {
            _friendGraphService = friendGraphService;
        }

        public async Task<Result<List<FriendResponse>>> Handle(
            GetMutualFriendsQuery request,
            CancellationToken cancellationToken)
        {
            var mutualFriends = await _friendGraphService.GetMutualFriendsAsync(request.UserId, request.OtherUserId);
            return Result.Success(mutualFriends);
        }
    }
}
