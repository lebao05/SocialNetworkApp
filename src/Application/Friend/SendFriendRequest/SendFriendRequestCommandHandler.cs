using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Entities;
using Domain.Shared;

namespace Application.Friends.Commands.SendFriendRequest;

internal sealed class SendFriendRequestCommandHandler
    : ICommandHandler<SendFriendRequestCommand, bool>
{
    private readonly IUserRepository _userRepository;
    private readonly IFriendRequestRepository _friendRequestRepository;
    private readonly IFriendshipRepository _friendshipRepository;
    private readonly IUnitOfWork _unitOfWork;

    public SendFriendRequestCommandHandler(
        IUnitOfWork unitOfWork,
        IUserRepository userRepository,
        IFriendRequestRepository friendRequestRepository,
        IFriendshipRepository friendshipRepository)
    {
        _unitOfWork = unitOfWork;
        _userRepository = userRepository;
        _friendRequestRepository = friendRequestRepository;
        _friendshipRepository = friendshipRepository;
    }

    public async Task<Result<bool>> Handle(
        SendFriendRequestCommand request,
        CancellationToken cancellationToken)
    {
        // ❌ Cannot send to yourself
        if (request.SenderId == request.ReceiverId)
        {
            return Result.Failure<bool>(
                new Error("FriendRequest.Invalid", "Cannot send request to yourself"));
        }

        // ❌ Users must exist
        var sender = await _userRepository.GetByIdAsync(request.SenderId);
        var receiver = await _userRepository.GetByIdAsync(request.ReceiverId);

        if (sender == null || receiver == null)
        {
            return Result.Failure<bool>(
                new Error("User.NotFound", "Sender or receiver not found"));
        }

        // ❌ Already friends
        if (await _friendshipRepository.ExistsAsync(request.SenderId, request.ReceiverId))
        {
            return Result.Failure<bool>(
                new Error("Friendship.Exists", "Already friends"));
        }

        // ❌ Already sent
        if (await _friendRequestRepository
            .ExistsPendingRequestAsync(request.SenderId, request.ReceiverId))
        {
            return Result.Failure<bool>(
                new Error("FriendRequest.Exists", "Request already sent"));
        }

        // ❌ Reverse request exists (user already sent you one)
        if (await _friendRequestRepository
            .ExistsPendingRequestAsync(request.ReceiverId, request.SenderId))
        {
            return Result.Failure<bool>(
                new Error("FriendRequest.ReverseExists", "User already sent you a request"));
        }

        var friendRequest = new FriendRequest(
            request.SenderId,
            request.ReceiverId,
            id: 0
        );

        await _friendRequestRepository.AddAsync(friendRequest);
        await _unitOfWork.SaveChangesAsync();

        return Result.Success(true);
    }
}