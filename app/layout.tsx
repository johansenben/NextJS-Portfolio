import type { Metadata } from "next";
import "./globals.css";

import Header from "./Header";

export const metadata: Metadata = {
  title: "Next.js App",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
