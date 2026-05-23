using Application.Abstractions;
using Application.Abstractions.Messaging;
using Domain.Entities;
using Domain.Shared;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;

namespace Application.Auth.Commands.Register
{
    internal class RegisterCommandHandler
        : ICommandHandler<RegisterCommand, string>
    {
        private readonly ITokenService _tokenService;
        private readonly UserManager<User> _userManager;
        private readonly IFriendGraphService _friendGraphService;
        private readonly ILogger<RegisterCommandHandler> _logger;

        public RegisterCommandHandler(
            ITokenService tokenService, 
            UserManager<User> userManager,
            IFriendGraphService friendGraphService,
            ILogger<RegisterCommandHandler> logger)
        {
            _tokenService = tokenService;
            _userManager = userManager;
            _friendGraphService = friendGraphService;
            _logger = logger;
        }

        public async Task<Result<string>> Handle(RegisterCommand request, CancellationToken cancellationToken)
        {
            var user = new User(
               request.FirstName,
               request.LastName,
               request.DateOfBirth,
               request.Gender,
               request.Email
           );
            var existingUser = await _userManager.FindByEmailAsync(request.Email);
            if (existingUser != null)
            {
                return Result.Failure<string>(new Domain.Shared.Error("AppUser.EmailExists", "Email is already registered."));
            }
            var identityResult = await _userManager.CreateAsync(user, request.Password);

            if (identityResult.Succeeded)
            {
                var roleResult = await _userManager.AddToRoleAsync(user, "User");
                if (roleResult.Succeeded == false)
                {
                    await _userManager.DeleteAsync(user);
                    var errors = roleResult.Errors.Select(e => e.Description);
                    return Result.Failure<string>(new Domain.Shared.Error("AppUser.AssignRole", string.Join(", ", errors)));
                }

                // Sync new user to Neo4j social graph database
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
                    _logger.LogError(ex, "Failed to sync registered user {UserId} to Neo4j social graph", user.Id);
                }

                return Result.Success(_tokenService.CreateJWTToken(user, new List<string> { "User" }));
            }

            var error = string.Join(',', identityResult.Errors.Select(e => e.Description));
            return Result.Failure<string>(new Domain.Shared.Error("AppUser.CreatingAccount", error));
        }
    }
}
