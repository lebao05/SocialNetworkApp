using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Users;
using Application.Shared;
using Domain.Shared;

namespace Application.Posts.Queries.GetPossibleTags
{
    internal sealed class GetPossibleTagsQueryHandler : IQueryHandler<GetPossibleTagsQuery, PagedList<TaggableUserDto>>
    {
        private readonly IUserRepository _userRepository;

        public GetPossibleTagsQueryHandler(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<Result<PagedList<TaggableUserDto>>> Handle(GetPossibleTagsQuery request, CancellationToken cancellationToken)
        {
            var pagedUsers = await _userRepository.SearchUsersAsync(
                request.SearchQuery,
                request.GroupId,
                request.PageNumber,
                request.PageSize,
                cancellationToken);

            var mappedUsers = pagedUsers.Items
                .Select(u => new TaggableUserDto(u.Id, u.FirstName, u.LastName, u.AvatarUrl))
                .ToList();

            var result = new PagedList<TaggableUserDto>(
                mappedUsers,
                pagedUsers.PageNumber,
                pagedUsers.PageSize,
                pagedUsers.TotalCount);

            return Result.Success(result);
        }
    }
}
