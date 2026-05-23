using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Groups;
using Application.DTOs.Posts;
using Domain.Entities;
using Domain.Shared;

namespace Application.Posts.Queries.GetPost
{
    internal sealed class GetPostQueryHandler : IQueryHandler<GetPostQuery, PostDto>
    {
        private readonly IPostRepository _postRepository;

        public GetPostQueryHandler(IPostRepository postRepository)
        {
            _postRepository = postRepository;
        }

        public async Task<Result<PostDto>> Handle(GetPostQuery request, CancellationToken cancellationToken)
        {
            var post = await _postRepository.GetByIdAsync(request.PostId, cancellationToken);
            if (post is null)
            {
                return Result.Failure<PostDto>(new Error(
                    "Post.NotFound",
                    $"The post with Id {request.PostId} was not found."));
            }

            return Result.Success(Map(post));
        }

        private static PostDto Map(Post post)
        {
            return new PostDto(
                post.Id,
                post.AuthorId,
                post.GroupId,
                post.Content,
                post.Visibility,
                post.SharePostId,
                post.LocationTag,
                post.FeelingActivity,
                post.CreatedAt,
                post.UpdatedAt,
                post.DeletedAt,
                MapGroup(post.Group),
                post.SharePost is null ? null : MapSharedPost(post.SharePost));
        }

        private static PostDto MapSharedPost(Post post)
        {
            return new PostDto(
                post.Id,
                post.AuthorId,
                post.GroupId,
                post.Content,
                post.Visibility,
                post.SharePostId,
                post.LocationTag,
                post.FeelingActivity,
                post.CreatedAt,
                post.UpdatedAt,
                post.DeletedAt,
                MapGroup(post.Group),
                null);
        }

        private static GroupDto? MapGroup(Group? group)
        {
            return group is null
                ? null
                : new GroupDto(
                    group.Id,
                    group.OwnerUserId,
                    group.Name,
                    group.Description,
                    group.PrivacyType,
                    group.CoverPhotoUrl);
        }
    }
}
