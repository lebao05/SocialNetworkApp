using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NpgsqlTypes;

namespace Infrastructure.Persistence.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.ToTable("Users");

            // SearchVector (shadow property — DB-generated GIN-indexed column)
            builder.Property<NpgsqlTsVector>("SearchVector")
                .HasColumnType("tsvector")
                .ValueGeneratedOnAdd();

            // ✅ Required fields
            builder.Property(u => u.FirstName)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(u => u.LastName)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(u => u.DateOfBirth)
                .IsRequired();

            builder.Property(u => u.Gender)
                .IsRequired();

            builder.Property(u => u.AvatarUrl)
                .HasMaxLength(2000);

            builder.Property(u => u.Bio)
                .HasColumnType("TEXT");

            builder.Property(u => u.CoverPhotoUrl)
                .HasColumnType("TEXT");

            builder.Property(u => u.CurrentLocation)
                .HasMaxLength(255);

            builder.Property(u => u.Hometown)
                .HasMaxLength(255);

            builder.Property(u => u.Website)
                .HasColumnType("TEXT");

            builder.Property(u => u.RelationshipStatus)
                .IsRequired(false)
                .HasColumnType("SMALLINT");

            // Optional: normalize email length
            builder.Property(u => u.Email)
                .HasMaxLength(256);

            builder.Property(u => u.UserName)
                .HasMaxLength(256);

            // Conversations (backing field)
            builder.HasMany(u => u.Conversations)
                .WithOne(cm => cm.User)
                .HasForeignKey(cm => cm.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Blocked users (self relationship via BlockChat)
            builder.HasMany(u => u.BlockedUsers)
                .WithOne(b => b.User)
                .HasForeignKey(b => b.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // 🔥 Important: tell EF to use backing fields
            builder.Navigation(u => u.Conversations)
                .HasField("_conversations")
                .UsePropertyAccessMode(PropertyAccessMode.Field);

            builder.Navigation(u => u.BlockedUsers)
                .HasField("_blockedUsers")
                .UsePropertyAccessMode(PropertyAccessMode.Field);

            // =============================
            // Friendships
            // =============================

            builder.HasMany(u => u.Friends)
                .WithOne(f => f.User1)
                .HasForeignKey(f => f.User1Id)
                .OnDelete(DeleteBehavior.Restrict);

            // IMPORTANT: second side must NOT reuse same navigation
            builder.HasMany<Friendship>()
                .WithOne(f => f.User2)
                .HasForeignKey(f => f.User2Id)
                .OnDelete(DeleteBehavior.Restrict);

            // =============================
            // Friend Requests
            // =============================

            builder.HasMany(u => u.SentRequests)
                .WithOne(fr => fr.Sender)
                .HasForeignKey(fr => fr.SenderId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(u => u.ReceivedRequests)
                .WithOne(fr => fr.Receiver)
                .HasForeignKey(fr => fr.ReceiverId)
                .OnDelete(DeleteBehavior.Restrict);

            // =============================
            // Backing fields
            // =============================

            builder.Navigation(u => u.Friends)
                .HasField("_friends")
                .UsePropertyAccessMode(PropertyAccessMode.Field);

            builder.Navigation(u => u.SentRequests)
                .HasField("_sentRequests")
                .UsePropertyAccessMode(PropertyAccessMode.Field);

            builder.Navigation(u => u.ReceivedRequests)
                .HasField("_receivedRequests")
                .UsePropertyAccessMode(PropertyAccessMode.Field);

            builder.Navigation(u => u.Following)
                .HasField("_following")
                .UsePropertyAccessMode(PropertyAccessMode.Field);

            builder.Navigation(u => u.Followers)
                .HasField("_followers")
                .UsePropertyAccessMode(PropertyAccessMode.Field);

            // =============================
            // Newly added backing fields & relationships
            // =============================

            // User -> Posts
            builder.HasMany(u => u.Posts)
                .WithOne(p => p.Author)
                .HasForeignKey(p => p.AuthorId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Navigation(u => u.Posts)
                .HasField("_posts")
                .UsePropertyAccessMode(PropertyAccessMode.Field);

            // User -> Stories
            builder.HasMany(u => u.Stories)
                .WithOne(s => s.User)
                .HasForeignKey(s => s.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Navigation(u => u.Stories)
                .HasField("_stories")
                .UsePropertyAccessMode(PropertyAccessMode.Field);

            // User -> StorySeens
            builder.HasMany(u => u.StorySeens)
                .WithOne(ss => ss.User)
                .HasForeignKey(ss => ss.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Navigation(u => u.StorySeens)
                .HasField("_storySeens")
                .UsePropertyAccessMode(PropertyAccessMode.Field);

            // User -> Comments
            builder.HasMany(u => u.Comments)
                .WithOne(pc => pc.User)
                .HasForeignKey(pc => pc.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Navigation(u => u.Comments)
                .HasField("_comments")
                .UsePropertyAccessMode(PropertyAccessMode.Field);

            // User -> CommentReactions
            builder.HasMany(u => u.CommentReactions)
                .WithOne(r => r.User)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Navigation(u => u.CommentReactions)
                .HasField("_commentReactions")
                .UsePropertyAccessMode(PropertyAccessMode.Field);

            // User -> SavedPosts
            builder.HasMany(u => u.SavedPosts)
                .WithOne(sp => sp.User)
                .HasForeignKey(sp => sp.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Navigation(u => u.SavedPosts)
                .HasField("_savedPosts")
                .UsePropertyAccessMode(PropertyAccessMode.Field);

            // User -> UserFeeds
            builder.HasMany(u => u.UserFeeds)
                .WithOne(uf => uf.User)
                .HasForeignKey(uf => uf.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Navigation(u => u.UserFeeds)
                .HasField("_userFeeds")
                .UsePropertyAccessMode(PropertyAccessMode.Field);

            // User -> ReceivedNotifications
            builder.HasMany(u => u.ReceivedNotifications)
                .WithOne(n => n.RecipientUser)
                .HasForeignKey(n => n.RecipientUserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Navigation(u => u.ReceivedNotifications)
                .HasField("_receivedNotifications")
                .UsePropertyAccessMode(PropertyAccessMode.Field);

            // User -> OwnedGroups
            builder.HasMany(u => u.OwnedGroups)
                .WithOne(g => g.Owner)
                .HasForeignKey(g => g.OwnerUserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Navigation(u => u.OwnedGroups)
                .HasField("_ownedGroups")
                .UsePropertyAccessMode(PropertyAccessMode.Field);

            // User -> GroupMemberships
            builder.HasMany(u => u.GroupMemberships)
                .WithOne(gm => gm.User)
                .HasForeignKey(gm => gm.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Navigation(u => u.GroupMemberships)
                .HasField("_groupMemberships")
                .UsePropertyAccessMode(PropertyAccessMode.Field);

            // User -> Schools
            builder.HasMany(u => u.Schools)
                .WithOne(s => s.User)
                .HasForeignKey(s => s.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Navigation(u => u.Schools)
                .HasField("_schools")
                .UsePropertyAccessMode(PropertyAccessMode.Field);

            // =============================
            // Indexes (optional but good)
            // =============================

            builder.HasIndex(u => u.Email);
            builder.HasIndex(u => u.UserName);
        }
    }
}
