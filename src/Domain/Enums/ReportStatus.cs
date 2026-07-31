namespace Domain.Enums;

/// <summary>
/// Lifecycle status of a content report.
/// </summary>
public enum ReportStatus : byte
{
    Pending   = 0,
    Reviewed  = 1,
    Dismissed = 2
}
