import { LikeSvg, ViewSvg } from "@/components/icons/svgs";
import { datesUtil } from "@/lib/utils/dates/dates.util";
import { IPostSmall } from "@/models/post.model";
import Image from "next/image";

interface Props {
  posts: IPostSmall[];
}

const TopPosts = ({ posts }: Props) => {
  return (
    <ul className="flex flex-col w-full gap-4 justify-center">
      {posts.map((post, idx) => (
        <li className="flex gap-1 items-center w-full" key={idx}>
          <div className="flex gap-1 items-center">
            <h5 className="text-sm text-gray-400">{post?.viewCount||0}</h5>
            <ViewSvg />
          </div>
          <div className="flex gap-1 items-center">
            <h5 className="text-sm text-gray-400">{post?.likeCount||0}</h5>
            <LikeSvg />
          </div>
          <h3 className=" text-gray-400 font-semibold">{post?.title||""}</h3>
          <div className="flex items-center w-fit px-2 gap-2">
            <Image
              src={
                "https://res.cloudinary.com/dpnevk8db/image/upload/v1727205327/igor-karimov-lPLqDlnhxbE-unsplash_hfnaer.jpg"
              }
              className="rounded-full w-8 h-8"
              width={32}
              height={32}
              alt=""
            />
            <h4>{post?.author?.username||""}</h4>
          </div>
          <h4>{datesUtil.formatDate(post?.createdAt)}</h4>
        </li>
      ))}
    </ul>
  );
};
export default TopPosts;
