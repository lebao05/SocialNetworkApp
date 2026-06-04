using System.Linq;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Groups;
using Application.DTOs.Posts;
using Application.Shared;
using Domain.Entities;
using Domain.Enums;
using Domain.Shared;

namespace Application.Posts.Queries.GetPostsByPerson
{
    internal sealed class GetPostsByPersonQueryHandler : IQueryHandler<GetPostsByPersonQuery, PagedList<PostDto>>
    {
        private readonly IPostRepository _postRepository;

        public GetPostsByPersonQueryHandler(IPostRepository postRepository)
        {
            _postRepository = postRepository;
        }

        public async Task<Result<PagedList<PostDto>>> Handle(GetPostsByPersonQuery request, CancellationToken cancellationToken)
        {
            var page = Math.Max(1, request.Page);
            var pageSize = Math.Clamp(request.PageSize, 1, 100);
            var posts = await _postRepository.GetByAuthorIdPagedAsync(request.AuthorId, page, pageSize, cancellationToken);

            var reactionMap = request.UserId.HasValue
                ? (await _postRepository.GetPostReactionsAsync(posts.Items.Select(p => p.Id), request.UserId.Value, cancellationToken))
                    .ToDictionary(reaction => reaction.PostId, reaction => (ReactionType?)reaction.ReactionType)
                : new Dictionary<long, ReactionType?>();

            var items = posts.Items.Select(post => Map(post, reactionMap.TryGetValue(post.Id, out var reaction) ? reaction : null)).ToList();

            return Result.Success(new PagedList<PostDto>(
                items,
                posts.PageNumber,
                posts.PageSize,
                posts.TotalCount));
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
                post.HideReason,
                post.ApprovalStatus,
                post.ApprovalStatus == PostApprovalStatus.Pending,
                post.IsAnonymous);
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
