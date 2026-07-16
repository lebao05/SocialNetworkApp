using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Posts;
using Application.DTOs.Search;
using Application.Shared;
using Domain.Entities;
using Domain.Shared;

namespace Application.Posts.Queries.SearchPosts
{
    internal sealed class SearchPostsQueryHandler : IQueryHandler<SearchPostsQuery, PagedList<PostDto>>
    {
        private readonly IPostRepository _postRepository;

        public SearchPostsQueryHandler(IPostRepository postRepository)
        {
            _postRepository = postRepository;
        }

        public async Task<Result<PagedList<PostDto>>> Handle(SearchPostsQuery request, CancellationToken cancellationToken)
        {
            var page = Math.Max(1, request.Page);
            var pageSize = Math.Clamp(request.PageSize, 1, 100);

            var posts = await _postRepository.SearchAsync( request.userId, request.SearchQuery, page, pageSize, cancellationToken);

            return Result.Success(posts);
        }

    }
}
