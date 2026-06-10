using Domain.Common;
using Domain.Enums;

namespace Domain.Entities;

public class MessageReaction : BaseEntity
{
    public Guid UserId { get; private set; }
    public ReactionType ReactionType { get; private set; }

    public User User { get; private set; } = null!;

    public long MessageId { get; private set; }
    public Message Message { get; private set; } = null!;

    private MessageReaction(long id) : base(id) { }

    public MessageReaction(long id, Guid userId, long messageId, ReactionType reactionType)
        : base(id)
    {
        UserId = userId;
        MessageId = messageId;
        ReactionType = reactionType;
    }

    public void UpdateReaction(ReactionType newReactionType)
    {
        ReactionType = newReactionType;
        UpdatedAt = DateTime.UtcNow;
    }
}
