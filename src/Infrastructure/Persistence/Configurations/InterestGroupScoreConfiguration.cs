using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class InterestGroupScoreConfiguration : IEntityTypeConfiguration<InterestGroupScore>
    {
        public void Configure(EntityTypeBuilder<InterestGroupScore> builder)
        {
            builder.ToTable("InterestGroupScores");

            builder.HasKey(score => score.Id);

            builder.Property(score => score.Score)
                .IsRequired();

            builder.Property(score => score.CreatedAt)
                .IsRequired();

            builder.HasIndex(score => new { score.UserId, score.GroupId })
                .IsUnique();

            builder.HasIndex(score => new { score.UserId, score.Score });

            builder.HasOne(score => score.User)
                .WithMany(user => user.GroupInterestScores)
                .HasForeignKey(score => score.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(score => score.Group)
                .WithMany()
                .HasForeignKey(score => score.GroupId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
