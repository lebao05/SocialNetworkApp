using Application.Abstractions;
using Application.Abstractions.Messaging;
using Domain.Entities;
using Domain.Events;
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
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<RegisterCommandHandler> _logger;

        public RegisterCommandHandler(
            ITokenService tokenService,
            UserManager<User> userManager,
            IUnitOfWork unitOfWork,
            ILogger<RegisterCommandHandler> logger)
        {
            _tokenService = tokenService;
            _userManager = userManager;
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        public async Task<Result<string>> Handle(RegisterCommand request, CancellationToken cancellationToken)
        {
            var existingUser = await _userManager.FindByEmailAsync(request.Email);
            if (existingUser != null)
            {
                return Result.Failure<string>(new Domain.Shared.Error("AppUser.EmailExists", "Email is already registered."));
            }

            var user = new User(
                request.FirstName,
                request.LastName,
                request.DateOfBirth,
                request.Gender,
                request.Email);

            await _unitOfWork.BeginTransactionAsync(cancellationToken);

            try
            {
                var identityResult = await _userManager.CreateAsync(user, request.Password);
                if (!identityResult.Succeeded)
                {
                    var errors = string.Join(',', identityResult.Errors.Select(e => e.Description));
                    await _unitOfWork.RollbackTransactionAsync(cancellationToken);
                    return Result.Failure<string>(new Domain.Shared.Error("AppUser.CreatingAccount", errors));
                }

                var roleResult = await _userManager.AddToRoleAsync(user, "User");
                if (!roleResult.Succeeded)
                {
                    await _userManager.DeleteAsync(user);
                    await _unitOfWork.RollbackTransactionAsync(cancellationToken);
                    var errors = string.Join(", ", roleResult.Errors.Select(e => e.Description));
                    return Result.Failure<string>(new Domain.Shared.Error("AppUser.AssignRole", errors));
                }

                // Raise UserCreatedDomainEvent so the Outbox processor can sync the
                // new user to the Neo4j social graph asynchronously. The event is
                // persisted in the SAME transaction as the user via the AppDbContext
                // SaveChangesAsync override (which converts IHasDomainEvents into
                // OutboxMessage rows). This guarantees atomicity: either the user,
                // the role, and the outbox row commit together, or none do.
                user.AddDomainEvent(new UserCreatedDomainEvent(
                    UserId: user.Id,
                    Email: user.Email ?? string.Empty,
                    FirstName: user.FirstName,
                    LastName: user.LastName,
                    AvatarUrl: user.AvatarUrl,
                    CreatedAt: DateTime.UtcNow));

                await _unitOfWork.SaveChangesAsync(cancellationToken);
                await _unitOfWork.CommitTransactionAsync(cancellationToken);

                return Result.Success(_tokenService.CreateJWTToken(user, new List<string> { "User" }));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error during user registration for {Email}", request.Email);
                await _unitOfWork.RollbackTransactionAsync(cancellationToken);
                return Result.Failure<string>(new Domain.Shared.Error("AppUser.CreatingAccount", ex.Message));
            }
        }
    }
}
