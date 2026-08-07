using Application.Abstractions.Messaging;
using Application.DTOs.Friends;
using Application.Shared;

namespace Application.Friend.Queries.GetFriends;

public sealed record GetFriendsQuery(Guid UserId, Guid ViewerId, int Page = 1, string? SearchTerm = null)
    : IQuery<PagedList<GetFriendsResponseDto>>;
