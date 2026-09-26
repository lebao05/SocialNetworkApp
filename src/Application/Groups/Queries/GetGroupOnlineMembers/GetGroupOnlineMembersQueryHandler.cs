using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.Abstractions.SignalR;
using Application.DTOs.Users;
using Domain.Shared;

namespace Application.Groups.Queries.GetGroupOnlineMembers
{
    internal sealed class GetGroupOnlineMembersQueryHandler
        : IQueryHandler<GetGroupOnlineMembersQuery, GroupOnlineStatusDto>
    {
        private readonly IGroupRepository _groupRepository;
        private readonly IUserRepository _userRepository;
        private readonly IPresenceTracker _presenceTracker;

        public GetGroupOnlineMembersQueryHandler(
            IGroupRepository groupRepository,
            IUserRepository userRepository,
            IPresenceTracker presenceTracker)
        {
            _groupRepository = groupRepository;
            _userRepository = userRepository;
            _presenceTracker = presenceTracker;
        }

        public async Task<Result<GroupOnlineStatusDto>> Handle(
            GetGroupOnlineMembersQuery request,
            CancellationToken cancellationToken)
        {
            var group = await _groupRepository.GetByIdAsync(request.GroupId, cancellationToken);

            if (group is null)
            {
                return Result.Failure<GroupOnlineStatusDto>(
                    new Error("Group.NotFound", "Group not found"));
            }

            // Get all member user IDs
            var memberUserIds = group.Members.Select(m => m.UserId).ToList();

            // Check which members are online
            var onlineMembers = new List<UserSummaryDto>();
            foreach (var userId in memberUserIds)
            {
                if (_presenceTracker.IsOnline(userId.ToString()))
                {
                    var user = await _userRepository.GetByIdAsync(userId, cancellationToken);
                    if (user is not null)
                    {
                        onlineMembers.Add(UserSummaryDto.FromDomain(user));
                    }
                }
            }

            var result = new GroupOnlineStatusDto(
                OnlineCount: onlineMembers.Count,
                OnlineMembers: onlineMembers
            );

            return Result.Success(result);
        }
    }
}
