using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Friends;
using Domain.Shared;

namespace Application.Friend.Queries.GetFollowees;

internal sealed class GetFolloweesQueryHandler
    : IQueryHandler<GetFolloweesQuery, List<GetFolloweesResponseDto>>
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

    public async Task<Result<List<GetFolloweesResponseDto>>> Handle(
        GetFolloweesQuery request,
        CancellationToken cancellationToken)
    {
        var followees = await _friendshipRepository.GetFolloweesAsync(request.UserId, cancellationToken);

        if (followees.Count == 0)
            return Result.Success(new List<GetFolloweesResponseDto>());

        var followeeIds = followees.Select(f => f.Id).ToList();

        // Single Neo4j query for all mutual-friend counts
        var mutualCounts = await _friendGraphService.GetMutualFriendCountsAsync(
            request.UserId, followeeIds, cancellationToken);

        // Single query: is the viewer following each followee?
        var followingIds = await _friendshipRepository.GetFollowingIdsAsync(
            request.ViewerId, followeeIds, cancellationToken);

        var items = followees.Select(followee => new GetFolloweesResponseDto(
            followee.Id,
            $"{followee.FirstName} {followee.LastName}".Trim(),
            followee.AvatarUrl,
            mutualCounts.GetValueOrDefault(followee.Id, 0),
            followingIds.Contains(followee.Id))).ToList();

        return Result.Success(items);
    }
}
