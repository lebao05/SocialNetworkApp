using Application.Abstractions;
using Application.Abstractions.Messaging;
using Domain.Entities;
using Domain.Shared;
using Microsoft.AspNetCore.Identity;
namespace Application.Auth.Commands.Login
{

    public sealed class LoginCommandHandler : ICommandHandler<LoginCommand, string>
    {
        private readonly UserManager<User> _userManager;
        private readonly ITokenService _tokenService;
        public LoginCommandHandler(UserManager<User> userManager, ITokenService tokenService)
        {
            _userManager = userManager;
            _tokenService = tokenService;
        }

        public async Task<Result<string>> Handle(LoginCommand request, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
                return Result.Failure<string>(new Error("AppUser.NotFound", "Can't find a user with the email"));
            bool isPasswordValid = await _userManager.CheckPasswordAsync(user, request.Password);
            if (isPasswordValid! == false)
                return Result.Failure<string>(new Error("AppUser.InvalidPassword", "The password is invalid"));
            var roles = await _userManager.GetRolesAsync(user);
            string token = _tokenService.CreateJWTToken(user, roles);
            return Result.Success(token);
        }
    }
}
