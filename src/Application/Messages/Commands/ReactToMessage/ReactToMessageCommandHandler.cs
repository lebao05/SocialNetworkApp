using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Messages;
using Domain.Enums;
using Domain.Shared;

namespace Application.Messages.Commands.ReactToMessage;

internal sealed class ReactToMessageCommandHandler
    : ICommandHandler<ReactToMessageCommand, MessageDto>
{
    private readonly IMessageRepository _messageRepository;
    private readonly IUnitOfWork _unitOfWork;

    public ReactToMessageCommandHandler(
        IMessageRepository messageRepository,
        IUnitOfWork unitOfWork)
    {
        _messageRepository = messageRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<MessageDto>> Handle(ReactToMessageCommand request, CancellationToken cancellationToken)
    {
        var message = await _messageRepository.GetByIdWithIncludesAsync(request.MessageId, cancellationToken);

        if (message is null)
        {
            return Result.Failure<MessageDto>(new Error("Message.NotFound", "Message not found"));
        }

        if (!string.IsNullOrEmpty(request.ReactionType) &&
            Enum.TryParse<ReactionType>(request.ReactionType, ignoreCase: true, out var parsedReaction))
        {
            message.ToggleReaction(request.UserId, parsedReaction);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }

        return Result.Success(MessageDto.FromDomain(message));
    }
}
