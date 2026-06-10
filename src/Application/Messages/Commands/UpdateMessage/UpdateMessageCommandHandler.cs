using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Messages;
using Domain.Shared;

namespace Application.Messages.Commands.UpdateMessage
{
    internal sealed class UpdateMessageCommandHandler
        : ICommandHandler<UpdateMessageCommand, MessageDto>
    {
        private readonly IMessageRepository _messageRepository;
        private readonly IUnitOfWork _unitOfWork;

        public UpdateMessageCommandHandler(
            IMessageRepository messageRepository,
            IUnitOfWork unitOfWork)
        {
            _messageRepository = messageRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<MessageDto>> Handle(
            UpdateMessageCommand request,
            CancellationToken cancellationToken)
        {
            var message = await _messageRepository.GetByIdAsync(
                request.MessageId,
                cancellationToken);

            if (message is null)
            {
                return Result.Failure<MessageDto>(
                    new Error("Message.NotFound", "Message not found"));
            }

            var result = message.UpdateContent(request.UserId, request.NewContent);

            if (result.IsFailure)
                return Result.Failure<MessageDto>(result.Error);

            _messageRepository.Update(message);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success(MessageDto.FromDomain(message));
        }
    }
}
