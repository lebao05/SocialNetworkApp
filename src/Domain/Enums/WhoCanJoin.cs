namespace Domain.Enums
{
    /// <summary>Who is allowed to join the group.</summary>
    public enum WhoCanJoin : byte
    {
        /// <summary>Anyone can join without approval.</summary>
        Anyone = 0,

        /// <summary>Anyone can request; admin/moderator must approve.</summary>
        RequireApproval = 1,
    }
}
