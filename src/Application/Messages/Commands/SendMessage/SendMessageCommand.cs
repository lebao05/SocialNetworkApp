using Application.Abstractions.Messaging;
using Application.DTOs.Messages;

namespace Application.Messages.Commands.SendMessage
{
    public sealed record SendMessageFile(
        string FileName,
        string FileType,
        long FileSize,
        Stream Stream);

    public sealed record SendMessageCommand(
        long ConversationId,
        Guid SenderId,
        string? Content,
        List<SendMessageFile>? Files) : ICommand<List<MessageDto>>;
}
