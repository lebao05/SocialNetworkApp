using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Shared;

namespace Application.Admin.Commands.SetUserLock;

internal sealed class SetUserLockCommandHandler : ICommandHandler<SetUserLockCommand, SetUserLockResult>
{
    private readonly IUserRepository _users;

    public SetUserLockCommandHandler(IUserRepository users) => _users = users;

    public async Task<Result<SetUserLockResult>> Handle(
        SetUserLockCommand request,
        CancellationToken cancellationToken)
    {
        var ok = await _users.SetLockedAsync(request.UserId, request.IsLocked, cancellationToken);
        if (!ok)
        {
            return Result.Failure<SetUserLockResult>(
                new Error("Admin.UserNotFound", "User not found."));
        }

        return Result.Success(new SetUserLockResult(request.UserId, request.IsLocked));
    }
}