using Application.Abstractions.Messaging;
using Application.DTOs.Users;

namespace Application.Users.Queries.GetUserHoverCard
{
    public sealed record GetUserHoverCardQuery(Guid UserId, Guid? CurrentUserId = null) : IQuery<UserHoverCardResponse>;
}
