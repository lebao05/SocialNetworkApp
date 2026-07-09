using Domain.Common;

namespace Domain.Events;

public sealed record PostCreatedDomainEvent(
    long PostId,
    Guid AuthorId,
    string? Content,
    IReadOnlyList<Guid> TaggedUserIds,
    DateTime CreatedAt
) : IDomainEvent;
