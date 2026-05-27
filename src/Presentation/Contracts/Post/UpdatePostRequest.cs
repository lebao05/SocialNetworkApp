using Domain.Enums;

namespace Presentation.Contracts.Post
{
    public sealed record UpdatePostRequest(
        string? Content,
        PostVisibility Visibility,
        string? LocationTag = null,
        Feeling? FeelingActivity = null
    );
}
