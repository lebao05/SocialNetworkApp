using Application.Abstractions.Messaging;

namespace Application.Groups.Commands.LeaveGroup
{
    public sealed record LeaveGroupCommand(
        Guid UserId,
        long GroupId) : ICommand;
}
