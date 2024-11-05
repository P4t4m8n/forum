import Link from "next/link";
import { StarkWolfSvg } from "../../icons/svgs";
import ForumInfo from "./ForumInfo";
import TopPosts from "./TopPosts";

interface Props {
  forum: IForumSmall;
}
const ForumPreview = ({ forum }: Props) => {
  const {
    latestPost,
    likedPost,
    viewedPost,
    subjects,
    description,
    title,
    id,
  } = forum;

  const posts = [latestPost, likedPost, viewedPost];
  return (
    <Link
      className=" text-gray-200 items-center  p-4 grid grid-cols-forum-preview gap-16 h-48 hover:bg-slate-950 transition-colors duration-300"
      key={id}
      href={`/forum/${id}`}
    >
      <StarkWolfSvg />
      <ForumInfo title={title} description={description} subjects={subjects} />
      <TopPosts posts={posts} />
    </Link>
  );
};

export default ForumPreview;
