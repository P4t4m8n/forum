export default async function page({
  params,
}: {
  params: Promise<{ postId: string; threadId: string; forumId: string }>;
}) {

    const { postId, threadId, forumId } = await params;
    console.log("forumId:", forumId)
    console.log("threadId:", threadId)
    console.log("postId:", postId)
  return <div>page</div>;
}
