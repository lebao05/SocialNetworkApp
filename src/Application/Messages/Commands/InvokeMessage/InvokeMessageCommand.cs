using Application.Abstractions.Messaging;

namespace Application.Messages.Commands.InvokeMessage;

public sealed record InvokeMessageCommand(long MessageId, Guid UserId) : ICommand<long>;
