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

            // ✅ Required fields
            builder.Property(u => u.FirstName)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(u => u.LastName)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(u => u.DateOfBirth)
                .IsRequired();

            builder.Property(u => u.Gender)
                .IsRequired();

            builder.Property(u => u.AvatarUrl)
                .HasMaxLength(2000);

            // Optional: normalize email length
            builder.Property(u => u.Email)
                .HasMaxLength(256);

            builder.Property(u => u.UserName)
                .HasMaxLength(256);

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
