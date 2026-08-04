using Application.Abstractions.Messaging;
using Domain.Entities;
using Domain.Shared;
using Microsoft.AspNetCore.Identity;

namespace Application.Auth.Commands.ResetPassword
{
    internal class ResetPasswordCommandHandler : ICommandHandler<ResetPasswordCommand, bool>
    {
        private readonly UserManager<User> _userManager;

        public ResetPasswordCommandHandler(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        public async Task<Result<bool>> Handle(ResetPasswordCommand request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.Token) ||
                string.IsNullOrWhiteSpace(request.NewPassword))
            {
                return Result.Failure<bool>(
                    new Error("Auth.ResetPassword.Invalid", "Email, token, and new password are required."));
            }

            var user = await _userManager.FindByEmailAsync(request.Email);
            // Return a generic "Invalid" error for both unknown-email and
            // bad-token so callers can't tell which case they hit.
            if (user is null)
            {
                return Result.Failure<bool>(
                    new Error("Auth.ResetPassword.Invalid", "The reset link is invalid or has expired."));
            }

            var identityResult = await _userManager.ResetPasswordAsync(user, request.Token, request.NewPassword);
            if (!identityResult.Succeeded)
            {
                var description = string.Join("; ", identityResult.Errors.Select(e => e.Description));
                return Result.Failure<bool>(
                    new Error("Auth.ResetPassword.Invalid", string.IsNullOrEmpty(description)
                        ? "The reset link is invalid or has expired."
                        : description));
            }

            return Result.Success(true);
        }
    }
}