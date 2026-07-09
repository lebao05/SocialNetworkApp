using Application.DTOs.Posts;
using Domain.Enums;

namespace Application.DTOs.Search
{
    public sealed record SearchPostDto(
        long Id,
        Guid AuthorId,
        string AuthorName,
        string? AuthorAvatarUrl,
        string? Content,
        PostVisibility Visibility,
        DateTime CreatedAt,
        IReadOnlyList<PostMediaDto> Media,
        IReadOnlyList<ReactionCountDto> ReactionCounts,
        int CommentCount
    );
}
