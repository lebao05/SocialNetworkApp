namespace Application.DTOs.Posts
{
    /// <summary>
    /// DTO representing a user tagged in a post.
    /// <see cref="Id"/> is the tagged user's id (Guid) and <see cref="TagName"/>
    /// is the display name the UI should render (the resolved
    /// "{FirstName} {LastName}", or the raw stored value before the handler
    /// batch-resolves names).
    /// </summary>
    public sealed record TagDto(
        Guid? Id,
        string TagName
    )
    {
        /// <summary>
        /// Build a <see cref="TagDto"/> from the raw string stored in
        /// <see cref="Domain.Entities.PostTag.TagName"/>. If that value parses
        /// as a Guid it is treated as the tagged user's id; otherwise the row
        /// is treated as a legacy free-form tag with no linkable user.
        /// Display-name resolution happens later in the handler.
        /// </summary>
        public static TagDto FromTagName(string tagName)
        {
            if (Guid.TryParse(tagName, out var userId))
                return new TagDto(userId, tagName);
            return new TagDto(null, tagName);
        }
    }
}
