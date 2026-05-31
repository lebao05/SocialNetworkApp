namespace Domain.Enums
{
    /// <summary>Lifecycle status of a content report inside a group.</summary>
    public enum GroupReportStatus : byte
    {
        /// <summary>Awaiting moderator or admin review.</summary>
        Pending   = 0,

        /// <summary>Report was reviewed and action was taken.</summary>
        Reviewed  = 1,

        /// <summary>Report was reviewed and dismissed (no violation found).</summary>
        Dismissed = 2,
    }
}
