using Application.Abstractions.Messaging;
using Application.DTOs.Groups;

namespace Application.Groups.Queries.GetGroupDetail
{
    public sealed record GetGroupDetailQuery(
        long GroupId,
        Guid RequesterUserId) : IQuery<GroupDetailDto>;
}
