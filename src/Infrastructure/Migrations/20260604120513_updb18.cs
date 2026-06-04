using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class updb18 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsHidden",
                table: "Groups");

            migrationBuilder.AddColumn<bool>(
                name: "IsAnonymous",
                table: "Posts",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsAnonymous",
                table: "Posts");

            migrationBuilder.AddColumn<bool>(
                name: "IsHidden",
                table: "Groups",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }
    }
}
