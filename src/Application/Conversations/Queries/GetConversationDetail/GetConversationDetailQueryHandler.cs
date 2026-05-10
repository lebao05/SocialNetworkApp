using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Conversations;
using Domain.Shared;
namespace Application.Conversations.Queries.GetConversationDetail
{
    internal sealed class GetConversationDetailQueryHandler
        : IQueryHandler<GetConversationDetailQuery, ConversationDetailDto>
    {
        private readonly IConversationRepository _conversationRepository;

        public GetConversationDetailQueryHandler(IConversationRepository conversationRepository)
        {
            _conversationRepository = conversationRepository;
        }

        public async Task<Result<ConversationDetailDto>> Handle(
            GetConversationDetailQuery request,
            CancellationToken cancellationToken)
        {
            var conversation = await _conversationRepository.GetByIdAsync(
                request.ConversationId,
                cancellationToken);

            if (conversation is null)
            {
                return Result.Failure<ConversationDetailDto>(new Error(
                    "Conversation.NotFound",
                    $"The conversation with ID {request.ConversationId} was not found."));
            }

            if (!conversation.Members.Any(m => m.UserId == request.UserId))
            {
                return Result.Failure<ConversationDetailDto>(new Error(
                    "Conversation.Forbidden",
                    "You are not a member of this conversation."));
            }

            return Result.Success(
                ConversationDetailDto.FromDomain(conversation, request.UserId)
            );
        }
    }
}
