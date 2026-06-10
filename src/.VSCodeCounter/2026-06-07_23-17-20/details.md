# Details

Date : 2026-06-07 23:17:20

Directory d:\\SocialNetworkApp\\SocialNetworkApp\\src

Total : 661 files,  116865 codes, 1410 comments, 18369 blanks, all 136644 lines

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [.agent.md](/.agent.md) | Markdown | 28 | 0 | 1 | 29 |
| [Application/Abstractions/IFeedGenerator.cs](/Application/Abstractions/IFeedGenerator.cs) | C# | 7 | 0 | 1 | 8 |
| [Application/Abstractions/IFriendGraphService.cs](/Application/Abstractions/IFriendGraphService.cs) | C# | 15 | 0 | 3 | 18 |
| [Application/Abstractions/ITokenService.cs](/Application/Abstractions/ITokenService.cs) | C# | 8 | 0 | 1 | 9 |
| [Application/Abstractions/IUnitOfWork.cs](/Application/Abstractions/IUnitOfWork.cs) | C# | 10 | 0 | 2 | 12 |
| [Application/Abstractions/IUploadService.cs](/Application/Abstractions/IUploadService.cs) | C# | 11 | 0 | 1 | 12 |
| [Application/Abstractions/Messaging/ICommand.cs](/Application/Abstractions/Messaging/ICommand.cs) | C# | 11 | 0 | 2 | 13 |
| [Application/Abstractions/Messaging/ICommandHandler.cs](/Application/Abstractions/Messaging/ICommandHandler.cs) | C# | 14 | 0 | 3 | 17 |
| [Application/Abstractions/Messaging/IDomainEventHandler.cs](/Application/Abstractions/Messaging/IDomainEventHandler.cs) | C# | 9 | 0 | 3 | 12 |
| [Application/Abstractions/Messaging/IQuery.cs](/Application/Abstractions/Messaging/IQuery.cs) | C# | 8 | 0 | 2 | 10 |
| [Application/Abstractions/Messaging/IQueryHandler.cs](/Application/Abstractions/Messaging/IQueryHandler.cs) | C# | 10 | 0 | 1 | 11 |
| [Application/Abstractions/Repositories/IConversationRepository.cs](/Application/Abstractions/Repositories/IConversationRepository.cs) | C# | 36 | 0 | 3 | 39 |
| [Application/Abstractions/Repositories/IFeedRepository.cs](/Application/Abstractions/Repositories/IFeedRepository.cs) | C# | 10 | 0 | 2 | 12 |
| [Application/Abstractions/Repositories/IFriendRequestRepository.cs](/Application/Abstractions/Repositories/IFriendRequestRepository.cs) | C# | 18 | 0 | 7 | 25 |
| [Application/Abstractions/Repositories/IFriendshipRepository.cs](/Application/Abstractions/Repositories/IFriendshipRepository.cs) | C# | 24 | 0 | 3 | 27 |
| [Application/Abstractions/Repositories/IGroupListingRepository.cs](/Application/Abstractions/Repositories/IGroupListingRepository.cs) | C# | 14 | 5 | 3 | 22 |
| [Application/Abstractions/Repositories/IGroupReportRepository.cs](/Application/Abstractions/Repositories/IGroupReportRepository.cs) | C# | 13 | 0 | 2 | 15 |
| [Application/Abstractions/Repositories/IGroupRepository.cs](/Application/Abstractions/Repositories/IGroupRepository.cs) | C# | 15 | 0 | 2 | 17 |
| [Application/Abstractions/Repositories/IMessageRepository.cs](/Application/Abstractions/Repositories/IMessageRepository.cs) | C# | 12 | 0 | 2 | 14 |
| [Application/Abstractions/Repositories/IPostRepository.cs](/Application/Abstractions/Repositories/IPostRepository.cs) | C# | 39 | 0 | 2 | 41 |
| [Application/Abstractions/Repositories/IReelRepository.cs](/Application/Abstractions/Repositories/IReelRepository.cs) | C# | 20 | 0 | 2 | 22 |
| [Application/Abstractions/Repositories/ISchoolRepository.cs](/Application/Abstractions/Repositories/ISchoolRepository.cs) | C# | 15 | 0 | 2 | 17 |
| [Application/Abstractions/Repositories/IStoryRepository.cs](/Application/Abstractions/Repositories/IStoryRepository.cs) | C# | 21 | 0 | 3 | 24 |
| [Application/Abstractions/Repositories/IUserRepository.cs](/Application/Abstractions/Repositories/IUserRepository.cs) | C# | 12 | 0 | 2 | 14 |
| [Application/Abstractions/Security/IBlindIndexService.cs](/Application/Abstractions/Security/IBlindIndexService.cs) | C# | 7 | 0 | 2 | 9 |
| [Application/Abstractions/UploadedVideoResult.cs](/Application/Abstractions/UploadedVideoResult.cs) | C# | 7 | 0 | 1 | 8 |
| [Application/Application.csproj](/Application/Application.csproj) | XML | 22 | 0 | 6 | 28 |
| [Application/Auth/Commands/Login/LoginCommand.cs](/Application/Auth/Commands/Login/LoginCommand.cs) | C# | 5 | 0 | 3 | 8 |
| [Application/Auth/Commands/Login/LoginCommandHandler.cs](/Application/Auth/Commands/Login/LoginCommandHandler.cs) | C# | 30 | 0 | 3 | 33 |
| [Application/Auth/Commands/Register/RegisterCommand.cs](/Application/Auth/Commands/Register/RegisterCommand.cs) | C# | 13 | 0 | 2 | 15 |
| [Application/Auth/Commands/Register/RegisterCommandHandler.cs](/Application/Auth/Commands/Register/RegisterCommandHandler.cs) | C# | 73 | 1 | 8 | 82 |
| [Application/Behaviors/ValidationPipelineBehavior.cs](/Application/Behaviors/ValidationPipelineBehavior.cs) | C# | 50 | 0 | 12 | 62 |
| [Application/Conversations/Commands/CreateConversation/CreateConversationCommand.cs](/Application/Conversations/Commands/CreateConversation/CreateConversationCommand.cs) | C# | 9 | 0 | 2 | 11 |
| [Application/Conversations/Commands/CreateConversation/CreateConversationCommandHandler.cs](/Application/Conversations/Commands/CreateConversation/CreateConversationCommandHandler.cs) | C# | 62 | 8 | 12 | 82 |
| [Application/Conversations/Commands/RemoveMemberFromConversation/RemoveMemberFromConversationCommand.cs](/Application/Conversations/Commands/RemoveMemberFromConversation/RemoveMemberFromConversationCommand.cs) | C# | 6 | 0 | 3 | 9 |
| [Application/Conversations/Commands/RemoveMemberFromConversation/RemoveMemberFromConversationCommandHandler.cs](/Application/Conversations/Commands/RemoveMemberFromConversation/RemoveMemberFromConversationCommandHandler.cs) | C# | 35 | 0 | 10 | 45 |
| [Application/Conversations/Commands/ToggleNotifications/ToggleNotificationsCommand.cs](/Application/Conversations/Commands/ToggleNotifications/ToggleNotificationsCommand.cs) | C# | 7 | 0 | 2 | 9 |
| [Application/Conversations/Commands/ToggleNotifications/ToggleNotificationsCommandHandler.cs](/Application/Conversations/Commands/ToggleNotifications/ToggleNotificationsCommandHandler.cs) | C# | 38 | 4 | 8 | 50 |
| [Application/Conversations/Queries/GetConversationDetailByUserId/GetConversationDetailByUserIdQuery.cs](/Application/Conversations/Queries/GetConversationDetailByUserId/GetConversationDetailByUserIdQuery.cs) | C# | 7 | 0 | 2 | 9 |
| [Application/Conversations/Queries/GetConversationDetailByUserId/GetConversationDetailByUserIdQueryHandler.cs](/Application/Conversations/Queries/GetConversationDetailByUserId/GetConversationDetailByUserIdQueryHandler.cs) | C# | 48 | 3 | 8 | 59 |
| [Application/Conversations/Queries/GetConversationDetail/GetConversationDetailQuery.cs](/Application/Conversations/Queries/GetConversationDetail/GetConversationDetailQuery.cs) | C# | 7 | 0 | 1 | 8 |
| [Application/Conversations/Queries/GetConversationDetail/GetConversationDetailQueryHandler.cs](/Application/Conversations/Queries/GetConversationDetail/GetConversationDetailQueryHandler.cs) | C# | 39 | 0 | 6 | 45 |
| [Application/Conversations/Queries/GetConversations/GetConversationsQuery.cs](/Application/Conversations/Queries/GetConversations/GetConversationsQuery.cs) | C# | 10 | 0 | 2 | 12 |
| [Application/Conversations/Queries/GetConversations/GetConversationsQueryHandler.cs](/Application/Conversations/Queries/GetConversations/GetConversationsQueryHandler.cs) | C# | 32 | 0 | 5 | 37 |
| [Application/Conversations/Queries/SearchConversationsAndFriends/SearchConversationsAndFriendsQuery.cs](/Application/Conversations/Queries/SearchConversationsAndFriends/SearchConversationsAndFriendsQuery.cs) | C# | 11 | 0 | 2 | 13 |
| [Application/Conversations/Queries/SearchConversationsAndFriends/SearchConversationsAndFriendsQueryHandler.cs](/Application/Conversations/Queries/SearchConversationsAndFriends/SearchConversationsAndFriendsQueryHandler.cs) | C# | 88 | 5 | 13 | 106 |
| [Application/DTOs/Conversations/ConversationDetailDto.cs](/Application/DTOs/Conversations/ConversationDetailDto.cs) | C# | 62 | 0 | 9 | 71 |
| [Application/DTOs/Conversations/ConversationResponse.cs](/Application/DTOs/Conversations/ConversationResponse.cs) | C# | 52 | 2 | 4 | 58 |
| [Application/DTOs/Conversations/ConversationSearchResponse.cs](/Application/DTOs/Conversations/ConversationSearchResponse.cs) | C# | 11 | 0 | 2 | 13 |
| [Application/DTOs/Feeds/FeedPostDto.cs](/Application/DTOs/Feeds/FeedPostDto.cs) | C# | 13 | 0 | 2 | 15 |
| [Application/DTOs/Friends/FolloweeResponse.cs](/Application/DTOs/Friends/FolloweeResponse.cs) | C# | 7 | 0 | 2 | 9 |
| [Application/DTOs/Friends/FriendRequestDto.cs](/Application/DTOs/Friends/FriendRequestDto.cs) | C# | 15 | 0 | 2 | 17 |
| [Application/DTOs/Friends/FriendResponse.cs](/Application/DTOs/Friends/FriendResponse.cs) | C# | 11 | 0 | 2 | 13 |
| [Application/DTOs/Groups/GroupCardDto.cs](/Application/DTOs/Groups/GroupCardDto.cs) | C# | 16 | 0 | 3 | 19 |
| [Application/DTOs/Groups/GroupDetailDto.cs](/Application/DTOs/Groups/GroupDetailDto.cs) | C# | 19 | 0 | 2 | 21 |
| [Application/DTOs/Groups/GroupDto.cs](/Application/DTOs/Groups/GroupDto.cs) | C# | 12 | 0 | 2 | 14 |
| [Application/DTOs/Groups/GroupInsightsDto.cs](/Application/DTOs/Groups/GroupInsightsDto.cs) | C# | 18 | 0 | 2 | 20 |
| [Application/DTOs/Groups/GroupJoinRequestDto.cs](/Application/DTOs/Groups/GroupJoinRequestDto.cs) | C# | 14 | 0 | 2 | 16 |
| [Application/DTOs/Groups/GroupMemberDto.cs](/Application/DTOs/Groups/GroupMemberDto.cs) | C# | 14 | 0 | 2 | 16 |
| [Application/DTOs/Groups/GroupRuleResponse.cs](/Application/DTOs/Groups/GroupRuleResponse.cs) | C# | 8 | 0 | 1 | 9 |
| [Application/DTOs/Groups/ReportedGroupContentDto.cs](/Application/DTOs/Groups/ReportedGroupContentDto.cs) | C# | 23 | 0 | 2 | 25 |
| [Application/DTOs/Messages/AttachmentDto.cs](/Application/DTOs/Messages/AttachmentDto.cs) | C# | 19 | 0 | 2 | 21 |
| [Application/DTOs/Messages/MemberMessageDto.cs](/Application/DTOs/Messages/MemberMessageDto.cs) | C# | 21 | 0 | 1 | 22 |
| [Application/DTOs/Messages/MessageDto.cs](/Application/DTOs/Messages/MessageDto.cs) | C# | 30 | 0 | 6 | 36 |
| [Application/DTOs/Posts/PostCommentDto.cs](/Application/DTOs/Posts/PostCommentDto.cs) | C# | 21 | 0 | 2 | 23 |
| [Application/DTOs/Posts/PostDto.cs](/Application/DTOs/Posts/PostDto.cs) | C# | 33 | 0 | 2 | 35 |
| [Application/DTOs/Posts/PostMediaDto.cs](/Application/DTOs/Posts/PostMediaDto.cs) | C# | 11 | 0 | 1 | 12 |
| [Application/DTOs/Posts/PostMediaItemDto.cs](/Application/DTOs/Posts/PostMediaItemDto.cs) | C# | 12 | 0 | 1 | 13 |
| [Application/DTOs/Posts/ReactionCountDto.cs](/Application/DTOs/Posts/ReactionCountDto.cs) | C# | 8 | 0 | 2 | 10 |
| [Application/DTOs/Reels/ReelCommentDto.cs](/Application/DTOs/Reels/ReelCommentDto.cs) | C# | 18 | 0 | 1 | 19 |
| [Application/DTOs/Reels/ReelDto.cs](/Application/DTOs/Reels/ReelDto.cs) | C# | 23 | 0 | 2 | 25 |
| [Application/DTOs/Schools/SchoolResponse.cs](/Application/DTOs/Schools/SchoolResponse.cs) | C# | 15 | 0 | 2 | 17 |
| [Application/DTOs/Search/GlobalSearchResponse.cs](/Application/DTOs/Search/GlobalSearchResponse.cs) | C# | 7 | 0 | 2 | 9 |
| [Application/DTOs/Stories/StoryDto.cs](/Application/DTOs/Stories/StoryDto.cs) | C# | 23 | 0 | 2 | 25 |
| [Application/DTOs/Stories/StoryTimelineUserDto.cs](/Application/DTOs/Stories/StoryTimelineUserDto.cs) | C# | 8 | 0 | 2 | 10 |
| [Application/DTOs/Stories/StoryTimelineUserPageItem.cs](/Application/DTOs/Stories/StoryTimelineUserPageItem.cs) | C# | 4 | 0 | 2 | 6 |
| [Application/DTOs/Users/PersonalInfoResponse.cs](/Application/DTOs/Users/PersonalInfoResponse.cs) | C# | 26 | 0 | 2 | 28 |
| [Application/DTOs/Users/TaggableUserDto.cs](/Application/DTOs/Users/TaggableUserDto.cs) | C# | 8 | 0 | 1 | 9 |
| [Application/DTOs/Users/UserFriendRequestDto.cs](/Application/DTOs/Users/UserFriendRequestDto.cs) | C# | 10 | 0 | 2 | 12 |
| [Application/DTOs/Users/UserHoverCardResponse.cs](/Application/DTOs/Users/UserHoverCardResponse.cs) | C# | 16 | 0 | 3 | 19 |
| [Application/DependencyInjection.cs](/Application/DependencyInjection.cs) | C# | 13 | 0 | 1 | 14 |
| [Application/Friend/Commands/AcceptFriendRequest/AcceptFriendRequestCommand.cs](/Application/Friend/Commands/AcceptFriendRequest/AcceptFriendRequestCommand.cs) | C# | 6 | 0 | 2 | 8 |
| [Application/Friend/Commands/AcceptFriendRequest/AcceptFriendRequestCommandHandler.cs](/Application/Friend/Commands/AcceptFriendRequest/AcceptFriendRequestCommandHandler.cs) | C# | 79 | 8 | 15 | 102 |
| [Application/Friend/Commands/CancelFriendRequest/CancelFriendRequestCommand.cs](/Application/Friend/Commands/CancelFriendRequest/CancelFriendRequestCommand.cs) | C# | 6 | 0 | 3 | 9 |
| [Application/Friend/Commands/CancelFriendRequest/CancelFriendRequestCommandHandler.cs](/Application/Friend/Commands/CancelFriendRequest/CancelFriendRequestCommandHandler.cs) | C# | 37 | 0 | 8 | 45 |
| [Application/Friend/Commands/RejectFriendRequest/RejectFriendRequestCommand.cs](/Application/Friend/Commands/RejectFriendRequest/RejectFriendRequestCommand.cs) | C# | 6 | 0 | 3 | 9 |
| [Application/Friend/Commands/RejectFriendRequest/RejectFriendRequestCommandHandler.cs](/Application/Friend/Commands/RejectFriendRequest/RejectFriendRequestCommandHandler.cs) | C# | 54 | 4 | 13 | 71 |
| [Application/Friend/Commands/SendFriendRequest/SendFriendRequestCommand.cs](/Application/Friend/Commands/SendFriendRequest/SendFriendRequestCommand.cs) | C# | 6 | 0 | 2 | 8 |
| [Application/Friend/Commands/SendFriendRequest/SendFriendRequestCommandHandler.cs](/Application/Friend/Commands/SendFriendRequest/SendFriendRequestCommandHandler.cs) | C# | 67 | 5 | 12 | 84 |
| [Application/Friend/Commands/SyncAllFriends/SyncAllFriendsCommand.cs](/Application/Friend/Commands/SyncAllFriends/SyncAllFriendsCommand.cs) | C# | 5 | 0 | 2 | 7 |
| [Application/Friend/Commands/SyncAllFriends/SyncAllFriendsCommandHandler.cs](/Application/Friend/Commands/SyncAllFriends/SyncAllFriendsCommandHandler.cs) | C# | 66 | 0 | 6 | 72 |
| [Application/Friend/Commands/Unfriend/UnfriendCommand.cs](/Application/Friend/Commands/Unfriend/UnfriendCommand.cs) | C# | 6 | 0 | 3 | 9 |
| [Application/Friend/Commands/Unfriend/UnfriendCommandHandler.cs](/Application/Friend/Commands/Unfriend/UnfriendCommandHandler.cs) | C# | 63 | 5 | 13 | 81 |
| [Application/Friend/Events/FriendshipCreated/FriendshipCreatedDomainEventHandler.cs](/Application/Friend/Events/FriendshipCreated/FriendshipCreatedDomainEventHandler.cs) | C# | 44 | 0 | 5 | 49 |
| [Application/Friend/Events/Unfriended/UnfriendedDomainEventHandler.cs](/Application/Friend/Events/Unfriended/UnfriendedDomainEventHandler.cs) | C# | 45 | 0 | 6 | 51 |
| [Application/Friend/Queries/GetFollowees/GetFolloweesQuery.cs](/Application/Friend/Queries/GetFollowees/GetFolloweesQuery.cs) | C# | 4 | 0 | 3 | 7 |
| [Application/Friend/Queries/GetFollowees/GetFolloweesQueryHandler.cs](/Application/Friend/Queries/GetFollowees/GetFolloweesQueryHandler.cs) | C# | 38 | 0 | 8 | 46 |
| [Application/Friend/Queries/GetFriendRecommendations/GetFriendRecommendationsQuery.cs](/Application/Friend/Queries/GetFriendRecommendations/GetFriendRecommendationsQuery.cs) | C# | 7 | 0 | 2 | 9 |
| [Application/Friend/Queries/GetFriendRecommendations/GetFriendRecommendationsQueryHandler.cs](/Application/Friend/Queries/GetFriendRecommendations/GetFriendRecommendationsQueryHandler.cs) | C# | 23 | 0 | 4 | 27 |
| [Application/Friend/Queries/GetFriends/GetFriendsQuery.cs](/Application/Friend/Queries/GetFriends/GetFriendsQuery.cs) | C# | 6 | 0 | 3 | 9 |
| [Application/Friend/Queries/GetFriends/GetFriendsQueryHandler.cs](/Application/Friend/Queries/GetFriends/GetFriendsQueryHandler.cs) | C# | 39 | 0 | 9 | 48 |
| [Application/Friend/Queries/GetIncomingFriendRequests/GetIncomingFriendRequestsQuery.cs](/Application/Friend/Queries/GetIncomingFriendRequests/GetIncomingFriendRequestsQuery.cs) | C# | 10 | 0 | 2 | 12 |
| [Application/Friend/Queries/GetIncomingFriendRequests/GetIncomingFriendRequestsQueryHandler.cs](/Application/Friend/Queries/GetIncomingFriendRequests/GetIncomingFriendRequestsQueryHandler.cs) | C# | 58 | 0 | 10 | 68 |
| [Application/Friend/Queries/GetMutualFriends/GetMutualFriendsQuery.cs](/Application/Friend/Queries/GetMutualFriends/GetMutualFriendsQuery.cs) | C# | 7 | 0 | 2 | 9 |
| [Application/Friend/Queries/GetMutualFriends/GetMutualFriendsQueryHandler.cs](/Application/Friend/Queries/GetMutualFriends/GetMutualFriendsQueryHandler.cs) | C# | 23 | 0 | 4 | 27 |
| [Application/Friend/Queries/GetShortestPath/GetShortestPathQuery.cs](/Application/Friend/Queries/GetShortestPath/GetShortestPathQuery.cs) | C# | 7 | 0 | 2 | 9 |
| [Application/Friend/Queries/GetShortestPath/GetShortestPathQueryHandler.cs](/Application/Friend/Queries/GetShortestPath/GetShortestPathQueryHandler.cs) | C# | 23 | 0 | 4 | 27 |
| [Application/Groups/Commands/AssignGroupRole/AssignGroupRoleCommand.cs](/Application/Groups/Commands/AssignGroupRole/AssignGroupRoleCommand.cs) | C# | 11 | 0 | 2 | 13 |
| [Application/Groups/Commands/AssignGroupRole/AssignGroupRoleCommandHandler.cs](/Application/Groups/Commands/AssignGroupRole/AssignGroupRoleCommandHandler.cs) | C# | 92 | 0 | 16 | 108 |
| [Application/Groups/Commands/CreateGroupRule/CreateGroupRuleCommand.cs](/Application/Groups/Commands/CreateGroupRule/CreateGroupRuleCommand.cs) | C# | 10 | 0 | 2 | 12 |
| [Application/Groups/Commands/CreateGroupRule/CreateGroupRuleCommandHandler.cs](/Application/Groups/Commands/CreateGroupRule/CreateGroupRuleCommandHandler.cs) | C# | 47 | 1 | 9 | 57 |
| [Application/Groups/Commands/CreateGroup/CreateGroupCommand.cs](/Application/Groups/Commands/CreateGroup/CreateGroupCommand.cs) | C# | 10 | 0 | 2 | 12 |
| [Application/Groups/Commands/CreateGroup/CreateGroupCommandHandler.cs](/Application/Groups/Commands/CreateGroup/CreateGroupCommandHandler.cs) | C# | 60 | 1 | 9 | 70 |
| [Application/Groups/Commands/DeleteGroupRule/DeleteGroupRuleCommand.cs](/Application/Groups/Commands/DeleteGroupRule/DeleteGroupRuleCommand.cs) | C# | 9 | 0 | 2 | 11 |
| [Application/Groups/Commands/DeleteGroupRule/DeleteGroupRuleCommandHandler.cs](/Application/Groups/Commands/DeleteGroupRule/DeleteGroupRuleCommandHandler.cs) | C# | 49 | 1 | 9 | 59 |
| [Application/Groups/Commands/ExecuteReportedContent/ExecuteReportedContentCommand.cs](/Application/Groups/Commands/ExecuteReportedContent/ExecuteReportedContentCommand.cs) | C# | 10 | 0 | 2 | 12 |
| [Application/Groups/Commands/ExecuteReportedContent/ExecuteReportedContentCommandHandler.cs](/Application/Groups/Commands/ExecuteReportedContent/ExecuteReportedContentCommandHandler.cs) | C# | 85 | 0 | 13 | 98 |
| [Application/Groups/Commands/JoinGroup/JoinGroupCommand.cs](/Application/Groups/Commands/JoinGroup/JoinGroupCommand.cs) | C# | 8 | 0 | 2 | 10 |
| [Application/Groups/Commands/JoinGroup/JoinGroupCommandHandler.cs](/Application/Groups/Commands/JoinGroup/JoinGroupCommandHandler.cs) | C# | 67 | 3 | 11 | 81 |
| [Application/Groups/Commands/LeaveGroup/LeaveGroupCommand.cs](/Application/Groups/Commands/LeaveGroup/LeaveGroupCommand.cs) | C# | 7 | 0 | 2 | 9 |
| [Application/Groups/Commands/LeaveGroup/LeaveGroupCommandHandler.cs](/Application/Groups/Commands/LeaveGroup/LeaveGroupCommandHandler.cs) | C# | 45 | 0 | 8 | 53 |
| [Application/Groups/Commands/ReportGroupPost/ReportGroupPostCommand.cs](/Application/Groups/Commands/ReportGroupPost/ReportGroupPostCommand.cs) | C# | 11 | 0 | 2 | 13 |
| [Application/Groups/Commands/ReportGroupPost/ReportGroupPostCommandHandler.cs](/Application/Groups/Commands/ReportGroupPost/ReportGroupPostCommandHandler.cs) | C# | 78 | 0 | 13 | 91 |
| [Application/Groups/Commands/ReviewGroupJoinRequest/ReviewGroupJoinRequestCommand.cs](/Application/Groups/Commands/ReviewGroupJoinRequest/ReviewGroupJoinRequestCommand.cs) | C# | 10 | 0 | 2 | 12 |
| [Application/Groups/Commands/ReviewGroupJoinRequest/ReviewGroupJoinRequestCommandHandler.cs](/Application/Groups/Commands/ReviewGroupJoinRequest/ReviewGroupJoinRequestCommandHandler.cs) | C# | 58 | 2 | 10 | 70 |
| [Application/Groups/Commands/ReviewGroupPost/ReviewGroupPostCommand.cs](/Application/Groups/Commands/ReviewGroupPost/ReviewGroupPostCommand.cs) | C# | 9 | 0 | 2 | 11 |
| [Application/Groups/Commands/ReviewGroupPost/ReviewGroupPostCommandHandler.cs](/Application/Groups/Commands/ReviewGroupPost/ReviewGroupPostCommandHandler.cs) | C# | 68 | 0 | 11 | 79 |
| [Application/Groups/Commands/UpdateGroupRule/UpdateGroupRuleCommand.cs](/Application/Groups/Commands/UpdateGroupRule/UpdateGroupRuleCommand.cs) | C# | 11 | 0 | 2 | 13 |
| [Application/Groups/Commands/UpdateGroupRule/UpdateGroupRuleCommandHandler.cs](/Application/Groups/Commands/UpdateGroupRule/UpdateGroupRuleCommandHandler.cs) | C# | 55 | 1 | 10 | 66 |
| [Application/Groups/Commands/UpdateGroup/UpdateGroupCommand.cs](/Application/Groups/Commands/UpdateGroup/UpdateGroupCommand.cs) | C# | 14 | 0 | 2 | 16 |
| [Application/Groups/Commands/UpdateGroup/UpdateGroupCommandHandler.cs](/Application/Groups/Commands/UpdateGroup/UpdateGroupCommandHandler.cs) | C# | 50 | 0 | 9 | 59 |
| [Application/Groups/Commands/UploadGroupCoverPhoto/UploadGroupCoverPhotoCommand.cs](/Application/Groups/Commands/UploadGroupCoverPhoto/UploadGroupCoverPhotoCommand.cs) | C# | 7 | 0 | 2 | 9 |
| [Application/Groups/Commands/UploadGroupCoverPhoto/UploadGroupCoverPhotoCommandHandler.cs](/Application/Groups/Commands/UploadGroupCoverPhoto/UploadGroupCoverPhotoCommandHandler.cs) | C# | 53 | 0 | 7 | 60 |
| [Application/Groups/Queries/GetGroupDetail/GetGroupDetailQuery.cs](/Application/Groups/Queries/GetGroupDetail/GetGroupDetailQuery.cs) | C# | 8 | 0 | 2 | 10 |
| [Application/Groups/Queries/GetGroupDetail/GetGroupDetailQueryHandler.cs](/Application/Groups/Queries/GetGroupDetail/GetGroupDetailQueryHandler.cs) | C# | 49 | 0 | 8 | 57 |
| [Application/Groups/Queries/GetGroupInsights/GetGroupInsightsQuery.cs](/Application/Groups/Queries/GetGroupInsights/GetGroupInsightsQuery.cs) | C# | 10 | 0 | 2 | 12 |
| [Application/Groups/Queries/GetGroupInsights/GetGroupInsightsQueryHandler.cs](/Application/Groups/Queries/GetGroupInsights/GetGroupInsightsQueryHandler.cs) | C# | 113 | 9 | 20 | 142 |
| [Application/Groups/Queries/GetGroupJoinRequests/GetGroupJoinRequestsQuery.cs](/Application/Groups/Queries/GetGroupJoinRequests/GetGroupJoinRequestsQuery.cs) | C# | 14 | 0 | 2 | 16 |
| [Application/Groups/Queries/GetGroupJoinRequests/GetGroupJoinRequestsQueryHandler.cs](/Application/Groups/Queries/GetGroupJoinRequests/GetGroupJoinRequestsQueryHandler.cs) | C# | 60 | 0 | 8 | 68 |
| [Application/Groups/Queries/GetGroupMembers/GetGroupMembersQuery.cs](/Application/Groups/Queries/GetGroupMembers/GetGroupMembersQuery.cs) | C# | 13 | 0 | 2 | 15 |
| [Application/Groups/Queries/GetGroupMembers/GetGroupMembersQueryHandler.cs](/Application/Groups/Queries/GetGroupMembers/GetGroupMembersQueryHandler.cs) | C# | 53 | 0 | 7 | 60 |
| [Application/Groups/Queries/GetGroupRules/GetGroupRulesQuery.cs](/Application/Groups/Queries/GetGroupRules/GetGroupRulesQuery.cs) | C# | 7 | 0 | 2 | 9 |
| [Application/Groups/Queries/GetGroupRules/GetGroupRulesQueryHandler.cs](/Application/Groups/Queries/GetGroupRules/GetGroupRulesQueryHandler.cs) | C# | 33 | 0 | 6 | 39 |
| [Application/Groups/Queries/GetGroups/GetGroupsQuery.cs](/Application/Groups/Queries/GetGroups/GetGroupsQuery.cs) | C# | 11 | 0 | 3 | 14 |
| [Application/Groups/Queries/GetGroups/GetGroupsQueryHandler.cs](/Application/Groups/Queries/GetGroups/GetGroupsQueryHandler.cs) | C# | 27 | 0 | 7 | 34 |
| [Application/Groups/Queries/GetReportedContents/GetReportedContentsQuery.cs](/Application/Groups/Queries/GetReportedContents/GetReportedContentsQuery.cs) | C# | 13 | 0 | 2 | 15 |
| [Application/Groups/Queries/GetReportedContents/GetReportedContentsQueryHandler.cs](/Application/Groups/Queries/GetReportedContents/GetReportedContentsQueryHandler.cs) | C# | 71 | 0 | 8 | 79 |
| [Application/Messages/Commands/ForwardMessage/ForwardMessageCommand.cs](/Application/Messages/Commands/ForwardMessage/ForwardMessageCommand.cs) | C# | 6 | 0 | 3 | 9 |
| [Application/Messages/Commands/ForwardMessage/ForwardMessageCommandHandler.cs](/Application/Messages/Commands/ForwardMessage/ForwardMessageCommandHandler.cs) | C# | 54 | 3 | 13 | 70 |
| [Application/Messages/Commands/InvokeMessage/InvokeMessageCommand.cs](/Application/Messages/Commands/InvokeMessage/InvokeMessageCommand.cs) | C# | 3 | 0 | 3 | 6 |
| [Application/Messages/Commands/InvokeMessage/InvokeMessageCommandHandler.cs](/Application/Messages/Commands/InvokeMessage/InvokeMessageCommandHandler.cs) | C# | 36 | 0 | 10 | 46 |
| [Application/Messages/Commands/SendMessage/SendMessageCommand.cs](/Application/Messages/Commands/SendMessage/SendMessageCommand.cs) | C# | 8 | 0 | 2 | 10 |
| [Application/Messages/Commands/SendMessage/SendMessageCommandHandler.cs](/Application/Messages/Commands/SendMessage/SendMessageCommandHandler.cs) | C# | 54 | 7 | 12 | 73 |
| [Application/Messages/Commands/UpdateMessage/UpdateMessageCommand.cs](/Application/Messages/Commands/UpdateMessage/UpdateMessageCommand.cs) | C# | 9 | 0 | 2 | 11 |
| [Application/Messages/Commands/UpdateMessage/UpdateMessageCommandHandler.cs](/Application/Messages/Commands/UpdateMessage/UpdateMessageCommandHandler.cs) | C# | 39 | 0 | 9 | 48 |
| [Application/Messages/Queries/GetMessagesAround/GetMessagesAroundQuery.cs](/Application/Messages/Queries/GetMessagesAround/GetMessagesAroundQuery.cs) | C# | 9 | 0 | 3 | 12 |
| [Application/Messages/Queries/GetMessagesAround/GetMessagesAroundQueryHandler.cs](/Application/Messages/Queries/GetMessagesAround/GetMessagesAroundQueryHandler.cs) | C# | 39 | 3 | 8 | 50 |
| [Application/Messages/Queries/SearchMessages/SearchMessagesQuery.cs](/Application/Messages/Queries/SearchMessages/SearchMessagesQuery.cs) | C# | 7 | 0 | 3 | 10 |
| [Application/Messages/Queries/SearchMessages/SearchMessagesQueryHandler.cs](/Application/Messages/Queries/SearchMessages/SearchMessagesQueryHandler.cs) | C# | 39 | 4 | 9 | 52 |
| [Application/Posts/Commands/CreateComment/CreateCommentCommand.cs](/Application/Posts/Commands/CreateComment/CreateCommentCommand.cs) | C# | 11 | 0 | 2 | 13 |
| [Application/Posts/Commands/CreateComment/CreateCommentCommandHandler.cs](/Application/Posts/Commands/CreateComment/CreateCommentCommandHandler.cs) | C# | 93 | 0 | 13 | 106 |
| [Application/Posts/Commands/CreatePost/CreatePostCommand.cs](/Application/Posts/Commands/CreatePost/CreatePostCommand.cs) | C# | 22 | 0 | 3 | 25 |
| [Application/Posts/Commands/CreatePost/CreatePostCommandHandler.cs](/Application/Posts/Commands/CreatePost/CreatePostCommandHandler.cs) | C# | 218 | 1 | 30 | 249 |
| [Application/Posts/Commands/MarkLatestFeedAsSeen/MarkLatestFeedAsSeenCommand.cs](/Application/Posts/Commands/MarkLatestFeedAsSeen/MarkLatestFeedAsSeenCommand.cs) | C# | 9 | 0 | 3 | 12 |
| [Application/Posts/Commands/MarkLatestFeedAsSeen/MarkLatestFeedAsSeenCommandHandler.cs](/Application/Posts/Commands/MarkLatestFeedAsSeen/MarkLatestFeedAsSeenCommandHandler.cs) | C# | 22 | 0 | 5 | 27 |
| [Application/Posts/Commands/ReactToComment/ReactToCommentCommand.cs](/Application/Posts/Commands/ReactToComment/ReactToCommentCommand.cs) | C# | 10 | 0 | 2 | 12 |
| [Application/Posts/Commands/ReactToComment/ReactToCommentCommandHandler.cs](/Application/Posts/Commands/ReactToComment/ReactToCommentCommandHandler.cs) | C# | 59 | 0 | 9 | 68 |
| [Application/Posts/Commands/ReactToPost/ReactToPostCommand.cs](/Application/Posts/Commands/ReactToPost/ReactToPostCommand.cs) | C# | 10 | 0 | 2 | 12 |
| [Application/Posts/Commands/ReactToPost/ReactToPostCommandHandler.cs](/Application/Posts/Commands/ReactToPost/ReactToPostCommandHandler.cs) | C# | 66 | 0 | 11 | 77 |
| [Application/Posts/Commands/SavePost/SavePostCommand.cs](/Application/Posts/Commands/SavePost/SavePostCommand.cs) | C# | 8 | 0 | 2 | 10 |
| [Application/Posts/Commands/SavePost/SavePostCommandHandler.cs](/Application/Posts/Commands/SavePost/SavePostCommandHandler.cs) | C# | 52 | 0 | 9 | 61 |
| [Application/Posts/Commands/SharePost/SharePostCommand.cs](/Application/Posts/Commands/SharePost/SharePostCommand.cs) | C# | 11 | 0 | 2 | 13 |
| [Application/Posts/Commands/SharePost/SharePostCommandHandler.cs](/Application/Posts/Commands/SharePost/SharePostCommandHandler.cs) | C# | 57 | 6 | 11 | 74 |
| [Application/Posts/Commands/UnsavePost/UnsavePostCommand.cs](/Application/Posts/Commands/UnsavePost/UnsavePostCommand.cs) | C# | 8 | 0 | 2 | 10 |
| [Application/Posts/Commands/UnsavePost/UnsavePostCommandHandler.cs](/Application/Posts/Commands/UnsavePost/UnsavePostCommandHandler.cs) | C# | 40 | 0 | 7 | 47 |
| [Application/Posts/Commands/UpdatePost/UpdatePostCommand.cs](/Application/Posts/Commands/UpdatePost/UpdatePostCommand.cs) | C# | 13 | 0 | 2 | 15 |
| [Application/Posts/Commands/UpdatePost/UpdatePostCommandHandler.cs](/Application/Posts/Commands/UpdatePost/UpdatePostCommandHandler.cs) | C# | 51 | 0 | 10 | 61 |
| [Application/Posts/Queries/GetComments/GetCommentsQuery.cs](/Application/Posts/Queries/GetComments/GetCommentsQuery.cs) | C# | 13 | 0 | 2 | 15 |
| [Application/Posts/Queries/GetComments/GetCommentsQueryHandler.cs](/Application/Posts/Queries/GetComments/GetCommentsQueryHandler.cs) | C# | 98 | 0 | 15 | 113 |
| [Application/Posts/Queries/GetFeedPosts/GetFeedPostsQuery.cs](/Application/Posts/Queries/GetFeedPosts/GetFeedPostsQuery.cs) | C# | 12 | 0 | 2 | 14 |
| [Application/Posts/Queries/GetFeedPosts/GetFeedPostsQueryHandler.cs](/Application/Posts/Queries/GetFeedPosts/GetFeedPostsQueryHandler.cs) | C# | 23 | 0 | 6 | 29 |
| [Application/Posts/Queries/GetPossibleTags/GetPossibleTagsQuery.cs](/Application/Posts/Queries/GetPossibleTags/GetPossibleTagsQuery.cs) | C# | 12 | 0 | 2 | 14 |
| [Application/Posts/Queries/GetPossibleTags/GetPossibleTagsQueryHandler.cs](/Application/Posts/Queries/GetPossibleTags/GetPossibleTagsQueryHandler.cs) | C# | 34 | 0 | 7 | 41 |
| [Application/Posts/Queries/GetPostMediasByGroup/GetPostMediasByGroupQuery.cs](/Application/Posts/Queries/GetPostMediasByGroup/GetPostMediasByGroupQuery.cs) | C# | 11 | 0 | 2 | 13 |
| [Application/Posts/Queries/GetPostMediasByGroup/GetPostMediasByGroupQueryHandler.cs](/Application/Posts/Queries/GetPostMediasByGroup/GetPostMediasByGroupQueryHandler.cs) | C# | 57 | 0 | 9 | 66 |
| [Application/Posts/Queries/GetPostMediasByUser/GetPostMediasByUserQuery.cs](/Application/Posts/Queries/GetPostMediasByUser/GetPostMediasByUserQuery.cs) | C# | 11 | 0 | 2 | 13 |
| [Application/Posts/Queries/GetPostMediasByUser/GetPostMediasByUserQueryHandler.cs](/Application/Posts/Queries/GetPostMediasByUser/GetPostMediasByUserQueryHandler.cs) | C# | 57 | 0 | 9 | 66 |
| [Application/Posts/Queries/GetPost/GetPostQuery.cs](/Application/Posts/Queries/GetPost/GetPostQuery.cs) | C# | 6 | 0 | 2 | 8 |
| [Application/Posts/Queries/GetPost/GetPostQueryHandler.cs](/Application/Posts/Queries/GetPost/GetPostQueryHandler.cs) | C# | 145 | 0 | 16 | 161 |
| [Application/Posts/Queries/GetPostsByGroup/GetPostsByGroupQuery.cs](/Application/Posts/Queries/GetPostsByGroup/GetPostsByGroupQuery.cs) | C# | 15 | 0 | 2 | 17 |
| [Application/Posts/Queries/GetPostsByGroup/GetPostsByGroupQueryHandler.cs](/Application/Posts/Queries/GetPostsByGroup/GetPostsByGroupQueryHandler.cs) | C# | 158 | 0 | 19 | 177 |
| [Application/Posts/Queries/GetPostsByPerson/GetPostsByPersonQuery.cs](/Application/Posts/Queries/GetPostsByPerson/GetPostsByPersonQuery.cs) | C# | 12 | 0 | 2 | 14 |
| [Application/Posts/Queries/GetPostsByPerson/GetPostsByPersonQueryHandler.cs](/Application/Posts/Queries/GetPostsByPerson/GetPostsByPersonQueryHandler.cs) | C# | 127 | 0 | 11 | 138 |
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
| [Application/Schools/Commands/AddSchool/AddSchoolCommand.cs](/Application/Schools/Commands/AddSchool/AddSchoolCommand.cs) | C# | 15 | 0 | 2 | 17 |
| [Application/Schools/Commands/AddSchool/AddSchoolCommandHandler.cs](/Application/Schools/Commands/AddSchool/AddSchoolCommandHandler.cs) | C# | 56 | 0 | 8 | 64 |
| [Application/Schools/Commands/DeleteSchool/DeleteSchoolCommand.cs](/Application/Schools/Commands/DeleteSchool/DeleteSchoolCommand.cs) | C# | 6 | 0 | 2 | 8 |
| [Application/Schools/Commands/DeleteSchool/DeleteSchoolCommandHandler.cs](/Application/Schools/Commands/DeleteSchool/DeleteSchoolCommandHandler.cs) | C# | 40 | 0 | 9 | 49 |
| [Application/Schools/Commands/UpdateSchool/UpdateSchoolCommand.cs](/Application/Schools/Commands/UpdateSchool/UpdateSchoolCommand.cs) | C# | 16 | 0 | 2 | 18 |
| [Application/Schools/Commands/UpdateSchool/UpdateSchoolCommandHandler.cs](/Application/Schools/Commands/UpdateSchool/UpdateSchoolCommandHandler.cs) | C# | 55 | 0 | 9 | 64 |
| [Application/Schools/Queries/GetSchools/GetSchoolsQuery.cs](/Application/Schools/Queries/GetSchools/GetSchoolsQuery.cs) | C# | 8 | 0 | 2 | 10 |
| [Application/Schools/Queries/GetSchools/GetSchoolsQueryHandler.cs](/Application/Schools/Queries/GetSchools/GetSchoolsQueryHandler.cs) | C# | 34 | 0 | 6 | 40 |
| [Application/Shared/PagedList.cs](/Application/Shared/PagedList.cs) | C# | 32 | 3 | 6 | 41 |
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
| [Application/Users/Commands/FollowUser/FollowUserCommand.cs](/Application/Users/Commands/FollowUser/FollowUserCommand.cs) | C# | 8 | 0 | 2 | 10 |
| [Application/Users/Commands/FollowUser/FollowUserCommandHandler.cs](/Application/Users/Commands/FollowUser/FollowUserCommandHandler.cs) | C# | 49 | 0 | 10 | 59 |
| [Application/Users/Commands/UnfollowUser/UnfollowUserCommand.cs](/Application/Users/Commands/UnfollowUser/UnfollowUserCommand.cs) | C# | 8 | 0 | 2 | 10 |
| [Application/Users/Commands/UnfollowUser/UnfollowUserCommandHandler.cs](/Application/Users/Commands/UnfollowUser/UnfollowUserCommandHandler.cs) | C# | 42 | 0 | 9 | 51 |
| [Application/Users/Commands/UpdateInfo/UpdateInfoCommand.cs](/Application/Users/Commands/UpdateInfo/UpdateInfoCommand.cs) | C# | 17 | 0 | 2 | 19 |
| [Application/Users/Commands/UpdateInfo/UpdateInfoCommandHandler.cs](/Application/Users/Commands/UpdateInfo/UpdateInfoCommandHandler.cs) | C# | 69 | 3 | 11 | 83 |
| [Application/Users/Commands/UploadAvatar/UploadAvatarCommand.cs](/Application/Users/Commands/UploadAvatar/UploadAvatarCommand.cs) | C# | 7 | 0 | 2 | 9 |
| [Application/Users/Commands/UploadAvatar/UploadAvatarCommandHandler.cs](/Application/Users/Commands/UploadAvatar/UploadAvatarCommandHandler.cs) | C# | 68 | 1 | 9 | 78 |
| [Application/Users/Commands/UploadCoverPhoto/UploadCoverPhotoCommand.cs](/Application/Users/Commands/UploadCoverPhoto/UploadCoverPhotoCommand.cs) | C# | 7 | 0 | 2 | 9 |
| [Application/Users/Commands/UploadCoverPhoto/UploadCoverPhotoCommandHandler.cs](/Application/Users/Commands/UploadCoverPhoto/UploadCoverPhotoCommandHandler.cs) | C# | 47 | 0 | 8 | 55 |
| [Application/Users/Queries/GetPersonalInfo/GetPersonalInfoQuery.cs](/Application/Users/Queries/GetPersonalInfo/GetPersonalInfoQuery.cs) | C# | 7 | 0 | 2 | 9 |
| [Application/Users/Queries/GetPersonalInfo/GetPersonalInfoQueryHandler.cs](/Application/Users/Queries/GetPersonalInfo/GetPersonalInfoQueryHandler.cs) | C# | 89 | 0 | 15 | 104 |
| [Application/Users/Queries/GetUserHoverCard/GetUserHoverCardQuery.cs](/Application/Users/Queries/GetUserHoverCard/GetUserHoverCardQuery.cs) | C# | 6 | 0 | 2 | 8 |
| [Application/Users/Queries/GetUserHoverCard/GetUserHoverCardQueryHandler.cs](/Application/Users/Queries/GetUserHoverCard/GetUserHoverCardQueryHandler.cs) | C# | 67 | 1 | 11 | 79 |
| [Application/bin/Debug/net10.0/Application.deps.json](/Application/bin/Debug/net10.0/Application.deps.json) | JSON | 576 | 0 | 0 | 576 |
| [Application/obj/Application.csproj.nuget.dgspec.json](/Application/obj/Application.csproj.nuget.dgspec.json) | JSON | 710 | 0 | 0 | 710 |
| [Application/obj/Application.csproj.nuget.g.props](/Application/obj/Application.csproj.nuget.g.props) | XML | 19 | 0 | 0 | 19 |
| [Application/obj/Application.csproj.nuget.g.targets](/Application/obj/Application.csproj.nuget.g.targets) | XML | 8 | 0 | 0 | 8 |
| [Application/obj/Debug/net10.0/.NETCoreApp,Version=v10.0.AssemblyAttributes.cs](/Application/obj/Debug/net10.0/.NETCoreApp,Version=v10.0.AssemblyAttributes.cs) | C# | 3 | 1 | 1 | 5 |
| [Application/obj/Debug/net10.0/Application.AssemblyInfo.cs](/Application/obj/Debug/net10.0/Application.AssemblyInfo.cs) | C# | 9 | 10 | 5 | 24 |
| [Application/obj/Debug/net10.0/Application.GeneratedMSBuildEditorConfig.editorconfig](/Application/obj/Debug/net10.0/Application.GeneratedMSBuildEditorConfig.editorconfig) | Properties | 17 | 0 | 1 | 18 |
| [Application/obj/Debug/net10.0/Application.GlobalUsings.g.cs](/Application/obj/Debug/net10.0/Application.GlobalUsings.g.cs) | C# | 7 | 1 | 1 | 9 |
| [Application/obj/Debug/net10.0/Application.sourcelink.json](/Application/obj/Debug/net10.0/Application.sourcelink.json) | JSON | 1 | 0 | 0 | 1 |
| [Application/obj/project.assets.json](/Application/obj/project.assets.json) | JSON | 1,694 | 0 | 0 | 1,694 |
| [Domain/Common/AggregateRoot.cs](/Domain/Common/AggregateRoot.cs) | C# | 14 | 0 | 6 | 20 |
| [Domain/Common/BaseEntity.cs](/Domain/Common/BaseEntity.cs) | C# | 26 | 0 | 8 | 34 |
| [Domain/Common/IDomainEvent.cs](/Domain/Common/IDomainEvent.cs) | C# | 7 | 0 | 1 | 8 |
| [Domain/Common/IHasDomainEvents.cs](/Domain/Common/IHasDomainEvents.cs) | C# | 9 | 0 | 2 | 11 |
| [Domain/Domain.csproj](/Domain/Domain.csproj) | XML | 14 | 0 | 5 | 19 |
| [Domain/Entities/BlockChat.cs](/Domain/Entities/BlockChat.cs) | C# | 17 | 1 | 6 | 24 |
| [Domain/Entities/CommentReaction.cs](/Domain/Entities/CommentReaction.cs) | C# | 26 | 0 | 6 | 32 |
| [Domain/Entities/Conversation.cs](/Domain/Entities/Conversation.cs) | C# | 60 | 0 | 15 | 75 |
| [Domain/Entities/ConversationMember.cs](/Domain/Entities/ConversationMember.cs) | C# | 37 | 1 | 8 | 46 |
| [Domain/Entities/Following.cs](/Domain/Entities/Following.cs) | C# | 21 | 0 | 6 | 27 |
| [Domain/Entities/FriendRequest.cs](/Domain/Entities/FriendRequest.cs) | C# | 33 | 1 | 10 | 44 |
| [Domain/Entities/Friendship.cs](/Domain/Entities/Friendship.cs) | C# | 25 | 1 | 6 | 32 |
| [Domain/Entities/Group.cs](/Domain/Entities/Group.cs) | C# | 137 | 6 | 27 | 170 |
| [Domain/Entities/GroupJoinRequest.cs](/Domain/Entities/GroupJoinRequest.cs) | C# | 29 | 1 | 7 | 37 |
| [Domain/Entities/GroupMember.cs](/Domain/Entities/GroupMember.cs) | C# | 25 | 1 | 6 | 32 |
| [Domain/Entities/GroupRule.cs](/Domain/Entities/GroupRule.cs) | C# | 27 | 1 | 6 | 34 |
| [Domain/Entities/MemberMessage.cs](/Domain/Entities/MemberMessage.cs) | C# | 21 | 1 | 7 | 29 |
| [Domain/Entities/Message.cs](/Domain/Entities/Message.cs) | C# | 72 | 1 | 15 | 88 |
| [Domain/Entities/MessageAttachtment.cs](/Domain/Entities/MessageAttachtment.cs) | C# | 24 | 1 | 5 | 30 |
| [Domain/Entities/Notification.cs](/Domain/Entities/Notification.cs) | C# | 41 | 1 | 6 | 48 |
| [Domain/Entities/Post.cs](/Domain/Entities/Post.cs) | C# | 126 | 7 | 23 | 156 |
| [Domain/Entities/PostComment.cs](/Domain/Entities/PostComment.cs) | C# | 41 | 2 | 8 | 51 |
| [Domain/Entities/PostMedia.cs](/Domain/Entities/PostMedia.cs) | C# | 30 | 1 | 5 | 36 |
| [Domain/Entities/PostReaction.cs](/Domain/Entities/PostReaction.cs) | C# | 26 | 0 | 6 | 32 |
| [Domain/Entities/PostTag.cs](/Domain/Entities/PostTag.cs) | C# | 19 | 1 | 5 | 25 |
| [Domain/Entities/Reel.cs](/Domain/Entities/Reel.cs) | C# | 71 | 0 | 11 | 82 |
| [Domain/Entities/ReelComment.cs](/Domain/Entities/ReelComment.cs) | C# | 43 | 0 | 9 | 52 |
| [Domain/Entities/ReelReaction.cs](/Domain/Entities/ReelReaction.cs) | C# | 18 | 0 | 5 | 23 |
| [Domain/Entities/ReportedGroupContent.cs](/Domain/Entities/ReportedGroupContent.cs) | C# | 52 | 6 | 15 | 73 |
| [Domain/Entities/SavedPost.cs](/Domain/Entities/SavedPost.cs) | C# | 21 | 1 | 5 | 27 |
| [Domain/Entities/School.cs](/Domain/Entities/School.cs) | C# | 56 | 1 | 8 | 65 |
| [Domain/Entities/Story.cs](/Domain/Entities/Story.cs) | C# | 50 | 0 | 9 | 59 |
| [Domain/Entities/StoryReaction.cs](/Domain/Entities/StoryReaction.cs) | C# | 16 | 0 | 6 | 22 |
| [Domain/Entities/StorySeen.cs](/Domain/Entities/StorySeen.cs) | C# | 22 | 0 | 7 | 29 |
| [Domain/Entities/User.cs](/Domain/Entities/User.cs) | C# | 124 | 1 | 27 | 152 |
| [Domain/Entities/UserFeed.cs](/Domain/Entities/UserFeed.cs) | C# | 44 | 1 | 7 | 52 |
| [Domain/Enums/ConversationRole.cs](/Domain/Enums/ConversationRole.cs) | C# | 8 | 0 | 1 | 9 |
| [Domain/Enums/DegreeType.cs](/Domain/Enums/DegreeType.cs) | C# | 10 | 0 | 1 | 11 |
| [Domain/Enums/Feeling.cs](/Domain/Enums/Feeling.cs) | C# | 32 | 0 | 1 | 33 |
| [Domain/Enums/FriendRequestStatus.cs](/Domain/Enums/FriendRequestStatus.cs) | C# | 10 | 0 | 1 | 11 |
| [Domain/Enums/Gender.cs](/Domain/Enums/Gender.cs) | C# | 8 | 0 | 0 | 8 |
| [Domain/Enums/GroupContentType.cs](/Domain/Enums/GroupContentType.cs) | C# | 8 | 1 | 1 | 10 |
| [Domain/Enums/GroupMemberRole.cs](/Domain/Enums/GroupMemberRole.cs) | C# | 9 | 0 | 1 | 10 |
| [Domain/Enums/GroupPrivacyType.cs](/Domain/Enums/GroupPrivacyType.cs) | C# | 8 | 0 | 1 | 9 |
| [Domain/Enums/GroupReportReason.cs](/Domain/Enums/GroupReportReason.cs) | C# | 14 | 1 | 1 | 16 |
| [Domain/Enums/GroupReportStatus.cs](/Domain/Enums/GroupReportStatus.cs) | C# | 9 | 4 | 3 | 16 |
| [Domain/Enums/GroupRequestStatus.cs](/Domain/Enums/GroupRequestStatus.cs) | C# | 9 | 0 | 1 | 10 |
| [Domain/Enums/MessageStatus.cs](/Domain/Enums/MessageStatus.cs) | C# | 7 | 0 | 1 | 8 |
| [Domain/Enums/MessageType.cs](/Domain/Enums/MessageType.cs) | C# | 8 | 0 | 3 | 11 |
| [Domain/Enums/NotificationEntityType.cs](/Domain/Enums/NotificationEntityType.cs) | C# | 10 | 0 | 1 | 11 |
| [Domain/Enums/NotificationType.cs](/Domain/Enums/NotificationType.cs) | C# | 13 | 0 | 1 | 14 |
| [Domain/Enums/PostApprovalStatus.cs](/Domain/Enums/PostApprovalStatus.cs) | C# | 9 | 4 | 3 | 16 |
| [Domain/Enums/PostVisibility.cs](/Domain/Enums/PostVisibility.cs) | C# | 10 | 0 | 1 | 11 |
| [Domain/Enums/ReactionTargetType.cs](/Domain/Enums/ReactionTargetType.cs) | C# | 8 | 0 | 1 | 9 |
| [Domain/Enums/ReactionType.cs](/Domain/Enums/ReactionType.cs) | C# | 12 | 0 | 1 | 13 |
| [Domain/Enums/ReelVisibility.cs](/Domain/Enums/ReelVisibility.cs) | C# | 9 | 0 | 1 | 10 |
| [Domain/Enums/RelationshipStatus.cs](/Domain/Enums/RelationshipStatus.cs) | C# | 15 | 0 | 1 | 16 |
| [Domain/Enums/SchoolType.cs](/Domain/Enums/SchoolType.cs) | C# | 11 | 0 | 1 | 12 |
| [Domain/Enums/StoryMediaType.cs](/Domain/Enums/StoryMediaType.cs) | C# | 6 | 0 | 2 | 8 |
| [Domain/Enums/UserFeedType.cs](/Domain/Enums/UserFeedType.cs) | C# | 11 | 0 | 1 | 12 |
| [Domain/Enums/WhoCanApprove.cs](/Domain/Enums/WhoCanApprove.cs) | C# | 8 | 3 | 2 | 13 |
| [Domain/Enums/WhoCanJoin.cs](/Domain/Enums/WhoCanJoin.cs) | C# | 8 | 3 | 2 | 13 |
| [Domain/Enums/WhoCanPost.cs](/Domain/Enums/WhoCanPost.cs) | C# | 9 | 4 | 3 | 16 |
| [Domain/Events/FriendshipCreatedDomainEvent.cs](/Domain/Events/FriendshipCreatedDomainEvent.cs) | C# | 10 | 0 | 2 | 12 |
| [Domain/Events/UnfriendedDomainEvent.cs](/Domain/Events/UnfriendedDomainEvent.cs) | C# | 10 | 0 | 2 | 12 |
| [Domain/Shared/Error.cs](/Domain/Shared/Error.cs) | C# | 40 | 0 | 13 | 53 |
| [Domain/Shared/IValidationResult.cs](/Domain/Shared/IValidationResult.cs) | C# | 10 | 0 | 1 | 11 |
| [Domain/Shared/Result.cs](/Domain/Shared/Result.cs) | C# | 36 | 1 | 11 | 48 |
| [Domain/Shared/ResultT.cs](/Domain/Shared/ResultT.cs) | C# | 19 | 0 | 4 | 23 |
| [Domain/Shared/ValidationResult.cs](/Domain/Shared/ValidationResult.cs) | C# | 11 | 0 | 3 | 14 |
| [Domain/Shared/ValidationResultT.cs](/Domain/Shared/ValidationResultT.cs) | C# | 11 | 0 | 3 | 14 |
| [Domain/bin/Debug/net10.0/Domain.deps.json](/Domain/bin/Debug/net10.0/Domain.deps.json) | JSON | 544 | 0 | 0 | 544 |
| [Domain/obj/Debug/net10.0/.NETCoreApp,Version=v10.0.AssemblyAttributes.cs](/Domain/obj/Debug/net10.0/.NETCoreApp,Version=v10.0.AssemblyAttributes.cs) | C# | 3 | 1 | 1 | 5 |
| [Domain/obj/Debug/net10.0/Domain.AssemblyInfo.cs](/Domain/obj/Debug/net10.0/Domain.AssemblyInfo.cs) | C# | 9 | 10 | 5 | 24 |
| [Domain/obj/Debug/net10.0/Domain.GeneratedMSBuildEditorConfig.editorconfig](/Domain/obj/Debug/net10.0/Domain.GeneratedMSBuildEditorConfig.editorconfig) | Properties | 17 | 0 | 1 | 18 |
| [Domain/obj/Debug/net10.0/Domain.GlobalUsings.g.cs](/Domain/obj/Debug/net10.0/Domain.GlobalUsings.g.cs) | C# | 7 | 1 | 1 | 9 |
| [Domain/obj/Debug/net10.0/Domain.sourcelink.json](/Domain/obj/Debug/net10.0/Domain.sourcelink.json) | JSON | 1 | 0 | 0 | 1 |
| [Domain/obj/Domain.csproj.nuget.dgspec.json](/Domain/obj/Domain.csproj.nuget.dgspec.json) | JSON | 359 | 0 | 0 | 359 |
| [Domain/obj/Domain.csproj.nuget.g.props](/Domain/obj/Domain.csproj.nuget.g.props) | XML | 19 | 0 | 0 | 19 |
| [Domain/obj/Domain.csproj.nuget.g.targets](/Domain/obj/Domain.csproj.nuget.g.targets) | XML | 8 | 0 | 0 | 8 |
| [Domain/obj/project.assets.json](/Domain/obj/project.assets.json) | JSON | 1,647 | 0 | 0 | 1,647 |
| [Infrastructure/Authentication/TokenService.cs](/Infrastructure/Authentication/TokenService.cs) | C# | 42 | 0 | 9 | 51 |
| [Infrastructure/BackgroundJobs/OutboxProcessingBackgroundService.cs](/Infrastructure/BackgroundJobs/OutboxProcessingBackgroundService.cs) | C# | 63 | 0 | 10 | 73 |
| [Infrastructure/DependencyInjection.cs](/Infrastructure/DependencyInjection.cs) | C# | 72 | 1 | 9 | 82 |
| [Infrastructure/Extensions/ClaimsPrincipalExtensions.cs](/Infrastructure/Extensions/ClaimsPrincipalExtensions.cs) | C# | 13 | 0 | 2 | 15 |
| [Infrastructure/Infrastructure.csproj](/Infrastructure/Infrastructure.csproj) | XML | 72 | 0 | 6 | 78 |
| [Infrastructure/Migrations/20260326140820\_InitDb.Designer.cs](/Infrastructure/Migrations/20260326140820_InitDb.Designer.cs) | C# | 482 | 2 | 183 | 667 |
| [Infrastructure/Migrations/20260326140820\_InitDb.cs](/Infrastructure/Migrations/20260326140820_InitDb.cs) | C# | 434 | 3 | 46 | 483 |
| [Infrastructure/Migrations/20260329024907\_updb-1.Designer.cs](/Infrastructure/Migrations/20260329024907_updb-1.Designer.cs) | C# | 491 | 2 | 186 | 679 |
| [Infrastructure/Migrations/20260329024907\_updb-1.cs](/Infrastructure/Migrations/20260329024907_updb-1.cs) | C# | 82 | 3 | 14 | 99 |
| [Infrastructure/Migrations/20260331111353\_updb-2.Designer.cs](/Infrastructure/Migrations/20260331111353_updb-2.Designer.cs) | C# | 568 | 2 | 220 | 790 |
| [Infrastructure/Migrations/20260331111353\_updb-2.cs](/Infrastructure/Migrations/20260331111353_updb-2.cs) | C# | 107 | 3 | 14 | 124 |
| [Infrastructure/Migrations/20260406124651\_updb3.Designer.cs](/Infrastructure/Migrations/20260406124651_updb3.Designer.cs) | C# | 567 | 2 | 220 | 789 |
| [Infrastructure/Migrations/20260406124651\_updb3.cs](/Infrastructure/Migrations/20260406124651_updb3.cs) | C# | 30 | 3 | 4 | 37 |
| [Infrastructure/Migrations/20260406125630\_updb4.Designer.cs](/Infrastructure/Migrations/20260406125630_updb4.Designer.cs) | C# | 567 | 2 | 220 | 789 |
| [Infrastructure/Migrations/20260406125630\_updb4.cs](/Infrastructure/Migrations/20260406125630_updb4.cs) | C# | 29 | 3 | 4 | 36 |
| [Infrastructure/Migrations/20260510120539\_updb-4.Designer.cs](/Infrastructure/Migrations/20260510120539_updb-4.Designer.cs) | C# | 579 | 2 | 226 | 807 |
| [Infrastructure/Migrations/20260510120539\_updb-4.cs](/Infrastructure/Migrations/20260510120539_updb-4.cs) | C# | 86 | 3 | 18 | 107 |
| [Infrastructure/Migrations/20260510121353\_updb5.Designer.cs](/Infrastructure/Migrations/20260510121353_updb5.Designer.cs) | C# | 580 | 2 | 226 | 808 |
| [Infrastructure/Migrations/20260510121353\_updb5.cs](/Infrastructure/Migrations/20260510121353_updb5.cs) | C# | 86 | 3 | 18 | 107 |
| [Infrastructure/Migrations/20260510130850\_updb6.Designer.cs](/Infrastructure/Migrations/20260510130850_updb6.Designer.cs) | C# | 582 | 2 | 227 | 811 |
| [Infrastructure/Migrations/20260510130850\_updb6.cs](/Infrastructure/Migrations/20260510130850_updb6.cs) | C# | 22 | 3 | 4 | 29 |
| [Infrastructure/Migrations/20260518122331\_updb7.Designer.cs](/Infrastructure/Migrations/20260518122331_updb7.Designer.cs) | C# | 1,079 | 2 | 440 | 1,521 |
| [Infrastructure/Migrations/20260518122331\_updb7.cs](/Infrastructure/Migrations/20260518122331_updb7.cs) | C# | 554 | 3 | 68 | 625 |
| [Infrastructure/Migrations/20260518123622\_updb8.Designer.cs](/Infrastructure/Migrations/20260518123622_updb8.Designer.cs) | C# | 1,126 | 2 | 459 | 1,587 |
| [Infrastructure/Migrations/20260518123622\_updb8.cs](/Infrastructure/Migrations/20260518123622_updb8.cs) | C# | 66 | 3 | 9 | 78 |
| [Infrastructure/Migrations/20260518145637\_FixRelationshipStatus.Designer.cs](/Infrastructure/Migrations/20260518145637_FixRelationshipStatus.Designer.cs) | C# | 1,123 | 2 | 458 | 1,583 |
| [Infrastructure/Migrations/20260518145637\_FixRelationshipStatus.cs](/Infrastructure/Migrations/20260518145637_FixRelationshipStatus.cs) | C# | 46 | 3 | 6 | 55 |
| [Infrastructure/Migrations/20260521144618\_updb10.Designer.cs](/Infrastructure/Migrations/20260521144618_updb10.Designer.cs) | C# | 1,123 | 2 | 458 | 1,583 |
| [Infrastructure/Migrations/20260521144618\_updb10.cs](/Infrastructure/Migrations/20260521144618_updb10.cs) | C# | 30 | 3 | 4 | 37 |
| [Infrastructure/Migrations/20260524124929\_updb11.Designer.cs](/Infrastructure/Migrations/20260524124929_updb11.Designer.cs) | C# | 1,287 | 2 | 530 | 1,819 |
| [Infrastructure/Migrations/20260524124929\_updb11.cs](/Infrastructure/Migrations/20260524124929_updb11.cs) | C# | 223 | 3 | 29 | 255 |
| [Infrastructure/Migrations/20260527093944\_updb12.Designer.cs](/Infrastructure/Migrations/20260527093944_updb12.Designer.cs) | C# | 1,286 | 2 | 530 | 1,818 |
| [Infrastructure/Migrations/20260527093944\_updb12.cs](/Infrastructure/Migrations/20260527093944_updb12.cs) | C# | 32 | 3 | 4 | 39 |
| [Infrastructure/Migrations/20260528071505\_updb13.Designer.cs](/Infrastructure/Migrations/20260528071505_updb13.Designer.cs) | C# | 1,332 | 2 | 549 | 1,883 |
| [Infrastructure/Migrations/20260528071505\_updb13.cs](/Infrastructure/Migrations/20260528071505_updb13.cs) | C# | 177 | 3 | 22 | 202 |
| [Infrastructure/Migrations/20260528120902\_updb14.Designer.cs](/Infrastructure/Migrations/20260528120902_updb14.Designer.cs) | C# | 1,326 | 2 | 546 | 1,874 |
| [Infrastructure/Migrations/20260528120902\_updb14.cs](/Infrastructure/Migrations/20260528120902_updb14.cs) | C# | 14 | 3 | 6 | 23 |
| [Infrastructure/Migrations/20260528121828\_updb15.Designer.cs](/Infrastructure/Migrations/20260528121828_updb15.Designer.cs) | C# | 1,325 | 2 | 545 | 1,872 |
| [Infrastructure/Migrations/20260528121828\_updb15.cs](/Infrastructure/Migrations/20260528121828_updb15.cs) | C# | 34 | 3 | 6 | 43 |
| [Infrastructure/Migrations/20260529071128\_updb16.Designer.cs](/Infrastructure/Migrations/20260529071128_updb16.Designer.cs) | C# | 1,239 | 2 | 507 | 1,748 |
| [Infrastructure/Migrations/20260529071128\_updb16.cs](/Infrastructure/Migrations/20260529071128_updb16.cs) | C# | 106 | 3 | 12 | 121 |
| [Infrastructure/Migrations/20260531055803\_AddGroupJoinApprovalSettingAndReportedGroupContent.Designer.cs](/Infrastructure/Migrations/20260531055803_AddGroupJoinApprovalSettingAndReportedGroupContent.Designer.cs) | C# | 1,364 | 2 | 554 | 1,920 |
| [Infrastructure/Migrations/20260531055803\_AddGroupJoinApprovalSettingAndReportedGroupContent.cs](/Infrastructure/Migrations/20260531055803_AddGroupJoinApprovalSettingAndReportedGroupContent.cs) | C# | 156 | 3 | 21 | 180 |
| [Infrastructure/Migrations/20260531065118\_AddGroupPostHiddenFields.Designer.cs](/Infrastructure/Migrations/20260531065118_AddGroupPostHiddenFields.Designer.cs) | C# | 1,373 | 2 | 557 | 1,932 |
| [Infrastructure/Migrations/20260531065118\_AddGroupPostHiddenFields.cs](/Infrastructure/Migrations/20260531065118_AddGroupPostHiddenFields.cs) | C# | 41 | 3 | 8 | 52 |
| [Infrastructure/Migrations/20260531094629\_updb17.Designer.cs](/Infrastructure/Migrations/20260531094629_updb17.Designer.cs) | C# | 1,373 | 2 | 557 | 1,932 |
| [Infrastructure/Migrations/20260531094629\_updb17.cs](/Infrastructure/Migrations/20260531094629_updb17.cs) | C# | 14 | 3 | 6 | 23 |
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
| [Infrastructure/Migrations/AppDbContextModelSnapshot.cs](/Infrastructure/Migrations/AppDbContextModelSnapshot.cs) | C# | 1,664 | 1 | 677 | 2,342 |
| [Infrastructure/Outbox/OutboxMessage.cs](/Infrastructure/Outbox/OutboxMessage.cs) | C# | 12 | 0 | 6 | 18 |
| [Infrastructure/Persistence/Configurations/BlockChatConfiguration.cs](/Infrastructure/Persistence/Configurations/BlockChatConfiguration.cs) | C# | 23 | 4 | 5 | 32 |
| [Infrastructure/Persistence/Configurations/ConversationConfiguration.cs](/Infrastructure/Persistence/Configurations/ConversationConfiguration.cs) | C# | 34 | 1 | 14 | 49 |
| [Infrastructure/Persistence/Configurations/ConversationMemberConfiguration.cs](/Infrastructure/Persistence/Configurations/ConversationMemberConfiguration.cs) | C# | 26 | 1 | 4 | 31 |
| [Infrastructure/Persistence/Configurations/FollowingConfiguration.cs](/Infrastructure/Persistence/Configurations/FollowingConfiguration.cs) | C# | 26 | 0 | 7 | 33 |
| [Infrastructure/Persistence/Configurations/FriendRequestConfiguration.cs](/Infrastructure/Persistence/Configurations/FriendRequestConfiguration.cs) | C# | 28 | 1 | 8 | 37 |
| [Infrastructure/Persistence/Configurations/FriendShipConfiguration.cs](/Infrastructure/Persistence/Configurations/FriendShipConfiguration.cs) | C# | 26 | 0 | 7 | 33 |
| [Infrastructure/Persistence/Configurations/GroupConfiguration.cs](/Infrastructure/Persistence/Configurations/GroupConfiguration.cs) | C# | 56 | 12 | 18 | 86 |
| [Infrastructure/Persistence/Configurations/GroupJoinRequestConfiguration.cs](/Infrastructure/Persistence/Configurations/GroupJoinRequestConfiguration.cs) | C# | 24 | 4 | 7 | 35 |
| [Infrastructure/Persistence/Configurations/GroupMemberConfiguration.cs](/Infrastructure/Persistence/Configurations/GroupMemberConfiguration.cs) | C# | 21 | 3 | 6 | 30 |
| [Infrastructure/Persistence/Configurations/GroupRuleConfiguration.cs](/Infrastructure/Persistence/Configurations/GroupRuleConfiguration.cs) | C# | 28 | 1 | 8 | 37 |
| [Infrastructure/Persistence/Configurations/MemberMessageConfiguration.cs](/Infrastructure/Persistence/Configurations/MemberMessageConfiguration.cs) | C# | 14 | 0 | 4 | 18 |
| [Infrastructure/Persistence/Configurations/MessageAttachmentConfiguration.cs](/Infrastructure/Persistence/Configurations/MessageAttachmentConfiguration.cs) | C# | 19 | 0 | 4 | 23 |
| [Infrastructure/Persistence/Configurations/MessageConfiguration.cs](/Infrastructure/Persistence/Configurations/MessageConfiguration.cs) | C# | 47 | 5 | 12 | 64 |
| [Infrastructure/Persistence/Configurations/NotificationConfiguration.cs](/Infrastructure/Persistence/Configurations/NotificationConfiguration.cs) | C# | 36 | 8 | 11 | 55 |
| [Infrastructure/Persistence/Configurations/PostCommentConfiguration.cs](/Infrastructure/Persistence/Configurations/PostCommentConfiguration.cs) | C# | 44 | 11 | 15 | 70 |
| [Infrastructure/Persistence/Configurations/PostConfiguration.cs](/Infrastructure/Persistence/Configurations/PostConfiguration.cs) | C# | 96 | 19 | 32 | 147 |
| [Infrastructure/Persistence/Configurations/PostMediaConfiguration.cs](/Infrastructure/Persistence/Configurations/PostMediaConfiguration.cs) | C# | 28 | 6 | 10 | 44 |
| [Infrastructure/Persistence/Configurations/PostTagConfiguration.cs](/Infrastructure/Persistence/Configurations/PostTagConfiguration.cs) | C# | 25 | 1 | 7 | 33 |
| [Infrastructure/Persistence/Configurations/ReactionConfiguration.cs](/Infrastructure/Persistence/Configurations/ReactionConfiguration.cs) | C# | 60 | 0 | 18 | 78 |
| [Infrastructure/Persistence/Configurations/ReelCommentConfiguration.cs](/Infrastructure/Persistence/Configurations/ReelCommentConfiguration.cs) | C# | 49 | 0 | 16 | 65 |
| [Infrastructure/Persistence/Configurations/ReelConfiguration.cs](/Infrastructure/Persistence/Configurations/ReelConfiguration.cs) | C# | 60 | 0 | 20 | 80 |
| [Infrastructure/Persistence/Configurations/ReelReactionConfiguration.cs](/Infrastructure/Persistence/Configurations/ReelReactionConfiguration.cs) | C# | 32 | 0 | 10 | 42 |
| [Infrastructure/Persistence/Configurations/ReportedGroupContentConfiguration.cs](/Infrastructure/Persistence/Configurations/ReportedGroupContentConfiguration.cs) | C# | 54 | 12 | 18 | 84 |
| [Infrastructure/Persistence/Configurations/SavedPostConfiguration.cs](/Infrastructure/Persistence/Configurations/SavedPostConfiguration.cs) | C# | 20 | 3 | 6 | 29 |
| [Infrastructure/Persistence/Configurations/SchoolConfiguration.cs](/Infrastructure/Persistence/Configurations/SchoolConfiguration.cs) | C# | 32 | 8 | 11 | 51 |
| [Infrastructure/Persistence/Configurations/StoryConfiguration.cs](/Infrastructure/Persistence/Configurations/StoryConfiguration.cs) | C# | 59 | 0 | 23 | 82 |
| [Infrastructure/Persistence/Configurations/StoryReactionConfiguration.cs](/Infrastructure/Persistence/Configurations/StoryReactionConfiguration.cs) | C# | 30 | 0 | 11 | 41 |
| [Infrastructure/Persistence/Configurations/StorySeenConfiguration.cs](/Infrastructure/Persistence/Configurations/StorySeenConfiguration.cs) | C# | 30 | 0 | 11 | 41 |
| [Infrastructure/Persistence/Configurations/UserConfiguration.cs](/Infrastructure/Persistence/Configurations/UserConfiguration.cs) | C# | 166 | 32 | 56 | 254 |
| [Infrastructure/Persistence/Configurations/UserFeedConfiguration.cs](/Infrastructure/Persistence/Configurations/UserFeedConfiguration.cs) | C# | 29 | 6 | 9 | 44 |
| [Infrastructure/Persistence/Contexts/AppDbContext.cs](/Infrastructure/Persistence/Contexts/AppDbContext.cs) | C# | 126 | 2 | 8 | 136 |
| [Infrastructure/Persistence/Contexts/RoleSeeder.cs](/Infrastructure/Persistence/Contexts/RoleSeeder.cs) | C# | 21 | 0 | 4 | 25 |
| [Infrastructure/Persistence/Repositories/ConversationRepository.cs](/Infrastructure/Persistence/Repositories/ConversationRepository.cs) | C# | 119 | 3 | 12 | 134 |
| [Infrastructure/Persistence/Repositories/FeedRepository.cs](/Infrastructure/Persistence/Repositories/FeedRepository.cs) | C# | 234 | 0 | 22 | 256 |
| [Infrastructure/Persistence/Repositories/FriendRequestRepository.cs](/Infrastructure/Persistence/Repositories/FriendRequestRepository.cs) | C# | 61 | 0 | 10 | 71 |
| [Infrastructure/Persistence/Repositories/FriendshipRepository.cs](/Infrastructure/Persistence/Repositories/FriendshipRepository.cs) | C# | 128 | 2 | 20 | 150 |
| [Infrastructure/Persistence/Repositories/GroupListingRepository.cs](/Infrastructure/Persistence/Repositories/GroupListingRepository.cs) | C# | 89 | 4 | 19 | 112 |
| [Infrastructure/Persistence/Repositories/GroupReportRepository.cs](/Infrastructure/Persistence/Repositories/GroupReportRepository.cs) | C# | 54 | 0 | 10 | 64 |
| [Infrastructure/Persistence/Repositories/GroupRepository.cs](/Infrastructure/Persistence/Repositories/GroupRepository.cs) | C# | 117 | 1 | 19 | 137 |
| [Infrastructure/Persistence/Repositories/MessageRepository.cs](/Infrastructure/Persistence/Repositories/MessageRepository.cs) | C# | 90 | 2 | 18 | 110 |
| [Infrastructure/Persistence/Repositories/PostRepository.cs](/Infrastructure/Persistence/Repositories/PostRepository.cs) | C# | 317 | 0 | 54 | 371 |
| [Infrastructure/Persistence/Repositories/ReelRepository.cs](/Infrastructure/Persistence/Repositories/ReelRepository.cs) | C# | 108 | 0 | 19 | 127 |
| [Infrastructure/Persistence/Repositories/SchoolRepository.cs](/Infrastructure/Persistence/Repositories/SchoolRepository.cs) | C# | 40 | 0 | 7 | 47 |
| [Infrastructure/Persistence/Repositories/StoryRepository.cs](/Infrastructure/Persistence/Repositories/StoryRepository.cs) | C# | 160 | 0 | 26 | 186 |
| [Infrastructure/Persistence/Repositories/UnitOfWork.cs](/Infrastructure/Persistence/Repositories/UnitOfWork.cs) | C# | 17 | 0 | 5 | 22 |
| [Infrastructure/Persistence/Repositories/UserRepository.cs](/Infrastructure/Persistence/Repositories/UserRepository.cs) | C# | 50 | 3 | 10 | 63 |
| [Infrastructure/Security/BlindIndexService.cs](/Infrastructure/Security/BlindIndexService.cs) | C# | 35 | 1 | 10 | 46 |
| [Infrastructure/Services/CloudinaryUploadService.cs](/Infrastructure/Services/CloudinaryUploadService.cs) | C# | 147 | 0 | 32 | 179 |
| [Infrastructure/Services/FeedGenerator.cs](/Infrastructure/Services/FeedGenerator.cs) | C# | 231 | 0 | 41 | 272 |
| [Infrastructure/Services/FriendGraphService.cs](/Infrastructure/Services/FriendGraphService.cs) | C# | 228 | 0 | 40 | 268 |
| [Infrastructure/SignalR/ChatHub.cs](/Infrastructure/SignalR/ChatHub.cs) | C# | 75 | 13 | 27 | 115 |
| [Infrastructure/SignalR/PresenceTracker.cs](/Infrastructure/SignalR/PresenceTracker.cs) | C# | 115 | 9 | 24 | 148 |
| [Infrastructure/bin/Debug/net10.0/BuildHost-netcore/Microsoft.CodeAnalysis.Workspaces.MSBuild.BuildHost.deps.json](/Infrastructure/bin/Debug/net10.0/BuildHost-netcore/Microsoft.CodeAnalysis.Workspaces.MSBuild.BuildHost.deps.json) | JSON | 260 | 0 | 0 | 260 |
| [Infrastructure/bin/Debug/net10.0/BuildHost-netcore/Microsoft.CodeAnalysis.Workspaces.MSBuild.BuildHost.runtimeconfig.json](/Infrastructure/bin/Debug/net10.0/BuildHost-netcore/Microsoft.CodeAnalysis.Workspaces.MSBuild.BuildHost.runtimeconfig.json) | JSON | 13 | 0 | 0 | 13 |
| [Infrastructure/bin/Debug/net10.0/Infrastructure.deps.json](/Infrastructure/bin/Debug/net10.0/Infrastructure.deps.json) | JSON | 1,146 | 0 | 0 | 1,146 |
| [Infrastructure/bin/Debug/net10.0/Infrastructure.runtimeconfig.json](/Infrastructure/bin/Debug/net10.0/Infrastructure.runtimeconfig.json) | JSON | 19 | 0 | 0 | 19 |
| [Infrastructure/obj/Debug/net10.0/.NETCoreApp,Version=v10.0.AssemblyAttributes.cs](/Infrastructure/obj/Debug/net10.0/.NETCoreApp,Version=v10.0.AssemblyAttributes.cs) | C# | 3 | 1 | 1 | 5 |
| [Infrastructure/obj/Debug/net10.0/Infrastructure.AssemblyInfo.cs](/Infrastructure/obj/Debug/net10.0/Infrastructure.AssemblyInfo.cs) | C# | 9 | 10 | 5 | 24 |
| [Infrastructure/obj/Debug/net10.0/Infrastructure.GeneratedMSBuildEditorConfig.editorconfig](/Infrastructure/obj/Debug/net10.0/Infrastructure.GeneratedMSBuildEditorConfig.editorconfig) | Properties | 25 | 0 | 1 | 26 |
| [Infrastructure/obj/Debug/net10.0/Infrastructure.GlobalUsings.g.cs](/Infrastructure/obj/Debug/net10.0/Infrastructure.GlobalUsings.g.cs) | C# | 7 | 1 | 1 | 9 |
| [Infrastructure/obj/Debug/net10.0/Infrastructure.sourcelink.json](/Infrastructure/obj/Debug/net10.0/Infrastructure.sourcelink.json) | JSON | 1 | 0 | 0 | 1 |
| [Infrastructure/obj/Infrastructure.csproj.nuget.dgspec.json](/Infrastructure/obj/Infrastructure.csproj.nuget.dgspec.json) | JSON | 1,226 | 0 | 0 | 1,226 |
| [Infrastructure/obj/Infrastructure.csproj.nuget.g.props](/Infrastructure/obj/Infrastructure.csproj.nuget.g.props) | XML | 25 | 0 | 0 | 25 |
| [Infrastructure/obj/Infrastructure.csproj.nuget.g.targets](/Infrastructure/obj/Infrastructure.csproj.nuget.g.targets) | XML | 7 | 0 | 0 | 7 |
| [Infrastructure/obj/project.assets.json](/Infrastructure/obj/project.assets.json) | JSON | 3,786 | 0 | 0 | 3,786 |
| [Presentation/Abstractions/ApiController.cs](/Presentation/Abstractions/ApiController.cs) | C# | 34 | 0 | 3 | 37 |
| [Presentation/Contracts/Auth/LoginRequest.cs](/Presentation/Contracts/Auth/LoginRequest.cs) | C# | 6 | 0 | 1 | 7 |
| [Presentation/Contracts/Auth/RegisterRequest.cs](/Presentation/Contracts/Auth/RegisterRequest.cs) | C# | 12 | 0 | 1 | 13 |
| [Presentation/Contracts/Conversation/CreateConversationRequest.cs](/Presentation/Contracts/Conversation/CreateConversationRequest.cs) | C# | 4 | 0 | 1 | 5 |
| [Presentation/Contracts/Group/AssignGroupRoleRequest.cs](/Presentation/Contracts/Group/AssignGroupRoleRequest.cs) | C# | 7 | 0 | 1 | 8 |
| [Presentation/Contracts/Group/CreateGroupRequest.cs](/Presentation/Contracts/Group/CreateGroupRequest.cs) | C# | 8 | 0 | 1 | 9 |
| [Presentation/Contracts/Group/CreateGroupRuleRequest.cs](/Presentation/Contracts/Group/CreateGroupRuleRequest.cs) | C# | 4 | 0 | 1 | 5 |
| [Presentation/Contracts/Group/ExecuteReportedContentRequest.cs](/Presentation/Contracts/Group/ExecuteReportedContentRequest.cs) | C# | 8 | 0 | 1 | 9 |
| [Presentation/Contracts/Group/ReportGroupPostRequest.cs](/Presentation/Contracts/Group/ReportGroupPostRequest.cs) | C# | 8 | 0 | 1 | 9 |
| [Presentation/Contracts/Group/ReviewGroupJoinRequest.cs](/Presentation/Contracts/Group/ReviewGroupJoinRequest.cs) | C# | 4 | 0 | 1 | 5 |
| [Presentation/Contracts/Group/ReviewGroupPostRequest.cs](/Presentation/Contracts/Group/ReviewGroupPostRequest.cs) | C# | 4 | 0 | 1 | 5 |
| [Presentation/Contracts/Group/UpdateGroupRequest.cs](/Presentation/Contracts/Group/UpdateGroupRequest.cs) | C# | 12 | 0 | 1 | 13 |
| [Presentation/Contracts/Group/UpdateGroupRuleRequest.cs](/Presentation/Contracts/Group/UpdateGroupRuleRequest.cs) | C# | 4 | 0 | 1 | 5 |
| [Presentation/Contracts/Message/SendMessageRequest.cs](/Presentation/Contracts/Message/SendMessageRequest.cs) | C# | 4 | 0 | 3 | 7 |
| [Presentation/Contracts/Message/UpdateMessageRequest.cs](/Presentation/Contracts/Message/UpdateMessageRequest.cs) | C# | 9 | 0 | 3 | 12 |
| [Presentation/Contracts/Post/CreateCommentRequest.cs](/Presentation/Contracts/Post/CreateCommentRequest.cs) | C# | 9 | 0 | 2 | 11 |
| [Presentation/Contracts/Post/CreatePostRequest.cs](/Presentation/Contracts/Post/CreatePostRequest.cs) | C# | 17 | 0 | 2 | 19 |
| [Presentation/Contracts/Post/ReactToCommentRequest.cs](/Presentation/Contracts/Post/ReactToCommentRequest.cs) | C# | 7 | 0 | 2 | 9 |
| [Presentation/Contracts/Post/ReactToPostRequest.cs](/Presentation/Contracts/Post/ReactToPostRequest.cs) | C# | 7 | 0 | 2 | 9 |
| [Presentation/Contracts/Post/UpdatePostRequest.cs](/Presentation/Contracts/Post/UpdatePostRequest.cs) | C# | 10 | 0 | 2 | 12 |
| [Presentation/Contracts/Reel/CreateReelRequest.cs](/Presentation/Contracts/Reel/CreateReelRequest.cs) | C# | 12 | 0 | 2 | 14 |
| [Presentation/Contracts/School/AddSchoolRequest.cs](/Presentation/Contracts/School/AddSchoolRequest.cs) | C# | 12 | 0 | 2 | 14 |
| [Presentation/Contracts/School/UpdateSchoolRequest.cs](/Presentation/Contracts/School/UpdateSchoolRequest.cs) | C# | 12 | 0 | 2 | 14 |
| [Presentation/Contracts/Story/CreateStoryRequest.cs](/Presentation/Contracts/Story/CreateStoryRequest.cs) | C# | 14 | 0 | 3 | 17 |
| [Presentation/Contracts/User/UpdateInfoRequest.cs](/Presentation/Contracts/User/UpdateInfoRequest.cs) | C# | 16 | 0 | 2 | 18 |
| [Presentation/Controllers/AuthController.cs](/Presentation/Controllers/AuthController.cs) | C# | 49 | 0 | 9 | 58 |
| [Presentation/Controllers/ConversationController.cs](/Presentation/Controllers/ConversationController.cs) | C# | 125 | 0 | 34 | 159 |
| [Presentation/Controllers/FriendController.cs](/Presentation/Controllers/FriendController.cs) | C# | 158 | 1 | 39 | 198 |
| [Presentation/Controllers/GroupController.cs](/Presentation/Controllers/GroupController.cs) | C# | 395 | 0 | 70 | 465 |
| [Presentation/Controllers/MessageController.cs](/Presentation/Controllers/MessageController.cs) | C# | 116 | 2 | 32 | 150 |
| [Presentation/Controllers/PostController.cs](/Presentation/Controllers/PostController.cs) | C# | 338 | 0 | 62 | 400 |
| [Presentation/Controllers/ReelController.cs](/Presentation/Controllers/ReelController.cs) | C# | 154 | 0 | 37 | 191 |
| [Presentation/Controllers/SchoolController.cs](/Presentation/Controllers/SchoolController.cs) | C# | 91 | 0 | 22 | 113 |
| [Presentation/Controllers/StoryController.cs](/Presentation/Controllers/StoryController.cs) | C# | 98 | 0 | 23 | 121 |
| [Presentation/Controllers/UserController.cs](/Presentation/Controllers/UserController.cs) | C# | 160 | 0 | 42 | 202 |
| [Presentation/DependencyInjection.cs](/Presentation/DependencyInjection.cs) | C# | 13 | 0 | 0 | 13 |
| [Presentation/Presentation.csproj](/Presentation/Presentation.csproj) | XML | 10 | 0 | 4 | 14 |
| [Presentation/Shared/CustomProblemDetails.cs](/Presentation/Shared/CustomProblemDetails.cs) | C# | 21 | 0 | 2 | 23 |
| [Presentation/bin/Debug/net10.0/Presentation.deps.json](/Presentation/bin/Debug/net10.0/Presentation.deps.json) | JSON | 421 | 0 | 0 | 421 |
| [Presentation/obj/Debug/net10.0/.NETCoreApp,Version=v10.0.AssemblyAttributes.cs](/Presentation/obj/Debug/net10.0/.NETCoreApp,Version=v10.0.AssemblyAttributes.cs) | C# | 3 | 1 | 1 | 5 |
| [Presentation/obj/Debug/net10.0/Presentation.AssemblyInfo.cs](/Presentation/obj/Debug/net10.0/Presentation.AssemblyInfo.cs) | C# | 9 | 10 | 5 | 24 |
| [Presentation/obj/Debug/net10.0/Presentation.GeneratedMSBuildEditorConfig.editorconfig](/Presentation/obj/Debug/net10.0/Presentation.GeneratedMSBuildEditorConfig.editorconfig) | Properties | 17 | 0 | 1 | 18 |
| [Presentation/obj/Debug/net10.0/Presentation.GlobalUsings.g.cs](/Presentation/obj/Debug/net10.0/Presentation.GlobalUsings.g.cs) | C# | 7 | 1 | 1 | 9 |
| [Presentation/obj/Debug/net10.0/Presentation.sourcelink.json](/Presentation/obj/Debug/net10.0/Presentation.sourcelink.json) | JSON | 1 | 0 | 0 | 1 |
| [Presentation/obj/Presentation.csproj.nuget.dgspec.json](/Presentation/obj/Presentation.csproj.nuget.dgspec.json) | JSON | 1,571 | 0 | 0 | 1,571 |
| [Presentation/obj/Presentation.csproj.nuget.g.props](/Presentation/obj/Presentation.csproj.nuget.g.props) | XML | 19 | 0 | 0 | 19 |
| [Presentation/obj/Presentation.csproj.nuget.g.targets](/Presentation/obj/Presentation.csproj.nuget.g.targets) | XML | 8 | 0 | 0 | 8 |
| [Presentation/obj/project.assets.json](/Presentation/obj/project.assets.json) | JSON | 2,180 | 0 | 0 | 2,180 |
| [ReactWeb/.env](/ReactWeb/.env) | Dotenv | 4 | 0 | 0 | 4 |
| [ReactWeb/README.md](/ReactWeb/README.md) | Markdown | 9 | 0 | 8 | 17 |
| [ReactWeb/eslint.config.js](/ReactWeb/eslint.config.js) | JavaScript | 28 | 0 | 2 | 30 |
| [ReactWeb/index.html](/ReactWeb/index.html) | HTML | 13 | 0 | 1 | 14 |
| [ReactWeb/package-lock.json](/ReactWeb/package-lock.json) | JSON | 3,876 | 0 | 1 | 3,877 |
| [ReactWeb/package.json](/ReactWeb/package.json) | JSON | 36 | 0 | 1 | 37 |
| [ReactWeb/public/vite.svg](/ReactWeb/public/vite.svg) | XML | 1 | 0 | 0 | 1 |
| [ReactWeb/src/App.css](/ReactWeb/src/App.css) | PostCSS | 22 | 0 | 3 | 25 |
| [ReactWeb/src/App.jsx](/ReactWeb/src/App.jsx) | JavaScript JSX | 43 | 1 | 3 | 47 |
| [ReactWeb/src/apis/authApi.js](/ReactWeb/src/apis/authApi.js) | JavaScript | 26 | 7 | 2 | 35 |
| [ReactWeb/src/apis/axios.js](/ReactWeb/src/apis/axios.js) | JavaScript | 22 | 6 | 8 | 36 |
| [ReactWeb/src/apis/conversationApi.js](/ReactWeb/src/apis/conversationApi.js) | JavaScript | 41 | 18 | 9 | 68 |
| [ReactWeb/src/apis/friendApi.js](/ReactWeb/src/apis/friendApi.js) | JavaScript | 57 | 46 | 12 | 115 |
| [ReactWeb/src/apis/groupApi.js](/ReactWeb/src/apis/groupApi.js) | JavaScript | 132 | 115 | 22 | 269 |
| [ReactWeb/src/apis/messageApi.js](/ReactWeb/src/apis/messageApi.js) | JavaScript | 28 | 9 | 6 | 43 |
| [ReactWeb/src/apis/postApi.js](/ReactWeb/src/apis/postApi.js) | JavaScript | 143 | 62 | 38 | 243 |
| [ReactWeb/src/apis/reelApi.js](/ReactWeb/src/apis/reelApi.js) | JavaScript | 54 | 0 | 12 | 66 |
| [ReactWeb/src/apis/schoolApi.js](/ReactWeb/src/apis/schoolApi.js) | JavaScript | 17 | 0 | 7 | 24 |
| [ReactWeb/src/apis/storyApi.js](/ReactWeb/src/apis/storyApi.js) | JavaScript | 15 | 0 | 5 | 20 |
| [ReactWeb/src/apis/userApi.js](/ReactWeb/src/apis/userApi.js) | JavaScript | 33 | 15 | 10 | 58 |
| [ReactWeb/src/assets/react.svg](/ReactWeb/src/assets/react.svg) | XML | 1 | 0 | 0 | 1 |
| [ReactWeb/src/components/Feed/CreatePost.jsx](/ReactWeb/src/components/Feed/CreatePost.jsx) | JavaScript JSX | 56 | 2 | 6 | 64 |
| [ReactWeb/src/components/Feed/HomeReelsRail.jsx](/ReactWeb/src/components/Feed/HomeReelsRail.jsx) | JavaScript JSX | 91 | 0 | 9 | 100 |
| [ReactWeb/src/components/Feed/MediaGallery.jsx](/ReactWeb/src/components/Feed/MediaGallery.jsx) | JavaScript JSX | 202 | 0 | 15 | 217 |
| [ReactWeb/src/components/Feed/PostCard.jsx](/ReactWeb/src/components/Feed/PostCard.jsx) | JavaScript JSX | 794 | 22 | 85 | 901 |
| [ReactWeb/src/components/Feed/PostComment.jsx](/ReactWeb/src/components/Feed/PostComment.jsx) | JavaScript JSX | 284 | 14 | 28 | 326 |
| [ReactWeb/src/components/Feed/PostModal.jsx](/ReactWeb/src/components/Feed/PostModal.jsx) | JavaScript JSX | 182 | 0 | 14 | 196 |
| [ReactWeb/src/components/Feed/StoryBar.jsx](/ReactWeb/src/components/Feed/StoryBar.jsx) | JavaScript JSX | 100 | 0 | 11 | 111 |
| [ReactWeb/src/components/Messenger/ChatInfoDirect.jsx](/ReactWeb/src/components/Messenger/ChatInfoDirect.jsx) | JavaScript JSX | 216 | 17 | 13 | 246 |
| [ReactWeb/src/components/Messenger/ChatInfoGroup.jsx](/ReactWeb/src/components/Messenger/ChatInfoGroup.jsx) | JavaScript JSX | 230 | 10 | 14 | 254 |
| [ReactWeb/src/components/Messenger/ChatWindow.jsx](/ReactWeb/src/components/Messenger/ChatWindow.jsx) | JavaScript JSX | 0 | 0 | 1 | 1 |
| [ReactWeb/src/components/Messenger/ConversationList.jsx](/ReactWeb/src/components/Messenger/ConversationList.jsx) | JavaScript JSX | 0 | 0 | 1 | 1 |
| [ReactWeb/src/components/Messenger/MessengerFull.jsx](/ReactWeb/src/components/Messenger/MessengerFull.jsx) | JavaScript JSX | 408 | 21 | 36 | 465 |
| [ReactWeb/src/components/Messenger/MessengerMini.jsx](/ReactWeb/src/components/Messenger/MessengerMini.jsx) | JavaScript JSX | 252 | 10 | 17 | 279 |
| [ReactWeb/src/components/Navbar/Navbar.jsx](/ReactWeb/src/components/Navbar/Navbar.jsx) | JavaScript JSX | 250 | 13 | 23 | 286 |
| [ReactWeb/src/components/Profile/AboutTab.jsx](/ReactWeb/src/components/Profile/AboutTab.jsx) | JavaScript JSX | 429 | 15 | 39 | 483 |
| [ReactWeb/src/components/Profile/CreatePostModal.jsx](/ReactWeb/src/components/Profile/CreatePostModal.jsx) | JavaScript JSX | 778 | 40 | 52 | 870 |
| [ReactWeb/src/components/Profile/CreateReelModal.jsx](/ReactWeb/src/components/Profile/CreateReelModal.jsx) | JavaScript JSX | 448 | 0 | 49 | 497 |
| [ReactWeb/src/components/Profile/FollowingTab.jsx](/ReactWeb/src/components/Profile/FollowingTab.jsx) | JavaScript JSX | 108 | 11 | 20 | 139 |
| [ReactWeb/src/components/Profile/FriendsTab.jsx](/ReactWeb/src/components/Profile/FriendsTab.jsx) | JavaScript JSX | 199 | 19 | 30 | 248 |
| [ReactWeb/src/components/Profile/MediaTab.jsx](/ReactWeb/src/components/Profile/MediaTab.jsx) | JavaScript JSX | 183 | 0 | 14 | 197 |
| [ReactWeb/src/components/Profile/ProfileReelsTab.jsx](/ReactWeb/src/components/Profile/ProfileReelsTab.jsx) | JavaScript JSX | 218 | 2 | 14 | 234 |
| [ReactWeb/src/components/Profile/ProfileRelationshipActions.jsx](/ReactWeb/src/components/Profile/ProfileRelationshipActions.jsx) | JavaScript JSX | 440 | 16 | 41 | 497 |
| [ReactWeb/src/components/ProtectedRoute.jsx](/ReactWeb/src/components/ProtectedRoute.jsx) | JavaScript JSX | 17 | 0 | 5 | 22 |
| [ReactWeb/src/components/Reels/ReelView.jsx](/ReactWeb/src/components/Reels/ReelView.jsx) | JavaScript JSX | 271 | 22 | 27 | 320 |
| [ReactWeb/src/components/Reels/ReelViewModal.jsx](/ReactWeb/src/components/Reels/ReelViewModal.jsx) | JavaScript JSX | 260 | 9 | 19 | 288 |
| [ReactWeb/src/components/RightSidebar/RightSidebar.jsx](/ReactWeb/src/components/RightSidebar/RightSidebar.jsx) | JavaScript JSX | 70 | 5 | 7 | 82 |
| [ReactWeb/src/components/Sidebar/LeftSidebar.jsx](/ReactWeb/src/components/Sidebar/LeftSidebar.jsx) | JavaScript JSX | 146 | 0 | 18 | 164 |
| [ReactWeb/src/components/Story/ProfileStoryRing.jsx](/ReactWeb/src/components/Story/ProfileStoryRing.jsx) | JavaScript JSX | 75 | 0 | 11 | 86 |
| [ReactWeb/src/components/Story/UserStoryViewer.jsx](/ReactWeb/src/components/Story/UserStoryViewer.jsx) | JavaScript JSX | 359 | 9 | 37 | 405 |
| [ReactWeb/src/components/Story/storyMappers.js](/ReactWeb/src/components/Story/storyMappers.js) | JavaScript | 73 | 0 | 10 | 83 |
| [ReactWeb/src/components/group/GroupAdminInsights.jsx](/ReactWeb/src/components/group/GroupAdminInsights.jsx) | JavaScript JSX | 374 | 4 | 28 | 406 |
| [ReactWeb/src/components/group/GroupAdminManage.jsx](/ReactWeb/src/components/group/GroupAdminManage.jsx) | JavaScript JSX | 1,128 | 10 | 90 | 1,228 |
| [ReactWeb/src/components/group/GroupAdminSettings.jsx](/ReactWeb/src/components/group/GroupAdminSettings.jsx) | JavaScript JSX | 518 | 18 | 34 | 570 |
| [ReactWeb/src/components/group/GroupAdminSidebar.jsx](/ReactWeb/src/components/group/GroupAdminSidebar.jsx) | JavaScript JSX | 91 | 0 | 5 | 96 |
| [ReactWeb/src/contexts/ReelsContext.jsx](/ReactWeb/src/contexts/ReelsContext.jsx) | JavaScript JSX | 174 | 5 | 27 | 206 |
| [ReactWeb/src/contexts/StoriesContext.jsx](/ReactWeb/src/contexts/StoriesContext.jsx) | JavaScript JSX | 54 | 0 | 13 | 67 |
| [ReactWeb/src/contexts/authContext.jsx](/ReactWeb/src/contexts/authContext.jsx) | JavaScript JSX | 133 | 22 | 32 | 187 |
| [ReactWeb/src/contexts/conversationContext.jsx](/ReactWeb/src/contexts/conversationContext.jsx) | JavaScript JSX | 84 | 11 | 8 | 103 |
| [ReactWeb/src/contexts/friendContext.jsx](/ReactWeb/src/contexts/friendContext.jsx) | JavaScript JSX | 239 | 0 | 24 | 263 |
| [ReactWeb/src/contexts/signalRContext.jsx](/ReactWeb/src/contexts/signalRContext.jsx) | JavaScript JSX | 49 | 3 | 9 | 61 |
| [ReactWeb/src/data/groupMockData.js](/ReactWeb/src/data/groupMockData.js) | JavaScript | 169 | 0 | 11 | 180 |
| [ReactWeb/src/data/mockData.js](/ReactWeb/src/data/mockData.js) | JavaScript | 584 | 10 | 10 | 604 |
| [ReactWeb/src/data/reelsMockData.js](/ReactWeb/src/data/reelsMockData.js) | JavaScript | 198 | 0 | 1 | 199 |
| [ReactWeb/src/data/searchMockData.js](/ReactWeb/src/data/searchMockData.js) | JavaScript | 88 | 0 | 6 | 94 |
| [ReactWeb/src/hooks/useAllMembers.js](/ReactWeb/src/hooks/useAllMembers.js) | JavaScript | 124 | 14 | 18 | 156 |
| [ReactWeb/src/hooks/useChat.jsx](/ReactWeb/src/hooks/useChat.jsx) | JavaScript JSX | 86 | 20 | 20 | 126 |
| [ReactWeb/src/hooks/useCreateStory.js](/ReactWeb/src/hooks/useCreateStory.js) | JavaScript | 27 | 0 | 5 | 32 |
| [ReactWeb/src/hooks/useFeed.js](/ReactWeb/src/hooks/useFeed.js) | JavaScript | 129 | 4 | 20 | 153 |
| [ReactWeb/src/hooks/useFollowees.js](/ReactWeb/src/hooks/useFollowees.js) | JavaScript | 23 | 0 | 5 | 28 |
| [ReactWeb/src/hooks/useFriend.js](/ReactWeb/src/hooks/useFriend.js) | JavaScript | 141 | 0 | 12 | 153 |
| [ReactWeb/src/hooks/useGroup.js](/ReactWeb/src/hooks/useGroup.js) | JavaScript | 224 | 0 | 31 | 255 |
| [ReactWeb/src/hooks/useGroupInsights.js](/ReactWeb/src/hooks/useGroupInsights.js) | JavaScript | 58 | 6 | 9 | 73 |
| [ReactWeb/src/hooks/useGroupPosts.js](/ReactWeb/src/hooks/useGroupPosts.js) | JavaScript | 99 | 9 | 16 | 124 |
| [ReactWeb/src/hooks/useMedias.js](/ReactWeb/src/hooks/useMedias.js) | JavaScript | 96 | 0 | 17 | 113 |
| [ReactWeb/src/hooks/usePendingPosts.js](/ReactWeb/src/hooks/usePendingPosts.js) | JavaScript | 137 | 11 | 18 | 166 |
| [ReactWeb/src/hooks/usePersonalInfo.js](/ReactWeb/src/hooks/usePersonalInfo.js) | JavaScript | 24 | 0 | 6 | 30 |
| [ReactWeb/src/hooks/useProfileFriends.js](/ReactWeb/src/hooks/useProfileFriends.js) | JavaScript | 24 | 0 | 6 | 30 |
| [ReactWeb/src/hooks/useProfileReels.js](/ReactWeb/src/hooks/useProfileReels.js) | JavaScript | 148 | 3 | 19 | 170 |
| [ReactWeb/src/hooks/useProfileStories.js](/ReactWeb/src/hooks/useProfileStories.js) | JavaScript | 49 | 0 | 8 | 57 |
| [ReactWeb/src/hooks/useReportedContent.js](/ReactWeb/src/hooks/useReportedContent.js) | JavaScript | 155 | 13 | 17 | 185 |
| [ReactWeb/src/hooks/useSchools.js](/ReactWeb/src/hooks/useSchools.js) | JavaScript | 35 | 2 | 3 | 40 |
| [ReactWeb/src/hooks/useSearchGroups.js](/ReactWeb/src/hooks/useSearchGroups.js) | JavaScript | 36 | 3 | 6 | 45 |
| [ReactWeb/src/hooks/useStoriesTimeline.js](/ReactWeb/src/hooks/useStoriesTimeline.js) | JavaScript | 42 | 0 | 6 | 48 |
| [ReactWeb/src/hooks/useTag.js](/ReactWeb/src/hooks/useTag.js) | JavaScript | 53 | 5 | 4 | 62 |
| [ReactWeb/src/hooks/useUserMedias.js](/ReactWeb/src/hooks/useUserMedias.js) | JavaScript | 4 | 4 | 2 | 10 |
| [ReactWeb/src/hooks/useUserPosts.js](/ReactWeb/src/hooks/useUserPosts.js) | JavaScript | 79 | 5 | 14 | 98 |
| [ReactWeb/src/hooks/useYourGroups.js](/ReactWeb/src/hooks/useYourGroups.js) | JavaScript | 36 | 3 | 6 | 45 |
| [ReactWeb/src/index.css](/ReactWeb/src/index.css) | PostCSS | 9 | 0 | 1 | 10 |
| [ReactWeb/src/main.jsx](/ReactWeb/src/main.jsx) | JavaScript JSX | 27 | 0 | 1 | 28 |
| [ReactWeb/src/pages/BirthdaysPage.jsx](/ReactWeb/src/pages/BirthdaysPage.jsx) | JavaScript JSX | 258 | 0 | 20 | 278 |
| [ReactWeb/src/pages/CreateStoryPage.jsx](/ReactWeb/src/pages/CreateStoryPage.jsx) | JavaScript JSX | 587 | 0 | 63 | 650 |
| [ReactWeb/src/pages/FriendsPage.jsx](/ReactWeb/src/pages/FriendsPage.jsx) | JavaScript JSX | 263 | 4 | 25 | 292 |
| [ReactWeb/src/pages/GroupPage.jsx](/ReactWeb/src/pages/GroupPage.jsx) | JavaScript JSX | 783 | 1 | 62 | 846 |
| [ReactWeb/src/pages/GroupsCreatePage.jsx](/ReactWeb/src/pages/GroupsCreatePage.jsx) | JavaScript JSX | 238 | 0 | 24 | 262 |
| [ReactWeb/src/pages/GroupsPage.jsx](/ReactWeb/src/pages/GroupsPage.jsx) | JavaScript JSX | 273 | 1 | 25 | 299 |
| [ReactWeb/src/pages/HomePage.jsx](/ReactWeb/src/pages/HomePage.jsx) | JavaScript JSX | 135 | 2 | 25 | 162 |
| [ReactWeb/src/pages/MessengerPage.jsx](/ReactWeb/src/pages/MessengerPage.jsx) | JavaScript JSX | 5 | 1 | 2 | 8 |
| [ReactWeb/src/pages/ProfilePage.jsx](/ReactWeb/src/pages/ProfilePage.jsx) | JavaScript JSX | 842 | 47 | 90 | 979 |
| [ReactWeb/src/pages/ReelsPage.jsx](/ReactWeb/src/pages/ReelsPage.jsx) | JavaScript JSX | 181 | 16 | 32 | 229 |
| [ReactWeb/src/pages/SavedPage.jsx](/ReactWeb/src/pages/SavedPage.jsx) | JavaScript JSX | 333 | 10 | 17 | 360 |
| [ReactWeb/src/pages/SearchPage.jsx](/ReactWeb/src/pages/SearchPage.jsx) | JavaScript JSX | 201 | 0 | 15 | 216 |
| [ReactWeb/src/pages/SigninPage.jsx](/ReactWeb/src/pages/SigninPage.jsx) | JavaScript JSX | 235 | 7 | 24 | 266 |
| [ReactWeb/src/pages/SignupPage.jsx](/ReactWeb/src/pages/SignupPage.jsx) | JavaScript JSX | 193 | 8 | 30 | 231 |
| [ReactWeb/src/pages/StoryPage.jsx](/ReactWeb/src/pages/StoryPage.jsx) | JavaScript JSX | 52 | 0 | 8 | 60 |
| [ReactWeb/vite.config.js](/ReactWeb/vite.config.js) | JavaScript | 6 | 0 | 2 | 8 |
| [Web/Api.http](/Web/Api.http) | HTTP | 3 | 1 | 3 | 7 |
| [Web/Program.cs](/Web/Program.cs) | C# | 155 | 16 | 29 | 200 |
| [Web/Properties/launchSettings.json](/Web/Properties/launchSettings.json) | JSON | 23 | 0 | 1 | 24 |
| [Web/Web.csproj](/Web/Web.csproj) | XML | 22 | 0 | 5 | 27 |
| [Web/appsettings.Development.json](/Web/appsettings.Development.json) | JSON | 44 | 0 | 1 | 45 |
| [Web/appsettings.json](/Web/appsettings.json) | JSON | 49 | 0 | 2 | 51 |
| [Web/bin/Debug/net10.0/Api.deps.json](/Web/bin/Debug/net10.0/Api.deps.json) | JSON | 298 | 0 | 0 | 298 |
| [Web/bin/Debug/net10.0/Api.runtimeconfig.json](/Web/bin/Debug/net10.0/Api.runtimeconfig.json) | JSON | 20 | 0 | 0 | 20 |
| [Web/bin/Debug/net10.0/Api.staticwebassets.endpoints.json](/Web/bin/Debug/net10.0/Api.staticwebassets.endpoints.json) | JSON | 1 | 0 | 0 | 1 |
| [Web/bin/Debug/net10.0/BuildHost-netcore/Microsoft.CodeAnalysis.Workspaces.MSBuild.BuildHost.deps.json](/Web/bin/Debug/net10.0/BuildHost-netcore/Microsoft.CodeAnalysis.Workspaces.MSBuild.BuildHost.deps.json) | JSON | 260 | 0 | 0 | 260 |
| [Web/bin/Debug/net10.0/BuildHost-netcore/Microsoft.CodeAnalysis.Workspaces.MSBuild.BuildHost.runtimeconfig.json](/Web/bin/Debug/net10.0/BuildHost-netcore/Microsoft.CodeAnalysis.Workspaces.MSBuild.BuildHost.runtimeconfig.json) | JSON | 13 | 0 | 0 | 13 |
| [Web/bin/Debug/net10.0/Web.deps.json](/Web/bin/Debug/net10.0/Web.deps.json) | JSON | 1,474 | 0 | 0 | 1,474 |
| [Web/bin/Debug/net10.0/Web.runtimeconfig.json](/Web/bin/Debug/net10.0/Web.runtimeconfig.json) | JSON | 20 | 0 | 0 | 20 |
| [Web/bin/Debug/net10.0/Web.staticwebassets.endpoints.json](/Web/bin/Debug/net10.0/Web.staticwebassets.endpoints.json) | JSON | 1 | 0 | 0 | 1 |
| [Web/bin/Debug/net10.0/appsettings.Development.json](/Web/bin/Debug/net10.0/appsettings.Development.json) | JSON | 44 | 0 | 1 | 45 |
| [Web/bin/Debug/net10.0/appsettings.json](/Web/bin/Debug/net10.0/appsettings.json) | JSON | 49 | 0 | 2 | 51 |
| [Web/obj/Api.csproj.nuget.dgspec.json](/Web/obj/Api.csproj.nuget.dgspec.json) | JSON | 1,897 | 0 | 0 | 1,897 |
| [Web/obj/Api.csproj.nuget.g.props](/Web/obj/Api.csproj.nuget.g.props) | XML | 19 | 0 | 0 | 19 |
| [Web/obj/Api.csproj.nuget.g.targets](/Web/obj/Api.csproj.nuget.g.targets) | XML | 6 | 0 | 0 | 6 |
| [Web/obj/Debug/net10.0/.NETCoreApp,Version=v10.0.AssemblyAttributes.cs](/Web/obj/Debug/net10.0/.NETCoreApp,Version=v10.0.AssemblyAttributes.cs) | C# | 3 | 1 | 1 | 5 |
| [Web/obj/Debug/net10.0/Api.AssemblyInfo.cs](/Web/obj/Debug/net10.0/Api.AssemblyInfo.cs) | C# | 9 | 10 | 5 | 24 |
| [Web/obj/Debug/net10.0/Api.GeneratedMSBuildEditorConfig.editorconfig](/Web/obj/Debug/net10.0/Api.GeneratedMSBuildEditorConfig.editorconfig) | Properties | 23 | 0 | 1 | 24 |
| [Web/obj/Debug/net10.0/Api.GlobalUsings.g.cs](/Web/obj/Debug/net10.0/Api.GlobalUsings.g.cs) | C# | 16 | 1 | 1 | 18 |
| [Web/obj/Debug/net10.0/Api.MvcApplicationPartsAssemblyInfo.cs](/Web/obj/Debug/net10.0/Api.MvcApplicationPartsAssemblyInfo.cs) | C# | 4 | 10 | 5 | 19 |
| [Web/obj/Debug/net10.0/Api.sourcelink.json](/Web/obj/Debug/net10.0/Api.sourcelink.json) | JSON | 1 | 0 | 0 | 1 |
| [Web/obj/Debug/net10.0/ApiEndpoints.json](/Web/obj/Debug/net10.0/ApiEndpoints.json) | JSON | 1,827 | 0 | 0 | 1,827 |
| [Web/obj/Debug/net10.0/EndpointInfo/Api.json](/Web/obj/Debug/net10.0/EndpointInfo/Api.json) | JSON | 96 | 0 | 0 | 96 |
| [Web/obj/Debug/net10.0/EndpointInfo/Web.json](/Web/obj/Debug/net10.0/EndpointInfo/Web.json) | JSON | 3,546 | 0 | 0 | 3,546 |
| [Web/obj/Debug/net10.0/Web.AssemblyInfo.cs](/Web/obj/Debug/net10.0/Web.AssemblyInfo.cs) | C# | 9 | 10 | 5 | 24 |
| [Web/obj/Debug/net10.0/Web.GeneratedMSBuildEditorConfig.editorconfig](/Web/obj/Debug/net10.0/Web.GeneratedMSBuildEditorConfig.editorconfig) | Properties | 31 | 0 | 1 | 32 |
| [Web/obj/Debug/net10.0/Web.GlobalUsings.g.cs](/Web/obj/Debug/net10.0/Web.GlobalUsings.g.cs) | C# | 16 | 1 | 1 | 18 |
| [Web/obj/Debug/net10.0/Web.MvcApplicationPartsAssemblyInfo.cs](/Web/obj/Debug/net10.0/Web.MvcApplicationPartsAssemblyInfo.cs) | C# | 4 | 10 | 5 | 19 |
| [Web/obj/Debug/net10.0/Web.sourcelink.json](/Web/obj/Debug/net10.0/Web.sourcelink.json) | JSON | 1 | 0 | 0 | 1 |
| [Web/obj/Debug/net10.0/rjsmcshtml.dswa.cache.json](/Web/obj/Debug/net10.0/rjsmcshtml.dswa.cache.json) | JSON | 1 | 0 | 0 | 1 |
| [Web/obj/Debug/net10.0/rjsmrazor.dswa.cache.json](/Web/obj/Debug/net10.0/rjsmrazor.dswa.cache.json) | JSON | 1 | 0 | 0 | 1 |
| [Web/obj/Debug/net10.0/rpswa.dswa.cache.json](/Web/obj/Debug/net10.0/rpswa.dswa.cache.json) | JSON | 1 | 0 | 0 | 1 |
| [Web/obj/Debug/net10.0/staticwebassets.build.endpoints.json](/Web/obj/Debug/net10.0/staticwebassets.build.endpoints.json) | JSON | 1 | 0 | 0 | 1 |
| [Web/obj/Debug/net10.0/staticwebassets.build.json](/Web/obj/Debug/net10.0/staticwebassets.build.json) | JSON | 1 | 0 | 0 | 1 |
| [Web/obj/Web.csproj.nuget.dgspec.json](/Web/obj/Web.csproj.nuget.dgspec.json) | JSON | 2,090 | 0 | 0 | 2,090 |
| [Web/obj/Web.csproj.nuget.g.props](/Web/obj/Web.csproj.nuget.g.props) | XML | 535 | 0 | 0 | 535 |
| [Web/obj/Web.csproj.nuget.g.targets](/Web/obj/Web.csproj.nuget.g.targets) | XML | 9 | 0 | 0 | 9 |
| [Web/obj/project.assets.json](/Web/obj/project.assets.json) | JSON | 4,990 | 0 | 0 | 4,990 |
| [build.log](/build.log) | log | 9,873 | 0 | 17 | 9,890 |
| [package-lock.json](/package-lock.json) | JSON | 6 | 0 | 1 | 7 |

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)