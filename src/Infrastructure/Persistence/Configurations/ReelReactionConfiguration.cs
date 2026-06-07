using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class ReelReactionConfiguration : IEntityTypeConfiguration<ReelReaction>
    {
        public void Configure(EntityTypeBuilder<ReelReaction> builder)
        {
            builder.ToTable("ReelReactions");

            builder.HasKey(r => r.Id);

            builder.Property(r => r.Id)
                .HasColumnName("ReactionId");

            builder.Property(r => r.UserId)
                .IsRequired();

            builder.Property(r => r.ReelId)
                .IsRequired();

            builder.Property(r => r.CreatedAt)
                .IsRequired();

            builder.HasOne(r => r.Reel)
                .WithMany(reel => reel.Reactions)
                .HasForeignKey(r => r.ReelId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(r => r.User)
                .WithMany(u => u.ReelReactions)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasIndex(r => new { r.UserId, r.ReelId })
                .IsUnique();
        }
    }
}
