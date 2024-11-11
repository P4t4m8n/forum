export default async function page({
  params,
}: {
  params: Promise<{ postId: string; threadId: string; forumId: string }>;
}) {

    const { postId, threadId, forumId } = await params;

  return <div>page</div>;
}
