using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Domain.Shared;

namespace Application.Groups.Queries.IsMemberOfGroup
{
    internal sealed class IsMemberOfGroupQueryHandler : IQueryHandler<IsMemberOfGroupQuery, bool>
    {
        private readonly IGroupRepository _groupRepository;

        public IsMemberOfGroupQueryHandler(IGroupRepository groupRepository)
        {
            _groupRepository = groupRepository;
        }

        public async Task<Result<bool>> Handle(IsMemberOfGroupQuery request, CancellationToken cancellationToken)
        {
            var isMember = await _groupRepository.IsUserInGroupAsync(
                request.RequesterUserId,
                request.GroupId,
                cancellationToken);

            return Result.Success(isMember);
        }
    }
}
