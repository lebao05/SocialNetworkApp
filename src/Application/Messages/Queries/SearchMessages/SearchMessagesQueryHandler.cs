using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.Abstractions.Security;
using Application.DTOs.Messages;
using Domain.Shared;

namespace Application.Messages.Queries.SearchMessages;

internal sealed class SearchMessagesQueryHandler
    : IQueryHandler<SearchMessagesQuery, List<MessageDto>>
{
    private readonly IMessageRepository _messageRepository;
    private readonly IConversationRepository _conversationRepository;
    private readonly IBlindIndexService _blindIndexService;

    public SearchMessagesQueryHandler(
        IMessageRepository messageRepository,
        IConversationRepository conversationRepository,
        IBlindIndexService blindIndexService)
    {
        _messageRepository = messageRepository;
        _conversationRepository = conversationRepository;
        _blindIndexService = blindIndexService;
    }

    public async Task<Result<List<MessageDto>>> Handle(
        SearchMessagesQuery request,
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

        // 2. Generate search hash
        var searchHash = _blindIndexService.GenerateHash(request.SearchTerm);

        // 3. Search
        var messages = await _messageRepository.SearchMessagesAsync(request.ConversationId, searchHash, cancellationToken);

        // 4. Map to DTO
        return Result.Success(messages.Select(MessageDto.FromDomain).ToList());
    }
}
