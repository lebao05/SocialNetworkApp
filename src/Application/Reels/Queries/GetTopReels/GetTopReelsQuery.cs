using Application.Abstractions.Messaging;
using Application.DTOs.Reels;
using Application.Shared;

namespace Application.Reels.Queries.GetTopReels;

public sealed record GetTopReelsQuery(
    Guid UserId,
    int PageSize = 6
) : IQuery<PagedList<ReelDto>>;
