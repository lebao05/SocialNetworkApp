using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Entities;
using Domain.Shared;

namespace Application.Messages.Commands.ReactToMessage;

internal sealed class ReactToMessageCommandHandler : ICommandHandler<ReactToMessageCommand, long>
{
    private readonly IMessageRepository _messageRepository;
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;

    public ReactToMessageCommandHandler(
        IMessageRepository messageRepository,
        IUserRepository userRepository,
        IUnitOfWork unitOfWork)
    {
        _messageRepository = messageRepository;
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<long>> Handle(ReactToMessageCommand request, CancellationToken cancellationToken)
    {
        var userExists = await _userRepository.ExistsAsync(request.UserId, cancellationToken);
        if (!userExists)
        {
            return Result.Failure<long>(new Error(
                "User.NotFound",
                $"The user with Id {request.UserId} was not found."));
        }

        var message = await _messageRepository.GetByIdAsync(request.MessageId, cancellationToken);
        if (message is null)
        {
            return Result.Failure<long>(new Error(
                "Message.NotFound",
                $"The message with Id {request.MessageId} was not found."));
        }

        var existingReaction = await _messageRepository.GetMessageReactionAsync(request.MessageId, request.UserId, cancellationToken);
        if (existingReaction is not null)
        {
            if (request.ReactionType is null)
            {
                _messageRepository.RemoveReaction(existingReaction);
            }
            else
            {
                existingReaction.UpdateReaction(request.ReactionType.Value);
            }

            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return Result.Success(request.MessageId);
        }

        if (request.ReactionType is null)
        {
            return Result.Success(request.MessageId);
        }

        var reaction = new MessageReaction(
            id: 0,
            userId: request.UserId,
            messageId: request.MessageId,
            reactionType: request.ReactionType.Value);

        _messageRepository.AddReaction(reaction);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success(request.MessageId);
    }
}
