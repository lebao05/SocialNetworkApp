using Domain.Enums;

namespace Presentation.Contracts.Post
{
    public sealed record ReactToCommentRequest(
        ReactionType? ReactionType
    );
}
