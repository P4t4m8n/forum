import { getThreadById } from "@/lib/actions/thread.actions";
import { threadService } from "@/lib/services/thread.service";

export async function generateStaticParams() {
  return [{ threadId: "new", forumId: "1" }];
}
export default async function page({
  params,
}: {
  params: Promise<{ threadId: string; forumId: string }>;
}) {
  const { threadId } = await params;

  const thread: IThread =
    threadId === "new"
      ? threadService.getEmpty()
      : await getThreadById(threadId);
  console.log("thread:", thread);
  return <div>page</div>;
}
