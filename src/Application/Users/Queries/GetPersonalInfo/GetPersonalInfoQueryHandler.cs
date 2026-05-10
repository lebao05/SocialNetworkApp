using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Users;
using Domain.Shared;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Users.Queries.GetPersonalInfo
{
    internal sealed class GetPersonalInfoQueryHandler
        : IQueryHandler<GetPersonalInfoQuery, PersonalInfoResponse>
    {
        private readonly IUserRepository _userRepository;

        public GetPersonalInfoQueryHandler(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<Result<PersonalInfoResponse>> Handle(
            GetPersonalInfoQuery request,
            CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);

            if (user is null)
            {
                return Result.Failure<PersonalInfoResponse>(new Error(
                    "User.NotFound",
                    $"The user with Id {request.UserId} was not found."));
            }

            var response = new PersonalInfoResponse(
                user.Id,
                user.FirstName,
                user.LastName,
                user.AvatarUrl,
                user.Gender.ToString());

            return Result.Success(response);
        }
    }
}
