using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{

    public class ConversationConfiguration : IEntityTypeConfiguration<Conversation>
    {
        public void Configure(EntityTypeBuilder<Conversation> builder)
        {
            builder.ToTable("Conversations");

            builder.HasKey(c => c.Id);

            builder.Property(c => c.Name)
                .HasMaxLength(200);

            builder.Property(c => c.Theme)
                .HasMaxLength(50);

            // ❗ Ignore fields so EF doesn't map them separately
            builder.Ignore("_members");
            builder.Ignore("_messages");

            builder.HasMany(c => c.Members)
                .WithOne(cm => cm.Conversation)
                .HasForeignKey(cm => cm.ConversationId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Navigation(c => c.Members)
                .HasField("_members")
                .UsePropertyAccessMode(PropertyAccessMode.Field);


            builder.HasMany(c => c.Messages)
                .WithOne(m => m.Conversation)
                .HasForeignKey(m => m.ConversationId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Navigation(c => c.Messages)
                .HasField("_messages")
                .UsePropertyAccessMode(PropertyAccessMode.Field);


        }
    }
}
