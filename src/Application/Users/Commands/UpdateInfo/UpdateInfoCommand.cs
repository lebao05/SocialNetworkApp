using Application.Abstractions.Messaging;
using Domain.Enums;

namespace Application.Users.Commands.UpdateInfo
{
    public sealed record UpdateInfoCommand(
        Guid UserId,
        string FirstName,
        string LastName,
        DateOnly DateOfBirth,
        Gender Gender,
        string? Bio,
        string? CurrentLocation,
        string? Hometown,
        string? Website,
        RelationshipStatus? RelationshipStatus
    ) : ICommand;
}
