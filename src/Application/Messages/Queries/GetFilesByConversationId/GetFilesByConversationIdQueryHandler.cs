using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Messages;
using Domain.Shared;

namespace Application.Messages.Queries.GetFilesByConversationId;

internal sealed class GetFilesByConversationIdQueryHandler
    : IQueryHandler<GetFilesByConversationIdQuery, List<MessageDto>>
{
    private readonly IMessageRepository _messageRepository;
    private readonly IConversationRepository _conversationRepository;

    public GetFilesByConversationIdQueryHandler(
        IMessageRepository messageRepository,
        IConversationRepository conversationRepository)
    {
        _messageRepository = messageRepository;
        _conversationRepository = conversationRepository;
    }

    public async Task<Result<List<MessageDto>>> Handle(
        GetFilesByConversationIdQuery request,
        CancellationToken cancellationToken)
    {
        var conversation = await _conversationRepository.GetByIdAsync(request.ConversationId, cancellationToken);
        if (conversation is null)
        {
            return Result.Failure<List<MessageDto>>(new Error("Conversation.NotFound", "Conversation not found"));
        }

        if (conversation.Members.All(m => m.UserId != request.UserId))
        {
            return Result.Failure<List<MessageDto>>(new Error("Conversation.Forbidden", "You are not a member of this conversation"));
        }

        var messages = await _messageRepository.GetFilesByConversationIdAsync(
            request.ConversationId,
            request.IsMedia,
            request.PageNumber,
            request.PageSize,
            cancellationToken);

        return Result.Success(messages.Select(MessageDto.FromDomain).ToList());
    }
}
