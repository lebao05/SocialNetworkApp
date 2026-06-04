using System.Linq;
using Application.Abstractions.Repositories;
using Application.DTOs.Feeds;
using Application.DTOs.Groups;
using Application.DTOs.Posts;
using Application.Shared;
using Domain.Entities;
using Domain.Enums;
using Infrastructure.Persistence.Contexts;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories
{
    public sealed class FeedRepository : IFeedRepository
    {
        private readonly AppDbContext _context;

        public FeedRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<PagedList<FeedPostDto>> GetPostsAsync(
            Guid userId,
            int page,
            int pageSize,
            bool isRefresh = false,
            CancellationToken cancellationToken = default)
        {
            var query = _context.UserFeeds
                .AsNoTracking()
                .Where(feed => feed.UserId == userId)
                .Where(feed => !feed.Post.IsHiddenFromGroup)
                .Include(feed => feed.Post)
                    .ThenInclude(post => post.Author)
                .Include(feed => feed.Post)
                    .ThenInclude(post => post.Group)
                .Include(feed => feed.Post)
                    .ThenInclude(post => post.Media)
                .Include(feed => feed.Post)
                    .ThenInclude(post => post.Reactions)
                .Include(feed => feed.Post)
                    .ThenInclude(post => post.Comments)
                .Include(feed => feed.Post)
                    .ThenInclude(post => post.SharePost)
                        .ThenInclude(sharePost => sharePost!.Author)
                .Include(feed => feed.Post)
                    .ThenInclude(post => post.SharePost)
                        .ThenInclude(sharePost => sharePost!.Group)
                .Include(feed => feed.Post)
                    .ThenInclude(post => post.SharePost)
                        .ThenInclude(sharePost => sharePost!.Media)
                .Include(feed => feed.Post)
                    .ThenInclude(post => post.SharePost)
                        .ThenInclude(sharePost => sharePost!.Reactions)
                .Include(feed => feed.Post)
                    .ThenInclude(post => post.SharePost)
                        .ThenInclude(sharePost => sharePost!.Comments)
                .OrderBy(feed => feed.Score)
                .ThenByDescending(feed => feed.CreatedAt);

            var feeds = await PagedList<UserFeed>.CreateAsync(query, page, pageSize, cancellationToken);

            if (feeds.Items.Count == 0 && isRefresh)
            {
                var fallbackPosts = await _context.Posts
                    .AsNoTracking()
                    .Include(post => post.Author)
                    .Include(post => post.Group)
                    .Include(post => post.Media)
                    .Include(post => post.Reactions)
                    .Include(post => post.Comments)
                    .Include(post => post.SharePost)
                        .ThenInclude(sharePost => sharePost!.Author)
                    .Include(post => post.SharePost)
                        .ThenInclude(sharePost => sharePost!.Group)
                    .Include(post => post.SharePost)
                        .ThenInclude(sharePost => sharePost!.Media)
                    .Include(post => post.SharePost)
                        .ThenInclude(sharePost => sharePost!.Reactions)
                    .Include(post => post.SharePost)
                        .ThenInclude(sharePost => sharePost!.Comments)
                    .Where(post => !post.IsHiddenFromGroup)
                    .OrderBy(post => post.Id)
                    .Take(20)
                    .ToListAsync(cancellationToken);

                var fallbackPostIds = fallbackPosts.Select(p => p.Id).ToList();
                var fallbackReactions = await _context.PostReactions
                    .Where(reaction => reaction.UserId == userId && fallbackPostIds.Contains(reaction.PostId))
                    .ToListAsync(cancellationToken);

                var fallbackReactionMap = fallbackReactions
                    .ToDictionary(reaction => reaction.PostId, reaction => (ReactionType?)reaction.ReactionType);

                var fallbackItems = fallbackPosts.Select(p => new FeedPostDto(
                    0, // ID is 0 for fallback
                    1.0f,
                    Domain.Enums.UserFeedType.Public,
                    false,
                    p.CreatedAt,
                    MapPost(p, fallbackReactionMap.TryGetValue(p.Id, out var reaction) ? reaction : null)
                )).ToList();

                return new PagedList<FeedPostDto>(fallbackItems, 1, 20, fallbackItems.Count);
            }

            var postIds = feeds.Items.Select(feed => feed.PostId).ToList();
            var postReactions = await _context.PostReactions
                .Where(reaction => reaction.UserId == userId && postIds.Contains(reaction.PostId))
                .ToListAsync(cancellationToken);

            var reactionMap = postReactions
                .ToDictionary(reaction => reaction.PostId, reaction => (ReactionType?)reaction.ReactionType);

            var items = feeds.Items.Select(feed => MapFeed(feed, reactionMap.TryGetValue(feed.PostId, out var reaction) ? reaction : null)).ToList();

            return new PagedList<FeedPostDto>(items, feeds.PageNumber, feeds.PageSize, feeds.TotalCount);
        }

        private static FeedPostDto MapFeed(UserFeed feed, ReactionType? userReaction)
        {
            return new FeedPostDto(
                feed.Id,
                feed.Score,
                feed.FeedType,
                feed.IsSeen,
                feed.CreatedAt,
                MapPost(feed.Post, userReaction));
        }

        private static PostDto MapPost(Post post, ReactionType? userReaction)
        {
            return new PostDto(
                post.Id,
                post.AuthorId,
                post.Author != null ? post.Author.FirstName + " " + post.Author.LastName : "Người dùng",
                post.Author != null ? post.Author.AvatarUrl : null,
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
                post.Reactions
                    .GroupBy(reaction => reaction.ReactionType)
                    .Select(group => new ReactionCountDto(group.Key, group.Count()))
                    .ToList(),
                post.Comments.Count,
                post.Group == null
                    ? null
                    : new GroupDto(
                        post.Group.Id,
                        post.Group.OwnerUserId,
                        post.Group.Name,
                        post.Group.Description,
                        post.Group.PrivacyType,
                        post.Group.CoverPhotoUrl),
                post.SharePost == null
                    ? null
                    : new PostDto(
                        post.SharePost.Id,
                        post.SharePost.AuthorId,
                        post.SharePost.Author != null ? post.SharePost.Author.FirstName + " " + post.SharePost.Author.LastName : "Người dùng",
                        post.SharePost.Author != null ? post.SharePost.Author.AvatarUrl : null,
                        post.SharePost.GroupId,
                        post.SharePost.Content,
                        post.SharePost.Visibility,
                        post.SharePost.SharePostId,
                        post.SharePost.LocationTag,
                        post.SharePost.FeelingActivity,
                        post.SharePost.CreatedAt,
                        post.SharePost.UpdatedAt,
                        post.SharePost.DeletedAt,
                        post.SharePost.Media.Select(m => new PostMediaDto(
                            m.Id,
                            m.MediaType,
                            m.MediaUrl,
                            m.ThumbnailUrl,
                            m.Metadata,
                            m.UploadedAt
                        )).ToList(),
                        post.SharePost.Reactions
                            .GroupBy(reaction => reaction.ReactionType)
                            .Select(group => new ReactionCountDto(group.Key, group.Count()))
                            .ToList(),
                        post.SharePost.Comments.Count,
                        post.SharePost.Group == null
                            ? null
                            : new GroupDto(
                                post.SharePost.Group.Id,
                                post.SharePost.Group.OwnerUserId,
                                post.SharePost.Group.Name,
                                post.SharePost.Group.Description,
                                post.SharePost.Group.PrivacyType,
                                post.SharePost.Group.CoverPhotoUrl),
                        null,   // SharePost
                        null,   // UserReaction
                        post.SharePost.IsHiddenFromGroup,
                        post.SharePost.HiddenAt,
                        post.SharePost.HideReason,
                        post.SharePost.ApprovalStatus,
                        post.SharePost.ApprovalStatus == PostApprovalStatus.Pending,
                        post.SharePost.IsAnonymous),
                userReaction,
                post.IsHiddenFromGroup,
                post.HiddenAt,
                post.HideReason,
                post.ApprovalStatus,
                post.ApprovalStatus == PostApprovalStatus.Pending,
                post.IsAnonymous
            );
        }

        public async Task<int> MarkAsSeenAsync(
            Guid userId,
            List<long> feedIds,
            CancellationToken cancellationToken = default)
        {
            if (feedIds == null || feedIds.Count == 0)
            {
                return 0;
            }

            var feedItems = await _context.UserFeeds
                .Where(feed => feed.UserId == userId && feedIds.Contains(feed.Id) && !feed.IsSeen)
                .ToListAsync(cancellationToken);

            foreach (var feedItem in feedItems)
            {
                feedItem.MarkAsSeen();
            }

            if (feedItems.Count == 0)
            {
                return 0;
            }

            await _context.SaveChangesAsync(cancellationToken);

            return feedItems.Count;
        }
    }
}
