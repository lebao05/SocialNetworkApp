using Application.Abstractions.Messaging;
using Domain.Entities;
using Domain.Shared;
using Microsoft.AspNetCore.Identity;

namespace Application.Auth.Commands.AdminLogin
{
    internal class AdminLoginCommandHandler : ICommandHandler<AdminLoginCommand, AdminLoginResult>
    {
        public const string AdminRole = "ADMIN";

        private readonly UserManager<User> _userManager;

        public AdminLoginCommandHandler(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        public async Task<Result<AdminLoginResult>> Handle(
            AdminLoginCommand request,
            CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                return Result.Failure<AdminLoginResult>(
                    new Error("Admin.InvalidCredentials", "Invalid email or password."));
            }

            var passwordValid = await _userManager.CheckPasswordAsync(user, request.Password);
            if (!passwordValid)
            {
                return Result.Failure<AdminLoginResult>(
                    new Error("Admin.InvalidCredentials", "Invalid email or password."));
            }

            var roles = await _userManager.GetRolesAsync(user);
            if (!roles.Contains(AdminRole))
            {
                return Result.Failure<AdminLoginResult>(
                    new Error("Admin.NotAuthorized", "This account does not have admin access."));
            }

            var profile = new AdminLoginResult(
                user.Id,
                user.Email ?? request.Email,
                user.FirstName,
                user.LastName,
                roles.ToList());

            return Result.Success(profile);
        }
    }
}
