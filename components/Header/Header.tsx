import Link from "next/link";
import { LittleFingerSvg, LogoSvg } from "../icons/svgs";

const Header = () => {
  return (
    <header className="p-4 shadow-sm shadow-white flex items-center justify-between fill-white text-white">
      <LogoSvg />
      <nav>
        <div className="grid justify-items-center">
          <Link className=" link-btn" href={"/forums"}>
            <LittleFingerSvg />
          </Link>
          <h3 >Forums</h3>
        </div>
      </nav>

      <div>
        <button className="bg-white text-black px-6 py-4 rounded-lg font-semibold">Sign In</button>
      </div>
    </header>
  );
};

export default Header;
