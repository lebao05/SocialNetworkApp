using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Search;
using Application.Shared;
using Domain.Shared;

namespace Application.Groups.Queries.SearchGroups
{
    internal sealed class SearchGroupsQueryHandler : IQueryHandler<SearchGroupsQuery, PagedList<SearchGroupDto>>
    {
        private readonly IGroupListingRepository _groupListingRepository;

        public SearchGroupsQueryHandler(IGroupListingRepository groupListingRepository)
        {
            _groupListingRepository = groupListingRepository;
        }

        public async Task<Result<PagedList<SearchGroupDto>>> Handle(SearchGroupsQuery request, CancellationToken cancellationToken)
        {
            var page = Math.Max(1, request.Page);
            var pageSize = Math.Clamp(request.PageSize, 1, 100);

            var result = await _groupListingRepository.SearchAsync(
                request.SearchQuery,
                page,
                pageSize,
                cancellationToken);

            return Result.Success(result);
        }
    }
}
