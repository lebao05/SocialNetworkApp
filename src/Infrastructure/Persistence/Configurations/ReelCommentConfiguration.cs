using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class ReelCommentConfiguration : IEntityTypeConfiguration<ReelComment>
    {
        public void Configure(EntityTypeBuilder<ReelComment> builder)
        {
            builder.ToTable("ReelComments");

            builder.HasKey(rc => rc.Id);

            builder.Property(rc => rc.Id)
                .HasColumnName("CommentId");

            builder.Property(rc => rc.ReelId)
                .IsRequired();

            builder.Property(rc => rc.UserId)
                .IsRequired();

            builder.Property(rc => rc.Content)
                .IsRequired()
                .HasColumnType("TEXT");

            builder.Property(rc => rc.CreatedAt)
                .IsRequired();

            builder.Property(rc => rc.DeletedAt)
                .IsRequired(false);

            builder.Property(rc => rc.RepliedUserId)
                .IsRequired(false);

            builder.HasOne(rc => rc.Reel)
                .WithMany(r => r.Comments)
                .HasForeignKey(rc => rc.ReelId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(rc => rc.User)
                .WithMany(u => u.ReelComments)
                .HasForeignKey(rc => rc.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(rc => rc.RepliedUser)
                .WithMany()
                .HasForeignKey(rc => rc.RepliedUserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(rc => rc.ParentComment)
                .WithMany(rc => rc.Replies)
                .HasForeignKey(rc => rc.ParentCommentId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Navigation(rc => rc.Replies)
                .HasField("_replies")
                .UsePropertyAccessMode(PropertyAccessMode.Field);

            builder.HasQueryFilter(rc => rc.DeletedAt == null);
        }
    }
}
