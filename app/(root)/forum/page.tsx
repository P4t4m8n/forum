import { getForums } from "@/lib/actions/forum.actions";

import ForumIndex from "@/components/ForumIndex/ForumIndex";

export default async function ForumServer() {
  const forums: IForum[] = await getForums();
  return <ForumIndex forums={forums} />;
}
