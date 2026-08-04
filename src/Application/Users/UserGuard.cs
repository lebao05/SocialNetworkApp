using Domain.Entities;
using Domain.Shared;

namespace Application.Users;

/// <summary>
/// Centralised guard for "user can be acted on" checks used by every handler
/// that mutates state on behalf of a user (posting, commenting, reacting,
/// updating profile, etc.) or returns user-owned data.
///
/// We treat <see cref="User.IsLocked"/> as a hard, admin-imposed moderation
/// flag, independent of the time-bounded <c>IdentityUser.LockoutEnd</c>. When
/// the flag is set, every mutating operation should fail with a deterministic
/// <c>User.Locked</c> error so callers can surface a consistent message and
/// analytics can bucket "blocked because locked" uniformly.
///
/// Centralising the check keeps the error codes, messages and behaviour
/// identical across all handlers, and gives us one place to extend if more
/// inactive states are added later (e.g. soft-delete).
/// </summary>
public static class UserGuard
{
    /// <summary>
    /// Returns <c>null</c> when the user is allowed to perform mutations,
    /// otherwise an <see cref="Error"/> describing why the operation is rejected.
    ///
    /// Callers should typically translate the result with
    /// <c>Result.Failure(UserGuard.EnsureNotLocked(user)!)</c> or
    /// <c>Result.Failure&lt;T&gt;(UserGuard.EnsureNotLocked(user)!)</c>.
    ///
    /// A <c>null</c> user is treated as not-locked — handlers that need a
    /// "not-found" error should check <paramref name="user"/> separately.
    /// </summary>
    public static Error? EnsureNotLocked(User? user)
    {
        if (user is null)
        {
            return null;
        }

        if (user.IsLocked)
        {
            return new Error(
                "User.Locked",
                "Your account is currently locked. You cannot perform this action.");
        }

        return null;
    }

    /// <summary>
    /// Returns <c>null</c> when the user can be viewed (i.e. neither locked
    /// nor deleted), otherwise an <see cref="Error"/>. Use this in read-side
    /// queries where you want to refuse to surface a locked user's profile
    /// / content to other viewers.
    /// </summary>
    public static Error? EnsureViewable(User? user)
    {
        if (user is null)
        {
            return new Error(
                "User.NotFound",
                "User was not found.");
        }

        return EnsureNotLocked(user) ?? new Error(
            "User.Locked",
            "This account is currently locked and cannot be viewed.");
    }
}
