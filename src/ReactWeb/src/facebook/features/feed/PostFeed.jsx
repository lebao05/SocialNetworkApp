import PostCard from "./PostCard";
import { mockPosts } from "../../../shared/data/mockData";

function PostFeed() {
  return (
    <div>
      {mockPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

export default PostFeed;
