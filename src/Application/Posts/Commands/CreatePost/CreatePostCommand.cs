using Application.Abstractions.Messaging;
using Domain.Enums;

namespace Application.Posts.Commands.CreatePost
{
    public sealed record PostAttachment(
        Stream Stream,
        string FileName,
        string ContentType,
        long Length);

    public sealed record CreatePostCommand(
        Guid AuthorId,
        long? GroupId,
        string? Content,
        PostVisibility Visibility,
        long? SharePostId = null,
        string? LocationTag = null,
        string? FeelingActivity = null,
        IReadOnlyCollection<Guid>? TaggedUserIds = null,
        IReadOnlyCollection<PostAttachment>? Attachments = null
    ) : ICommand<long>;
}
