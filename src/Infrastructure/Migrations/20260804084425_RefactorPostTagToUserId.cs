using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RefactorPostTagToUserId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TagName",
                table: "PostTags");

            migrationBuilder.AddColumn<Guid>(
                name: "UserId",
                table: "PostTags",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_PostTags_UserId",
                table: "PostTags",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_PostTags_AspNetUsers_UserId",
                table: "PostTags",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PostTags_AspNetUsers_UserId",
                table: "PostTags");

            migrationBuilder.DropIndex(
                name: "IX_PostTags_UserId",
                table: "PostTags");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "PostTags");

            migrationBuilder.AddColumn<string>(
                name: "TagName",
                table: "PostTags",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");
        }
    }
}
