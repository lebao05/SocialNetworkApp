using Application.Abstractions.Repositories;
using Application.DTOs.Feeds;
using Application.DTOs.Groups;
using Application.DTOs.Posts;
using Application.Shared;
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
            CancellationToken cancellationToken = default)
        {
            var query = _context.UserFeeds
                .AsNoTracking()
                .Where(feed => feed.UserId == userId)
                .OrderByDescending(feed => feed.Score)
                .ThenByDescending(feed => feed.CreatedAt)
                .Select(feed => new FeedPostDto(
                    feed.Id,
                    feed.Score,
                    feed.FeedType,
                    feed.IsSeen,
                    feed.CreatedAt,
                    new PostDto(
                        feed.Post.Id,
                        feed.Post.AuthorId,
                        feed.Post.GroupId,
                        feed.Post.Content,
                        feed.Post.Visibility,
                        feed.Post.SharePostId,
                        feed.Post.LocationTag,
                        feed.Post.FeelingActivity,
                        feed.Post.CreatedAt,
                        feed.Post.UpdatedAt,
                        feed.Post.DeletedAt,
                        feed.Post.Group == null
                            ? null
                            : new GroupDto(
                                feed.Post.Group.Id,
                                feed.Post.Group.OwnerUserId,
                                feed.Post.Group.Name,
                                feed.Post.Group.Description,
                                feed.Post.Group.PrivacyType,
                                feed.Post.Group.CoverPhotoUrl),
                        feed.Post.SharePost == null
                            ? null
                            : new PostDto(
                                feed.Post.SharePost.Id,
                                feed.Post.SharePost.AuthorId,
                                feed.Post.SharePost.GroupId,
                                feed.Post.SharePost.Content,
                                feed.Post.SharePost.Visibility,
                                feed.Post.SharePost.SharePostId,
                                feed.Post.SharePost.LocationTag,
                                feed.Post.SharePost.FeelingActivity,
                                feed.Post.SharePost.CreatedAt,
                                feed.Post.SharePost.UpdatedAt,
                                feed.Post.SharePost.DeletedAt,
                                feed.Post.SharePost.Group == null
                                    ? null
                                    : new GroupDto(
                                        feed.Post.SharePost.Group.Id,
                                        feed.Post.SharePost.Group.OwnerUserId,
                                        feed.Post.SharePost.Group.Name,
                                        feed.Post.SharePost.Group.Description,
                                        feed.Post.SharePost.Group.PrivacyType,
                                        feed.Post.SharePost.Group.CoverPhotoUrl),
                                null))));

            return await PagedList<FeedPostDto>.CreateAsync(query, page, pageSize, cancellationToken);
        }

        public async Task<int> MarkLatestAsSeenAsync(
            Guid userId,
            int count,
            CancellationToken cancellationToken = default)
        {
            var latestFeedItems = await _context.UserFeeds
                .Where(feed => feed.UserId == userId && !feed.IsSeen)
                .OrderByDescending(feed => feed.CreatedAt)
                .Take(count)
                .ToListAsync(cancellationToken);

            foreach (var feedItem in latestFeedItems)
            {
                feedItem.MarkAsSeen();
            }

            if (latestFeedItems.Count == 0)
            {
                return 0;
            }

            await _context.SaveChangesAsync(cancellationToken);

            return latestFeedItems.Count;
        }
    }
}
