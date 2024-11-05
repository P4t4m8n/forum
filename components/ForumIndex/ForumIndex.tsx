import ForumList from "./ForumList";
import ForumActions from "./ForumActions";

interface Props {
  forums: IForumSmall[];
}

const ForumIndex = ({ forums }: Props) => {
  return (
    <div className="p-2">
      <ForumActions />

      <ForumList forums={forums} />
    </div>
  );
};

export default ForumIndex;
