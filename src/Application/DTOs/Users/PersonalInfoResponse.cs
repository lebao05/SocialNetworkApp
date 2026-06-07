using Application.DTOs.Users;
using Domain.Enums;
using System;

namespace Application.DTOs.Users
{
    public sealed record PersonalInfoResponse(
        Guid Id,
        string FirstName,
        string LastName,
        string? AvatarUrl,
        string? CoverPhotoUrl,
        Gender Gender,
        DateOnly DateOfBirth,
        string? Bio,
        string? CurrentLocation,
        string? Hometown,
        string? Website,
        RelationshipStatus? RelationshipStatus,
        DateTime? CreatedAt,
        bool IsFriend,
        bool IsFollowing,
        bool HasIncomingRequest,
        bool HasOutgoingRequest,
        long? IncomingRequestId,
        long? OutgoingRequestId);
}
