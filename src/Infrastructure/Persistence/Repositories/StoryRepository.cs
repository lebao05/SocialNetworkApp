using Application.Abstractions.Repositories;
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
