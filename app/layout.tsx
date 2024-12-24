import type { Metadata } from "next";
import "@/public/globals.css";

import "@fontsource-variable/outfit";

export const metadata: Metadata = {
  title: "Twitter clone",
  description: "twitter clone by mohammed lamine bennouioua",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
