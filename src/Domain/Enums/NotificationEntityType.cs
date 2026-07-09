namespace Domain.Enums
{
    public enum NotificationEntityType : byte
    {
        Post = 0,
        Comment = 1,
        Profile = 2,
        Group = 3,
        FriendRequest = 4,
        GroupJoinRequest = 5,
        PostTagged = 6
    }
}
