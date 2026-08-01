using Application.Abstractions.Messaging;

namespace Application.Groups.Commands.CancelJoinRequest
{
    public sealed record CancelJoinRequestCommand(
        Guid UserId,
        long GroupId) : ICommand;
}
