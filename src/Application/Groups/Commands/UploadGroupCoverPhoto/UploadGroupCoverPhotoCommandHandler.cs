using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Shared;
using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Groups.Commands.UploadGroupCoverPhoto
{
    internal sealed class UploadGroupCoverPhotoCommandHandler : ICommandHandler<UploadGroupCoverPhotoCommand, string>
    {
        private readonly IGroupRepository _groupRepository;
        private readonly IUploadService _uploadService;
        private readonly IUnitOfWork _unitOfWork;

        public UploadGroupCoverPhotoCommandHandler(
            IGroupRepository groupRepository,
            IUploadService uploadService,
            IUnitOfWork unitOfWork)
        {
            _groupRepository = groupRepository;
            _uploadService = uploadService;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<string>> Handle(UploadGroupCoverPhotoCommand request, CancellationToken cancellationToken)
        {
            var group = await _groupRepository.GetByIdAsync(request.GroupId, cancellationToken);
            if (group is null)
            {
                return Result.Failure<string>(new Error(
                    "Group.NotFound",
                    $"The group with Id {request.GroupId} was not found."));
            }

            if (group.OwnerUserId != request.OwnerUserId)
            {
                return Result.Failure<string>(new Error(
                    "Group.AccessDenied",
                    "Only the group owner can update the group image."));
            }

            try
            {
                var imageUrl = await _uploadService.UploadImageAsync(request.FileStream, request.FileName);
                group.Update(group.Name, group.Description, group.PrivacyType, imageUrl);

                await _unitOfWork.SaveChangesAsync(cancellationToken);
                return Result.Success(imageUrl);
            }
            catch (Exception ex)
            {
                return Result.Failure<string>(new Error("GroupCoverPhoto.UploadFailed", ex.Message));
            }
        }
    }
}
