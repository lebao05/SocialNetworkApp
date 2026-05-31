using System.Linq;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Groups;
using Application.DTOs.Posts;
using Domain.Entities;
using Domain.Enums;
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

            var userReaction = request.UserId.HasValue
                ? await _postRepository.GetPostReactionAsync(request.PostId, request.UserId.Value, cancellationToken)
                : null;

            return Result.Success(Map(post, userReaction?.ReactionType));
        }

        private static PostDto Map(Post post, ReactionType? userReaction)
        {
            return new PostDto(
                post.Id,
                post.AuthorId,
                post.Author != null ? $"{post.Author.FirstName} {post.Author.LastName}" : "Người dùng",
                post.Author?.AvatarUrl,
                post.GroupId,
                post.Content,
                post.Visibility,
                post.SharePostId,
                post.LocationTag,
                post.FeelingActivity,
                post.CreatedAt,
                post.UpdatedAt,
                post.DeletedAt,
                post.Media.Select(m => new PostMediaDto(
                    m.Id,
                    m.MediaType,
                    m.MediaUrl,
                    m.ThumbnailUrl,
                    m.Metadata,
                    m.UploadedAt
                )).ToList(),
                MapReactionCounts(post),
                post.Comments.Count,
                MapGroup(post.Group),
                post.SharePost is null ? null : MapSharedPost(post.SharePost),
                userReaction,
                post.IsHiddenFromGroup,
                post.HiddenAt,
                post.HideReason);
        }

        private static PostDto MapSharedPost(Post post)
        {
            return new PostDto(
                post.Id,
                post.AuthorId,
                post.Author != null ? $"{post.Author.FirstName} {post.Author.LastName}" : "Người dùng",
                post.Author?.AvatarUrl,
                post.GroupId,
                post.Content,
                post.Visibility,
                post.SharePostId,
                post.LocationTag,
                post.FeelingActivity,
                post.CreatedAt,
                post.UpdatedAt,
                post.DeletedAt,
                post.Media.Select(m => new PostMediaDto(
                    m.Id,
                    m.MediaType,
                    m.MediaUrl,
                    m.ThumbnailUrl,
                    m.Metadata,
                    m.UploadedAt
                )).ToList(),
                MapReactionCounts(post),
                post.Comments.Count,
                MapGroup(post.Group),
                null);
        }

        private static IReadOnlyCollection<ReactionCountDto> MapReactionCounts(Post post)
        {
            return post.Reactions
                .GroupBy(reaction => reaction.ReactionType)
                .Select(group => new ReactionCountDto(group.Key, group.Count()))
                .ToList();
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
