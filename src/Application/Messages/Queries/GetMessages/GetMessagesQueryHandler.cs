using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Messages;
using Domain.Shared;

namespace Application.Messages.Queries.GetMessages
{

    internal sealed class GetMessagesQueryHandler
        : IQueryHandler<GetMessagesQuery, List<MessageDto>>
    {
        private readonly IMessageRepository _messageRepository;
        private readonly IConversationRepository _conversationRepository;

        public GetMessagesQueryHandler(
            IMessageRepository messageRepository,
            IConversationRepository conversationRepository)
        {
            _messageRepository = messageRepository;
            _conversationRepository = conversationRepository;
        }

        public async Task<Result<List<MessageDto>>> Handle(
            GetMessagesQuery request,
            CancellationToken cancellationToken)
        {
            var conversation = await _conversationRepository.GetByIdAsync(
                request.ConversationId,
                cancellationToken);

            if (conversation is null)
            {
                return Result.Failure<List<MessageDto>>(
                    new Error("Conversation.NotFound", "Conversation not found"));
            }

            if (!conversation.Members.Any(m => m.UserId == request.UserId))
            {
                return Result.Failure<List<MessageDto>>(
                    new Error("Conversation.Forbidden", "Access denied"));
            }

            var messages = await _messageRepository.GetPagedMessagesAsync(
                request.ConversationId,
                request.PageNumber,
                request.PageSize,
                cancellationToken);

            var dtos = messages
                .Select(MessageDto.FromDomain)
                .ToList();

            // Optional: reverse for chat UI (oldest → newest)
            dtos.Reverse();

            return Result.Success(dtos);
        }
    }
}
