using Domain.Common;
using Domain.Entities;
using Infrastructure.Outbox;
using Infrastructure.Persistence.Configurations;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace Infrastructure.Persistence.Contexts
{
    public class AppDbContext : IdentityDbContext<User, IdentityRole<Guid>, Guid>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        public DbSet<OutboxMessage> OutboxMessages { get; set; }
        public DbSet<BlockChat> BlockChats { get; set; }
        public DbSet<Conversation> Conversations { get; set; }
        public DbSet<ConversationMember> ConversationMembers { get; set; }
        public DbSet<MemberMessage> MemberMessages { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<MessageAttachment> MessageAttachments { get; set; }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.ApplyConfiguration(new BlockChatConfiguration());
            builder.ApplyConfiguration(new ConversationConfiguration());
            builder.ApplyConfiguration(new ConversationMemberConfiguration());
            builder.ApplyConfiguration(new MemberMessageConfiguration());
            builder.ApplyConfiguration(new MessageConfiguration());
            builder.ApplyConfiguration(new MessageAttachmentConfiguration());
            builder.ApplyConfiguration(new UserConfiguration());


            base.OnModelCreating(builder);
            builder.Entity<User>().ToTable("AspNetUsers");
            builder.Entity<IdentityRole<Guid>>().ToTable("AspNetRoles");
            builder.Entity<IdentityUserRole<Guid>>().ToTable("AspNetUserRoles");
            builder.Entity<IdentityUserClaim<Guid>>().ToTable("AspNetUserClaims");
            builder.Entity<IdentityUserLogin<Guid>>().ToTable("AspNetUserLogins");
            builder.Entity<IdentityRoleClaim<Guid>>().ToTable("AspNetRoleClaims");
            builder.Entity<IdentityUserToken<Guid>>().ToTable("AspNetUserTokens");
 
            builder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        }
        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            foreach (var entry in ChangeTracker.Entries<BaseEntity>())
            {
                switch (entry.State)
                {
                    case EntityState.Added:
                        entry.Entity.CreatedAt = DateTime.UtcNow;
                        break;
                    case EntityState.Modified:
                        entry.Entity.UpdatedAt = DateTime.UtcNow;
                        break;
                }
            }

            var domainEvents = ChangeTracker
                  .Entries<AggregateRoot>()
                  .Where(e => e.Entity.DomainEvents.Any())
                  .SelectMany(e => e.Entity.DomainEvents)
                  .ToList();

            // Convert domain events into Outbox messages
            foreach (var domainEvent in domainEvents)
            {
                var type = domainEvent.GetType().AssemblyQualifiedName!;
                var payload = JsonConvert.SerializeObject(domainEvent);

                OutboxMessages.Add(new OutboxMessage
                {
                    Type = type,
                    PayLoad = payload
                });
            }

            // Clear domain events from entities
            foreach (var entry in ChangeTracker.Entries<AggregateRoot>())
                entry.Entity.ClearDomainEvents();
            return base.SaveChangesAsync(cancellationToken);
        }
    }
}
