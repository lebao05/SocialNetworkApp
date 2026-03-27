using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
namespace Infrastructure.Persistence.Configurations
{
    public class MessageAttachmentConfiguration : IEntityTypeConfiguration<MessageAttachment>
    {
        public void Configure(EntityTypeBuilder<MessageAttachment> builder)
        {
            builder.ToTable("MessageAttachments");

            builder.HasKey(a => a.Id);

            builder.Property(a => a.FileUrl)
                .IsRequired();

            builder.Property(a => a.FileType)
                .IsRequired()
                .HasMaxLength(50);
        }
    }
}
