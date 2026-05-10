using Domain.Entities;

namespace Application.DTOs.Conversations
{

    public sealed record ConversationDetailDto(
        long Id,
        string? Name,
        bool IsOneToOne,
        string? Theme,
        bool IsNotificationOn,
        int UnreadCount,
        bool IsNotInAConversation,
        List<ConversationMemberDto> Members
    )
    {
        public static ConversationDetailDto FromDomain(
            Conversation conversation,
            Guid currentUserId)
        {
            var currentMember = conversation.Members
                .First(m => m.UserId == currentUserId);

            var lastReadId = currentMember.LastReadMessageId ?? 0;

            string displayName = conversation.Name ?? string.Empty;

            if (conversation.IsOneToOne)
            {
                var other = conversation.Members
                    .FirstOrDefault(m => m.UserId != currentUserId);

                displayName = other != null
                    ? $"{other.User.FirstName} {other.User.LastName}"
                    : "Unknown User";
            }

            return new ConversationDetailDto(
                Id: conversation.Id,
                Name: displayName,
                IsOneToOne: conversation.IsOneToOne,
                Theme: conversation.Theme,
                IsNotificationOn: currentMember.IsNotificationOn,
                UnreadCount: conversation.Messages.Count(m => m.Id > lastReadId),
                IsNotInAConversation: false,
                Members: conversation.Members
                    .Select(ConversationMemberDto.FromDomain)
                    .ToList()
            );
        }

        public static ConversationDetailDto FromUsers(User currentUser, User targetUser)
        {
            return new ConversationDetailDto(
                Id: 0,
                Name: $"{targetUser.FirstName} {targetUser.LastName}".Trim(),
                IsOneToOne: true,
                Theme: null,
                IsNotificationOn: true,
                UnreadCount: 0,
                IsNotInAConversation: true,
                Members: new List<ConversationMemberDto>
                {
                    new ConversationMemberDto(currentUser.Id, $"{currentUser.FirstName} {currentUser.LastName}", currentUser.AvatarUrl, "Admin"),
                    new ConversationMemberDto(targetUser.Id, $"{targetUser.FirstName} {targetUser.LastName}", targetUser.AvatarUrl, "Member")
                }
            );
        }
    }
}
