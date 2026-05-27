namespace Application.DTOs.Users
{
    public sealed record TaggableUserDto(
        Guid Id,
        string FirstName,
        string LastName,
        string? AvatarUrl);
}
