using Application.Abstractions.Messaging;

namespace Application.Messages.Commands.TogglePinMessage;

public sealed record TogglePinMessageCommand(
    long MessageId,
    Guid UserId
) : ICommand<bool>;
