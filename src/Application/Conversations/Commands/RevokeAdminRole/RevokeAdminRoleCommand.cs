using Application.Abstractions.Messaging;

namespace Application.Conversations.Commands.RevokeAdminRole;

public sealed record RevokeAdminRoleCommand(
    long ConversationId,
    Guid OwnerId,
    Guid TargetUserId) : ICommand;

