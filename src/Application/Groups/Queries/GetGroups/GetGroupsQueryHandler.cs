using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Groups;
using Application.Shared;
using Domain.Shared;

namespace Application.Groups.Queries.GetGroups;

internal sealed class GetGroupsQueryHandler
    : IQueryHandler<GetGroupsQuery, PagedList<GroupCardDto>>
{
    private readonly IGroupListingRepository _repository;

    public GetGroupsQueryHandler(IGroupListingRepository repository) => _repository = repository;

    public async Task<Result<PagedList<GroupCardDto>>> Handle(
        GetGroupsQuery request,
        CancellationToken cancellationToken)
    {
        var page = Math.Max(1, request.Page);
        var pageSize = Math.Clamp(request.PageSize, 1, 50);

        var result = await _repository.GetGroupsAsync(
            request.CurrentUserId,
            request.IsJoining,
            page,
            pageSize,
            request.SearchTerm,
            cancellationToken);

        return Result.Success(result);
    }
}
