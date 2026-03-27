using Application.Abstractions.Messaging;

namespace Application.Auth.Commands.Register
{
    public sealed record RegisterCommand(string Username, string Email, string Password, string Address) : ICommand<string>;
}
