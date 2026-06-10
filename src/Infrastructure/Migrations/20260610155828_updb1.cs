using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class updb1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // ── Groups ────────────────────────────────────────────────────────
            migrationBuilder.Sql("""
                ALTER TABLE "Groups"
                    ADD COLUMN "SearchVector" tsvector
                    GENERATED ALWAYS AS (to_tsvector('english', coalesce("Name", ''))) STORED;
                """);
            migrationBuilder.Sql("""
                CREATE INDEX "IX_Groups_SearchVector"
                    ON "Groups" USING GIN ("SearchVector");
                """);

            // ── Users ─────────────────────────────────────────────────────────
            migrationBuilder.Sql("""
                ALTER TABLE "AspNetUsers"
                    ADD COLUMN "SearchVector" tsvector
                    GENERATED ALWAYS AS (
                        to_tsvector('english', coalesce("FirstName", '') || ' ' || coalesce("LastName", ''))
                    ) STORED;
                """);
            migrationBuilder.Sql("""
                CREATE INDEX "IX_AspNetUsers_SearchVector"
                    ON "AspNetUsers" USING GIN ("SearchVector");
                """);

            // ── Conversations ────────────────────────────────────────────────
            migrationBuilder.Sql("""
                ALTER TABLE "Conversations"
                    ADD COLUMN "SearchVector" tsvector
                    GENERATED ALWAYS AS (to_tsvector('english', coalesce("Name", ''))) STORED;
                """);
            migrationBuilder.Sql("""
                CREATE INDEX "IX_Conversations_SearchVector"
                    ON "Conversations" USING GIN ("SearchVector");
                """);

            // ── Messages ──────────────────────────────────────────────────────
            migrationBuilder.Sql("""
                ALTER TABLE "Messages"
                    ADD COLUMN "SearchVector" tsvector
                    GENERATED ALWAYS AS (to_tsvector('english', coalesce("Content", ''))) STORED;
                """);
            migrationBuilder.Sql("""
                CREATE INDEX "IX_Messages_SearchVector"
                    ON "Messages" USING GIN ("SearchVector");
                """);

            // ── Posts (existing) ───────────────────────────────────────────────
            migrationBuilder.Sql("""
                ALTER TABLE "Posts" ADD COLUMN "SearchVector" tsvector GENERATED ALWAYS AS ( to_tsvector('english', coalesce("Content", '')) ) STORED;
                """);
            migrationBuilder.Sql("""
                CREATE INDEX "IX_Posts_SearchVector" ON "Posts" USING GIN ("SearchVector");
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP INDEX IF EXISTS \"IX_Posts_SearchVector\";");
            migrationBuilder.Sql("ALTER TABLE \"Posts\" DROP COLUMN IF EXISTS \"SearchVector\";");

            migrationBuilder.Sql("DROP INDEX IF EXISTS \"IX_Messages_SearchVector\";");
            migrationBuilder.Sql("ALTER TABLE \"Messages\" DROP COLUMN IF EXISTS \"SearchVector\";");

            migrationBuilder.Sql("DROP INDEX IF EXISTS \"IX_Conversations_SearchVector\";");
            migrationBuilder.Sql("ALTER TABLE \"Conversations\" DROP COLUMN IF EXISTS \"SearchVector\";");

            migrationBuilder.Sql("DROP INDEX IF EXISTS \"IX_AspNetUsers_SearchVector\";");
            migrationBuilder.Sql("ALTER TABLE \"AspNetUsers\" DROP COLUMN IF EXISTS \"SearchVector\";");

            migrationBuilder.Sql("DROP INDEX IF EXISTS \"IX_Groups_SearchVector\";");
            migrationBuilder.Sql("ALTER TABLE \"Groups\" DROP COLUMN IF EXISTS \"SearchVector\";");
        }
    }
}
