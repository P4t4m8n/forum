import { getForumById } from "@/lib/actions/forum.action";

export default async function ForumDetailsServer({
  params,
}: {
  params: Promise<{ forumId: string }>;
}) {
  const { forumId } = await params;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const forum: IForum = await getForumById(forumId);
  return <div>page</div>;
}
