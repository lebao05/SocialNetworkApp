using Application.Abstractions.Messaging;
using Application.DTOs.Posts;

namespace Application.Posts.Queries.GetPost
{
    public sealed record GetPostQuery(long PostId) : IQuery<PostDto>;
}
