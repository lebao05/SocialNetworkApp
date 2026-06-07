using Domain.Common;
using System;

namespace Domain.Events
{
    public sealed record UnfriendedDomainEvent(
        Guid Id,
        Guid InitiatorId,
        Guid RemovedFriendId
    ) : IDomainEvent;
}
