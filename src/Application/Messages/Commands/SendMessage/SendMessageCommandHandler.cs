using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.Abstractions.Security;
using Domain.Entities;
using Domain.Shared;

namespace Application.Messages.Commands.SendMessage
{
    internal sealed class SendMessageCommandHandler
        : ICommandHandler<SendMessageCommand, long>
    {
        private readonly IConversationRepository _conversationRepository;
        private readonly IMessageRepository _messageRepository;
        private readonly IBlindIndexService _blindIndexService;
        private readonly IUnitOfWork _unitOfWork;

        public SendMessageCommandHandler(
            IMessageRepository messageRepository,
            IConversationRepository conversationRepository,
            IBlindIndexService blindIndexService,
            IUnitOfWork unitOfWork)
        {
            _messageRepository = messageRepository;
            _conversationRepository = conversationRepository;
            _blindIndexService = blindIndexService;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<long>> Handle(
            SendMessageCommand request,
            CancellationToken cancellationToken)
        {
            // 1. Get Conversation with Members
            var conversation = await _conversationRepository.GetByIdAsync(request.ConversationId, cancellationToken);

            if (conversation is null)
            {
                return Result.Failure<long>(new Error("Conversation.NotFound", "Conversation not found"));
            }

            // 2. Identify the Sender within the conversation
            var senderMember = conversation.Members.FirstOrDefault(m => m.UserId == request.SenderId);

            if (senderMember is null)
            {
                return Result.Failure<long>(new Error("Conversation.Forbidden", "You are not a member of this conversation"));
            }

            // 3. Create the Message Entity
            // Qualify the Message type to avoid conflict with a namespace named 'Message'
            var message = new Message(
                id: 0,
                conversationId: conversation.Id,
                senderId: request.SenderId,
                content: request.Content
            );

            // 4. Index the content for search
            var searchContent = _blindIndexService.GenerateSearchContent(request.Content);
            message.UpdateSearchContent(searchContent);

            // 5. Persist
            // If your repository/UnitOfWork tracks the Message aggregate:
            _messageRepository.Add(message);

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success(message.Id);
        }
    }
}
