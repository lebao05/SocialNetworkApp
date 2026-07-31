using Application.Abstractions.Messaging;

namespace Application.Admin.Commands.SetUserRole;

/// <summary>
/// Promote or demote a user to/from the ADMIN role.
/// Server-side rules enforced by the handler:
///   - Caller cannot change their own role.
///   - Only ADMIN and USER roles are valid targets (no MODERATOR).
/// The boolean form keeps the controller endpoint trivial; if a future
/// "MODERATOR" role is added, just extend the handler.
/// </summary>
public sealed record SetUserRoleCommand(
    Guid TargetUserId,
    Guid ActingUserId,
    bool MakeAdmin
) : ICommand<SetUserRoleResult>;

public sealed record SetUserRoleResult(Guid UserId, bool IsAdmin);