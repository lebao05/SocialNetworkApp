using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Search;
using Application.Shared;
using Domain.Shared;

namespace Application.Users.Queries.SearchUsers
{
    internal sealed class SearchUsersQueryHandler : IQueryHandler<SearchUsersQuery, PagedList<SearchUserDto>>
    {
        private readonly IUserRepository _userRepository;

        public SearchUsersQueryHandler(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<Result<PagedList<SearchUserDto>>> Handle(SearchUsersQuery request, CancellationToken cancellationToken)
        {
            var page = Math.Max(1, request.Page);
            var pageSize = Math.Clamp(request.PageSize, 1, 100);

            var result = await _userRepository.SearchAsync(
                request.SearchQuery,
                request.CurrentUserId,
                page,
                pageSize,
                cancellationToken);

            return Result.Success(result);
        }
    }
}
