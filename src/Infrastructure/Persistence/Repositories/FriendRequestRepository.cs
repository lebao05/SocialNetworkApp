using Application.Abstractions.Repositories;
using Domain.Entities;
using Domain.Enums;
using Infrastructure.Persistence.Contexts;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories
{
    public class FriendRequestRepository : IFriendRequestRepository
    {
        private readonly AppDbContext _context;

        public FriendRequestRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<FriendRequest?> GetByIdAsync(long id)
        {
            return await _context.FriendRequests
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<bool> ExistsPendingRequestAsync(Guid senderId, Guid receiverId)
        {
            return await _context.FriendRequests
                .AnyAsync(x =>
                    x.SenderId == senderId &&
                    x.ReceiverId == receiverId &&
                    x.Status == FriendRequestStatus.Pending);
        }

        public async Task AddAsync(FriendRequest request)
        {
            await _context.FriendRequests.AddAsync(request);
        }
    }
}
