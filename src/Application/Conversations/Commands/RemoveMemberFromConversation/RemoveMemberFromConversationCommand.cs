using Application.Abstractions.Messaging;

namespace Application.Conversations.Commands.RemoveMemberFromConversation;

public sealed record RemoveMemberFromConversationCommand(
    long ConversationId,
    Guid AdminId,
    Guid UserIdToRemove) : ICommand;
