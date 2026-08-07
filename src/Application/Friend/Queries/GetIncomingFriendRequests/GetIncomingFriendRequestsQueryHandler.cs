using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Friends;
using Application.Shared;
using Domain.Entities;
using Domain.Shared;

namespace Application.Friend.Queries.GetIncomingFriendRequests
{
    internal sealed class GetIncomingFriendRequestsQueryHandler
        : IQueryHandler<GetIncomingFriendRequestsQuery, PagedList<GetIncomingFriendRequestsResponseDto>>
    {
        private const int PageSize = 10;

        private readonly IFriendRequestRepository _friendRequestRepository;
        private readonly IFriendGraphService _friendGraphService;

        public GetIncomingFriendRequestsQueryHandler(
            IFriendRequestRepository friendRequestRepository,
            IFriendGraphService friendGraphService)
        {
            _friendRequestRepository = friendRequestRepository;
            _friendGraphService = friendGraphService;
        }

        public async Task<Result<PagedList<GetIncomingFriendRequestsResponseDto>>> Handle(
            GetIncomingFriendRequestsQuery request,
            CancellationToken cancellationToken)
        {
            var page = Math.Max(1, request.Page);

            var friendRequests = await _friendRequestRepository.GetIncomingPendingAsync(
                request.ReceiverId,
                page,
                PageSize,
                cancellationToken);

            var items = await Task.WhenAll(friendRequests.Items.Select(async fr => await MapAsync(fr, request.ReceiverId, cancellationToken)));

            return Result.Success(new PagedList<GetIncomingFriendRequestsResponseDto>(
                items.ToList(),
                friendRequests.PageNumber,
                friendRequests.PageSize,
                friendRequests.TotalCount));
        }

        private async Task<GetIncomingFriendRequestsResponseDto> MapAsync(FriendRequest friendRequest, Guid receiverId, CancellationToken cancellationToken)
        {
            var mutualFriendCount = await _friendGraphService.GetMutualFriendCountAsync(
                friendRequest.SenderId,
                receiverId,
                cancellationToken);

            return new GetIncomingFriendRequestsResponseDto(
                friendRequest.Id,
                friendRequest.SenderId,
                friendRequest.Sender.FirstName,
                friendRequest.Sender.LastName,
                friendRequest.Sender.AvatarUrl,
                friendRequest.ReceiverId,
                friendRequest.Status,
                friendRequest.CreatedAt,
                mutualFriendCount);
        }
    }
}
