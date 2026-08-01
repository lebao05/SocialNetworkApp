using Domain.Entities;
using Domain.Enums;
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

    /// <summary>
    /// Returns <c>null</c> when the viewer is allowed to see group content
    /// (members, posts, media), otherwise an <see cref="Error"/>.
    ///
    /// Rule:
    ///   • Owner / Admin / Moderator / Member       → always allowed.
    ///   • Public group                            → allowed for everyone.
    ///   • Private group                           → only members.
    ///
    /// Pass <paramref name="viewerUserId"/> as <c>null</c> when the request is
    /// anonymous (rare; the public API in this project is JWT-protected).
    /// </summary>
    public static Error? EnsureCanViewContent(Group? group, Guid? viewerUserId)
    {
        if (group is null)
        {
            return new Error(
                "Group.NotFound",
                "Group was not found.");
        }

        if (group.PrivacyType != GroupPrivacyType.Private)
        {
            return null;
        }

        if (viewerUserId is null)
        {
            return new Error(
                "Group.AccessDenied",
                "This group is private. You must be a member to view its content.");
        }

        if (group.OwnerUserId == viewerUserId.Value)
        {
            return null;
        }

        var member = group.Members.FirstOrDefault(m => m.UserId == viewerUserId.Value);
        if (member is null)
        {
            return new Error(
                "Group.AccessDenied",
                "This group is private. You must be a member to view its content.");
        }

        return null;
    }

    /// <summary>
    /// Async variant that does not require <paramref name="group"/> to have its
    /// <see cref="Group.Members"/> navigation collection loaded. Membership is
    /// resolved through <paramref name="isUserInGroupAsync"/>, which is
    /// cheaper and index-friendly when the caller already has a bare group
    /// entity.
    /// </summary>
    public static async Task<Error?> EnsureCanViewContentAsync(
        Group? group,
        Guid? viewerUserId,
        Func<Guid, long, CancellationToken, Task<bool>> isUserInGroupAsync,
        CancellationToken cancellationToken)
    {
        if (group is null)
        {
            return new Error(
                "Group.NotFound",
                "Group was not found.");
        }

        if (group.PrivacyType != GroupPrivacyType.Private)
        {
            return null;
        }

        if (viewerUserId is null || group.OwnerUserId == viewerUserId.Value)
        {
            return viewerUserId is null
                ? new Error(
                    "Group.AccessDenied",
                    "This group is private. You must be a member to view its content.")
                : null;
        }

        var isMember = await isUserInGroupAsync(viewerUserId.Value, group.Id, cancellationToken);
        return isMember
            ? null
            : new Error(
                "Group.AccessDenied",
                "This group is private. You must be a member to view its content.");
    }
}
