namespace Domain.Enums
{
    /// <summary>The reason a user reported a piece of group content.</summary>
    public enum GroupReportReason : byte
    {
        Spam                = 0,
        Harassment          = 1,
        HateSpeech          = 2,
        Violence            = 3,
        Misinformation      = 4,
        NudityOrSexual      = 5,
        IntellectualProperty = 6,
        Other               = 7,
    }
}
