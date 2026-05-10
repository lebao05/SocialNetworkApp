using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Conversations;
using Domain.Shared;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Conversations.Queries.GetConversationDetailByUserId
{
    internal sealed class GetConversationDetailByUserIdQueryHandler
        : IQueryHandler<GetConversationDetailByUserIdQuery, ConversationDetailDto>
    {
        private readonly IConversationRepository _conversationRepository;
        private readonly IUserRepository _userRepository;

        public GetConversationDetailByUserIdQueryHandler(
            IConversationRepository conversationRepository,
            IUserRepository userRepository)
        {
            _conversationRepository = conversationRepository;
            _userRepository = userRepository;
        }

        public async Task<Result<ConversationDetailDto>> Handle(
            GetConversationDetailByUserIdQuery request,
            CancellationToken cancellationToken)
        {
            // 1. Try to find an existing conversation
            var conversation = await _conversationRepository.GetOneToOneConversationAsync(
                request.UserId,
                request.TargetUserId,
                cancellationToken);

            if (conversation is not null)
            {
                return Result.Success(
                    ConversationDetailDto.FromDomain(conversation, request.UserId)
                );
            }

            // 2. If no conversation exists, fetch info for both users
            var currentUser = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);
            var targetUser = await _userRepository.GetByIdAsync(request.TargetUserId, cancellationToken);

            if (currentUser is null || targetUser is null)
            {
                return Result.Failure<ConversationDetailDto>(new Error(
                    "User.NotFound",
                    "One or both users were not found."));
            }

            // 3. Return a "potential" conversation detail
            return Result.Success(
                ConversationDetailDto.FromUsers(currentUser, targetUser)
            );
        }
    }
}
