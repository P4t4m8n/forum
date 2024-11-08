import { PostEditIndex } from "@/components/PostIndex/PostEdit/PostEditIndex";
import { getPostById } from "@/lib/actions/post.action";
import { postService } from "@/lib/services/post.service";

export async function generateStaticParams() {
  return [{ threadId: "1", forumId: "1", postId: "new" }];
}
export default async function PostEditServer({
  params,
}: {
  params: Promise<{ threadId: string; forumId: string; postId: string }>;
}) {
  const { postId, forumId,threadId } = await params;

  const post: IPost =
    postId === "new" ? postService.getEmpty() : await getPostById(postId);

  if (!post?.forumId) post.forumId = forumId;
  if (!post.author.id)
    post.author = {
      id: "1356e7b2-aeb8-44c4-9383-a05f82f424e1",
      username: "johndoe",
      imgUrl:
        "https://res.cloudinary.com/dpnevk8db/image/upload/v1727205327/igor-karimov-lPLqDlnhxbE-unsplash_hfnaer.jpg",
    };

    if(!post?.threadId) post.threadId = threadId;
  return <PostEditIndex post={post} />;
}
