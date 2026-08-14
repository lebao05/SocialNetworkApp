using System.Text.Json.Serialization;

namespace Domain.Enums;

/// <summary>
/// The type of content being reported.
/// </summary>
[JsonConverter(typeof(JsonStringEnumConverter))]
public enum ReportType : byte
{
    Post  = 0,
    Reel  = 1,
    User  = 2,
    Group = 3
}
