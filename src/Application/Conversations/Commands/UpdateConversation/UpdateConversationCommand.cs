using Application.Abstractions.Messaging;
using Application.DTOs.Conversations;

namespace Application.Conversations.Commands.UpdateConversation;

public sealed record UpdateConversationCommand(
    long ConversationId,
    Guid RequesterId,
    string? Name,
    string? Theme,
    string? DefaultReaction
) : ICommand<ConversationDetailDto>;
