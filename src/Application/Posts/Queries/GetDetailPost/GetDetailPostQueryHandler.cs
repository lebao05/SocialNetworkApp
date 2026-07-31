using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Posts;
using Domain.Shared;

namespace Application.Posts.Queries.GetDetailPost
{
    internal sealed class GetDetailPostQueryHandler : IQueryHandler<GetDetailPostQuery, PostDto>
    {
        private readonly IPostRepository _postRepository;
        private readonly IUserRepository _userRepository;

        public GetDetailPostQueryHandler(IPostRepository postRepository, IUserRepository userRepository)
        {
            _postRepository = postRepository;
            _userRepository = userRepository;
        }

        public async Task<Result<PostDto>> Handle(GetDetailPostQuery request, CancellationToken cancellationToken)
        {
            var post = await _postRepository.GetDetailPostAsync(request.PostId, request.UserId, cancellationToken);
            if (post is null)
            {
                return Result.Failure<PostDto>(new Error(
                    "Post.NotFound",
                    $"The post with Id {request.PostId} was not found."));
            }

            // The repository projection leaves tag names as raw Guid strings;
            // swap in real display names in a single batched lookup so the
            // client gets a ready-to-render TagDto. ResolveAllAsync rewrites
            // the post in place via a `with` expression, so we read it back
            // from the list.
            var posts = new List<PostDto> { post };
            await TagResolver.ResolveAllAsync(posts, _userRepository, cancellationToken);

            return Result.Success(posts[0]);
        }
    }
}
