namespace Domain.Enums
{
    /// <summary>Who can approve membership requests in the group.</summary>
    public enum WhoCanApprove : byte
    {
        /// <summary>Only admins can approve join requests.</summary>
        AdminOnly = 0,

        /// <summary>Admins and moderators can approve join requests.</summary>
        AdminAndModerator = 1,
    }
}
