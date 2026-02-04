import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LinkVault - Bookmark Manager",
  description: "Organize, search, and manage your bookmarks efficiently. Import/export, categorize, and never lose a link again.",
  keywords: ["bookmark manager", "link organizer", "bookmarks", "save links", "organize links"],
  openGraph: {
    title: "LinkVault - Bookmark Manager",
    description: "Organize, search, and manage your bookmarks efficiently.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
