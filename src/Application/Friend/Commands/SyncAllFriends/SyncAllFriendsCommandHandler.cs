using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Shared;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Friend.Commands.SyncAllFriends
{
    internal sealed class SyncAllFriendsCommandHandler
        : ICommandHandler<SyncAllFriendsCommand, int>
    {
        private readonly IUserRepository _userRepository;
        private readonly IFriendshipRepository _friendshipRepository;
        private readonly IFriendGraphService _friendGraphService;
        private readonly ILogger<SyncAllFriendsCommandHandler> _logger;

        public SyncAllFriendsCommandHandler(
            IUserRepository userRepository,
            IFriendshipRepository friendshipRepository,
            IFriendGraphService friendGraphService,
            ILogger<SyncAllFriendsCommandHandler> logger)
        {
            _userRepository = userRepository;
            _friendshipRepository = friendshipRepository;
            _friendGraphService = friendGraphService;
            _logger = logger;
        }

        public async Task<Result<int>> Handle(
            SyncAllFriendsCommand request,
            CancellationToken cancellationToken)
        {
            int count = 0;
            try
            {
                var users = await _userRepository.GetAllAsync(cancellationToken);
                foreach (var user in users)
                {
                    await _friendGraphService.SyncUserAsync(
                        user.Id,
                        user.UserName ?? "",
                        user.FirstName,
                        user.LastName,
                        user.AvatarUrl
                    );
                    count++;
                }

                var friendships = await _friendshipRepository.GetAllFriendshipsAsync(cancellationToken);
                foreach (var friendship in friendships)
                {
                    await _friendGraphService.SyncFriendshipAsync(
                        friendship.User1Id,
                        friendship.User2Id
                    );
                }

                _logger.LogInformation("Successfully synchronized {Count} users and their friendships to Neo4j", count);
                return Result.Success(count);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during full sync to Neo4j");
                return Result.Failure<int>(new Error("Neo4j.SyncFailed", ex.Message));
            }
        }
    }
}
