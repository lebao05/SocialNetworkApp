using Application.Abstractions.Messaging;

namespace Application.Conversations.Commands.AssignAdminRole;

public sealed record AssignAdminRoleCommand(
    long ConversationId,
    Guid OwnerId,
    Guid TargetUserId) : ICommand;

