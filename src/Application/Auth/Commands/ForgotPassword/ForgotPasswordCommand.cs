using Application.Abstractions.Messaging;

namespace Application.Auth.Commands.ForgotPassword
{
    /// <summary>
    /// Starts the password-reset flow for the user with the supplied
    /// email address. Always returns success regardless of whether the
    /// address is registered — surfacing "email not found" would let
    /// anyone enumerate which addresses have accounts.
    /// </summary>
    public sealed record ForgotPasswordCommand(string Email) : ICommand<bool>;
}