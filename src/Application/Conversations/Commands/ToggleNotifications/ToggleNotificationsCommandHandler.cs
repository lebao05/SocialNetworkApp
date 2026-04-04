using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Shared;

namespace Application.Conversations.Commands.ToggleNotifications
{
    internal sealed class ToggleNotificationsCommandHandler
    : ICommandHandler<ToggleNotificationsCommand, bool>
    {
        private readonly IConversationRepository _conversationRepository;
        private readonly IUnitOfWork _unitOfWork;

        public ToggleNotificationsCommandHandler(
            IConversationRepository conversationRepository,
            IUnitOfWork unitOfWork)
        {
            _conversationRepository = conversationRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<bool>> Handle(
            ToggleNotificationsCommand request,
            CancellationToken cancellationToken)
        {
            // 1. Get the member directly using the new repository method
            var member = await _conversationRepository.GetMemberAsync(
                request.ConversationId,
                request.UserId,
                cancellationToken);

            // 2. Validate existence
            if (member is null)
            {
                return Result.Failure<bool>(new Error(
                    "ConversationMember.NotFound",
                    "User is not a member of this conversation."));
            }

            // 3. Apply Domain Logic
            member.ToggleNotifications();

            // 4. Persist
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success(member.IsNotificationOn);
        }
    }
}
