using Domain.Entities;

namespace Application.DTOs.Messages;

public sealed record MessageReactionDto(
    long Id,
    Guid UserId,
    string UserName,
    string? UserAvatarUrl,
    string ReactionType
)
{
    public static MessageReactionDto? FromDomain(MessageReaction? reaction)
    {
        if (reaction is null) return null;
        var user = reaction.User;
        return new MessageReactionDto(
            Id: reaction.Id,
            UserId: reaction.UserId,
            UserName: user is not null ? $"{user.FirstName} {user.LastName}" : "Unknown User",
            UserAvatarUrl: user?.AvatarUrl,
            ReactionType: reaction.ReactionType.ToString()
        );
    }
}
