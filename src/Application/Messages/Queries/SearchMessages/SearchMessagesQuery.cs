using Application.Abstractions.Messaging;
using Application.DTOs.Messages;

namespace Application.Messages.Queries.SearchMessages;

public sealed record SearchMessagesQuery(
    Guid UserId,
    long ConversationId,
    string SearchTerm,
    int PageNumber = 1,
    int PageSize = 20) : IQuery<List<MessageDto>>;
