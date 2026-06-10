using Application.Abstractions.Messaging;

namespace Application.Messages.Commands.MarkMessagesAsSeen;

public sealed record MarkMessagesAsSeenCommand(
    long ConversationId,
    Guid UserId,
    long LastReadMessageId
) : ICommand;
