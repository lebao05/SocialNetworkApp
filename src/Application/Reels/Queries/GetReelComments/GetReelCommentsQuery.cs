using Application.Abstractions.Messaging;
using Application.DTOs.Reels;
using Application.Shared;

namespace Application.Reels.Queries.GetReelComments
{
    public sealed record GetReelCommentsQuery(
        long ReelId,
        long? ParentCommentId,
        int Page,
        int PageSize,
        Guid? UserId = null
    ) : IQuery<PagedList<ReelCommentDto>>;
}
