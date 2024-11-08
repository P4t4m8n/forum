import GeneralForm from "@/components/General/GeneralForm";
import { savePost } from "@/lib/actions/post.action";

interface Props {
  post: IPost;
}
export const PostEditIndex = ({ post }: Props) => {
  console.log("post:", post);

  const schema: Field[] = [
    {
      name: "title",
      label: <p className=" font-medium pb-1">Title</p>,
      type: "text",
      defaultValue: post.title,
      placeholder: "Enter post title",
    },
    {
      name: "content",
      label: <p className=" font-medium pb-1">Content</p>,
      type: "textarea",
      defaultValue: post.content,
    },
  ];
  return (
    <div className="px-[20vw] py-6">
      <h2 className="text-white pb-2 mb-2 text-lg font-medium border-b border-gray-900 ">
        {post?.id ? "Edit Post," : "Create Post"}
      </h2>
      <GeneralForm schema={schema} onSubmit={savePost} />
    </div>
  );
};
