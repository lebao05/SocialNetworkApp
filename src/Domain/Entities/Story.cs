using Domain.Common;
using Domain.Enums;

namespace Domain.Entities;

public class Story : AggregateRoot
{
    public Guid UserId { get; private set; }
    public string? MediaUrl { get; private set; }
    public StoryMediaType MediaType { get; private set; }
    public string? BackgroundGradient { get; private set; }
    public string? TextContent { get; private set; }
    public string? TextColor { get; private set; }
    public string? TextStyle { get; private set; }
    public string? TextPositionX { get; private set; }
    public string? TextPositionY { get; private set; }
    public string? FontFamily { get; private set; }
    public DateTime ExpiresAt { get; private set; }

    public User User { get; private set; } = null!;

    private readonly List<StorySeen> _seenByUsers = new();
    public virtual IReadOnlyCollection<StorySeen> SeenByUsers => _seenByUsers;

    private readonly List<StoryReaction> _reactions = new();
    public virtual IReadOnlyCollection<StoryReaction> Reactions => _reactions;

    private Story(long id) : base(id) { }

    public Story(
        long id,
        Guid userId,
        string? mediaUrl,
        StoryMediaType mediaType,
        string? backgroundGradient,
        string? textContent,
        string? textColor,
        string? textStyle,
        string? textPositionX,
        string? textPositionY,
        string? fontFamily) : base(id)
    {
        UserId = userId;
        MediaUrl = mediaUrl?.Trim();
        MediaType = mediaType;
        BackgroundGradient = backgroundGradient?.Trim();
        TextContent = textContent?.Trim();
        TextColor = textColor?.Trim();
        TextStyle = textStyle;
        TextPositionX = textPositionX;
        TextPositionY = textPositionY;
        FontFamily = fontFamily;
        ExpiresAt = DateTime.UtcNow.AddHours(24);
        CreatedAt = DateTime.UtcNow;
    }

    public bool IsExpired => DateTime.UtcNow > ExpiresAt;
}
