using Application.Abstractions.Messaging;
using Application.DTOs.Reels;
using Application.Shared;

namespace Application.Reels.Queries.GetRecommendedReels
{
    public sealed record GetRecommendedReelsQuery(
        Guid UserId,
        int PageSize = 12
    ) : IQuery<PagedList<ReelDto>>;
}
