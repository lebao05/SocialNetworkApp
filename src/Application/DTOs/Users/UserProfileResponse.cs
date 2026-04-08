using System;
using System.Collections.Generic;
using System.Text;

namespace Application.DTOs.Users
{
    public sealed record UserProfileResponse(
        Guid Id,
        string Email,
        string FirstName,
        string LastName,
        DateOnly DateOfBirth,
        string? AvatarUrl,
        string Gender);
}
