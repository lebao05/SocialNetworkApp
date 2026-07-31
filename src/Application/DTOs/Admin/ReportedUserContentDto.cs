using Domain.Enums;

namespace Application.DTOs.Admin;

/// <summary>
/// The user profile that was reported — a flattened view for quick admin assessment.
/// </summary>
public record ReportedUserContentDto(
    Guid Id,
    string FirstName,
    string LastName,
    string Email,
    Gender Gender,
    DateOnly DateOfBirth,
    DateTime CreatedAt,
    bool IsLocked,
    string? Bio
);
