using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Infrastructure.Migrations;

/// <inheritdoc />
public partial class updb22 : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "Stories",
            columns: table => new
            {
                StoryId = table.Column<long>(type: "bigint", nullable: false)
                    .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                UserId = table.Column<Guid>(type: "uuid", nullable: false),
                MediaUrl = table.Column<string>(type: "TEXT", nullable: true),
                MediaType = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                BackgroundGradient = table.Column<string>(type: "TEXT", nullable: true),
                TextContent = table.Column<string>(type: "TEXT", nullable: true),
                TextColor = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                TextStyle = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                TextPositionX = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                TextPositionY = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                FontFamily = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                ExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Stories", x => x.StoryId);
                table.ForeignKey(
                    name: "FK_Stories_Users_UserId",
                    column: x => x.UserId,
                    principalTable: "Users",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        // Fix StorySeens: switch FK target from Reels to Stories without re-adding StoryId
        migrationBuilder.DropForeignKey(
            name: "FK_StorySeens_Reels_StoryId",
            table: "StorySeens");

        migrationBuilder.AddForeignKey(
            name: "FK_StorySeens_Stories_StoryId",
            table: "StorySeens",
            column: "StoryId",
            principalTable: "Stories",
            principalColumn: "StoryId",
            onDelete: ReferentialAction.Cascade);

        migrationBuilder.CreateIndex(
            name: "IX_Stories_UserId",
            table: "Stories",
            column: "UserId");

        migrationBuilder.CreateIndex(
            name: "IX_Stories_ExpiresAt",
            table: "Stories",
            column: "ExpiresAt");
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(
            name: "Stories");

        // Restore StorySeens FK to Reels
        migrationBuilder.DropForeignKey(
            name: "FK_StorySeens_Stories_StoryId",
            table: "StorySeens");

        migrationBuilder.AddForeignKey(
            name: "FK_StorySeens_Reels_StoryId",
            table: "StorySeens",
            column: "StoryId",
            principalTable: "Reels",
            principalColumn: "ReelId",
            onDelete: ReferentialAction.Cascade);
    }
}
