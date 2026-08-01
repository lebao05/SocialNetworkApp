using Application.Abstractions.Messaging;

namespace Application.Groups.Commands.DeleteGroup
{
    public sealed record DeleteGroupCommand(
        Guid RequesterUserId,
        long GroupId) : ICommand;
}
