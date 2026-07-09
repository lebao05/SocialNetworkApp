using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NpgsqlTypes;

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

            // SearchVector (shadow property — DB-generated GIN-indexed column)
            builder.Property<NpgsqlTsVector>("SearchVector")
                .HasColumnType("tsvector")
                .ValueGeneratedOnAdd();

            // Post -> Group (many-to-one)
            builder.HasOne(p => p.Group)
                .WithMany(g => g.Posts)
                .HasForeignKey(p => p.GroupId)
                .OnDelete(DeleteBehavior.Cascade);

            // Content configuration (TEXT)
            builder.Property(p => p.Content)
                .IsRequired(false)
                .HasColumnType("TEXT");

            // Visibility configuration (SMALLINT)
            builder.Property(p => p.Visibility)
                .IsRequired()
                .HasColumnType("SMALLINT");

            // Location Tag configuration
            builder.Property(p => p.LocationTag)
                .HasMaxLength(255);

            // Feeling/Activity status configuration (store enum as string)
            builder.Property(p => p.FeelingActivity)
                .HasConversion<string>();

            // Timestamp tracking
            builder.Property(p => p.CreatedAt)
                .IsRequired();

            // Nullable Soft Delete tracking
            builder.Property(p => p.DeletedAt)
                .IsRequired(false);

            // Post approval status (group posts with IsPostApprovalRequired = true)
            builder.Property(p => p.ApprovalStatus)
                .IsRequired()
                .HasColumnType("SMALLINT")
                .HasDefaultValue(Domain.Enums.PostApprovalStatus.Approved);

            builder.Property(p => p.IsHiddenFromGroup)
                .IsRequired()
                .HasDefaultValue(false);

            builder.Property(p => p.HiddenAt)
                .IsRequired(false);

            builder.Property(p => p.HideReason)
                .HasMaxLength(1000);

            builder.Property(p => p.IsAnonymous)
                .IsRequired()
                .HasDefaultValue(false);

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

            // Post -> Tags
            builder.HasMany(p => p.Tags)
                .WithOne(pt => pt.Post)
                .HasForeignKey(pt => pt.PostId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Navigation(p => p.Tags)
                .HasField("_tags")
                .UsePropertyAccessMode(PropertyAccessMode.Field);

            builder.HasQueryFilter(p => p.DeletedAt == null);

        }
    }
}
