# Details

Date : 2026-05-31 17:33:59

Directory d:\\SocialNetworkApp\\SocialNetworkApp\\src

Total : 534 files,  92802 codes, 1039 comments, 12667 blanks, all 106508 lines

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [.agent.md](/.agent.md) | Markdown | 28 | 0 | 1 | 29 |
| [Application/Abstractions/IFeedGenerator.cs](/Application/Abstractions/IFeedGenerator.cs) | C# | 7 | 0 | 1 | 8 |
| [Application/Abstractions/IFriendGraphService.cs](/Application/Abstractions/IFriendGraphService.cs) | C# | 15 | 0 | 3 | 18 |
| [Application/Abstractions/ITokenService.cs](/Application/Abstractions/ITokenService.cs) | C# | 8 | 0 | 1 | 9 |
| [Application/Abstractions/IUnitOfWork.cs](/Application/Abstractions/IUnitOfWork.cs) | C# | 10 | 0 | 2 | 12 |
| [Application/Abstractions/IUploadService.cs](/Application/Abstractions/IUploadService.cs) | C# | 10 | 0 | 1 | 11 |
| [Application/Abstractions/Messaging/ICommand.cs](/Application/Abstractions/Messaging/ICommand.cs) | C# | 11 | 0 | 2 | 13 |
| [Application/Abstractions/Messaging/ICommandHandler.cs](/Application/Abstractions/Messaging/ICommandHandler.cs) | C# | 14 | 0 | 3 | 17 |
| [Application/Abstractions/Messaging/IDomainEventHandler.cs](/Application/Abstractions/Messaging/IDomainEventHandler.cs) | C# | 9 | 0 | 3 | 12 |
| [Application/Abstractions/Messaging/IQuery.cs](/Application/Abstractions/Messaging/IQuery.cs) | C# | 8 | 0 | 2 | 10 |
| [Application/Abstractions/Messaging/IQueryHandler.cs](/Application/Abstractions/Messaging/IQueryHandler.cs) | C# | 10 | 0 | 1 | 11 |
| [Application/Abstractions/Repositories/IConversationRepository.cs](/Application/Abstractions/Repositories/IConversationRepository.cs) | C# | 36 | 0 | 3 | 39 |
| [Application/Abstractions/Repositories/IFeedRepository.cs](/Application/Abstractions/Repositories/IFeedRepository.cs) | C# | 10 | 0 | 2 | 12 |
| [Application/Abstractions/Repositories/IFriendRequestRepository.cs](/Application/Abstractions/Repositories/IFriendRequestRepository.cs) | C# | 16 | 0 | 5 | 21 |
| [Application/Abstractions/Repositories/IFriendshipRepository.cs](/Application/Abstractions/Repositories/IFriendshipRepository.cs) | C# | 22 | 0 | 3 | 25 |
| [Application/Abstractions/Repositories/IGroupReportRepository.cs](/Application/Abstractions/Repositories/IGroupReportRepository.cs) | C# | 13 | 0 | 2 | 15 |
| [Application/Abstractions/Repositories/IGroupRepository.cs](/Application/Abstractions/Repositories/IGroupRepository.cs) | C# | 15 | 0 | 2 | 17 |
| [Application/Abstractions/Repositories/IMessageRepository.cs](/Application/Abstractions/Repositories/IMessageRepository.cs) | C# | 12 | 0 | 2 | 14 |
| [Application/Abstractions/Repositories/IPostRepository.cs](/Application/Abstractions/Repositories/IPostRepository.cs) | C# | 34 | 0 | 2 | 36 |
| [Application/Abstractions/Repositories/ISchoolRepository.cs](/Application/Abstractions/Repositories/ISchoolRepository.cs) | C# | 15 | 0 | 2 | 17 |
| [Application/Abstractions/Repositories/IUserRepository.cs](/Application/Abstractions/Repositories/IUserRepository.cs) | C# | 12 | 0 | 2 | 14 |
| [Application/Abstractions/Security/IBlindIndexService.cs](/Application/Abstractions/Security/IBlindIndexService.cs) | C# | 7 | 0 | 2 | 9 |
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
| [Application/DTOs/Friends/FriendRequestDto.cs](/Application/DTOs/Friends/FriendRequestDto.cs) | C# | 15 | 0 | 2 | 17 |
| [Application/DTOs/Friends/FriendResponse.cs](/Application/DTOs/Friends/FriendResponse.cs) | C# | 11 | 0 | 2 | 13 |
| [Application/DTOs/Groups/GroupDto.cs](/Application/DTOs/Groups/GroupDto.cs) | C# | 12 | 0 | 2 | 14 |
| [Application/DTOs/Groups/GroupJoinRequestDto.cs](/Application/DTOs/Groups/GroupJoinRequestDto.cs) | C# | 14 | 0 | 2 | 16 |
| [Application/DTOs/Groups/GroupMemberDto.cs](/Application/DTOs/Groups/GroupMemberDto.cs) | C# | 14 | 0 | 2 | 16 |
| [Application/DTOs/Groups/GroupRuleResponse.cs](/Application/DTOs/Groups/GroupRuleResponse.cs) | C# | 8 | 0 | 1 | 9 |
| [Application/DTOs/Groups/ReportedGroupContentDto.cs](/Application/DTOs/Groups/ReportedGroupContentDto.cs) | C# | 23 | 0 | 2 | 25 |
| [Application/DTOs/Messages/AttachmentDto.cs](/Application/DTOs/Messages/AttachmentDto.cs) | C# | 19 | 0 | 2 | 21 |
| [Application/DTOs/Messages/MemberMessageDto.cs](/Application/DTOs/Messages/MemberMessageDto.cs) | C# | 21 | 0 | 1 | 22 |
| [Application/DTOs/Messages/MessageDto.cs](/Application/DTOs/Messages/MessageDto.cs) | C# | 30 | 0 | 6 | 36 |
| [Application/DTOs/Posts/PostCommentDto.cs](/Application/DTOs/Posts/PostCommentDto.cs) | C# | 21 | 0 | 2 | 23 |
| [Application/DTOs/Posts/PostDto.cs](/Application/DTOs/Posts/PostDto.cs) | C# | 30 | 0 | 2 | 32 |
| [Application/DTOs/Posts/PostMediaDto.cs](/Application/DTOs/Posts/PostMediaDto.cs) | C# | 11 | 0 | 1 | 12 |
| [Application/DTOs/Posts/PostMediaItemDto.cs](/Application/DTOs/Posts/PostMediaItemDto.cs) | C# | 12 | 0 | 1 | 13 |
| [Application/DTOs/Posts/ReactionCountDto.cs](/Application/DTOs/Posts/ReactionCountDto.cs) | C# | 8 | 0 | 2 | 10 |
| [Application/DTOs/Schools/SchoolResponse.cs](/Application/DTOs/Schools/SchoolResponse.cs) | C# | 15 | 0 | 2 | 17 |
| [Application/DTOs/Search/GlobalSearchResponse.cs](/Application/DTOs/Search/GlobalSearchResponse.cs) | C# | 7 | 0 | 2 | 9 |
| [Application/DTOs/Users/PersonalInfoResponse.cs](/Application/DTOs/Users/PersonalInfoResponse.cs) | C# | 19 | 0 | 2 | 21 |
| [Application/DTOs/Users/TaggableUserDto.cs](/Application/DTOs/Users/TaggableUserDto.cs) | C# | 8 | 0 | 1 | 9 |
| [Application/DTOs/Users/UserHoverCardResponse.cs](/Application/DTOs/Users/UserHoverCardResponse.cs) | C# | 16 | 0 | 3 | 19 |
| [Application/DependencyInjection.cs](/Application/DependencyInjection.cs) | C# | 13 | 0 | 1 | 14 |
| [Application/Friend/Commands/AcceptFriendRequest/AcceptFriendRequestCommand.cs](/Application/Friend/Commands/AcceptFriendRequest/AcceptFriendRequestCommand.cs) | C# | 6 | 0 | 2 | 8 |
| [Application/Friend/Commands/AcceptFriendRequest/AcceptFriendRequestCommandHandler.cs](/Application/Friend/Commands/AcceptFriendRequest/AcceptFriendRequestCommandHandler.cs) | C# | 79 | 8 | 15 | 102 |
| [Application/Friend/Commands/SendFriendRequest/SendFriendRequestCommand.cs](/Application/Friend/Commands/SendFriendRequest/SendFriendRequestCommand.cs) | C# | 6 | 0 | 2 | 8 |
| [Application/Friend/Commands/SendFriendRequest/SendFriendRequestCommandHandler.cs](/Application/Friend/Commands/SendFriendRequest/SendFriendRequestCommandHandler.cs) | C# | 67 | 5 | 12 | 84 |
| [Application/Friend/Commands/SyncAllFriends/SyncAllFriendsCommand.cs](/Application/Friend/Commands/SyncAllFriends/SyncAllFriendsCommand.cs) | C# | 5 | 0 | 2 | 7 |
| [Application/Friend/Commands/SyncAllFriends/SyncAllFriendsCommandHandler.cs](/Application/Friend/Commands/SyncAllFriends/SyncAllFriendsCommandHandler.cs) | C# | 66 | 0 | 6 | 72 |
| [Application/Friend/Events/FriendshipCreated/FriendshipCreatedDomainEventHandler.cs](/Application/Friend/Events/FriendshipCreated/FriendshipCreatedDomainEventHandler.cs) | C# | 44 | 0 | 5 | 49 |
| [Application/Friend/Queries/GetFriendRecommendations/GetFriendRecommendationsQuery.cs](/Application/Friend/Queries/GetFriendRecommendations/GetFriendRecommendationsQuery.cs) | C# | 7 | 0 | 2 | 9 |
| [Application/Friend/Queries/GetFriendRecommendations/GetFriendRecommendationsQueryHandler.cs](/Application/Friend/Queries/GetFriendRecommendations/GetFriendRecommendationsQueryHandler.cs) | C# | 23 | 0 | 4 | 27 |
| [Application/Friend/Queries/GetFriends/GetFriendsQuery.cs](/Application/Friend/Queries/GetFriends/GetFriendsQuery.cs) | C# | 5 | 0 | 2 | 7 |
| [Application/Friend/Queries/GetFriends/GetFriendsQueryHandler.cs](/Application/Friend/Queries/GetFriends/GetFriendsQueryHandler.cs) | C# | 49 | 0 | 9 | 58 |
| [Application/Friend/Queries/GetIncomingFriendRequests/GetIncomingFriendRequestsQuery.cs](/Application/Friend/Queries/GetIncomingFriendRequests/GetIncomingFriendRequestsQuery.cs) | C# | 10 | 0 | 2 | 12 |
| [Application/Friend/Queries/GetIncomingFriendRequests/GetIncomingFriendRequestsQueryHandler.cs](/Application/Friend/Queries/GetIncomingFriendRequests/GetIncomingFriendRequestsQueryHandler.cs) | C# | 57 | 0 | 10 | 67 |
| [Application/Friend/Queries/GetMutualFriends/GetMutualFriendsQuery.cs](/Application/Friend/Queries/GetMutualFriends/GetMutualFriendsQuery.cs) | C# | 7 | 0 | 2 | 9 |
| [Application/Friend/Queries/GetMutualFriends/GetMutualFriendsQueryHandler.cs](/Application/Friend/Queries/GetMutualFriends/GetMutualFriendsQueryHandler.cs) | C# | 23 | 0 | 4 | 27 |
| [Application/Friend/Queries/GetShortestPath/GetShortestPathQuery.cs](/Application/Friend/Queries/GetShortestPath/GetShortestPathQuery.cs) | C# | 7 | 0 | 2 | 9 |
| [Application/Friend/Queries/GetShortestPath/GetShortestPathQueryHandler.cs](/Application/Friend/Queries/GetShortestPath/GetShortestPathQueryHandler.cs) | C# | 23 | 0 | 4 | 27 |
| [Application/Groups/Commands/AssignGroupRole/AssignGroupRoleCommand.cs](/Application/Groups/Commands/AssignGroupRole/AssignGroupRoleCommand.cs) | C# | 11 | 0 | 2 | 13 |
| [Application/Groups/Commands/AssignGroupRole/AssignGroupRoleCommandHandler.cs](/Application/Groups/Commands/AssignGroupRole/AssignGroupRoleCommandHandler.cs) | C# | 92 | 0 | 16 | 108 |
| [Application/Groups/Commands/CreateGroupRule/CreateGroupRuleCommand.cs](/Application/Groups/Commands/CreateGroupRule/CreateGroupRuleCommand.cs) | C# | 10 | 0 | 2 | 12 |
| [Application/Groups/Commands/CreateGroupRule/CreateGroupRuleCommandHandler.cs](/Application/Groups/Commands/CreateGroupRule/CreateGroupRuleCommandHandler.cs) | C# | 47 | 1 | 9 | 57 |
| [Application/Groups/Commands/CreateGroup/CreateGroupCommand.cs](/Application/Groups/Commands/CreateGroup/CreateGroupCommand.cs) | C# | 10 | 0 | 2 | 12 |
| [Application/Groups/Commands/CreateGroup/CreateGroupCommandHandler.cs](/Application/Groups/Commands/CreateGroup/CreateGroupCommandHandler.cs) | C# | 59 | 0 | 8 | 67 |
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
| [Application/Groups/Commands/UpdateGroup/UpdateGroupCommand.cs](/Application/Groups/Commands/UpdateGroup/UpdateGroupCommand.cs) | C# | 15 | 0 | 2 | 17 |
| [Application/Groups/Commands/UpdateGroup/UpdateGroupCommandHandler.cs](/Application/Groups/Commands/UpdateGroup/UpdateGroupCommandHandler.cs) | C# | 51 | 0 | 9 | 60 |
| [Application/Groups/Commands/UploadGroupCoverPhoto/UploadGroupCoverPhotoCommand.cs](/Application/Groups/Commands/UploadGroupCoverPhoto/UploadGroupCoverPhotoCommand.cs) | C# | 7 | 0 | 2 | 9 |
| [Application/Groups/Commands/UploadGroupCoverPhoto/UploadGroupCoverPhotoCommandHandler.cs](/Application/Groups/Commands/UploadGroupCoverPhoto/UploadGroupCoverPhotoCommandHandler.cs) | C# | 53 | 0 | 7 | 60 |
| [Application/Groups/Queries/GetGroupJoinRequests/GetGroupJoinRequestsQuery.cs](/Application/Groups/Queries/GetGroupJoinRequests/GetGroupJoinRequestsQuery.cs) | C# | 12 | 0 | 2 | 14 |
| [Application/Groups/Queries/GetGroupJoinRequests/GetGroupJoinRequestsQueryHandler.cs](/Application/Groups/Queries/GetGroupJoinRequests/GetGroupJoinRequestsQueryHandler.cs) | C# | 58 | 0 | 8 | 66 |
| [Application/Groups/Queries/GetGroupMembers/GetGroupMembersQuery.cs](/Application/Groups/Queries/GetGroupMembers/GetGroupMembersQuery.cs) | C# | 13 | 0 | 2 | 15 |
| [Application/Groups/Queries/GetGroupMembers/GetGroupMembersQueryHandler.cs](/Application/Groups/Queries/GetGroupMembers/GetGroupMembersQueryHandler.cs) | C# | 53 | 0 | 7 | 60 |
| [Application/Groups/Queries/GetGroupRules/GetGroupRulesQuery.cs](/Application/Groups/Queries/GetGroupRules/GetGroupRulesQuery.cs) | C# | 7 | 0 | 2 | 9 |
| [Application/Groups/Queries/GetGroupRules/GetGroupRulesQueryHandler.cs](/Application/Groups/Queries/GetGroupRules/GetGroupRulesQueryHandler.cs) | C# | 33 | 0 | 6 | 39 |
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
| [Application/Posts/Commands/CreatePost/CreatePostCommand.cs](/Application/Posts/Commands/CreatePost/CreatePostCommand.cs) | C# | 21 | 0 | 3 | 24 |
| [Application/Posts/Commands/CreatePost/CreatePostCommandHandler.cs](/Application/Posts/Commands/CreatePost/CreatePostCommandHandler.cs) | C# | 210 | 1 | 29 | 240 |
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
| [Application/Posts/Queries/GetPost/GetPostQueryHandler.cs](/Application/Posts/Queries/GetPost/GetPostQueryHandler.cs) | C# | 114 | 0 | 10 | 124 |
| [Application/Posts/Queries/GetPostsByGroup/GetPostsByGroupQuery.cs](/Application/Posts/Queries/GetPostsByGroup/GetPostsByGroupQuery.cs) | C# | 13 | 0 | 2 | 15 |
| [Application/Posts/Queries/GetPostsByGroup/GetPostsByGroupQueryHandler.cs](/Application/Posts/Queries/GetPostsByGroup/GetPostsByGroupQueryHandler.cs) | C# | 115 | 0 | 11 | 126 |
| [Application/Posts/Queries/GetPostsByPerson/GetPostsByPersonQuery.cs](/Application/Posts/Queries/GetPostsByPerson/GetPostsByPersonQuery.cs) | C# | 12 | 0 | 2 | 14 |
| [Application/Posts/Queries/GetPostsByPerson/GetPostsByPersonQueryHandler.cs](/Application/Posts/Queries/GetPostsByPerson/GetPostsByPersonQueryHandler.cs) | C# | 114 | 0 | 11 | 125 |
| [Application/Schools/Commands/AddSchool/AddSchoolCommand.cs](/Application/Schools/Commands/AddSchool/AddSchoolCommand.cs) | C# | 15 | 0 | 2 | 17 |
| [Application/Schools/Commands/AddSchool/AddSchoolCommandHandler.cs](/Application/Schools/Commands/AddSchool/AddSchoolCommandHandler.cs) | C# | 56 | 0 | 8 | 64 |
| [Application/Schools/Commands/DeleteSchool/DeleteSchoolCommand.cs](/Application/Schools/Commands/DeleteSchool/DeleteSchoolCommand.cs) | C# | 6 | 0 | 2 | 8 |
| [Application/Schools/Commands/DeleteSchool/DeleteSchoolCommandHandler.cs](/Application/Schools/Commands/DeleteSchool/DeleteSchoolCommandHandler.cs) | C# | 40 | 0 | 9 | 49 |
| [Application/Schools/Commands/UpdateSchool/UpdateSchoolCommand.cs](/Application/Schools/Commands/UpdateSchool/UpdateSchoolCommand.cs) | C# | 16 | 0 | 2 | 18 |
| [Application/Schools/Commands/UpdateSchool/UpdateSchoolCommandHandler.cs](/Application/Schools/Commands/UpdateSchool/UpdateSchoolCommandHandler.cs) | C# | 55 | 0 | 9 | 64 |
| [Application/Schools/Queries/GetSchools/GetSchoolsQuery.cs](/Application/Schools/Queries/GetSchools/GetSchoolsQuery.cs) | C# | 8 | 0 | 2 | 10 |
| [Application/Schools/Queries/GetSchools/GetSchoolsQueryHandler.cs](/Application/Schools/Queries/GetSchools/GetSchoolsQueryHandler.cs) | C# | 34 | 0 | 6 | 40 |
| [Application/Shared/PagedList.cs](/Application/Shared/PagedList.cs) | C# | 32 | 3 | 6 | 41 |
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
| [Application/Users/Queries/GetPersonalInfo/GetPersonalInfoQueryHandler.cs](/Application/Users/Queries/GetPersonalInfo/GetPersonalInfoQueryHandler.cs) | C# | 45 | 0 | 7 | 52 |
| [Application/Users/Queries/GetUserHoverCard/GetUserHoverCardQuery.cs](/Application/Users/Queries/GetUserHoverCard/GetUserHoverCardQuery.cs) | C# | 6 | 0 | 2 | 8 |
| [Application/Users/Queries/GetUserHoverCard/GetUserHoverCardQueryHandler.cs](/Application/Users/Queries/GetUserHoverCard/GetUserHoverCardQueryHandler.cs) | C# | 67 | 1 | 11 | 79 |
| [Application/bin/Debug/net10.0/Application.deps.json](/Application/bin/Debug/net10.0/Application.deps.json) | JSON | 576 | 0 | 0 | 576 |
| [Application/obj/Application.csproj.nuget.dgspec.json](/Application/obj/Application.csproj.nuget.dgspec.json) | JSON | 706 | 0 | 0 | 706 |
| [Application/obj/Application.csproj.nuget.g.props](/Application/obj/Application.csproj.nuget.g.props) | XML | 19 | 0 | 0 | 19 |
| [Application/obj/Application.csproj.nuget.g.targets](/Application/obj/Application.csproj.nuget.g.targets) | XML | 8 | 0 | 0 | 8 |
| [Application/obj/Debug/net10.0/.NETCoreApp,Version=v10.0.AssemblyAttributes.cs](/Application/obj/Debug/net10.0/.NETCoreApp,Version=v10.0.AssemblyAttributes.cs) | C# | 3 | 1 | 1 | 5 |
| [Application/obj/Debug/net10.0/Application.AssemblyInfo.cs](/Application/obj/Debug/net10.0/Application.AssemblyInfo.cs) | C# | 9 | 9 | 5 | 23 |
| [Application/obj/Debug/net10.0/Application.GeneratedMSBuildEditorConfig.editorconfig](/Application/obj/Debug/net10.0/Application.GeneratedMSBuildEditorConfig.editorconfig) | Properties | 17 | 0 | 1 | 18 |
| [Application/obj/Debug/net10.0/Application.GlobalUsings.g.cs](/Application/obj/Debug/net10.0/Application.GlobalUsings.g.cs) | C# | 7 | 1 | 1 | 9 |
| [Application/obj/Debug/net10.0/Application.sourcelink.json](/Application/obj/Debug/net10.0/Application.sourcelink.json) | JSON | 1 | 0 | 0 | 1 |
| [Application/obj/project.assets.json](/Application/obj/project.assets.json) | JSON | 1,692 | 0 | 0 | 1,692 |
| [Domain/Common/AggregateRoot.cs](/Domain/Common/AggregateRoot.cs) | C# | 14 | 0 | 6 | 20 |
| [Domain/Common/BaseEntity.cs](/Domain/Common/BaseEntity.cs) | C# | 25 | 0 | 6 | 31 |
| [Domain/Common/IDomainEvent.cs](/Domain/Common/IDomainEvent.cs) | C# | 7 | 0 | 1 | 8 |
| [Domain/Common/IHasDomainEvents.cs](/Domain/Common/IHasDomainEvents.cs) | C# | 9 | 0 | 2 | 11 |
| [Domain/Domain.csproj](/Domain/Domain.csproj) | XML | 14 | 0 | 5 | 19 |
| [Domain/Entities/BlockChat.cs](/Domain/Entities/BlockChat.cs) | C# | 17 | 1 | 6 | 24 |
| [Domain/Entities/CommentReaction.cs](/Domain/Entities/CommentReaction.cs) | C# | 26 | 0 | 6 | 32 |
| [Domain/Entities/Conversation.cs](/Domain/Entities/Conversation.cs) | C# | 60 | 0 | 15 | 75 |
| [Domain/Entities/ConversationMember.cs](/Domain/Entities/ConversationMember.cs) | C# | 37 | 1 | 8 | 46 |
| [Domain/Entities/Following.cs](/Domain/Entities/Following.cs) | C# | 21 | 0 | 6 | 27 |
| [Domain/Entities/FriendRequest.cs](/Domain/Entities/FriendRequest.cs) | C# | 29 | 1 | 9 | 39 |
| [Domain/Entities/Friendship.cs](/Domain/Entities/Friendship.cs) | C# | 25 | 1 | 6 | 32 |
| [Domain/Entities/Group.cs](/Domain/Entities/Group.cs) | C# | 140 | 7 | 27 | 174 |
| [Domain/Entities/GroupJoinRequest.cs](/Domain/Entities/GroupJoinRequest.cs) | C# | 29 | 1 | 7 | 37 |
| [Domain/Entities/GroupMember.cs](/Domain/Entities/GroupMember.cs) | C# | 25 | 1 | 6 | 32 |
| [Domain/Entities/GroupRule.cs](/Domain/Entities/GroupRule.cs) | C# | 27 | 1 | 6 | 34 |
| [Domain/Entities/MemberMessage.cs](/Domain/Entities/MemberMessage.cs) | C# | 21 | 1 | 7 | 29 |
| [Domain/Entities/Message.cs](/Domain/Entities/Message.cs) | C# | 72 | 1 | 15 | 88 |
| [Domain/Entities/MessageAttachtment.cs](/Domain/Entities/MessageAttachtment.cs) | C# | 24 | 1 | 5 | 30 |
| [Domain/Entities/Notification.cs](/Domain/Entities/Notification.cs) | C# | 41 | 1 | 6 | 48 |
| [Domain/Entities/Post.cs](/Domain/Entities/Post.cs) | C# | 126 | 8 | 25 | 159 |
| [Domain/Entities/PostComment.cs](/Domain/Entities/PostComment.cs) | C# | 42 | 3 | 9 | 54 |
| [Domain/Entities/PostMedia.cs](/Domain/Entities/PostMedia.cs) | C# | 30 | 1 | 5 | 36 |
| [Domain/Entities/PostReaction.cs](/Domain/Entities/PostReaction.cs) | C# | 26 | 0 | 6 | 32 |
| [Domain/Entities/PostTag.cs](/Domain/Entities/PostTag.cs) | C# | 19 | 1 | 5 | 25 |
| [Domain/Entities/ReportedGroupContent.cs](/Domain/Entities/ReportedGroupContent.cs) | C# | 52 | 6 | 15 | 73 |
| [Domain/Entities/SavedPost.cs](/Domain/Entities/SavedPost.cs) | C# | 21 | 1 | 5 | 27 |
| [Domain/Entities/School.cs](/Domain/Entities/School.cs) | C# | 56 | 1 | 8 | 65 |
| [Domain/Entities/User.cs](/Domain/Entities/User.cs) | C# | 112 | 1 | 27 | 140 |
| [Domain/Entities/UserFeed.cs](/Domain/Entities/UserFeed.cs) | C# | 44 | 1 | 7 | 52 |
| [Domain/Enums/ConversationRole.cs](/Domain/Enums/ConversationRole.cs) | C# | 8 | 0 | 1 | 9 |
| [Domain/Enums/DegreeType.cs](/Domain/Enums/DegreeType.cs) | C# | 10 | 0 | 1 | 11 |
| [Domain/Enums/Feeling.cs](/Domain/Enums/Feeling.cs) | C# | 32 | 0 | 1 | 33 |
| [Domain/Enums/FriendRequestStatus.cs](/Domain/Enums/FriendRequestStatus.cs) | C# | 9 | 0 | 1 | 10 |
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
| [Domain/Enums/PostApprovalStatus.cs](/Domain/Enums/PostApprovalStatus.cs) | C# | 10 | 5 | 4 | 19 |
| [Domain/Enums/PostVisibility.cs](/Domain/Enums/PostVisibility.cs) | C# | 10 | 0 | 1 | 11 |
| [Domain/Enums/ReactionTargetType.cs](/Domain/Enums/ReactionTargetType.cs) | C# | 8 | 0 | 1 | 9 |
| [Domain/Enums/ReactionType.cs](/Domain/Enums/ReactionType.cs) | C# | 12 | 0 | 1 | 13 |
| [Domain/Enums/RelationshipStatus.cs](/Domain/Enums/RelationshipStatus.cs) | C# | 15 | 0 | 1 | 16 |
| [Domain/Enums/SchoolType.cs](/Domain/Enums/SchoolType.cs) | C# | 11 | 0 | 1 | 12 |
| [Domain/Enums/UserFeedType.cs](/Domain/Enums/UserFeedType.cs) | C# | 11 | 0 | 1 | 12 |
| [Domain/Enums/WhoCanApprove.cs](/Domain/Enums/WhoCanApprove.cs) | C# | 8 | 3 | 2 | 13 |
| [Domain/Enums/WhoCanJoin.cs](/Domain/Enums/WhoCanJoin.cs) | C# | 8 | 3 | 2 | 13 |
| [Domain/Enums/WhoCanPost.cs](/Domain/Enums/WhoCanPost.cs) | C# | 9 | 4 | 3 | 16 |
| [Domain/Events/FriendshipCreatedDomainEvent.cs](/Domain/Events/FriendshipCreatedDomainEvent.cs) | C# | 10 | 0 | 2 | 12 |
| [Domain/Shared/Error.cs](/Domain/Shared/Error.cs) | C# | 40 | 0 | 13 | 53 |
| [Domain/Shared/IValidationResult.cs](/Domain/Shared/IValidationResult.cs) | C# | 10 | 0 | 1 | 11 |
| [Domain/Shared/Result.cs](/Domain/Shared/Result.cs) | C# | 36 | 1 | 11 | 48 |
| [Domain/Shared/ResultT.cs](/Domain/Shared/ResultT.cs) | C# | 19 | 0 | 4 | 23 |
| [Domain/Shared/ValidationResult.cs](/Domain/Shared/ValidationResult.cs) | C# | 11 | 0 | 3 | 14 |
| [Domain/Shared/ValidationResultT.cs](/Domain/Shared/ValidationResultT.cs) | C# | 11 | 0 | 3 | 14 |
| [Domain/bin/Debug/net10.0/Domain.deps.json](/Domain/bin/Debug/net10.0/Domain.deps.json) | JSON | 544 | 0 | 0 | 544 |
| [Domain/obj/Debug/net10.0/.NETCoreApp,Version=v10.0.AssemblyAttributes.cs](/Domain/obj/Debug/net10.0/.NETCoreApp,Version=v10.0.AssemblyAttributes.cs) | C# | 3 | 1 | 1 | 5 |
| [Domain/obj/Debug/net10.0/Domain.AssemblyInfo.cs](/Domain/obj/Debug/net10.0/Domain.AssemblyInfo.cs) | C# | 9 | 9 | 5 | 23 |
| [Domain/obj/Debug/net10.0/Domain.GeneratedMSBuildEditorConfig.editorconfig](/Domain/obj/Debug/net10.0/Domain.GeneratedMSBuildEditorConfig.editorconfig) | Properties | 17 | 0 | 1 | 18 |
| [Domain/obj/Debug/net10.0/Domain.GlobalUsings.g.cs](/Domain/obj/Debug/net10.0/Domain.GlobalUsings.g.cs) | C# | 7 | 1 | 1 | 9 |
| [Domain/obj/Debug/net10.0/Domain.sourcelink.json](/Domain/obj/Debug/net10.0/Domain.sourcelink.json) | JSON | 1 | 0 | 0 | 1 |
| [Domain/obj/Domain.csproj.nuget.dgspec.json](/Domain/obj/Domain.csproj.nuget.dgspec.json) | JSON | 357 | 0 | 0 | 357 |
| [Domain/obj/Domain.csproj.nuget.g.props](/Domain/obj/Domain.csproj.nuget.g.props) | XML | 19 | 0 | 0 | 19 |
| [Domain/obj/Domain.csproj.nuget.g.targets](/Domain/obj/Domain.csproj.nuget.g.targets) | XML | 8 | 0 | 0 | 8 |
| [Domain/obj/project.assets.json](/Domain/obj/project.assets.json) | JSON | 1,645 | 0 | 0 | 1,645 |
| [Infrastructure/Authentication/TokenService.cs](/Infrastructure/Authentication/TokenService.cs) | C# | 42 | 0 | 9 | 51 |
| [Infrastructure/BackgroundJobs/OutboxProcessingBackgroundService.cs](/Infrastructure/BackgroundJobs/OutboxProcessingBackgroundService.cs) | C# | 63 | 0 | 10 | 73 |
| [Infrastructure/DependencyInjection.cs](/Infrastructure/DependencyInjection.cs) | C# | 69 | 1 | 9 | 79 |
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
| [Infrastructure/Migrations/AppDbContextModelSnapshot.cs](/Infrastructure/Migrations/AppDbContextModelSnapshot.cs) | C# | 1,371 | 1 | 557 | 1,929 |
| [Infrastructure/Outbox/OutboxMessage.cs](/Infrastructure/Outbox/OutboxMessage.cs) | C# | 12 | 0 | 6 | 18 |
| [Infrastructure/Persistence/Configurations/BlockChatConfiguration.cs](/Infrastructure/Persistence/Configurations/BlockChatConfiguration.cs) | C# | 23 | 4 | 5 | 32 |
| [Infrastructure/Persistence/Configurations/ConversationConfiguration.cs](/Infrastructure/Persistence/Configurations/ConversationConfiguration.cs) | C# | 34 | 1 | 14 | 49 |
| [Infrastructure/Persistence/Configurations/ConversationMemberConfiguration.cs](/Infrastructure/Persistence/Configurations/ConversationMemberConfiguration.cs) | C# | 26 | 1 | 4 | 31 |
| [Infrastructure/Persistence/Configurations/FollowingConfiguration.cs](/Infrastructure/Persistence/Configurations/FollowingConfiguration.cs) | C# | 26 | 0 | 7 | 33 |
| [Infrastructure/Persistence/Configurations/FriendRequestConfiguration.cs](/Infrastructure/Persistence/Configurations/FriendRequestConfiguration.cs) | C# | 28 | 1 | 8 | 37 |
| [Infrastructure/Persistence/Configurations/FriendShipConfiguration.cs](/Infrastructure/Persistence/Configurations/FriendShipConfiguration.cs) | C# | 26 | 0 | 7 | 33 |
| [Infrastructure/Persistence/Configurations/GroupConfiguration.cs](/Infrastructure/Persistence/Configurations/GroupConfiguration.cs) | C# | 59 | 12 | 19 | 90 |
| [Infrastructure/Persistence/Configurations/GroupJoinRequestConfiguration.cs](/Infrastructure/Persistence/Configurations/GroupJoinRequestConfiguration.cs) | C# | 24 | 4 | 7 | 35 |
| [Infrastructure/Persistence/Configurations/GroupMemberConfiguration.cs](/Infrastructure/Persistence/Configurations/GroupMemberConfiguration.cs) | C# | 21 | 3 | 6 | 30 |
| [Infrastructure/Persistence/Configurations/GroupRuleConfiguration.cs](/Infrastructure/Persistence/Configurations/GroupRuleConfiguration.cs) | C# | 28 | 1 | 8 | 37 |
| [Infrastructure/Persistence/Configurations/MemberMessageConfiguration.cs](/Infrastructure/Persistence/Configurations/MemberMessageConfiguration.cs) | C# | 14 | 0 | 4 | 18 |
| [Infrastructure/Persistence/Configurations/MessageAttachmentConfiguration.cs](/Infrastructure/Persistence/Configurations/MessageAttachmentConfiguration.cs) | C# | 19 | 0 | 4 | 23 |
| [Infrastructure/Persistence/Configurations/MessageConfiguration.cs](/Infrastructure/Persistence/Configurations/MessageConfiguration.cs) | C# | 47 | 5 | 12 | 64 |
| [Infrastructure/Persistence/Configurations/NotificationConfiguration.cs](/Infrastructure/Persistence/Configurations/NotificationConfiguration.cs) | C# | 36 | 8 | 11 | 55 |
| [Infrastructure/Persistence/Configurations/PostCommentConfiguration.cs](/Infrastructure/Persistence/Configurations/PostCommentConfiguration.cs) | C# | 44 | 11 | 15 | 70 |
| [Infrastructure/Persistence/Configurations/PostConfiguration.cs](/Infrastructure/Persistence/Configurations/PostConfiguration.cs) | C# | 92 | 20 | 30 | 142 |
| [Infrastructure/Persistence/Configurations/PostMediaConfiguration.cs](/Infrastructure/Persistence/Configurations/PostMediaConfiguration.cs) | C# | 28 | 6 | 10 | 44 |
| [Infrastructure/Persistence/Configurations/PostTagConfiguration.cs](/Infrastructure/Persistence/Configurations/PostTagConfiguration.cs) | C# | 25 | 1 | 7 | 33 |
| [Infrastructure/Persistence/Configurations/ReactionConfiguration.cs](/Infrastructure/Persistence/Configurations/ReactionConfiguration.cs) | C# | 60 | 0 | 18 | 78 |
| [Infrastructure/Persistence/Configurations/ReportedGroupContentConfiguration.cs](/Infrastructure/Persistence/Configurations/ReportedGroupContentConfiguration.cs) | C# | 54 | 12 | 18 | 84 |
| [Infrastructure/Persistence/Configurations/SavedPostConfiguration.cs](/Infrastructure/Persistence/Configurations/SavedPostConfiguration.cs) | C# | 20 | 3 | 6 | 29 |
| [Infrastructure/Persistence/Configurations/SchoolConfiguration.cs](/Infrastructure/Persistence/Configurations/SchoolConfiguration.cs) | C# | 32 | 8 | 11 | 51 |
| [Infrastructure/Persistence/Configurations/UserConfiguration.cs](/Infrastructure/Persistence/Configurations/UserConfiguration.cs) | C# | 152 | 30 | 52 | 234 |
| [Infrastructure/Persistence/Configurations/UserFeedConfiguration.cs](/Infrastructure/Persistence/Configurations/UserFeedConfiguration.cs) | C# | 29 | 6 | 9 | 44 |
| [Infrastructure/Persistence/Contexts/AppDbContext.cs](/Infrastructure/Persistence/Contexts/AppDbContext.cs) | C# | 115 | 2 | 10 | 127 |
| [Infrastructure/Persistence/Contexts/RoleSeeder.cs](/Infrastructure/Persistence/Contexts/RoleSeeder.cs) | C# | 21 | 0 | 4 | 25 |
| [Infrastructure/Persistence/Repositories/ConversationRepository.cs](/Infrastructure/Persistence/Repositories/ConversationRepository.cs) | C# | 119 | 3 | 12 | 134 |
| [Infrastructure/Persistence/Repositories/FeedRepository.cs](/Infrastructure/Persistence/Repositories/FeedRepository.cs) | C# | 220 | 0 | 22 | 242 |
| [Infrastructure/Persistence/Repositories/FriendRequestRepository.cs](/Infrastructure/Persistence/Repositories/FriendRequestRepository.cs) | C# | 49 | 0 | 8 | 57 |
| [Infrastructure/Persistence/Repositories/FriendshipRepository.cs](/Infrastructure/Persistence/Repositories/FriendshipRepository.cs) | C# | 100 | 2 | 16 | 118 |
| [Infrastructure/Persistence/Repositories/GroupReportRepository.cs](/Infrastructure/Persistence/Repositories/GroupReportRepository.cs) | C# | 54 | 0 | 10 | 64 |
| [Infrastructure/Persistence/Repositories/GroupRepository.cs](/Infrastructure/Persistence/Repositories/GroupRepository.cs) | C# | 97 | 0 | 16 | 113 |
| [Infrastructure/Persistence/Repositories/MessageRepository.cs](/Infrastructure/Persistence/Repositories/MessageRepository.cs) | C# | 90 | 2 | 18 | 110 |
| [Infrastructure/Persistence/Repositories/PostRepository.cs](/Infrastructure/Persistence/Repositories/PostRepository.cs) | C# | 260 | 0 | 43 | 303 |
| [Infrastructure/Persistence/Repositories/SchoolRepository.cs](/Infrastructure/Persistence/Repositories/SchoolRepository.cs) | C# | 40 | 0 | 7 | 47 |
| [Infrastructure/Persistence/Repositories/UnitOfWork.cs](/Infrastructure/Persistence/Repositories/UnitOfWork.cs) | C# | 17 | 0 | 5 | 22 |
| [Infrastructure/Persistence/Repositories/UserRepository.cs](/Infrastructure/Persistence/Repositories/UserRepository.cs) | C# | 50 | 3 | 10 | 63 |
| [Infrastructure/Security/BlindIndexService.cs](/Infrastructure/Security/BlindIndexService.cs) | C# | 35 | 1 | 10 | 46 |
| [Infrastructure/Services/CloudinaryUploadService.cs](/Infrastructure/Services/CloudinaryUploadService.cs) | C# | 118 | 0 | 25 | 143 |
| [Infrastructure/Services/FeedGenerator.cs](/Infrastructure/Services/FeedGenerator.cs) | C# | 231 | 0 | 41 | 272 |
| [Infrastructure/Services/FriendGraphService.cs](/Infrastructure/Services/FriendGraphService.cs) | C# | 228 | 0 | 40 | 268 |
| [Infrastructure/SignalR/ChatHub.cs](/Infrastructure/SignalR/ChatHub.cs) | C# | 75 | 13 | 27 | 115 |
| [Infrastructure/SignalR/PresenceTracker.cs](/Infrastructure/SignalR/PresenceTracker.cs) | C# | 115 | 9 | 24 | 148 |
| [Infrastructure/bin/Debug/net10.0/BuildHost-netcore/Microsoft.CodeAnalysis.Workspaces.MSBuild.BuildHost.deps.json](/Infrastructure/bin/Debug/net10.0/BuildHost-netcore/Microsoft.CodeAnalysis.Workspaces.MSBuild.BuildHost.deps.json) | JSON | 260 | 0 | 0 | 260 |
| [Infrastructure/bin/Debug/net10.0/BuildHost-netcore/Microsoft.CodeAnalysis.Workspaces.MSBuild.BuildHost.runtimeconfig.json](/Infrastructure/bin/Debug/net10.0/BuildHost-netcore/Microsoft.CodeAnalysis.Workspaces.MSBuild.BuildHost.runtimeconfig.json) | JSON | 13 | 0 | 0 | 13 |
| [Infrastructure/bin/Debug/net10.0/Infrastructure.deps.json](/Infrastructure/bin/Debug/net10.0/Infrastructure.deps.json) | JSON | 1,146 | 0 | 0 | 1,146 |
| [Infrastructure/bin/Debug/net10.0/Infrastructure.runtimeconfig.json](/Infrastructure/bin/Debug/net10.0/Infrastructure.runtimeconfig.json) | JSON | 19 | 0 | 0 | 19 |
| [Infrastructure/obj/Debug/net10.0/.NETCoreApp,Version=v10.0.AssemblyAttributes.cs](/Infrastructure/obj/Debug/net10.0/.NETCoreApp,Version=v10.0.AssemblyAttributes.cs) | C# | 3 | 1 | 1 | 5 |
| [Infrastructure/obj/Debug/net10.0/Infrastructure.AssemblyInfo.cs](/Infrastructure/obj/Debug/net10.0/Infrastructure.AssemblyInfo.cs) | C# | 9 | 9 | 5 | 23 |
| [Infrastructure/obj/Debug/net10.0/Infrastructure.GeneratedMSBuildEditorConfig.editorconfig](/Infrastructure/obj/Debug/net10.0/Infrastructure.GeneratedMSBuildEditorConfig.editorconfig) | Properties | 25 | 0 | 1 | 26 |
| [Infrastructure/obj/Debug/net10.0/Infrastructure.GlobalUsings.g.cs](/Infrastructure/obj/Debug/net10.0/Infrastructure.GlobalUsings.g.cs) | C# | 7 | 1 | 1 | 9 |
| [Infrastructure/obj/Debug/net10.0/Infrastructure.sourcelink.json](/Infrastructure/obj/Debug/net10.0/Infrastructure.sourcelink.json) | JSON | 1 | 0 | 0 | 1 |
| [Infrastructure/obj/Infrastructure.csproj.nuget.dgspec.json](/Infrastructure/obj/Infrastructure.csproj.nuget.dgspec.json) | JSON | 1,220 | 0 | 0 | 1,220 |
| [Infrastructure/obj/Infrastructure.csproj.nuget.g.props](/Infrastructure/obj/Infrastructure.csproj.nuget.g.props) | XML | 25 | 0 | 0 | 25 |
| [Infrastructure/obj/Infrastructure.csproj.nuget.g.targets](/Infrastructure/obj/Infrastructure.csproj.nuget.g.targets) | XML | 7 | 0 | 0 | 7 |
| [Infrastructure/obj/project.assets.json](/Infrastructure/obj/project.assets.json) | JSON | 3,784 | 0 | 0 | 3,784 |
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
| [Presentation/Contracts/Group/UpdateGroupRequest.cs](/Presentation/Contracts/Group/UpdateGroupRequest.cs) | C# | 13 | 0 | 1 | 14 |
| [Presentation/Contracts/Group/UpdateGroupRuleRequest.cs](/Presentation/Contracts/Group/UpdateGroupRuleRequest.cs) | C# | 4 | 0 | 1 | 5 |
| [Presentation/Contracts/Message/SendMessageRequest.cs](/Presentation/Contracts/Message/SendMessageRequest.cs) | C# | 4 | 0 | 3 | 7 |
| [Presentation/Contracts/Message/UpdateMessageRequest.cs](/Presentation/Contracts/Message/UpdateMessageRequest.cs) | C# | 9 | 0 | 3 | 12 |
| [Presentation/Contracts/Post/CreateCommentRequest.cs](/Presentation/Contracts/Post/CreateCommentRequest.cs) | C# | 9 | 0 | 2 | 11 |
| [Presentation/Contracts/Post/CreatePostRequest.cs](/Presentation/Contracts/Post/CreatePostRequest.cs) | C# | 16 | 0 | 2 | 18 |
| [Presentation/Contracts/Post/ReactToCommentRequest.cs](/Presentation/Contracts/Post/ReactToCommentRequest.cs) | C# | 7 | 0 | 2 | 9 |
| [Presentation/Contracts/Post/ReactToPostRequest.cs](/Presentation/Contracts/Post/ReactToPostRequest.cs) | C# | 7 | 0 | 2 | 9 |
| [Presentation/Contracts/Post/UpdatePostRequest.cs](/Presentation/Contracts/Post/UpdatePostRequest.cs) | C# | 10 | 0 | 2 | 12 |
| [Presentation/Contracts/School/AddSchoolRequest.cs](/Presentation/Contracts/School/AddSchoolRequest.cs) | C# | 12 | 0 | 2 | 14 |
| [Presentation/Contracts/School/UpdateSchoolRequest.cs](/Presentation/Contracts/School/UpdateSchoolRequest.cs) | C# | 12 | 0 | 2 | 14 |
| [Presentation/Contracts/User/UpdateInfoRequest.cs](/Presentation/Contracts/User/UpdateInfoRequest.cs) | C# | 16 | 0 | 2 | 18 |
| [Presentation/Controllers/AuthController.cs](/Presentation/Controllers/AuthController.cs) | C# | 49 | 0 | 9 | 58 |
| [Presentation/Controllers/ConversationController.cs](/Presentation/Controllers/ConversationController.cs) | C# | 125 | 0 | 34 | 159 |
| [Presentation/Controllers/FriendController.cs](/Presentation/Controllers/FriendController.cs) | C# | 105 | 0 | 23 | 128 |
| [Presentation/Controllers/GroupController.cs](/Presentation/Controllers/GroupController.cs) | C# | 344 | 0 | 61 | 405 |
| [Presentation/Controllers/MessageController.cs](/Presentation/Controllers/MessageController.cs) | C# | 116 | 2 | 32 | 150 |
| [Presentation/Controllers/PostController.cs](/Presentation/Controllers/PostController.cs) | C# | 336 | 0 | 62 | 398 |
| [Presentation/Controllers/SchoolController.cs](/Presentation/Controllers/SchoolController.cs) | C# | 91 | 0 | 22 | 113 |
| [Presentation/Controllers/UserController.cs](/Presentation/Controllers/UserController.cs) | C# | 120 | 1 | 30 | 151 |
| [Presentation/DependencyInjection.cs](/Presentation/DependencyInjection.cs) | C# | 13 | 0 | 0 | 13 |
| [Presentation/Presentation.csproj](/Presentation/Presentation.csproj) | XML | 10 | 0 | 4 | 14 |
| [Presentation/Shared/CustomProblemDetails.cs](/Presentation/Shared/CustomProblemDetails.cs) | C# | 21 | 0 | 2 | 23 |
| [Presentation/bin/Debug/net10.0/Presentation.deps.json](/Presentation/bin/Debug/net10.0/Presentation.deps.json) | JSON | 421 | 0 | 0 | 421 |
| [Presentation/obj/Debug/net10.0/.NETCoreApp,Version=v10.0.AssemblyAttributes.cs](/Presentation/obj/Debug/net10.0/.NETCoreApp,Version=v10.0.AssemblyAttributes.cs) | C# | 3 | 1 | 1 | 5 |
| [Presentation/obj/Debug/net10.0/Presentation.AssemblyInfo.cs](/Presentation/obj/Debug/net10.0/Presentation.AssemblyInfo.cs) | C# | 9 | 9 | 5 | 23 |
| [Presentation/obj/Debug/net10.0/Presentation.GeneratedMSBuildEditorConfig.editorconfig](/Presentation/obj/Debug/net10.0/Presentation.GeneratedMSBuildEditorConfig.editorconfig) | Properties | 17 | 0 | 1 | 18 |
| [Presentation/obj/Debug/net10.0/Presentation.GlobalUsings.g.cs](/Presentation/obj/Debug/net10.0/Presentation.GlobalUsings.g.cs) | C# | 7 | 1 | 1 | 9 |
| [Presentation/obj/Debug/net10.0/Presentation.sourcelink.json](/Presentation/obj/Debug/net10.0/Presentation.sourcelink.json) | JSON | 1 | 0 | 0 | 1 |
| [Presentation/obj/Presentation.csproj.nuget.dgspec.json](/Presentation/obj/Presentation.csproj.nuget.dgspec.json) | JSON | 1,563 | 0 | 0 | 1,563 |
| [Presentation/obj/Presentation.csproj.nuget.g.props](/Presentation/obj/Presentation.csproj.nuget.g.props) | XML | 19 | 0 | 0 | 19 |
| [Presentation/obj/Presentation.csproj.nuget.g.targets](/Presentation/obj/Presentation.csproj.nuget.g.targets) | XML | 8 | 0 | 0 | 8 |
| [Presentation/obj/project.assets.json](/Presentation/obj/project.assets.json) | JSON | 2,180 | 0 | 0 | 2,180 |
| [ReactWeb/.env](/ReactWeb/.env) | Dotenv | 3 | 0 | 0 | 3 |
| [ReactWeb/README.md](/ReactWeb/README.md) | Markdown | 9 | 0 | 8 | 17 |
| [ReactWeb/eslint.config.js](/ReactWeb/eslint.config.js) | JavaScript | 28 | 0 | 2 | 30 |
| [ReactWeb/index.html](/ReactWeb/index.html) | HTML | 13 | 0 | 1 | 14 |
| [ReactWeb/package-lock.json](/ReactWeb/package-lock.json) | JSON | 3,876 | 0 | 1 | 3,877 |
| [ReactWeb/package.json](/ReactWeb/package.json) | JSON | 36 | 0 | 1 | 37 |
| [ReactWeb/public/vite.svg](/ReactWeb/public/vite.svg) | XML | 1 | 0 | 0 | 1 |
| [ReactWeb/src/App.css](/ReactWeb/src/App.css) | PostCSS | 25 | 0 | 3 | 28 |
| [ReactWeb/src/App.jsx](/ReactWeb/src/App.jsx) | JavaScript JSX | 34 | 1 | 3 | 38 |
| [ReactWeb/src/apis/authApi.js](/ReactWeb/src/apis/authApi.js) | JavaScript | 26 | 7 | 2 | 35 |
| [ReactWeb/src/apis/axios.js](/ReactWeb/src/apis/axios.js) | JavaScript | 22 | 6 | 8 | 36 |
| [ReactWeb/src/apis/conversationApi.js](/ReactWeb/src/apis/conversationApi.js) | JavaScript | 41 | 18 | 9 | 68 |
| [ReactWeb/src/apis/friendApi.js](/ReactWeb/src/apis/friendApi.js) | JavaScript | 27 | 20 | 6 | 53 |
| [ReactWeb/src/apis/groupApi.js](/ReactWeb/src/apis/groupApi.js) | JavaScript | 82 | 44 | 12 | 138 |
| [ReactWeb/src/apis/messageApi.js](/ReactWeb/src/apis/messageApi.js) | JavaScript | 28 | 9 | 6 | 43 |
| [ReactWeb/src/apis/postApi.js](/ReactWeb/src/apis/postApi.js) | JavaScript | 141 | 60 | 38 | 239 |
| [ReactWeb/src/apis/schoolApi.js](/ReactWeb/src/apis/schoolApi.js) | JavaScript | 17 | 0 | 7 | 24 |
| [ReactWeb/src/apis/userApi.js](/ReactWeb/src/apis/userApi.js) | JavaScript | 33 | 15 | 10 | 58 |
| [ReactWeb/src/assets/react.svg](/ReactWeb/src/assets/react.svg) | XML | 1 | 0 | 0 | 1 |
| [ReactWeb/src/components/Feed/CreatePost.jsx](/ReactWeb/src/components/Feed/CreatePost.jsx) | JavaScript JSX | 55 | 2 | 5 | 62 |
| [ReactWeb/src/components/Feed/MediaGallery.jsx](/ReactWeb/src/components/Feed/MediaGallery.jsx) | JavaScript JSX | 202 | 0 | 15 | 217 |
| [ReactWeb/src/components/Feed/PostCard.jsx](/ReactWeb/src/components/Feed/PostCard.jsx) | JavaScript JSX | 575 | 12 | 73 | 660 |
| [ReactWeb/src/components/Feed/PostComment.jsx](/ReactWeb/src/components/Feed/PostComment.jsx) | JavaScript JSX | 284 | 14 | 28 | 326 |
| [ReactWeb/src/components/Feed/PostModal.jsx](/ReactWeb/src/components/Feed/PostModal.jsx) | JavaScript JSX | 182 | 0 | 14 | 196 |
| [ReactWeb/src/components/Feed/StoryBar.jsx](/ReactWeb/src/components/Feed/StoryBar.jsx) | JavaScript JSX | 36 | 1 | 3 | 40 |
| [ReactWeb/src/components/Messenger/ChatInfoDirect.jsx](/ReactWeb/src/components/Messenger/ChatInfoDirect.jsx) | JavaScript JSX | 216 | 17 | 13 | 246 |
| [ReactWeb/src/components/Messenger/ChatInfoGroup.jsx](/ReactWeb/src/components/Messenger/ChatInfoGroup.jsx) | JavaScript JSX | 230 | 10 | 14 | 254 |
| [ReactWeb/src/components/Messenger/ChatWindow.jsx](/ReactWeb/src/components/Messenger/ChatWindow.jsx) | JavaScript JSX | 0 | 0 | 1 | 1 |
| [ReactWeb/src/components/Messenger/ConversationList.jsx](/ReactWeb/src/components/Messenger/ConversationList.jsx) | JavaScript JSX | 0 | 0 | 1 | 1 |
| [ReactWeb/src/components/Messenger/MessengerFull.jsx](/ReactWeb/src/components/Messenger/MessengerFull.jsx) | JavaScript JSX | 408 | 21 | 36 | 465 |
| [ReactWeb/src/components/Messenger/MessengerMini.jsx](/ReactWeb/src/components/Messenger/MessengerMini.jsx) | JavaScript JSX | 252 | 10 | 17 | 279 |
| [ReactWeb/src/components/Navbar/Navbar.jsx](/ReactWeb/src/components/Navbar/Navbar.jsx) | JavaScript JSX | 249 | 13 | 23 | 285 |
| [ReactWeb/src/components/Profile/AboutTab.jsx](/ReactWeb/src/components/Profile/AboutTab.jsx) | JavaScript JSX | 429 | 15 | 39 | 483 |
| [ReactWeb/src/components/Profile/CreatePostModal.jsx](/ReactWeb/src/components/Profile/CreatePostModal.jsx) | JavaScript JSX | 725 | 38 | 48 | 811 |
| [ReactWeb/src/components/Profile/FollowingTab.jsx](/ReactWeb/src/components/Profile/FollowingTab.jsx) | JavaScript JSX | 108 | 12 | 16 | 136 |
| [ReactWeb/src/components/Profile/FriendsTab.jsx](/ReactWeb/src/components/Profile/FriendsTab.jsx) | JavaScript JSX | 180 | 18 | 26 | 224 |
| [ReactWeb/src/components/Profile/PhotosTab.jsx](/ReactWeb/src/components/Profile/PhotosTab.jsx) | JavaScript JSX | 41 | 2 | 3 | 46 |
| [ReactWeb/src/components/ProtectedRoute.jsx](/ReactWeb/src/components/ProtectedRoute.jsx) | JavaScript JSX | 17 | 0 | 5 | 22 |
| [ReactWeb/src/components/RightSidebar/RightSidebar.jsx](/ReactWeb/src/components/RightSidebar/RightSidebar.jsx) | JavaScript JSX | 70 | 5 | 7 | 82 |
| [ReactWeb/src/components/Sidebar/LeftSidebar.jsx](/ReactWeb/src/components/Sidebar/LeftSidebar.jsx) | JavaScript JSX | 146 | 0 | 18 | 164 |
| [ReactWeb/src/components/group/GroupAdminInsights.jsx](/ReactWeb/src/components/group/GroupAdminInsights.jsx) | JavaScript JSX | 163 | 0 | 9 | 172 |
| [ReactWeb/src/components/group/GroupAdminManage.jsx](/ReactWeb/src/components/group/GroupAdminManage.jsx) | JavaScript JSX | 265 | 0 | 19 | 284 |
| [ReactWeb/src/components/group/GroupAdminSettings.jsx](/ReactWeb/src/components/group/GroupAdminSettings.jsx) | JavaScript JSX | 64 | 0 | 7 | 71 |
| [ReactWeb/src/components/group/GroupAdminSidebar.jsx](/ReactWeb/src/components/group/GroupAdminSidebar.jsx) | JavaScript JSX | 91 | 0 | 5 | 96 |
| [ReactWeb/src/contexts/authContext.jsx](/ReactWeb/src/contexts/authContext.jsx) | JavaScript JSX | 132 | 22 | 32 | 186 |
| [ReactWeb/src/contexts/conversationContext.jsx](/ReactWeb/src/contexts/conversationContext.jsx) | JavaScript JSX | 84 | 11 | 8 | 103 |
| [ReactWeb/src/contexts/friendContext.jsx](/ReactWeb/src/contexts/friendContext.jsx) | JavaScript JSX | 161 | 0 | 19 | 180 |
| [ReactWeb/src/contexts/signalRContext.jsx](/ReactWeb/src/contexts/signalRContext.jsx) | JavaScript JSX | 49 | 3 | 9 | 61 |
| [ReactWeb/src/data/groupMockData.js](/ReactWeb/src/data/groupMockData.js) | JavaScript | 171 | 0 | 11 | 182 |
| [ReactWeb/src/data/mockData.js](/ReactWeb/src/data/mockData.js) | JavaScript | 569 | 8 | 9 | 586 |
| [ReactWeb/src/data/reelsMockData.js](/ReactWeb/src/data/reelsMockData.js) | JavaScript | 62 | 0 | 1 | 63 |
| [ReactWeb/src/data/searchMockData.js](/ReactWeb/src/data/searchMockData.js) | JavaScript | 88 | 0 | 6 | 94 |
| [ReactWeb/src/hooks/useChat.jsx](/ReactWeb/src/hooks/useChat.jsx) | JavaScript JSX | 86 | 20 | 20 | 126 |
| [ReactWeb/src/hooks/useFeed.js](/ReactWeb/src/hooks/useFeed.js) | JavaScript | 129 | 4 | 20 | 153 |
| [ReactWeb/src/hooks/useFriend.js](/ReactWeb/src/hooks/useFriend.js) | JavaScript | 141 | 0 | 12 | 153 |
| [ReactWeb/src/hooks/usePersonalInfo.js](/ReactWeb/src/hooks/usePersonalInfo.js) | JavaScript | 24 | 0 | 6 | 30 |
| [ReactWeb/src/hooks/useSchools.js](/ReactWeb/src/hooks/useSchools.js) | JavaScript | 35 | 2 | 3 | 40 |
| [ReactWeb/src/hooks/useUserPosts.js](/ReactWeb/src/hooks/useUserPosts.js) | JavaScript | 79 | 5 | 14 | 98 |
| [ReactWeb/src/index.css](/ReactWeb/src/index.css) | PostCSS | 9 | 0 | 1 | 10 |
| [ReactWeb/src/main.jsx](/ReactWeb/src/main.jsx) | JavaScript JSX | 21 | 0 | 1 | 22 |
| [ReactWeb/src/pages/FriendsPage.jsx](/ReactWeb/src/pages/FriendsPage.jsx) | JavaScript JSX | 211 | 3 | 23 | 237 |
| [ReactWeb/src/pages/GroupPage.jsx](/ReactWeb/src/pages/GroupPage.jsx) | JavaScript JSX | 432 | 0 | 30 | 462 |
| [ReactWeb/src/pages/GroupsCreatePage.jsx](/ReactWeb/src/pages/GroupsCreatePage.jsx) | JavaScript JSX | 227 | 0 | 20 | 247 |
| [ReactWeb/src/pages/GroupsPage.jsx](/ReactWeb/src/pages/GroupsPage.jsx) | JavaScript JSX | 314 | 0 | 16 | 330 |
| [ReactWeb/src/pages/HomePage.jsx](/ReactWeb/src/pages/HomePage.jsx) | JavaScript JSX | 132 | 2 | 23 | 157 |
| [ReactWeb/src/pages/MessengerPage.jsx](/ReactWeb/src/pages/MessengerPage.jsx) | JavaScript JSX | 5 | 1 | 2 | 8 |
| [ReactWeb/src/pages/ProfilePage.jsx](/ReactWeb/src/pages/ProfilePage.jsx) | JavaScript JSX | 801 | 49 | 85 | 935 |
| [ReactWeb/src/pages/ReelsPage.jsx](/ReactWeb/src/pages/ReelsPage.jsx) | JavaScript JSX | 95 | 0 | 12 | 107 |
| [ReactWeb/src/pages/SearchPage.jsx](/ReactWeb/src/pages/SearchPage.jsx) | JavaScript JSX | 201 | 0 | 15 | 216 |
| [ReactWeb/src/pages/SigninPage.jsx](/ReactWeb/src/pages/SigninPage.jsx) | JavaScript JSX | 235 | 7 | 24 | 266 |
| [ReactWeb/src/pages/SignupPage.jsx](/ReactWeb/src/pages/SignupPage.jsx) | JavaScript JSX | 193 | 8 | 30 | 231 |
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
| [Web/obj/Debug/net10.0/ApiEndpoints.json](/Web/obj/Debug/net10.0/ApiEndpoints.json) | JSON | 1,205 | 0 | 0 | 1,205 |
| [Web/obj/Debug/net10.0/EndpointInfo/Api.json](/Web/obj/Debug/net10.0/EndpointInfo/Api.json) | JSON | 96 | 0 | 0 | 96 |
| [Web/obj/Debug/net10.0/EndpointInfo/Web.json](/Web/obj/Debug/net10.0/EndpointInfo/Web.json) | JSON | 2,543 | 0 | 0 | 2,543 |
| [Web/obj/Debug/net10.0/Web.AssemblyInfo.cs](/Web/obj/Debug/net10.0/Web.AssemblyInfo.cs) | C# | 9 | 10 | 5 | 24 |
| [Web/obj/Debug/net10.0/Web.GeneratedMSBuildEditorConfig.editorconfig](/Web/obj/Debug/net10.0/Web.GeneratedMSBuildEditorConfig.editorconfig) | Properties | 31 | 0 | 1 | 32 |
| [Web/obj/Debug/net10.0/Web.GlobalUsings.g.cs](/Web/obj/Debug/net10.0/Web.GlobalUsings.g.cs) | C# | 16 | 1 | 1 | 18 |
| [Web/obj/Debug/net10.0/Web.MvcApplicationPartsAssemblyInfo.cs](/Web/obj/Debug/net10.0/Web.MvcApplicationPartsAssemblyInfo.cs) | C# | 4 | 9 | 5 | 18 |
| [Web/obj/Debug/net10.0/Web.sourcelink.json](/Web/obj/Debug/net10.0/Web.sourcelink.json) | JSON | 1 | 0 | 0 | 1 |
| [Web/obj/Debug/net10.0/rjsmcshtml.dswa.cache.json](/Web/obj/Debug/net10.0/rjsmcshtml.dswa.cache.json) | JSON | 1 | 0 | 0 | 1 |
| [Web/obj/Debug/net10.0/rjsmrazor.dswa.cache.json](/Web/obj/Debug/net10.0/rjsmrazor.dswa.cache.json) | JSON | 1 | 0 | 0 | 1 |
| [Web/obj/Debug/net10.0/rpswa.dswa.cache.json](/Web/obj/Debug/net10.0/rpswa.dswa.cache.json) | JSON | 1 | 0 | 0 | 1 |
| [Web/obj/Debug/net10.0/staticwebassets.build.endpoints.json](/Web/obj/Debug/net10.0/staticwebassets.build.endpoints.json) | JSON | 1 | 0 | 0 | 1 |
| [Web/obj/Debug/net10.0/staticwebassets.build.json](/Web/obj/Debug/net10.0/staticwebassets.build.json) | JSON | 1 | 0 | 0 | 1 |
| [Web/obj/Web.csproj.nuget.dgspec.json](/Web/obj/Web.csproj.nuget.dgspec.json) | JSON | 2,080 | 0 | 0 | 2,080 |
| [Web/obj/Web.csproj.nuget.g.props](/Web/obj/Web.csproj.nuget.g.props) | XML | 535 | 0 | 0 | 535 |
| [Web/obj/Web.csproj.nuget.g.targets](/Web/obj/Web.csproj.nuget.g.targets) | XML | 9 | 0 | 0 | 9 |
| [Web/obj/project.assets.json](/Web/obj/project.assets.json) | JSON | 4,990 | 0 | 0 | 4,990 |
| [build.log](/build.log) | log | 9,873 | 0 | 17 | 9,890 |
| [package-lock.json](/package-lock.json) | JSON | 6 | 0 | 1 | 7 |

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)