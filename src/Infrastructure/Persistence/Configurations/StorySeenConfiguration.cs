using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class StorySeenConfiguration : IEntityTypeConfiguration<StorySeen>
    {
        public void Configure(EntityTypeBuilder<StorySeen> builder)
        {
            builder.ToTable("StorySeens");

            builder.HasKey(ss => ss.Id);

            builder.Property(ss => ss.Id)
                .HasColumnName("StorySeenId");

            builder.Property(ss => ss.StoryId)
                .IsRequired();

            builder.Property(ss => ss.UserId)
                .IsRequired();

            builder.Property(ss => ss.SeenAt)
                .IsRequired();

            builder.HasOne(ss => ss.Story)
                .WithMany(s => s.SeenByUsers)
                .HasForeignKey(ss => ss.StoryId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(ss => ss.User)
                .WithMany(u => u.SeenStories)
                .HasForeignKey(ss => ss.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasIndex(ss => new { ss.StoryId, ss.UserId })
                .IsUnique();
        }
    }
}
