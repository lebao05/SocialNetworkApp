using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class PostCommentConfiguration : IEntityTypeConfiguration<PostComment>
    {
        public void Configure(EntityTypeBuilder<PostComment> builder)
        {
            builder.ToTable("PostComments");

            // Primary Key: Inherited Id from BaseEntity mapped to "CommentId" in database
            builder.HasKey(pc => pc.Id);
            
            builder.Property(pc => pc.Id)
                .HasColumnName("CommentId");

            // Comment text content (TEXT)
            builder.Property(pc => pc.Content)
                .IsRequired()
                .HasColumnType("TEXT");

            // Timestamp tracking
            builder.Property(pc => pc.CreatedAt)
                .IsRequired();

            // Nullable Soft Delete tracking
            builder.Property(pc => pc.DeletedAt)
                .IsRequired(false);

            // Self-referencing Relationship: PostComment -> ParentComment (Replies)
            builder.HasOne(pc => pc.ParentComment)
                .WithMany(pc => pc.Replies)
                .HasForeignKey(pc => pc.ParentCommentId)
                .OnDelete(DeleteBehavior.Restrict); // Restrict deletion to prevent recursive cascading anomalies

            // ===================================
            // Navigation Backing Fields & relationships
            // ===================================

            builder.Navigation(pc => pc.Replies)
                .HasField("_replies")
                .UsePropertyAccessMode(PropertyAccessMode.Field);

            // PostComment -> Reactions
            builder.HasMany(pc => pc.Reactions)
                .WithOne(r => r.Comment)
                .HasForeignKey(r => r.CommentId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Navigation(pc => pc.Reactions)
                .HasField("_reactions")
                .UsePropertyAccessMode(PropertyAccessMode.Field);

            // Soft delete query filter (ignores soft-deleted rows by default!)
            builder.HasQueryFilter(pc => pc.DeletedAt == null);
        }
    }
}
