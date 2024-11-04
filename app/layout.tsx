import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Forum",
  description: "Basic Forum",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` antialiased bg-black`}>{children}</body>
    </html>
  );
}
