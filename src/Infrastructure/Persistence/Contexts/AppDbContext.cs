using Domain.Common;
using Domain.Entities;
using Infrastructure.Outbox;
using Infrastructure.Persistence.Configurations;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System.Reflection.Emit;

namespace Infrastructure.Persistence.Contexts
{
    public class AppDbContext : IdentityDbContext<User, IdentityRole<Guid>, Guid>
    {
        private readonly IConfiguration _configuration;
        public AppDbContext(DbContextOptions<AppDbContext> options,
            IConfiguration configuration) : base(options)
        {
            _configuration = configuration;
        }
        public DbSet<OutboxMessage> OutboxMessages { get; set; }
        public DbSet<BlockChat> BlockChats { get; set; }
        public DbSet<Conversation> Conversations { get; set; }
        public DbSet<ConversationMember> ConversationMembers { get; set; }
        public DbSet<MemberMessage> MemberMessages { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<MessageAttachment> MessageAttachments { get; set; }
        public DbSet<FriendRequest> FriendRequests { get; set; }
        public DbSet<Friendship> Friendships { get; set; }        
        public DbSet<Group> Groups { get; set; }
        public DbSet<GroupMember> GroupMembers { get; set; }
        public DbSet<GroupJoinRequest> GroupJoinRequests { get; set; }
        public DbSet<GroupRule> GroupRules { get; set; }
        public DbSet<ReportedGroupContent> ReportedGroupContents { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<Reel> Reels { get; set; }
        public DbSet<Story> Stories { get; set; }
        public DbSet<StorySeen> StorySeens { get; set; }
        public DbSet<StoryReaction> StoryReactions { get; set; }
        public DbSet<PostMedia> PostMedias { get; set; }
        public DbSet<PostTag> PostTags { get; set; }
        public DbSet<PostComment> PostComments { get; set; }
        public DbSet<ReelComment> ReelComments { get; set; }
        public DbSet<PostReaction> PostReactions { get; set; }
        public DbSet<ReelReaction> ReelReactions { get; set; }
        public DbSet<CommentReaction> CommentReactions { get; set; }
        public DbSet<SavedPost> SavedPosts { get; set; }
        public DbSet<UserFeed> UserFeeds { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<School> Schools { get; set; }
        public DbSet<Following> Followings { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.ApplyConfiguration(new SchoolConfiguration());
            builder.ApplyConfiguration(new FollowingConfiguration());
            builder.ApplyConfiguration(new BlockChatConfiguration());
            builder.ApplyConfiguration(new ConversationConfiguration());
            builder.ApplyConfiguration(new ConversationMemberConfiguration());
            builder.ApplyConfiguration(new MemberMessageConfiguration());
            builder.ApplyConfiguration(new MessageConfiguration());
            builder.ApplyConfiguration(new MessageAttachmentConfiguration());
            builder.ApplyConfiguration(new UserConfiguration());
            builder.ApplyConfiguration(new GroupConfiguration());
            builder.ApplyConfiguration(new GroupMemberConfiguration());
            builder.ApplyConfiguration(new GroupJoinRequestConfiguration());
            builder.ApplyConfiguration(new GroupRuleConfiguration());
            builder.ApplyConfiguration(new ReportedGroupContentConfiguration());
            builder.ApplyConfiguration(new PostConfiguration());
            builder.ApplyConfiguration(new ReelConfiguration());
            builder.ApplyConfiguration(new StorySeenConfiguration());
            builder.ApplyConfiguration(new StoryReactionConfiguration());
            builder.ApplyConfiguration(new StoryConfiguration());
            builder.ApplyConfiguration(new PostMediaConfiguration());
            builder.ApplyConfiguration(new PostTagConfiguration());
            builder.ApplyConfiguration(new PostCommentConfiguration());
            builder.ApplyConfiguration(new ReelCommentConfiguration());
            builder.ApplyConfiguration(new PostReactionConfiguration());
            builder.ApplyConfiguration(new ReelReactionConfiguration());
            builder.ApplyConfiguration(new CommentReactionConfiguration());
            builder.ApplyConfiguration(new SavedPostConfiguration());
            builder.ApplyConfiguration(new UserFeedConfiguration());
            builder.ApplyConfiguration(new NotificationConfiguration());

            base.OnModelCreating(builder);
            builder.Entity<User>().ToTable("AspNetUsers");
            builder.Entity<IdentityRole<Guid>>().ToTable("AspNetRoles");
            builder.Entity<IdentityUserRole<Guid>>().ToTable("AspNetUserRoles");
            builder.Entity<IdentityUserClaim<Guid>>().ToTable("AspNetUserClaims");
            builder.Entity<IdentityUserLogin<Guid>>().ToTable("AspNetUserLogins");
            builder.Entity<IdentityRoleClaim<Guid>>().ToTable("AspNetRoleClaims");
            builder.Entity<IdentityUserToken<Guid>>().ToTable("AspNetUserTokens");
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
                  .Entries<IHasDomainEvents>()
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
            foreach (var entry in ChangeTracker.Entries<IHasDomainEvents>())
                entry.Entity.ClearDomainEvents();
            return base.SaveChangesAsync(cancellationToken);
        }
    }
}
