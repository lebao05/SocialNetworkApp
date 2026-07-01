using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.Reels.Commands.CreateReelComment;
using Domain.Entities;
using Domain.Shared;

namespace Application.Reels.Commands.CreateReelComment;

internal sealed class CreateReelCommentCommandHandler : ICommandHandler<CreateReelCommentCommand, long>
{
    private readonly IReelRepository _reelRepository;
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateReelCommentCommandHandler(
        IReelRepository reelRepository,
        IUserRepository userRepository,
        IUnitOfWork unitOfWork)
    {
        _reelRepository = reelRepository;
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<long>> Handle(CreateReelCommentCommand request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Content))
        {
            return Result.Failure<long>(new Error(
                "Comment.Empty",
                "Comment content cannot be empty."));
        }

        var userExists = await _userRepository.ExistsAsync(request.UserId, cancellationToken);
        if (!userExists)
        {
            return Result.Failure<long>(new Error(
                "User.NotFound",
                $"The user with Id {request.UserId} was not found."));
        }

        var reel = await _reelRepository.GetByIdAsync(request.ReelId, cancellationToken);
        if (reel is null)
        {
            return Result.Failure<long>(new Error(
                "Reel.NotFound",
                $"The reel with Id {request.ReelId} was not found."));
        }

        ReelComment? parentComment = null;
        if (request.ParentCommentId.HasValue)
        {
            parentComment = await _reelRepository.GetCommentByIdAsync(request.ParentCommentId.Value, cancellationToken);
            if (parentComment is null)
            {
                return Result.Failure<long>(new Error(
                    "Comment.ParentNotFound",
                    $"The parent comment with Id {request.ParentCommentId.Value} was not found."));
            }

            if (parentComment.ReelId != request.ReelId)
            {
                return Result.Failure<long>(new Error(
                    "Comment.ParentMismatch",
                    "The parent comment must belong to the same reel."));
            }

            if (parentComment.ParentCommentId.HasValue)
            {
                return Result.Failure<long>(new Error(
                    "Comment.DepthExceeded",
                    "Comment replies are limited to one level of nesting."));
            }
        }

        if (request.RepliedUserId.HasValue)
        {
            var repliedUserExists = await _userRepository.ExistsAsync(request.RepliedUserId.Value, cancellationToken);
            if (!repliedUserExists)
            {
                return Result.Failure<long>(new Error(
                    "User.RepliedUserNotFound",
                    $"The replied user with Id {request.RepliedUserId.Value} was not found."));
            }
        }
        else if (parentComment is not null)
        {
            request = request with { RepliedUserId = parentComment.UserId };
        }

        var comment = new ReelComment(
            id: 0,
            reelId: request.ReelId,
            userId: request.UserId,
            parentCommentId: request.ParentCommentId,
            content: request.Content,
            repliedUserId: request.RepliedUserId);

        _reelRepository.AddComment(comment);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success(comment.Id);
    }
}
