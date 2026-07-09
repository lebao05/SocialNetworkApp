using Domain.Enums;

namespace Application.DTOs.Search
{
    public sealed record SearchReelDto(
        long Id,
        string VideoUrl,
        string? ThumbnailUrl,
        string? Caption,
        Guid AuthorId,
        string AuthorName,
        string? AuthorAvatarUrl,
        int LikeCount,
        int CommentCount,
        int ViewCount,
        DateTime CreatedAt
    );
}
