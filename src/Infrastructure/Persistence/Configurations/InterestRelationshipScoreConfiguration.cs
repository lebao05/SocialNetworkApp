using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class InterestRelationshipScoreConfiguration : IEntityTypeConfiguration<InterestRelationshipScore>
    {
        public void Configure(EntityTypeBuilder<InterestRelationshipScore> builder)
        {
            builder.ToTable("InterestRelationshipScores");

            builder.HasKey(score => score.Id);

            builder.Property(score => score.Score)
                .IsRequired();

            builder.Property(score => score.CreatedAt)
                .IsRequired();

            builder.HasIndex(score => new { score.UserId, score.TargetUserId })
                .IsUnique();

            builder.HasIndex(score => new { score.UserId, score.Score });

            builder.HasOne(score => score.User)
                .WithMany(user => user.InterestScores)
                .HasForeignKey(score => score.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(score => score.TargetUser)
                .WithMany()
                .HasForeignKey(score => score.TargetUserId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
