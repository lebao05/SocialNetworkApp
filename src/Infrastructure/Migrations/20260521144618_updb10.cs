using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class updb10 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<short>(
                name: "Degree",
                table: "Schools",
                type: "SMALLINT",
                nullable: true,
                oldClrType: typeof(short),
                oldType: "SMALLINT");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<short>(
                name: "Degree",
                table: "Schools",
                type: "SMALLINT",
                nullable: false,
                defaultValue: (short)0,
                oldClrType: typeof(short),
                oldType: "SMALLINT",
                oldNullable: true);
        }
    }
}
