using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Posts;
using Application.DTOs.Search;
using Application.Shared;
using Domain.Entities;
using Domain.Shared;

namespace Application.Posts.Queries.SearchPosts
{
    internal sealed class SearchPostsQueryHandler : IQueryHandler<SearchPostsQuery, PagedList<SearchPostDto>>
    {
        private readonly IPostRepository _postRepository;

        public SearchPostsQueryHandler(IPostRepository postRepository)
        {
            _postRepository = postRepository;
        }

        public async Task<Result<PagedList<SearchPostDto>>> Handle(SearchPostsQuery request, CancellationToken cancellationToken)
        {
            var page = Math.Max(1, request.Page);
            var pageSize = Math.Clamp(request.PageSize, 1, 100);

            var posts = await _postRepository.SearchAsync(request.SearchQuery, page, pageSize, cancellationToken);

            var items = posts.Items.Select(Map).ToList();

            return Result.Success(new PagedList<SearchPostDto>(
                items,
                posts.PageNumber,
                posts.PageSize,
                posts.TotalCount));
        }

        private static SearchPostDto Map(Post post)
        {
            var authorName = post.Author != null
                ? $"{post.Author.FirstName} {post.Author.LastName}".Trim()
                : null;

            return new SearchPostDto(
                post.Id,
                post.AuthorId,
                authorName ?? string.Empty,
                post.Author?.AvatarUrl,
                post.Content,
                post.Visibility,
                post.CreatedAt,
                post.Media.Select(m => new PostMediaDto(
                    m.Id,
                    m.MediaType,
                    m.MediaUrl,
                    m.ThumbnailUrl,
                    m.Metadata,
                    m.UploadedAt
                )).ToList(),
                post.Reactions
                    .GroupBy(r => r.ReactionType)
                    .Select(g => new ReactionCountDto(g.Key, g.Count()))
                    .ToList(),
                post.Comments.Count);
        }
    }
}
