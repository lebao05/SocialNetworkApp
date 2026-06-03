namespace Domain.Enums
{
    /// <summary>Approval status for a post.</summary>
    public enum PostApprovalStatus : byte
    {
        /// <summary>Approved and visible.</summary>
        Approved = 0,

        /// <summary>Waiting for an admin or moderator to review.</summary>
        Pending = 1,

        /// <summary>Rejected — not visible to members.</summary>
        Rejected = 2,
    }
}
