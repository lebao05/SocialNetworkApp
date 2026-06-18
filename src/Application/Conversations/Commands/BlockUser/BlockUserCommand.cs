using Application.Abstractions.Messaging;

namespace Application.Conversations.Commands.BlockUser;

public sealed record BlockUserCommand(
    Guid CurrentUserId,
    Guid TargetUserId
) : ICommand<bool>;
