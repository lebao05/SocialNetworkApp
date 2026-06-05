using Application.Abstractions.Messaging;
using Domain.Enums;

namespace Application.Reels.Commands.CreateReel
{
    public sealed record ReelAttachment(
        Stream Stream,
        string FileName,
        string ContentType,
        long Length);

    public sealed record CreateReelCommand(
        Guid AuthorId,
        string? Caption,
        string? AudioTitle,
        ReelVisibility Visibility,
        ReelAttachment Video,
        ReelAttachment? Thumbnail = null
    ) : ICommand<long>;
}
