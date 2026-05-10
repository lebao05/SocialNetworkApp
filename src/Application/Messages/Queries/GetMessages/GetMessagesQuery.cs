using Application.Abstractions.Messaging;
using Application.DTOs.Messages;

namespace Application.Messages.Queries.GetMessages
{
    public sealed record GetMessagesQuery(
        long ConversationId,
        Guid UserId,
        int PageNumber,
        int PageSize
    ) : IQuery<List<MessageDto>>;
}
