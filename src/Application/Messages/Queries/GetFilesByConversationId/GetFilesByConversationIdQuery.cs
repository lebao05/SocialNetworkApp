using Application.Abstractions.Messaging;
using Application.DTOs.Messages;

namespace Application.Messages.Queries.GetFilesByConversationId;

public sealed record GetFilesByConversationIdQuery(
    Guid UserId,
    long ConversationId,
    bool IsMedia,
    int PageNumber = 1,
    int PageSize = 20) : IQuery<List<MessageDto>>;
