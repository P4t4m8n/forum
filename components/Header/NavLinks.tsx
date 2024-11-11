import Link from "next/link";
import React from "react";
import { LittleFingerSvg, TyrionSvg } from "../icons/svgs";

const NavLinks = () => {
  const links = [
    {
      link: "/forum",
      icon: <LittleFingerSvg />,
      label: "Forums",
    },
    {
      link: "/wiki",
      icon: <TyrionSvg />,
      label: "Wiki's",
    },

  ];
  return (
    <nav className="flex gap-8 ">
      {links.map((link, index) => (
        <div className="grid justify-items-center" key={index}>
          <Link className="link-btn" href={link.link}>
            {link.icon}
          </Link>
          <h3>{link.label}</h3>
        </div>
      ))}
    </nav>
  );
};

export default NavLinks;
