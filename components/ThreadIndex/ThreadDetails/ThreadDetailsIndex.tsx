import { GeneralActionsBar } from "@/components/General/GeneralActionsBar";

interface Props {
  thread: IThread;
}
const ThreadDetailsIndex = ({ thread }: Props) => {
  console.log("thread:", thread);
  const link = {
    href: "",
    children: <h1>New Post</h1>,
  };
  return (
    <div>
      <GeneralActionsBar
        link={link}
        type={`forum/${thread.forumId}/thread/${thread.id}`}
      />
    </div>
  );
};

export default ThreadDetailsIndex;
