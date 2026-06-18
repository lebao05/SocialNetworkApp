using Application.Abstractions.Messaging;

namespace Application.Conversations.Commands.UnblockUser;

public sealed record UnblockUserCommand(
    Guid CurrentUserId,
    Guid TargetUserId
) : ICommand<bool>;
