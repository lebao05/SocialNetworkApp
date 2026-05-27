using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Friends;
using Application.Shared;
using Domain.Shared;

namespace Application.Friend.Queries.GetFriends;

internal sealed class GetFriendsQueryHandler
    : IQueryHandler<GetFriendsQuery, PagedList<FriendResponse>>
{
    private const int PageSize = 10;

    private readonly IFriendshipRepository _friendshipRepository;
    private readonly IFriendGraphService _friendGraphService;

    public GetFriendsQueryHandler(
        IFriendshipRepository friendshipRepository,
        IFriendGraphService friendGraphService)
    {
        _friendshipRepository = friendshipRepository;
        _friendGraphService = friendGraphService;
    }

    public async Task<Result<PagedList<FriendResponse>>> Handle(
        GetFriendsQuery request,
        CancellationToken cancellationToken)
    {
        var page = Math.Max(1, request.Page);

        var pagedFriends = await _friendshipRepository.GetFriendsPagedAsync(
            request.UserId,
            page,
            PageSize,
            cancellationToken);

        var items = await Task.WhenAll(pagedFriends.Items.Select(async friend =>
        {
            var mutualFriendCount = await _friendGraphService.GetMutualFriendCountAsync(
                request.UserId,
                friend.Id);

            return new FriendResponse(
                friend.Id,
                friend.UserName ?? string.Empty,
                $"{friend.FirstName} {friend.LastName}".Trim(),
                friend.AvatarUrl,
                mutualFriendCount);
        }));

        return Result.Success(new PagedList<FriendResponse>(
            items.ToList(),
            pagedFriends.PageNumber,
            pagedFriends.PageSize,
            pagedFriends.TotalCount));
    }
}