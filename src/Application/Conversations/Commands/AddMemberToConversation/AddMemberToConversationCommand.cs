using Application.Abstractions.Messaging;
using Application.DTOs.Conversations;

namespace Application.Conversations.Commands.AddMemberToConversation;

public sealed record AddMemberToConversationCommand(
    long ConversationId,
    Guid AdminId,
    Guid UserIdToAdd) : ICommand<ConversationMemberDto>;
