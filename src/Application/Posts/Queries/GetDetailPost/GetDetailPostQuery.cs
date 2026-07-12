using Application.Abstractions.Messaging;
using Application.DTOs.Posts;

namespace Application.Posts.Queries.GetDetailPost
{
    public sealed record GetDetailPostQuery(long PostId, Guid? UserId = null) : IQuery<PostDto>;
}
