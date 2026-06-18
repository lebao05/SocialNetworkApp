using Application.Abstractions.Repositories;
using Domain.Shared;
using MediatR;

namespace Application.Users.Queries.IsBlockedByUserId;

public sealed record IsBlockedByUserIdQuery(
    Guid CurrentUserId,
    Guid TargetUserId
) : IRequest<Result<bool>>;
