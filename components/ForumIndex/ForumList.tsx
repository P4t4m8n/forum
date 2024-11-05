import ForumPreview from "./ForumPreview/ForumPreview";

interface Props {
  forums: IForumSmall[];
}
const ForumList = ({ forums }: Props) => {
  return (
    <nav className="p-2 flex flex-col  forum-list w-full">
      {forums.map((forum) => (
        <ForumPreview forum={forum} key={forum.id} />
      ))}
    </nav>
  );
};

export default ForumList;
