using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Enums;
using Domain.Shared;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Friend.Commands.RejectFriendRequest;

internal sealed class RejectFriendRequestCommandHandler
    : ICommandHandler<RejectFriendRequestCommand, bool>
{
    private readonly IFriendRequestRepository _friendRequestRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<RejectFriendRequestCommandHandler> _logger;

    public RejectFriendRequestCommandHandler(
        IFriendRequestRepository friendRequestRepository,
        IUnitOfWork unitOfWork,
        ILogger<RejectFriendRequestCommandHandler> logger)
    {
        _friendRequestRepository = friendRequestRepository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<Result<bool>> Handle(
        RejectFriendRequestCommand request,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation("Processing RejectFriendRequestCommand for request {RequestId} by user {UserId}",
            request.RequestId, request.UserId);

        var friendRequest = await _friendRequestRepository.GetByIdAsync(request.RequestId);

        // Not found
        if (friendRequest == null)
        {
            return Result.Failure<bool>(
                new Error("FriendRequest.NotFound", "Request not found"));
        }

        // Only receiver can reject
        if (friendRequest.ReceiverId != request.UserId)
        {
            return Result.Failure<bool>(
                new Error("FriendRequest.Forbidden", "You cannot reject this request"));
        }

        // Already handled
        if (friendRequest.Status != FriendRequestStatus.Pending)
        {
            return Result.Failure<bool>(
                new Error("FriendRequest.Invalid", "Request already handled"));
        }

        // Reject the request
        friendRequest.Reject();

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Successfully rejected friend request {RequestId} by user {UserId}",
            request.RequestId, request.UserId);

        return Result.Success(true);
    }
}
