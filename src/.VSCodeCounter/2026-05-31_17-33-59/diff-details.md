# Diff Details

Date : 2026-05-31 17:33:59

Directory d:\\SocialNetworkApp\\SocialNetworkApp\\src

Total : 173 files,  17701 codes, 139 comments, 4713 blanks, all 22553 lines

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [Application/Abstractions/Repositories/IGroupReportRepository.cs](/Application/Abstractions/Repositories/IGroupReportRepository.cs) | C# | 13 | 0 | 2 | 15 |
| [Application/Abstractions/Repositories/IGroupRepository.cs](/Application/Abstractions/Repositories/IGroupRepository.cs) | C# | 4 | 0 | 0 | 4 |
| [Application/Abstractions/Repositories/IPostRepository.cs](/Application/Abstractions/Repositories/IPostRepository.cs) | C# | 16 | 0 | 0 | 16 |
| [Application/DTOs/Groups/GroupJoinRequestDto.cs](/Application/DTOs/Groups/GroupJoinRequestDto.cs) | C# | 14 | 0 | 2 | 16 |
| [Application/DTOs/Groups/GroupMemberDto.cs](/Application/DTOs/Groups/GroupMemberDto.cs) | C# | 14 | 0 | 2 | 16 |
| [Application/DTOs/Groups/GroupRuleResponse.cs](/Application/DTOs/Groups/GroupRuleResponse.cs) | C# | 8 | 0 | 1 | 9 |
| [Application/DTOs/Groups/ReportedGroupContentDto.cs](/Application/DTOs/Groups/ReportedGroupContentDto.cs) | C# | 23 | 0 | 2 | 25 |
| [Application/DTOs/Posts/PostCommentDto.cs](/Application/DTOs/Posts/PostCommentDto.cs) | C# | 21 | 0 | 2 | 23 |
| [Application/DTOs/Posts/PostDto.cs](/Application/DTOs/Posts/PostDto.cs) | C# | 6 | 0 | 0 | 6 |
| [Application/DTOs/Posts/PostMediaItemDto.cs](/Application/DTOs/Posts/PostMediaItemDto.cs) | C# | 12 | 0 | 1 | 13 |
| [Application/DTOs/Posts/ReactionCountDto.cs](/Application/DTOs/Posts/ReactionCountDto.cs) | C# | 8 | 0 | 2 | 10 |
| [Application/Feeds/Commands/MarkLatestFeedAsSeen/MarkLatestFeedAsSeenCommand.cs](/Application/Feeds/Commands/MarkLatestFeedAsSeen/MarkLatestFeedAsSeenCommand.cs) | C# | -8 | 0 | -2 | -10 |
| [Application/Feeds/Commands/MarkLatestFeedAsSeen/MarkLatestFeedAsSeenCommandHandler.cs](/Application/Feeds/Commands/MarkLatestFeedAsSeen/MarkLatestFeedAsSeenCommandHandler.cs) | C# | -22 | 0 | -5 | -27 |
| [Application/Feeds/Queries/GetFeedPosts/GetFeedPostsQuery.cs](/Application/Feeds/Queries/GetFeedPosts/GetFeedPostsQuery.cs) | C# | -11 | 0 | -2 | -13 |
| [Application/Feeds/Queries/GetFeedPosts/GetFeedPostsQueryHandler.cs](/Application/Feeds/Queries/GetFeedPosts/GetFeedPostsQueryHandler.cs) | C# | -23 | 0 | -6 | -29 |
| [Application/Groups/Commands/AssignGroupRole/AssignGroupRoleCommandHandler.cs](/Application/Groups/Commands/AssignGroupRole/AssignGroupRoleCommandHandler.cs) | C# | 35 | 0 | 6 | 41 |
| [Application/Groups/Commands/CreateGroupRule/CreateGroupRuleCommand.cs](/Application/Groups/Commands/CreateGroupRule/CreateGroupRuleCommand.cs) | C# | 10 | 0 | 2 | 12 |
| [Application/Groups/Commands/CreateGroupRule/CreateGroupRuleCommandHandler.cs](/Application/Groups/Commands/CreateGroupRule/CreateGroupRuleCommandHandler.cs) | C# | 47 | 1 | 9 | 57 |
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
| [Application/Groups/Queries/GetGroupJoinRequests/GetGroupJoinRequestsQuery.cs](/Application/Groups/Queries/GetGroupJoinRequests/GetGroupJoinRequestsQuery.cs) | C# | 12 | 0 | 2 | 14 |
| [Application/Groups/Queries/GetGroupJoinRequests/GetGroupJoinRequestsQueryHandler.cs](/Application/Groups/Queries/GetGroupJoinRequests/GetGroupJoinRequestsQueryHandler.cs) | C# | 58 | 0 | 8 | 66 |
| [Application/Groups/Queries/GetGroupMembers/GetGroupMembersQuery.cs](/Application/Groups/Queries/GetGroupMembers/GetGroupMembersQuery.cs) | C# | 13 | 0 | 2 | 15 |
| [Application/Groups/Queries/GetGroupMembers/GetGroupMembersQueryHandler.cs](/Application/Groups/Queries/GetGroupMembers/GetGroupMembersQueryHandler.cs) | C# | 53 | 0 | 7 | 60 |
| [Application/Groups/Queries/GetGroupRules/GetGroupRulesQuery.cs](/Application/Groups/Queries/GetGroupRules/GetGroupRulesQuery.cs) | C# | 7 | 0 | 2 | 9 |
| [Application/Groups/Queries/GetGroupRules/GetGroupRulesQueryHandler.cs](/Application/Groups/Queries/GetGroupRules/GetGroupRulesQueryHandler.cs) | C# | 33 | 0 | 6 | 39 |
| [Application/Groups/Queries/GetReportedContents/GetReportedContentsQuery.cs](/Application/Groups/Queries/GetReportedContents/GetReportedContentsQuery.cs) | C# | 13 | 0 | 2 | 15 |
| [Application/Groups/Queries/GetReportedContents/GetReportedContentsQueryHandler.cs](/Application/Groups/Queries/GetReportedContents/GetReportedContentsQueryHandler.cs) | C# | 71 | 0 | 8 | 79 |
| [Application/Posts/Commands/CreateComment/CreateCommentCommand.cs](/Application/Posts/Commands/CreateComment/CreateCommentCommand.cs) | C# | 11 | 0 | 2 | 13 |
| [Application/Posts/Commands/CreateComment/CreateCommentCommandHandler.cs](/Application/Posts/Commands/CreateComment/CreateCommentCommandHandler.cs) | C# | 93 | 0 | 13 | 106 |
| [Application/Posts/Commands/CreatePost/CreatePostCommandHandler.cs](/Application/Posts/Commands/CreatePost/CreatePostCommandHandler.cs) | C# | 28 | 0 | 5 | 33 |
| [Application/Posts/Commands/MarkLatestFeedAsSeen/MarkLatestFeedAsSeenCommand.cs](/Application/Posts/Commands/MarkLatestFeedAsSeen/MarkLatestFeedAsSeenCommand.cs) | C# | 9 | 0 | 3 | 12 |
| [Application/Posts/Commands/MarkLatestFeedAsSeen/MarkLatestFeedAsSeenCommandHandler.cs](/Application/Posts/Commands/MarkLatestFeedAsSeen/MarkLatestFeedAsSeenCommandHandler.cs) | C# | 22 | 0 | 5 | 27 |
| [Application/Posts/Commands/ReactToComment/ReactToCommentCommand.cs](/Application/Posts/Commands/ReactToComment/ReactToCommentCommand.cs) | C# | 10 | 0 | 2 | 12 |
| [Application/Posts/Commands/ReactToComment/ReactToCommentCommandHandler.cs](/Application/Posts/Commands/ReactToComment/ReactToCommentCommandHandler.cs) | C# | 59 | 0 | 9 | 68 |
| [Application/Posts/Commands/ReactToPost/ReactToPostCommand.cs](/Application/Posts/Commands/ReactToPost/ReactToPostCommand.cs) | C# | 10 | 0 | 2 | 12 |
| [Application/Posts/Commands/ReactToPost/ReactToPostCommandHandler.cs](/Application/Posts/Commands/ReactToPost/ReactToPostCommandHandler.cs) | C# | 66 | 0 | 11 | 77 |
| [Application/Posts/Commands/SavePost/SavePostCommand.cs](/Application/Posts/Commands/SavePost/SavePostCommand.cs) | C# | 8 | 0 | 2 | 10 |
| [Application/Posts/Commands/SavePost/SavePostCommandHandler.cs](/Application/Posts/Commands/SavePost/SavePostCommandHandler.cs) | C# | 52 | 0 | 9 | 61 |
| [Application/Posts/Commands/UnsavePost/UnsavePostCommand.cs](/Application/Posts/Commands/UnsavePost/UnsavePostCommand.cs) | C# | 8 | 0 | 2 | 10 |
| [Application/Posts/Commands/UnsavePost/UnsavePostCommandHandler.cs](/Application/Posts/Commands/UnsavePost/UnsavePostCommandHandler.cs) | C# | 40 | 0 | 7 | 47 |
| [Application/Posts/Queries/GetComments/GetCommentsQuery.cs](/Application/Posts/Queries/GetComments/GetCommentsQuery.cs) | C# | 13 | 0 | 2 | 15 |
| [Application/Posts/Queries/GetComments/GetCommentsQueryHandler.cs](/Application/Posts/Queries/GetComments/GetCommentsQueryHandler.cs) | C# | 98 | 0 | 15 | 113 |
| [Application/Posts/Queries/GetFeedPosts/GetFeedPostsQuery.cs](/Application/Posts/Queries/GetFeedPosts/GetFeedPostsQuery.cs) | C# | 12 | 0 | 2 | 14 |
| [Application/Posts/Queries/GetFeedPosts/GetFeedPostsQueryHandler.cs](/Application/Posts/Queries/GetFeedPosts/GetFeedPostsQueryHandler.cs) | C# | 23 | 0 | 6 | 29 |
| [Application/Posts/Queries/GetPostMediasByGroup/GetPostMediasByGroupQuery.cs](/Application/Posts/Queries/GetPostMediasByGroup/GetPostMediasByGroupQuery.cs) | C# | 11 | 0 | 2 | 13 |
| [Application/Posts/Queries/GetPostMediasByGroup/GetPostMediasByGroupQueryHandler.cs](/Application/Posts/Queries/GetPostMediasByGroup/GetPostMediasByGroupQueryHandler.cs) | C# | 57 | 0 | 9 | 66 |
| [Application/Posts/Queries/GetPostMediasByUser/GetPostMediasByUserQuery.cs](/Application/Posts/Queries/GetPostMediasByUser/GetPostMediasByUserQuery.cs) | C# | 11 | 0 | 2 | 13 |
| [Application/Posts/Queries/GetPostMediasByUser/GetPostMediasByUserQueryHandler.cs](/Application/Posts/Queries/GetPostMediasByUser/GetPostMediasByUserQueryHandler.cs) | C# | 57 | 0 | 9 | 66 |
| [Application/Posts/Queries/GetPost/GetPostQueryHandler.cs](/Application/Posts/Queries/GetPost/GetPostQueryHandler.cs) | C# | 19 | 0 | 2 | 21 |
| [Application/Posts/Queries/GetPostsByGroup/GetPostsByGroupQuery.cs](/Application/Posts/Queries/GetPostsByGroup/GetPostsByGroupQuery.cs) | C# | 2 | 0 | 0 | 2 |
| [Application/Posts/Queries/GetPostsByGroup/GetPostsByGroupQueryHandler.cs](/Application/Posts/Queries/GetPostsByGroup/GetPostsByGroupQueryHandler.cs) | C# | 18 | 0 | 2 | 20 |
| [Application/Posts/Queries/GetPostsByPerson/GetPostsByPersonQuery.cs](/Application/Posts/Queries/GetPostsByPerson/GetPostsByPersonQuery.cs) | C# | 1 | 0 | 0 | 1 |
| [Application/Posts/Queries/GetPostsByPerson/GetPostsByPersonQueryHandler.cs](/Application/Posts/Queries/GetPostsByPerson/GetPostsByPersonQueryHandler.cs) | C# | 17 | 0 | 2 | 19 |
| [Application/obj/Debug/net10.0/Application.AssemblyInfo.cs](/Application/obj/Debug/net10.0/Application.AssemblyInfo.cs) | C# | 0 | -1 | 0 | -1 |
| [Domain/Entities/CommentReaction.cs](/Domain/Entities/CommentReaction.cs) | C# | 26 | 0 | 6 | 32 |
| [Domain/Entities/Group.cs](/Domain/Entities/Group.cs) | C# | 98 | 5 | 19 | 122 |
| [Domain/Entities/GroupJoinRequest.cs](/Domain/Entities/GroupJoinRequest.cs) | C# | 29 | 1 | 7 | 37 |
| [Domain/Entities/GroupRequest.cs](/Domain/Entities/GroupRequest.cs) | C# | -29 | -1 | -7 | -37 |
| [Domain/Entities/GroupRule.cs](/Domain/Entities/GroupRule.cs) | C# | 27 | 1 | 6 | 34 |
| [Domain/Entities/InterestGroupScore.cs](/Domain/Entities/InterestGroupScore.cs) | C# | -48 | 0 | -10 | -58 |
| [Domain/Entities/InterestRelationshipScore.cs](/Domain/Entities/InterestRelationshipScore.cs) | C# | -52 | 0 | -11 | -63 |
| [Domain/Entities/Post.cs](/Domain/Entities/Post.cs) | C# | 29 | 3 | 7 | 39 |
| [Domain/Entities/PostComment.cs](/Domain/Entities/PostComment.cs) | C# | 4 | 0 | 0 | 4 |
| [Domain/Entities/PostReaction.cs](/Domain/Entities/PostReaction.cs) | C# | 26 | 0 | 6 | 32 |
| [Domain/Entities/Reaction.cs](/Domain/Entities/Reaction.cs) | C# | -38 | -1 | -8 | -47 |
| [Domain/Entities/ReportedGroupContent.cs](/Domain/Entities/ReportedGroupContent.cs) | C# | 52 | 6 | 15 | 73 |
| [Domain/Entities/User.cs](/Domain/Entities/User.cs) | C# | -4 | 0 | -2 | -6 |
| [Domain/Enums/GroupContentType.cs](/Domain/Enums/GroupContentType.cs) | C# | 8 | 1 | 1 | 10 |
| [Domain/Enums/GroupReportReason.cs](/Domain/Enums/GroupReportReason.cs) | C# | 14 | 1 | 1 | 16 |
| [Domain/Enums/GroupReportStatus.cs](/Domain/Enums/GroupReportStatus.cs) | C# | 9 | 4 | 3 | 16 |
| [Domain/Enums/PostApprovalStatus.cs](/Domain/Enums/PostApprovalStatus.cs) | C# | 10 | 5 | 4 | 19 |
| [Domain/Enums/WhoCanApprove.cs](/Domain/Enums/WhoCanApprove.cs) | C# | 8 | 3 | 2 | 13 |
| [Domain/Enums/WhoCanJoin.cs](/Domain/Enums/WhoCanJoin.cs) | C# | 8 | 3 | 2 | 13 |
| [Domain/Enums/WhoCanPost.cs](/Domain/Enums/WhoCanPost.cs) | C# | 9 | 4 | 3 | 16 |
| [Domain/obj/Debug/net10.0/Domain.AssemblyInfo.cs](/Domain/obj/Debug/net10.0/Domain.AssemblyInfo.cs) | C# | 0 | -1 | 0 | -1 |
| [Infrastructure/DependencyInjection.cs](/Infrastructure/DependencyInjection.cs) | C# | 1 | 0 | 0 | 1 |
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
| [Infrastructure/Migrations/AppDbContextModelSnapshot.cs](/Infrastructure/Migrations/AppDbContextModelSnapshot.cs) | C# | 87 | 0 | 27 | 114 |
| [Infrastructure/Persistence/Configurations/GroupConfiguration.cs](/Infrastructure/Persistence/Configurations/GroupConfiguration.cs) | C# | 19 | 2 | 6 | 27 |
| [Infrastructure/Persistence/Configurations/GroupJoinRequestConfiguration.cs](/Infrastructure/Persistence/Configurations/GroupJoinRequestConfiguration.cs) | C# | 24 | 4 | 7 | 35 |
| [Infrastructure/Persistence/Configurations/GroupRequestConfiguration.cs](/Infrastructure/Persistence/Configurations/GroupRequestConfiguration.cs) | C# | -24 | -4 | -7 | -35 |
| [Infrastructure/Persistence/Configurations/GroupRuleConfiguration.cs](/Infrastructure/Persistence/Configurations/GroupRuleConfiguration.cs) | C# | 28 | 1 | 8 | 37 |
| [Infrastructure/Persistence/Configurations/InterestGroupScoreConfiguration.cs](/Infrastructure/Persistence/Configurations/InterestGroupScoreConfiguration.cs) | C# | -29 | 0 | -9 | -38 |
| [Infrastructure/Persistence/Configurations/InterestRelationshipScoreConfiguration.cs](/Infrastructure/Persistence/Configurations/InterestRelationshipScoreConfiguration.cs) | C# | -29 | 0 | -9 | -38 |
| [Infrastructure/Persistence/Configurations/PostCommentConfiguration.cs](/Infrastructure/Persistence/Configurations/PostCommentConfiguration.cs) | C# | 6 | 1 | 2 | 9 |
| [Infrastructure/Persistence/Configurations/PostConfiguration.cs](/Infrastructure/Persistence/Configurations/PostConfiguration.cs) | C# | 11 | 1 | 4 | 16 |
| [Infrastructure/Persistence/Configurations/ReactionConfiguration.cs](/Infrastructure/Persistence/Configurations/ReactionConfiguration.cs) | C# | 31 | -7 | 7 | 31 |
| [Infrastructure/Persistence/Configurations/ReportedGroupContentConfiguration.cs](/Infrastructure/Persistence/Configurations/ReportedGroupContentConfiguration.cs) | C# | 54 | 12 | 18 | 84 |
| [Infrastructure/Persistence/Configurations/UserConfiguration.cs](/Infrastructure/Persistence/Configurations/UserConfiguration.cs) | C# | -6 | 0 | -2 | -8 |
| [Infrastructure/Persistence/Contexts/AppDbContext.cs](/Infrastructure/Persistence/Contexts/AppDbContext.cs) | C# | 2 | 0 | 0 | 2 |
| [Infrastructure/Persistence/Repositories/FeedRepository.cs](/Infrastructure/Persistence/Repositories/FeedRepository.cs) | C# | 97 | 0 | 12 | 109 |
| [Infrastructure/Persistence/Repositories/GroupReportRepository.cs](/Infrastructure/Persistence/Repositories/GroupReportRepository.cs) | C# | 54 | 0 | 10 | 64 |
| [Infrastructure/Persistence/Repositories/GroupRepository.cs](/Infrastructure/Persistence/Repositories/GroupRepository.cs) | C# | 61 | 0 | 9 | 70 |
| [Infrastructure/Persistence/Repositories/PostRepository.cs](/Infrastructure/Persistence/Repositories/PostRepository.cs) | C# | 142 | 0 | 28 | 170 |
| [Infrastructure/Services/FeedGenerator.cs](/Infrastructure/Services/FeedGenerator.cs) | C# | -52 | 0 | -12 | -64 |
| [Infrastructure/obj/Debug/net10.0/Infrastructure.AssemblyInfo.cs](/Infrastructure/obj/Debug/net10.0/Infrastructure.AssemblyInfo.cs) | C# | 0 | -1 | 0 | -1 |
| [Presentation/Contracts/Group/CreateGroupRuleRequest.cs](/Presentation/Contracts/Group/CreateGroupRuleRequest.cs) | C# | 4 | 0 | 1 | 5 |
| [Presentation/Contracts/Group/ExecuteReportedContentRequest.cs](/Presentation/Contracts/Group/ExecuteReportedContentRequest.cs) | C# | 8 | 0 | 1 | 9 |
| [Presentation/Contracts/Group/ReportGroupPostRequest.cs](/Presentation/Contracts/Group/ReportGroupPostRequest.cs) | C# | 8 | 0 | 1 | 9 |
| [Presentation/Contracts/Group/ReviewGroupJoinRequest.cs](/Presentation/Contracts/Group/ReviewGroupJoinRequest.cs) | C# | 4 | 0 | 1 | 5 |
| [Presentation/Contracts/Group/ReviewGroupPostRequest.cs](/Presentation/Contracts/Group/ReviewGroupPostRequest.cs) | C# | 4 | 0 | 1 | 5 |
| [Presentation/Contracts/Group/UpdateGroupRequest.cs](/Presentation/Contracts/Group/UpdateGroupRequest.cs) | C# | 13 | 0 | 1 | 14 |
| [Presentation/Contracts/Group/UpdateGroupRuleRequest.cs](/Presentation/Contracts/Group/UpdateGroupRuleRequest.cs) | C# | 4 | 0 | 1 | 5 |
| [Presentation/Contracts/Post/CreateCommentRequest.cs](/Presentation/Contracts/Post/CreateCommentRequest.cs) | C# | 9 | 0 | 2 | 11 |
| [Presentation/Contracts/Post/ReactToCommentRequest.cs](/Presentation/Contracts/Post/ReactToCommentRequest.cs) | C# | 7 | 0 | 2 | 9 |
| [Presentation/Contracts/Post/ReactToPostRequest.cs](/Presentation/Contracts/Post/ReactToPostRequest.cs) | C# | 7 | 0 | 2 | 9 |
| [Presentation/Controllers/FeedController.cs](/Presentation/Controllers/FeedController.cs) | C# | -70 | 0 | -14 | -84 |
| [Presentation/Controllers/GroupController.cs](/Presentation/Controllers/GroupController.cs) | C# | 265 | 0 | 48 | 313 |
| [Presentation/Controllers/PostController.cs](/Presentation/Controllers/PostController.cs) | C# | 205 | 0 | 37 | 242 |
| [Presentation/obj/Debug/net10.0/Presentation.AssemblyInfo.cs](/Presentation/obj/Debug/net10.0/Presentation.AssemblyInfo.cs) | C# | 0 | -1 | 0 | -1 |
| [ReactWeb/package-lock.json](/ReactWeb/package-lock.json) | JSON | 60 | 0 | 0 | 60 |
| [ReactWeb/package.json](/ReactWeb/package.json) | JSON | 3 | 0 | 0 | 3 |
| [ReactWeb/src/App.css](/ReactWeb/src/App.css) | PostCSS | 6 | 0 | -1 | 5 |
| [ReactWeb/src/App.jsx](/ReactWeb/src/App.jsx) | JavaScript JSX | 11 | 0 | 0 | 11 |
| [ReactWeb/src/apis/feedApi.js](/ReactWeb/src/apis/feedApi.js) | JavaScript | -17 | -9 | -6 | -32 |
| [ReactWeb/src/apis/friendApi.js](/ReactWeb/src/apis/friendApi.js) | JavaScript | -12 | -12 | -3 | -27 |
| [ReactWeb/src/apis/groupApi.js](/ReactWeb/src/apis/groupApi.js) | JavaScript | 82 | 44 | 12 | 138 |
| [ReactWeb/src/apis/postApi.js](/ReactWeb/src/apis/postApi.js) | JavaScript | 87 | 42 | 24 | 153 |
| [ReactWeb/src/components/Feed/CreatePost.jsx](/ReactWeb/src/components/Feed/CreatePost.jsx) | JavaScript JSX | 28 | 2 | 3 | 33 |
| [ReactWeb/src/components/Feed/MediaGallery.jsx](/ReactWeb/src/components/Feed/MediaGallery.jsx) | JavaScript JSX | 202 | 0 | 15 | 217 |
| [ReactWeb/src/components/Feed/PostCard.jsx](/ReactWeb/src/components/Feed/PostCard.jsx) | JavaScript JSX | 277 | -14 | 40 | 303 |
| [ReactWeb/src/components/Feed/PostComment.jsx](/ReactWeb/src/components/Feed/PostComment.jsx) | JavaScript JSX | 284 | 14 | 28 | 326 |
| [ReactWeb/src/components/Feed/PostModal.jsx](/ReactWeb/src/components/Feed/PostModal.jsx) | JavaScript JSX | 182 | 0 | 14 | 196 |
| [ReactWeb/src/components/Navbar/Navbar.jsx](/ReactWeb/src/components/Navbar/Navbar.jsx) | JavaScript JSX | 10 | 0 | 2 | 12 |
| [ReactWeb/src/components/Sidebar/LeftSidebar.jsx](/ReactWeb/src/components/Sidebar/LeftSidebar.jsx) | JavaScript JSX | 20 | -15 | 2 | 7 |
| [ReactWeb/src/components/group/GroupAdminInsights.jsx](/ReactWeb/src/components/group/GroupAdminInsights.jsx) | JavaScript JSX | 163 | 0 | 9 | 172 |
| [ReactWeb/src/components/group/GroupAdminManage.jsx](/ReactWeb/src/components/group/GroupAdminManage.jsx) | JavaScript JSX | 265 | 0 | 19 | 284 |
| [ReactWeb/src/components/group/GroupAdminSettings.jsx](/ReactWeb/src/components/group/GroupAdminSettings.jsx) | JavaScript JSX | 64 | 0 | 7 | 71 |
| [ReactWeb/src/components/group/GroupAdminSidebar.jsx](/ReactWeb/src/components/group/GroupAdminSidebar.jsx) | JavaScript JSX | 91 | 0 | 5 | 96 |
| [ReactWeb/src/contexts/friendContext.jsx](/ReactWeb/src/contexts/friendContext.jsx) | JavaScript JSX | -44 | 0 | -1 | -45 |
| [ReactWeb/src/data/groupMockData.js](/ReactWeb/src/data/groupMockData.js) | JavaScript | 171 | 0 | 11 | 182 |
| [ReactWeb/src/data/mockData.js](/ReactWeb/src/data/mockData.js) | JavaScript | 204 | 0 | 1 | 205 |
| [ReactWeb/src/data/reelsMockData.js](/ReactWeb/src/data/reelsMockData.js) | JavaScript | 62 | 0 | 1 | 63 |
| [ReactWeb/src/data/searchMockData.js](/ReactWeb/src/data/searchMockData.js) | JavaScript | 88 | 0 | 6 | 94 |
| [ReactWeb/src/hooks/useFeed.js](/ReactWeb/src/hooks/useFeed.js) | JavaScript | 39 | 1 | 4 | 44 |
| [ReactWeb/src/pages/GroupPage.jsx](/ReactWeb/src/pages/GroupPage.jsx) | JavaScript JSX | 432 | 0 | 30 | 462 |
| [ReactWeb/src/pages/GroupsCreatePage.jsx](/ReactWeb/src/pages/GroupsCreatePage.jsx) | JavaScript JSX | 227 | 0 | 20 | 247 |
| [ReactWeb/src/pages/GroupsPage.jsx](/ReactWeb/src/pages/GroupsPage.jsx) | JavaScript JSX | 314 | 0 | 16 | 330 |
| [ReactWeb/src/pages/HomePage.jsx](/ReactWeb/src/pages/HomePage.jsx) | JavaScript JSX | 85 | 2 | 15 | 102 |
| [ReactWeb/src/pages/ReelsPage.jsx](/ReactWeb/src/pages/ReelsPage.jsx) | JavaScript JSX | 95 | 0 | 12 | 107 |
| [ReactWeb/src/pages/SearchPage.jsx](/ReactWeb/src/pages/SearchPage.jsx) | JavaScript JSX | 201 | 0 | 15 | 216 |
| [Web/obj/Debug/net10.0/ApiEndpoints.json](/Web/obj/Debug/net10.0/ApiEndpoints.json) | JSON | 367 | 0 | 0 | 367 |
| [Web/obj/Debug/net10.0/EndpointInfo/Web.json](/Web/obj/Debug/net10.0/EndpointInfo/Web.json) | JSON | 821 | 0 | 0 | 821 |

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details