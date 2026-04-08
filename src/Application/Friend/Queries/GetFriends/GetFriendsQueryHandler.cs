using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Friends;
using Domain.Shared;

namespace Application.Friend.Queries.GetFriends;

internal sealed class GetFriendsQueryHandler
    : IQueryHandler<GetFriendsQuery, List<FriendResponse>>
{
    private readonly IFriendshipRepository _friendshipRepository;

    public GetFriendsQueryHandler(
        IFriendshipRepository friendshipRepository)
    {
        _friendshipRepository = friendshipRepository;
    }

    public async Task<Result<List<FriendResponse>>> Handle(
        GetFriendsQuery request,
        CancellationToken cancellationToken)
    {
        // 1. Fetch User entities from Friendship repository
        var friends = await _friendshipRepository.GetFriendsAsync(
            request.UserId,
            cancellationToken);

        // 2. Map to Response and check PresenceTracker for live status
        var response = friends.Select(static friend => new FriendResponse(
            friend.Id,
            friend.UserName ?? string.Empty,
            $"{friend.FirstName} {friend.LastName}".Trim(),
            friend.AvatarUrl
        ))
        .ToList();

        return Result.Success(response);
    }
}