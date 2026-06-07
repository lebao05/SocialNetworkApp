using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class StoryConfiguration : IEntityTypeConfiguration<Story>
{
    public void Configure(EntityTypeBuilder<Story> builder)
    {
        builder.ToTable("Stories");

        builder.HasKey(s => s.Id);

        builder.Property(s => s.Id)
            .HasColumnName("StoryId");

        builder.Property(s => s.UserId)
            .IsRequired();

        builder.Property(s => s.MediaUrl)
            .HasColumnType("TEXT");

        builder.Property(s => s.MediaType)
            .HasConversion<string>()
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(s => s.BackgroundGradient)
            .HasColumnType("TEXT");

        builder.Property(s => s.TextContent)
            .HasColumnType("TEXT");

        builder.Property(s => s.TextColor)
            .HasMaxLength(20);

        builder.Property(s => s.TextStyle)
            .HasMaxLength(50);

        builder.Property(s => s.TextPositionX)
            .HasMaxLength(20);

        builder.Property(s => s.TextPositionY)
            .HasMaxLength(20);

        builder.Property(s => s.FontFamily)
            .HasMaxLength(100);

        builder.Property(s => s.ExpiresAt)
            .IsRequired();

        builder.Property(s => s.CreatedAt)
            .IsRequired();

        builder.HasOne(s => s.User)
            .WithMany(u => u.Stories)
            .HasForeignKey(s => s.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Navigation(s => s.Reactions)
            .HasField("_reactions")
            .UsePropertyAccessMode(PropertyAccessMode.Field);

        builder.HasMany(s => s.Reactions)
            .WithOne(r => r.Story)
            .HasForeignKey(r => r.StoryId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(s => s.SeenByUsers)
            .WithOne(ss => ss.Story)
            .HasForeignKey(ss => ss.StoryId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Navigation(s => s.SeenByUsers)
            .HasField("_seenByUsers")
            .UsePropertyAccessMode(PropertyAccessMode.Field);

        builder.Ignore(s => s.IsExpired);
    }
}
