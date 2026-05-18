using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class PostConfiguration : IEntityTypeConfiguration<Post>
    {
        public void Configure(EntityTypeBuilder<Post> builder)
        {
            builder.ToTable("Posts");

            // Primary Key: Inherited Id from BaseEntity mapped to "PostId" in database
            builder.HasKey(p => p.Id);
            
            builder.Property(p => p.Id)
                .HasColumnName("PostId");

            // Author Type configuration (SMALLINT)
            builder.Property(p => p.AuthorType)
                .IsRequired()
                .HasColumnType("SMALLINT");

            // Content configuration (TEXT)
            builder.Property(p => p.Content)
                .IsRequired()
                .HasColumnType("TEXT");

            // Visibility configuration (SMALLINT)
            builder.Property(p => p.Visibility)
                .IsRequired()
                .HasColumnType("SMALLINT");

            // Location Tag configuration
            builder.Property(p => p.LocationTag)
                .HasMaxLength(255);

            // Feeling/Activity status configuration
            builder.Property(p => p.FeelingActivity)
                .HasMaxLength(100);

            // Timestamp tracking
            builder.Property(p => p.CreatedAt)
                .IsRequired();

            // Nullable Soft Delete tracking
            builder.Property(p => p.DeletedAt)
                .IsRequired(false);

            // Self-referencing Relationship: Post -> SharePost (Post)
            builder.HasOne(p => p.SharePost)
                .WithMany()
                .HasForeignKey(p => p.SharePostId)
                .OnDelete(DeleteBehavior.SetNull); // If original post is deleted, shared post reference is set to NULL

            // ===================================
            // Navigation Backing Fields & relationships
            // ===================================

            // Post -> Media
            builder.HasMany(p => p.Media)
                .WithOne(pm => pm.Post)
                .HasForeignKey(pm => pm.PostId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Navigation(p => p.Media)
                .HasField("_media")
                .UsePropertyAccessMode(PropertyAccessMode.Field);

            // Post -> Comments
            builder.HasMany(p => p.Comments)
                .WithOne(pc => pc.Post)
                .HasForeignKey(pc => pc.PostId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Navigation(p => p.Comments)
                .HasField("_comments")
                .UsePropertyAccessMode(PropertyAccessMode.Field);

            // Post -> SavedPosts
            builder.HasMany(p => p.SavedPosts)
                .WithOne(sp => sp.Post)
                .HasForeignKey(sp => sp.PostId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Navigation(p => p.SavedPosts)
                .HasField("_savedPosts")
                .UsePropertyAccessMode(PropertyAccessMode.Field);

            // Post -> UserFeeds
            builder.HasMany(p => p.UserFeeds)
                .WithOne(uf => uf.Post)
                .HasForeignKey(uf => uf.PostId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Navigation(p => p.UserFeeds)
                .HasField("_userFeeds")
                .UsePropertyAccessMode(PropertyAccessMode.Field);

            // Post -> Reactions
            builder.HasMany(p => p.Reactions)
                .WithOne(r => r.Post)
                .HasForeignKey(r => r.PostId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Navigation(p => p.Reactions)
                .HasField("_reactions")
                .UsePropertyAccessMode(PropertyAccessMode.Field);

            // Soft delete query filter (ignores soft-deleted rows by default!)
            builder.HasQueryFilter(p => p.DeletedAt == null);
        }
    }
}
