import ThreadList from "./ThreadList";

interface Props {
  forum: IForumSmall;
}
const ForumPreview = ({ forum }: Props) => {
  const { title, threads } = forum;

  return (
    <div className="text-white fill-white  shadow-white flex items-center p-4">
      <div>
        <h2 className=" text-xl font-semibold w-80 ">{title}</h2>
      </div>
      <ThreadList threads={threads} />
    </div>
  );
};

export default ForumPreview;
