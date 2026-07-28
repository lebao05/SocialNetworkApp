using Application.DTOs.Notifications;

namespace Application.Abstractions.SignalR;

/// <summary>
/// Pushes notifications to a connected user. The single
/// <c>NotifyAsync</c> entry point always delivers the full
/// <see cref="NotificationDto"/> under the SignalR event
/// <c>ReceiveNotification</c>, so the client can render the
/// notification without any additional API round-trip.
/// </summary>
public interface INotificationHubNotifier
{
    Task NotifyAsync(NotificationDto notification, CancellationToken cancellationToken = default);
}