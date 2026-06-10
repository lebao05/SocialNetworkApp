using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Conversations;
using Domain.Shared;

namespace Application.Conversations.Queries.GetConversationMembers;

internal sealed class GetConversationMembersQueryHandler
    : IQueryHandler<GetConversationMembersQuery, List<ConversationMemberDto>>
{
    private readonly IConversationRepository _conversationRepository;

    public GetConversationMembersQueryHandler(IConversationRepository conversationRepository)
    {
        _conversationRepository = conversationRepository;
    }

    public async Task<Result<List<ConversationMemberDto>>> Handle(
        GetConversationMembersQuery request,
        CancellationToken cancellationToken)
    {
        var conversation = await _conversationRepository.GetByIdAsync(request.ConversationId, cancellationToken);

        if (conversation is null)
        {
            return Result.Failure<List<ConversationMemberDto>>(
                new Error("Conversation.NotFound", "Conversation not found"));
        }

        if (conversation.Members.All(m => m.UserId != request.CurrentUserId))
        {
            return Result.Failure<List<ConversationMemberDto>>(
                new Error("Conversation.Forbidden", "You are not a member of this conversation"));
        }

        var members = conversation.Members
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(ConversationMemberDto.FromDomain)
            .ToList();

        return Result.Success(members);
    }
}
