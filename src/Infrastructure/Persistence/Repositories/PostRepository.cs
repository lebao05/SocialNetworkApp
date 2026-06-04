using Application.Abstractions.Repositories;
using Application.Shared;
using Domain.Entities;
using Domain.Enums;
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
                .Include(post => post.Author)
                .Include(post => post.Group)
                .Include(post => post.SharePost)
                    .ThenInclude(sharedPost => sharedPost!.Group)
                .Include(post => post.SharePost)
                    .ThenInclude(sharedPost => sharedPost!.Author)
                .Include(post => post.SharePost)
                    .ThenInclude(sharedPost => sharedPost!.Media)
                .Include(post => post.SharePost)
                    .ThenInclude(sharedPost => sharedPost!.Reactions)
                .Include(post => post.SharePost)
                    .ThenInclude(sharedPost => sharedPost!.Comments)
                .Include(post => post.Media)
                .Include(post => post.Reactions)
                .Include(post => post.Comments)
                .FirstOrDefaultAsync(post => post.Id == id, cancellationToken);
        }

        public async Task<IEnumerable<Post>> GetByGroupIdAsync(long groupId, Guid? authorId = null, CancellationToken cancellationToken = default)
        {
            var query = _context.Posts
                .AsNoTracking()
                .Include(post => post.Author)
                .Include(post => post.Group)
                .Include(post => post.SharePost)
                    .ThenInclude(sharedPost => sharedPost!.Group)
                .Include(post => post.SharePost)
                    .ThenInclude(sharedPost => sharedPost!.Author)
                .Include(post => post.SharePost)
                    .ThenInclude(sharedPost => sharedPost!.Media)
                .Include(post => post.SharePost)
                    .ThenInclude(sharedPost => sharedPost!.Reactions)
                .Include(post => post.SharePost)
                    .ThenInclude(sharedPost => sharedPost!.Comments)
                .Include(post => post.Media)
                .Include(post => post.Reactions)
                .Include(post => post.Comments)
                .Where(post => post.GroupId == groupId && !post.IsHiddenFromGroup);

            if (authorId.HasValue)
            {
                query = query.Where(post => post.AuthorId == authorId.Value);
            }

            return await query
                .OrderByDescending(post => post.CreatedAt)
                .ToListAsync(cancellationToken);
        }

        public async Task<PagedList<Post>> GetByGroupIdPagedAsync(long groupId, int page, int pageSize, Guid? authorId = null, CancellationToken cancellationToken = default)
        {
            var query = _context.Posts
                .AsNoTracking()
                .Include(post => post.Author)
                .Include(post => post.Group)
                .Include(post => post.SharePost)
                    .ThenInclude(sharedPost => sharedPost!.Group)
                .Include(post => post.SharePost)
                    .ThenInclude(sharedPost => sharedPost!.Author)
                .Include(post => post.SharePost)
                    .ThenInclude(sharedPost => sharedPost!.Media)
                .Include(post => post.SharePost)
                    .ThenInclude(sharedPost => sharedPost!.Reactions)
                .Include(post => post.SharePost)
                    .ThenInclude(sharedPost => sharedPost!.Comments)
                .Include(post => post.Media)
                .Include(post => post.Reactions)
                .Include(post => post.Comments)
                .Where(post => post.GroupId == groupId && !post.IsHiddenFromGroup && post.ApprovalStatus == PostApprovalStatus.Approved);

            if (authorId.HasValue)
            {
                query = query.Where(post => post.AuthorId == authorId.Value);
            }

            query = query.OrderByDescending(post => post.CreatedAt);

            return await PagedList<Post>.CreateAsync(query, page, pageSize, cancellationToken);
        }

        public async Task<PagedList<Post>> GetByGroupIdPagedAsync(long groupId, int page, int pageSize, PostApprovalStatus approvalStatus, CancellationToken cancellationToken = default)
        {
            var query = _context.Posts
                .AsNoTracking()
                .Include(post => post.Author)
                .Include(post => post.Group)
                .Include(post => post.SharePost)
                    .ThenInclude(sharedPost => sharedPost!.Group)
                .Include(post => post.SharePost)
                    .ThenInclude(sharedPost => sharedPost!.Author)
                .Include(post => post.SharePost)
                    .ThenInclude(sharedPost => sharedPost!.Media)
                .Include(post => post.SharePost)
                    .ThenInclude(sharedPost => sharedPost!.Reactions)
                .Include(post => post.SharePost)
                    .ThenInclude(sharedPost => sharedPost!.Comments)
                .Include(post => post.Media)
                .Include(post => post.Reactions)
                .Include(post => post.Comments)
                .Where(post => post.GroupId == groupId && post.ApprovalStatus == approvalStatus);

            query = query.OrderByDescending(post => post.CreatedAt);

            return await PagedList<Post>.CreateAsync(query, page, pageSize, cancellationToken);
        }

        public async Task<IEnumerable<Post>> GetByAuthorIdAsync(Guid authorId, CancellationToken cancellationToken = default)
        {
            return await _context.Posts
                .AsNoTracking()
                .Include(post => post.Author)
                .Include(post => post.Group)
                .Include(post => post.SharePost)
                    .ThenInclude(sharedPost => sharedPost!.Group)
                .Include(post => post.SharePost)
                    .ThenInclude(sharedPost => sharedPost!.Author)
                .Include(post => post.SharePost)
                    .ThenInclude(sharedPost => sharedPost!.Media)
                .Include(post => post.SharePost)
                    .ThenInclude(sharedPost => sharedPost!.Reactions)
                .Include(post => post.SharePost)
                    .ThenInclude(sharedPost => sharedPost!.Comments)
                .Include(post => post.Media)
                .Include(post => post.Reactions)
                .Include(post => post.Comments)
                .Where(post => post.AuthorId == authorId)
                .OrderByDescending(post => post.CreatedAt)
                .ToListAsync(cancellationToken);
        }

        public async Task<PagedList<Post>> GetByAuthorIdPagedAsync(Guid authorId, int page, int pageSize, CancellationToken cancellationToken = default)
        {
            var query = _context.Posts
                .AsNoTracking()
                .Include(post => post.Author)
                .Include(post => post.Group)
                .Include(post => post.SharePost)
                    .ThenInclude(sharedPost => sharedPost!.Group)
                .Include(post => post.SharePost)
                    .ThenInclude(sharedPost => sharedPost!.Author)
                .Include(post => post.SharePost)
                    .ThenInclude(sharedPost => sharedPost!.Media)
                .Include(post => post.SharePost)
                    .ThenInclude(sharedPost => sharedPost!.Reactions)
                .Include(post => post.SharePost)
                    .ThenInclude(sharedPost => sharedPost!.Comments)
                .Include(post => post.Media)
                .Include(post => post.Reactions)
                .Include(post => post.Comments)
                .Where(post => post.AuthorId == authorId)
                .OrderByDescending(post => post.CreatedAt);

            return await PagedList<Post>.CreateAsync(query, page, pageSize, cancellationToken);
        }

        public async Task<PagedList<PostMedia>> GetMediasByGroupIdPagedAsync(long groupId, int page, int pageSize, string? mediaType = null, CancellationToken cancellationToken = default)
        {
            var query = _context.PostMedias
                .AsNoTracking()
                .Include(media => media.Post)
                .Where(media => media.Post.GroupId == groupId && !media.Post.IsHiddenFromGroup);

            if (!string.IsNullOrWhiteSpace(mediaType))
            {
                query = query.Where(media => media.MediaType == mediaType);
            }

            query = query.OrderByDescending(media => media.UploadedAt);

            return await PagedList<PostMedia>.CreateAsync(query, page, pageSize, cancellationToken);
        }

        public async Task<PagedList<PostMedia>> GetMediasByAuthorIdPagedAsync(Guid authorId, int page, int pageSize, string? mediaType = null, CancellationToken cancellationToken = default)
        {
            var query = _context.PostMedias
                .AsNoTracking()
                .Include(media => media.Post)
                .Where(media => media.Post.AuthorId == authorId && !media.Post.IsHiddenFromGroup);

            if (!string.IsNullOrWhiteSpace(mediaType))
            {
                query = query.Where(media => media.MediaType == mediaType);
            }

            query = query.OrderByDescending(media => media.UploadedAt);

            return await PagedList<PostMedia>.CreateAsync(query, page, pageSize, cancellationToken);
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

        public async Task<PostReaction?> GetPostReactionAsync(long postId, Guid userId, CancellationToken cancellationToken = default)
        {
            return await _context.PostReactions
                .FirstOrDefaultAsync(reaction => reaction.PostId == postId && reaction.UserId == userId, cancellationToken);
        }

        public async Task<IReadOnlyCollection<PostReaction>> GetPostReactionsAsync(IEnumerable<long> postIds, Guid userId, CancellationToken cancellationToken = default)
        {
            return await _context.PostReactions
                .Where(reaction => reaction.UserId == userId && postIds.Contains(reaction.PostId))
                .ToListAsync(cancellationToken);
        }

        public void AddReaction(PostReaction reaction)
        {
            _context.PostReactions.Add(reaction);
        }

        public void RemoveReaction(PostReaction reaction)
        {
            _context.PostReactions.Remove(reaction);
        }

        public async Task<SavedPost?> GetSavedPostAsync(long postId, Guid userId, CancellationToken cancellationToken = default)
        {
            return await _context.SavedPosts
                .FirstOrDefaultAsync(saved => saved.PostId == postId && saved.UserId == userId, cancellationToken);
        }

        public void AddSavedPost(SavedPost savedPost)
        {
            _context.SavedPosts.Add(savedPost);
        }

        public void RemoveSavedPost(SavedPost savedPost)
        {
            _context.SavedPosts.Remove(savedPost);
        }

        public async Task<PostComment?> GetCommentByIdAsync(long commentId, CancellationToken cancellationToken = default)
        {
            return await _context.PostComments
                .FirstOrDefaultAsync(comment => comment.Id == commentId, cancellationToken);
        }

        public async Task<PagedList<PostComment>> GetCommentsPagedAsync(long postId, long? parentCommentId, int page, int pageSize, CancellationToken cancellationToken = default)
        {
            var query = _context.PostComments
                .AsNoTracking()
                .AsSplitQuery()
                .Include(comment => comment.User)
                .Include(comment => comment.RepliedUser)
                .Include(comment => comment.Reactions)
                .Where(comment => comment.PostId == postId && comment.ParentCommentId == parentCommentId)
                .OrderBy(comment => comment.CreatedAt);

            return await PagedList<PostComment>.CreateAsync(query, page, pageSize, cancellationToken);
        }

        public async Task<CommentReaction?> GetCommentReactionAsync(long commentId, Guid userId, CancellationToken cancellationToken = default)
        {
            return await _context.CommentReactions
                .FirstOrDefaultAsync(reaction => reaction.CommentId == commentId && reaction.UserId == userId, cancellationToken);
        }

        public void AddCommentReaction(CommentReaction reaction)
        {
            _context.CommentReactions.Add(reaction);
        }

        public void RemoveCommentReaction(CommentReaction reaction)
        {
            _context.CommentReactions.Remove(reaction);
        }

        public async Task<Dictionary<long, int>> GetReplyCountsAsync(IEnumerable<long> commentIds, CancellationToken cancellationToken = default)
        {
            var idList = commentIds.ToList();
            if (idList.Count == 0)
                return new Dictionary<long, int>();

            return await _context.PostComments
                .Where(c => c.ParentCommentId.HasValue && idList.Contains(c.ParentCommentId.Value))
                .GroupBy(c => c.ParentCommentId!.Value)
                .Select(g => new { CommentId = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.CommentId, x => x.Count, cancellationToken);
        }

        public void AddComment(PostComment comment)
        {
            _context.PostComments.Add(comment);
        }

        public async Task<int> GetCommentCountByPostIdsAsync(IEnumerable<long> postIds, CancellationToken cancellationToken = default)
        {
            var idList = postIds.ToList();
            if (idList.Count == 0)
                return 0;

            return await _context.PostComments
                .CountAsync(c => idList.Contains(c.PostId), cancellationToken);
        }

        public async Task<int> GetReactionCountByPostIdsAsync(IEnumerable<long> postIds, CancellationToken cancellationToken = default)
        {
            var idList = postIds.ToList();
            if (idList.Count == 0)
                return 0;

            return await _context.PostReactions
                .CountAsync(r => idList.Contains(r.PostId), cancellationToken);
        }
    }
}
