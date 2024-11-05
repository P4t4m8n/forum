import { TopPostPreview } from "./TopPostPreview";
import { TopPostNull } from "./TopPostNull";

interface Props {
  posts: Array<IPostSmall | null>;
}

const TopPosts = ({ posts }: Props) => {
  
  const removeDuplicatePosts = (posts: Array<IPostSmall | null>) => {
    const seenIds = new Set();
    return posts.filter((post) => {
      if (post && !seenIds.has(post.id)) {
        seenIds.add(post.id);
        return true;
      }
      return false;
    });
  };

  const uniquePosts = removeDuplicatePosts(posts);
  return (
    <ul className="flex flex-col w-full gap-4 justify-center">
      {uniquePosts.length ? (
        uniquePosts?.map((post, idx) =>
          post ? (
            <TopPostPreview post={post} key={idx} />
          ) : (
            <TopPostNull key={idx} />
          )
        )
      ) : (
        <TopPostNull />
      )}
    </ul>
  );
};
export default TopPosts;
