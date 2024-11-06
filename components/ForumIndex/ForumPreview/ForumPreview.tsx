import Link from "next/link";
import { StarkWolfSvg } from "../../icons/svgs";
import ForumInfo from "./ForumInfo";
import TopPosts from "./TopPosts/TopPosts";

interface Props {
  forum: IForum;
}
const ForumPreview = ({ forum }: Props) => {
  const { description, title, id, admins, threads, totalPosts } = forum;
  console.log("threads:", threads)

  // const posts = [latestPost, likedPost, viewedPost];
  return (
    <div className="text-white flex">
      <h2 className="border-b w-64 h-fit after-name">{title}</h2>
      <div className="w-[1px] h-32 border mt-6"></div>
      <ul>
        {threads.map((thread) => (
          <li key={thread.id}></li>
        ))}
      </ul>
    </div>
  );
};

export default ForumPreview;
