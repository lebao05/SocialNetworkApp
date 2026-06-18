using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Shared;
using Microsoft.Extensions.Logging;

namespace Application.Conversations.Commands.BlockUser;

internal sealed class BlockUserCommandHandler
    : ICommandHandler<BlockUserCommand, bool>
{
    private readonly IConversationRepository _conversationRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<BlockUserCommandHandler> _logger;

    public BlockUserCommandHandler(
        IConversationRepository conversationRepository,
        IUnitOfWork unitOfWork,
        ILogger<BlockUserCommandHandler> logger)
    {
        _conversationRepository = conversationRepository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<Result<bool>> Handle(
        BlockUserCommand request,
        CancellationToken cancellationToken)
    {
        if (request.CurrentUserId == request.TargetUserId)
        {
            return Result.Failure<bool>(
                new Error("Block.Invalid", "You cannot block yourself."));
        }

        var added = await _conversationRepository.AddBlockAsync(
            request.CurrentUserId,
            request.TargetUserId,
            cancellationToken);

        if (!added)
        {
            return Result.Success(false);
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "User {CurrentUserId} blocked user {TargetUserId}",
            request.CurrentUserId, request.TargetUserId);

        return Result.Success(true);
    }
}
