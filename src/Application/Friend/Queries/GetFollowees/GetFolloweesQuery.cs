using Application.Abstractions.Messaging;
using Application.DTOs.Friends;

namespace Application.Friend.Queries.GetFollowees;

/// <summary>
/// ViewerId is the currently authenticated user — used to determine
/// IsFollowing for each followee in the returned list.
/// </summary>
public sealed record GetFolloweesQuery(Guid UserId, Guid ViewerId)
    : IQuery<List<GetFolloweesResponseDto>>;
