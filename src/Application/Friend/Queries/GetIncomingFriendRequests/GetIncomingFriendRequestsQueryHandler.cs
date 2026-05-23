using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Friends;
using Application.Shared;
using Domain.Entities;
using Domain.Shared;

namespace Application.Friend.Queries.GetIncomingFriendRequests
{
    internal sealed class GetIncomingFriendRequestsQueryHandler
        : IQueryHandler<GetIncomingFriendRequestsQuery, PagedList<FriendRequestDto>>
    {
        private readonly IFriendRequestRepository _friendRequestRepository;

        public GetIncomingFriendRequestsQueryHandler(IFriendRequestRepository friendRequestRepository)
        {
            _friendRequestRepository = friendRequestRepository;
        }

        public async Task<Result<PagedList<FriendRequestDto>>> Handle(
            GetIncomingFriendRequestsQuery request,
            CancellationToken cancellationToken)
        {
            var page = Math.Max(1, request.Page);
            var pageSize = Math.Clamp(request.PageSize, 1, 100);

            var friendRequests = await _friendRequestRepository.GetIncomingPendingAsync(
                request.ReceiverId,
                page,
                pageSize,
                cancellationToken);

            var items = friendRequests.Items.Select(Map).ToList();

            return Result.Success(new PagedList<FriendRequestDto>(
                items,
                friendRequests.PageNumber,
                friendRequests.PageSize,
                friendRequests.TotalCount));
        }

        private static FriendRequestDto Map(FriendRequest friendRequest)
        {
            return new FriendRequestDto(
                friendRequest.Id,
                friendRequest.SenderId,
                friendRequest.Sender.FirstName,
                friendRequest.Sender.LastName,
                friendRequest.Sender.AvatarUrl,
                friendRequest.ReceiverId,
                friendRequest.Status,
                friendRequest.CreatedAt);
        }
    }
}
