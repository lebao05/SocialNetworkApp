using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class ReactionConfiguration : IEntityTypeConfiguration<Reaction>
    {
        public void Configure(EntityTypeBuilder<Reaction> builder)
        {
            builder.ToTable("Reactions");

            // Primary Key: Inherited Id from BaseEntity mapped to "ReactionId" in database
            builder.HasKey(r => r.Id);
            
            builder.Property(r => r.Id)
                .HasColumnName("ReactionId");

            // PostId configuration (BIGINT NULL)
            builder.Property(r => r.PostId)
                .IsRequired(false);

            // CommentId configuration (BIGINT NULL)
            builder.Property(r => r.CommentId)
                .IsRequired(false);

            // Reaction Type configuration (SMALLINT)
            builder.Property(r => r.ReactionType)
                .IsRequired()
                .HasColumnType("SMALLINT");

            // Timestamp tracking
            builder.Property(r => r.CreatedAt)
                .IsRequired();


            // Unique composite index: A user can only react to a specific Post once
            builder.HasIndex(r => new { r.UserId, r.PostId })
                .IsUnique();

            // Unique composite index: A user can only react to a specific Comment once
            builder.HasIndex(r => new { r.UserId, r.CommentId })
                .IsUnique();
        }
    }
}
