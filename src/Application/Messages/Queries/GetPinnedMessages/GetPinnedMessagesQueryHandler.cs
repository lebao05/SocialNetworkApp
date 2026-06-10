using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Messages;
using Domain.Shared;

namespace Application.Messages.Queries.GetPinnedMessages;

internal sealed class GetPinnedMessagesQueryHandler
    : IQueryHandler<GetPinnedMessagesQuery, List<MessageDto>>
{
    private readonly IConversationRepository _conversationRepository;
    private readonly IMessageRepository _messageRepository;

    public GetPinnedMessagesQueryHandler(
        IConversationRepository conversationRepository,
        IMessageRepository messageRepository)
    {
        _conversationRepository = conversationRepository;
        _messageRepository = messageRepository;
    }

    public async Task<Result<List<MessageDto>>> Handle(
        GetPinnedMessagesQuery request,
        CancellationToken cancellationToken)
    {
        var conversation = await _conversationRepository.GetByIdAsync(request.ConversationId, cancellationToken);
        if (conversation is null)
        {
            return Result.Failure<List<MessageDto>>(new Error(
                "Conversation.NotFound",
                "Conversation not found."));
        }

        if (conversation.Members.All(m => m.UserId != request.UserId))
        {
            return Result.Failure<List<MessageDto>>(new Error(
                "Conversation.Forbidden",
                "You are not a member of this conversation."));
        }

        var messages = await _messageRepository.GetPinnedMessagesAsync(
            request.ConversationId,
            request.PageNumber,
            request.PageSize,
            cancellationToken);

        return Result.Success(messages.Select(MessageDto.FromDomain).ToList());
    }
}
