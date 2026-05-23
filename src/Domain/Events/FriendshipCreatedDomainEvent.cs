using Domain.Common;
using System;

namespace Domain.Events
{
    public sealed record FriendshipCreatedDomainEvent(
        Guid Id,
        Guid SenderId,
        Guid ReceiverId
    ) : IDomainEvent;
}
