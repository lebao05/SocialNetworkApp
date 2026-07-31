using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Entities;
using Domain.Shared;
using Microsoft.AspNetCore.Identity;

namespace Application.Admin.Commands.SetUserRole;

internal sealed class SetUserRoleCommandHandler
    : ICommandHandler<SetUserRoleCommand, SetUserRoleResult>
{
    private const string AdminRole = "ADMIN";
    private const string UserRole  = "USER";

    private readonly IUserRepository _users;
    private readonly UserManager<User> _userManager;

    public SetUserRoleCommandHandler(
        IUserRepository users,
        UserManager<User> userManager)
    {
        _users = users;
        _userManager = userManager;
    }

    public async Task<Result<SetUserRoleResult>> Handle(
        SetUserRoleCommand request,
        CancellationToken cancellationToken)
    {
        // 1) Self-protection — admins must lock/demote themselves via a separate
        //    flow (password re-entry) so a stolen session can't wipe the only admin.
        if (request.TargetUserId == request.ActingUserId)
        {
            return Result.Failure<SetUserRoleResult>(
                new Error("Admin.SelfRoleChange", "You cannot change your own role."));
        }

        var user = await _users.GetByIdAsync(request.TargetUserId, cancellationToken);
        if (user is null)
        {
            return Result.Failure<SetUserRoleResult>(
                new Error("Admin.UserNotFound", "User not found."));
        }

        if (request.MakeAdmin)
        {
            // Make sure the USER role is also present so promoted admins still
            // satisfy the "user OR admin" gates used elsewhere in the app.
            if (!await _userManager.IsInRoleAsync(user, UserRole))
            {
                var addUser = await _userManager.AddToRoleAsync(user, UserRole);
                if (!addUser.Succeeded)
                    return IdentityFailure<SetUserRoleResult>(addUser, "Failed to assign USER role.");
            }

            if (!await _userManager.IsInRoleAsync(user, AdminRole))
            {
                var addAdmin = await _userManager.AddToRoleAsync(user, AdminRole);
                if (!addAdmin.Succeeded)
                    return IdentityFailure<SetUserRoleResult>(addAdmin, "Failed to promote to Admin.");
            }
        }
        else
        {
            // Demote — strip the ADMIN role. Keep USER so they remain a normal
            // platform member. Never strip USER here.
            if (await _userManager.IsInRoleAsync(user, AdminRole))
            {
                var remove = await _userManager.RemoveFromRoleAsync(user, AdminRole);
                if (!remove.Succeeded)
                    return IdentityFailure<SetUserRoleResult>(remove, "Failed to demote to User.");
            }
        }

        return Result.Success(new SetUserRoleResult(request.TargetUserId, request.MakeAdmin));
    }

    private static Result<T> IdentityFailure<T>(IdentityResult result, string message)
        => Result.Failure<T>(
            new Error("Admin.IdentityFailure",
                $"{message} {string.Join(", ", result.Errors.Select(e => e.Description))}"));
}