using Application.Abstractions.Repositories;
using Application.DTOs.Stories;
using Application.Shared;
using Domain.Entities;
using Infrastructure.Persistence.Contexts;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories;

public sealed class StoryRepository : IStoryRepository
{
    private readonly AppDbContext _context;

    public StoryRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Story?> GetByIdAsync(long id, CancellationToken cancellationToken = default)
    {
        return await _context.Stories
            .Include(s => s.User)
            .Include(s => s.SeenByUsers)
            .Include(s => s.Reactions)
            .FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
    }

    public async Task<Story?> GetByIdWithSeenAsync(long id, Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Stories
            .Include(s => s.User)
            .Include(s => s.SeenByUsers.Where(ss => ss.UserId == userId))
            .Include(s => s.Reactions.Where(r => r.UserId == userId))
            .FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
    }

    public async Task<IEnumerable<Story>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Stories
            .AsNoTracking()
            .Include(s => s.User)
            .Include(s => s.SeenByUsers)
            .Include(s => s.Reactions)
            .Where(s => s.UserId == userId && s.ExpiresAt > DateTime.UtcNow)
            .OrderByDescending(s => s.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Story>> GetActiveByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Stories
            .AsNoTracking()
            .Where(s => s.UserId == userId && s.ExpiresAt > DateTime.UtcNow)
            .OrderByDescending(s => s.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<List<Story>> GetOwnActiveStoriesAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Stories
            .AsNoTracking()
            .Include(s => s.User)
            .Include(s => s.SeenByUsers)
            .Include(s => s.Reactions)
            .Where(s => s.UserId == userId && s.ExpiresAt > DateTime.UtcNow)
            .OrderByDescending(s => s.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<StorySeen?> GetStorySeenAsync(long storyId, Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.StorySeens
            .FirstOrDefaultAsync(ss => ss.StoryId == storyId && ss.UserId == userId, cancellationToken);
    }

    public async Task<StoryReaction?> GetReactionAsync(long storyId, Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.StoryReactions
            .FirstOrDefaultAsync(r => r.StoryId == storyId && r.UserId == userId, cancellationToken);
    }

    public async Task<IEnumerable<Guid>> GetFriendIdsAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var friendIds = await _context.Friendships
            .AsNoTracking()
            .Where(f => f.User1Id == userId || f.User2Id == userId)
            .Select(f => f.User1Id == userId ? f.User2Id : f.User1Id)
            .ToListAsync(cancellationToken);

        return friendIds;
    }

    public async Task<PagedList<StoryTimelineUserPageItem>> GetTimelineUsersPagedAsync(
        Guid userId,
        int page,
        int pageSize,
        CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;

        var relatedUserIds = await _context.Friendships
            .AsNoTracking()
            .Where(f => f.User1Id == userId || f.User2Id == userId)
            .Select(f => f.User1Id == userId ? f.User2Id : f.User1Id)
            .Union(
                _context.Followings
                    .AsNoTracking()
                    .Where(f => f.FollowerId == userId)
                    .Select(f => f.FolloweeId))
            .ToListAsync(cancellationToken);

        var groupedUsers = await _context.Stories
            .AsNoTracking()
            .Where(s =>
                s.ExpiresAt > now &&
                relatedUserIds.Contains(s.UserId))
            .GroupBy(s => s.UserId)
            .Select(g => new
            {
                UserId = g.Key,
                HasUnseenStories = g.Any(story =>
                    !_context.StorySeens.Any(ss =>
                        ss.StoryId == story.Id &&
                        ss.UserId == userId))
            })
            .ToListAsync(cancellationToken);

        var ordered = groupedUsers
            .OrderByDescending(x => x.HasUnseenStories)
            .Select(x => new StoryTimelineUserPageItem(
                x.UserId,
                x.HasUnseenStories))
            .ToList();

        return new PagedList<StoryTimelineUserPageItem>(
            ordered,
            page,
            pageSize,
            ordered.Count);
    }

    public async Task<List<Story>> GetActiveStoriesByUserIdsAsync(IEnumerable<Guid> userIds, CancellationToken cancellationToken = default)
    {
        var userIdList = userIds.Distinct().ToList();

        if (userIdList.Count == 0)
        {
            return new List<Story>();
        }

        return await _context.Stories
            .AsNoTracking()
            .Include(s => s.User)
            .Include(s => s.SeenByUsers)
            .Include(s => s.Reactions)
            .Where(s => userIdList.Contains(s.UserId) && s.ExpiresAt > DateTime.UtcNow)
            .OrderBy(s => s.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public void Add(Story story)
    {
        _context.Stories.Add(story);
    }

    public void AddStorySeen(StorySeen storySeen)
    {
        _context.StorySeens.Add(storySeen);
    }

    public void AddReaction(StoryReaction reaction)
    {
        _context.StoryReactions.Add(reaction);
    }

    public void RemoveReaction(StoryReaction reaction)
    {
        _context.StoryReactions.Remove(reaction);
    }

    public void Delete(Story story)
    {
        _context.Stories.Remove(story);
    }
}
