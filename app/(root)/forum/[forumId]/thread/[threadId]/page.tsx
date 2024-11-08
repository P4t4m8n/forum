import ThreadDetailsIndex from "@/components/ThreadIndex/ThreadDetails/ThreadDetailsIndex";
import { getThreadById } from "@/lib/actions/thread.actions";

export default async function ThreadDetailsServer({
  params,
}: {
  params: Promise<{ threadId: string,forumId:string }>;
}) {
  const { threadId,forumId } = await params;

  const thread = await getThreadById(threadId);
  return <ThreadDetailsIndex thread={thread} />;
}
