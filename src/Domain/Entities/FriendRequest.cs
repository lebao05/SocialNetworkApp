using Domain.Common;
using Domain.Enums;

namespace Domain.Entities
{

    public class FriendRequest : BaseEntity
    {
        public Guid SenderId { get; private set; }
        public Guid ReceiverId { get; private set; }

        public FriendRequestStatus Status { get; private set; }

        // Navigation
        public User Sender { get; private set; } = null!;
        public User Receiver { get; private set; } = null!;

        private FriendRequest(long id) : base(id) { }

        public FriendRequest(Guid senderId, Guid receiverId, long id) : base(id)
        {
       
            SenderId = senderId;
            ReceiverId = receiverId;
            Status = FriendRequestStatus.Pending;
            CreatedAt = DateTime.UtcNow;
        }

        public void Accept()
        {
            Status = FriendRequestStatus.Accepted;
        }

        public void Reject()
        {
            Status = FriendRequestStatus.Rejected;
        }
    }
}