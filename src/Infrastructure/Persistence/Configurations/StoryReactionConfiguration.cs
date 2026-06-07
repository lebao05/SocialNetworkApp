using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class StoryReactionConfiguration : IEntityTypeConfiguration<StoryReaction>
{
    public void Configure(EntityTypeBuilder<StoryReaction> builder)
    {
        builder.ToTable("StoryReactions");

        builder.HasKey(r => r.Id);

        builder.Property(r => r.Id)
            .HasColumnName("ReactionId");

        builder.Property(r => r.UserId)
            .IsRequired();

        builder.Property(r => r.StoryId)
            .IsRequired();

        builder.Property(r => r.CreatedAt)
            .IsRequired();

        builder.HasOne(r => r.Story)
            .WithMany(s => s.Reactions)
            .HasForeignKey(r => r.StoryId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(r => r.User)
            .WithMany(u => u.StoryReactions)
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(r => new { r.UserId, r.StoryId })
            .IsUnique();
    }
}
