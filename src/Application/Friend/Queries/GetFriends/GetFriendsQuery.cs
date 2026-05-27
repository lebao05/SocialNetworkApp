using Application.Abstractions.Messaging;
using Application.DTOs.Friends;
using Application.Shared;

namespace Application.Friend.Queries.GetFriends;

public sealed record GetFriendsQuery(Guid UserId, int Page = 1) : IQuery<PagedList<FriendResponse>>;