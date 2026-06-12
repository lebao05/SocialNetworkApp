using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Conversations;
using Domain.Shared;

namespace Application.Conversations.Commands.UpdateConversation;

internal sealed class UpdateConversationCommandHandler
    : ICommandHandler<UpdateConversationCommand, ConversationDetailDto>
{
    private readonly IConversationRepository _conversationRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateConversationCommandHandler(
        IConversationRepository conversationRepository,
        IUnitOfWork unitOfWork)
    {
        _conversationRepository = conversationRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<ConversationDetailDto>> Handle(
        UpdateConversationCommand request,
        CancellationToken cancellationToken)
    {
        var conversation = await _conversationRepository.GetByIdAsync(
            request.ConversationId, cancellationToken);

        if (conversation is null)
        {
            return Result.Failure<ConversationDetailDto>(
                new Error("Conversation.NotFound", "Conversation not found."));
        }

        var updateResult = conversation.UpdateConversation(
            request.RequesterId,
            request.Name,
            request.Theme,
            request.DefaultReaction);

        if (updateResult.IsFailure)
            return Result.Failure<ConversationDetailDto>(updateResult.Error);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var updated = await _conversationRepository.GetByIdAsync(
            request.ConversationId, cancellationToken);

        return ConversationDetailDto.FromDomain(updated!, request.RequesterId);
    }
}
