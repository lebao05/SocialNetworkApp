using Application.Abstractions.Messaging;

namespace Application.Notifications.Commands.MarkNotificationAsSeen;

public sealed record MarkNotificationAsSeenCommand(
    Guid UserId,
    long NotificationId
) : ICommand<MarkNotificationAsSeenResponse>;
