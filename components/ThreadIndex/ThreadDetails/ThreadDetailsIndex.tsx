import GeneralActionsBar from "@/components/General/GeneralActionsBar";
import PostLIst from "./PostLIst";

interface Props {
  thread: IThread;
}
const ThreadDetailsIndex = ({ thread }: Props) => {
  const newThread = {
    href: `/forum/${thread.forumId}/thread/${thread.id}/post/edit/new`,
    children: <h1>New Post</h1>,
  };

  const editThread = {
    href: `/forum/${thread.forumId}/thread/edit/${thread.id}`,
    children: <h1>Edit Thread</h1>,
  };
  return (
    <div>
      <GeneralActionsBar
        newItem={newThread}
        editItem={editThread}
        type={`forum/${thread.forumId}/thread/${thread.id}`}
      />
      <PostLIst
        posts={thread.posts}
        threadId={thread.id!}
        forumId={thread.forumId}
      />
    </div>
  );
};

export default ThreadDetailsIndex;
