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
        private readonly IUserRepository _userRepository;

        public GetSavedPostsQueryHandler(IPostRepository postRepository, IUserRepository userRepository)
        {
            _postRepository = postRepository;
            _userRepository = userRepository;
        }

        public async Task<Result<PagedList<SavedPostDto>>> Handle(GetSavedPostsQuery request, CancellationToken cancellationToken)
        {
            var page = Math.Max(1, request.Page);
            var pageSize = Math.Clamp(request.PageSize, 1, 100);

            var savedPosts = await _postRepository.GetSavedPostsPagedAsync(
                request.UserId, page, pageSize, cancellationToken);

            // One batched lookup for every tagged user across the page.
            var nameMap = await ResolveTaggedUserNamesAsync(savedPosts.Items, cancellationToken);

            var items = savedPosts.Items.Select(sp => Map(sp, nameMap)).ToList();

            return Result.Success(new PagedList<SavedPostDto>(
                items,
                savedPosts.PageNumber,
                savedPosts.PageSize,
                savedPosts.TotalCount));
        }

        private static SavedPostDto Map(SavedPost savedPost, IReadOnlyDictionary<Guid, string> nameMap)
        {
            return new SavedPostDto(
                savedPost.Id,
                savedPost.CreatedAt,
                MapPost(savedPost.Post, nameMap));
        }

        private static PostDto MapPost(Post post, IReadOnlyDictionary<Guid, string> nameMap)
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
                post.Tags.Select(t => MapTag(t, nameMap)).ToList(),
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

        private static TagDto MapTag(PostTag t, IReadOnlyDictionary<Guid, string> nameMap)
        {
            return TagResolver.MapTags(new[] { t }, nameMap).First();
        }

        private async Task<IReadOnlyDictionary<Guid, string>> ResolveTaggedUserNamesAsync(
            IEnumerable<SavedPost> savedPosts,
            CancellationToken cancellationToken)
        {
            var ids = new List<Guid>();
            foreach (var sp in savedPosts)
            {
                foreach (var tag in sp.Post.Tags)
                {
                    if (Guid.TryParse(tag.TagName, out var userId))
                        ids.Add(userId);
                }
            }
            return await _userRepository.GetDisplayNamesByIdsAsync(ids, cancellationToken);
        }
    }
}
