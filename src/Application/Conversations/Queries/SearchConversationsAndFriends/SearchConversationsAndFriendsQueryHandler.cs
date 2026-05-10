using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Conversations;
using Application.DTOs.Search;
using Domain.Shared;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Conversations.Queries.SearchConversationsAndFriends
{
    internal sealed class SearchConversationsAndFriendsQueryHandler
        : IQueryHandler<SearchConversationsAndFriendsQuery, GlobalSearchResponse>
    {
        private readonly IConversationRepository _conversationRepository;
        private readonly IFriendshipRepository _friendshipRepository;

        public SearchConversationsAndFriendsQueryHandler(
            IConversationRepository conversationRepository,
            IFriendshipRepository friendshipRepository)
        {
            _conversationRepository = conversationRepository;
            _friendshipRepository = friendshipRepository;
        }

        public async Task<Result<GlobalSearchResponse>> Handle(
            SearchConversationsAndFriendsQuery request,
            CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.SearchTerm))
            {
                return Result.Success(new GlobalSearchResponse(new List<ConversationSearchResponse>()));
            }

            // Execute the three specialized paginated searches in parallel
            var groupTask = _conversationRepository.SearchGroupConversationsAsync(
                request.UserId,
                request.SearchTerm,
                request.PageNumber,
                request.PageSize,
                cancellationToken);

            var oneToOneTask = _conversationRepository.SearchOneToOneConversationsAsync(
                request.UserId,
                request.SearchTerm,
                request.PageNumber,
                request.PageSize,
                cancellationToken);

            var friendsTask = _friendshipRepository.SearchFriendsToChatAsync(
                request.UserId,
                request.SearchTerm,
                request.PageNumber,
                request.PageSize,
                cancellationToken);

            await Task.WhenAll(groupTask, oneToOneTask, friendsTask);

            // 1. Map Group Conversations
            var groupResults = groupTask.Result.Select(c => 
                new ConversationSearchResponse(
                    Id: c.Id.ToString(),
                    Name: c.Name ?? "Unnamed Group",
                    ImageUrl: null,
                    IsOneToOne: false,
                    IsNotAConversation: false,
                    OtherUserId: null
                ));

            // 2. Map 1:1 Conversations
            var oneToOneResults = oneToOneTask.Result.Select(c => 
            {
                var otherMember = c.Members.FirstOrDefault(m => m.UserId != request.UserId);
                return new ConversationSearchResponse(
                    Id: c.Id.ToString(),
                    Name: otherMember != null ? $"{otherMember.User.FirstName} {otherMember.User.LastName}".Trim() : "Unknown User",
                    ImageUrl: otherMember?.User.AvatarUrl,
                    IsOneToOne: true,
                    IsNotAConversation: false,
                    OtherUserId: otherMember?.UserId
                );
            });

            // 3. Map New Friends (Not yet in a conversation)
            var friendResults = friendsTask.Result.Select(u => new ConversationSearchResponse(
                Id: u.Id.ToString(),
                Name: $"{u.FirstName} {u.LastName}".Trim(),
                ImageUrl: u.AvatarUrl,
                IsOneToOne: true,
                IsNotAConversation: true,
                OtherUserId: u.Id
            ));

            // Merge and return (sorted by Name)
            var allResults = groupResults
                .Concat(oneToOneResults)
                .Concat(friendResults)
                .OrderBy(r => r.Name)
                .ToList();

            return Result.Success(new GlobalSearchResponse(allResults));
        }
    }
}
