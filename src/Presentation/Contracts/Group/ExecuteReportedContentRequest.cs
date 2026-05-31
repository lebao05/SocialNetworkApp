namespace Presentation.Contracts.Group
{
    public sealed class ExecuteReportedContentRequest
    {
        public bool HidePost { get; init; } = true;
        public string? ReviewNote { get; init; }
    }
}
