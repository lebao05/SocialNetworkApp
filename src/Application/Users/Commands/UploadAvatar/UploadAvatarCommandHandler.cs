using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Shared;
using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Users.Commands.UploadAvatar
{
    internal sealed class UploadAvatarCommandHandler : ICommandHandler<UploadAvatarCommand, string>
    {
        private readonly IUserRepository _userRepository;
        private readonly IUploadService _uploadService;
        private readonly IUnitOfWork _unitOfWork;

        public UploadAvatarCommandHandler(
            IUserRepository userRepository,
            IUploadService uploadService,
            IUnitOfWork unitOfWork)
        {
            _userRepository = userRepository;
            _uploadService = uploadService;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<string>> Handle(UploadAvatarCommand request, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);
            if (user is null)
            {
                return Result.Failure<string>(new Error(
                    "User.NotFound",
                    $"The user with Id {request.UserId} was not found."));
            }

            try
            {
                var avatarUrl = await _uploadService.UploadImageAsync(request.FileStream, request.FileName);

                user.UpdateAvatarUrl(avatarUrl);

                await _unitOfWork.SaveChangesAsync(cancellationToken);

                return Result.Success(avatarUrl);
            }
            catch (Exception ex)
            {
                return Result.Failure<string>(new Error("Avatar.UploadFailed", ex.Message));
            }
        }
    }
}
