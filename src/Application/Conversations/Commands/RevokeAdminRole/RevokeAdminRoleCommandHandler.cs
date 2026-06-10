using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Shared;

namespace Application.Conversations.Commands.RevokeAdminRole;

internal sealed class RevokeAdminRoleCommandHandler
    : ICommandHandler<RevokeAdminRoleCommand>
{
    private readonly IConversationRepository _conversationRepository;
    private readonly IUnitOfWork _unitOfWork;

    public RevokeAdminRoleCommandHandler(
        IConversationRepository conversationRepository,
        IUnitOfWork unitOfWork)
    {
        _conversationRepository = conversationRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result> Handle(
        RevokeAdminRoleCommand request,
        CancellationToken cancellationToken)
    {
        var conversation = await _conversationRepository.GetByIdAsync(request.ConversationId, cancellationToken);

        if (conversation is null)
        {
            return Result.Failure(new Error("Conversation.NotFound", "Conversation not found."));
        }

        var result = conversation.RevokeAdminRole(request.OwnerId, request.TargetUserId);

        if (result.IsFailure)
        {
            return result;
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
