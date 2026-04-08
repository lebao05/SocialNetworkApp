using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Conversations;
using Application.Shared;
using Domain.Shared;

namespace Application.Conversations.Queries.GetConversations
{
    internal sealed class GetConversationsQueryHandler
        : IQueryHandler<GetConversationsQuery, PagedList<ConversationResponse>>
    {
        private readonly IConversationRepository _conversationRepository;

        public GetConversationsQueryHandler(
            IConversationRepository conversationRepository)
        {
            _conversationRepository = conversationRepository;
        }

        public async Task<Result<PagedList<ConversationResponse>>> Handle(
            GetConversationsQuery request,
            CancellationToken cancellationToken)
        {
            // 1. Get Domain Entities from Repo (Assumes Repo uses .Include() for related data)
            var pagedConversations = await _conversationRepository.GetPagedConversationsAsync(
                request.UserId,
                request.PageNumber,
                request.PageSize,
                cancellationToken);

            // 2. Use the DTO transfer function (FromDomain) to map the entities
            var dtos = pagedConversations.Items
                .Select(conv => ConversationResponse.FromDomain(conv, request.UserId))
                .ToList();

            // 3. Wrap the mapped DTOs back into a PagedList
            return Result.Success(new PagedList<ConversationResponse>(
                dtos,
                pagedConversations.PageNumber,
                pagedConversations.PageSize,
                pagedConversations.TotalCount));
        }
    }
}