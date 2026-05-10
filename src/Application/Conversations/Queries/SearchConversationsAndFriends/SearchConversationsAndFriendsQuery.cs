using Application.Abstractions.Messaging;
using Application.DTOs.Search;
using System;

namespace Application.Conversations.Queries.SearchConversationsAndFriends
{
    public sealed record SearchConversationsAndFriendsQuery(
        Guid UserId, 
        string SearchTerm,
        int PageNumber,
        int PageSize) : IQuery<GlobalSearchResponse>;
}
