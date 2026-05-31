using Domain.Enums;

namespace Application.DTOs.Posts
{
    public sealed record PostCommentDto(
        long Id,
        long PostId,
        Guid UserId,
        string UserName,
        string? UserAvatarUrl,
        long? ParentCommentId,
        Guid? RepliedUserId,
        string? RepliedUserName,
        string? RepliedAvatarUrl,
        string Content,
        DateTime CreatedAt,
        DateTime? UpdatedAt,
        IReadOnlyCollection<ReactionCountDto> ReactionCounts,
        int ReplyCount,
        ReactionType? UserReaction = null
    );
}
