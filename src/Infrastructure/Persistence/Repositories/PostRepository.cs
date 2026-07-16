using Application.Abstractions.Repositories;
using Application.DTOs.Feeds;
using Application.DTOs.Groups;
using Application.DTOs.Posts;
using Application.Shared;
using Domain.Entities;
using Domain.Enums;
using Infrastructure.Persistence.Contexts;
using Microsoft.EntityFrameworkCore;
using NpgsqlTypes;

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


        public async Task<PostDto?> GetDetailPostAsync(long id, Guid? viewerId, CancellationToken cancellationToken = default)
        {
            // 1. Start with the root post query matching the target ID
            var query = _context.Posts
                .AsNoTracking()
                .AsSplitQuery()
                .Where(p => p.Id == id && p.DeletedAt == null && p.ApprovalStatus == PostApprovalStatus.Approved
                );

            // 2. Apply the updated visibility engine (handles anonymous/null viewers safely)
            query = ApplyPostVisibility(query, viewerId);

            // 3. Project directly into PostDto using our single-source projection rules
            var projectedQuery = ApplySelect(query, viewerId);

            // 4. Return the calculated detail object or null if unauthorized/not found
            return await projectedQuery.FirstOrDefaultAsync(cancellationToken);
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

        public async Task<PagedList<SavedPost>> GetSavedPostsPagedAsync(Guid userId, int page, int pageSize, CancellationToken cancellationToken = default)
        {
            var query = _context.SavedPosts
                .AsNoTracking()
                .Include(saved => saved.Post)
                    .ThenInclude(post => post.Author)
                .Include(saved => saved.Post)
                    .ThenInclude(post => post.Group)
                .Include(saved => saved.Post)
                    .ThenInclude(post => post.SharePost)
                        .ThenInclude(sharedPost => sharedPost!.Group)
                .Include(saved => saved.Post)
                    .ThenInclude(post => post.SharePost)
                        .ThenInclude(sharedPost => sharedPost!.Author)
                .Include(saved => saved.Post)
                    .ThenInclude(post => post.SharePost)
                        .ThenInclude(sharedPost => sharedPost!.Media)
                .Include(saved => saved.Post)
                    .ThenInclude(post => post.SharePost)
                        .ThenInclude(sharedPost => sharedPost!.Reactions)
                .Include(saved => saved.Post)
                    .ThenInclude(post => post.SharePost)
                        .ThenInclude(sharedPost => sharedPost!.Comments)
                .Include(saved => saved.Post)
                    .ThenInclude(post => post.Media)
                .Include(saved => saved.Post)
                    .ThenInclude(post => post.Reactions)
                .Include(saved => saved.Post)
                    .ThenInclude(post => post.Comments)
                .Where(saved => saved.UserId == userId)
                .OrderByDescending(saved => saved.CreatedAt);

            return await PagedList<SavedPost>.CreateAsync(query, page, pageSize, cancellationToken);
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

        public async Task<Dictionary<long, int>> GetPostCountsByGroupIdsAsync(
            IEnumerable<long> groupIds,
            DateTime? fromDate = null,
            CancellationToken cancellationToken = default)
        {
            var idList = groupIds.ToList();
            if (idList.Count == 0)
                return new Dictionary<long, int>();

            var query = _context.Posts.AsNoTracking()
                .Where(p => idList.Contains(p.GroupId ?? 0) && p.GroupId != null);

            if (fromDate.HasValue)
                query = query.Where(p => p.CreatedAt >= fromDate.Value);

            return await query
                .GroupBy(p => p.GroupId!.Value)
                .Select(g => new { GroupId = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.GroupId, x => x.Count, cancellationToken);
        }

        public async Task<PagedList<PostDto>> SearchAsync(Guid userId, string? searchQuery, int page, int pageSize, CancellationToken cancellationToken = default)
        {
            // 1. Initialize root filter query
            var query = _context.Posts
                .AsNoTracking()
                .Where(post => post.DeletedAt == null && post.ApprovalStatus == PostApprovalStatus.Approved);

            // 2. Apply Full-Text Search Vector rule if query parameter exists
            if (!string.IsNullOrWhiteSpace(searchQuery))
            {
                query = query.Where(post => EF.Property<NpgsqlTsVector>(post, "SearchVector").Matches(EF.Functions.PlainToTsQuery("english", searchQuery)));
            }

            // 3. Order and apply identical visibility logic used in GetDetailPostAsync
            query = ApplyPostVisibility(query, userId);

            // 4. Project into IQueryable<PostDto> using your established projection rule method
            var projectedQuery = ApplySelect(query, userId);

            // 5. Build and return the specialized PagedList utilizing the projected query
            return await PagedList<PostDto>.CreateAsync(projectedQuery, page, pageSize, cancellationToken);
        }


        /// <summary>
        /// Applies visibility rules directly onto an IQueryable of Posts.
        /// </summary>
        private IQueryable<Post> ApplyPostVisibility(IQueryable<Post> query, Guid? viewerId)
        {
            // If viewerId is null, we treat them as an unauthenticated/guest user (can only see Public content)
            return query.Where(p =>
                p.Visibility == PostVisibility.Public
                || (viewerId != null && (
                    (p.Visibility == PostVisibility.Private 
                        && p.AuthorId == viewerId)
                    || (p.Visibility == PostVisibility.Friends 
                        && (p.AuthorId == viewerId 
                            || _context.Friendships.Any(fr => (fr.User1Id == viewerId && fr.User2Id == p.AuthorId) || (fr.User2Id == viewerId && fr.User1Id == p.AuthorId))))
                    || (p.Visibility == PostVisibility.Group 
                        && p.GroupId != null 
                        && ((p.Group != null && p.Group.PrivacyType == GroupPrivacyType.Public) 
                            || _context.GroupMembers.Any(gm => gm.GroupId == p.GroupId && gm.UserId == viewerId)))
                ))
            );
        }
    /// <summary>
    /// Projects an IQueryable of Posts into PostDto while handling the nested SharePost authorization safely.
    /// </summary>
    private IQueryable<PostDto> ApplySelect(IQueryable<Post> query, Guid? viewerId)
    {
        return query.Select(post => new PostDto(
            post.Id,
            post.AuthorId,
            post.Author.FirstName + " " + post.Author.LastName,
            post.Author.AvatarUrl,
            post.GroupId,
            post.Content,
            post.Visibility,
            post.SharePostId,
            post.LocationTag,
            post.FeelingActivity,
            post.CreatedAt,
            post.UpdatedAt,
            post.DeletedAt,

            post.Media
                .Select(m => new PostMediaDto(
                    m.Id,
                    m.MediaType,
                    m.MediaUrl,
                    m.ThumbnailUrl,
                    m.Metadata,
                    m.UploadedAt))
                .ToList(),

            post.Reactions
                .GroupBy(r => r.ReactionType)
                .Select(g => new ReactionCountDto(g.Key, g.Count()))
                .ToList(),

            post.Comments.Count(c => c.DeletedAt == null),

            post.Group == null
                ? null
                : new GroupDto(
                    post.Group.Id,
                    post.Group.OwnerUserId,
                    post.Group.Name,
                    post.Group.Description,
                    post.Group.PrivacyType,
                    post.Group.CoverPhotoUrl),

            // ====== NESTED SHAREPOST INLINE VISIBILITY CHECK ======
            (post.SharePost == null ||
            !(post.SharePost.Visibility == PostVisibility.Public
            || (viewerId != null && (
                (post.SharePost.Visibility == PostVisibility.Private 
                    && post.SharePost.AuthorId == viewerId)
                || (post.SharePost.Visibility == PostVisibility.Friends 
                    && (post.SharePost.AuthorId == viewerId 
                        || _context.Friendships.Any(fr => (fr.User1Id == viewerId && fr.User2Id == post.SharePost.AuthorId) || (fr.User2Id == viewerId && fr.User1Id == post.SharePost.AuthorId))))
                || (post.SharePost.Visibility == PostVisibility.Group 
                    && post.SharePost.GroupId != null 
                    && ((post.SharePost.Group != null && post.SharePost.Group.PrivacyType == GroupPrivacyType.Public) 
                        || _context.GroupMembers.Any(gm => gm.GroupId == post.SharePost.GroupId && gm.UserId == viewerId)))
            ))))
                ? null // If nested validation fails or entity is absent, shared block is explicitly hidden
                : new PostDto(
                    post.SharePost.Id,
                    post.SharePost.AuthorId,
                    post.SharePost.Author.FirstName + " " + post.SharePost.Author.LastName,
                    post.SharePost.Author.AvatarUrl,
                    post.SharePost.GroupId,
                    post.SharePost.Content,
                    post.SharePost.Visibility,
                    post.SharePost.SharePostId,
                    post.SharePost.LocationTag,
                    post.SharePost.FeelingActivity,
                    post.SharePost.CreatedAt,
                    post.SharePost.UpdatedAt,
                    post.SharePost.DeletedAt,

                    post.SharePost.Media
                        .Select(m => new PostMediaDto(
                            m.Id,
                            m.MediaType,
                            m.MediaUrl,
                            m.ThumbnailUrl,
                            m.Metadata,
                            m.UploadedAt))
                        .ToList(),

                    post.SharePost.Reactions
                        .GroupBy(r => r.ReactionType)
                        .Select(g => new ReactionCountDto(g.Key, g.Count()))
                        .ToList(),

                    post.SharePost.Comments.Count(c => c.DeletedAt == null),

                    post.SharePost.Group == null
                        ? null
                        : new GroupDto(
                            post.SharePost.Group.Id,
                            post.SharePost.Group.OwnerUserId,
                            post.SharePost.Group.Name,
                            post.SharePost.Group.Description,
                            post.SharePost.Group.PrivacyType,
                            post.SharePost.Group.CoverPhotoUrl),

                    null, // Terminate nested lookups here

                    viewerId == null 
                        ? null 
                        : post.SharePost.Reactions
                            .Where(r => r.UserId == viewerId)
                            .Select(r => (ReactionType?)r.ReactionType)
                            .FirstOrDefault(),

                    post.SharePost.IsHiddenFromGroup,
                    post.SharePost.HiddenAt,
                    post.SharePost.HideReason,
                    post.SharePost.ApprovalStatus,
                    post.SharePost.ApprovalStatus == PostApprovalStatus.Pending,
                    post.SharePost.IsAnonymous
                ),

            viewerId == null 
                ? null 
                : post.Reactions
                    .Where(r => r.UserId == viewerId)
                    .Select(r => (ReactionType?)r.ReactionType)
                    .FirstOrDefault(),

            post.IsHiddenFromGroup,
            post.HiddenAt,
            post.HideReason,
            post.ApprovalStatus,
            post.ApprovalStatus == PostApprovalStatus.Pending,
            post.IsAnonymous
        ));
    }
    }
}
