using Application.Abstractions.Messaging;
using Application.DTOs.Messages;

namespace Application.Messages.Commands.ReactToMessage;

public sealed record ReactToMessageCommand(
    long MessageId,
    Guid UserId,
    string? ReactionType
) : ICommand<MessageDto>;
