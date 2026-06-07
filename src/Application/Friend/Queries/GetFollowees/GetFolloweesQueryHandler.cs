using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Friends;
using Domain.Shared;

namespace Application.Friend.Queries.GetFollowees;

internal sealed class GetFolloweesQueryHandler
    : IQueryHandler<GetFolloweesQuery, List<FolloweeResponse>>
{
    private readonly IFriendshipRepository _friendshipRepository;
    private readonly IFriendGraphService _friendGraphService;

    public GetFolloweesQueryHandler(
        IFriendshipRepository friendshipRepository,
        IFriendGraphService friendGraphService)
    {
        _friendshipRepository = friendshipRepository;
        _friendGraphService = friendGraphService;
    }

    public async Task<Result<List<FolloweeResponse>>> Handle(
        GetFolloweesQuery request,
        CancellationToken cancellationToken)
    {
        var followees = await _friendshipRepository.GetFolloweesAsync(request.UserId, cancellationToken);

        var items = new List<FolloweeResponse>();
        foreach (var followee in followees)
        {
            var mutualCount = await _friendGraphService.GetMutualFriendCountAsync(request.UserId, followee.Id, cancellationToken);
            var isFriend = await _friendshipRepository.ExistsAsync(request.UserId, followee.Id, cancellationToken);

            items.Add(new FolloweeResponse(
                followee.Id,
                $"{followee.FirstName} {followee.LastName}".Trim(),
                followee.AvatarUrl,
                mutualCount,
                isFriend));
        }

        return Result.Success(items);
    }
}
