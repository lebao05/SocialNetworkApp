using Domain.Common;
using Domain.Enums;
using Microsoft.AspNetCore.Identity;

namespace Domain.Entities
{
    public class User : IdentityUser<Guid>
    {
        public string FirstName { get; private set; } = string.Empty;
        public string LastName { get; private set; } = string.Empty;
        public DateTime DateOfBirth { get; private set; }
        public string? AvatarUrl { get; private set; }
        public Gender Gender { get; private set; }

        private readonly List<ConversationMember> _conversations = new();
        public IReadOnlyCollection<ConversationMember> Conversations => _conversations;

        private readonly List<BlockChat> _blockedUsers = new();
        public IReadOnlyCollection<BlockChat> BlockedUsers => _blockedUsers;


        private readonly List<Friendship> _friends = new();
        public IReadOnlyCollection<Friendship> Friends => _friends;

        private readonly List<FriendRequest> _sentRequests = new();
        public IReadOnlyCollection<FriendRequest> SentRequests => _sentRequests;

        private readonly List<FriendRequest> _receivedRequests = new();
        public IReadOnlyCollection<FriendRequest> ReceivedRequests => _receivedRequests;

        private User() { }

        public User(
            string firstName,
            string lastName,
            DateTime dateOfBirth,
            Gender gender,
            string email)
        {
            if (string.IsNullOrWhiteSpace(firstName))
                throw new ArgumentException("First name required");

            if (string.IsNullOrWhiteSpace(lastName))
                throw new ArgumentException("Last name required");

            if (string.IsNullOrWhiteSpace(email))
                throw new ArgumentException("Email required");

            FirstName = firstName;
            LastName = lastName;
            DateOfBirth = dateOfBirth;
            Gender = gender;

            Email = email;
            UserName = email;
        }
    }
}
