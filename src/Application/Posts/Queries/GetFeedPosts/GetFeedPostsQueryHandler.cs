using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Feeds;
using Application.DTOs.Posts;
using Application.Shared;
using Domain.Shared;

namespace Application.Posts.Queries.GetFeedPosts
{
    internal sealed class GetFeedPostsQueryHandler : IQueryHandler<GetFeedPostsQuery, PagedList<FeedPostDto>>
    {
        private readonly IFeedRepository _feedRepository;
        private readonly IUserRepository _userRepository;

        public GetFeedPostsQueryHandler(IFeedRepository feedRepository, IUserRepository userRepository)
        {
            _feedRepository = feedRepository;
            _userRepository = userRepository;
        }

        public async Task<Result<PagedList<FeedPostDto>>> Handle(GetFeedPostsQuery request, CancellationToken cancellationToken)
        {
            var page = Math.Max(1, request.Page);
            var pageSize = Math.Clamp(request.PageSize, 1, 20);

            var posts = await _feedRepository.GetPostsAsync(request.UserId, page, pageSize, request.IsRefresh, cancellationToken);
            
            // Resolve tagged-user display names in a single batched call so
            // every feed row exposes {userId, displayName} in one round-trip.
            var postDtos = new List<PostDto>(posts.Items.Count);
            foreach (var item in posts.Items) postDtos.Add(item.Post);

            await TagResolver.ResolveAllAsync(postDtos, _userRepository, cancellationToken);

            return Result.Success(posts);
        }
    }
}
