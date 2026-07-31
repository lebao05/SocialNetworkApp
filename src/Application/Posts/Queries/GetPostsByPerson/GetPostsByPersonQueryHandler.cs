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
        private readonly IUserRepository _userRepository;

        public GetPostsByPersonQueryHandler(IPostRepository postRepository, IUserRepository userRepository)
        {
            _postRepository = postRepository;
            _userRepository = userRepository;
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

            // Resolve every tagged-user id stored on these posts to a display
            // name in a single query, so each tag row doesn't trigger its own
            // round-trip (avoids N+1 over a paged list).
            var nameMap = await ResolveTaggedUserNamesAsync(posts.Items, cancellationToken);

            var items = posts.Items.Select(post => Map(post, reactionMap.TryGetValue(post.Id, out var reaction) ? reaction : null, nameMap)).ToList();

            return Result.Success(new PagedList<PostDto>(
                items,
                posts.PageNumber,
                posts.PageSize,
                posts.TotalCount));
        }

        private static PostDto Map(Post post, ReactionType? userReaction, IReadOnlyDictionary<Guid, string> nameMap)
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
                MapTags(post.Tags, nameMap),
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
                null,                                    // SharePost
                Array.Empty<TagDto>(),                    // Tags
                null,                                    // UserReaction
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

        // Forwarded to the shared TagResolver — TagDto.Id is now the tagged
        // user's Guid, and TagName is the resolved display name.
        private static IReadOnlyCollection<TagDto> MapTags(
            IEnumerable<PostTag> tags,
            IReadOnlyDictionary<Guid, string> nameMap)
            => TagResolver.MapTags(tags, nameMap);

        // Collect every tagged-user id from the paged posts and resolve them
        // in one batched call. Posts are paginated so the input is small.
        private async Task<IReadOnlyDictionary<Guid, string>> ResolveTaggedUserNamesAsync(
            IEnumerable<Post> posts,
            CancellationToken cancellationToken)
        {
            var ids = new List<Guid>();
            foreach (var post in posts)
            {
                foreach (var tag in post.Tags)
                {
                    if (Guid.TryParse(tag.TagName, out var userId))
                        ids.Add(userId);
                }
            }
            return await _userRepository.GetDisplayNamesByIdsAsync(ids, cancellationToken);
        }
    }
}
