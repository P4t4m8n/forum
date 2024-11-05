import ForumEditIndex from "@/components/ForumIndex/ForumEdit/ForumEditIndex";
import { getForumById } from "@/lib/actions/forum.actions";
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

  let forum;

  if (forumId === "new") {
    forum = forumService.getEmpty();
  } else {
    forum = await getForumById(forumId);
  }
  const admins: IUserSmall[] = [
    {
      id: "6fc9cdc7-e20d-43ea-b2c9-29459aedb76f",
      imgUrl:
        "https://res.cloudinary.com/dpnevk8db/image/upload/v1727205327/igor-karimov-lPLqDlnhxbE-unsplash_hfnaer.jpg",
      username: "johndoe",
    },
    {
      id: "445e3656-49c7-4e10-978a-c346c82000cf",
      imgUrl:
        "https://res.cloudinary.com/dpnevk8db/image/upload/v1727205327/igor-karimov-lPLqDlnhxbE-unsplash_hfnaer.jpg",
      username: "janedoe",
    },
    {
      id: "d7ecfb7f-181e-4103-ab1a-ff8c1c672bcb",
      imgUrl:
        "https://res.cloudinary.com/dpnevk8db/image/upload/v1727205327/igor-karimov-lPLqDlnhxbE-unsplash_hfnaer.jpg",
      username: "bobsmith",
    },
  ];
  const types = ["public", "private"];
  const subjects = ["general", "news", "events", "announcements"];
  return (
    <ForumEditIndex
      forum={forum}
      admins={admins}
      types={types}
      subjects={subjects}
    />
  );
}
