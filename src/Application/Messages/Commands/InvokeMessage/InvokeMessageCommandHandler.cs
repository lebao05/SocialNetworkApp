using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Shared;

namespace Application.Messages.Commands.InvokeMessage;

internal sealed class InvokeMessageCommandHandler
    : ICommandHandler<InvokeMessageCommand, long>
{
    private readonly IMessageRepository _messageRepository;
    private readonly IUnitOfWork _unitOfWork;

    public InvokeMessageCommandHandler(
        IMessageRepository messageRepository,
        IUnitOfWork unitOfWork)
    {
        _messageRepository = messageRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<long>> Handle(
        InvokeMessageCommand request,
        CancellationToken cancellationToken)
    {
        var message = await _messageRepository.GetByIdAsync(request.MessageId, cancellationToken);

        if (message is null)
        {
            return Result.Failure<long>(new Error("Message.NotFound", "Message not found"));
        }

        var result = message.Revoke(request.UserId);

        if (result.IsFailure)
        {
            return Result.Failure<long>(result.Error);
        }

        _messageRepository.Update(message);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success(message.Id);
    }
}
