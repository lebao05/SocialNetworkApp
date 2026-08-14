using System.Text.Json.Serialization;

namespace Domain.Enums;

/// <summary>
/// Lifecycle status of a content report.
/// </summary>
[JsonConverter(typeof(JsonStringEnumConverter))]
public enum ReportStatus : byte
{
    Pending   = 0,
    Reviewed  = 1,
    Dismissed = 2
}
