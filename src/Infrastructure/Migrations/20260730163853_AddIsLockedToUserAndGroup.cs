using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddIsLockedToUserAndGroup : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsLocked",
                table: "Groups",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsLocked",
                table: "AspNetUsers",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_Groups_IsLocked",
                table: "Groups",
                column: "IsLocked");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_IsLocked",
                table: "AspNetUsers",
                column: "IsLocked");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Groups_IsLocked",
                table: "Groups");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_IsLocked",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "IsLocked",
                table: "Groups");

            migrationBuilder.DropColumn(
                name: "IsLocked",
                table: "AspNetUsers");
        }
    }
}
