using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class updb20 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "UserFeeds");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Schools");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "SavedPosts");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "ReportedGroupContents");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "PostTags");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Posts");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "PostReactions");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "PostMedia");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "PostComments");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "MessageAttachments");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "MemberMessages");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Groups");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "GroupRules");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "GroupRequests");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "GroupMembers");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Friendships");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "FriendRequests");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Followings");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Conversations");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "ConversationMembers");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "CommentReactions");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "BlockChats");

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                table: "UserFeeds",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                table: "Schools",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                table: "SavedPosts",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                table: "ReportedGroupContents",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                table: "PostTags",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                table: "PostReactions",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                table: "PostMedia",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                table: "Notifications",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                table: "Messages",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                table: "MessageAttachments",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                table: "MemberMessages",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                table: "Groups",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                table: "GroupRules",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                table: "GroupRequests",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                table: "GroupMembers",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                table: "Friendships",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                table: "FriendRequests",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                table: "Followings",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                table: "Conversations",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                table: "ConversationMembers",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                table: "CommentReactions",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                table: "BlockChats",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Reels",
                columns: table => new
                {
                    ReelId = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    AuthorId = table.Column<Guid>(type: "uuid", nullable: false),
                    VideoUrl = table.Column<string>(type: "TEXT", nullable: false),
                    ThumbnailUrl = table.Column<string>(type: "TEXT", nullable: true),
                    Caption = table.Column<string>(type: "TEXT", nullable: true),
                    AudioTitle = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    Duration = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    Visibility = table.Column<byte>(type: "SMALLINT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reels", x => x.ReelId);
                    table.ForeignKey(
                        name: "FK_Reels_Users_AuthorId",
                        column: x => x.AuthorId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ReelComments",
                columns: table => new
                {
                    CommentId = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ReelId = table.Column<long>(type: "bigint", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    ParentCommentId = table.Column<long>(type: "bigint", nullable: true),
                    RepliedUserId = table.Column<Guid>(type: "uuid", nullable: true),
                    Content = table.Column<string>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReelComments", x => x.CommentId);
                    table.ForeignKey(
                        name: "FK_ReelComments_ReelComments_ParentCommentId",
                        column: x => x.ParentCommentId,
                        principalTable: "ReelComments",
                        principalColumn: "CommentId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ReelComments_Reels_ReelId",
                        column: x => x.ReelId,
                        principalTable: "Reels",
                        principalColumn: "ReelId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ReelComments_Users_RepliedUserId",
                        column: x => x.RepliedUserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ReelComments_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ReelReactions",
                columns: table => new
                {
                    ReactionId = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    ReactionType = table.Column<byte>(type: "SMALLINT", nullable: false),
                    ReelId = table.Column<long>(type: "bigint", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReelReactions", x => x.ReactionId);
                    table.ForeignKey(
                        name: "FK_ReelReactions_Reels_ReelId",
                        column: x => x.ReelId,
                        principalTable: "Reels",
                        principalColumn: "ReelId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ReelReactions_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ReelComments_ParentCommentId",
                table: "ReelComments",
                column: "ParentCommentId");

            migrationBuilder.CreateIndex(
                name: "IX_ReelComments_ReelId",
                table: "ReelComments",
                column: "ReelId");

            migrationBuilder.CreateIndex(
                name: "IX_ReelComments_RepliedUserId",
                table: "ReelComments",
                column: "RepliedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_ReelComments_UserId",
                table: "ReelComments",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ReelReactions_ReelId",
                table: "ReelReactions",
                column: "ReelId");

            migrationBuilder.CreateIndex(
                name: "IX_ReelReactions_UserId_ReelId",
                table: "ReelReactions",
                columns: new[] { "UserId", "ReelId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Reels_AuthorId",
                table: "Reels",
                column: "AuthorId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ReelComments");

            migrationBuilder.DropTable(
                name: "ReelReactions");

            migrationBuilder.DropTable(
                name: "Reels");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "UserFeeds");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "Schools");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "SavedPosts");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "ReportedGroupContents");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "PostTags");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "PostReactions");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "PostMedia");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "MessageAttachments");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "MemberMessages");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "Groups");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "GroupRules");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "GroupRequests");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "GroupMembers");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "Friendships");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "FriendRequests");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "Followings");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "Conversations");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "ConversationMembers");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "CommentReactions");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "BlockChats");

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "UserFeeds",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Schools",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "SavedPosts",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "ReportedGroupContents",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "PostTags",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Posts",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "PostReactions",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "PostMedia",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "PostComments",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Notifications",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Messages",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "MessageAttachments",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "MemberMessages",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Groups",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "GroupRules",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "GroupRequests",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "GroupMembers",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Friendships",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "FriendRequests",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Followings",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Conversations",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "ConversationMembers",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "CommentReactions",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "BlockChats",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }
    }
}
