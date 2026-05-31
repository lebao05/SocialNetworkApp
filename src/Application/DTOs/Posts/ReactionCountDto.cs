using Domain.Enums;

namespace Application.DTOs.Posts
{
    public sealed record ReactionCountDto(
        ReactionType ReactionType,
        int Count
    );
}
