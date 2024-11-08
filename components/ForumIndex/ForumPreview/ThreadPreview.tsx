import { EnvelopeSvg, LikeSvg } from "@/components/icons/svgs";
import { datesUtil } from "@/lib/utils/dates/dates.util";
import Image from "next/image";
import Link from "next/link";

interface Props {
  thread: IThreadSmall;
}
export default function ThreadPreview({ thread }: Props) {
  const { id, title, description, postCount, likeCount, latestPost, forumId } =
    thread;
  return (
    <Link
      href={`forum/${forumId}/thread/${id}`}
      className="text-white border p-4 w-full rounded flex gap-4 items-center "
    >
      <div className="">
        <h3 className="text-lg">{title}</h3>
        <p className="text-sm font-semibold">{description}</p>
      </div>
      {latestPost ? (
        <div className="flex flex-col gap-1 ml-auto">
          <span className="flex gap-2 items-center text-sm font-semibold ">
            <p className="text-sm font-semibold">Last post by</p>
            <Image
              src={latestPost?.author?.imgUrl || ""}
              width={32}
              height={32}
              alt="avatar"
              className="h-8 w-8 rounded-full object-cover"
            />
            <h4 className="text-base font-normal underline">
              {latestPost?.author.username}
            </h4>
            <p>on {datesUtil.formatDate(latestPost.createdAt)}</p>
          </span>
          <ul className="flex justify-end gap-4">
            <li className="flex gap-1 items-center">
              <EnvelopeSvg />
              <p>{postCount} posts</p>
            </li>
            <li className="flex gap-1 items-center">
              <LikeSvg />
              <p>{likeCount} likes</p>
            </li>
          </ul>
        </div>
      ) : (
        <h2 className="flex flex-col gap-1 ml-auto">No Posts</h2>
      )}
    </Link>
  );
}
