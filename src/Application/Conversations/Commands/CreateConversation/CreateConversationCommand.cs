using Application.Abstractions.Messaging;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Conversations.Commands.CreateConversation
{
    public sealed record CreateConversationCommand(
        Guid CreatorId,
        List<Guid> ParticipantIds,
        string? Name = null) : ICommand<long>;
}
