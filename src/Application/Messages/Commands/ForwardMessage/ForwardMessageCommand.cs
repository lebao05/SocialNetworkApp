using Application.Abstractions.Messaging;

namespace Application.Messages.Commands.ForwardMessage;

public sealed record ForwardMessageCommand(
    Guid UserId,
    long MessageId,
    List<long> TargetConversationIds) : ICommand<List<long>>;
