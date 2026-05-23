using Domain.Enums;

namespace Presentation.Contracts
{
    public sealed record UpdatePostRequest(
        string? Content,
        PostVisibility Visibility,
        string? LocationTag = null,
        string? FeelingActivity = null
    );
}
