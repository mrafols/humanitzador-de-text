import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Humanitzador IA - Text indetectable",
  description:
    "Transforma text generat per IA en escriptura humana natural, indetectable per eines com Turnitin",
  keywords: ["humanitzar text", "text ia", "turnitin", "indetectable", "humanize ai text"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ca">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
