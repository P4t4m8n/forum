import ForumEditIndex from "@/components/ForumIndex/ForumEdit/ForumEditIndex";
import { getForumById } from "@/lib/actions/forum.actions";
import { getUsers } from "@/lib/actions/user.actions";
import { forumService } from "@/lib/services/forum.service";

export async function generateStaticParams() {
  return [{ forumId: "new" }];
}

export default async function ForumEditServer({
  params,
}: {
  params: Promise<{ forumId: string }>;
}) {
  const { forumId } = await params;

  let forum: IForum;

  if (forumId === "new") {
    forum = forumService.getEmpty();
  } else {
    forum = await getForumById(forumId);
  }
  const admins = await getUsers();
  const types = [
    "resource sharing",
    "moderator",
    "tech support",
    "discussions",
    "admin",
  ];
  return <ForumEditIndex forum={forum} admins={admins} types={types} />;
}
