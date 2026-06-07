using Domain.Enums;

namespace Application.DTOs.Reels
{
    public sealed record ReelDto(
        long Id,
        Guid AuthorId,
        string AuthorName,
        string? AuthorAvatarUrl,
        string VideoUrl,
        string? ThumbnailUrl,
        string? Caption,
        string? AudioTitle,
        string? Duration,
        ReelVisibility Visibility,
        int LikeCount,
        int CommentCount,
        int ViewCount,
        DateTime CreatedAt,
        DateTime? UpdatedAt,
        bool IsOwnReel,
        bool IsLikedByCurrentUser
    );
}
