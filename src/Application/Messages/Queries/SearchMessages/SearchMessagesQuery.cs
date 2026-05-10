using Application.Abstractions.Messaging;
using Application.DTOs.Messages;

namespace Application.Messages.Queries.SearchMessages;

public sealed record SearchMessagesQuery(
    Guid UserId,
    long ConversationId,
    string SearchTerm) : IQuery<List<MessageDto>>;
