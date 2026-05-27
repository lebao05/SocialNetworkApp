using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Entities;
using Domain.Enums;
using Domain.Shared;

namespace Application.Groups.Commands.CreateGroup
{
    internal sealed class CreateGroupCommandHandler : ICommandHandler<CreateGroupCommand, long>
    {
        private readonly IGroupRepository _groupRepository;
        private readonly IUserRepository _userRepository;
        private readonly IUnitOfWork _unitOfWork;

        public CreateGroupCommandHandler(
            IGroupRepository groupRepository,
            IUserRepository userRepository,
            IUnitOfWork unitOfWork)
        {
            _groupRepository = groupRepository;
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<long>> Handle(CreateGroupCommand request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
            {
                return Result.Failure<long>(new Error(
                    "Group.Validation",
                    "Group name is required."));
            }

            var userExists = await _userRepository.ExistsAsync(request.OwnerUserId, cancellationToken);
            if (!userExists)
            {
                return Result.Failure<long>(new Error(
                    "User.NotFound",
                    $"The user with Id {request.OwnerUserId} was not found."));
            }

            try
            {
                var group = new Group(
                    id: 0,
                    ownerUserId: request.OwnerUserId,
                    name: request.Name.Trim(),
                    description: null,
                    privacyType: request.PrivacyType,
                    coverPhotoUrl: null);

                _groupRepository.Add(group);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                return Result.Success(group.Id);
            }
            catch (ArgumentException ex)
            {
                return Result.Failure<long>(new Error(
                    "Group.Validation",
                    ex.Message));
            }
        }
    }
}
