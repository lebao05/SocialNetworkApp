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

    public GetFriendsQueryHandler(IFriendshipRepository friendshipRepository)
    {
        _friendshipRepository = friendshipRepository;
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
            request.SearchTerm,
            cancellationToken);

        var items = pagedFriends.Items.Select(friend => new FriendResponse(
            friend.Id,
            friend.UserName ?? string.Empty,
            $"{friend.FirstName} {friend.LastName}".Trim(),
            friend.AvatarUrl,
            0)).ToList();

        return Result.Success(new PagedList<FriendResponse>(
            items,
            pagedFriends.PageNumber,
            pagedFriends.PageSize,
            pagedFriends.TotalCount));
    }
}
