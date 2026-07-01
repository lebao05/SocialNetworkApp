namespace Application.DTOs.Users;

public sealed record BirthdayDto(
    Guid UserId,
    string FullName,
    string? AvatarUrl,
    int Day,
    int Month,
    int AgeTurning,
    int MutualFriendsCount
);
