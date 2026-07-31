using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Posts;
using Application.Shared;
using Domain.Shared;

namespace Application.Posts.Queries.SearchPosts
{
    internal sealed class SearchPostsQueryHandler : IQueryHandler<SearchPostsQuery, PagedList<PostDto>>
    {
        private readonly IPostRepository _postRepository;
        private readonly IUserRepository _userRepository;

        public SearchPostsQueryHandler(IPostRepository postRepository, IUserRepository userRepository)
        {
            _postRepository = postRepository;
            _userRepository = userRepository;
        }

        public async Task<Result<PagedList<PostDto>>> Handle(SearchPostsQuery request, CancellationToken cancellationToken)
        {
            var page = Math.Max(1, request.Page);
            var pageSize = Math.Clamp(request.PageSize, 1, 100);

            var posts = await _postRepository.SearchAsync(request.userId, request.SearchQuery, page, pageSize, cancellationToken);

            // Resolve tagged-user display names in a single batched call
            // across the whole paged result.
            await TagResolver.ResolveAllAsync(posts.Items, _userRepository, cancellationToken);

            return Result.Success(posts);
        }

    }
}
