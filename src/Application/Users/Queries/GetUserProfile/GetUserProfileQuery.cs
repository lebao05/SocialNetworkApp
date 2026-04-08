using Application.Abstractions.Messaging;

namespace Application.Users.Queries.GetUserProfile;

public sealed record GetUserProfileQuery(Guid UserId) : IQuery<UserProfileResponse>;

// The DTO to return to the React frontend
public sealed record UserProfileResponse(
    Guid Id,
    string Email,
    string FirstName,
    string LastName,
    DateOnly DateOfBirth,
    string? AvatarUrl,
    string Gender);