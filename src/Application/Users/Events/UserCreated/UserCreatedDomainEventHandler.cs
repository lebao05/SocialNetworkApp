using Application.Abstractions;
using Application.Abstractions.Messaging;
using Domain.Events;
using Microsoft.Extensions.Logging;

namespace Application.Users.Events.UserCreated;

internal sealed class UserCreatedDomainEventHandler
    : IDomainEventHandler<UserCreatedDomainEvent>
{
    private readonly IFriendGraphService _friendGraphService;
    private readonly ILogger<UserCreatedDomainEventHandler> _logger;

    public UserCreatedDomainEventHandler(
        IFriendGraphService friendGraphService,
        ILogger<UserCreatedDomainEventHandler> logger)
    {
        _friendGraphService = friendGraphService;
        _logger = logger;
    }

    public async Task Handle(
        UserCreatedDomainEvent notification,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation(
            "Processing UserCreatedDomainEvent for user {UserId} ({Email})",
            notification.UserId, notification.Email);

        try
        {
            await _friendGraphService.SyncUserAsync(
                notification.UserId,
                notification.Email,
                notification.FirstName,
                notification.LastName,
                notification.AvatarUrl);
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Failed to sync newly registered user {UserId} to Neo4j social graph",
                notification.UserId);
        }
    }
}