using Domain.Shared;
using MediatR;

namespace Application.Users.Queries.IsBlockingUser;

public sealed record IsBlockingUserQuery(
    Guid CurrentUserId,
    Guid TargetUserId
) : IRequest<Result<bool>>;
