using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Enums;
using Domain.Shared;

namespace Application.Friend.Commands.CancelFriendRequest;

internal sealed class CancelFriendRequestCommandHandler
    : ICommandHandler<CancelFriendRequestCommand>
{
    private readonly IFriendRequestRepository _friendRequestRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CancelFriendRequestCommandHandler(
        IFriendRequestRepository friendRequestRepository,
        IUnitOfWork unitOfWork)
    {
        _friendRequestRepository = friendRequestRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result> Handle(
        CancelFriendRequestCommand request,
        CancellationToken cancellationToken)
    {
        var friendRequest = await _friendRequestRepository.GetPendingRequestAsync(
            request.SenderId,
            request.ReceiverId);

        if (friendRequest is null)
        {
            return Result.Failure(new Error(
                "FriendRequest.NotFound",
                "No pending friend request found."));
        }

        friendRequest.Cancel();
        _friendRequestRepository.Update(friendRequest);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
