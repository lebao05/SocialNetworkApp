using Application.Abstractions.Messaging;
using Application.DTOs.Posts;
using Application.Shared;

namespace Application.Posts.Queries.GetPostMediasByGroup
{
    public sealed record GetPostMediasByGroupQuery(
        long GroupId,
        int Page = 1,
        int PageSize = 20,
        string Type = "") : IQuery<PagedList<PostMediaItemDto>>;
}
