using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class updb4_v2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReceivedAt",
                table: "MemberMessages");

            migrationBuilder.AddColumn<string>(
                name: "Ciphertext",
                table: "Messages",
                type: "text",
                nullable: false,
                defaultValue: "");

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
                table: "ConversationMembers",
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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Ciphertext",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "MessageAttachments");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "MemberMessages");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Friendships");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "FriendRequests");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "ConversationMembers");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "BlockChats");

            migrationBuilder.AddColumn<DateTime>(
                name: "ReceivedAt",
                table: "MemberMessages",
                type: "timestamp with time zone",
                nullable: true);
        }
    }
}
