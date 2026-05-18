using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Shared;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Users.Commands.UpdateInfo
{
    internal sealed class UpdateInfoCommandHandler : ICommandHandler<UpdateInfoCommand>
    {
        private readonly IUserRepository _userRepository;
        private readonly IUnitOfWork _unitOfWork;

        public UpdateInfoCommandHandler(
            IUserRepository userRepository,
            IUnitOfWork unitOfWork)
        {
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
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

            return Result.Success();
        }
    }
}
