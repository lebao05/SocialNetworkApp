using Application.Abstractions.Repositories;
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

        public async Task<StorySeen?> GetStorySeenAsync(long storyId, Guid userId, CancellationToken cancellationToken = default)
        {
            return await _context.StorySeens
                .FirstOrDefaultAsync(storySeen => storySeen.StoryId == storyId && storySeen.UserId == userId, cancellationToken);
        }

        public void Add(Reel reel)
        {
            _context.Reels.Add(reel);
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
