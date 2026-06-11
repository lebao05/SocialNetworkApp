using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class PostReactionConfiguration : IEntityTypeConfiguration<PostReaction>
    {
        public void Configure(EntityTypeBuilder<PostReaction> builder)
        {
            builder.ToTable("PostReactions");

            builder.HasKey(r => r.Id);
            builder.Property(r => r.Id)
                .HasColumnName("ReactionId");

            builder.Property(r => r.UserId)
                .IsRequired();

            builder.Property(r => r.PostId)
                .IsRequired();

            builder.Property(r => r.ReactionType)
                .IsRequired()
                .HasColumnType("SMALLINT");

            builder.Property(r => r.CreatedAt)
                .IsRequired();

            builder.HasOne(r => r.Post)
                .WithMany(p => p.Reactions)
                .HasForeignKey(r => r.PostId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(r => new { r.UserId, r.PostId })
                .IsUnique();
        }
    }

    public class CommentReactionConfiguration : IEntityTypeConfiguration<CommentReaction>
    {
        public void Configure(EntityTypeBuilder<CommentReaction> builder)
        {
            builder.ToTable("CommentReactions");

            builder.HasKey(r => r.Id);
            builder.Property(r => r.Id)
                .HasColumnName("ReactionId");

            builder.Property(r => r.UserId)
                .IsRequired();

            builder.Property(r => r.CommentId)
                .IsRequired();

            builder.Property(r => r.ReactionType)
                .IsRequired()
                .HasColumnType("SMALLINT");

            builder.Property(r => r.CreatedAt)
                .IsRequired();

            builder.HasOne(r => r.Comment)
                .WithMany()
                .HasForeignKey(r => r.CommentId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(r => r.User)
                .WithMany(u => u.CommentReactions)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasIndex(r => new { r.UserId, r.CommentId })
                .IsUnique();
        }
    }

    public class MessageReactionConfiguration : IEntityTypeConfiguration<MessageReaction>
    {
        public void Configure(EntityTypeBuilder<MessageReaction> builder)
        {
            builder.ToTable("MessageReactions");

            builder.HasKey(r => r.Id);
            builder.Property(r => r.Id).ValueGeneratedOnAdd();

            builder.Property(r => r.UserId)
                .IsRequired();

            builder.Property(r => r.MessageId)
                .IsRequired();

            builder.Property(r => r.ReactionType)
                .IsRequired()
                .HasColumnType("SMALLINT");

            builder.Property(r => r.CreatedAt)
                .IsRequired();

            builder.HasOne(r => r.Message)
                .WithMany(m => m.Reactions)
                .HasForeignKey(r => r.MessageId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(r => r.User)
                .WithMany()
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasIndex(r => new { r.UserId, r.MessageId })
                .IsUnique();
        }
    }
}
