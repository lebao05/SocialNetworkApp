using Application.Abstractions.Messaging;

namespace Application.Groups.Commands.ExecuteReportedContent
{
    public sealed record ExecuteReportedContentCommand(
        Guid ReviewerUserId,
        long GroupId,
        long ReportId,
        bool HidePost,
        string? ReviewNote) : ICommand;
}
