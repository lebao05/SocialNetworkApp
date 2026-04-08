using Application.Abstractions.Messaging;
using Domain.Shared;
using Microsoft.AspNetCore.Identity;

namespace Application.Users.Queries.GetUserProfile;

internal sealed class GetUserProfileQueryHandler
    : IQueryHandler<GetUserProfileQuery, UserProfileResponse>
{
    private readonly UserManager<Domain.Entities.User> _userManager;

    public GetUserProfileQueryHandler(UserManager<Domain.Entities.User> userManager)
    {
        _userManager = userManager;
    }

    public async Task<Result<UserProfileResponse>> Handle(
        GetUserProfileQuery request,
        CancellationToken cancellationToken)
    {
        // 1. Fetch the user using the Identity UserManager or a Repository
        var user = await _userManager.FindByIdAsync(request.UserId.ToString());

        if (user is null)
        {
            return Result.Failure<UserProfileResponse>(new Error(
                "User.NotFound",
                $"User with ID {request.UserId} was not found."));
        }

        // 2. Map Domain Entity to Response DTO
        var response = new UserProfileResponse(
            user.Id,
            user.Email ?? string.Empty,
            user.FirstName,
            user.LastName,
            user.DateOfBirth,
            user.AvatarUrl,
            user.Gender.ToString()
        );
        return Result.Success(response);
    }
}