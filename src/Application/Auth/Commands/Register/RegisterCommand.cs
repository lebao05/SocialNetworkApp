using Application.Abstractions.Messaging;
using Domain.Enums;

namespace Application.Auth.Commands.Register
{
    public sealed record RegisterCommand(
        string FirstName,
        string LastName,
        DateTime DateOfBirth,
        Gender Gender,
        string Email,
        string Password
    ) : ICommand<string>;
}
