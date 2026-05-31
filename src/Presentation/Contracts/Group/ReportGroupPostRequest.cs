namespace Presentation.Contracts.Group
{
    public sealed class ReportGroupPostRequest
    {
        public string Reason { get; init; } = string.Empty;
        public string? AdditionalDetail { get; init; }
    }
}
