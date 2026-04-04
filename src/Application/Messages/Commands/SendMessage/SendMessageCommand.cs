using Application.Abstractions.Messaging;

namespace Application.Messages.Commands.SendMessage
{
    public sealed record SendMessageCommand(
        long ConversationId,
        Guid SenderId,
        string Content) : ICommand<long>;
}
