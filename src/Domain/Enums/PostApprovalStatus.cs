namespace Domain.Enums
{
    /// <summary>Approval status for a post submitted to a group with IsPostApprovalRequired=true.</summary>
    public enum PostApprovalStatus : byte
    {
        /// <summary>Post is not in a group or the group does not require approval — visible immediately.</summary>
        NotRequired = 0,

        /// <summary>Waiting for an admin or moderator to review.</summary>
        Pending = 1,

        /// <summary>Approved and visible to group members.</summary>
        Approved = 2,

        /// <summary>Rejected — not visible to members.</summary>
        Rejected = 3,
    }
}
