using Application.Abstractions.Messaging;
using Application.DTOs.Groups;

namespace Application.Groups.Queries.GetGroupInsights
{
    public sealed record GetGroupInsightsQuery(
        long GroupId,
        Guid RequesterUserId,
        DateTime? FromDate,
        DateTime? ToDate) : IQuery<GroupInsightsDto>;
}
