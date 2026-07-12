using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Posts;
using Domain.Shared;

namespace Application.Posts.Queries.GetDetailPost
{
    internal sealed class GetDetailPostQueryHandler : IQueryHandler<GetDetailPostQuery, PostDto>
    {
        private readonly IPostRepository _postRepository;

        public GetDetailPostQueryHandler(IPostRepository postRepository)
        {
            _postRepository = postRepository;
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

            return Result.Success(post);
        }
    }
}
