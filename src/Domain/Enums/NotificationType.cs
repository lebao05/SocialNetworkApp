namespace Domain.Enums
{
    public enum NotificationType : byte
    {
        FriendRequest = 1,
        PostLike = 2,
        Comment = 3,
        CommentReply = 4,
        Mention = 5,
        Tag = 6,
        GroupInvite = 7
    }
}
