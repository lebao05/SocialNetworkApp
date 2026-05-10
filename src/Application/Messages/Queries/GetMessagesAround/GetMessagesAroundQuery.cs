using Application.Abstractions.Messaging;
using Application.DTOs.Messages;

namespace Application.Messages.Queries.GetMessagesAround;

public sealed record GetMessagesAroundQuery(
    Guid UserId,
    long ConversationId,
    long? AnchorMessageId,
    string Direction, // "up", "down", "around"
    int Size = 20) : IQuery<List<MessageDto>>;
