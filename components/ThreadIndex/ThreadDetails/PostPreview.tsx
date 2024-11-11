import { datesUtil } from "@/lib/utils/dates/dates.util";
import Image from "next/image";
import Link from "next/link";

interface Props {
  post: IPost;
  forumId: string;
  threadId: string;
}
const PostPreview = ({ post, forumId, threadId }: Props) => {
  const { title, id, author, createdAt } = post;

  const formatData = datesUtil.formatDate(createdAt);
  return (
    <Link
      href={`/forum/${forumId}/thread/${threadId}/post/${id}`}
      className="text-white flex border border-white p-4 rounded items-center justify-between"
    >
      <h2>{title}</h2>
      <span className="flex gap-2 items-center">
        <h4 className="">Author</h4>
        <Image
          src={author.imgUrl}
          alt={author.username}
          width={32}
          height={32}
          className="w-8 h-8 rounded-full"
        />
        <h4 className="font-semibold">{author.username}</h4>
        <p>{formatData}</p>
      </span>
    </Link>
  );
};

export default PostPreview;
