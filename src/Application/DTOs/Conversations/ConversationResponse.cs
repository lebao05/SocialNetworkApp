using Domain.Entities;

namespace Application.DTOs.Conversations;

public sealed record ConversationResponse(
    long Id,
    string? Name,
    bool IsOneToOne,
    string? LastMessageContent,
    DateTime? LastMessageSentAt,
    int UnreadCount,
    List<ConversationMemberDto> Members)
{
    public static ConversationResponse FromDomain(Conversation conversation, Guid currentUserId)
    {
        var userMember = conversation.Members.First(m => m.UserId == currentUserId);
        var lastMessage = conversation.Messages.OrderByDescending(m => m.CreatedAt).FirstOrDefault();

        // Logic for 1:1 Name: If it's a private chat, use the other person's name
        string displayName = conversation.Name ?? string.Empty;
        if (conversation.IsOneToOne)
        {
            var other = conversation.Members.FirstOrDefault(m => m.UserId != currentUserId);
            displayName = other != null ? $"{other.User.FirstName} {other.User.LastName}" : "Unknown User";
        }

        return new ConversationResponse(
            Id: conversation.Id,
            Name: displayName,
            IsOneToOne: conversation.IsOneToOne,
            LastMessageContent: lastMessage?.Content,
            LastMessageSentAt: lastMessage?.CreatedAt,
            // Count messages created after the user's last read watermark
            UnreadCount: conversation.Messages.Count(m => m.Id > (userMember.LastReadMessageId ?? 0)),
            Members: conversation.Members.Select(ConversationMemberDto.FromDomain).ToList()
        );
    }
}
public sealed record ConversationMemberDto(
    Guid UserId,
    string FullName,
    string? AvatarUrl,
    string Role)
{
    public static ConversationMemberDto FromDomain(ConversationMember member)
    {
        return new ConversationMemberDto(
            UserId: member.UserId,
            FullName: $"{member.User.FirstName} {member.User.LastName}".Trim(),
            AvatarUrl: member.User.AvatarUrl,
            Role: member.Role.ToString()
        );
    }
}