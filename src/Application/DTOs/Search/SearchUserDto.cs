namespace Application.DTOs.Search
{
    public sealed record SearchUserDto(
        Guid Id,
        string FirstName,
        string LastName,
        string? AvatarUrl,
        int? MutualFriendCount
    );
}
