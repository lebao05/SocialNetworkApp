using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class PostMediaConfiguration : IEntityTypeConfiguration<PostMedia>
    {
        public void Configure(EntityTypeBuilder<PostMedia> builder)
        {
            builder.ToTable("PostMedia");

            // Primary Key: Inherited Id from BaseEntity mapped to "MediaId" in database
            builder.HasKey(pm => pm.Id);
            
            builder.Property(pm => pm.Id)
                .HasColumnName("MediaId");

            // Media Type configuration (configured as a string)
            builder.Property(pm => pm.MediaType)
                .IsRequired()
                .HasMaxLength(50); // e.g. "Image", "Video", "Reel"

            // Media URL configuration (TEXT)
            builder.Property(pm => pm.MediaUrl)
                .IsRequired()
                .HasColumnType("TEXT");

            // Thumbnail URL configuration (TEXT)
            builder.Property(pm => pm.ThumbnailUrl)
                .HasColumnType("TEXT");

            // Metadata configuration mapped to PostgreSQL JSONB type
            builder.Property(pm => pm.Metadata)
                .HasColumnType("jsonb");

            // UploadedAt configuration
            builder.Property(pm => pm.UploadedAt)
                .IsRequired();

        }
    }
}
