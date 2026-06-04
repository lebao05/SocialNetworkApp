using Application.Abstractions.Messaging;

namespace Application.Friend.Queries.GetFollowees;

public sealed record GetFolloweesQuery(Guid UserId) : IQuery<List<FolloweeResponse>>;
