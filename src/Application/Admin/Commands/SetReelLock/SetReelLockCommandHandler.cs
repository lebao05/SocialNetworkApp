using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Shared;

namespace Application.Admin.Commands.SetReelLock;

internal sealed class SetReelLockCommandHandler : ICommandHandler<SetReelLockCommand, SetReelLockResult>
{
    private readonly IReelRepository _reels;

    public SetReelLockCommandHandler(IReelRepository reels) => _reels = reels;

    public async Task<Result<SetReelLockResult>> Handle(
        SetReelLockCommand request,
        CancellationToken cancellationToken)
    {
        var ok = await _reels.SetLockedAsync(request.ReelId, request.IsLocked, cancellationToken);
        if (!ok)
            return Result.Failure<SetReelLockResult>(
                new Error("Admin.ReelNotFound", "Reel not found."));

        return Result.Success(new SetReelLockResult(request.ReelId, request.IsLocked));
    }
}
