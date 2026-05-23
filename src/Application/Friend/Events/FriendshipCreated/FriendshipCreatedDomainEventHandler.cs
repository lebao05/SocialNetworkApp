using Application.Abstractions;
using Application.Abstractions.Messaging;
using Domain.Events;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Friend.Events.FriendshipCreated
{
    internal sealed class FriendshipCreatedDomainEventHandler
        : IDomainEventHandler<FriendshipCreatedDomainEvent>
    {
        private readonly IFriendGraphService _friendGraphService;
        private readonly ILogger<FriendshipCreatedDomainEventHandler> _logger;

        public FriendshipCreatedDomainEventHandler(
            IFriendGraphService friendGraphService,
            ILogger<FriendshipCreatedDomainEventHandler> logger)
        {
            _friendGraphService = friendGraphService;
            _logger = logger;
        }

        public async Task Handle(
            FriendshipCreatedDomainEvent notification,
            CancellationToken cancellationToken)
        {
            _logger.LogInformation("Processing FriendshipCreatedDomainEvent for {SenderId} and {ReceiverId}", 
                notification.SenderId, notification.ReceiverId);

            try
            {
                await _friendGraphService.SyncFriendshipAsync(
                    notification.SenderId,
                    notification.ReceiverId
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, 
                    "Failed to sync friendship between {SenderId} and {ReceiverId} to Neo4j social graph via Outbox", 
                    notification.SenderId, notification.ReceiverId);
                throw;
            }
        }
    }
}
