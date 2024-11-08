import PostPreview from "./PostPreview";

interface Props {
  posts: IPost[];
  forumId: string;
  threadId: string;
}

const PostLIst = ({ posts, forumId, threadId }: Props) => {
  return (
    <ul className="p-2">
      {posts.map((post) => (
        <PostPreview
          key={post.id}
          post={post}
          threadId={threadId}
          forumId={forumId}
        />
      ))}
    </ul>
  );
};

export default PostLIst;
