using Application.Abstractions.Messaging;

namespace Application.Conversations.Commands.LeaveConversation;

public sealed record LeaveConversationCommand(
    long ConversationId,
    Guid UserId) : ICommand;
