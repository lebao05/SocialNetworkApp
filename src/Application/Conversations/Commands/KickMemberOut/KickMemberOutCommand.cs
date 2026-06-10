using Application.Abstractions.Messaging;

namespace Application.Conversations.Commands.KickMemberOut;

public sealed record KickMemberOutCommand(
    long ConversationId,
    Guid AdminId,
    Guid UserIdToKick) : ICommand;

