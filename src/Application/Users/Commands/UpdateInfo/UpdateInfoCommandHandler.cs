using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Shared;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Users.Commands.UpdateInfo
{
    internal sealed class UpdateInfoCommandHandler : ICommandHandler<UpdateInfoCommand>
    {
        private readonly IUserRepository _userRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFriendGraphService _friendGraphService;
        private readonly ILogger<UpdateInfoCommandHandler> _logger;

        public UpdateInfoCommandHandler(
            IUserRepository userRepository,
            IUnitOfWork unitOfWork,
            IFriendGraphService friendGraphService,
            ILogger<UpdateInfoCommandHandler> logger)
        {
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
            _friendGraphService = friendGraphService;
            _logger = logger;
        }

        public async Task<Result> Handle(UpdateInfoCommand request, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);

            if (user is null)
            {
                return Result.Failure(new Error(
                    "User.NotFound",
                    $"The user with Id {request.UserId} was not found."));
            }

            // Update encapsulated domain properties
            var updateResult = user.UpdatePersonalInfo(
                request.FirstName,
                request.LastName,
                request.DateOfBirth,
                request.Gender);

            if (updateResult.IsFailure)
            {
                return updateResult;
            }

            // Update public properties
            user.Bio = request.Bio;
            user.CurrentLocation = request.CurrentLocation;
            user.Hometown = request.Hometown;
            user.Website = request.Website;
            user.RelationshipStatus = request.RelationshipStatus;

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            // Sync updated user to Neo4j social graph database
            try
            {
                await _friendGraphService.SyncUserAsync(
                    user.Id,
                    user.UserName ?? "",
                    user.FirstName,
                    user.LastName,
                    user.AvatarUrl
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to sync updated user {UserId} to Neo4j social graph", user.Id);
            }

            return Result.Success();
        }
    }
}
