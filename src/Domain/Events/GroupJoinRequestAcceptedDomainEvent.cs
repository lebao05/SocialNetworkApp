using Domain.Common;

namespace Domain.Events;

public sealed record GroupJoinRequestAcceptedDomainEvent(
    long GroupId,
    long GroupJoinRequestId,
    Guid UserId,
    Guid ApprovedByUserId,
    DateTime ApprovedAt
) : IDomainEvent;
