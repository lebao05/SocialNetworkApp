using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddUserCreatedAt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // AspNetUsers is the Identity-owned table for User. Identity doesn't
            // store a registration timestamp by default; we add one so admin
            // analytics can group new users by day without scanning the whole table.
            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "AspNetUsers",
                type: "timestamp with time zone",
                nullable: false,
                defaultValueSql: "now() AT TIME ZONE 'utc'");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_CreatedAt",
                table: "AspNetUsers",
                column: "CreatedAt");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_CreatedAt",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "AspNetUsers");
        }
    }
}