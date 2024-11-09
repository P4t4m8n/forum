import { getThreadById } from "@/lib/actions/thread.action";
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
  return <div>page</div>;
}
