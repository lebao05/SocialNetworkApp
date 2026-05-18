using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class SavedPostConfiguration : IEntityTypeConfiguration<SavedPost>
    {
        public void Configure(EntityTypeBuilder<SavedPost> builder)
        {
            builder.ToTable("SavedPosts");

            // Primary Key: Inherited Id from BaseEntity mapped to "SavedPostId" in database
            builder.HasKey(sp => sp.Id);
            
            builder.Property(sp => sp.Id)
                .HasColumnName("SavedPostId");

            // Timestamp tracking
            builder.Property(sp => sp.CreatedAt)
                .IsRequired();

            // Unique index to prevent duplicate saves of the same post by a single user
            builder.HasIndex(sp => new { sp.UserId, sp.PostId })
                .IsUnique();
        }
    }
}
