import { getForumById } from "@/lib/actions/forum.actions";

export default async function ForumDetailsServer({
  params,
}: {
  params: Promise<{ forumId: string }>;
}) {
  const { forumId } = await params;

  const forum: IForum = await getForumById(forumId);
  console.log("forum:", forum)
  return <div>page</div>;
}
