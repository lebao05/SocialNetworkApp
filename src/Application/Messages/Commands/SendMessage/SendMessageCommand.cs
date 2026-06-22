using Application.Abstractions.Messaging;

namespace Application.Messages.Commands.SendMessage
{
    public sealed record SendMessageFile(
        Stream Stream,
        string FileName,
        string ContentType,
        long FileSize
    );

    public sealed record SendMessageCommand(
        long ConversationId,
        Guid SenderId,
        string? Content,
        List<SendMessageFile>? Files,
        long? RepliedMessageId
    ) : ICommand<List<Application.DTOs.Messages.MessageDto>>;
}
