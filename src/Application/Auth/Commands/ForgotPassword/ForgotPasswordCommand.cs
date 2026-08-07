using Application.Abstractions.Messaging;

namespace Application.Auth.Commands.ForgotPassword
{
    /// <summary>
    /// Starts the password-reset flow for the user with the supplied
    /// email address. Returns an error if the email is not registered.
    /// </summary>
    public sealed record ForgotPasswordCommand(string Email) : ICommand<bool>;
}