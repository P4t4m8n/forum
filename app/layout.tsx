import type { Metadata } from "next";
import "./globals.css";
import { Cinzel } from "next/font/google";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal"],
  display: "swap",
});
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
      <body
        className={` antialiased bg-black overflow-y-scroll ${cinzel.className}`}
      >
        {children}
      </body>
    </html>
  );
}
