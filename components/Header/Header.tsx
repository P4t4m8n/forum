import { LogoSvg } from "../icons/svgs";
import UserMenu from "../menus/UserMenu";
import NavLinks from "./NavLinks";

const Header = () => {
  return (
    <header className="p-4 shadow-sm shadow-white flex items-center justify-between fill-white text-white">
      <LogoSvg />
      <NavLinks />
      <UserMenu />
    </header>
  );
};

export default Header;
