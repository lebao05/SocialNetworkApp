using Application.Abstractions.Messaging;
using Domain.Enums;

namespace Application.Posts.Commands.UpdatePost
{
    public sealed record UpdatePostCommand(
        long PostId,
        Guid UserId,
        string? Content,
        PostVisibility Visibility,
        string? LocationTag = null,
        Feeling? FeelingActivity = null
    ) : ICommand;
}
