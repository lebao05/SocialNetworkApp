using System.Linq;
using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.Groups;
using Domain.Enums;
using Domain.Shared;

namespace Application.Groups.Queries.IsHavingPendingRequest
{
    internal sealed class IsHavingPendingRequestQueryHandler : IQueryHandler<IsHavingPendingRequestQuery, bool>
    {
        private readonly IGroupRepository _groupRepository;

        public IsHavingPendingRequestQueryHandler(IGroupRepository groupRepository)
        {
            _groupRepository = groupRepository;
        }

        public async Task<Result<bool>> Handle(IsHavingPendingRequestQuery request, CancellationToken cancellationToken)
        {
            var group = await _groupRepository.GetByIdWithMembersAsync(request.GroupId, cancellationToken);
            if (group is null || group.DeletedAt is not null)
            {
                return Result.Success(false);
            }

            var hasPending = group!.Requests.Any(
                r => r.UserId == request.RequesterUserId && r.Status == GroupRequestStatus.Pending);

            return Result.Success(hasPending);
        }
    }
}
