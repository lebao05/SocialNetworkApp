using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Feeds;
using Application.Shared;
using Domain.Shared;

namespace Application.Feeds.Queries.GetFeedPosts
{
    internal sealed class GetFeedPostsQueryHandler : IQueryHandler<GetFeedPostsQuery, PagedList<FeedPostDto>>
    {
        private readonly IFeedRepository _feedRepository;

        public GetFeedPostsQueryHandler(IFeedRepository feedRepository)
        {
            _feedRepository = feedRepository;
        }

        public async Task<Result<PagedList<FeedPostDto>>> Handle(GetFeedPostsQuery request, CancellationToken cancellationToken)
        {
            var page = Math.Max(1, request.Page);
            var pageSize = Math.Clamp(request.PageSize, 1, 100);

            var posts = await _feedRepository.GetPostsAsync(request.UserId, page, pageSize, cancellationToken);

            return Result.Success(posts);
        }
    }
}
