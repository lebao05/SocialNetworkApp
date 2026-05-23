using Domain.Common;

namespace Domain.Entities
{
    public class PostTag : BaseEntity
    {
        public long PostId { get; private set; }
        public string TagName { get; private set; } = string.Empty;

        // Navigation
        public Post Post { get; private set; } = null!;

        private PostTag(long id) : base(id) { }

        public PostTag(
            long id,
            long postId,
            string tagName) : base(id)
        {
            PostId = postId;
            TagName = tagName.Trim();
        }
    }
}
