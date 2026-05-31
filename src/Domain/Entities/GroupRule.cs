using Domain.Common;

namespace Domain.Entities
{
    public class GroupRule : BaseEntity
    {
        public long GroupId { get; private set; }
        public string Title { get; private set; } = string.Empty;
        public string Description { get; private set; } = string.Empty;

        // Navigation
        public Group Group { get; private set; } = null!;

        private GroupRule(long id) : base(id) { }

        public GroupRule(
            long id,
            long groupId,
            string title,
            string description) : base(id)
        {
            GroupId = groupId;
            Title = title.Trim();
            Description = description.Trim();
        }

        public void Update(string title, string description)
        {
            Title = title.Trim();
            Description = description.Trim();
        }
    }
}
