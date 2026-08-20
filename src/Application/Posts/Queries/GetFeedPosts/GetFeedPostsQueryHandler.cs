using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Feeds;
using Application.DTOs.Posts;
using Domain.Shared;

namespace Application.Posts.Queries.GetFeedPosts
{
    internal sealed class GetFeedPostsQueryHandler : IQueryHandler<GetFeedPostsQuery, List<FeedPostDto>>
    {
        private readonly IFeedRepository _feedRepository;

        public GetFeedPostsQueryHandler(IFeedRepository feedRepository)
        {
            _feedRepository = feedRepository;
        }

        public async Task<Result<List<FeedPostDto>>> Handle(GetFeedPostsQuery request, CancellationToken cancellationToken)
        {
            var pageSize = Math.Clamp(request.PageSize, 1, 20);

            var posts = await _feedRepository.GetPostsAsync(request.UserId, pageSize, request.IsRefresh, cancellationToken);

            return Result.Success(posts);
        }
    }
}