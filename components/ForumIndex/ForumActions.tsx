import GeneralLink from "../General/GeneralLink";
import ForumFilter from "./ForumFilter";

const ForumActions = () => {
  return (
    <header className="flex items-center justify-between p-2">
      <ForumFilter />
      <GeneralLink href="/forum/edit/new">Create Forum</GeneralLink>
    </header>
  );
};

export default ForumActions;
