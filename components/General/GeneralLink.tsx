import Link from "next/link";

interface Props {
  href: string;
  children: React.ReactNode;
}

export default function GeneralLink({ href, children }: Props) {
  return (
    <Link
      href={href}
      className="bg-white text-black px-6 py-4 rounded-lg font-semibold  h-fit flex items-center w-fit"
    >
      {children}
    </Link>
  );
}
