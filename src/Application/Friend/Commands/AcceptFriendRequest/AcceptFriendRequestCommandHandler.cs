using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Entities;
using Domain.Enums;
using Domain.Shared;
using Microsoft.Extensions.Logging;
using System;

namespace Application.Friend.Commands.AcceptFriendRequest;

internal sealed class AcceptFriendRequestCommandHandler
    : ICommandHandler<AcceptFriendRequestCommand, bool>
{
    private readonly IFriendRequestRepository _friendRequestRepository;
    private readonly IFriendshipRepository _friendshipRepository;
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<AcceptFriendRequestCommandHandler> _logger;

    public AcceptFriendRequestCommandHandler(
        IFriendRequestRepository friendRequestRepository,
        IFriendshipRepository friendshipRepository,
        IUserRepository userRepository,
        IUnitOfWork unitOfWork,
        ILogger<AcceptFriendRequestCommandHandler> logger)
    {
        _unitOfWork = unitOfWork;
        _friendRequestRepository = friendRequestRepository;
        _friendshipRepository = friendshipRepository;
        _userRepository = userRepository;
        _logger = logger;
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

        // Fetch the user accepting the request to raise domain event on them
        var receiverUser = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);
        if (receiverUser == null)
        {
            return Result.Failure<bool>(
                new Error("User.NotFound", "User not found"));
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

        // Add domain event for Neo4j synchronization
        receiverUser.AddDomainEvent(new Domain.Events.FriendshipCreatedDomainEvent(
            Guid.NewGuid(),
            friendRequest.SenderId,
            friendRequest.ReceiverId
        ));

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success(true);
    }
}