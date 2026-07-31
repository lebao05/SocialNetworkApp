using Application.Abstractions.Messaging;

namespace Application.Admin.Commands.SetReelLock;

public sealed record SetReelLockCommand(long ReelId, bool IsLocked) : ICommand<SetReelLockResult>;

public sealed record SetReelLockResult(long ReelId, bool IsLocked);
