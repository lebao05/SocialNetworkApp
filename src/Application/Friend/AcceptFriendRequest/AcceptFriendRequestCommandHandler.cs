using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Entities;
using Domain.Enums;
using Domain.Shared;

namespace Application.Friends.Commands.AcceptFriendRequest;

internal sealed class AcceptFriendRequestCommandHandler
    : ICommandHandler<AcceptFriendRequestCommand, bool>
{
    private readonly IFriendRequestRepository _friendRequestRepository;
    private readonly IFriendshipRepository _friendshipRepository;
    private readonly IUnitOfWork _unitOfWork;

    public AcceptFriendRequestCommandHandler(
        IFriendRequestRepository friendRequestRepository,
        IFriendshipRepository friendshipRepository,
        IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _friendRequestRepository = friendRequestRepository;
        _friendshipRepository = friendshipRepository;
    }

    public async Task<Result<bool>> Handle(
        AcceptFriendRequestCommand request,
        CancellationToken cancellationToken)
    {
        var friendRequest = await _friendRequestRepository
            .GetByIdAsync(request.RequestId);

        // ❌ Not found
        if (friendRequest == null)
        {
            return Result.Failure<bool>(
                new Error("FriendRequest.NotFound", "Request not found"));
        }

        // ❌ Only receiver can accept
        if (friendRequest.ReceiverId != request.UserId)
        {
            return Result.Failure<bool>(
                new Error("FriendRequest.Forbidden", "You cannot accept this request"));
        }

        // ❌ Already handled
        if (friendRequest.Status != FriendRequestStatus.Pending)
        {
            return Result.Failure<bool>(
                new Error("FriendRequest.Invalid", "Request already handled"));
        }

        // ❌ Already friends (double safety)
        if (await _friendshipRepository
            .ExistsAsync(friendRequest.SenderId, friendRequest.ReceiverId))
        {
            return Result.Failure<bool>(
                new Error("Friendship.Exists", "Already friends"));
        }

        // ✅ Accept request
        friendRequest.Accept();

        // ✅ Create friendship
        var friendship = new Friendship(
            friendRequest.SenderId,
            friendRequest.ReceiverId,
            id: 0
        );

        await _friendshipRepository.AddAsync(friendship);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Result.Success(true);
    }
}