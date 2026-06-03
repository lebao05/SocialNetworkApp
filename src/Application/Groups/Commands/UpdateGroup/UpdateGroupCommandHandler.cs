using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Shared;

namespace Application.Groups.Commands.UpdateGroup
{
    internal sealed class UpdateGroupCommandHandler : ICommandHandler<UpdateGroupCommand>
    {
        private readonly IGroupRepository _groupRepository;
        private readonly IUnitOfWork _unitOfWork;

        public UpdateGroupCommandHandler(
            IGroupRepository groupRepository,
            IUnitOfWork unitOfWork)
        {
            _groupRepository = groupRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result> Handle(UpdateGroupCommand request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
            {
                return Result.Failure(new Error(
                    "Group.Validation",
                    "Group name is required."));
            }

            var group = await _groupRepository.GetByIdAsync(request.GroupId, cancellationToken);
            if (group is null)
            {
                return Result.Failure(new Error(
                    "Group.NotFound",
                    $"Group with id {request.GroupId} was not found."));
            }

            if (group.OwnerUserId != request.RequesterUserId)
            {
                return Result.Failure(new Error(
                    "Group.Authorization",
                    "Only the group owner can update group settings."));
            }

            group.Update(
                request.Name,
                request.Description,
                request.PrivacyType,
                request.IsPostApprovalRequired,
                request.IsGroupJoinApprovalRequired,
                request.AllowAnonymousPost);

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success();
        }
    }
}
