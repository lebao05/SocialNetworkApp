using Application.Abstractions.Messaging;
using Application.DTOs.Friends;

namespace Application.Friend.Queries.GetFollowees;

public sealed record GetFolloweesQuery(Guid UserId) : IQuery<List<FolloweeResponse>>;
