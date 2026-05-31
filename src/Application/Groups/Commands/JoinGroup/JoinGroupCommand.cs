using Application.Abstractions.Messaging;
using Domain.Shared;

namespace Application.Groups.Commands.JoinGroup
{
    public sealed record JoinGroupCommand(
        Guid UserId,
        long GroupId) : ICommand;
}
