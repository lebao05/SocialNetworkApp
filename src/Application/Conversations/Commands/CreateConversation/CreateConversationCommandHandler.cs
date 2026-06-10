using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Conversations;
using Domain.Entities;
using Domain.Enums;
using Domain.Shared;

namespace Application.Conversations.Commands.CreateConversation
{
    internal sealed class CreateConversationCommandHandler
        : ICommandHandler<CreateConversationCommand, ConversationDetailDto>
    {
        private readonly IConversationRepository _conversationRepository;
        private readonly IUserRepository _userRepository;
        private readonly IUnitOfWork _unitOfWork;

        public CreateConversationCommandHandler(
            IConversationRepository conversationRepository,
            IUserRepository userRepository,
            IUnitOfWork unitOfWork)
        {
            _conversationRepository = conversationRepository;
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<ConversationDetailDto>> Handle(
            CreateConversationCommand request,
            CancellationToken cancellationToken)
        {
            if (!await _userRepository.ExistsAsync(request.CreatorId, cancellationToken))
            {
                return Result.Failure<ConversationDetailDto>(
                    new Error("User.NotFound", "Creator not found"));
            }

            if (request.ParticipantIds == null || !request.ParticipantIds.Any())
            {
                return Result.Failure<ConversationDetailDto>(
                    new Error("Conversation.Invalid", "A conversation must have participants"));
            }

            bool isOneOnOne = request.ParticipantIds.Count == 1;

            Conversation conversation = new Conversation(
                id: 0,
                isOneOnOne,
                request.Name,
                request.CreatorId
            );

            conversation.AddMember(request.CreatorId, ConversationRole.Owner);

            foreach (var participantId in request.ParticipantIds)
            {
                if (!await _userRepository.ExistsAsync(participantId, cancellationToken))
                {
                    return Result.Failure<ConversationDetailDto>(
                        new Error("User.NotFound", $"Participant {participantId} not found"));
                }

                conversation.AddMember(participantId, ConversationRole.Member);
            }

            await _conversationRepository.AddAsync(conversation, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            var createdConversation = await _conversationRepository.GetByIdAsync(conversation.Id, cancellationToken);

            var response = ConversationDetailDto.FromDomain(createdConversation!, request.CreatorId);

            return Result<ConversationDetailDto>.Success(response);
        }
    }
}
