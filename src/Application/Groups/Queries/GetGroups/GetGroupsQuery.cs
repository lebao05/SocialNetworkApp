using Application.Abstractions.Messaging;
using Application.DTOs.Groups;
using Application.Shared;

namespace Application.Groups.Queries.GetGroups;

public sealed record GetGroupsQuery(
    Guid CurrentUserId,
    bool IsJoining,
    int Page = 1,
    int PageSize = 12,
    string? SearchTerm = null
) : IQuery<PagedList<GroupCardDto>>;
