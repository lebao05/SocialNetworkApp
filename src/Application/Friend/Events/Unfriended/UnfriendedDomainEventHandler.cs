using Application.Abstractions;
using Application.Abstractions.Messaging;
using Domain.Events;
using Microsoft.Extensions.Logging;
namespace Application.Friend.Events.Unfriended;

internal sealed class UnfriendedDomainEventHandler
    : IDomainEventHandler<UnfriendedDomainEvent>
{
    private readonly IFriendGraphService _friendGraphService;
    private readonly ILogger<UnfriendedDomainEventHandler> _logger;

    public UnfriendedDomainEventHandler(
        IFriendGraphService friendGraphService,
        ILogger<UnfriendedDomainEventHandler> logger)
    {
        _friendGraphService = friendGraphService;
        _logger = logger;
    }

    public async Task Handle(
        UnfriendedDomainEvent notification,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation(
            "Processing UnfriendedDomainEvent: {InitiatorId} unfriended {RemovedFriendId}",
            notification.InitiatorId,
            notification.RemovedFriendId);

        try
        {
            await _friendGraphService.DeleteFriendshipAsync(
                notification.InitiatorId,
                notification.RemovedFriendId);

            _logger.LogInformation(
                "Successfully removed friendship edge between {InitiatorId} and {RemovedFriendId} in Neo4j",
                notification.InitiatorId,
                notification.RemovedFriendId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,
                "Failed to remove friendship edge between {InitiatorId} and {RemovedFriendId} from Neo4j via Outbox",
                notification.InitiatorId,
                notification.RemovedFriendId);
            throw;
        }
    }
}
