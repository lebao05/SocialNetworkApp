using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class updb19 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                ALTER TABLE "Posts"
                ADD COLUMN "SearchVector" tsvector
                GENERATED ALWAYS AS (
                    to_tsvector('english', coalesce("Content", ''))
                ) STORED;
                """);

            migrationBuilder.Sql("""
                CREATE INDEX "IX_Posts_SearchVector"
                ON "Posts"
                USING GIN ("SearchVector");
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
