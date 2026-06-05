using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class ReelConfiguration : IEntityTypeConfiguration<Reel>
    {
        public void Configure(EntityTypeBuilder<Reel> builder)
        {
            builder.ToTable("Reels");

            builder.HasKey(r => r.Id);

            builder.Property(r => r.Id)
                .HasColumnName("ReelId");

            builder.Property(r => r.AuthorId)
                .IsRequired();

            builder.Property(r => r.VideoUrl)
                .IsRequired()
                .HasColumnType("TEXT");

            builder.Property(r => r.ThumbnailUrl)
                .IsRequired(false)
                .HasColumnType("TEXT");

            builder.Property(r => r.Caption)
                .IsRequired(false)
                .HasColumnType("TEXT");

            builder.Property(r => r.AudioTitle)
                .HasMaxLength(255);

            builder.Property(r => r.Duration)
                .HasMaxLength(50);

            builder.Property(r => r.Visibility)
                .IsRequired()
                .HasColumnType("SMALLINT");

            builder.Property(r => r.CreatedAt)
                .IsRequired();

            builder.Property(r => r.DeletedAt)
                .IsRequired(false);

            builder.HasOne(r => r.Author)
                .WithMany(u => u.Reels)
                .HasForeignKey(r => r.AuthorId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(r => r.Comments)
                .WithOne(c => c.Reel)
                .HasForeignKey(c => c.ReelId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Navigation(r => r.Comments)
                .HasField("_comments")
                .UsePropertyAccessMode(PropertyAccessMode.Field);

            builder.HasMany(r => r.Reactions)
                .WithOne(rr => rr.Reel)
                .HasForeignKey(rr => rr.ReelId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Navigation(r => r.Reactions)
                .HasField("_reactions")
                .UsePropertyAccessMode(PropertyAccessMode.Field);

            builder.HasMany(r => r.SeenByUsers)
                .WithOne(ss => ss.Story)
                .HasForeignKey(ss => ss.StoryId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Navigation(r => r.SeenByUsers)
                .HasField("_seenByUsers")
                .UsePropertyAccessMode(PropertyAccessMode.Field);

            builder.HasQueryFilter(r => r.DeletedAt == null);
        }
    }
}
