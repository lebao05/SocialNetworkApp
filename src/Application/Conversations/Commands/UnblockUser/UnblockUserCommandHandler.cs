using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Shared;
using Microsoft.Extensions.Logging;

namespace Application.Conversations.Commands.UnblockUser;

internal sealed class UnblockUserCommandHandler
    : ICommandHandler<UnblockUserCommand, bool>
{
    private readonly IConversationRepository _conversationRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<UnblockUserCommandHandler> _logger;

    public UnblockUserCommandHandler(
        IConversationRepository conversationRepository,
        IUnitOfWork unitOfWork,
        ILogger<UnblockUserCommandHandler> logger)
    {
        _conversationRepository = conversationRepository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<Result<bool>> Handle(
        UnblockUserCommand request,
        CancellationToken cancellationToken)
    {
        var removed = await _conversationRepository.RemoveBlockAsync(
            request.CurrentUserId,
            request.TargetUserId,
            cancellationToken);

        if (!removed)
        {
            return Result.Success(false);
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "User {CurrentUserId} unblocked user {TargetUserId}",
            request.CurrentUserId, request.TargetUserId);

        return Result.Success(true);
    }
}
