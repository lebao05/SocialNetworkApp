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
        private readonly IGroupRepository _groupRepository;

        public GetPostQueryHandler(IPostRepository postRepository, IGroupRepository groupRepository)
        {
            _postRepository = postRepository;
            _groupRepository = groupRepository;
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

            var canSeeAuthor = await CanSeeAuthorAsync(post, request.UserId, cancellationToken);

            return Result.Success(Map(post, userReaction?.ReactionType, canSeeAuthor));
        }

        private async Task<bool> CanSeeAuthorAsync(Post post, Guid? viewerId, CancellationToken cancellationToken)
        {
            if (viewerId is null || post.GroupId is null) return true;
            if (post.AuthorId == viewerId.Value) return true;

            var group = await _groupRepository.GetByIdAsync(post.GroupId.Value, cancellationToken);
            if (group is null) return true;
            if (group.OwnerUserId == viewerId.Value) return true;

            var member = group.Members.FirstOrDefault(m => m.UserId == viewerId.Value);
            return member?.Role is GroupMemberRole.Admin or GroupMemberRole.Moderator;
        }

        private static PostDto Map(Post post, ReactionType? userReaction, bool canSeeAuthor)
        {
            var shouldReveal = !post.IsAnonymous || canSeeAuthor;
            var authorId     = shouldReveal ? post.AuthorId : (Guid?)null;
            var authorName   = shouldReveal && post.Author != null ? $"{post.Author.FirstName} {post.Author.LastName}" : null;
            var authorAvatar = shouldReveal ? post.Author?.AvatarUrl : null;

            return new PostDto(
                post.Id,
                authorId,
                authorName,
                authorAvatar,
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
                post.SharePost is null ? null : MapSharedPost(post.SharePost, canSeeAuthor),
                userReaction,
                post.IsHiddenFromGroup,
                post.HiddenAt,
                post.HideReason,
                post.ApprovalStatus,
                post.ApprovalStatus == PostApprovalStatus.Pending,
                post.IsAnonymous);
        }

        private static PostDto MapSharedPost(Post post, bool canSeeAuthor)
        {
            var shouldReveal = !post.IsAnonymous || canSeeAuthor;
            var authorId     = shouldReveal ? post.AuthorId : (Guid?)null;
            var authorName   = shouldReveal && post.Author != null ? $"{post.Author.FirstName} {post.Author.LastName}" : null;
            var authorAvatar = shouldReveal ? post.Author?.AvatarUrl : null;

            return new PostDto(
                post.Id,
                authorId,
                authorName,
                authorAvatar,
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
                null,
                null,
                post.IsHiddenFromGroup,
                post.HiddenAt,
                post.HideReason,
                post.ApprovalStatus,
                post.ApprovalStatus == PostApprovalStatus.Pending,
                post.IsAnonymous);
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
