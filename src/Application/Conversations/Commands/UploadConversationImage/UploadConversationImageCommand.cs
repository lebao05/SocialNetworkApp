using Application.Abstractions.Messaging;

namespace Application.Conversations.Commands.UploadConversationImage;

public sealed record UploadConversationImageCommand(
    long ConversationId,
    Guid RequesterId,
    Stream FileStream,
    string FileName
) : ICommand<string>;
