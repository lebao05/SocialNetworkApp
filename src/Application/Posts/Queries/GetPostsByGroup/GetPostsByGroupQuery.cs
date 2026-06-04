using Application.Abstractions.Messaging;
using Application.DTOs.Posts;
using Application.Shared;
using Domain.Enums;

namespace Application.Posts.Queries.GetPostsByGroup
{
    public sealed record GetPostsByGroupQuery(
        long GroupId,
        int Page = 1,
        int PageSize = 10,
        Guid? UserId = null,
        bool OnlyMine = false,
        PostApprovalStatus? ApprovalStatus = null
    ) : IQuery<PagedList<PostDto>>;
}
