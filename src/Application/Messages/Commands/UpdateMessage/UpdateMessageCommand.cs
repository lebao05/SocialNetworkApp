using Application.Abstractions.Messaging;
using Application.DTOs.Messages;

namespace Application.Messages.Commands.UpdateMessage
{
    public sealed record UpdateMessageCommand(
        long MessageId,
        Guid UserId,
        string NewContent
    ) : ICommand<MessageDto>;
}
