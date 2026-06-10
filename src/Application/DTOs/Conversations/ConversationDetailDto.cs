using Domain.Entities;
using Domain.Enums;

namespace Application.DTOs.Conversations
{
    public sealed record ConversationDetailDto(
        long Id,
        string? Name,
        bool IsOneToOne,
        bool IsVirtual,
        string? Theme,
        bool IsNotificationOn,
        int UnreadCount,
        long? LastReadMessageId,
        bool IsNotInAConversation,
        Guid? OwnerId,
        Guid? OtherUserId,
        int MemberCount
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
            Guid? otherUserId = null;

            if (conversation.IsOneToOne)
            {
                var other = conversation.Members
                    .FirstOrDefault(m => m.UserId != currentUserId);

                displayName = other != null
                    ? $"{other.User.FirstName} {other.User.LastName}"
                    : "Unknown User";

                otherUserId = other?.UserId;
            }

            return new ConversationDetailDto(
                Id: conversation.Id,
                Name: displayName,
                IsOneToOne: conversation.IsOneToOne,
                IsVirtual: false,
                Theme: conversation.Theme,
                IsNotificationOn: currentMember.IsNotificationOn,
                UnreadCount: conversation.Messages.Count(m => m.Id > lastReadId),
                LastReadMessageId: currentMember.LastReadMessageId,
                IsNotInAConversation: false,
                OwnerId: conversation.OwnerId,
                OtherUserId: otherUserId,
                MemberCount: conversation.Members.Count
            );
        }

        public static ConversationDetailDto FromUsers(User currentUser, User targetUser)
        {
            return new ConversationDetailDto(
                Id: 0,
                Name: $"{targetUser.FirstName} {targetUser.LastName}".Trim(),
                IsOneToOne: true,
                IsVirtual: true,
                Theme: null,
                IsNotificationOn: true,
                UnreadCount: 0,
                LastReadMessageId: null,
                IsNotInAConversation: true,
                OwnerId: currentUser.Id,
                OtherUserId: targetUser.Id,
                MemberCount: 1
            );
        }
    }

    public sealed record ConversationMemberDto(
        Guid UserId,
        string FullName,
        string? AvatarUrl,
        string Role,
        long? LastReadMessageId)
    {
        public static ConversationMemberDto FromDomain(ConversationMember member)
        {
            return new ConversationMemberDto(
                UserId: member.UserId,
                FullName: $"{member.User.FirstName} {member.User.LastName}".Trim(),
                AvatarUrl: member.User.AvatarUrl,
                Role: member.Role.ToString(),
                LastReadMessageId: member.LastReadMessageId
            );
        }
    }
}
