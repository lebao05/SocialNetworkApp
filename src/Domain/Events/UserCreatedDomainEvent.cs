using Domain.Common;

namespace Domain.Events;

public sealed record UserCreatedDomainEvent(
    Guid UserId,
    string Email,
    string FirstName,
    string LastName,
    string? AvatarUrl,
    DateTime CreatedAt
) : IDomainEvent;