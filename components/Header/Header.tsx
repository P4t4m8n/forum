import Link from "next/link";
import { LogoSvg } from "../icons/svgs";
import UserMenu from "../menus/UserMenu";
import NavLinks from "./NavLinks";

const Header = () => {
  return (
    <header className="p-4 shadow-sm shadow-white flex items-center justify-between fill-white text-white">
      <Link className="" href="/">
        <LogoSvg />
      </Link>
      <NavLinks />
      <UserMenu />
    </header>
  );
};

export default Header;
