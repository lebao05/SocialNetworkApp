using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Infrastructure.Persistence.Configurations
{
    public class MessageConfiguration : IEntityTypeConfiguration<Message>
    {
        public MessageConfiguration() {
        }
        public void Configure(EntityTypeBuilder<Message> builder)
        {
            builder.ToTable("Messages");

            builder.HasKey(m => m.Id);

            builder.Property(m => m.Content)
                .HasMaxLength(2000)
                .IsRequired(false);
     
            // Creator
            builder.HasOne(m => m.Creator)
                .WithMany()
                .HasForeignKey(m => m.CreatorId)
                .OnDelete(DeleteBehavior.Restrict);

            // ✅ Reply (self-reference)
            builder.HasMany(m => m.Replies)
                .WithOne(m => m.ReplyToMessage)
                .HasForeignKey(m => m.ReplyToMessageId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Navigation(m => m.Replies)
                .HasField("_replies")   // 👈 REQUIRED
                .UsePropertyAccessMode(PropertyAccessMode.Field);

            // ✅ One-to-one Attachment
            builder.HasOne(m => m.Attachment)
                .WithOne(a => a.Message)
                .HasForeignKey<MessageAttachment>(a => a.MessageId)
                .OnDelete(DeleteBehavior.Cascade);

            // ✅ MemberMessages
            // Removed — replaced by Reaction on Message entity

            // Forwarded From
            builder.HasOne(m => m.ForwardFromMessage)
                .WithMany()
                .HasForeignKey(m => m.ForwardFromMessageId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
