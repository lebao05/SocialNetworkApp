using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Users;
using Domain.Shared;

namespace Application.Users.Queries.GetUserHoverCard
{
    internal sealed class GetUserHoverCardQueryHandler
        : IQueryHandler<GetUserHoverCardQuery, UserHoverCardResponse>
    {
        private readonly IUserRepository _userRepository;
        private readonly IFriendGraphService _friendGraphService;
        private readonly IFriendshipRepository _friendshipRepository;

        public GetUserHoverCardQueryHandler(
            IUserRepository userRepository,
            IFriendGraphService friendGraphService,
            IFriendshipRepository friendshipRepository)
        {
            _userRepository = userRepository;
            _friendGraphService = friendGraphService;
            _friendshipRepository = friendshipRepository;
        }

        public async Task<Result<UserHoverCardResponse>> Handle(
            GetUserHoverCardQuery request,
            CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);

            if (user is null)
            {
                return Result.Failure<UserHoverCardResponse>(new Error(
                    "User.NotFound",
                    $"The user with Id {request.UserId} was not found."));
            }

            var mutualFriendsCount = 0;
            var topMutualFriends = new List<MutualFriendCard>();
            var isFriend = false;
            var isFollowing = false;

            // If currentUserId is provided, fetch mutual friends and relationship status
            if (request.CurrentUserId.HasValue && request.CurrentUserId.Value != request.UserId)
            {
                var allMutualFriends = await _friendGraphService.GetMutualFriendsAsync(
                    request.CurrentUserId.Value,
                    request.UserId);

                mutualFriendsCount = allMutualFriends.Count;
                topMutualFriends = allMutualFriends
                    .Take(2)
                    .Select(mf => new MutualFriendCard(mf.FullName, mf.AvatarUrl))
                    .ToList();

                isFriend = await _friendshipRepository.ExistsAsync(
                    request.CurrentUserId.Value,
                    request.UserId);

                isFollowing = await _friendshipRepository.ExistsFollowingAsync(
                    request.CurrentUserId.Value,
                    request.UserId,
                    cancellationToken);
            }

            return Result.Success(new UserHoverCardResponse(
                user.Id,
                user.FirstName,
                user.LastName,
                user.AvatarUrl,
                mutualFriendsCount,
                topMutualFriends,
                isFriend,
                isFollowing));
        }
    }
}
