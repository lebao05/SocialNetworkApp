namespace Application.DTOs.Reels
{
    public sealed record ReelCommentDto(
        long Id,
        long ReelId,
        Guid UserId,
        string UserName,
        string? UserAvatarUrl,
        long? ParentCommentId,
        Guid? RepliedUserId,
        string? RepliedUserName,
        string? RepliedAvatarUrl,
        string Content,
        int ReplyCount,
        DateTime CreatedAt,
        DateTime? UpdatedAt
    );
}
