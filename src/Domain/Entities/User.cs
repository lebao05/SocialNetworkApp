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

        public User(Guid Id, string userName, string email) 
        {
            this.Id = Id;
            UserName = userName;
            Email = email;
        }
    }
}
