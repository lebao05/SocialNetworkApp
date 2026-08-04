using Application.Auth.Commands.ForgotPassword;
using Application.Auth.Commands.Login;
using Application.Auth.Commands.Register;
using Application.Auth.Commands.ResetPassword;
using Domain.Shared;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Presentation.Abstractions;
using Presentation.Contracts.Auth;

namespace Presentation.Controllers
{
    [Route("api/auth")]
    public class AuthController : ApiController
    {
        public AuthController(ISender sender) : base(sender)
        {
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(
            [FromBody] RegisterRequest request,
            CancellationToken cancellationToken)
        {
            var command = new RegisterCommand(
                request.FirstName,
                request.LastName,
                request.DateOfBirth,
                request.Gender,
                request.Email,
                request.Password
            );

            Result<string> result = await _sender.Send(command, cancellationToken);

            if (result.IsFailure)
                return HandleFailure(result);

            return Ok(result.Value);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(
            [FromBody] LoginRequest request,
            CancellationToken cancellationToken)
        {
            var command = new LoginCommand(
                request.Email,
                request.Password
            );

            Result<string> result = await _sender.Send(command, cancellationToken);

            if (result.IsFailure)
                return HandleFailure(result);

            return Ok(result.Value);
        }

        /// <summary>
        /// Starts the password-reset flow. Always returns 200 OK with the
        /// same payload to avoid leaking which addresses are registered.
        /// Errors that genuinely prevent the request (invalid email
        /// shape, server mis-config) come back as ProblemDetails 400.
        /// </summary>
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(
            [FromBody] ForgotPasswordRequest request,
            CancellationToken cancellationToken)
        {
            // Basic shape check — we don't validate "is a real email
            // address" because that would be a useful enumeration oracle.
            if (string.IsNullOrWhiteSpace(request.Email))
            {
                return HandleFailure(Result.Failure<bool>(
                    new Error("Auth.ForgotPassword.Invalid", "Email is required.")));
            }

            Result<bool> result = await _sender.Send(new ForgotPasswordCommand(request.Email), cancellationToken);

            if (result.IsFailure)
                return HandleFailure(result);

            return Ok(new { message = "If the email exists, a reset link has been sent." });
        }

        /// <summary>
        /// Consumes a password-reset token. The token travels in the body
        /// (not the URL path) because token-bearing URLs sometimes end up
        /// in server access logs; a body parameter is still
        /// URL-decoded once, but doesn't show up in path-based log rules.
        /// </summary>
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(
            [FromBody] ResetPasswordRequest request,
            CancellationToken cancellationToken)
        {
            Result<bool> result = await _sender.Send(
                new ResetPasswordCommand(request.Email, request.Token, request.NewPassword),
                cancellationToken);

            if (result.IsFailure)
                return HandleFailure(result);

            return Ok(new { message = "Password updated successfully." });
        }
    }
}