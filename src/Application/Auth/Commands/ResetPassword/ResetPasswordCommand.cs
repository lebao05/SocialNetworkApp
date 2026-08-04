using Application.Abstractions.Messaging;

namespace Application.Auth.Commands.ResetPassword
{
    /// <summary>
    /// Consumes a password-reset token. <see cref="NewPassword"/> is the
    /// raw user-typed password; the handler will hash it via
    /// <c>UserManager.ResetPasswordAsync</c>.
    /// </summary>
    public sealed record ResetPasswordCommand(
        string Email,
        string Token,
        string NewPassword) : ICommand<bool>;
}