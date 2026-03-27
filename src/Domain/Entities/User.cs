using Domain.Common;
using Microsoft.AspNetCore.Identity;

namespace Domain.Entities
{
    public class User : IdentityUser<Guid>
    {
        public string? Phone { get; private set; }
        public string? AvatarUrl { get; private set; }

        private readonly List<ConversationMember> _conversations = new();
        public IReadOnlyCollection<ConversationMember> Conversations => _conversations;

        private readonly List<BlockChat> _blockedUsers = new();
        public IReadOnlyCollection<BlockChat> BlockedUsers => _blockedUsers;

        private User() { }

        public User(Guid id, string userName, string email)
        {
            if (string.IsNullOrWhiteSpace(userName))
                throw new ArgumentException("Username cannot be empty");

            if (string.IsNullOrWhiteSpace(email))
                throw new ArgumentException("Email cannot be empty");

            Id = id;
            UserName = userName;
            Email = email;

        }
    }
}
