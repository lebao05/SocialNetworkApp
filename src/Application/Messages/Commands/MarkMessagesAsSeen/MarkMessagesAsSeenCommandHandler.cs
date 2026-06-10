using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Shared;

namespace Application.Messages.Commands.MarkMessagesAsSeen;

internal sealed class MarkMessagesAsSeenCommandHandler
    : ICommandHandler<MarkMessagesAsSeenCommand>
{
    private readonly IConversationRepository _conversationRepository;
    private readonly IUnitOfWork _unitOfWork;

    public MarkMessagesAsSeenCommandHandler(
        IConversationRepository conversationRepository,
        IUnitOfWork unitOfWork)
    {
        _conversationRepository = conversationRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result> Handle(MarkMessagesAsSeenCommand request, CancellationToken cancellationToken)
    {
        var member = await _conversationRepository.GetMemberAsync(
            request.ConversationId,
            request.UserId,
            cancellationToken);

        if (member is null)
        {
            return Result.Failure(new Error("Conversation.MemberNotFound", "You are not a member of this conversation"));
        }

        member.MarkAsSeen(request.LastReadMessageId);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
