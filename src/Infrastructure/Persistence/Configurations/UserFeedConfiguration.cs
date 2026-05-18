using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class UserFeedConfiguration : IEntityTypeConfiguration<UserFeed>
    {
        public void Configure(EntityTypeBuilder<UserFeed> builder)
        {
            builder.ToTable("UserFeeds");

            // Primary Key: Inherited Id from BaseEntity mapped to "FeedId" in database
            builder.HasKey(uf => uf.Id);
            
            builder.Property(uf => uf.Id)
                .HasColumnName("FeedId");

            // Score configuration (FLOAT)
            builder.Property(uf => uf.Score)
                .IsRequired();

            // FeedType configuration (SMALLINT)
            builder.Property(uf => uf.FeedType)
                .IsRequired()
                .HasColumnType("SMALLINT");

            // IsSeen configuration (BOOLEAN)
            builder.Property(uf => uf.IsSeen)
                .IsRequired();

            // Relationship: UserFeed -> SourceUser (Author)
            builder.HasOne(uf => uf.SourceUser)
                .WithMany()
                .HasForeignKey(uf => uf.SourceUserId)
                .OnDelete(DeleteBehavior.Restrict);

            // High-performance indices for newsfeed scoring & chronological ordering
            builder.HasIndex(uf => new { uf.UserId, uf.IsSeen, uf.Score });
            builder.HasIndex(uf => new { uf.UserId, uf.CreatedAt });
        }
    }
}
