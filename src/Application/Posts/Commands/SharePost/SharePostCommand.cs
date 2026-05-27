using Application.Abstractions.Messaging;
using Domain.Enums;

namespace Application.Posts.Commands.SharePost
{
    public sealed record SharePostCommand(
        long PostId,
        Guid AuthorId,
        long? GroupId = null,
        PostVisibility Visibility = PostVisibility.Public
    ) : ICommand<long>;
}
