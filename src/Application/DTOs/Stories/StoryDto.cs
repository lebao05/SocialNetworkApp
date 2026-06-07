namespace Application.DTOs.Stories;

public sealed record StoryDto(
    long Id,
    Guid UserId,
    string AuthorName,
    string? AuthorAvatarUrl,
    string? MediaUrl,
    string MediaType,
    string? BackgroundGradient,
    string? TextContent,
    string? TextColor,
    string? TextStyle,
    string? TextPositionX,
    string? TextPositionY,
    string? FontFamily,
    int LikeCount,
    int ViewCount,
    DateTime CreatedAt,
    DateTime ExpiresAt,
    bool IsOwnStory,
    bool IsSeenByCurrentUser,
    bool IsLikedByCurrentUser
);
