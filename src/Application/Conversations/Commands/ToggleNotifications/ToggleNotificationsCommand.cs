using Application.Abstractions.Messaging;

namespace Application.Conversations.Commands.ToggleNotifications
{
    public sealed record ToggleNotificationsCommand(
        long ConversationId,
        Guid UserId) : ICommand<bool>;
}
