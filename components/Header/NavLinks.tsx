import Link from "next/link";
import React from "react";
import { LittleFingerSvg } from "../icons/svgs";

const NavLinks = () => {
  const links = [
    {
      link: "/forum",
      icon: <LittleFingerSvg />,
      label: "Forums",
    },
  ];
  return (
    <nav>
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
