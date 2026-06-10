using Application.Abstractions.Messaging;
using Application.DTOs.Conversations;

namespace Application.Conversations.Commands.CreateConversation
{
    public sealed record CreateConversationCommand(
        Guid CreatorId,
        List<Guid> ParticipantIds,
        string? Name = null) : ICommand<ConversationDetailDto>;
}
