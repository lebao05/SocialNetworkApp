using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.ToTable("Users");

            // Identity already defines PK (Id)

            builder.Property(u => u.Phone)
                .HasMaxLength(20);

            builder.Property(u => u.AvatarUrl)
                .HasMaxLength(500);

            // Conversations (backing field)
            builder.HasMany(u => u.Conversations)
                .WithOne(cm => cm.User)
                .HasForeignKey(cm => cm.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Blocked users (self relationship via BlockChat)
            builder.HasMany(u => u.BlockedUsers)
                .WithOne(b => b.User)
                .HasForeignKey(b => b.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // 🔥 Important: tell EF to use backing fields
            builder.Navigation(u => u.Conversations)
                .HasField("_conversations")
                .UsePropertyAccessMode(PropertyAccessMode.Field);

            builder.Navigation(u => u.BlockedUsers)
                .HasField("_blockedUsers")
                .UsePropertyAccessMode(PropertyAccessMode.Field);
        }
    }
}
