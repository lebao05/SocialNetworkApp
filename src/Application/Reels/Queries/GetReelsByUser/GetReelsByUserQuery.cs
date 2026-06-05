using Application.Abstractions.Messaging;
using Application.DTOs.Reels;
using Application.Shared;

namespace Application.Reels.Queries.GetReelsByUser
{
    public sealed record GetReelsByUserQuery(
        Guid AuthorId,
        int Page = 1,
        int PageSize = 12,
        Guid? CurrentUserId = null
    ) : IQuery<PagedList<ReelDto>>;
}
