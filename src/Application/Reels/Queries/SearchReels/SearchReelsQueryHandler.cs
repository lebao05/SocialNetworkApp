using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Search;
using Application.Shared;
using Domain.Shared;

namespace Application.Reels.Queries.SearchReels
{
    internal sealed class SearchReelsQueryHandler : IQueryHandler<SearchReelsQuery, PagedList<SearchReelDto>>
    {
        private readonly IReelRepository _reelRepository;

        public SearchReelsQueryHandler(IReelRepository reelRepository)
        {
            _reelRepository = reelRepository;
        }

        public async Task<Result<PagedList<SearchReelDto>>> Handle(SearchReelsQuery request, CancellationToken cancellationToken)
        {
            var page = Math.Max(1, request.Page);
            var pageSize = Math.Clamp(request.PageSize, 1, 100);

            var result = await _reelRepository.SearchAsync(
                request.userId,
                request.SearchQuery,
                page,
                pageSize,
                cancellationToken);

            return Result.Success(result);
        }
    }
}
