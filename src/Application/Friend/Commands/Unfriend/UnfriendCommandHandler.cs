using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Entities;
using Domain.Events;
using Domain.Shared;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Friend.Commands.Unfriend;

internal sealed class UnfriendCommandHandler
    : ICommandHandler<UnfriendCommand, bool>
{
    private readonly IFriendshipRepository _friendshipRepository;
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<UnfriendCommandHandler> _logger;

    public UnfriendCommandHandler(
        IFriendshipRepository friendshipRepository,
        IUserRepository userRepository,
        IUnitOfWork unitOfWork,
        ILogger<UnfriendCommandHandler> logger)
    {
        _friendshipRepository = friendshipRepository;
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<Result<bool>> Handle(
        UnfriendCommand request,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation("Processing UnfriendCommand for user {CurrentUserId} to unfriend {FriendUserId}",
            request.CurrentUserId, request.FriendUserId);

        // ❌ Cannot unfriend yourself
        if (request.CurrentUserId == request.FriendUserId)
        {
            return Result.Failure<bool>(
                new Error("Unfriend.Invalid", "Cannot unfriend yourself"));
        }

        // ❌ Friendship must exist
        if (!await _friendshipRepository.ExistsAsync(request.CurrentUserId, request.FriendUserId))
        {
            return Result.Failure<bool>(
                new Error("Friendship.NotFound", "Friendship not found"));
        }

        // Fetch the current user to raise domain event
        var currentUser = await _userRepository.GetByIdAsync(request.CurrentUserId, cancellationToken);
        if (currentUser == null)
        {
            return Result.Failure<bool>(
                new Error("User.NotFound", "User not found"));
        }

        // ✅ Remove friendship from PostgreSQL
        await _friendshipRepository.RemoveFriendshipAsync(request.CurrentUserId, request.FriendUserId, cancellationToken);

        // Add domain event for Neo4j synchronization
        currentUser.AddDomainEvent(new UnfriendedDomainEvent(
            Guid.NewGuid(),
            request.CurrentUserId,
            request.FriendUserId
        ));

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Successfully unfriended user {FriendUserId} by {CurrentUserId}",
            request.FriendUserId, request.CurrentUserId);

        return Result.Success(true);
    }
}
