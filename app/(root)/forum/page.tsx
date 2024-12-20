import { getForums } from "@/lib/actions/forum.action";

import ForumIndex from "@/components/ForumIndex/ForumIndex";

export default async function ForumServer() {
  const forums: IForumSmall[] = await getForums();
  return <ForumIndex forums={forums} />;
}
