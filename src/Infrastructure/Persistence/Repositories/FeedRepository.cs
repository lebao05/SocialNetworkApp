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
            // 1. Build the base query over the RAW database entities (UserFeed)
            var baseQuery = _context.UserFeeds
                .AsNoTracking()
                .AsSplitQuery() // Resolves performance warning regarding multiple collection includes
                .Where(f => f.SourceUserId == userId)
                .Where(f => !f.Post.IsHiddenFromGroup && f.Post.ApprovalStatus == PostApprovalStatus.Approved)
                // ====== VISIBILITY SECURITY ======
                .Where(f =>
                    f.Post.Visibility == PostVisibility.Public
                    || (f.Post.Visibility == PostVisibility.Private
                        && f.Post.AuthorId == userId)
                    || (f.Post.Visibility == PostVisibility.Friends
                        && (f.Post.AuthorId == userId
                            || _context.Friendships.Any(fr => (fr.User1Id == userId && fr.User2Id == f.Post.AuthorId) || (fr.User2Id == userId && fr.User1Id == f.Post.AuthorId))))
                    || (f.Post.Visibility == PostVisibility.Group
                        && f.Post.GroupId != null
                        && ((f.Post.Group != null
                                && f.Post.Group.PrivacyType == GroupPrivacyType.Public)
                            || _context.GroupMembers.Any(gm =>
                                gm.GroupId == f.Post.GroupId
                                && gm.UserId == userId)))
                );

            // 2. Filter out items that have already been seen
            var unseenQuery = baseQuery.Where(f => !f.IsSeen);
            var projectedUnseenQuery = ApplySelect(unseenQuery, userId);

            var feeds = await PagedList<FeedPostDto>.CreateAsync(
                projectedUnseenQuery,
                page,
                pageSize,
                cancellationToken);

            // 3. Fallback logic: If refreshing or nothing unseen is found, get the historical feed ordered by date
            if (feeds.Items.Count == 0 && isRefresh)
            {
                var fallbackQuery = baseQuery.OrderByDescending(f => f.CreatedAt);
                var projectedFallbackQuery = ApplySelect(fallbackQuery, userId);

                feeds = await PagedList<FeedPostDto>.CreateAsync(
                    projectedFallbackQuery,
                    page,
                    pageSize,
                    cancellationToken);
            }

            return feeds;
        }

        /// <summary>
        /// Projects a UserFeed query into FeedPostDto. 
        /// Operates directly on IQueryable to preserve database translation.
        /// </summary>
        private IQueryable<FeedPostDto> ApplySelect(IQueryable<UserFeed> query, Guid userId)
        {
            return query.Select(feed => new FeedPostDto(
                feed.Id,
                feed.Score,
                feed.FeedType,
                feed.IsSeen,
                feed.CreatedAt,
                new PostDto(
                    feed.Post.Id,
                    feed.Post.AuthorId,
                    feed.Post.Author.FirstName + " " + feed.Post.Author.LastName,
                    feed.Post.Author.AvatarUrl,
                    feed.Post.GroupId,
                    feed.Post.Content,
                    feed.Post.Visibility,
                    feed.Post.SharePostId,
                    feed.Post.LocationTag,
                    feed.Post.FeelingActivity,
                    feed.Post.CreatedAt,
                    feed.Post.UpdatedAt,
                    feed.Post.DeletedAt,

                    feed.Post.Media
                        .Select(m => new PostMediaDto(
                            m.Id,
                            m.MediaType,
                            m.MediaUrl,
                            m.ThumbnailUrl,
                            m.Metadata,
                            m.UploadedAt))
                        .ToList(),

                    feed.Post.Reactions
                        .GroupBy(r => r.ReactionType)
                        .Select(g => new ReactionCountDto(g.Key, g.Count()))
                        .ToList(),

                    feed.Post.Comments.Count(c => c.DeletedAt == null),

                    feed.Post.Group == null
                        ? null
                        : new GroupDto(
                            feed.Post.Group.Id,
                            feed.Post.Group.OwnerUserId,
                            feed.Post.Group.Name,
                            feed.Post.Group.Description,
                            feed.Post.Group.PrivacyType,
                            feed.Post.Group.CoverPhotoUrl),

                    (feed.Post.SharePost == null ||
                     !(feed.Post.SharePost.Visibility == PostVisibility.Public
                       || (feed.Post.SharePost.Visibility == PostVisibility.Private
                           && feed.Post.SharePost.AuthorId == userId)
                       || (feed.Post.SharePost.Visibility == PostVisibility.Friends
                           && (feed.Post.SharePost.AuthorId == userId
                               || _context.Friendships.Any(fr => (fr.User1Id == userId && fr.User2Id == feed.Post.SharePost.AuthorId) || (fr.User2Id == userId && fr.User1Id == feed.Post.SharePost.AuthorId))))
                       || (feed.Post.SharePost.Visibility == PostVisibility.Group
                           && feed.Post.SharePost.GroupId != null
                           && ((feed.Post.SharePost.Group != null && feed.Post.SharePost.Group.PrivacyType == GroupPrivacyType.Public)
                               || _context.GroupMembers.Any(gm => gm.GroupId == feed.Post.SharePost.GroupId && gm.UserId == userId)))))
                        ? null // Returns null if SharePost doesn't exist OR visibility checks fail
                        : new PostDto(
                            feed.Post.SharePost.Id,
                            feed.Post.SharePost.AuthorId,
                            feed.Post.SharePost.Author.FirstName + " " + feed.Post.SharePost.Author.LastName,
                            feed.Post.SharePost.Author.AvatarUrl,
                            feed.Post.SharePost.GroupId,
                            feed.Post.SharePost.Content,
                            feed.Post.SharePost.Visibility,
                            feed.Post.SharePost.SharePostId,
                            feed.Post.SharePost.LocationTag,
                            feed.Post.SharePost.FeelingActivity,
                            feed.Post.SharePost.CreatedAt,
                            feed.Post.SharePost.UpdatedAt,
                            feed.Post.SharePost.DeletedAt,

                            feed.Post.SharePost.Media
                                .Select(m => new PostMediaDto(
                                    m.Id,
                                    m.MediaType,
                                    m.MediaUrl,
                                    m.ThumbnailUrl,
                                    m.Metadata,
                                    m.UploadedAt))
                                .ToList(),

                            feed.Post.SharePost.Reactions
                                .GroupBy(r => r.ReactionType)
                                .Select(g => new ReactionCountDto(g.Key, g.Count()))
                                .ToList(),

                            feed.Post.SharePost.Comments.Count(c => c.DeletedAt == null),

                            feed.Post.SharePost.Group == null
                                ? null
                                : new GroupDto(
                                    feed.Post.SharePost.Group.Id,
                                    feed.Post.SharePost.Group.OwnerUserId,
                                    feed.Post.SharePost.Group.Name,
                                    feed.Post.SharePost.Group.Description,
                                    feed.Post.SharePost.Group.PrivacyType,
                                    feed.Post.SharePost.Group.CoverPhotoUrl),

                            null, // Stop recursive mapping

                            feed.Post.SharePost.Reactions
                                .Where(r => r.UserId == userId)
                                .Select(r => (ReactionType?)r.ReactionType)
                                .FirstOrDefault(),

                            feed.Post.SharePost.IsHiddenFromGroup,
                            feed.Post.SharePost.HiddenAt,
                            feed.Post.SharePost.HideReason,
                            feed.Post.SharePost.ApprovalStatus,
                            feed.Post.SharePost.ApprovalStatus == PostApprovalStatus.Pending,
                            feed.Post.SharePost.IsAnonymous
                        ),

                    feed.Post.Reactions
                        .Where(r => r.UserId == userId)
                        .Select(r => (ReactionType?)r.ReactionType)
                        .FirstOrDefault(),

                    feed.Post.IsHiddenFromGroup,
                    feed.Post.HiddenAt,
                    feed.Post.HideReason,
                    feed.Post.ApprovalStatus,
                    feed.Post.ApprovalStatus == PostApprovalStatus.Pending,
                    feed.Post.IsAnonymous
                )
            ));
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