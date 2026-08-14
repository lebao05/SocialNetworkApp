using System.Text.Json.Serialization;

namespace Domain.Enums;

/// <summary>
/// The reason a user submitted a report. Shared across all content types.
/// </summary>
[JsonConverter(typeof(JsonStringEnumConverter))]
public enum ReportReason : byte
{
    Spam                = 0,
    Harassment          = 1,
    HateSpeech          = 2,
    Violence            = 3,
    Misinformation      = 4,
    NudityOrSexual      = 5,
    IntellectualProperty = 6,
    SpamOrMisleading    = 7,
    Impersonation       = 8,
    Other               = 9
}
