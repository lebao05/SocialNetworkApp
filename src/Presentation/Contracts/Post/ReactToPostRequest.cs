using Domain.Enums;

namespace Presentation.Contracts.Post
{
    public sealed record ReactToPostRequest(
        ReactionType? ReactionType
    );
}
