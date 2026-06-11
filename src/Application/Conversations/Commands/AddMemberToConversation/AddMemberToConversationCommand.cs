using Application.Abstractions.Messaging;

namespace Application.Conversations.Commands.AddMemberToConversation;

public sealed record AddMemberToConversationCommand(
    long ConversationId,
    Guid AdminId,
    Guid UserIdToAdd) : ICommand;
