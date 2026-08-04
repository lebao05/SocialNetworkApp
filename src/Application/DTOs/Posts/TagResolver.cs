using Domain.Entities;

namespace Application.DTOs.Posts
{
    /// <summary>
    /// Shared logic for converting <see cref="PostTag"/> rows into
    /// <see cref="TagDto"/>s using the <see cref="PostTag.User"/>
    /// navigation property already loaded by EF.
    ///
    /// Since <see cref="PostTag.TagName"/> has been replaced with
    /// <see cref="PostTag.UserId"/> (a proper FK), the DTO projection
    /// no longer needs Guid-parsing or a separate name-lookup round-trip.
    /// </summary>
    internal static class TagResolver
    {
        /// <summary>
        /// Project a collection of <see cref="PostTag"/> entities (with
        /// <see cref="PostTag.User"/> eagerly loaded) into
        /// <see cref="TagDto"/>s using the loaded User navigation.
        /// </summary>
        public static IReadOnlyCollection<TagDto> MapTags(IEnumerable<PostTag> tags)
        {
            var result = new List<TagDto>();
            foreach (var t in tags)
            {
                var displayName = t.User != null
                    ? $"{t.User.FirstName} {t.User.LastName}".Trim()
                    : string.Empty;

                result.Add(new TagDto(t.UserId, displayName));
            }
            return result;
        }
    }
}
