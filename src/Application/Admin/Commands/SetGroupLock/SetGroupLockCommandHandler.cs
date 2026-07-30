using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Shared;

namespace Application.Admin.Commands.SetGroupLock;

internal sealed class SetGroupLockCommandHandler : ICommandHandler<SetGroupLockCommand, SetGroupLockResult>
{
    private readonly IGroupRepository _groups;

    public SetGroupLockCommandHandler(IGroupRepository groups) => _groups = groups;

    public async Task<Result<SetGroupLockResult>> Handle(
        SetGroupLockCommand request,
        CancellationToken cancellationToken)
    {
        var ok = await _groups.SetLockedAsync(request.GroupId, request.IsLocked, cancellationToken);
        if (!ok)
        {
            return Result.Failure<SetGroupLockResult>(
                new Error("Admin.GroupNotFound", "Group not found."));
        }

        return Result.Success(new SetGroupLockResult(request.GroupId, request.IsLocked));
    }
}