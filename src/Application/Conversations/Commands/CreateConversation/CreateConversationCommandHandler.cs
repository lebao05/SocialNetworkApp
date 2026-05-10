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
        : ICommandHandler<CreateConversationCommand, ConversationResponse>
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

        public async Task<Result<ConversationResponse>> Handle(
            CreateConversationCommand request,
            CancellationToken cancellationToken)
        {
            // 1. Validate that the creator exists
            if (!await _userRepository.ExistsAsync(request.CreatorId, cancellationToken))
            {
                return Result.Failure<ConversationResponse>(
                    new Error("User.NotFound", "Creator not found"));
            }

            // 2. Ensure there are participants (excluding the creator)
            if (request.ParticipantIds == null || !request.ParticipantIds.Any())
            {
                return Result.Failure<ConversationResponse>(
                    new Error("Conversation.Invalid", "A conversation must have participants"));
            }
            bool isOneOnOne = request.ParticipantIds.Count == 1;
            // 3. Create the Conversation Entity
            // Note: Logic for Group vs Private can be handled in the Domain Entity
            Conversation conversation = new Conversation(
            id: 0,
            isOneOnOne,
            request.Name
            );

            // 4. Add the creator as the first participant
            conversation.AddMember(request.CreatorId, ConversationRole.Admin);

            // 5. Add other participants and validate existence
            foreach (var participantId in request.ParticipantIds)
            {
                if (!await _userRepository.ExistsAsync(participantId, cancellationToken))
                {
                    return Result.Failure<ConversationResponse>(
                        new Error("User.NotFound", $"Participant {participantId} not found"));
                }

                conversation.AddMember(participantId, ConversationRole.Member);
            }

            // 6. Persist to Database
            await _conversationRepository.AddAsync(conversation, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            // 7. Re-fetch with includes to ensure User data is loaded for the DTO
            var createdConversation = await _conversationRepository.GetByIdAsync(conversation.Id, cancellationToken);

            var response = ConversationResponse.FromDomain(createdConversation!, request.CreatorId);

            return Result<ConversationResponse>.Success(response);
        }
    }
}
