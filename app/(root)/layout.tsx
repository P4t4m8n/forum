import Header from "@/components/Header/Header";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <Header />
      <section>{children}</section>
    </main>
  );
}
