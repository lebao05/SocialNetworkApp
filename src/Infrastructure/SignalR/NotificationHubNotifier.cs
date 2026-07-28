using Application.Abstractions.SignalR;
using Application.DTOs.Notifications;
using Microsoft.AspNetCore.SignalR;

namespace Infrastructure.SignalR;

public class NotificationHubNotifier : INotificationHubNotifier
{
    private readonly IHubContext<NotificationHub> _hubContext;

    public NotificationHubNotifier(IHubContext<NotificationHub> hubContext)
    {
        _hubContext = hubContext;
    }

    /// <summary>
    /// Delivers the full <see cref="NotificationDto"/> to the recipient user via
    /// the SignalR <c>ReceiveNotification</c> event. Relies on SignalR's default
    /// per-user routing (driven by the <c>ClaimTypes.NameIdentifier</c> claim),
    /// which fans the message out to every active connection of that user.
    /// </summary>
    public async Task NotifyAsync(
        NotificationDto notification,
        CancellationToken cancellationToken = default)
    {
        await _hubContext.Clients
            .User(notification.RecipientUserId.ToString())
            .SendAsync("ReceiveNotification", notification, cancellationToken);
    }
}