using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Messages;
using Domain.Shared;

namespace Application.Messages.Queries.GetMessagesAround;

internal sealed class GetMessagesAroundQueryHandler
    : IQueryHandler<GetMessagesAroundQuery, List<MessageDto>>
{
    private readonly IMessageRepository _messageRepository;
    private readonly IConversationRepository _conversationRepository;

    public GetMessagesAroundQueryHandler(
        IMessageRepository messageRepository,
        IConversationRepository conversationRepository)
    {
        _messageRepository = messageRepository;
        _conversationRepository = conversationRepository;
    }

    public async Task<Result<List<MessageDto>>> Handle(
        GetMessagesAroundQuery request,
        CancellationToken cancellationToken)
    {
        // 1. Check if user is member of conversation
        var conversation = await _conversationRepository.GetByIdAsync(request.ConversationId, cancellationToken);
        if (conversation is null)
        {
            return Result.Failure<List<MessageDto>>(new Error("Conversation.NotFound", "Conversation not found"));
        }

        if (conversation.Members.All(m => m.UserId != request.UserId))
        {
            return Result.Failure<List<MessageDto>>(new Error("Conversation.Forbidden", "You are not a member of this conversation"));
        }

        // 2. Fetch messages
        var messages = await _messageRepository.GetMessagesAroundAsync(
            request.ConversationId,
            request.AnchorMessageId,
            request.Direction,
            request.Size,
            cancellationToken);

        // 3. Map to DTO
        return Result.Success(messages.Select(MessageDto.FromDomain).ToList());
    }
}
