import { GeneralFilter } from "./GeneralFilter";
import GeneralLink from "./GeneralLink";

interface Props {
  link: {
    href: string;
    children: React.ReactNode;
  };
  type: string;
}
export const GeneralActionsBar = ({ link, type }: Props) => {
  return (
    <header className="flex items-center justify-between p-2">
      <GeneralFilter type={type} />
      <GeneralLink href={link.href}>{link.children}</GeneralLink>
    </header>
  );
};
