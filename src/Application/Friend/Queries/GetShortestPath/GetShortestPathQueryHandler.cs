using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.DTOs.Friends;
using Domain.Shared;

namespace Application.Friend.Queries.GetShortestPath
{
    internal sealed class GetShortestPathQueryHandler
        : IQueryHandler<GetShortestPathQuery, List<FriendResponse>>
    {
        private readonly IFriendGraphService _friendGraphService;

        public GetShortestPathQueryHandler(IFriendGraphService friendGraphService)
        {
            _friendGraphService = friendGraphService;
        }

        public async Task<Result<List<FriendResponse>>> Handle(
            GetShortestPathQuery request,
            CancellationToken cancellationToken)
        {
            var path = await _friendGraphService.GetShortestPathAsync(request.StartUserId, request.EndUserId);
            return Result.Success(path);
        }
    }
}
