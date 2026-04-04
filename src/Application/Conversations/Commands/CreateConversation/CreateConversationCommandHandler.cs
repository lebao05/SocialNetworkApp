using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Entities;
using Domain.Enums;
using Domain.Shared;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Conversations.Commands.CreateConversation
{
    internal sealed class CreateConversationCommandHandler
        : ICommandHandler<CreateConversationCommand, long>
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

        public async Task<Result<long>> Handle(
            CreateConversationCommand request,
            CancellationToken cancellationToken)
        {
            // 1. Validate that the creator exists
            if (!await _userRepository.ExistsAsync(request.CreatorId))
            {
                return Result.Failure<long>(
                    new Error("User.NotFound", "Creator not found"));
            }

            // 2. Ensure there are participants (excluding the creator)
            if (request.ParticipantIds == null || !request.ParticipantIds.Any())
            {
                return Result.Failure<long>(
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
                if (!await _userRepository.ExistsAsync(participantId))
                {
                    return Result.Failure<long>(
                        new Error("User.NotFound", $"Participant {participantId} not found"));
                }

                conversation.AddMember(participantId, ConversationRole.Member);
            }

            // 6. Persist to Database
            await _conversationRepository.AddAsync(conversation, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            // Return the ID of the newly created conversation
            return Result.Success(conversation.Id);
        }
    }
}
