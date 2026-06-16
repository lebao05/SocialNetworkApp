using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Conversations;
using Application.Shared;
using Domain.Shared;

namespace Application.Conversations.Queries.GetConversations
{
    internal sealed class GetConversationsQueryHandler
        : IQueryHandler<GetConversationsQuery, List<ConversationDetailDto>>
    {
        private readonly IConversationRepository _conversationRepository;

        public GetConversationsQueryHandler(
            IConversationRepository conversationRepository)
        {
            _conversationRepository = conversationRepository;
        }

        public async Task<Result<List<ConversationDetailDto>>> Handle(
            GetConversationsQuery request,
            CancellationToken cancellationToken)
        {
            var pagedConversations = await _conversationRepository.GetPagedConversationsAsync(
                request.UserId,
                request.PageNumber,
                request.PageSize,
                request.GroupsOnly,
                request.UnreadOnly,
                cancellationToken);

            var dtos = pagedConversations
                .Select(conv => ConversationDetailDto.FromDomain(conv, request.UserId))
                .ToList();

            return Result.Success(dtos);
        }
    }
}
