using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Shared;

namespace Application.Admin.Commands.SetPostLock;

internal sealed class SetPostLockCommandHandler : ICommandHandler<SetPostLockCommand, SetPostLockResult>
{
    private readonly IPostRepository _posts;

    public SetPostLockCommandHandler(IPostRepository posts) => _posts = posts;

    public async Task<Result<SetPostLockResult>> Handle(
        SetPostLockCommand request,
        CancellationToken cancellationToken)
    {
        var ok = await _posts.SetLockedAsync(request.PostId, request.IsLocked, cancellationToken);
        if (!ok)
            return Result.Failure<SetPostLockResult>(
                new Error("Admin.PostNotFound", "Post not found."));

        return Result.Success(new SetPostLockResult(request.PostId, request.IsLocked));
    }
}
