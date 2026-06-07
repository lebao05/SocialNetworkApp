using Application.Abstractions.Repositories;
using Application.Shared;
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

        public async Task<FriendRequest?> GetPendingRequestAsync(Guid senderId, Guid receiverId)
        {
            return await _context.FriendRequests
                .FirstOrDefaultAsync(x =>
                    x.SenderId == senderId &&
                    x.ReceiverId == receiverId &&
                    x.Status == FriendRequestStatus.Pending);
        }

        public async Task<bool> ExistsPendingRequestAsync(Guid senderId, Guid receiverId)
        {
            return await _context.FriendRequests
                .AnyAsync(x =>
                    x.SenderId == senderId &&
                    x.ReceiverId == receiverId &&
                    x.Status == FriendRequestStatus.Pending);
        }

        public async Task<PagedList<FriendRequest>> GetIncomingPendingAsync(
            Guid receiverId,
            int page,
            int pageSize,
            CancellationToken cancellationToken = default)
        {
            var query = _context.FriendRequests
                .AsNoTracking()
                .Include(request => request.Sender)
                .Where(request =>
                    request.ReceiverId == receiverId
                    && request.Status == FriendRequestStatus.Pending)
                .OrderByDescending(request => request.CreatedAt);

            return await PagedList<FriendRequest>.CreateAsync(query, page, pageSize, cancellationToken);
        }

        public async Task AddAsync(FriendRequest request)
        {
            await _context.FriendRequests.AddAsync(request);
        }

        public void Update(FriendRequest request)
        {
            _context.FriendRequests.Update(request);
        }
    }
}
