using Application.Abstractions.Repositories;
using Application.Shared;
using Domain.Entities;
using Infrastructure.Persistence.Contexts;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories
{
    public sealed class PostRepository : IPostRepository
    {
        private readonly AppDbContext _context;

        public PostRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Post?> GetByIdAsync(long id, CancellationToken cancellationToken = default)
        {
            return await _context.Posts
                .Include(post => post.Group)
                .Include(post => post.SharePost)
                    .ThenInclude(sharedPost => sharedPost!.Group)
                .Include(post => post.Media)
                .FirstOrDefaultAsync(post => post.Id == id, cancellationToken);
        }

        public async Task<IEnumerable<Post>> GetByGroupIdAsync(long groupId, CancellationToken cancellationToken = default)
        {
            return await _context.Posts
                .AsNoTracking()
                .Include(post => post.Group)
                .Include(post => post.SharePost)
                    .ThenInclude(sharedPost => sharedPost!.Group)
                .Where(post => post.GroupId == groupId)
                .OrderByDescending(post => post.CreatedAt)
                .ToListAsync(cancellationToken);
        }

        public async Task<PagedList<Post>> GetByGroupIdPagedAsync(long groupId, int page, int pageSize, CancellationToken cancellationToken = default)
        {
            var query = _context.Posts
                .AsNoTracking()
                .Include(post => post.Group)
                .Include(post => post.SharePost)
                    .ThenInclude(sharedPost => sharedPost!.Group)
                .Where(post => post.GroupId == groupId)
                .OrderByDescending(post => post.CreatedAt);

            return await PagedList<Post>.CreateAsync(query, page, pageSize, cancellationToken);
        }

        public async Task<IEnumerable<Post>> GetByAuthorIdAsync(Guid authorId, CancellationToken cancellationToken = default)
        {
            return await _context.Posts
                .AsNoTracking()
                .Include(post => post.Group)
                .Include(post => post.SharePost)
                    .ThenInclude(sharedPost => sharedPost!.Group)
                .Where(post => post.AuthorId == authorId)
                .OrderByDescending(post => post.CreatedAt)
                .ToListAsync(cancellationToken);
        }

        public void Add(Post post)
        {
            _context.Posts.Add(post);
        }

        public void Update(Post post)
        {
            _context.Posts.Update(post);
        }

        public void Delete(Post post)
        {
            _context.Posts.Remove(post);
        }

        public void AddMedia(PostMedia media)
        {
            _context.PostMedias.Add(media);
        }

        public void AddTag(PostTag tag)
        {
            _context.PostTags.Add(tag);
        }
    }
}
