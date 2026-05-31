using Application.Abstractions.Messaging;
using Domain.Enums;

namespace Application.Groups.Commands.ReportGroupPost
{
    public sealed record ReportGroupPostCommand(
        Guid ReporterId,
        long GroupId,
        long PostId,
        GroupReportReason Reason,
        string? AdditionalDetail) : ICommand;
}
