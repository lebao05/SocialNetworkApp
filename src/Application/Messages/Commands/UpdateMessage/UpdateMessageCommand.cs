using Application.Abstractions.Messaging;

namespace Application.Messages.Commands.UpdateMessage
{
    public sealed record UpdateMessageCommand(
        long MessageId,
        Guid UserId,
        string NewContent
    ) : ICommand<long>;
}
