using Application.Abstractions.Messaging;
using Application.DTOs.Posts;
using Application.Shared;

namespace Application.Posts.Queries.GetPostMediasByUser
{
    public sealed record GetPostMediasByUserQuery(
        Guid UserId,
        int Page = 1,
        int PageSize = 20,
        string Type = "") : IQuery<PagedList<PostMediaItemDto>>;
}
