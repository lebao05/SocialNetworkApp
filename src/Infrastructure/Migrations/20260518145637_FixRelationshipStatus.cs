using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FixRelationshipStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProfilePictureUrl",
                table: "Users");

            migrationBuilder.Sql(@"
                ALTER TABLE ""Users"" 
                ALTER COLUMN ""RelationshipStatus"" TYPE SMALLINT 
                USING CASE ""RelationshipStatus""
                    WHEN 'Single' THEN 0
                    WHEN 'InRelationship' THEN 1
                    WHEN 'Engaged' THEN 2
                    WHEN 'Married' THEN 3
                    WHEN 'InOpenRelationship' THEN 4
                    WHEN 'ItIsComplicated' THEN 5
                    WHEN 'Separated' THEN 6
                    WHEN 'Divorced' THEN 7
                    WHEN 'Widowed' THEN 8
                    ELSE NULL -- or try to cast if they are numbers: NULLIF(""RelationshipStatus"", '')::SMALLINT
                END;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "RelationshipStatus",
                table: "Users",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(short),
                oldType: "SMALLINT",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProfilePictureUrl",
                table: "Users",
                type: "TEXT",
                nullable: true);
        }
    }
}
