import Link from "next/link";

const WikiIndex = () => {
  const links = [
    {
      link: "/wiki/characters",
      text: "Characters",
    },
    {
      link: "/wiki/places",
      text: "Places",
    },
    {
      link: "/wiki/cultures",
      text: "Cultures",
    },
    {
      link: "/wiki/houses",
      text: "Houses",
    },
    {
      link: "/wiki/religions",
      text: "Religions",
    },
    {
      link: "/wiki/quotes",
      text: "Quotes",
    },
  ];
  return (
    <nav className="flex text-white gap-8 flex-wrap p-4">
      {links.map((link) => (
        <Link className="border border-white min-w-64 p-6 h-96 flex-1 rounded" key={link.text} href={link.link}>
          <h3>{link.text}</h3>
        </Link>
      ))}
    </nav>
  );
};

export default WikiIndex;
