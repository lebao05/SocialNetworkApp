using Domain.Enums;

namespace Presentation.Contracts.Auth
{
    public sealed record RegisterRequest(
        string FirstName,
        string LastName,
        DateOnly DateOfBirth,
        Gender Gender,
        string Email,
        string Password
    );
}