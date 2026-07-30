using Application.Abstractions.Messaging;

namespace Application.Admin.Commands.SetUserLock;

/// <summary>
/// Toggles the IsLocked moderation flag on a user.
/// Reuses the same handler for both lock and unlock — the controller decides
/// which verb to call based on the button the admin clicked.
/// </summary>
public sealed record SetUserLockCommand(Guid UserId, bool IsLocked) : ICommand<SetUserLockResult>;

public sealed record SetUserLockResult(Guid UserId, bool IsLocked);