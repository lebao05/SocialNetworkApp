using Application.Abstractions.Messaging;

namespace Application.Admin.Commands.SetGroupLock;

public sealed record SetGroupLockCommand(long GroupId, bool IsLocked) : ICommand<SetGroupLockResult>;

public sealed record SetGroupLockResult(long GroupId, bool IsLocked);