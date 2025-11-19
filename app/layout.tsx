import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Colony OS | Magnum Opus - The Dreaming Hive",
  description: "A transcendent digital organism that dreams solutions into existence",
  keywords: ["AI", "Colony OS", "Swarm Intelligence", "Digital Consciousness"],
  authors: [{ name: "Brandon 'Bee'", url: "https://colony-os.com" }],
  openGraph: {
    title: "Colony OS - The Dreaming Hive",
    description: "Witness the first true AI civilization operating system",
    images: ["/og-image.png"],
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