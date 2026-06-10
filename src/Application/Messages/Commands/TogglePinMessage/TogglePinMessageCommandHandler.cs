using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Shared;

namespace Application.Messages.Commands.TogglePinMessage;

internal sealed class TogglePinMessageCommandHandler : ICommandHandler<TogglePinMessageCommand, bool>
{
    private readonly IMessageRepository _messageRepository;
    private readonly IConversationRepository _conversationRepository;
    private readonly IUnitOfWork _unitOfWork;

    public TogglePinMessageCommandHandler(
        IMessageRepository messageRepository,
        IConversationRepository conversationRepository,
        IUnitOfWork unitOfWork)
    {
        _messageRepository = messageRepository;
        _conversationRepository = conversationRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<bool>> Handle(
        TogglePinMessageCommand request,
        CancellationToken cancellationToken)
    {
        var message = await _messageRepository.GetByIdAsync(request.MessageId, cancellationToken);
        if (message is null)
        {
            return Result.Failure<bool>(new Error(
                "Message.NotFound",
                $"The message with Id {request.MessageId} was not found."));
        }

        var member = await _conversationRepository.GetMemberAsync(
            message.ConversationId, request.UserId, cancellationToken);
        if (member is null)
        {
            return Result.Failure<bool>(new Error(
                "Conversation.Forbidden",
                "You are not a member of this conversation."));
        }

        message.TogglePin();
        _messageRepository.Update(message);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success(message.IsPinned);
    }
}
