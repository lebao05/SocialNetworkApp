using Domain.Common;

namespace Domain.Events;

public sealed record FriendRequestCreatedDomainEvent(
    Guid SenderId,
    Guid ReceiverId,
    DateTime CreatedAt
) : IDomainEvent;
