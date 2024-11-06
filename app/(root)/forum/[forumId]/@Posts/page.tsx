import { getNonPinnedPostsPaginated } from "@/lib/actions/post.action";

export default async function Posts({
  params,
}: {
  params: Promise<{ forumId: string }>;
}) {
  const { forumId } = await params;
  const posts = await getNonPinnedPostsPaginated(forumId);
  return <div>page</div>;
}
