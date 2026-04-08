using Application.Abstractions.Messaging;
using Application.DTOs.Friends;

namespace Application.Friend.Queries.GetFriends;

public sealed record GetFriendsQuery(Guid UserId) : IQuery<List<FriendResponse>>;