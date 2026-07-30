# Diff Details

Date : 2026-07-30 22:38:47

Directory d:\\SocialNetworkApp\\SocialNetworkApp\\src

Total : 422 files,  -7286 codes, 784 comments, -5043 blanks, all -11545 lines

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [Application/Abstractions/Repositories/IBirthdayRepository.cs](/Application/Abstractions/Repositories/IBirthdayRepository.cs) | C# | 7 | 0 | 3 | 10 |
| [Application/Abstractions/Repositories/IConversationRepository.cs](/Application/Abstractions/Repositories/IConversationRepository.cs) | C# | 8 | 15 | 4 | 27 |
| [Application/Abstractions/Repositories/IFriendRequestRepository.cs](/Application/Abstractions/Repositories/IFriendRequestRepository.cs) | C# | 1 | 0 | 1 | 2 |
| [Application/Abstractions/Repositories/IGroupListingRepository.cs](/Application/Abstractions/Repositories/IGroupListingRepository.cs) | C# | -14 | -5 | -3 | -22 |
| [Application/Abstractions/Repositories/IGroupRepository.cs](/Application/Abstractions/Repositories/IGroupRepository.cs) | C# | 1 | 0 | 1 | 2 |
| [Application/Abstractions/Repositories/IMessageRepository.cs](/Application/Abstractions/Repositories/IMessageRepository.cs) | C# | 3 | 0 | 0 | 3 |
| [Application/Abstractions/Repositories/INotificationRepository.cs](/Application/Abstractions/Repositories/INotificationRepository.cs) | C# | 11 | 0 | 3 | 14 |
| [Application/Abstractions/Repositories/IPostRepository.cs](/Application/Abstractions/Repositories/IPostRepository.cs) | C# | 5 | 0 | 0 | 5 |
| [Application/Abstractions/Repositories/IReelRepository.cs](/Application/Abstractions/Repositories/IReelRepository.cs) | C# | 4 | 0 | 0 | 4 |
| [Application/Abstractions/Repositories/IUserRepository.cs](/Application/Abstractions/Repositories/IUserRepository.cs) | C# | 10 | 0 | 0 | 10 |
| [Application/Abstractions/Repositories/MessagesAroundResult.cs](/Application/Abstractions/Repositories/MessagesAroundResult.cs) | C# | 7 | 0 | 3 | 10 |
| [Application/Abstractions/Security/IBlindIndexService.cs](/Application/Abstractions/Security/IBlindIndexService.cs) | C# | -7 | 0 | -2 | -9 |
| [Application/Abstractions/SignalR/ICallHubNotifier.cs](/Application/Abstractions/SignalR/ICallHubNotifier.cs) | C# | 9 | 0 | 2 | 11 |
| [Application/Abstractions/SignalR/IChatHubNotifier.cs](/Application/Abstractions/SignalR/IChatHubNotifier.cs) | C# | 12 | 0 | 3 | 15 |
| [Application/Abstractions/SignalR/INotificationHubNotifier.cs](/Application/Abstractions/SignalR/INotificationHubNotifier.cs) | C# | 6 | 7 | 2 | 15 |
| [Application/Abstractions/SignalR/IPresenceTracker.cs](/Application/Abstractions/SignalR/IPresenceTracker.cs) | C# | 14 | 0 | 2 | 16 |
| [Application/Application.csproj](/Application/Application.csproj) | XML | 6 | 0 | 1 | 7 |
| [Application/Auth/Commands/AdminLogin/AdminLoginCommand.cs](/Application/Auth/Commands/AdminLogin/AdminLoginCommand.cs) | C# | 11 | 5 | 3 | 19 |
| [Application/Auth/Commands/AdminLogin/AdminLoginCommandHandler.cs](/Application/Auth/Commands/AdminLogin/AdminLoginCommandHandler.cs) | C# | 46 | 0 | 9 | 55 |
| [Application/Conversations/Commands/AddMemberToConversation/AddMemberToConversationCommand.cs](/Application/Conversations/Commands/AddMemberToConversation/AddMemberToConversationCommand.cs) | C# | 7 | 0 | 3 | 10 |
| [Application/Conversations/Commands/AddMemberToConversation/AddMemberToConversationCommandHandler.cs](/Application/Conversations/Commands/AddMemberToConversation/AddMemberToConversationCommandHandler.cs) | C# | 102 | 3 | 21 | 126 |
| [Application/Conversations/Commands/AssignAdminRole/AssignAdminRoleCommand.cs](/Application/Conversations/Commands/AssignAdminRole/AssignAdminRoleCommand.cs) | C# | 7 | 0 | 3 | 10 |
| [Application/Conversations/Commands/AssignAdminRole/AssignAdminRoleCommandHandler.cs](/Application/Conversations/Commands/AssignAdminRole/AssignAdminRoleCommandHandler.cs) | C# | 30 | 0 | 7 | 37 |
| [Application/Conversations/Commands/BlockUser/BlockUserCommand.cs](/Application/Conversations/Commands/BlockUser/BlockUserCommand.cs) | C# | 6 | 0 | 3 | 9 |
| [Application/Conversations/Commands/BlockUser/BlockUserCommandHandler.cs](/Application/Conversations/Commands/BlockUser/BlockUserCommandHandler.cs) | C# | 45 | 0 | 10 | 55 |
| [Application/Conversations/Commands/CreateConversation/CreateConversationCommandHandler.cs](/Application/Conversations/Commands/CreateConversation/CreateConversationCommandHandler.cs) | C# | 8 | -8 | 4 | 4 |
| [Application/Conversations/Commands/KickMemberOut/KickMemberOutCommand.cs](/Application/Conversations/Commands/KickMemberOut/KickMemberOutCommand.cs) | C# | 7 | 0 | 3 | 10 |
| [Application/Conversations/Commands/KickMemberOut/KickMemberOutCommandHandler.cs](/Application/Conversations/Commands/KickMemberOut/KickMemberOutCommandHandler.cs) | C# | 66 | 0 | 12 | 78 |
| [Application/Conversations/Commands/LeaveConversation/LeaveConversationCommand.cs](/Application/Conversations/Commands/LeaveConversation/LeaveConversationCommand.cs) | C# | 6 | 0 | 3 | 9 |
| [Application/Conversations/Commands/LeaveConversation/LeaveConversationCommandHandler.cs](/Application/Conversations/Commands/LeaveConversation/LeaveConversationCommandHandler.cs) | C# | 66 | 0 | 12 | 78 |
| [Application/Conversations/Commands/RevokeAdminRole/RevokeAdminRoleCommand.cs](/Application/Conversations/Commands/RevokeAdminRole/RevokeAdminRoleCommand.cs) | C# | 7 | 0 | 3 | 10 |
| [Application/Conversations/Commands/RevokeAdminRole/RevokeAdminRoleCommandHandler.cs](/Application/Conversations/Commands/RevokeAdminRole/RevokeAdminRoleCommandHandler.cs) | C# | 30 | 0 | 7 | 37 |
| [Application/Conversations/Commands/UnblockUser/UnblockUserCommand.cs](/Application/Conversations/Commands/UnblockUser/UnblockUserCommand.cs) | C# | 6 | 0 | 3 | 9 |
| [Application/Conversations/Commands/UnblockUser/UnblockUserCommandHandler.cs](/Application/Conversations/Commands/UnblockUser/UnblockUserCommandHandler.cs) | C# | 40 | 0 | 9 | 49 |
| [Application/Conversations/Commands/UpdateConversation/UpdateConversationCommand.cs](/Application/Conversations/Commands/UpdateConversation/UpdateConversationCommand.cs) | C# | 10 | 0 | 3 | 13 |
| [Application/Conversations/Commands/UpdateConversation/UpdateConversationCommandHandler.cs](/Application/Conversations/Commands/UpdateConversation/UpdateConversationCommandHandler.cs) | C# | 116 | 0 | 24 | 140 |
| [Application/Conversations/Commands/UploadConversationImage/UploadConversationImageCommand.cs](/Application/Conversations/Commands/UploadConversationImage/UploadConversationImageCommand.cs) | C# | 8 | 0 | 3 | 11 |
| [Application/Conversations/Commands/UploadConversationImage/UploadConversationImageCommandHandler.cs](/Application/Conversations/Commands/UploadConversationImage/UploadConversationImageCommandHandler.cs) | C# | 95 | 0 | 17 | 112 |
| [Application/Conversations/Queries/GetConversationMembers/GetConversationMembersQuery.cs](/Application/Conversations/Queries/GetConversationMembers/GetConversationMembersQuery.cs) | C# | 9 | 0 | 3 | 12 |
| [Application/Conversations/Queries/GetConversationMembers/GetConversationMembersQueryHandler.cs](/Application/Conversations/Queries/GetConversationMembers/GetConversationMembersQueryHandler.cs) | C# | 36 | 0 | 9 | 45 |
| [Application/Conversations/Queries/GetConversations/GetConversationsQuery.cs](/Application/Conversations/Queries/GetConversations/GetConversationsQuery.cs) | C# | 2 | 0 | 0 | 2 |
| [Application/Conversations/Queries/GetConversations/GetConversationsQueryHandler.cs](/Application/Conversations/Queries/GetConversations/GetConversationsQueryHandler.cs) | C# | 2 | 0 | 1 | 3 |
| [Application/Conversations/Queries/SearchConversationsAndFriends/SearchConversationsAndFriendsQueryHandler.cs](/Application/Conversations/Queries/SearchConversationsAndFriends/SearchConversationsAndFriendsQueryHandler.cs) | C# | 0 | 1 | 0 | 1 |
| [Application/DTOs/Conversations/ConversationDetailDto.cs](/Application/DTOs/Conversations/ConversationDetailDto.cs) | C# | 47 | 0 | 2 | 49 |
| [Application/DTOs/Conversations/ConversationResponse.cs](/Application/DTOs/Conversations/ConversationResponse.cs) | C# | -52 | -2 | -4 | -58 |
| [Application/DTOs/Messages/AttachmentDto.cs](/Application/DTOs/Messages/AttachmentDto.cs) | C# | 4 | 0 | 0 | 4 |
| [Application/DTOs/Messages/MemberMessageDto.cs](/Application/DTOs/Messages/MemberMessageDto.cs) | C# | -21 | 0 | -1 | -22 |
| [Application/DTOs/Messages/MessageDto.cs](/Application/DTOs/Messages/MessageDto.cs) | C# | 44 | 0 | -4 | 40 |
| [Application/DTOs/Messages/MessageReactionDto.cs](/Application/DTOs/Messages/MessageReactionDto.cs) | C# | 23 | 0 | 3 | 26 |
| [Application/DTOs/Messages/MessagesAroundDto.cs](/Application/DTOs/Messages/MessagesAroundDto.cs) | C# | 6 | 0 | 2 | 8 |
| [Application/DTOs/Notifications/NotificationDto.cs](/Application/DTOs/Notifications/NotificationDto.cs) | C# | 24 | 0 | 2 | 26 |
| [Application/DTOs/Posts/PostDto.cs](/Application/DTOs/Posts/PostDto.cs) | C# | 1 | 0 | 0 | 1 |
| [Application/DTOs/Posts/SavedPostDto.cs](/Application/DTOs/Posts/SavedPostDto.cs) | C# | 8 | 0 | 1 | 9 |
| [Application/DTOs/Posts/TagDto.cs](/Application/DTOs/Posts/TagDto.cs) | C# | 7 | 0 | 1 | 8 |
| [Application/DTOs/Search/SearchGroupDto.cs](/Application/DTOs/Search/SearchGroupDto.cs) | C# | 11 | 0 | 2 | 13 |
| [Application/DTOs/Search/SearchPostDto.cs](/Application/DTOs/Search/SearchPostDto.cs) | C# | 17 | 0 | 2 | 19 |
| [Application/DTOs/Search/SearchReelDto.cs](/Application/DTOs/Search/SearchReelDto.cs) | C# | 17 | 0 | 2 | 19 |
| [Application/DTOs/Search/SearchUserDto.cs](/Application/DTOs/Search/SearchUserDto.cs) | C# | 10 | 0 | 1 | 11 |
| [Application/DTOs/Stories/StoryTimelineUserDto.cs](/Application/DTOs/Stories/StoryTimelineUserDto.cs) | C# | -1 | 0 | 0 | -1 |
| [Application/DTOs/Users/BirthdayDto.cs](/Application/DTOs/Users/BirthdayDto.cs) | C# | 10 | 0 | 2 | 12 |
| [Application/Friend/Commands/SendFriendRequest/SendFriendRequestCommandHandler.cs](/Application/Friend/Commands/SendFriendRequest/SendFriendRequestCommandHandler.cs) | C# | 6 | 1 | 0 | 7 |
| [Application/Friend/Events/FriendRequestCreated/FriendRequestCreatedDomainEventHandler.cs](/Application/Friend/Events/FriendRequestCreated/FriendRequestCreatedDomainEventHandler.cs) | C# | 77 | 0 | 12 | 89 |
| [Application/Friend/Events/FriendshipCreated/FriendshipCreatedDomainEventHandler.cs](/Application/Friend/Events/FriendshipCreated/FriendshipCreatedDomainEventHandler.cs) | C# | 42 | 0 | 7 | 49 |
| [Application/Groups/Commands/ReviewGroupJoinRequest/ReviewGroupJoinRequestCommandHandler.cs](/Application/Groups/Commands/ReviewGroupJoinRequest/ReviewGroupJoinRequestCommandHandler.cs) | C# | 15 | 1 | 1 | 17 |
| [Application/Groups/Events/GroupJoinRequestAccepted/GroupJoinRequestAcceptedDomainEventHandler.cs](/Application/Groups/Events/GroupJoinRequestAccepted/GroupJoinRequestAcceptedDomainEventHandler.cs) | C# | 80 | 0 | 13 | 93 |
| [Application/Messages/Commands/ForwardMessage/ForwardMessageCommandHandler.cs](/Application/Messages/Commands/ForwardMessage/ForwardMessageCommandHandler.cs) | C# | -6 | -3 | -1 | -10 |
| [Application/Messages/Commands/MarkMessagesAsSeen/MarkMessagesAsSeenCommand.cs](/Application/Messages/Commands/MarkMessagesAsSeen/MarkMessagesAsSeenCommand.cs) | C# | 7 | 0 | 3 | 10 |
| [Application/Messages/Commands/MarkMessagesAsSeen/MarkMessagesAsSeenCommandHandler.cs](/Application/Messages/Commands/MarkMessagesAsSeen/MarkMessagesAsSeenCommandHandler.cs) | C# | 32 | 0 | 8 | 40 |
| [Application/Messages/Commands/ReactToMessage/ReactToMessageCommand.cs](/Application/Messages/Commands/ReactToMessage/ReactToMessageCommand.cs) | C# | 9 | 0 | 3 | 12 |
| [Application/Messages/Commands/ReactToMessage/ReactToMessageCommandHandler.cs](/Application/Messages/Commands/ReactToMessage/ReactToMessageCommandHandler.cs) | C# | 35 | 0 | 8 | 43 |
| [Application/Messages/Commands/SendMessage/SendMessageCommand.cs](/Application/Messages/Commands/SendMessage/SendMessageCommand.cs) | C# | 9 | 0 | 1 | 10 |
| [Application/Messages/Commands/SendMessage/SendMessageCommandHandler.cs](/Application/Messages/Commands/SendMessage/SendMessageCommandHandler.cs) | C# | 37 | -2 | 3 | 38 |
| [Application/Messages/Commands/TogglePinMessage/TogglePinMessageCommand.cs](/Application/Messages/Commands/TogglePinMessage/TogglePinMessageCommand.cs) | C# | 6 | 0 | 3 | 9 |
| [Application/Messages/Commands/TogglePinMessage/TogglePinMessageCommandHandler.cs](/Application/Messages/Commands/TogglePinMessage/TogglePinMessageCommandHandler.cs) | C# | 44 | 0 | 8 | 52 |
| [Application/Messages/Commands/UpdateMessage/UpdateMessageCommand.cs](/Application/Messages/Commands/UpdateMessage/UpdateMessageCommand.cs) | C# | 1 | 0 | 0 | 1 |
| [Application/Messages/Commands/UpdateMessage/UpdateMessageCommandHandler.cs](/Application/Messages/Commands/UpdateMessage/UpdateMessageCommandHandler.cs) | C# | 1 | 0 | 0 | 1 |
| [Application/Messages/Queries/GetFilesByConversationId/GetFilesByConversationIdQuery.cs](/Application/Messages/Queries/GetFilesByConversationId/GetFilesByConversationIdQuery.cs) | C# | 9 | 0 | 3 | 12 |
| [Application/Messages/Queries/GetFilesByConversationId/GetFilesByConversationIdQueryHandler.cs](/Application/Messages/Queries/GetFilesByConversationId/GetFilesByConversationIdQueryHandler.cs) | C# | 39 | 0 | 8 | 47 |
| [Application/Messages/Queries/GetMessagesAround/GetMessagesAroundQueryHandler.cs](/Application/Messages/Queries/GetMessagesAround/GetMessagesAroundQueryHandler.cs) | C# | 4 | 0 | 0 | 4 |
| [Application/Messages/Queries/GetPinnedMessages/GetPinnedMessagesQuery.cs](/Application/Messages/Queries/GetPinnedMessages/GetPinnedMessagesQuery.cs) | C# | 9 | 0 | 3 | 12 |
| [Application/Messages/Queries/GetPinnedMessages/GetPinnedMessagesQueryHandler.cs](/Application/Messages/Queries/GetPinnedMessages/GetPinnedMessagesQueryHandler.cs) | C# | 42 | 0 | 8 | 50 |
| [Application/Messages/Queries/SearchMessages/SearchMessagesQuery.cs](/Application/Messages/Queries/SearchMessages/SearchMessagesQuery.cs) | C# | 2 | 0 | 0 | 2 |
| [Application/Messages/Queries/SearchMessages/SearchMessagesQueryHandler.cs](/Application/Messages/Queries/SearchMessages/SearchMessagesQueryHandler.cs) | C# | 4 | -4 | 0 | 0 |
| [Application/Notifications/Commands/MarkNotificationAsSeen/MarkNotificationAsSeenCommand.cs](/Application/Notifications/Commands/MarkNotificationAsSeen/MarkNotificationAsSeenCommand.cs) | C# | 6 | 0 | 3 | 9 |
| [Application/Notifications/Commands/MarkNotificationAsSeen/MarkNotificationAsSeenCommandHandler.cs](/Application/Notifications/Commands/MarkNotificationAsSeen/MarkNotificationAsSeenCommandHandler.cs) | C# | 29 | 0 | 7 | 36 |
| [Application/Notifications/Commands/MarkNotificationAsSeen/MarkNotificationAsSeenResponse.cs](/Application/Notifications/Commands/MarkNotificationAsSeen/MarkNotificationAsSeenResponse.cs) | C# | 2 | 0 | 2 | 4 |
| [Application/Notifications/Queries/GetPagedNotifications/GetPagedNotificationsQuery.cs](/Application/Notifications/Queries/GetPagedNotifications/GetPagedNotificationsQuery.cs) | C# | 12 | 0 | 2 | 14 |
| [Application/Notifications/Queries/GetPagedNotifications/GetPagedNotificationsQueryHandler.cs](/Application/Notifications/Queries/GetPagedNotifications/GetPagedNotificationsQueryHandler.cs) | C# | 59 | 0 | 8 | 67 |
| [Application/Posts/Commands/CreateComment/CreateCommentCommandHandler.cs](/Application/Posts/Commands/CreateComment/CreateCommentCommandHandler.cs) | C# | 10 | 1 | 2 | 13 |
| [Application/Posts/Commands/CreatePost/CreatePostCommandHandler.cs](/Application/Posts/Commands/CreatePost/CreatePostCommandHandler.cs) | C# | 13 | 1 | 3 | 17 |
| [Application/Posts/Commands/UpdatePost/UpdatePostCommand.cs](/Application/Posts/Commands/UpdatePost/UpdatePostCommand.cs) | C# | 3 | 0 | 0 | 3 |
| [Application/Posts/Commands/UpdatePost/UpdatePostCommandHandler.cs](/Application/Posts/Commands/UpdatePost/UpdatePostCommandHandler.cs) | C# | 80 | 0 | 9 | 89 |
| [Application/Posts/Events/CommentCreated/CommentCreatedDomainEventHandler.cs](/Application/Posts/Events/CommentCreated/CommentCreatedDomainEventHandler.cs) | C# | 110 | 2 | 14 | 126 |
| [Application/Posts/Events/PostCreated/PostCreatedDomainEventHandler.cs](/Application/Posts/Events/PostCreated/PostCreatedDomainEventHandler.cs) | C# | 82 | 0 | 14 | 96 |
| [Application/Posts/Queries/GetDetailPost/GetDetailPostQuery.cs](/Application/Posts/Queries/GetDetailPost/GetDetailPostQuery.cs) | C# | 6 | 0 | 2 | 8 |
| [Application/Posts/Queries/GetDetailPost/GetDetailPostQueryHandler.cs](/Application/Posts/Queries/GetDetailPost/GetDetailPostQueryHandler.cs) | C# | 26 | 0 | 5 | 31 |
| [Application/Posts/Queries/GetPost/GetPostQuery.cs](/Application/Posts/Queries/GetPost/GetPostQuery.cs) | C# | -6 | 0 | -2 | -8 |
| [Application/Posts/Queries/GetPost/GetPostQueryHandler.cs](/Application/Posts/Queries/GetPost/GetPostQueryHandler.cs) | C# | -145 | 0 | -16 | -161 |
| [Application/Posts/Queries/GetPostsByGroup/GetPostsByGroupQueryHandler.cs](/Application/Posts/Queries/GetPostsByGroup/GetPostsByGroupQueryHandler.cs) | C# | 2 | 0 | 0 | 2 |
| [Application/Posts/Queries/GetPostsByPerson/GetPostsByPersonQueryHandler.cs](/Application/Posts/Queries/GetPostsByPerson/GetPostsByPersonQueryHandler.cs) | C# | 2 | 0 | 0 | 2 |
| [Application/Posts/Queries/GetSavedPosts/GetSavedPostsQuery.cs](/Application/Posts/Queries/GetSavedPosts/GetSavedPostsQuery.cs) | C# | 11 | 0 | 2 | 13 |
| [Application/Posts/Queries/GetSavedPosts/GetSavedPostsQueryHandler.cs](/Application/Posts/Queries/GetSavedPosts/GetSavedPostsQueryHandler.cs) | C# | 140 | 0 | 15 | 155 |
| [Application/Posts/Queries/SearchPosts/SearchPostsQuery.cs](/Application/Posts/Queries/SearchPosts/SearchPostsQuery.cs) | C# | 13 | 0 | 2 | 15 |
| [Application/Posts/Queries/SearchPosts/SearchPostsQueryHandler.cs](/Application/Posts/Queries/SearchPosts/SearchPostsQueryHandler.cs) | C# | 25 | 0 | 7 | 32 |
| [Application/Reels/Commands/CreateReelComment/CreateReelCommentCommand.cs](/Application/Reels/Commands/CreateReelComment/CreateReelCommentCommand.cs) | C# | 9 | 0 | 3 | 12 |
| [Application/Reels/Commands/CreateReelComment/CreateReelCommentCommandHandler.cs](/Application/Reels/Commands/CreateReelComment/CreateReelCommentCommandHandler.cs) | C# | 92 | 0 | 14 | 106 |
| [Application/Reels/Commands/RecordReelView/RecordReelViewCommand.cs](/Application/Reels/Commands/RecordReelView/RecordReelViewCommand.cs) | C# | 6 | 0 | 3 | 9 |
| [Application/Reels/Commands/RecordReelView/RecordReelViewCommandHandler.cs](/Application/Reels/Commands/RecordReelView/RecordReelViewCommandHandler.cs) | C# | 40 | 0 | 8 | 48 |
| [Application/Reels/Queries/GetRecommendedReels/GetRecommendedReelsQuery.cs](/Application/Reels/Queries/GetRecommendedReels/GetRecommendedReelsQuery.cs) | C# | 1 | 0 | -1 | 0 |
| [Application/Reels/Queries/GetRecommendedReels/GetRecommendedReelsQueryHandler.cs](/Application/Reels/Queries/GetRecommendedReels/GetRecommendedReelsQueryHandler.cs) | C# | 6 | 1 | 0 | 7 |
| [Application/Reels/Queries/GetTopReels/GetTopReelsQuery.cs](/Application/Reels/Queries/GetTopReels/GetTopReelsQuery.cs) | C# | 8 | 0 | 3 | 11 |
| [Application/Reels/Queries/GetTopReels/GetTopReelsQueryHandler.cs](/Application/Reels/Queries/GetTopReels/GetTopReelsQueryHandler.cs) | C# | 52 | 0 | 10 | 62 |
| [Application/Reels/Queries/SearchReels/SearchReelsQuery.cs](/Application/Reels/Queries/SearchReels/SearchReelsQuery.cs) | C# | 12 | 0 | 2 | 14 |
| [Application/Reels/Queries/SearchReels/SearchReelsQueryHandler.cs](/Application/Reels/Queries/SearchReels/SearchReelsQueryHandler.cs) | C# | 28 | 0 | 6 | 34 |
| [Application/Stories/Commands/MarkStoryAsSeen/MarkStoryAsSeenCommand.cs](/Application/Stories/Commands/MarkStoryAsSeen/MarkStoryAsSeenCommand.cs) | C# | 6 | 0 | 3 | 9 |
| [Application/Stories/Commands/MarkStoryAsSeen/MarkStoryAsSeenCommandHandler.cs](/Application/Stories/Commands/MarkStoryAsSeen/MarkStoryAsSeenCommandHandler.cs) | C# | 54 | 0 | 10 | 64 |
| [Application/Stories/Commands/MarkStoryAsSeen/MarkStoryAsSeenResponse.cs](/Application/Stories/Commands/MarkStoryAsSeen/MarkStoryAsSeenResponse.cs) | C# | 2 | 0 | 2 | 4 |
| [Application/Stories/Commands/UploadStoryMedia/UploadStoryMediaCommand.cs](/Application/Stories/Commands/UploadStoryMedia/UploadStoryMediaCommand.cs) | C# | 9 | 0 | 3 | 12 |
| [Application/Stories/Commands/UploadStoryMedia/UploadStoryMediaCommandHandler.cs](/Application/Stories/Commands/UploadStoryMedia/UploadStoryMediaCommandHandler.cs) | C# | 45 | 0 | 7 | 52 |
| [Application/Stories/Queries/GetStoryTimeline/GetStoryTimelineQueryHandler.cs](/Application/Stories/Queries/GetStoryTimeline/GetStoryTimelineQueryHandler.cs) | C# | -4 | 0 | -1 | -5 |
| [Application/Users/Queries/GetTodayBirthdays/GetTodayBirthdaysQuery.cs](/Application/Users/Queries/GetTodayBirthdays/GetTodayBirthdaysQuery.cs) | C# | 4 | 0 | 3 | 7 |
| [Application/Users/Queries/GetTodayBirthdays/GetTodayBirthdaysQueryHandler.cs](/Application/Users/Queries/GetTodayBirthdays/GetTodayBirthdaysQueryHandler.cs) | C# | 21 | 0 | 5 | 26 |
| [Application/Users/Queries/GetUpcomingBirthdays/GetUpcomingBirthdaysQuery.cs](/Application/Users/Queries/GetUpcomingBirthdays/GetUpcomingBirthdaysQuery.cs) | C# | 4 | 0 | 3 | 7 |
| [Application/Users/Queries/GetUpcomingBirthdays/GetUpcomingBirthdaysQueryHandler.cs](/Application/Users/Queries/GetUpcomingBirthdays/GetUpcomingBirthdaysQueryHandler.cs) | C# | 20 | 0 | 5 | 25 |
| [Application/Users/Queries/IsBlockedByUserId/IsBlockedByUserIdQuery.cs](/Application/Users/Queries/IsBlockedByUserId/IsBlockedByUserIdQuery.cs) | C# | 8 | 0 | 3 | 11 |
| [Application/Users/Queries/IsBlockedByUserId/IsBlockedByUserIdQueryHandler.cs](/Application/Users/Queries/IsBlockedByUserId/IsBlockedByUserIdQueryHandler.cs) | C# | 24 | 0 | 6 | 30 |
| [Application/Users/Queries/IsBlockingUser/IsBlockingUserQuery.cs](/Application/Users/Queries/IsBlockingUser/IsBlockingUserQuery.cs) | C# | 7 | 0 | 3 | 10 |
| [Application/Users/Queries/IsBlockingUser/IsBlockingUserQueryHandler.cs](/Application/Users/Queries/IsBlockingUser/IsBlockingUserQueryHandler.cs) | C# | 24 | 0 | 6 | 30 |
| [Application/Users/Queries/SearchUsers/SearchUsersQuery.cs](/Application/Users/Queries/SearchUsers/SearchUsersQuery.cs) | C# | 12 | 0 | 2 | 14 |
| [Application/Users/Queries/SearchUsers/SearchUsersQueryHandler.cs](/Application/Users/Queries/SearchUsers/SearchUsersQueryHandler.cs) | C# | 28 | 0 | 6 | 34 |
| [Application/obj/Application.csproj.nuget.dgspec.json](/Application/obj/Application.csproj.nuget.dgspec.json) | JSON | -4 | 0 | 0 | -4 |
| [Application/obj/project.assets.json](/Application/obj/project.assets.json) | JSON | -2 | 0 | 0 | -2 |
| [Domain/Common/AggregateRoot.cs](/Domain/Common/AggregateRoot.cs) | C# | 0 | 0 | -1 | -1 |
| [Domain/Domain.csproj](/Domain/Domain.csproj) | XML | 2 | 0 | 0 | 2 |
| [Domain/Entities/Conversation.cs](/Domain/Entities/Conversation.cs) | C# | 81 | 0 | 26 | 107 |
| [Domain/Entities/ConversationMember.cs](/Domain/Entities/ConversationMember.cs) | C# | 2 | 0 | 0 | 2 |
| [Domain/Entities/MemberMessage.cs](/Domain/Entities/MemberMessage.cs) | C# | -21 | -1 | -7 | -29 |
| [Domain/Entities/Message.cs](/Domain/Entities/Message.cs) | C# | 35 | 0 | 5 | 40 |
| [Domain/Entities/MessageReaction.cs](/Domain/Entities/MessageReaction.cs) | C# | 31 | 1 | 9 | 41 |
| [Domain/Entities/Notification.cs](/Domain/Entities/Notification.cs) | C# | 27 | 0 | 5 | 32 |
| [Domain/Entities/User.cs](/Domain/Entities/User.cs) | C# | 2 | 3 | 1 | 6 |
| [Domain/Enums/ConversationRole.cs](/Domain/Enums/ConversationRole.cs) | C# | 1 | 0 | 0 | 1 |
| [Domain/Enums/MessageType.cs](/Domain/Enums/MessageType.cs) | C# | 0 | 0 | -2 | -2 |
| [Domain/Enums/NotificationEntityType.cs](/Domain/Enums/NotificationEntityType.cs) | C# | 3 | 0 | 0 | 3 |
| [Domain/Enums/ReactionTargetType.cs](/Domain/Enums/ReactionTargetType.cs) | C# | -8 | 0 | -1 | -9 |
| [Domain/Enums/SystemMessageType.cs](/Domain/Enums/SystemMessageType.cs) | C# | 14 | 0 | 1 | 15 |
| [Domain/Events/CommentCreatedDomainEvent.cs](/Domain/Events/CommentCreatedDomainEvent.cs) | C# | 10 | 0 | 3 | 13 |
| [Domain/Events/FriendRequestCreatedDomainEvent.cs](/Domain/Events/FriendRequestCreatedDomainEvent.cs) | C# | 7 | 0 | 3 | 10 |
| [Domain/Events/GroupJoinRequestAcceptedDomainEvent.cs](/Domain/Events/GroupJoinRequestAcceptedDomainEvent.cs) | C# | 9 | 0 | 3 | 12 |
| [Domain/Events/PostCreatedDomainEvent.cs](/Domain/Events/PostCreatedDomainEvent.cs) | C# | 9 | 0 | 3 | 12 |
| [Domain/obj/Domain.csproj.nuget.dgspec.json](/Domain/obj/Domain.csproj.nuget.dgspec.json) | JSON | -2 | 0 | 0 | -2 |
| [Domain/obj/Release/net10.0/.NETCoreApp,Version=v10.0.AssemblyAttributes.cs](/Domain/obj/Release/net10.0/.NETCoreApp,Version=v10.0.AssemblyAttributes.cs) | C# | 3 | 1 | 1 | 5 |
| [Domain/obj/Release/net10.0/Domain.AssemblyInfo.cs](/Domain/obj/Release/net10.0/Domain.AssemblyInfo.cs) | C# | 9 | 10 | 5 | 24 |
| [Domain/obj/Release/net10.0/Domain.GeneratedMSBuildEditorConfig.editorconfig](/Domain/obj/Release/net10.0/Domain.GeneratedMSBuildEditorConfig.editorconfig) | Properties | 17 | 0 | 1 | 18 |
| [Domain/obj/Release/net10.0/Domain.GlobalUsings.g.cs](/Domain/obj/Release/net10.0/Domain.GlobalUsings.g.cs) | C# | 7 | 1 | 1 | 9 |
| [Domain/obj/project.assets.json](/Domain/obj/project.assets.json) | JSON | -2 | 0 | 0 | -2 |
| [Infrastructure/DependencyInjection.cs](/Infrastructure/DependencyInjection.cs) | C# | 4 | 0 | 0 | 4 |
| [Infrastructure/Migrations/20260326140820\_InitDb.Designer.cs](/Infrastructure/Migrations/20260326140820_InitDb.Designer.cs) | C# | -482 | -2 | -183 | -667 |
| [Infrastructure/Migrations/20260326140820\_InitDb.cs](/Infrastructure/Migrations/20260326140820_InitDb.cs) | C# | -434 | -3 | -46 | -483 |
| [Infrastructure/Migrations/20260329024907\_updb-1.Designer.cs](/Infrastructure/Migrations/20260329024907_updb-1.Designer.cs) | C# | -491 | -2 | -186 | -679 |
| [Infrastructure/Migrations/20260329024907\_updb-1.cs](/Infrastructure/Migrations/20260329024907_updb-1.cs) | C# | -82 | -3 | -14 | -99 |
| [Infrastructure/Migrations/20260331111353\_updb-2.Designer.cs](/Infrastructure/Migrations/20260331111353_updb-2.Designer.cs) | C# | -568 | -2 | -220 | -790 |
| [Infrastructure/Migrations/20260331111353\_updb-2.cs](/Infrastructure/Migrations/20260331111353_updb-2.cs) | C# | -107 | -3 | -14 | -124 |
| [Infrastructure/Migrations/20260406124651\_updb3.Designer.cs](/Infrastructure/Migrations/20260406124651_updb3.Designer.cs) | C# | -567 | -2 | -220 | -789 |
| [Infrastructure/Migrations/20260406124651\_updb3.cs](/Infrastructure/Migrations/20260406124651_updb3.cs) | C# | -30 | -3 | -4 | -37 |
| [Infrastructure/Migrations/20260406125630\_updb4.Designer.cs](/Infrastructure/Migrations/20260406125630_updb4.Designer.cs) | C# | -567 | -2 | -220 | -789 |
| [Infrastructure/Migrations/20260406125630\_updb4.cs](/Infrastructure/Migrations/20260406125630_updb4.cs) | C# | -29 | -3 | -4 | -36 |
| [Infrastructure/Migrations/20260510120539\_updb-4.Designer.cs](/Infrastructure/Migrations/20260510120539_updb-4.Designer.cs) | C# | -579 | -2 | -226 | -807 |
| [Infrastructure/Migrations/20260510120539\_updb-4.cs](/Infrastructure/Migrations/20260510120539_updb-4.cs) | C# | -86 | -3 | -18 | -107 |
| [Infrastructure/Migrations/20260510121353\_updb5.Designer.cs](/Infrastructure/Migrations/20260510121353_updb5.Designer.cs) | C# | -580 | -2 | -226 | -808 |
| [Infrastructure/Migrations/20260510121353\_updb5.cs](/Infrastructure/Migrations/20260510121353_updb5.cs) | C# | -86 | -3 | -18 | -107 |
| [Infrastructure/Migrations/20260510130850\_updb6.Designer.cs](/Infrastructure/Migrations/20260510130850_updb6.Designer.cs) | C# | -582 | -2 | -227 | -811 |
| [Infrastructure/Migrations/20260510130850\_updb6.cs](/Infrastructure/Migrations/20260510130850_updb6.cs) | C# | -22 | -3 | -4 | -29 |
| [Infrastructure/Migrations/20260518122331\_updb7.Designer.cs](/Infrastructure/Migrations/20260518122331_updb7.Designer.cs) | C# | -1,079 | -2 | -440 | -1,521 |
| [Infrastructure/Migrations/20260518122331\_updb7.cs](/Infrastructure/Migrations/20260518122331_updb7.cs) | C# | -554 | -3 | -68 | -625 |
| [Infrastructure/Migrations/20260518123622\_updb8.Designer.cs](/Infrastructure/Migrations/20260518123622_updb8.Designer.cs) | C# | -1,126 | -2 | -459 | -1,587 |
| [Infrastructure/Migrations/20260518123622\_updb8.cs](/Infrastructure/Migrations/20260518123622_updb8.cs) | C# | -66 | -3 | -9 | -78 |
| [Infrastructure/Migrations/20260518145637\_FixRelationshipStatus.Designer.cs](/Infrastructure/Migrations/20260518145637_FixRelationshipStatus.Designer.cs) | C# | -1,123 | -2 | -458 | -1,583 |
| [Infrastructure/Migrations/20260518145637\_FixRelationshipStatus.cs](/Infrastructure/Migrations/20260518145637_FixRelationshipStatus.cs) | C# | -46 | -3 | -6 | -55 |
| [Infrastructure/Migrations/20260521144618\_updb10.Designer.cs](/Infrastructure/Migrations/20260521144618_updb10.Designer.cs) | C# | -1,123 | -2 | -458 | -1,583 |
| [Infrastructure/Migrations/20260521144618\_updb10.cs](/Infrastructure/Migrations/20260521144618_updb10.cs) | C# | -30 | -3 | -4 | -37 |
| [Infrastructure/Migrations/20260524124929\_updb11.Designer.cs](/Infrastructure/Migrations/20260524124929_updb11.Designer.cs) | C# | -1,287 | -2 | -530 | -1,819 |
| [Infrastructure/Migrations/20260524124929\_updb11.cs](/Infrastructure/Migrations/20260524124929_updb11.cs) | C# | -223 | -3 | -29 | -255 |
| [Infrastructure/Migrations/20260527093944\_updb12.Designer.cs](/Infrastructure/Migrations/20260527093944_updb12.Designer.cs) | C# | -1,286 | -2 | -530 | -1,818 |
| [Infrastructure/Migrations/20260527093944\_updb12.cs](/Infrastructure/Migrations/20260527093944_updb12.cs) | C# | -32 | -3 | -4 | -39 |
| [Infrastructure/Migrations/20260528071505\_updb13.Designer.cs](/Infrastructure/Migrations/20260528071505_updb13.Designer.cs) | C# | -1,332 | -2 | -549 | -1,883 |
| [Infrastructure/Migrations/20260528071505\_updb13.cs](/Infrastructure/Migrations/20260528071505_updb13.cs) | C# | -177 | -3 | -22 | -202 |
| [Infrastructure/Migrations/20260528120902\_updb14.Designer.cs](/Infrastructure/Migrations/20260528120902_updb14.Designer.cs) | C# | -1,326 | -2 | -546 | -1,874 |
| [Infrastructure/Migrations/20260528120902\_updb14.cs](/Infrastructure/Migrations/20260528120902_updb14.cs) | C# | -14 | -3 | -6 | -23 |
| [Infrastructure/Migrations/20260528121828\_updb15.Designer.cs](/Infrastructure/Migrations/20260528121828_updb15.Designer.cs) | C# | -1,325 | -2 | -545 | -1,872 |
| [Infrastructure/Migrations/20260528121828\_updb15.cs](/Infrastructure/Migrations/20260528121828_updb15.cs) | C# | -34 | -3 | -6 | -43 |
| [Infrastructure/Migrations/20260529071128\_updb16.Designer.cs](/Infrastructure/Migrations/20260529071128_updb16.Designer.cs) | C# | -1,239 | -2 | -507 | -1,748 |
| [Infrastructure/Migrations/20260529071128\_updb16.cs](/Infrastructure/Migrations/20260529071128_updb16.cs) | C# | -106 | -3 | -12 | -121 |
| [Infrastructure/Migrations/20260531055803\_AddGroupJoinApprovalSettingAndReportedGroupContent.Designer.cs](/Infrastructure/Migrations/20260531055803_AddGroupJoinApprovalSettingAndReportedGroupContent.Designer.cs) | C# | -1,364 | -2 | -554 | -1,920 |
| [Infrastructure/Migrations/20260531055803\_AddGroupJoinApprovalSettingAndReportedGroupContent.cs](/Infrastructure/Migrations/20260531055803_AddGroupJoinApprovalSettingAndReportedGroupContent.cs) | C# | -156 | -3 | -21 | -180 |
| [Infrastructure/Migrations/20260531065118\_AddGroupPostHiddenFields.Designer.cs](/Infrastructure/Migrations/20260531065118_AddGroupPostHiddenFields.Designer.cs) | C# | -1,373 | -2 | -557 | -1,932 |
| [Infrastructure/Migrations/20260531065118\_AddGroupPostHiddenFields.cs](/Infrastructure/Migrations/20260531065118_AddGroupPostHiddenFields.cs) | C# | -41 | -3 | -8 | -52 |
| [Infrastructure/Migrations/20260531094629\_updb17.Designer.cs](/Infrastructure/Migrations/20260531094629_updb17.Designer.cs) | C# | -1,373 | -2 | -557 | -1,932 |
| [Infrastructure/Migrations/20260531094629\_updb17.cs](/Infrastructure/Migrations/20260531094629_updb17.cs) | C# | -14 | -3 | -6 | -23 |
| [Infrastructure/Migrations/20260604120513\_updb18.Designer.cs](/Infrastructure/Migrations/20260604120513_updb18.Designer.cs) | C# | -1,373 | -2 | -557 | -1,932 |
| [Infrastructure/Migrations/20260604120513\_updb18.cs](/Infrastructure/Migrations/20260604120513_updb18.cs) | C# | -32 | -3 | -6 | -41 |
| [Infrastructure/Migrations/20260605095716\_updb19.Designer.cs](/Infrastructure/Migrations/20260605095716_updb19.Designer.cs) | C# | -1,373 | -2 | -557 | -1,932 |
| [Infrastructure/Migrations/20260605095716\_updb19.cs](/Infrastructure/Migrations/20260605095716_updb19.cs) | C# | -26 | -3 | -6 | -35 |
| [Infrastructure/Migrations/20260605145532\_updb20.Designer.cs](/Infrastructure/Migrations/20260605145532_updb20.Designer.cs) | C# | -1,520 | -2 | -618 | -2,140 |
| [Infrastructure/Migrations/20260605145532\_updb20.cs](/Infrastructure/Migrations/20260605145532_updb20.cs) | C# | -542 | -3 | -107 | -652 |
| [Infrastructure/Migrations/20260606090017\_updb21.Designer.cs](/Infrastructure/Migrations/20260606090017_updb21.Designer.cs) | C# | -1,564 | -2 | -636 | -2,202 |
| [Infrastructure/Migrations/20260606090017\_updb21.cs](/Infrastructure/Migrations/20260606090017_updb21.cs) | C# | -74 | -3 | -10 | -87 |
| [Infrastructure/Migrations/20260606090018\_updb22.Designer.cs](/Infrastructure/Migrations/20260606090018_updb22.Designer.cs) | C# | -122 | -2 | -44 | -168 |
| [Infrastructure/Migrations/20260606090018\_updb22.cs](/Infrastructure/Migrations/20260606090018_updb22.cs) | C# | -75 | -5 | -11 | -91 |
| [Infrastructure/Migrations/20260607014653\_updb23.Designer.cs](/Infrastructure/Migrations/20260607014653_updb23.Designer.cs) | C# | -1,623 | -2 | -660 | -2,285 |
| [Infrastructure/Migrations/20260607014653\_updb23.cs](/Infrastructure/Migrations/20260607014653_updb23.cs) | C# | -851 | -3 | -176 | -1,030 |
| [Infrastructure/Migrations/20260607015733\_updb24.Designer.cs](/Infrastructure/Migrations/20260607015733_updb24.Designer.cs) | C# | -1,666 | -2 | -677 | -2,345 |
| [Infrastructure/Migrations/20260607015733\_updb24.cs](/Infrastructure/Migrations/20260607015733_updb24.cs) | C# | -55 | -3 | -6 | -64 |
| [Infrastructure/Migrations/20260610155731\_init.Designer.cs](/Infrastructure/Migrations/20260610155731_init.Designer.cs) | C# | 1,619 | 2 | 658 | 2,279 |
| [Infrastructure/Migrations/20260610155731\_init.cs](/Infrastructure/Migrations/20260610155731_init.cs) | C# | 1,445 | 3 | 145 | 1,593 |
| [Infrastructure/Migrations/20260610155828\_updb1.Designer.cs](/Infrastructure/Migrations/20260610155828_updb1.Designer.cs) | C# | 1,619 | 2 | 658 | 2,279 |
| [Infrastructure/Migrations/20260610155828\_updb1.cs](/Infrastructure/Migrations/20260610155828_updb1.cs) | C# | 68 | 8 | 12 | 88 |
| [Infrastructure/Migrations/20260610160827\_updb2.Designer.cs](/Infrastructure/Migrations/20260610160827_updb2.Designer.cs) | C# | 1,619 | 2 | 658 | 2,279 |
| [Infrastructure/Migrations/20260610160827\_updb2.cs](/Infrastructure/Migrations/20260610160827_updb2.cs) | C# | 14 | 3 | 6 | 23 |
| [Infrastructure/Migrations/20260611032437\_updb3.Designer.cs](/Infrastructure/Migrations/20260611032437_updb3.Designer.cs) | C# | 1,655 | 2 | 673 | 2,330 |
| [Infrastructure/Migrations/20260611032437\_updb3.cs](/Infrastructure/Migrations/20260611032437_updb3.cs) | C# | 72 | 3 | 10 | 85 |
| [Infrastructure/Migrations/20260612151624\_updb4.Designer.cs](/Infrastructure/Migrations/20260612151624_updb4.Designer.cs) | C# | 1,658 | 2 | 674 | 2,334 |
| [Infrastructure/Migrations/20260612151624\_updb4.cs](/Infrastructure/Migrations/20260612151624_updb4.cs) | C# | 23 | 3 | 4 | 30 |
| [Infrastructure/Migrations/20260618015702\_addsystemmessage.Designer.cs](/Infrastructure/Migrations/20260618015702_addsystemmessage.Designer.cs) | C# | 1,665 | 2 | 676 | 2,343 |
| [Infrastructure/Migrations/20260618015702\_addsystemmessage.cs](/Infrastructure/Migrations/20260618015702_addsystemmessage.cs) | C# | 47 | 3 | 8 | 58 |
| [Infrastructure/Migrations/20260710145033\_updatenotification.Designer.cs](/Infrastructure/Migrations/20260710145033_updatenotification.Designer.cs) | C# | 1,711 | 2 | 698 | 2,411 |
| [Infrastructure/Migrations/20260710145033\_updatenotification.cs](/Infrastructure/Migrations/20260710145033_updatenotification.cs) | C# | 150 | 3 | 39 | 192 |
| [Infrastructure/Migrations/20260715080740\_AddReelSearchVector.Designer.cs](/Infrastructure/Migrations/20260715080740_AddReelSearchVector.Designer.cs) | C# | 1,714 | 2 | 699 | 2,415 |
| [Infrastructure/Migrations/20260715080740\_AddReelSearchVector.cs](/Infrastructure/Migrations/20260715080740_AddReelSearchVector.cs) | C# | 25 | 3 | 5 | 33 |
| [Infrastructure/Migrations/AppDbContextModelSnapshot.cs](/Infrastructure/Migrations/AppDbContextModelSnapshot.cs) | C# | 48 | 0 | 22 | 70 |
| [Infrastructure/Persistence/Configurations/ConversationConfiguration.cs](/Infrastructure/Persistence/Configurations/ConversationConfiguration.cs) | C# | 4 | 0 | 2 | 6 |
| [Infrastructure/Persistence/Configurations/ConversationMemberConfiguration.cs](/Infrastructure/Persistence/Configurations/ConversationMemberConfiguration.cs) | C# | -7 | -1 | -2 | -10 |
| [Infrastructure/Persistence/Configurations/GroupConfiguration.cs](/Infrastructure/Persistence/Configurations/GroupConfiguration.cs) | C# | 1 | 0 | 0 | 1 |
| [Infrastructure/Persistence/Configurations/MemberMessageConfiguration.cs](/Infrastructure/Persistence/Configurations/MemberMessageConfiguration.cs) | C# | -14 | 0 | -4 | -18 |
| [Infrastructure/Persistence/Configurations/MessageConfiguration.cs](/Infrastructure/Persistence/Configurations/MessageConfiguration.cs) | C# | -1 | 2 | 1 | 2 |
| [Infrastructure/Persistence/Configurations/NotificationConfiguration.cs](/Infrastructure/Persistence/Configurations/NotificationConfiguration.cs) | C# | 17 | 4 | 4 | 25 |
| [Infrastructure/Persistence/Configurations/ReactionConfiguration.cs](/Infrastructure/Persistence/Configurations/ReactionConfiguration.cs) | C# | 28 | 0 | 9 | 37 |
| [Infrastructure/Persistence/Configurations/ReelConfiguration.cs](/Infrastructure/Persistence/Configurations/ReelConfiguration.cs) | C# | 1 | 1 | 1 | 3 |
| [Infrastructure/Persistence/Configurations/UserConfiguration.cs](/Infrastructure/Persistence/Configurations/UserConfiguration.cs) | C# | 6 | 4 | 3 | 13 |
| [Infrastructure/Persistence/Contexts/RoleSeeder.cs](/Infrastructure/Persistence/Contexts/RoleSeeder.cs) | C# | 101 | 4 | 13 | 118 |
| [Infrastructure/Persistence/Repositories/BirthdayRepository.cs](/Infrastructure/Persistence/Repositories/BirthdayRepository.cs) | C# | 98 | 4 | 22 | 124 |
| [Infrastructure/Persistence/Repositories/ConversationRepository.cs](/Infrastructure/Persistence/Repositories/ConversationRepository.cs) | C# | 117 | 2 | 21 | 140 |
| [Infrastructure/Persistence/Repositories/FeedRepository.cs](/Infrastructure/Persistence/Repositories/FeedRepository.cs) | C# | -19 | 8 | 9 | -2 |
| [Infrastructure/Persistence/Repositories/FriendRequestRepository.cs](/Infrastructure/Persistence/Repositories/FriendRequestRepository.cs) | C# | 7 | 0 | 1 | 8 |
| [Infrastructure/Persistence/Repositories/GroupListingRepository.cs](/Infrastructure/Persistence/Repositories/GroupListingRepository.cs) | C# | -89 | -4 | -19 | -112 |
| [Infrastructure/Persistence/Repositories/GroupRepository.cs](/Infrastructure/Persistence/Repositories/GroupRepository.cs) | C# | 57 | 7 | 11 | 75 |
| [Infrastructure/Persistence/Repositories/MessageRepository.cs](/Infrastructure/Persistence/Repositories/MessageRepository.cs) | C# | 94 | 4 | 11 | 109 |
| [Infrastructure/Persistence/Repositories/NotificationRepository.cs](/Infrastructure/Persistence/Repositories/NotificationRepository.cs) | C# | 56 | 0 | 13 | 69 |
| [Infrastructure/Persistence/Repositories/PostRepository.cs](/Infrastructure/Persistence/Repositories/PostRepository.cs) | C# | 211 | 17 | 32 | 260 |
| [Infrastructure/Persistence/Repositories/ReelRepository.cs](/Infrastructure/Persistence/Repositories/ReelRepository.cs) | C# | 72 | 1 | 12 | 85 |
| [Infrastructure/Persistence/Repositories/UserRepository.cs](/Infrastructure/Persistence/Repositories/UserRepository.cs) | C# | 52 | 2 | 9 | 63 |
| [Infrastructure/Security/BlindIndexService.cs](/Infrastructure/Security/BlindIndexService.cs) | C# | -35 | -1 | -10 | -46 |
| [Infrastructure/SignalR/CallHub.cs](/Infrastructure/SignalR/CallHub.cs) | C# | 88 | 5 | 17 | 110 |
| [Infrastructure/SignalR/CallHubNotifier.cs](/Infrastructure/SignalR/CallHubNotifier.cs) | C# | 83 | 0 | 9 | 92 |
| [Infrastructure/SignalR/ChatHub.cs](/Infrastructure/SignalR/ChatHub.cs) | C# | 10 | -13 | -7 | -10 |
| [Infrastructure/SignalR/ChatHubNotifier.cs](/Infrastructure/SignalR/ChatHubNotifier.cs) | C# | 93 | 0 | 11 | 104 |
| [Infrastructure/SignalR/NotificationHub.cs](/Infrastructure/SignalR/NotificationHub.cs) | C# | 24 | 5 | 4 | 33 |
| [Infrastructure/SignalR/NotificationHubNotifier.cs](/Infrastructure/SignalR/NotificationHubNotifier.cs) | C# | 20 | 6 | 4 | 30 |
| [Infrastructure/SignalR/PresenceTracker.cs](/Infrastructure/SignalR/PresenceTracker.cs) | C# | 2 | -9 | -2 | -9 |
| [Infrastructure/obj/Infrastructure.csproj.nuget.dgspec.json](/Infrastructure/obj/Infrastructure.csproj.nuget.dgspec.json) | JSON | -6 | 0 | 0 | -6 |
| [Infrastructure/obj/Release/net10.0/.NETCoreApp,Version=v10.0.AssemblyAttributes.cs](/Infrastructure/obj/Release/net10.0/.NETCoreApp,Version=v10.0.AssemblyAttributes.cs) | C# | 3 | 1 | 1 | 5 |
| [Infrastructure/obj/Release/net10.0/Infrastructure.AssemblyInfo.cs](/Infrastructure/obj/Release/net10.0/Infrastructure.AssemblyInfo.cs) | C# | 9 | 10 | 5 | 24 |
| [Infrastructure/obj/Release/net10.0/Infrastructure.GeneratedMSBuildEditorConfig.editorconfig](/Infrastructure/obj/Release/net10.0/Infrastructure.GeneratedMSBuildEditorConfig.editorconfig) | Properties | 25 | 0 | 1 | 26 |
| [Infrastructure/obj/Release/net10.0/Infrastructure.GlobalUsings.g.cs](/Infrastructure/obj/Release/net10.0/Infrastructure.GlobalUsings.g.cs) | C# | 7 | 1 | 1 | 9 |
| [Infrastructure/obj/project.assets.json](/Infrastructure/obj/project.assets.json) | JSON | -2 | 0 | 0 | -2 |
| [PROJECT\_DESCRIPTION.md](/PROJECT_DESCRIPTION.md) | Markdown | 148 | 0 | 27 | 175 |
| [Presentation/Contracts/Conversation/AddMemberToConversationRequest.cs](/Presentation/Contracts/Conversation/AddMemberToConversationRequest.cs) | C# | 3 | 0 | 2 | 5 |
| [Presentation/Contracts/Conversation/UpdateConversationRequest.cs](/Presentation/Contracts/Conversation/UpdateConversationRequest.cs) | C# | 6 | 0 | 2 | 8 |
| [Presentation/Contracts/Message/MarkMessagesAsSeenRequest.cs](/Presentation/Contracts/Message/MarkMessagesAsSeenRequest.cs) | C# | 2 | 0 | 2 | 4 |
| [Presentation/Contracts/Message/MessagesAroundResponse.cs](/Presentation/Contracts/Message/MessagesAroundResponse.cs) | C# | 7 | 0 | 3 | 10 |
| [Presentation/Contracts/Message/ReactToMessageRequest.cs](/Presentation/Contracts/Message/ReactToMessageRequest.cs) | C# | 2 | 0 | 2 | 4 |
| [Presentation/Contracts/Message/SendMessageRequest.cs](/Presentation/Contracts/Message/SendMessageRequest.cs) | C# | 0 | 0 | -2 | -2 |
| [Presentation/Contracts/Message/UpdateMessageRequest.cs](/Presentation/Contracts/Message/UpdateMessageRequest.cs) | C# | -3 | 0 | -2 | -5 |
| [Presentation/Contracts/Post/UpdatePostRequest.cs](/Presentation/Contracts/Post/UpdatePostRequest.cs) | C# | 1 | 0 | 0 | 1 |
| [Presentation/Contracts/Post/UpdatePostWithAttachmentsRequest.cs](/Presentation/Contracts/Post/UpdatePostWithAttachmentsRequest.cs) | C# | 14 | 0 | 2 | 16 |
| [Presentation/Contracts/Reel/CreateReelCommentRequest.cs](/Presentation/Contracts/Reel/CreateReelCommentRequest.cs) | C# | 6 | 0 | 2 | 8 |
| [Presentation/Contracts/User/GetOnlineStateRequest.cs](/Presentation/Contracts/User/GetOnlineStateRequest.cs) | C# | 2 | 0 | 2 | 4 |
| [Presentation/Controllers/AdminController.cs](/Presentation/Controllers/AdminController.cs) | C# | 189 | 18 | 30 | 237 |
| [Presentation/Controllers/ConversationController.cs](/Presentation/Controllers/ConversationController.cs) | C# | 172 | 12 | 50 | 234 |
| [Presentation/Controllers/GroupController.cs](/Presentation/Controllers/GroupController.cs) | C# | -15 | 0 | -3 | -18 |
| [Presentation/Controllers/MessageController.cs](/Presentation/Controllers/MessageController.cs) | C# | 167 | -2 | 39 | 204 |
| [Presentation/Controllers/NotificationController.cs](/Presentation/Controllers/NotificationController.cs) | C# | 36 | 0 | 5 | 41 |
| [Presentation/Controllers/PostController.cs](/Presentation/Controllers/PostController.cs) | C# | 72 | 0 | 12 | 84 |
| [Presentation/Controllers/ReelController.cs](/Presentation/Controllers/ReelController.cs) | C# | 64 | 0 | 13 | 77 |
| [Presentation/Controllers/StoryController.cs](/Presentation/Controllers/StoryController.cs) | C# | 38 | 0 | 10 | 48 |
| [Presentation/Controllers/TestController.cs](/Presentation/Controllers/TestController.cs) | C# | 25 | 0 | 1 | 26 |
| [Presentation/Controllers/UserController.cs](/Presentation/Controllers/UserController.cs) | C# | 68 | 6 | 14 | 88 |
| [Presentation/Presentation.csproj](/Presentation/Presentation.csproj) | XML | 4 | 0 | 1 | 5 |
| [Presentation/obj/Presentation.csproj.nuget.dgspec.json](/Presentation/obj/Presentation.csproj.nuget.dgspec.json) | JSON | 135 | 0 | 0 | 135 |
| [Presentation/obj/Presentation.csproj.nuget.g.targets](/Presentation/obj/Presentation.csproj.nuget.g.targets) | XML | -6 | 0 | 0 | -6 |
| [Presentation/obj/Release/net10.0/.NETCoreApp,Version=v10.0.AssemblyAttributes.cs](/Presentation/obj/Release/net10.0/.NETCoreApp,Version=v10.0.AssemblyAttributes.cs) | C# | 3 | 1 | 1 | 5 |
| [Presentation/obj/Release/net10.0/Presentation.AssemblyInfo.cs](/Presentation/obj/Release/net10.0/Presentation.AssemblyInfo.cs) | C# | 9 | 10 | 5 | 24 |
| [Presentation/obj/Release/net10.0/Presentation.GeneratedMSBuildEditorConfig.editorconfig](/Presentation/obj/Release/net10.0/Presentation.GeneratedMSBuildEditorConfig.editorconfig) | Properties | 17 | 0 | 1 | 18 |
| [Presentation/obj/Release/net10.0/Presentation.GlobalUsings.g.cs](/Presentation/obj/Release/net10.0/Presentation.GlobalUsings.g.cs) | C# | 7 | 1 | 1 | 9 |
| [Presentation/obj/project.assets.json](/Presentation/obj/project.assets.json) | JSON | -878 | 0 | 0 | -878 |
| [ReactWeb/.env](/ReactWeb/.env) | Dotenv | 1 | 0 | 0 | 1 |
| [ReactWeb/package-lock.json](/ReactWeb/package-lock.json) | JSON | 174 | 0 | 0 | 174 |
| [ReactWeb/package.json](/ReactWeb/package.json) | JSON | 1 | 0 | 0 | 1 |
| [ReactWeb/src/App.jsx](/ReactWeb/src/App.jsx) | JavaScript JSX | 36 | 1 | 1 | 38 |
| [ReactWeb/src/apis/axios.js](/ReactWeb/src/apis/axios.js) | JavaScript | 14 | 0 | 0 | 14 |
| [ReactWeb/src/apis/birthdayApi.js](/ReactWeb/src/apis/birthdayApi.js) | JavaScript | 9 | 0 | 3 | 12 |
| [ReactWeb/src/apis/conversationApi.js](/ReactWeb/src/apis/conversationApi.js) | JavaScript | 50 | 44 | 11 | 105 |
| [ReactWeb/src/apis/friendApi.js](/ReactWeb/src/apis/friendApi.js) | JavaScript | 4 | 6 | 1 | 11 |
| [ReactWeb/src/apis/messageApi.js](/ReactWeb/src/apis/messageApi.js) | JavaScript | 36 | 32 | 6 | 74 |
| [ReactWeb/src/apis/notificationApi.js](/ReactWeb/src/apis/notificationApi.js) | JavaScript | 15 | 0 | 3 | 18 |
| [ReactWeb/src/apis/postApi.js](/ReactWeb/src/apis/postApi.js) | JavaScript | 6 | 5 | 1 | 12 |
| [ReactWeb/src/apis/reelApi.js](/ReactWeb/src/apis/reelApi.js) | JavaScript | 18 | 0 | 3 | 21 |
| [ReactWeb/src/apis/searchApi.js](/ReactWeb/src/apis/searchApi.js) | JavaScript | 26 | 12 | 6 | 44 |
| [ReactWeb/src/apis/storyApi.js](/ReactWeb/src/apis/storyApi.js) | JavaScript | 16 | 0 | 4 | 20 |
| [ReactWeb/src/components/Common/ImageLightbox.jsx](/ReactWeb/src/components/Common/ImageLightbox.jsx) | JavaScript JSX | 87 | 10 | 7 | 104 |
| [ReactWeb/src/components/Feed/HomeReelsRail.jsx](/ReactWeb/src/components/Feed/HomeReelsRail.jsx) | JavaScript JSX | 27 | 0 | 1 | 28 |
| [ReactWeb/src/components/Feed/MediaGallery.jsx](/ReactWeb/src/components/Feed/MediaGallery.jsx) | JavaScript JSX | 47 | 5 | 13 | 65 |
| [ReactWeb/src/components/Feed/PostCard.jsx](/ReactWeb/src/components/Feed/PostCard.jsx) | JavaScript JSX | 83 | 4 | 3 | 90 |
| [ReactWeb/src/components/Feed/PostModal.jsx](/ReactWeb/src/components/Feed/PostModal.jsx) | JavaScript JSX | 50 | 1 | 4 | 55 |
| [ReactWeb/src/components/Feed/ShareModal.jsx](/ReactWeb/src/components/Feed/ShareModal.jsx) | JavaScript JSX | 183 | 14 | 21 | 218 |
| [ReactWeb/src/components/Feed/StoryBar.jsx](/ReactWeb/src/components/Feed/StoryBar.jsx) | JavaScript JSX | 39 | 10 | 3 | 52 |
| [ReactWeb/src/components/Feed/StoryBarRing.jsx](/ReactWeb/src/components/Feed/StoryBarRing.jsx) | JavaScript JSX | 101 | 15 | 10 | 126 |
| [ReactWeb/src/components/Feed/UpdatingPostModal.jsx](/ReactWeb/src/components/Feed/UpdatingPostModal.jsx) | JavaScript JSX | 476 | 14 | 38 | 528 |
| [ReactWeb/src/components/Messenger/ActiveCallUI.jsx](/ReactWeb/src/components/Messenger/ActiveCallUI.jsx) | JavaScript JSX | 242 | 30 | 22 | 294 |
| [ReactWeb/src/components/Messenger/AddMemberModal.jsx](/ReactWeb/src/components/Messenger/AddMemberModal.jsx) | JavaScript JSX | 183 | 5 | 17 | 205 |
| [ReactWeb/src/components/Messenger/BlockedBanner.jsx](/ReactWeb/src/components/Messenger/BlockedBanner.jsx) | JavaScript JSX | 40 | 10 | 4 | 54 |
| [ReactWeb/src/components/Messenger/ChangeEmojiModal.jsx](/ReactWeb/src/components/Messenger/ChangeEmojiModal.jsx) | JavaScript JSX | 98 | 4 | 8 | 110 |
| [ReactWeb/src/components/Messenger/ChangeNameModal.jsx](/ReactWeb/src/components/Messenger/ChangeNameModal.jsx) | JavaScript JSX | 105 | 3 | 7 | 115 |
| [ReactWeb/src/components/Messenger/ChangeThemeModal.jsx](/ReactWeb/src/components/Messenger/ChangeThemeModal.jsx) | JavaScript JSX | 105 | 6 | 6 | 117 |
| [ReactWeb/src/components/Messenger/ChatInfoDirect.jsx](/ReactWeb/src/components/Messenger/ChatInfoDirect.jsx) | JavaScript JSX | 126 | -8 | 17 | 135 |
| [ReactWeb/src/components/Messenger/ChatInfoGroup.jsx](/ReactWeb/src/components/Messenger/ChatInfoGroup.jsx) | JavaScript JSX | 307 | 3 | 30 | 340 |
| [ReactWeb/src/components/Messenger/ChatWindow.jsx](/ReactWeb/src/components/Messenger/ChatWindow.jsx) | JavaScript JSX | 0 | 0 | -1 | -1 |
| [ReactWeb/src/components/Messenger/ConfirmModal.jsx](/ReactWeb/src/components/Messenger/ConfirmModal.jsx) | JavaScript JSX | 49 | 13 | 3 | 65 |
| [ReactWeb/src/components/Messenger/ConversationList.jsx](/ReactWeb/src/components/Messenger/ConversationList.jsx) | JavaScript JSX | 0 | 0 | -1 | -1 |
| [ReactWeb/src/components/Messenger/CreateGroupModal.jsx](/ReactWeb/src/components/Messenger/CreateGroupModal.jsx) | JavaScript JSX | 187 | 9 | 18 | 214 |
| [ReactWeb/src/components/Messenger/IncomingCallModal.jsx](/ReactWeb/src/components/Messenger/IncomingCallModal.jsx) | JavaScript JSX | 93 | 5 | 12 | 110 |
| [ReactWeb/src/components/Messenger/MessengerFull.jsx](/ReactWeb/src/components/Messenger/MessengerFull.jsx) | JavaScript JSX | 1,431 | 107 | 122 | 1,660 |
| [ReactWeb/src/components/Messenger/MessengerMini.jsx](/ReactWeb/src/components/Messenger/MessengerMini.jsx) | JavaScript JSX | -252 | -10 | -17 | -279 |
| [ReactWeb/src/components/Messenger/SharedMediaModal.jsx](/ReactWeb/src/components/Messenger/SharedMediaModal.jsx) | JavaScript JSX | 300 | 16 | 30 | 346 |
| [ReactWeb/src/components/Messenger/ViewPinnedMessagesModal.jsx](/ReactWeb/src/components/Messenger/ViewPinnedMessagesModal.jsx) | JavaScript JSX | 201 | 13 | 20 | 234 |
| [ReactWeb/src/components/Messenger/VoiceRecorder.jsx](/ReactWeb/src/components/Messenger/VoiceRecorder.jsx) | JavaScript JSX | 348 | 22 | 41 | 411 |
| [ReactWeb/src/components/Navbar/Navbar.jsx](/ReactWeb/src/components/Navbar/Navbar.jsx) | JavaScript JSX | 36 | -1 | 1 | 36 |
| [ReactWeb/src/components/Navbar/NotificationDropdown.jsx](/ReactWeb/src/components/Navbar/NotificationDropdown.jsx) | JavaScript JSX | 184 | 7 | 17 | 208 |
| [ReactWeb/src/components/Profile/ProfileReelsTab.jsx](/ReactWeb/src/components/Profile/ProfileReelsTab.jsx) | JavaScript JSX | -56 | -1 | -4 | -61 |
| [ReactWeb/src/components/Reels/ReelCommentModal.jsx](/ReactWeb/src/components/Reels/ReelCommentModal.jsx) | JavaScript JSX | 143 | 7 | 12 | 162 |
| [ReactWeb/src/components/Reels/ReelView.jsx](/ReactWeb/src/components/Reels/ReelView.jsx) | JavaScript JSX | 124 | 20 | 12 | 156 |
| [ReactWeb/src/components/RightSidebar/RightSidebar.jsx](/ReactWeb/src/components/RightSidebar/RightSidebar.jsx) | JavaScript JSX | 130 | 17 | 14 | 161 |
| [ReactWeb/src/components/Sidebar/LeftSidebar.jsx](/ReactWeb/src/components/Sidebar/LeftSidebar.jsx) | JavaScript JSX | -7 | 2 | -1 | -6 |
| [ReactWeb/src/components/Story/ProfileStoryRing.jsx](/ReactWeb/src/components/Story/ProfileStoryRing.jsx) | JavaScript JSX | 122 | 28 | 6 | 156 |
| [ReactWeb/src/components/Story/UserStoryViewer.jsx](/ReactWeb/src/components/Story/UserStoryViewer.jsx) | JavaScript JSX | 138 | 2 | 19 | 159 |
| [ReactWeb/src/components/Story/storyMappers.js](/ReactWeb/src/components/Story/storyMappers.js) | JavaScript | 21 | 0 | 6 | 27 |
| [ReactWeb/src/components/group/GroupAdminInsights.jsx](/ReactWeb/src/components/group/GroupAdminInsights.jsx) | JavaScript JSX | -1 | 0 | 0 | -1 |
| [ReactWeb/src/contexts/CallContext.jsx](/ReactWeb/src/contexts/CallContext.jsx) | JavaScript JSX | 465 | 29 | 68 | 562 |
| [ReactWeb/src/contexts/ChatContext.jsx](/ReactWeb/src/contexts/ChatContext.jsx) | JavaScript JSX | 927 | 65 | 102 | 1,094 |
| [ReactWeb/src/contexts/NotificationContext.jsx](/ReactWeb/src/contexts/NotificationContext.jsx) | JavaScript JSX | 187 | 12 | 29 | 228 |
| [ReactWeb/src/contexts/ReelsContext.jsx](/ReactWeb/src/contexts/ReelsContext.jsx) | JavaScript JSX | 23 | 0 | 1 | 24 |
| [ReactWeb/src/contexts/SearchEngineContext.jsx](/ReactWeb/src/contexts/SearchEngineContext.jsx) | JavaScript JSX | 143 | 7 | 26 | 176 |
| [ReactWeb/src/contexts/authContext.jsx](/ReactWeb/src/contexts/authContext.jsx) | JavaScript JSX | -1 | 0 | 0 | -1 |
| [ReactWeb/src/contexts/conversationContext.jsx](/ReactWeb/src/contexts/conversationContext.jsx) | JavaScript JSX | -84 | -11 | -8 | -103 |
| [ReactWeb/src/contexts/signalRContext.jsx](/ReactWeb/src/contexts/signalRContext.jsx) | JavaScript JSX | -49 | -3 | -9 | -61 |
| [ReactWeb/src/data/chatThemes.js](/ReactWeb/src/data/chatThemes.js) | JavaScript | 192 | 0 | 3 | 195 |
| [ReactWeb/src/data/groupMockData.js](/ReactWeb/src/data/groupMockData.js) | JavaScript | -1 | 0 | 0 | -1 |
| [ReactWeb/src/data/searchMockData.js](/ReactWeb/src/data/searchMockData.js) | JavaScript | 90 | 0 | 0 | 90 |
| [ReactWeb/src/hooks/useBirthdays.js](/ReactWeb/src/hooks/useBirthdays.js) | JavaScript | 51 | 0 | 9 | 60 |
| [ReactWeb/src/hooks/useChat.jsx](/ReactWeb/src/hooks/useChat.jsx) | JavaScript JSX | 0 | -3 | 0 | -3 |
| [ReactWeb/src/hooks/useContacts.js](/ReactWeb/src/hooks/useContacts.js) | JavaScript | 128 | 22 | 20 | 170 |
| [ReactWeb/src/hooks/useHomeReels.js](/ReactWeb/src/hooks/useHomeReels.js) | JavaScript | 25 | 0 | 5 | 30 |
| [ReactWeb/src/hooks/useReelComments.js](/ReactWeb/src/hooks/useReelComments.js) | JavaScript | 160 | 3 | 15 | 178 |
| [ReactWeb/src/hooks/useSavedPosts.js](/ReactWeb/src/hooks/useSavedPosts.js) | JavaScript | 114 | 0 | 15 | 129 |
| [ReactWeb/src/hooks/useUserPosts.js](/ReactWeb/src/hooks/useUserPosts.js) | JavaScript | 2 | 0 | -2 | 0 |
| [ReactWeb/src/main.jsx](/ReactWeb/src/main.jsx) | JavaScript JSX | 7 | 0 | 1 | 8 |
| [ReactWeb/src/pages/BirthdaysPage.jsx](/ReactWeb/src/pages/BirthdaysPage.jsx) | JavaScript JSX | -58 | 0 | -7 | -65 |
| [ReactWeb/src/pages/CreateStoryPage.jsx](/ReactWeb/src/pages/CreateStoryPage.jsx) | JavaScript JSX | 14 | 0 | 0 | 14 |
| [ReactWeb/src/pages/FriendsPage.jsx](/ReactWeb/src/pages/FriendsPage.jsx) | JavaScript JSX | 0 | 0 | -1 | -1 |
| [ReactWeb/src/pages/HomePage.jsx](/ReactWeb/src/pages/HomePage.jsx) | JavaScript JSX | -19 | 0 | -3 | -22 |
| [ReactWeb/src/pages/MessengerPage.jsx](/ReactWeb/src/pages/MessengerPage.jsx) | JavaScript JSX | 9 | -1 | 2 | 10 |
| [ReactWeb/src/pages/NotificationsPage.jsx](/ReactWeb/src/pages/NotificationsPage.jsx) | JavaScript JSX | 206 | 7 | 22 | 235 |
| [ReactWeb/src/pages/PostDetailPage.jsx](/ReactWeb/src/pages/PostDetailPage.jsx) | JavaScript JSX | 470 | 7 | 42 | 519 |
| [ReactWeb/src/pages/ProfilePage.jsx](/ReactWeb/src/pages/ProfilePage.jsx) | JavaScript JSX | -46 | -1 | -8 | -55 |
| [ReactWeb/src/pages/ReelsPage.jsx](/ReactWeb/src/pages/ReelsPage.jsx) | JavaScript JSX | 30 | 8 | 3 | 41 |
| [ReactWeb/src/pages/SavedPage.jsx](/ReactWeb/src/pages/SavedPage.jsx) | JavaScript JSX | -146 | 1 | 4 | -141 |
| [ReactWeb/src/pages/SearchPage.jsx](/ReactWeb/src/pages/SearchPage.jsx) | JavaScript JSX | 90 | 2 | 14 | 106 |
| [ReactWeb/src/pages/StoryPage.jsx](/ReactWeb/src/pages/StoryPage.jsx) | JavaScript JSX | 16 | 0 | 2 | 18 |
| [ReactWeb/src/utils/notificationSound.js](/ReactWeb/src/utils/notificationSound.js) | JavaScript | 28 | 0 | 8 | 36 |
| [ReactWeb/src/utils/systemMessage.js](/ReactWeb/src/utils/systemMessage.js) | JavaScript | 52 | 0 | 3 | 55 |
| [Web/FileUploadOperationFilter.cs](/Web/FileUploadOperationFilter.cs) | C# | 28 | 0 | 5 | 33 |
| [Web/Logs/err.log](/Web/Logs/err.log) | log | 0 | 0 | 1 | 1 |
| [Web/Logs/out.log](/Web/Logs/out.log) | log | 29 | 0 | 1 | 30 |
| [Web/Logs/swagger.json](/Web/Logs/swagger.json) | JSON | 18 | 3 | 1 | 22 |
| [Web/Program.cs](/Web/Program.cs) | C# | 53 | 7 | 5 | 65 |
| [Web/Views/Admin/AuditLogs.cshtml](/Web/Views/Admin/AuditLogs.cshtml) | ASP.NET Razor | 440 | 3 | 13 | 456 |
| [Web/Views/Admin/Dashboard.cshtml](/Web/Views/Admin/Dashboard.cshtml) | ASP.NET Razor | 120 | 5 | 14 | 139 |
| [Web/Views/Admin/ForgotPassword.cshtml](/Web/Views/Admin/ForgotPassword.cshtml) | ASP.NET Razor | 43 | 4 | 8 | 55 |
| [Web/Views/Admin/Groups.cshtml](/Web/Views/Admin/Groups.cshtml) | ASP.NET Razor | 231 | 4 | 12 | 247 |
| [Web/Views/Admin/Login.cshtml](/Web/Views/Admin/Login.cshtml) | ASP.NET Razor | 62 | 3 | 7 | 72 |
| [Web/Views/Admin/Moderation.cshtml](/Web/Views/Admin/Moderation.cshtml) | ASP.NET Razor | 429 | 3 | 13 | 445 |
| [Web/Views/Admin/Shared/\_AdminLayout.cshtml](/Web/Views/Admin/Shared/_AdminLayout.cshtml) | ASP.NET Razor | 113 | 4 | 14 | 131 |
| [Web/Views/Admin/Shared/\_LineChart.cshtml](/Web/Views/Admin/Shared/_LineChart.cshtml) | ASP.NET Razor | 137 | 17 | 16 | 170 |
| [Web/Views/Admin/Shared/\_LoginLayout.cshtml](/Web/Views/Admin/Shared/_LoginLayout.cshtml) | ASP.NET Razor | 48 | 3 | 4 | 55 |
| [Web/Views/Admin/Shared/\_StackedBarChart.cshtml](/Web/Views/Admin/Shared/_StackedBarChart.cshtml) | ASP.NET Razor | 152 | 18 | 23 | 193 |
| [Web/Views/Admin/Users.cshtml](/Web/Views/Admin/Users.cshtml) | ASP.NET Razor | 381 | 3 | 13 | 397 |
| [Web/bin/Debug/net10.0/Api.deps.json](/Web/bin/Debug/net10.0/Api.deps.json) | JSON | -298 | 0 | 0 | -298 |
| [Web/bin/Debug/net10.0/Api.runtimeconfig.json](/Web/bin/Debug/net10.0/Api.runtimeconfig.json) | JSON | -20 | 0 | 0 | -20 |
| [Web/bin/Debug/net10.0/Api.staticwebassets.endpoints.json](/Web/bin/Debug/net10.0/Api.staticwebassets.endpoints.json) | JSON | -1 | 0 | 0 | -1 |
| [Web/bin/Debug/net10.0/Logs/swagger.json](/Web/bin/Debug/net10.0/Logs/swagger.json) | JSON | 18 | 3 | 1 | 22 |
| [Web/bin/Debug/net10.0/Web.staticwebassets.runtime.json](/Web/bin/Debug/net10.0/Web.staticwebassets.runtime.json) | JSON | 1 | 0 | 0 | 1 |
| [Web/obj/Api.csproj.nuget.dgspec.json](/Web/obj/Api.csproj.nuget.dgspec.json) | JSON | -1,897 | 0 | 0 | -1,897 |
| [Web/obj/Api.csproj.nuget.g.props](/Web/obj/Api.csproj.nuget.g.props) | XML | -19 | 0 | 0 | -19 |
| [Web/obj/Api.csproj.nuget.g.targets](/Web/obj/Api.csproj.nuget.g.targets) | XML | -6 | 0 | 0 | -6 |
| [Web/obj/Debug/net10.0/Api.AssemblyInfo.cs](/Web/obj/Debug/net10.0/Api.AssemblyInfo.cs) | C# | -9 | -10 | -5 | -24 |
| [Web/obj/Debug/net10.0/Api.GeneratedMSBuildEditorConfig.editorconfig](/Web/obj/Debug/net10.0/Api.GeneratedMSBuildEditorConfig.editorconfig) | Properties | -23 | 0 | -1 | -24 |
| [Web/obj/Debug/net10.0/Api.GlobalUsings.g.cs](/Web/obj/Debug/net10.0/Api.GlobalUsings.g.cs) | C# | -16 | -1 | -1 | -18 |
| [Web/obj/Debug/net10.0/Api.MvcApplicationPartsAssemblyInfo.cs](/Web/obj/Debug/net10.0/Api.MvcApplicationPartsAssemblyInfo.cs) | C# | -4 | -10 | -5 | -19 |
| [Web/obj/Debug/net10.0/Api.sourcelink.json](/Web/obj/Debug/net10.0/Api.sourcelink.json) | JSON | -1 | 0 | 0 | -1 |
| [Web/obj/Debug/net10.0/ApiEndpoints.json](/Web/obj/Debug/net10.0/ApiEndpoints.json) | JSON | 988 | 0 | 0 | 988 |
| [Web/obj/Debug/net10.0/EndpointInfo/Api.json](/Web/obj/Debug/net10.0/EndpointInfo/Api.json) | JSON | -96 | 0 | 0 | -96 |
| [Web/obj/Debug/net10.0/EndpointInfo/Web.json](/Web/obj/Debug/net10.0/EndpointInfo/Web.json) | JSON | -3,546 | 0 | 0 | -3,546 |
| [Web/obj/Debug/net10.0/Web.GeneratedMSBuildEditorConfig.editorconfig](/Web/obj/Debug/net10.0/Web.GeneratedMSBuildEditorConfig.editorconfig) | Properties | 33 | 0 | 11 | 44 |
| [Web/obj/Debug/net10.0/Web.MvcApplicationPartsAssemblyInfo.cs](/Web/obj/Debug/net10.0/Web.MvcApplicationPartsAssemblyInfo.cs) | C# | 0 | -1 | 0 | -1 |
| [Web/obj/Debug/net10.0/Web.RazorAssemblyInfo.cs](/Web/obj/Debug/net10.0/Web.RazorAssemblyInfo.cs) | C# | 4 | 10 | 5 | 19 |
| [Web/obj/Debug/net10.0/rbcswa.dswa.cache.json](/Web/obj/Debug/net10.0/rbcswa.dswa.cache.json) | JSON | 1 | 0 | 0 | 1 |
| [Web/obj/Debug/net10.0/rjimswa.dswa.cache.json](/Web/obj/Debug/net10.0/rjimswa.dswa.cache.json) | JSON | 1 | 0 | 0 | 1 |
| [Web/obj/Debug/net10.0/staticwebassets.development.json](/Web/obj/Debug/net10.0/staticwebassets.development.json) | JSON | 1 | 0 | 0 | 1 |
| [Web/obj/Web.csproj.nuget.dgspec.json](/Web/obj/Web.csproj.nuget.dgspec.json) | JSON | 133 | 0 | 0 | 133 |
| [Web/obj/project.assets.json](/Web/obj/project.assets.json) | JSON | 13 | 0 | 0 | 13 |
| [Web/wwwroot/admin/css/admin.min.css](/Web/wwwroot/admin/css/admin.min.css) | PostCSS | 884 | 41 | 66 | 991 |
| [Web/wwwroot/admin/js/admin.min.js](/Web/wwwroot/admin/js/admin.min.js) | JavaScript | 103 | 11 | 19 | 133 |

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details