using Domain.Entities;
using Domain.Shared;

namespace Application.Groups;

/// <summary>
/// Centralised guard for "group is currently active" checks used by every
/// mutation that operates on a group (or on a post/comment inside it).
///
/// Centralising the check keeps the error codes, messages and behaviour
/// identical across all handlers, and gives us one place to extend if more
/// inactive states are added later.
/// </summary>
public static class GroupGuard
{
    /// <summary>
    /// Returns <c>null</c> when the group can be mutated, otherwise an
    /// <see cref="Error"/> describing why the operation is rejected.
    ///
    /// Callers should typically translate the result with
    /// <c>Result.Failure(GroupGuard.EnsureActive(group)!)</c> or
    /// <c>Result.Failure&lt;T&gt;(GroupGuard.EnsureActive(group)!)</c>.
    /// </summary>
    public static Error? EnsureActive(Group? group)
    {
        if (group is null)
        {
            return new Error(
                "Group.NotFound",
                "Group was not found.");
        }

        if (group.DeletedAt is not null)
        {
            return new Error(
                "Group.Deleted",
                "This group has been deleted and is no longer available.");
        }

        if (group.IsLocked)
        {
            return new Error(
                "Group.Locked",
                "This group is currently locked and cannot be modified.");
        }

        return null;
    }
}
