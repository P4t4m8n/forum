import { getPinnedPosts } from "@/lib/actions/post.action";

export default async function PinnedPosts({
  params,
}: {
  params: Promise<{ forumId: string }>;
}) {
  const { forumId } = await params;
  const pinnedPosts = await getPinnedPosts(forumId);
  return <div>page</div>;
}
