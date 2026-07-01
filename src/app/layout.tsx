import type { Metadata } from "next";
import { Anton, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Anton = condensed, heavy — the fallback "jersey" look until Road Rage is added.
const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mezz Factory 190 — Édition limitée | GOUSSDAR",
  description:
    "Maillot GOUSSDAR Mezz Factory 190 en édition limitée. Floquage nom + numéro personnalisable. Livraison rapide et sécurisée.",
  openGraph: {
    title: "Mezz Factory 190 — Édition limitée",
    description: "Le maillot GOUSSDAR personnalisable. Édition limitée.",
    images: ["/jersey/back.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${inter.variable} ${anton.variable}`}>
      <body className="antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
