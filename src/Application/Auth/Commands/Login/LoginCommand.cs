using Application.Abstractions.Messaging;

namespace Application.Auth.Commands.Login
{
    public sealed record LoginCommand(string Email, string Password) : ICommand<string>;

}
