using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddGroupJoinApprovalSettingAndReportedGroupContent : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<byte>(
                name: "ApprovalStatus",
                table: "Posts",
                type: "SMALLINT",
                nullable: false,
                defaultValue: (byte)0);

            migrationBuilder.AddColumn<bool>(
                name: "AllowAnonymousPost",
                table: "Groups",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsGroupJoinApprovalRequired",
                table: "Groups",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsHidden",
                table: "Groups",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsPostApprovalRequired",
                table: "Groups",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "GroupRules",
                columns: table => new
                {
                    GroupRuleId = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    GroupId = table.Column<long>(type: "bigint", nullable: false),
                    Title = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GroupRules", x => x.GroupRuleId);
                    table.ForeignKey(
                        name: "FK_GroupRules_Groups_GroupId",
                        column: x => x.GroupId,
                        principalTable: "Groups",
                        principalColumn: "GroupId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ReportedGroupContents",
                columns: table => new
                {
                    ReportedGroupContentId = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    GroupId = table.Column<long>(type: "bigint", nullable: false),
                    ReporterId = table.Column<Guid>(type: "uuid", nullable: false),
                    PostId = table.Column<long>(type: "bigint", nullable: false),
                    Reason = table.Column<byte>(type: "SMALLINT", nullable: false),
                    AdditionalDetail = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    Status = table.Column<byte>(type: "SMALLINT", nullable: false, defaultValue: (byte)0),
                    ReviewedByUserId = table.Column<Guid>(type: "uuid", nullable: true),
                    ReviewedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ReviewNote = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReportedGroupContents", x => x.ReportedGroupContentId);
                    table.ForeignKey(
                        name: "FK_ReportedGroupContents_Groups_GroupId",
                        column: x => x.GroupId,
                        principalTable: "Groups",
                        principalColumn: "GroupId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ReportedGroupContents_Posts_PostId",
                        column: x => x.PostId,
                        principalTable: "Posts",
                        principalColumn: "PostId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ReportedGroupContents_Users_ReporterId",
                        column: x => x.ReporterId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ReportedGroupContents_Users_ReviewedByUserId",
                        column: x => x.ReviewedByUserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_GroupRules_GroupId",
                table: "GroupRules",
                column: "GroupId");

            migrationBuilder.CreateIndex(
                name: "IX_ReportedGroupContents_GroupId_Status",
                table: "ReportedGroupContents",
                columns: new[] { "GroupId", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_ReportedGroupContents_PostId",
                table: "ReportedGroupContents",
                column: "PostId");

            migrationBuilder.CreateIndex(
                name: "IX_ReportedGroupContents_ReporterId_PostId",
                table: "ReportedGroupContents",
                columns: new[] { "ReporterId", "PostId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ReportedGroupContents_ReviewedByUserId",
                table: "ReportedGroupContents",
                column: "ReviewedByUserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GroupRules");

            migrationBuilder.DropTable(
                name: "ReportedGroupContents");

            migrationBuilder.DropColumn(
                name: "ApprovalStatus",
                table: "Posts");

            migrationBuilder.DropColumn(
                name: "AllowAnonymousPost",
                table: "Groups");

            migrationBuilder.DropColumn(
                name: "IsGroupJoinApprovalRequired",
                table: "Groups");

            migrationBuilder.DropColumn(
                name: "IsHidden",
                table: "Groups");

            migrationBuilder.DropColumn(
                name: "IsPostApprovalRequired",
                table: "Groups");
        }
    }
}
