namespace Domain.Enums
{
    /// <summary>Who is allowed to create posts inside the group.</summary>
    public enum WhoCanPost : byte
    {
        /// <summary>All members can post.</summary>
        AnyMember = 0,

        /// <summary>Only admins and moderators can post.</summary>
        AdminAndModerator = 1,

        /// <summary>Only admins can post.</summary>
        AdminOnly = 2,
    }
}
