using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Conversations;
using Domain.Shared;

namespace Application.Conversations.Queries.GetConversations
{
    internal sealed class GetConversationsQueryHandler
        : IQueryHandler<GetConversationsQuery, List<ConversationDTO>>
    {
        private readonly IConversationRepository _conversationRepository;

        public GetConversationsQueryHandler(IConversationRepository conversationRepository)
        {
            _conversationRepository = conversationRepository;
        }

        public async Task<Result<List<ConversationDTO>>> Handle(
            GetConversationsQuery request,
            CancellationToken cancellationToken)
        {
            // Fetch conversations where the user is a member
            var conversations = await _conversationRepository.GetConversationsByUserIdAsync(
                request.UserId,
                cancellationToken);

            // Map to Response DTO
            var response = conversations.Select(c => new ConversationDTO(
                c.Id,
                c.Name,
                c.Theme,
                c.IsOneToOne,
                c.Messages.OrderByDescending(m => m.CreatedAt).FirstOrDefault()?.Content,
                c.Messages.OrderByDescending(m => m.CreatedAt).FirstOrDefault()?.CreatedAt
            )).ToList();
            return Result.Success(response);
        }
    }
}
