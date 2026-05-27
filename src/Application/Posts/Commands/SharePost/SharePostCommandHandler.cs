using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Entities;
using Domain.Enums;
using Domain.Shared;

namespace Application.Posts.Commands.SharePost
{
    internal sealed class SharePostCommandHandler : ICommandHandler<SharePostCommand, long>
    {
        private readonly IPostRepository _postRepository;
        private readonly IUserRepository _userRepository;
        private readonly IUnitOfWork _unitOfWork;

        public SharePostCommandHandler(
            IPostRepository postRepository,
            IUserRepository userRepository,
            IUnitOfWork unitOfWork)
        {
            _postRepository = postRepository;
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<long>> Handle(SharePostCommand request, CancellationToken cancellationToken)
        {
            // Verify author exists
            var authorExists = await _userRepository.ExistsAsync(request.AuthorId, cancellationToken);
            if (!authorExists)
            {
                return Result.Failure<long>(new Error(
                    "User.NotFound",
                    $"The user with Id {request.AuthorId} was not found."));
            }

            // Verify post exists
            var postToShare = await _postRepository.GetByIdAsync(request.PostId, cancellationToken);
            if (postToShare is null)
            {
                return Result.Failure<long>(new Error(
                    "Post.NotFound",
                    $"The post with Id {request.PostId} was not found."));
            }

            // Determine the actual post to link - prevent two-level sharing
            // If the post being shared is already a share, link to the original post instead
            long sharePostId = postToShare.SharePostId ?? request.PostId;

            // Determine visibility
            var visibility = request.GroupId.HasValue
                ? PostVisibility.Group
                : request.Visibility;

            // Create new shared post
            var sharedPost = new Post(
                id: 0,
                authorId: request.AuthorId,
                groupId: request.GroupId,
                content: null,
                visibility: visibility,
                sharePostId: sharePostId,
                locationTag: null,
                feelingActivity: null);

            _postRepository.Add(sharedPost);

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success(sharedPost.Id);
        }
    }
}
