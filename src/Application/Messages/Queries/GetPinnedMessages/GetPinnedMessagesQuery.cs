using Application.Abstractions.Messaging;
using Application.DTOs.Messages;

namespace Application.Messages.Queries.GetPinnedMessages;

public sealed record GetPinnedMessagesQuery(
    Guid UserId,
    long ConversationId,
    int PageNumber = 1,
    int PageSize = 20
) : IQuery<List<MessageDto>>;
