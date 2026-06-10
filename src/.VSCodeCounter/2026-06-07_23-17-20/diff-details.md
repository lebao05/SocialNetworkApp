# Diff Details

Date : 2026-06-07 23:17:20

Directory d:\\SocialNetworkApp\\SocialNetworkApp\\src

Total : 220 files,  24063 codes, 371 comments, 5702 blanks, all 30136 lines

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [Application/Abstractions/IUploadService.cs](/Application/Abstractions/IUploadService.cs) | C# | 1 | 0 | 0 | 1 |
| [Application/Abstractions/Repositories/IFriendRequestRepository.cs](/Application/Abstractions/Repositories/IFriendRequestRepository.cs) | C# | 2 | 0 | 2 | 4 |
| [Application/Abstractions/Repositories/IFriendshipRepository.cs](/Application/Abstractions/Repositories/IFriendshipRepository.cs) | C# | 2 | 0 | 0 | 2 |
| [Application/Abstractions/Repositories/IGroupListingRepository.cs](/Application/Abstractions/Repositories/IGroupListingRepository.cs) | C# | 14 | 5 | 3 | 22 |
| [Application/Abstractions/Repositories/IPostRepository.cs](/Application/Abstractions/Repositories/IPostRepository.cs) | C# | 5 | 0 | 0 | 5 |
| [Application/Abstractions/Repositories/IReelRepository.cs](/Application/Abstractions/Repositories/IReelRepository.cs) | C# | 20 | 0 | 2 | 22 |
| [Application/Abstractions/Repositories/IStoryRepository.cs](/Application/Abstractions/Repositories/IStoryRepository.cs) | C# | 21 | 0 | 3 | 24 |
| [Application/Abstractions/UploadedVideoResult.cs](/Application/Abstractions/UploadedVideoResult.cs) | C# | 7 | 0 | 1 | 8 |
| [Application/DTOs/Friends/FolloweeResponse.cs](/Application/DTOs/Friends/FolloweeResponse.cs) | C# | 7 | 0 | 2 | 9 |
| [Application/DTOs/Groups/GroupCardDto.cs](/Application/DTOs/Groups/GroupCardDto.cs) | C# | 16 | 0 | 3 | 19 |
| [Application/DTOs/Groups/GroupDetailDto.cs](/Application/DTOs/Groups/GroupDetailDto.cs) | C# | 19 | 0 | 2 | 21 |
| [Application/DTOs/Groups/GroupInsightsDto.cs](/Application/DTOs/Groups/GroupInsightsDto.cs) | C# | 18 | 0 | 2 | 20 |
| [Application/DTOs/Posts/PostDto.cs](/Application/DTOs/Posts/PostDto.cs) | C# | 3 | 0 | 0 | 3 |
| [Application/DTOs/Reels/ReelCommentDto.cs](/Application/DTOs/Reels/ReelCommentDto.cs) | C# | 18 | 0 | 1 | 19 |
| [Application/DTOs/Reels/ReelDto.cs](/Application/DTOs/Reels/ReelDto.cs) | C# | 23 | 0 | 2 | 25 |
| [Application/DTOs/Stories/StoryDto.cs](/Application/DTOs/Stories/StoryDto.cs) | C# | 23 | 0 | 2 | 25 |
| [Application/DTOs/Stories/StoryTimelineUserDto.cs](/Application/DTOs/Stories/StoryTimelineUserDto.cs) | C# | 8 | 0 | 2 | 10 |
| [Application/DTOs/Stories/StoryTimelineUserPageItem.cs](/Application/DTOs/Stories/StoryTimelineUserPageItem.cs) | C# | 4 | 0 | 2 | 6 |
| [Application/DTOs/Users/PersonalInfoResponse.cs](/Application/DTOs/Users/PersonalInfoResponse.cs) | C# | 7 | 0 | 0 | 7 |
| [Application/DTOs/Users/UserFriendRequestDto.cs](/Application/DTOs/Users/UserFriendRequestDto.cs) | C# | 10 | 0 | 2 | 12 |
| [Application/Friend/Commands/CancelFriendRequest/CancelFriendRequestCommand.cs](/Application/Friend/Commands/CancelFriendRequest/CancelFriendRequestCommand.cs) | C# | 6 | 0 | 3 | 9 |
| [Application/Friend/Commands/CancelFriendRequest/CancelFriendRequestCommandHandler.cs](/Application/Friend/Commands/CancelFriendRequest/CancelFriendRequestCommandHandler.cs) | C# | 37 | 0 | 8 | 45 |
| [Application/Friend/Commands/RejectFriendRequest/RejectFriendRequestCommand.cs](/Application/Friend/Commands/RejectFriendRequest/RejectFriendRequestCommand.cs) | C# | 6 | 0 | 3 | 9 |
| [Application/Friend/Commands/RejectFriendRequest/RejectFriendRequestCommandHandler.cs](/Application/Friend/Commands/RejectFriendRequest/RejectFriendRequestCommandHandler.cs) | C# | 54 | 4 | 13 | 71 |
| [Application/Friend/Commands/Unfriend/UnfriendCommand.cs](/Application/Friend/Commands/Unfriend/UnfriendCommand.cs) | C# | 6 | 0 | 3 | 9 |
| [Application/Friend/Commands/Unfriend/UnfriendCommandHandler.cs](/Application/Friend/Commands/Unfriend/UnfriendCommandHandler.cs) | C# | 63 | 5 | 13 | 81 |
| [Application/Friend/Events/Unfriended/UnfriendedDomainEventHandler.cs](/Application/Friend/Events/Unfriended/UnfriendedDomainEventHandler.cs) | C# | 45 | 0 | 6 | 51 |
| [Application/Friend/Queries/GetFollowees/GetFolloweesQuery.cs](/Application/Friend/Queries/GetFollowees/GetFolloweesQuery.cs) | C# | 4 | 0 | 3 | 7 |
| [Application/Friend/Queries/GetFollowees/GetFolloweesQueryHandler.cs](/Application/Friend/Queries/GetFollowees/GetFolloweesQueryHandler.cs) | C# | 38 | 0 | 8 | 46 |
| [Application/Friend/Queries/GetFriends/GetFriendsQuery.cs](/Application/Friend/Queries/GetFriends/GetFriendsQuery.cs) | C# | 1 | 0 | 1 | 2 |
| [Application/Friend/Queries/GetFriends/GetFriendsQueryHandler.cs](/Application/Friend/Queries/GetFriends/GetFriendsQueryHandler.cs) | C# | -10 | 0 | 0 | -10 |
| [Application/Friend/Queries/GetIncomingFriendRequests/GetIncomingFriendRequestsQueryHandler.cs](/Application/Friend/Queries/GetIncomingFriendRequests/GetIncomingFriendRequestsQueryHandler.cs) | C# | 1 | 0 | 0 | 1 |
| [Application/Groups/Commands/CreateGroup/CreateGroupCommandHandler.cs](/Application/Groups/Commands/CreateGroup/CreateGroupCommandHandler.cs) | C# | 1 | 1 | 1 | 3 |
| [Application/Groups/Commands/UpdateGroup/UpdateGroupCommand.cs](/Application/Groups/Commands/UpdateGroup/UpdateGroupCommand.cs) | C# | -1 | 0 | 0 | -1 |
| [Application/Groups/Commands/UpdateGroup/UpdateGroupCommandHandler.cs](/Application/Groups/Commands/UpdateGroup/UpdateGroupCommandHandler.cs) | C# | -1 | 0 | 0 | -1 |
| [Application/Groups/Queries/GetGroupDetail/GetGroupDetailQuery.cs](/Application/Groups/Queries/GetGroupDetail/GetGroupDetailQuery.cs) | C# | 8 | 0 | 2 | 10 |
| [Application/Groups/Queries/GetGroupDetail/GetGroupDetailQueryHandler.cs](/Application/Groups/Queries/GetGroupDetail/GetGroupDetailQueryHandler.cs) | C# | 49 | 0 | 8 | 57 |
| [Application/Groups/Queries/GetGroupInsights/GetGroupInsightsQuery.cs](/Application/Groups/Queries/GetGroupInsights/GetGroupInsightsQuery.cs) | C# | 10 | 0 | 2 | 12 |
| [Application/Groups/Queries/GetGroupInsights/GetGroupInsightsQueryHandler.cs](/Application/Groups/Queries/GetGroupInsights/GetGroupInsightsQueryHandler.cs) | C# | 113 | 9 | 20 | 142 |
| [Application/Groups/Queries/GetGroupJoinRequests/GetGroupJoinRequestsQuery.cs](/Application/Groups/Queries/GetGroupJoinRequests/GetGroupJoinRequestsQuery.cs) | C# | 2 | 0 | 0 | 2 |
| [Application/Groups/Queries/GetGroupJoinRequests/GetGroupJoinRequestsQueryHandler.cs](/Application/Groups/Queries/GetGroupJoinRequests/GetGroupJoinRequestsQueryHandler.cs) | C# | 2 | 0 | 0 | 2 |
| [Application/Groups/Queries/GetGroups/GetGroupsQuery.cs](/Application/Groups/Queries/GetGroups/GetGroupsQuery.cs) | C# | 11 | 0 | 3 | 14 |
| [Application/Groups/Queries/GetGroups/GetGroupsQueryHandler.cs](/Application/Groups/Queries/GetGroups/GetGroupsQueryHandler.cs) | C# | 27 | 0 | 7 | 34 |
| [Application/Posts/Commands/CreatePost/CreatePostCommand.cs](/Application/Posts/Commands/CreatePost/CreatePostCommand.cs) | C# | 1 | 0 | 0 | 1 |
| [Application/Posts/Commands/CreatePost/CreatePostCommandHandler.cs](/Application/Posts/Commands/CreatePost/CreatePostCommandHandler.cs) | C# | 8 | 0 | 1 | 9 |
| [Application/Posts/Queries/GetPost/GetPostQueryHandler.cs](/Application/Posts/Queries/GetPost/GetPostQueryHandler.cs) | C# | 31 | 0 | 6 | 37 |
| [Application/Posts/Queries/GetPostsByGroup/GetPostsByGroupQuery.cs](/Application/Posts/Queries/GetPostsByGroup/GetPostsByGroupQuery.cs) | C# | 2 | 0 | 0 | 2 |
| [Application/Posts/Queries/GetPostsByGroup/GetPostsByGroupQueryHandler.cs](/Application/Posts/Queries/GetPostsByGroup/GetPostsByGroupQueryHandler.cs) | C# | 43 | 0 | 8 | 51 |
| [Application/Posts/Queries/GetPostsByPerson/GetPostsByPersonQueryHandler.cs](/Application/Posts/Queries/GetPostsByPerson/GetPostsByPersonQueryHandler.cs) | C# | 13 | 0 | 0 | 13 |
| [Application/Reels/Commands/CreateReel/CreateReelCommand.cs](/Application/Reels/Commands/CreateReel/CreateReelCommand.cs) | C# | 18 | 0 | 3 | 21 |
| [Application/Reels/Commands/CreateReel/CreateReelCommandHandler.cs](/Application/Reels/Commands/CreateReel/CreateReelCommandHandler.cs) | C# | 97 | 0 | 16 | 113 |
| [Application/Reels/Commands/DeleteReel/DeleteReelCommand.cs](/Application/Reels/Commands/DeleteReel/DeleteReelCommand.cs) | C# | 8 | 0 | 2 | 10 |
| [Application/Reels/Commands/DeleteReel/DeleteReelCommandHandler.cs](/Application/Reels/Commands/DeleteReel/DeleteReelCommandHandler.cs) | C# | 38 | 0 | 7 | 45 |
| [Application/Reels/Commands/MarkStoryAsSeen/MarkStoryAsSeenCommand.cs](/Application/Reels/Commands/MarkStoryAsSeen/MarkStoryAsSeenCommand.cs) | C# | 8 | 0 | 2 | 10 |
| [Application/Reels/Commands/MarkStoryAsSeen/MarkStoryAsSeenCommandHandler.cs](/Application/Reels/Commands/MarkStoryAsSeen/MarkStoryAsSeenCommandHandler.cs) | C# | 51 | 0 | 9 | 60 |
| [Application/Reels/Commands/ToggleLikeReel/ToggleLikeReelCommand.cs](/Application/Reels/Commands/ToggleLikeReel/ToggleLikeReelCommand.cs) | C# | 8 | 0 | 2 | 10 |
| [Application/Reels/Commands/ToggleLikeReel/ToggleLikeReelCommandHandler.cs](/Application/Reels/Commands/ToggleLikeReel/ToggleLikeReelCommandHandler.cs) | C# | 59 | 0 | 11 | 70 |
| [Application/Reels/Commands/ToggleLikeReel/ToggleLikeReelResponse.cs](/Application/Reels/Commands/ToggleLikeReel/ToggleLikeReelResponse.cs) | C# | 7 | 0 | 1 | 8 |
| [Application/Reels/Queries/GetRecommendedReels/GetRecommendedReelsQuery.cs](/Application/Reels/Queries/GetRecommendedReels/GetRecommendedReelsQuery.cs) | C# | 10 | 0 | 2 | 12 |
| [Application/Reels/Queries/GetRecommendedReels/GetRecommendedReelsQueryHandler.cs](/Application/Reels/Queries/GetRecommendedReels/GetRecommendedReelsQueryHandler.cs) | C# | 58 | 0 | 10 | 68 |
| [Application/Reels/Queries/GetReelById/GetReelByIdQuery.cs](/Application/Reels/Queries/GetReelById/GetReelByIdQuery.cs) | C# | 9 | 0 | 2 | 11 |
| [Application/Reels/Queries/GetReelById/GetReelByIdQueryHandler.cs](/Application/Reels/Queries/GetReelById/GetReelByIdQueryHandler.cs) | C# | 49 | 0 | 8 | 57 |
| [Application/Reels/Queries/GetReelComments/GetReelCommentsQuery.cs](/Application/Reels/Queries/GetReelComments/GetReelCommentsQuery.cs) | C# | 13 | 0 | 2 | 15 |
| [Application/Reels/Queries/GetReelComments/GetReelCommentsQueryHandler.cs](/Application/Reels/Queries/GetReelComments/GetReelCommentsQueryHandler.cs) | C# | 84 | 0 | 14 | 98 |
| [Application/Reels/Queries/GetReelsByUser/GetReelsByUserQuery.cs](/Application/Reels/Queries/GetReelsByUser/GetReelsByUserQuery.cs) | C# | 12 | 0 | 2 | 14 |
| [Application/Reels/Queries/GetReelsByUser/GetReelsByUserQueryHandler.cs](/Application/Reels/Queries/GetReelsByUser/GetReelsByUserQueryHandler.cs) | C# | 62 | 0 | 12 | 74 |
| [Application/Stories/Commands/CreateStory/CreateStoryCommand.cs](/Application/Stories/Commands/CreateStory/CreateStoryCommand.cs) | C# | 15 | 0 | 3 | 18 |
| [Application/Stories/Commands/CreateStory/CreateStoryCommandHandler.cs](/Application/Stories/Commands/CreateStory/CreateStoryCommandHandler.cs) | C# | 47 | 0 | 8 | 55 |
| [Application/Stories/Commands/DeleteStory/DeleteStoryCommand.cs](/Application/Stories/Commands/DeleteStory/DeleteStoryCommand.cs) | C# | 6 | 0 | 4 | 10 |
| [Application/Stories/Commands/DeleteStory/DeleteStoryCommandHandler.cs](/Application/Stories/Commands/DeleteStory/DeleteStoryCommandHandler.cs) | C# | 36 | 0 | 8 | 44 |
| [Application/Stories/Commands/ToggleStoryLike/ToggleStoryLikeCommand.cs](/Application/Stories/Commands/ToggleStoryLike/ToggleStoryLikeCommand.cs) | C# | 6 | 0 | 3 | 9 |
| [Application/Stories/Commands/ToggleStoryLike/ToggleStoryLikeCommandHandler.cs](/Application/Stories/Commands/ToggleStoryLike/ToggleStoryLikeCommandHandler.cs) | C# | 63 | 0 | 13 | 76 |
| [Application/Stories/Commands/ToggleStoryLike/ToggleStoryLikeResponse.cs](/Application/Stories/Commands/ToggleStoryLike/ToggleStoryLikeResponse.cs) | C# | 5 | 0 | 2 | 7 |
| [Application/Stories/Queries/GetStoriesByUserId/GetStoriesByUserIdQuery.cs](/Application/Stories/Queries/GetStoriesByUserId/GetStoriesByUserIdQuery.cs) | C# | 7 | 0 | 3 | 10 |
| [Application/Stories/Queries/GetStoriesByUserId/GetStoriesByUserIdQueryHandler.cs](/Application/Stories/Queries/GetStoriesByUserId/GetStoriesByUserIdQueryHandler.cs) | C# | 54 | 0 | 11 | 65 |
| [Application/Stories/Queries/GetStoryTimeline/GetStoryTimelineQuery.cs](/Application/Stories/Queries/GetStoryTimeline/GetStoryTimelineQuery.cs) | C# | 9 | 0 | 3 | 12 |
| [Application/Stories/Queries/GetStoryTimeline/GetStoryTimelineQueryHandler.cs](/Application/Stories/Queries/GetStoryTimeline/GetStoryTimelineQueryHandler.cs) | C# | 94 | 0 | 20 | 114 |
| [Application/Users/Queries/GetPersonalInfo/GetPersonalInfoQueryHandler.cs](/Application/Users/Queries/GetPersonalInfo/GetPersonalInfoQueryHandler.cs) | C# | 44 | 0 | 8 | 52 |
| [Application/obj/Application.csproj.nuget.dgspec.json](/Application/obj/Application.csproj.nuget.dgspec.json) | JSON | 4 | 0 | 0 | 4 |
| [Application/obj/Debug/net10.0/Application.AssemblyInfo.cs](/Application/obj/Debug/net10.0/Application.AssemblyInfo.cs) | C# | 0 | 1 | 0 | 1 |
| [Application/obj/project.assets.json](/Application/obj/project.assets.json) | JSON | 2 | 0 | 0 | 2 |
| [Domain/Common/BaseEntity.cs](/Domain/Common/BaseEntity.cs) | C# | 1 | 0 | 2 | 3 |
| [Domain/Entities/FriendRequest.cs](/Domain/Entities/FriendRequest.cs) | C# | 4 | 0 | 1 | 5 |
| [Domain/Entities/Group.cs](/Domain/Entities/Group.cs) | C# | -3 | -1 | 0 | -4 |
| [Domain/Entities/Post.cs](/Domain/Entities/Post.cs) | C# | 0 | -1 | -2 | -3 |
| [Domain/Entities/PostComment.cs](/Domain/Entities/PostComment.cs) | C# | -1 | -1 | -1 | -3 |
| [Domain/Entities/Reel.cs](/Domain/Entities/Reel.cs) | C# | 71 | 0 | 11 | 82 |
| [Domain/Entities/ReelComment.cs](/Domain/Entities/ReelComment.cs) | C# | 43 | 0 | 9 | 52 |
| [Domain/Entities/ReelReaction.cs](/Domain/Entities/ReelReaction.cs) | C# | 18 | 0 | 5 | 23 |
| [Domain/Entities/Story.cs](/Domain/Entities/Story.cs) | C# | 50 | 0 | 9 | 59 |
| [Domain/Entities/StoryReaction.cs](/Domain/Entities/StoryReaction.cs) | C# | 16 | 0 | 6 | 22 |
| [Domain/Entities/StorySeen.cs](/Domain/Entities/StorySeen.cs) | C# | 22 | 0 | 7 | 29 |
| [Domain/Entities/User.cs](/Domain/Entities/User.cs) | C# | 12 | 0 | 0 | 12 |
| [Domain/Enums/FriendRequestStatus.cs](/Domain/Enums/FriendRequestStatus.cs) | C# | 1 | 0 | 0 | 1 |
| [Domain/Enums/PostApprovalStatus.cs](/Domain/Enums/PostApprovalStatus.cs) | C# | -1 | -1 | -1 | -3 |
| [Domain/Enums/ReelVisibility.cs](/Domain/Enums/ReelVisibility.cs) | C# | 9 | 0 | 1 | 10 |
| [Domain/Enums/StoryMediaType.cs](/Domain/Enums/StoryMediaType.cs) | C# | 6 | 0 | 2 | 8 |
| [Domain/Events/UnfriendedDomainEvent.cs](/Domain/Events/UnfriendedDomainEvent.cs) | C# | 10 | 0 | 2 | 12 |
| [Domain/obj/Debug/net10.0/Domain.AssemblyInfo.cs](/Domain/obj/Debug/net10.0/Domain.AssemblyInfo.cs) | C# | 0 | 1 | 0 | 1 |
| [Domain/obj/Domain.csproj.nuget.dgspec.json](/Domain/obj/Domain.csproj.nuget.dgspec.json) | JSON | 2 | 0 | 0 | 2 |
| [Domain/obj/project.assets.json](/Domain/obj/project.assets.json) | JSON | 2 | 0 | 0 | 2 |
| [Infrastructure/DependencyInjection.cs](/Infrastructure/DependencyInjection.cs) | C# | 3 | 0 | 0 | 3 |
| [Infrastructure/Migrations/20260604120513\_updb18.Designer.cs](/Infrastructure/Migrations/20260604120513_updb18.Designer.cs) | C# | 1,373 | 2 | 557 | 1,932 |
| [Infrastructure/Migrations/20260604120513\_updb18.cs](/Infrastructure/Migrations/20260604120513_updb18.cs) | C# | 32 | 3 | 6 | 41 |
| [Infrastructure/Migrations/20260605095716\_updb19.Designer.cs](/Infrastructure/Migrations/20260605095716_updb19.Designer.cs) | C# | 1,373 | 2 | 557 | 1,932 |
| [Infrastructure/Migrations/20260605095716\_updb19.cs](/Infrastructure/Migrations/20260605095716_updb19.cs) | C# | 26 | 3 | 6 | 35 |
| [Infrastructure/Migrations/20260605145532\_updb20.Designer.cs](/Infrastructure/Migrations/20260605145532_updb20.Designer.cs) | C# | 1,520 | 2 | 618 | 2,140 |
| [Infrastructure/Migrations/20260605145532\_updb20.cs](/Infrastructure/Migrations/20260605145532_updb20.cs) | C# | 542 | 3 | 107 | 652 |
| [Infrastructure/Migrations/20260606090017\_updb21.Designer.cs](/Infrastructure/Migrations/20260606090017_updb21.Designer.cs) | C# | 1,564 | 2 | 636 | 2,202 |
| [Infrastructure/Migrations/20260606090017\_updb21.cs](/Infrastructure/Migrations/20260606090017_updb21.cs) | C# | 74 | 3 | 10 | 87 |
| [Infrastructure/Migrations/20260606090018\_updb22.Designer.cs](/Infrastructure/Migrations/20260606090018_updb22.Designer.cs) | C# | 122 | 2 | 44 | 168 |
| [Infrastructure/Migrations/20260606090018\_updb22.cs](/Infrastructure/Migrations/20260606090018_updb22.cs) | C# | 75 | 5 | 11 | 91 |
| [Infrastructure/Migrations/20260607014653\_updb23.Designer.cs](/Infrastructure/Migrations/20260607014653_updb23.Designer.cs) | C# | 1,623 | 2 | 660 | 2,285 |
| [Infrastructure/Migrations/20260607014653\_updb23.cs](/Infrastructure/Migrations/20260607014653_updb23.cs) | C# | 851 | 3 | 176 | 1,030 |
| [Infrastructure/Migrations/20260607015733\_updb24.Designer.cs](/Infrastructure/Migrations/20260607015733_updb24.Designer.cs) | C# | 1,666 | 2 | 677 | 2,345 |
| [Infrastructure/Migrations/20260607015733\_updb24.cs](/Infrastructure/Migrations/20260607015733_updb24.cs) | C# | 55 | 3 | 6 | 64 |
| [Infrastructure/Migrations/AppDbContextModelSnapshot.cs](/Infrastructure/Migrations/AppDbContextModelSnapshot.cs) | C# | 293 | 0 | 120 | 413 |
| [Infrastructure/Persistence/Configurations/GroupConfiguration.cs](/Infrastructure/Persistence/Configurations/GroupConfiguration.cs) | C# | -3 | 0 | -1 | -4 |
| [Infrastructure/Persistence/Configurations/PostConfiguration.cs](/Infrastructure/Persistence/Configurations/PostConfiguration.cs) | C# | 4 | -1 | 2 | 5 |
| [Infrastructure/Persistence/Configurations/ReelCommentConfiguration.cs](/Infrastructure/Persistence/Configurations/ReelCommentConfiguration.cs) | C# | 49 | 0 | 16 | 65 |
| [Infrastructure/Persistence/Configurations/ReelConfiguration.cs](/Infrastructure/Persistence/Configurations/ReelConfiguration.cs) | C# | 60 | 0 | 20 | 80 |
| [Infrastructure/Persistence/Configurations/ReelReactionConfiguration.cs](/Infrastructure/Persistence/Configurations/ReelReactionConfiguration.cs) | C# | 32 | 0 | 10 | 42 |
| [Infrastructure/Persistence/Configurations/StoryConfiguration.cs](/Infrastructure/Persistence/Configurations/StoryConfiguration.cs) | C# | 59 | 0 | 23 | 82 |
| [Infrastructure/Persistence/Configurations/StoryReactionConfiguration.cs](/Infrastructure/Persistence/Configurations/StoryReactionConfiguration.cs) | C# | 30 | 0 | 11 | 41 |
| [Infrastructure/Persistence/Configurations/StorySeenConfiguration.cs](/Infrastructure/Persistence/Configurations/StorySeenConfiguration.cs) | C# | 30 | 0 | 11 | 41 |
| [Infrastructure/Persistence/Configurations/UserConfiguration.cs](/Infrastructure/Persistence/Configurations/UserConfiguration.cs) | C# | 14 | 2 | 4 | 20 |
| [Infrastructure/Persistence/Contexts/AppDbContext.cs](/Infrastructure/Persistence/Contexts/AppDbContext.cs) | C# | 11 | 0 | -2 | 9 |
| [Infrastructure/Persistence/Repositories/FeedRepository.cs](/Infrastructure/Persistence/Repositories/FeedRepository.cs) | C# | 14 | 0 | 0 | 14 |
| [Infrastructure/Persistence/Repositories/FriendRequestRepository.cs](/Infrastructure/Persistence/Repositories/FriendRequestRepository.cs) | C# | 12 | 0 | 2 | 14 |
| [Infrastructure/Persistence/Repositories/FriendshipRepository.cs](/Infrastructure/Persistence/Repositories/FriendshipRepository.cs) | C# | 28 | 0 | 4 | 32 |
| [Infrastructure/Persistence/Repositories/GroupListingRepository.cs](/Infrastructure/Persistence/Repositories/GroupListingRepository.cs) | C# | 89 | 4 | 19 | 112 |
| [Infrastructure/Persistence/Repositories/GroupRepository.cs](/Infrastructure/Persistence/Repositories/GroupRepository.cs) | C# | 20 | 1 | 3 | 24 |
| [Infrastructure/Persistence/Repositories/PostRepository.cs](/Infrastructure/Persistence/Repositories/PostRepository.cs) | C# | 57 | 0 | 11 | 68 |
| [Infrastructure/Persistence/Repositories/ReelRepository.cs](/Infrastructure/Persistence/Repositories/ReelRepository.cs) | C# | 108 | 0 | 19 | 127 |
| [Infrastructure/Persistence/Repositories/StoryRepository.cs](/Infrastructure/Persistence/Repositories/StoryRepository.cs) | C# | 160 | 0 | 26 | 186 |
| [Infrastructure/Services/CloudinaryUploadService.cs](/Infrastructure/Services/CloudinaryUploadService.cs) | C# | 29 | 0 | 7 | 36 |
| [Infrastructure/obj/Debug/net10.0/Infrastructure.AssemblyInfo.cs](/Infrastructure/obj/Debug/net10.0/Infrastructure.AssemblyInfo.cs) | C# | 0 | 1 | 0 | 1 |
| [Infrastructure/obj/Infrastructure.csproj.nuget.dgspec.json](/Infrastructure/obj/Infrastructure.csproj.nuget.dgspec.json) | JSON | 6 | 0 | 0 | 6 |
| [Infrastructure/obj/project.assets.json](/Infrastructure/obj/project.assets.json) | JSON | 2 | 0 | 0 | 2 |
| [Presentation/Contracts/Group/UpdateGroupRequest.cs](/Presentation/Contracts/Group/UpdateGroupRequest.cs) | C# | -1 | 0 | 0 | -1 |
| [Presentation/Contracts/Post/CreatePostRequest.cs](/Presentation/Contracts/Post/CreatePostRequest.cs) | C# | 1 | 0 | 0 | 1 |
| [Presentation/Contracts/Reel/CreateReelRequest.cs](/Presentation/Contracts/Reel/CreateReelRequest.cs) | C# | 12 | 0 | 2 | 14 |
| [Presentation/Contracts/Story/CreateStoryRequest.cs](/Presentation/Contracts/Story/CreateStoryRequest.cs) | C# | 14 | 0 | 3 | 17 |
| [Presentation/Controllers/FriendController.cs](/Presentation/Controllers/FriendController.cs) | C# | 53 | 1 | 16 | 70 |
| [Presentation/Controllers/GroupController.cs](/Presentation/Controllers/GroupController.cs) | C# | 51 | 0 | 9 | 60 |
| [Presentation/Controllers/PostController.cs](/Presentation/Controllers/PostController.cs) | C# | 2 | 0 | 0 | 2 |
| [Presentation/Controllers/ReelController.cs](/Presentation/Controllers/ReelController.cs) | C# | 154 | 0 | 37 | 191 |
| [Presentation/Controllers/StoryController.cs](/Presentation/Controllers/StoryController.cs) | C# | 98 | 0 | 23 | 121 |
| [Presentation/Controllers/UserController.cs](/Presentation/Controllers/UserController.cs) | C# | 40 | -1 | 12 | 51 |
| [Presentation/obj/Debug/net10.0/Presentation.AssemblyInfo.cs](/Presentation/obj/Debug/net10.0/Presentation.AssemblyInfo.cs) | C# | 0 | 1 | 0 | 1 |
| [Presentation/obj/Presentation.csproj.nuget.dgspec.json](/Presentation/obj/Presentation.csproj.nuget.dgspec.json) | JSON | 8 | 0 | 0 | 8 |
| [ReactWeb/.env](/ReactWeb/.env) | Dotenv | 1 | 0 | 0 | 1 |
| [ReactWeb/src/App.css](/ReactWeb/src/App.css) | PostCSS | -3 | 0 | 0 | -3 |
| [ReactWeb/src/App.jsx](/ReactWeb/src/App.jsx) | JavaScript JSX | 9 | 0 | 0 | 9 |
| [ReactWeb/src/apis/friendApi.js](/ReactWeb/src/apis/friendApi.js) | JavaScript | 30 | 26 | 6 | 62 |
| [ReactWeb/src/apis/groupApi.js](/ReactWeb/src/apis/groupApi.js) | JavaScript | 50 | 71 | 10 | 131 |
| [ReactWeb/src/apis/postApi.js](/ReactWeb/src/apis/postApi.js) | JavaScript | 2 | 2 | 0 | 4 |
| [ReactWeb/src/apis/reelApi.js](/ReactWeb/src/apis/reelApi.js) | JavaScript | 54 | 0 | 12 | 66 |
| [ReactWeb/src/apis/storyApi.js](/ReactWeb/src/apis/storyApi.js) | JavaScript | 15 | 0 | 5 | 20 |
| [ReactWeb/src/components/Feed/CreatePost.jsx](/ReactWeb/src/components/Feed/CreatePost.jsx) | JavaScript JSX | 1 | 0 | 1 | 2 |
| [ReactWeb/src/components/Feed/HomeReelsRail.jsx](/ReactWeb/src/components/Feed/HomeReelsRail.jsx) | JavaScript JSX | 91 | 0 | 9 | 100 |
| [ReactWeb/src/components/Feed/PostCard.jsx](/ReactWeb/src/components/Feed/PostCard.jsx) | JavaScript JSX | 219 | 10 | 12 | 241 |
| [ReactWeb/src/components/Feed/StoryBar.jsx](/ReactWeb/src/components/Feed/StoryBar.jsx) | JavaScript JSX | 64 | -1 | 8 | 71 |
| [ReactWeb/src/components/Navbar/Navbar.jsx](/ReactWeb/src/components/Navbar/Navbar.jsx) | JavaScript JSX | 1 | 0 | 0 | 1 |
| [ReactWeb/src/components/Profile/CreatePostModal.jsx](/ReactWeb/src/components/Profile/CreatePostModal.jsx) | JavaScript JSX | 53 | 2 | 4 | 59 |
| [ReactWeb/src/components/Profile/CreateReelModal.jsx](/ReactWeb/src/components/Profile/CreateReelModal.jsx) | JavaScript JSX | 448 | 0 | 49 | 497 |
| [ReactWeb/src/components/Profile/FollowingTab.jsx](/ReactWeb/src/components/Profile/FollowingTab.jsx) | JavaScript JSX | 0 | -1 | 4 | 3 |
| [ReactWeb/src/components/Profile/FriendsTab.jsx](/ReactWeb/src/components/Profile/FriendsTab.jsx) | JavaScript JSX | 19 | 1 | 4 | 24 |
| [ReactWeb/src/components/Profile/MediaTab.jsx](/ReactWeb/src/components/Profile/MediaTab.jsx) | JavaScript JSX | 183 | 0 | 14 | 197 |
| [ReactWeb/src/components/Profile/PhotosTab.jsx](/ReactWeb/src/components/Profile/PhotosTab.jsx) | JavaScript JSX | -41 | -2 | -3 | -46 |
| [ReactWeb/src/components/Profile/ProfileReelsTab.jsx](/ReactWeb/src/components/Profile/ProfileReelsTab.jsx) | JavaScript JSX | 218 | 2 | 14 | 234 |
| [ReactWeb/src/components/Profile/ProfileRelationshipActions.jsx](/ReactWeb/src/components/Profile/ProfileRelationshipActions.jsx) | JavaScript JSX | 440 | 16 | 41 | 497 |
| [ReactWeb/src/components/Reels/ReelView.jsx](/ReactWeb/src/components/Reels/ReelView.jsx) | JavaScript JSX | 271 | 22 | 27 | 320 |
| [ReactWeb/src/components/Reels/ReelViewModal.jsx](/ReactWeb/src/components/Reels/ReelViewModal.jsx) | JavaScript JSX | 260 | 9 | 19 | 288 |
| [ReactWeb/src/components/Story/ProfileStoryRing.jsx](/ReactWeb/src/components/Story/ProfileStoryRing.jsx) | JavaScript JSX | 75 | 0 | 11 | 86 |
| [ReactWeb/src/components/Story/UserStoryViewer.jsx](/ReactWeb/src/components/Story/UserStoryViewer.jsx) | JavaScript JSX | 359 | 9 | 37 | 405 |
| [ReactWeb/src/components/Story/storyMappers.js](/ReactWeb/src/components/Story/storyMappers.js) | JavaScript | 73 | 0 | 10 | 83 |
| [ReactWeb/src/components/group/GroupAdminInsights.jsx](/ReactWeb/src/components/group/GroupAdminInsights.jsx) | JavaScript JSX | 211 | 4 | 19 | 234 |
| [ReactWeb/src/components/group/GroupAdminManage.jsx](/ReactWeb/src/components/group/GroupAdminManage.jsx) | JavaScript JSX | 863 | 10 | 71 | 944 |
| [ReactWeb/src/components/group/GroupAdminSettings.jsx](/ReactWeb/src/components/group/GroupAdminSettings.jsx) | JavaScript JSX | 454 | 18 | 27 | 499 |
| [ReactWeb/src/contexts/ReelsContext.jsx](/ReactWeb/src/contexts/ReelsContext.jsx) | JavaScript JSX | 174 | 5 | 27 | 206 |
| [ReactWeb/src/contexts/StoriesContext.jsx](/ReactWeb/src/contexts/StoriesContext.jsx) | JavaScript JSX | 54 | 0 | 13 | 67 |
| [ReactWeb/src/contexts/authContext.jsx](/ReactWeb/src/contexts/authContext.jsx) | JavaScript JSX | 1 | 0 | 0 | 1 |
| [ReactWeb/src/contexts/friendContext.jsx](/ReactWeb/src/contexts/friendContext.jsx) | JavaScript JSX | 78 | 0 | 5 | 83 |
| [ReactWeb/src/data/groupMockData.js](/ReactWeb/src/data/groupMockData.js) | JavaScript | -2 | 0 | 0 | -2 |
| [ReactWeb/src/data/mockData.js](/ReactWeb/src/data/mockData.js) | JavaScript | 15 | 2 | 1 | 18 |
| [ReactWeb/src/data/reelsMockData.js](/ReactWeb/src/data/reelsMockData.js) | JavaScript | 136 | 0 | 0 | 136 |
| [ReactWeb/src/hooks/useAllMembers.js](/ReactWeb/src/hooks/useAllMembers.js) | JavaScript | 124 | 14 | 18 | 156 |
| [ReactWeb/src/hooks/useCreateStory.js](/ReactWeb/src/hooks/useCreateStory.js) | JavaScript | 27 | 0 | 5 | 32 |
| [ReactWeb/src/hooks/useFollowees.js](/ReactWeb/src/hooks/useFollowees.js) | JavaScript | 23 | 0 | 5 | 28 |
| [ReactWeb/src/hooks/useGroup.js](/ReactWeb/src/hooks/useGroup.js) | JavaScript | 224 | 0 | 31 | 255 |
| [ReactWeb/src/hooks/useGroupInsights.js](/ReactWeb/src/hooks/useGroupInsights.js) | JavaScript | 58 | 6 | 9 | 73 |
| [ReactWeb/src/hooks/useGroupPosts.js](/ReactWeb/src/hooks/useGroupPosts.js) | JavaScript | 99 | 9 | 16 | 124 |
| [ReactWeb/src/hooks/useMedias.js](/ReactWeb/src/hooks/useMedias.js) | JavaScript | 96 | 0 | 17 | 113 |
| [ReactWeb/src/hooks/usePendingPosts.js](/ReactWeb/src/hooks/usePendingPosts.js) | JavaScript | 137 | 11 | 18 | 166 |
| [ReactWeb/src/hooks/useProfileFriends.js](/ReactWeb/src/hooks/useProfileFriends.js) | JavaScript | 24 | 0 | 6 | 30 |
| [ReactWeb/src/hooks/useProfileReels.js](/ReactWeb/src/hooks/useProfileReels.js) | JavaScript | 148 | 3 | 19 | 170 |
| [ReactWeb/src/hooks/useProfileStories.js](/ReactWeb/src/hooks/useProfileStories.js) | JavaScript | 49 | 0 | 8 | 57 |
| [ReactWeb/src/hooks/useReportedContent.js](/ReactWeb/src/hooks/useReportedContent.js) | JavaScript | 155 | 13 | 17 | 185 |
| [ReactWeb/src/hooks/useSearchGroups.js](/ReactWeb/src/hooks/useSearchGroups.js) | JavaScript | 36 | 3 | 6 | 45 |
| [ReactWeb/src/hooks/useStoriesTimeline.js](/ReactWeb/src/hooks/useStoriesTimeline.js) | JavaScript | 42 | 0 | 6 | 48 |
| [ReactWeb/src/hooks/useTag.js](/ReactWeb/src/hooks/useTag.js) | JavaScript | 53 | 5 | 4 | 62 |
| [ReactWeb/src/hooks/useUserMedias.js](/ReactWeb/src/hooks/useUserMedias.js) | JavaScript | 4 | 4 | 2 | 10 |
| [ReactWeb/src/hooks/useYourGroups.js](/ReactWeb/src/hooks/useYourGroups.js) | JavaScript | 36 | 3 | 6 | 45 |
| [ReactWeb/src/main.jsx](/ReactWeb/src/main.jsx) | JavaScript JSX | 6 | 0 | 0 | 6 |
| [ReactWeb/src/pages/BirthdaysPage.jsx](/ReactWeb/src/pages/BirthdaysPage.jsx) | JavaScript JSX | 258 | 0 | 20 | 278 |
| [ReactWeb/src/pages/CreateStoryPage.jsx](/ReactWeb/src/pages/CreateStoryPage.jsx) | JavaScript JSX | 587 | 0 | 63 | 650 |
| [ReactWeb/src/pages/FriendsPage.jsx](/ReactWeb/src/pages/FriendsPage.jsx) | JavaScript JSX | 52 | 1 | 2 | 55 |
| [ReactWeb/src/pages/GroupPage.jsx](/ReactWeb/src/pages/GroupPage.jsx) | JavaScript JSX | 351 | 1 | 32 | 384 |
| [ReactWeb/src/pages/GroupsCreatePage.jsx](/ReactWeb/src/pages/GroupsCreatePage.jsx) | JavaScript JSX | 11 | 0 | 4 | 15 |
| [ReactWeb/src/pages/GroupsPage.jsx](/ReactWeb/src/pages/GroupsPage.jsx) | JavaScript JSX | -41 | 1 | 9 | -31 |
| [ReactWeb/src/pages/HomePage.jsx](/ReactWeb/src/pages/HomePage.jsx) | JavaScript JSX | 3 | 0 | 2 | 5 |
| [ReactWeb/src/pages/ProfilePage.jsx](/ReactWeb/src/pages/ProfilePage.jsx) | JavaScript JSX | 41 | -2 | 5 | 44 |
| [ReactWeb/src/pages/ReelsPage.jsx](/ReactWeb/src/pages/ReelsPage.jsx) | JavaScript JSX | 86 | 16 | 20 | 122 |
| [ReactWeb/src/pages/SavedPage.jsx](/ReactWeb/src/pages/SavedPage.jsx) | JavaScript JSX | 333 | 10 | 17 | 360 |
| [ReactWeb/src/pages/StoryPage.jsx](/ReactWeb/src/pages/StoryPage.jsx) | JavaScript JSX | 52 | 0 | 8 | 60 |
| [Web/obj/Debug/net10.0/ApiEndpoints.json](/Web/obj/Debug/net10.0/ApiEndpoints.json) | JSON | 622 | 0 | 0 | 622 |
| [Web/obj/Debug/net10.0/EndpointInfo/Web.json](/Web/obj/Debug/net10.0/EndpointInfo/Web.json) | JSON | 1,003 | 0 | 0 | 1,003 |
| [Web/obj/Debug/net10.0/Web.MvcApplicationPartsAssemblyInfo.cs](/Web/obj/Debug/net10.0/Web.MvcApplicationPartsAssemblyInfo.cs) | C# | 0 | 1 | 0 | 1 |
| [Web/obj/Web.csproj.nuget.dgspec.json](/Web/obj/Web.csproj.nuget.dgspec.json) | JSON | 10 | 0 | 0 | 10 |

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details