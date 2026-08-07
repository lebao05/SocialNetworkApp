namespace Application.DTOs.Friends;

/// <summary>
/// Response DTO for the GetFriendRecommendations query. Recommendations
/// are never already-friends by definition; IsFriend is omitted.
/// </summary>
public sealed record GetFriendRecommendationsResponseDto(
    Guid Id,
    string UserName,
    string FullName,
    string? AvatarUrl,
    int MutualFriendsCount);
