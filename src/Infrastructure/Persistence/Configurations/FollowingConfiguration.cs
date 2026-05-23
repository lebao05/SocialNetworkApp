using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class FollowingConfiguration : IEntityTypeConfiguration<Following>
    {
        public void Configure(EntityTypeBuilder<Following> builder)
        {
            builder.ToTable("Followings");

            builder.HasKey(f => f.Id);

            builder.Property(f => f.CreatedAt)
                .IsRequired();

            builder.HasIndex(f => new { f.FollowerId, f.FolloweeId })
                .IsUnique();

            builder.HasOne(f => f.Follower)
                .WithMany(u => u.Following)
                .HasForeignKey(f => f.FollowerId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(f => f.Followee)
                .WithMany(u => u.Followers)
                .HasForeignKey(f => f.FolloweeId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
