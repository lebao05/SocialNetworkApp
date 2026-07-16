using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddReelSearchVector : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                ALTER TABLE ""Reels""
                ADD COLUMN ""SearchVector"" tsvector
                GENERATED ALWAYS AS (to_tsvector('english', coalesce(""Caption"", ''))) STORED;
            ");

            migrationBuilder.Sql(@"
                CREATE INDEX ""IX_Reels_SearchVector""
                ON ""Reels"" USING GIN (""SearchVector"");
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"DROP INDEX IF EXISTS ""IX_Reels_SearchVector"";");
            migrationBuilder.Sql(@"ALTER TABLE ""Reels"" DROP COLUMN IF EXISTS ""SearchVector"";");
        }
    }
}
