using Domain.Entities;
using Domain.Enums;
using Application.Shared;

namespace Application.Abstractions.Repositories
{
    public interface IPostRepository
    {
        Task<Post?> GetByIdAsync(long id, CancellationToken cancellationToken = default);
        Task<IEnumerable<Post>> GetByGroupIdAsync(long groupId, Guid? authorId = null, CancellationToken cancellationToken = default);
        Task<PagedList<Post>> GetByGroupIdPagedAsync(long groupId, int page, int pageSize, Guid? authorId = null, CancellationToken cancellationToken = default);
        Task<PagedList<Post>> GetByGroupIdPagedAsync(long groupId, int page, int pageSize, PostApprovalStatus approvalStatus, CancellationToken cancellationToken = default);
        Task<IEnumerable<Post>> GetByAuthorIdAsync(Guid authorId, CancellationToken cancellationToken = default);
        Task<PagedList<Post>> GetByAuthorIdPagedAsync(Guid authorId, int page, int pageSize, CancellationToken cancellationToken = default);
        Task<PagedList<PostMedia>> GetMediasByGroupIdPagedAsync(long groupId, int page, int pageSize, string? mediaType = null, CancellationToken cancellationToken = default);
        Task<PagedList<PostMedia>> GetMediasByAuthorIdPagedAsync(Guid authorId, int page, int pageSize, string? mediaType = null, CancellationToken cancellationToken = default);
        void Add(Post post);
        void Update(Post post);
        void Delete(Post post);
        void AddMedia(PostMedia media);
        void AddTag(PostTag tag);
        Task<PostReaction?> GetPostReactionAsync(long postId, Guid userId, CancellationToken cancellationToken = default);
        Task<IReadOnlyCollection<PostReaction>> GetPostReactionsAsync(IEnumerable<long> postIds, Guid userId, CancellationToken cancellationToken = default);
        void AddReaction(PostReaction reaction);
        void RemoveReaction(PostReaction reaction);
        Task<CommentReaction?> GetCommentReactionAsync(long commentId, Guid userId, CancellationToken cancellationToken = default);
        void AddCommentReaction(CommentReaction reaction);
        void RemoveCommentReaction(CommentReaction reaction);
        Task<PostComment?> GetCommentByIdAsync(long commentId, CancellationToken cancellationToken = default);
        Task<PagedList<PostComment>> GetCommentsPagedAsync(long postId, long? parentCommentId, int page, int pageSize, CancellationToken cancellationToken = default);
        Task<Dictionary<long, int>> GetReplyCountsAsync(IEnumerable<long> commentIds, CancellationToken cancellationToken = default);
        Task<int> GetCommentCountByPostIdsAsync(IEnumerable<long> postIds, CancellationToken cancellationToken = default);
        Task<int> GetReactionCountByPostIdsAsync(IEnumerable<long> postIds, CancellationToken cancellationToken = default);
        void AddComment(PostComment comment);
        Task<SavedPost?> GetSavedPostAsync(long postId, Guid userId, CancellationToken cancellationToken = default);
        void AddSavedPost(SavedPost savedPost);
        void RemoveSavedPost(SavedPost savedPost);
    }
}
