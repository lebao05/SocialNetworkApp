using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class PostTagConfiguration : IEntityTypeConfiguration<PostTag>
    {
        public void Configure(EntityTypeBuilder<PostTag> builder)
        {
            builder.ToTable("PostTags");

            builder.HasKey(pt => pt.Id);

            builder.Property(pt => pt.Id)
                .HasColumnName("PostTagId");

            builder.Property(pt => pt.UserId)
                .IsRequired();

            builder.Property(pt => pt.CreatedAt)
                .IsRequired();

            // Relationship: PostTag -> Post
            builder.HasOne(pt => pt.Post)
                .WithMany(p => p.Tags)
                .HasForeignKey(pt => pt.PostId)
                .OnDelete(DeleteBehavior.Cascade);

            // Relationship: PostTag -> User
            builder.HasOne(pt => pt.User)
                .WithMany()
                .HasForeignKey(pt => pt.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
