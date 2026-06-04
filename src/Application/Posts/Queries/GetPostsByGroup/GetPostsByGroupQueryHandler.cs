using System.Linq;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Groups;
using Application.DTOs.Posts;
using Application.Shared;
using Domain.Entities;
using Domain.Enums;
using Domain.Shared;

namespace Application.Posts.Queries.GetPostsByGroup
{
    internal sealed class GetPostsByGroupQueryHandler : IQueryHandler<GetPostsByGroupQuery, PagedList<PostDto>>
    {
        private readonly IPostRepository _postRepository;
        private readonly IGroupRepository _groupRepository;

        public GetPostsByGroupQueryHandler(IPostRepository postRepository, IGroupRepository groupRepository)
        {
            _postRepository = postRepository;
            _groupRepository = groupRepository;
        }

        public async Task<Result<PagedList<PostDto>>> Handle(GetPostsByGroupQuery request, CancellationToken cancellationToken)
        {
            var page = Math.Max(1, request.Page);
            var pageSize = Math.Clamp(request.PageSize, 1, 100);

            PagedList<Post> posts;
            if (request.ApprovalStatus.HasValue)
            {
                posts = await _postRepository.GetByGroupIdPagedAsync(
                    request.GroupId, page, pageSize, request.ApprovalStatus.Value, cancellationToken);
            }
            else
            {
                var authorId = request.OnlyMine ? request.UserId : null;
                posts = await _postRepository.GetByGroupIdPagedAsync(
                    request.GroupId, page, pageSize, authorId, cancellationToken);
            }

            var reactionMap = request.UserId.HasValue
                ? (await _postRepository.GetPostReactionsAsync(posts.Items.Select(p => p.Id), request.UserId.Value, cancellationToken))
                    .ToDictionary(reaction => reaction.PostId, reaction => (ReactionType?)reaction.ReactionType)
                : new Dictionary<long, ReactionType?>();

            var viewerCanSeeAuthor = await CanSeeAuthorAsync(request.GroupId, request.UserId, cancellationToken);

            var items = posts.Items.Select(post => Map(post, reactionMap.TryGetValue(post.Id, out var reaction) ? reaction : null, viewerCanSeeAuthor)).ToList();

            return Result.Success(new PagedList<PostDto>(
                items,
                posts.PageNumber,
                posts.PageSize,
                posts.TotalCount));
        }

        private async Task<bool> CanSeeAuthorAsync(long groupId, Guid? viewerId, CancellationToken cancellationToken)
        {
            if (viewerId is null) return false;

            var group = await _groupRepository.GetByIdAsync(groupId, cancellationToken);
            if (group is null) return false;

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
