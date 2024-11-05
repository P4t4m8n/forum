import { getForums } from "@/lib/actions/forum.actions";

import ForumIndex from "@/components/ForumIndex/ForumIndex";

export default async function ForumServer() {
  const forums: IForumSmall[] = await getForums();
  console.log("forums:", forums)
  return <ForumIndex forums={forums} />;
}
