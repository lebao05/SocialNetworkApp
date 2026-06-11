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
    public static MessageReactionDto FromDomain(MessageReaction reaction)
    {
        return new MessageReactionDto(
            Id: reaction.Id,
            UserId: reaction.UserId,
            UserName: $"{reaction.User.FirstName} {reaction.User.LastName}",
            UserAvatarUrl: reaction.User.AvatarUrl,
            ReactionType: reaction.ReactionType.ToString()
        );
    }
}
