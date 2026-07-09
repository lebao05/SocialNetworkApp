using System.Linq;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Groups;
using Application.DTOs.Posts;
using Application.Shared;
using Domain.Entities;
using Domain.Enums;
using Domain.Shared;

namespace Application.Posts.Queries.GetSavedPosts
{
    internal sealed class GetSavedPostsQueryHandler : IQueryHandler<GetSavedPostsQuery, PagedList<SavedPostDto>>
    {
        private readonly IPostRepository _postRepository;

        public GetSavedPostsQueryHandler(IPostRepository postRepository)
        {
            _postRepository = postRepository;
        }

        public async Task<Result<PagedList<SavedPostDto>>> Handle(GetSavedPostsQuery request, CancellationToken cancellationToken)
        {
            var page = Math.Max(1, request.Page);
            var pageSize = Math.Clamp(request.PageSize, 1, 100);

            var savedPosts = await _postRepository.GetSavedPostsPagedAsync(
                request.UserId, page, pageSize, cancellationToken);

            var items = savedPosts.Items.Select(Map).ToList();

            return Result.Success(new PagedList<SavedPostDto>(
                items,
                savedPosts.PageNumber,
                savedPosts.PageSize,
                savedPosts.TotalCount));
        }

        private static SavedPostDto Map(SavedPost savedPost)
        {
            return new SavedPostDto(
                savedPost.Id,
                savedPost.CreatedAt,
                MapPost(savedPost.Post));
        }

        private static PostDto MapPost(Post post)
        {
            var authorName = post.Author != null
                ? $"{post.Author.FirstName} {post.Author.LastName}"
                : null;

            var sharePostDto = post.SharePost != null ? MapSharedPost(post.SharePost) : null;

            return new PostDto(
                post.Id,
                post.AuthorId,
                authorName,
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
                sharePostDto,
                null,
                post.IsHiddenFromGroup,
                post.HiddenAt,
                post.HideReason,
                post.ApprovalStatus,
                post.ApprovalStatus == PostApprovalStatus.Pending,
                post.IsAnonymous);
        }

        private static PostDto MapSharedPost(Post post)
        {
            var authorName = post.Author != null
                ? $"{post.Author.FirstName} {post.Author.LastName}"
                : null;

            return new PostDto(
                post.Id,
                post.AuthorId,
                authorName,
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
                .GroupBy(r => r.ReactionType)
                .Select(g => new ReactionCountDto(g.Key, g.Count()))
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
