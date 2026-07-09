using Application.Abstractions.Messaging;
using Application.DTOs.Search;
using Application.Shared;

namespace Application.Reels.Queries.SearchReels
{
    public sealed record SearchReelsQuery(
        string? SearchQuery,
        int Page = 1,
        int PageSize = 20
    ) : IQuery<PagedList<SearchReelDto>>;
}
