using Domain.Entities;

namespace Application.DTOs.Posts
{
    /// <summary>
    /// Shared logic for converting a list of <see cref="PostTag"/> rows into
    /// <see cref="TagDto"/>s and batch-resolving their display names.
    ///
    /// The repository stores a tagged user's Guid as <see cref="PostTag.TagName"/>;
    /// the wire format must expose that user id (so the UI can build a profile
    /// link) and the resolved display name (so the UI doesn't have to do another
    /// round-trip).
    /// </summary>
    internal static class TagResolver
    {
        /// <summary>
        /// Project raw tag rows to wire DTOs using an already-loaded name map.
        /// Legacy non-Guid tags keep their original text with a null id.
        /// </summary>
        public static IReadOnlyCollection<TagDto> MapTags(
            IEnumerable<PostTag> tags,
            IReadOnlyDictionary<Guid, string> nameMap)
        {
            var result = new List<TagDto>();
            foreach (var t in tags)
            {
                if (Guid.TryParse(t.TagName, out var userId))
                {
                    nameMap.TryGetValue(userId, out var name);
                    result.Add(new TagDto(userId, name ?? string.Empty));
                }
                else
                {
                    result.Add(new TagDto(null, t.TagName));
                }
            }
            return result;
        }

        /// <summary>
        /// Project raw tag rows to wire DTOs when the caller hasn't loaded a
        /// name map yet (i.e. immediately after the DB projection in a
        /// repository). The <see cref="TagDto.TagName"/> field is populated
        /// with the raw stored value (user-id Guid string or free-form text);
        /// the caller must run <see cref="ResolveDisplayNamesAsync"/> on the
        /// resulting DTOs to swap in real names.
        /// </summary>
        public static IReadOnlyList<TagDto> ProjectTags(IEnumerable<PostTag> tags)
        {
            var result = new List<TagDto>();
            foreach (var t in tags)
            {
                if (Guid.TryParse(t.TagName, out var userId))
                {
                    result.Add(new TagDto(userId, t.TagName));
                }
                else
                {
                    result.Add(new TagDto(null, t.TagName));
                }
            }
            return result;
        }

        /// <summary>
        /// Collect every tagged-user id from the supplied DTOs, look up the
        /// display names in one batched call, and rewrite the
        /// <see cref="TagDto.TagName"/> field in-place.
        /// </summary>
        public static async Task ResolveDisplayNamesAsync(
            List<TagDto> tags,
            Application.Abstractions.Repositories.IUserRepository userRepository,
            CancellationToken cancellationToken)
        {
            if (tags.Count == 0) return;

            var ids = new List<Guid>(tags.Count);
            for (var i = 0; i < tags.Count; i++)
            {
                if (tags[i].Id.HasValue) ids.Add(tags[i].Id!.Value);
            }
            if (ids.Count == 0) return;

            var nameMap = await userRepository.GetDisplayNamesByIdsAsync(ids, cancellationToken);
            for (var i = 0; i < tags.Count; i++)
            {
                var tag = tags[i];
                if (!tag.Id.HasValue) continue;
                if (nameMap.TryGetValue(tag.Id.Value, out var name) && !string.IsNullOrEmpty(name))
                {
                    tags[i] = tag with { TagName = name };
                }
                else
                {
                    // User was deleted but the tag still references them —
                    // fall back to the raw Guid string so the row doesn't
                    // disappear silently.
                    tags[i] = tag with { TagName = tag.Id.Value.ToString() };
                }
            }
        }

        /// <summary>
        /// Walk a whole paged list of <see cref="PostDto"/>s and resolve tag
        /// display names in a single batched lookup. Mutates each post
        /// (and its nested SharePost, if any) in place by returning a new
        /// record instance with the rewritten <see cref="PostDto.Tags"/>
        /// collection.
        /// </summary>
        public static async Task ResolveAllAsync(
            List<PostDto> posts,
            Application.Abstractions.Repositories.IUserRepository userRepository,
            CancellationToken cancellationToken)
        {
            if (posts.Count == 0) return;

            // Collect the existing tag DTOs (top-level + nested SharePost) so
            // we can batch one display-name lookup across the whole page.
            var topTagsByPost = new Dictionary<int, List<TagDto>>(posts.Count);
            var shareTagsByPost = new Dictionary<int, List<TagDto>>(posts.Count);
            for (var i = 0; i < posts.Count; i++)
            {
                var post = posts[i];
                if (post.Tags is { Count: > 0 } topTags)
                {
                    topTagsByPost[i] = new List<TagDto>(topTags);
                }
                if (post.SharePost?.Tags is { Count: > 0 } shareTags)
                {
                    shareTagsByPost[i] = new List<TagDto>(shareTags);
                }
            }

            // Flatten every tag into one batched lookup.
            var allTags = new List<TagDto>();
            foreach (var list in topTagsByPost.Values) allTags.AddRange(list);
            foreach (var list in shareTagsByPost.Values) allTags.AddRange(list);

            await ResolveDisplayNamesAsync(allTags, userRepository, cancellationToken);

            // Write the rewritten tags back onto the post records.
            for (var i = 0; i < posts.Count; i++)
            {
                var post = posts[i];
                IReadOnlyCollection<TagDto>? newTags = null;
                IReadOnlyCollection<TagDto>? newShareTags = null;

                if (topTagsByPost.TryGetValue(i, out var resolvedTop))
                {
                    newTags = resolvedTop;
                }
                if (shareTagsByPost.TryGetValue(i, out var resolvedShare))
                {
                    newShareTags = resolvedShare;
                }

                if (newTags is null && newShareTags is null) continue;

                posts[i] = post with
                {
                    Tags = newTags ?? post.Tags,
                    SharePost = post.SharePost is null
                        ? null
                        : (newShareTags is null
                            ? post.SharePost
                            : post.SharePost with { Tags = newShareTags })
                };
            }
        }
    }
}
