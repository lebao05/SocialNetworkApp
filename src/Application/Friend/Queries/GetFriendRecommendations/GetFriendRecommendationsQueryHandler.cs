using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.DTOs.Friends;
using Domain.Shared;

namespace Application.Friend.Queries.GetFriendRecommendations
{
    internal sealed class GetFriendRecommendationsQueryHandler
        : IQueryHandler<GetFriendRecommendationsQuery, List<FriendResponse>>
    {
        private readonly IFriendGraphService _friendGraphService;

        public GetFriendRecommendationsQueryHandler(IFriendGraphService friendGraphService)
        {
            _friendGraphService = friendGraphService;
        }

        public async Task<Result<List<FriendResponse>>> Handle(
            GetFriendRecommendationsQuery request,
            CancellationToken cancellationToken)
        {
            var recommendations = await _friendGraphService.GetFriendRecommendationsAsync(request.UserId, request.Limit);
            return Result.Success(recommendations);
        }
    }
}
