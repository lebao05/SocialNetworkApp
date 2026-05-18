using Domain.Enums;
using System;

namespace Presentation.Contracts.User
{
    public sealed record UpdateInfoRequest(
        string FirstName,
        string LastName,
        DateOnly DateOfBirth,
        Gender Gender,
        string? Bio,
        string? CurrentLocation,
        string? Hometown,
        string? Website,
        RelationshipStatus? RelationshipStatus
    );
}
