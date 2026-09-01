using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Friends;
using Application.Shared;
using Domain.Shared;

namespace Application.Friend.Queries.GetFriends;

internal sealed class GetFriendsQueryHandler
    : IQueryHandler<GetFriendsQuery, PagedList<GetFriendsResponseDto>>
{
    private const int PageSize = 10;

    private readonly IFriendshipRepository _friendshipRepository;
    private readonly IFriendRequestRepository _friendRequestRepository;
    private readonly IFriendGraphService _friendGraphService;

    public GetFriendsQueryHandler(
        IFriendshipRepository friendshipRepository,
        IFriendRequestRepository friendRequestRepository,
        IFriendGraphService friendGraphService)
    {
        _friendshipRepository = friendshipRepository;
        _friendRequestRepository = friendRequestRepository;
        _friendGraphService = friendGraphService;
    }

    public async Task<Result<PagedList<GetFriendsResponseDto>>> Handle(
        GetFriendsQuery request,
        CancellationToken cancellationToken)
    {
        var page = Math.Max(1, request.Page);

        var pagedFriends = await _friendshipRepository.GetFriendsPagedAsync(
            request.UserId,
            page,
            PageSize,
            request.SearchTerm,
            cancellationToken);

        var friendIds = pagedFriends.Items.Select(f => f.Id).ToList();

        if (friendIds.Count == 0)
        {
            return Result.Success(new PagedList<GetFriendsResponseDto>(
                [],
                pagedFriends.PageNumber,
                pagedFriends.PageSize,
                pagedFriends.TotalCount));
        }

        var viewerFriendIds = await _friendshipRepository.GetFriendIdsAsync(
            request.ViewerId, friendIds, cancellationToken);

        var pendingRecipientIds = await _friendRequestRepository.GetPendingRecipientIdsAsync(
            request.ViewerId, friendIds, cancellationToken);

        var mutualFriendCounts = await _friendGraphService.GetMutualFriendCountsAsync(
            request.ViewerId, friendIds, cancellationToken);

        var items = pagedFriends.Items.Select(friend => new GetFriendsResponseDto(
            friend.Id,
            friend.UserName ?? string.Empty,
            $"{friend.FirstName} {friend.LastName}".Trim(),
            friend.AvatarUrl,
            mutualFriendCounts.GetValueOrDefault(friend.Id, 0),
            IsFriend: viewerFriendIds.Contains(friend.Id),
            IsSendingFriendRequest: pendingRecipientIds.Contains(friend.Id))).ToList();

        return Result.Success(new PagedList<GetFriendsResponseDto>(
            items,
            pagedFriends.PageNumber,
            pagedFriends.PageSize,
            pagedFriends.TotalCount));
    }
}
