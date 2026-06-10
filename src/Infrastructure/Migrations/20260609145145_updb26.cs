using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class updb26 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                ALTER TABLE "Groups"
                ADD COLUMN "SearchVector" tsvector
                GENERATED ALWAYS AS (
                    to_tsvector('english', coalesce("Name", ''))
                ) STORED;
                """);

            migrationBuilder.Sql("""
                CREATE INDEX "IX_Groups_SearchVector"
                ON "Groups"
                USING GIN ("SearchVector");
                """);

            migrationBuilder.Sql("""
                ALTER TABLE "Users"
                ADD COLUMN "SearchVector" tsvector
                GENERATED ALWAYS AS (
                    to_tsvector('english', coalesce("FirstName", '') || ' ' || coalesce("LastName", ''))
                ) STORED;
                """);

            migrationBuilder.Sql("""
                CREATE INDEX "IX_Users_SearchVector"
                ON "Users"
                USING GIN ("SearchVector");
                """);

            migrationBuilder.Sql("""
                ALTER TABLE "Messages"
                ADD COLUMN "SearchVector" tsvector
                GENERATED ALWAYS AS (
                    to_tsvector('english', coalesce("Content", ''))
                ) STORED;
                """);

            migrationBuilder.Sql("""
                CREATE INDEX "IX_Messages_SearchVector"
                ON "Messages"
                USING GIN ("SearchVector");
                """);

            migrationBuilder.Sql("""
                ALTER TABLE "Reels"
                ADD COLUMN "SearchVector" tsvector
                GENERATED ALWAYS AS (
                    to_tsvector('english', coalesce("Caption", ''))
                ) STORED;
                """);

            migrationBuilder.Sql("""
                CREATE INDEX "IX_Reels_SearchVector"
                ON "Reels"
                USING GIN ("SearchVector");
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP INDEX IF EXISTS \"IX_Groups_SearchVector\";");
            migrationBuilder.Sql("ALTER TABLE \"Groups\" DROP COLUMN IF EXISTS \"SearchVector\";");

            migrationBuilder.Sql("DROP INDEX IF EXISTS \"IX_Users_SearchVector\";");
            migrationBuilder.Sql("ALTER TABLE \"Users\" DROP COLUMN IF EXISTS \"SearchVector\";");

            migrationBuilder.Sql("DROP INDEX IF EXISTS \"IX_Messages_SearchVector\";");
            migrationBuilder.Sql("ALTER TABLE \"Messages\" DROP COLUMN IF EXISTS \"SearchVector\";");

            migrationBuilder.Sql("DROP INDEX IF EXISTS \"IX_Reels_SearchVector\";");
            migrationBuilder.Sql("ALTER TABLE \"Reels\" DROP COLUMN IF EXISTS \"SearchVector\";");
        }
    }
}
