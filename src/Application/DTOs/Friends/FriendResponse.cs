namespace Application.DTOs.Friends;

public sealed record FriendResponse(
    Guid Id,
    string UserName,
    string FullName,
    string? AvatarUrl);