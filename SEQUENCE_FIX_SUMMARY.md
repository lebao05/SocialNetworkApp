# PostgreSQL Sequence Sync Fix

## Problem
The application was throwing duplicate key violations when creating new posts:
```
23505: duplicate key value violates unique constraint "PK_Posts"
```

## Root Cause
Both `TestDataSeeder.cs` and `BulkSeeder.cs` insert rows with **explicit IDs** using raw SQL:
```csharp
await db.Database.ExecuteSqlInterpolatedAsync(
    $@"INSERT INTO ""Posts"" (""Id"", ""AuthorId""...) VALUES ({postId}, ...)");
```

When you manually specify IDs in PostgreSQL, the underlying **identity sequence does NOT advance**. Later, when EF Core creates a post with `id: 0` (auto-generate), the sequence returns `1`, which already exists → duplicate key error.

## Solution Applied
Added `SyncIdentitySequencesAsync()` method to both seeders that runs **after all inserts** to reset sequences:

```csharp
await db.Database.ExecuteSqlRawAsync(
    @"SELECT setval(
        pg_get_serial_sequence('""Posts""', '""PostId""'),
        COALESCE((SELECT MAX(""PostId"") FROM ""Posts""), 1),
        true
    )");
```

The `true` parameter means the next `nextval()` will return `MAX(PostId) + 1`, preventing collisions.

## Files Modified
1. **TestDataSeeder.cs** - Added `SyncIdentitySequencesAsync()` at line 482
   - Syncs: Posts, Reels, PostComments, Groups
2. **BulkSeeder.cs** - Added `SyncIdentitySequencesAsync()` at line 205
   - Syncs: Posts, Reels, PostComments, Groups, Friendships

## Testing
After next time you run the seeder (via `/admin/seed-test-data` or `/admin/bulk-seed`), the sequences will be synchronized automatically.

You can also manually fix existing data by running this in Supabase SQL Editor:

```sql
-- Posts
SELECT setval(
    pg_get_serial_sequence('"Posts"', '"PostId"'),
    (SELECT COALESCE(MAX("PostId"), 1) FROM "Posts"),
    true
);

-- Reels
SELECT setval(
    pg_get_serial_sequence('"Reels"', '"ReelId"'),
    (SELECT COALESCE(MAX("ReelId"), 1) FROM "Reels"),
    true
);

-- Comments
SELECT setval(
    pg_get_serial_sequence('"PostComments"', '"CommentId"'),
    (SELECT COALESCE(MAX("CommentId"), 1) FROM "PostComments"),
    true
);

-- Groups
SELECT setval(
    pg_get_serial_sequence('"Groups"', '"GroupId"'),
    (SELECT COALESCE(MAX("GroupId"), 1) FROM "Groups"),
    true
);
```

## Next Steps
1. Stop the running Web application
2. Rebuild: `dotnet build`
3. Run the SQL fix above in Supabase (one-time)
4. Start the app and test creating a post via API

The duplicate key error should be resolved.
