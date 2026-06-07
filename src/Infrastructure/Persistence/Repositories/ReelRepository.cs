using Application.Abstractions.Repositories;
using Application.Shared;
using Domain.Entities;
using Infrastructure.Persistence.Contexts;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories
{
    public sealed class ReelRepository : IReelRepository
    {
        private readonly AppDbContext _context;

        public ReelRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Reel?> GetByIdAsync(long id, CancellationToken cancellationToken = default)
        {
            return await _context.Reels
                .Include(reel => reel.Author)
                .Include(reel => reel.Comments)
                .Include(reel => reel.Reactions)
                .FirstOrDefaultAsync(reel => reel.Id == id, cancellationToken);
        }

        public async Task<IEnumerable<Reel>> GetByAuthorIdAsync(Guid authorId, CancellationToken cancellationToken = default)
        {
            return await _context.Reels
                .AsNoTracking()
                .Include(reel => reel.Author)
                .Include(reel => reel.Comments)
                .Include(reel => reel.Reactions)
                .Where(reel => reel.AuthorId == authorId)
                .OrderByDescending(reel => reel.CreatedAt)
                .ToListAsync(cancellationToken);
        }

        public async Task<IEnumerable<Reel>> GetRecentReelsAsync(DateTime since, CancellationToken cancellationToken = default)
        {
            return await _context.Reels
                .AsNoTracking()
                .Include(reel => reel.Author)
                .Include(reel => reel.Comments)
                .Include(reel => reel.Reactions)
                .Where(reel => reel.CreatedAt >= since)
                .OrderByDescending(reel => reel.CreatedAt)
                .ToListAsync(cancellationToken);
        }

        public async Task<StorySeen?> GetStorySeenAsync(long storyId, Guid userId, CancellationToken cancellationToken = default)
        {
            return await _context.StorySeens
                .FirstOrDefaultAsync(storySeen => storySeen.StoryId == storyId && storySeen.UserId == userId, cancellationToken);
        }

        public async Task<ReelReaction?> GetReactionAsync(long reelId, Guid userId, CancellationToken cancellationToken = default)
        {
            return await _context.ReelReactions
                .FirstOrDefaultAsync(r => r.ReelId == reelId && r.UserId == userId, cancellationToken);
        }

        public async Task<ReelComment?> GetCommentByIdAsync(long commentId, CancellationToken cancellationToken = default)
        {
            return await _context.ReelComments
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.Id == commentId, cancellationToken);
        }

        public async Task<PagedList<ReelComment>> GetCommentsPagedAsync(long reelId, long? parentCommentId, int page, int pageSize, CancellationToken cancellationToken = default)
        {
            var query = _context.ReelComments
                .AsNoTracking()
                .AsSplitQuery()
                .Include(c => c.User)
                .Include(c => c.RepliedUser)
                .Where(c => c.ReelId == reelId && c.ParentCommentId == parentCommentId)
                .OrderBy(c => c.CreatedAt);

            return await PagedList<ReelComment>.CreateAsync(query, page, pageSize, cancellationToken);
        }

        public async Task<Dictionary<long, int>> GetReplyCountsAsync(IEnumerable<long> commentIds, CancellationToken cancellationToken = default)
        {
            var idList = commentIds.ToList();
            if (idList.Count == 0)
                return new Dictionary<long, int>();

            return await _context.ReelComments
                .Where(c => c.ParentCommentId.HasValue && idList.Contains(c.ParentCommentId.Value))
                .GroupBy(c => c.ParentCommentId!.Value)
                .Select(g => new { CommentId = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.CommentId, x => x.Count, cancellationToken);
        }

        public void Add(Reel reel)
        {
            _context.Reels.Add(reel);
        }

        public void AddReaction(ReelReaction reaction)
        {
            _context.ReelReactions.Add(reaction);
        }

        public void RemoveReaction(ReelReaction reaction)
        {
            _context.ReelReactions.Remove(reaction);
        }

        public void AddStorySeen(StorySeen storySeen)
        {
            _context.StorySeens.Add(storySeen);
        }

        public void Update(Reel reel)
        {
            _context.Reels.Update(reel);
        }

        public void Delete(Reel reel)
        {
            _context.Reels.Remove(reel);
        }
    }
}
