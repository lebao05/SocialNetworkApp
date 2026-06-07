using Application.Abstractions.Messaging;
using Application.Abstractions.Repositories;
using Application.DTOs.Users;
using Domain.Shared;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Users.Queries.GetPersonalInfo
{
    internal sealed class GetPersonalInfoQueryHandler
        : IQueryHandler<GetPersonalInfoQuery, PersonalInfoResponse>
    {
        private readonly IUserRepository _userRepository;
        private readonly IFriendshipRepository _friendshipRepository;
        private readonly IFriendRequestRepository _friendRequestRepository;

        public GetPersonalInfoQueryHandler(
            IUserRepository userRepository,
            IFriendshipRepository friendshipRepository,
            IFriendRequestRepository friendRequestRepository)
        {
            _userRepository = userRepository;
            _friendshipRepository = friendshipRepository;
            _friendRequestRepository = friendRequestRepository;
        }

        public async Task<Result<PersonalInfoResponse>> Handle(
            GetPersonalInfoQuery request,
            CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);

            if (user is null)
            {
                return Result.Failure<PersonalInfoResponse>(new Error(
                    "User.NotFound",
                    $"The user with Id {request.UserId} was not found."));
            }

            bool isFriend = false;
            bool isFollowing = false;
            bool hasIncomingRequest = false;
            bool hasOutgoingRequest = false;
            long? incomingRequestId = null;
            long? outgoingRequestId = null;

            if (request.CurrentUserId.HasValue && request.CurrentUserId.Value != request.UserId)
            {
                var currentUserId = request.CurrentUserId.Value;

                isFriend = await _friendshipRepository.ExistsAsync(currentUserId, request.UserId);

                isFollowing = await _friendshipRepository.ExistsFollowingAsync(
                    currentUserId,
                    request.UserId,
                    cancellationToken);

                var incoming = await _friendRequestRepository.GetPendingRequestAsync(
                    request.UserId,
                    currentUserId);

                if (incoming is not null)
                {
                    hasIncomingRequest = true;
                    incomingRequestId = incoming.Id;
                }

                var outgoing = await _friendRequestRepository.GetPendingRequestAsync(
                    currentUserId,
                    request.UserId);

                if (outgoing is not null)
                {
                    hasOutgoingRequest = true;
                    outgoingRequestId = outgoing.Id;
                }
            }

            var response = new PersonalInfoResponse(
                user.Id,
                user.FirstName,
                user.LastName,
                user.AvatarUrl,
                user.CoverPhotoUrl,
                user.Gender,
                user.DateOfBirth,
                user.Bio,
                user.CurrentLocation,
                user.Hometown,
                user.Website,
                user.RelationshipStatus,
                new DateTime(2018, 5, 1),
                isFriend,
                isFollowing,
                hasIncomingRequest,
                hasOutgoingRequest,
                incomingRequestId,
                outgoingRequestId);

            return Result.Success(response);
        }
    }
}
