import { GeneralFilter } from "./GeneralFilter";
import GeneralLink from "./GeneralLink";

interface Props {
  newItem: {
    href: string;
    children: React.ReactNode;
  };
  editItem: {
    href: string;
    children: React.ReactNode;
  };
  type: string;
}
 const GeneralActionsBar = ({ newItem, editItem, type }: Props) => {
  return (
    <header className="flex items-center justify-between p-2">
      <GeneralFilter type={type} />
      <nav className="flex items-center gap-2">
        <GeneralLink href={editItem.href}>{editItem.children}</GeneralLink>
        <GeneralLink href={newItem.href}>{newItem.children}</GeneralLink>
      </nav>
    </header>
  );
};

export default GeneralActionsBar;
