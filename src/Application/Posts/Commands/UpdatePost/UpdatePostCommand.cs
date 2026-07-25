using Application.Abstractions.Messaging;
using Application.Posts.Commands.CreatePost;
using Domain.Enums;

namespace Application.Posts.Commands.UpdatePost
{
    public sealed record UpdatePostCommand(
        long PostId,
        Guid UserId,
        string? Content,
        PostVisibility? Visibility,
        string? LocationTag,
        Feeling? FeelingActivity,
        IReadOnlyCollection<long>? RetainMediaIds = null,
        IReadOnlyCollection<PostAttachment>? NewAttachments = null
    ) : ICommand;
}
