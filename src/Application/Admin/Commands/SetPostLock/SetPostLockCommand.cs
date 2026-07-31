using Application.Abstractions.Messaging;

namespace Application.Admin.Commands.SetPostLock;

public sealed record SetPostLockCommand(long PostId, bool IsLocked) : ICommand<SetPostLockResult>;

public sealed record SetPostLockResult(long PostId, bool IsLocked);
