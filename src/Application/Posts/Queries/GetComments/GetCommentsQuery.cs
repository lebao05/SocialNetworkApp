using Application.Abstractions.Messaging;
using Application.DTOs.Posts;
using Application.Shared;

namespace Application.Posts.Queries.GetComments
{
    public sealed record GetCommentsQuery(
        long PostId,
        long? ParentCommentId,
        int Page,
        int PageSize,
        Guid? UserId = null
    ) : IQuery<PagedList<PostCommentDto>>;
}
