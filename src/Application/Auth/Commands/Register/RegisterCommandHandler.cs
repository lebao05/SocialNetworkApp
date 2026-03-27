using Application.Abstractions;
using Application.Abstractions.Messaging;
using Domain.Entities;
using Domain.Shared;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Auth.Commands.Register
{
    public sealed class RegisterCommandHandler
        : ICommandHandler<RegisterCommand, string>
    {
        private readonly ITokenService _tokenService;
        private readonly UserManager<User> _userManager;
        public RegisterCommandHandler(ITokenService tokenService, UserManager<User> userManager)
        {
            _tokenService = tokenService;
            _userManager = userManager;
        }

        public async Task<Result<string>> Handle(RegisterCommand request, CancellationToken cancellationToken)
        {
            var user = new User
            (
                request.username,
                request.email,
                request.email,
                request.address
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
                return Result.Success(_tokenService.CreateJWTToken(user, new List<string> { "User" }));
            }

            var error = string.Join(',', identityResult.Errors.Select(e => e.Description));
            return Result.Failure<string>(new Domain.Shared.Error("AppUser.CreatingAccount", error));
        }
    }
}
