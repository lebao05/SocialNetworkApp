using System;

namespace Application.DTOs.Users
{
    public sealed record PersonalInfoResponse(
        Guid Id,
        string FirstName,
        string LastName,
        string? AvatarUrl,
        string Gender);
}
