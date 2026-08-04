using System.Linq;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Groups;
using Application.DTOs.Posts;
using Application.Shared;
using Domain.Entities;
using Domain.Enums;
using Domain.Shared;

namespace Application.Posts.Queries.GetPostsByPerson
{
    internal sealed class GetPostsByPersonQueryHandler : IQueryHandler<GetPostsByPersonQuery, PagedList<PostDto>>
    {
        private readonly IPostRepository _postRepository;

        public GetPostsByPersonQueryHandler(IPostRepository postRepository)
        {
            _postRepository = postRepository;
        }

        public async Task<Result<PagedList<PostDto>>> Handle(GetPostsByPersonQuery request, CancellationToken cancellationToken)
        {
            var page = Math.Max(1, request.Page);
            var pageSize = Math.Clamp(request.PageSize, 1, 100);

            var posts = await _postRepository.GetByAuthorIdPagedAsync(
                request.AuthorId,
                request.UserId,
                page,
                pageSize,
                cancellationToken);

            return Result.Success(new PagedList<PostDto>(
                posts.Items,
                posts.PageNumber,
                posts.PageSize,
                posts.TotalCount));
        }
    }
}
