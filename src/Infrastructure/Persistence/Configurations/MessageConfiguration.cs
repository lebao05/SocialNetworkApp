using Domain.Entities;
using Infrastructure.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Infrastructure.Persistence.Configurations
{
    public class MessageConfiguration : IEntityTypeConfiguration<Message>
    {
        private readonly string _encryptionKey;

        public MessageConfiguration(string encryptionKey)
        {
            _encryptionKey = encryptionKey;
        }
        public void Configure(EntityTypeBuilder<Message> builder)
        {
            builder.ToTable("Messages");

            builder.HasKey(m => m.Id);

            builder.Property(m => m.Content)
                .HasMaxLength(2000);

            var encryptionConverter = new ValueConverter<string, string>(
                  v => EncryptionProvider.Encrypt(v, _encryptionKey),
                  v => EncryptionProvider.Decrypt(v, _encryptionKey)
            );
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
            builder.HasMany(m => m.MemberMessages)
                .WithOne(mm => mm.Message)
                .HasForeignKey(mm => mm.MessageId);

            builder.Navigation(m => m.MemberMessages)
                .HasField("_memberMessages")   // 👈 REQUIRED
                .UsePropertyAccessMode(PropertyAccessMode.Field);
        }
    }
}
