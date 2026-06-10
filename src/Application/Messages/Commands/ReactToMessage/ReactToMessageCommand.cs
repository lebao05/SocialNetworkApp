using Application.Abstractions.Messaging;
using Domain.Enums;

namespace Application.Messages.Commands.ReactToMessage
{
    public sealed record ReactToMessageCommand(
        long MessageId,
        Guid UserId,
        ReactionType? ReactionType
    ) : ICommand<long>;
}
