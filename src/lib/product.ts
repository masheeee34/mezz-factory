import type { Product } from "@/lib/types";

/**
 * Single product for the landing page.
 * Swap these values / images to reuse the template for another jersey. (Vercel Trigger)
 */
export const PRODUCT: Product = {
  id: "mezz-190",
  name: "MEZZ' 190",
  tagline: "Édition limitée",
  priceEUR: 29.99,
  description:
    "Plus qu'un maillot, un symbole. Inspiré des rues, pensé pour les vrais.",
  bullets: [
    "Tissu respirant haute performance",
    "Confort optimal",
    "Design exclusif Mezz'",
    "Édition limitée",
  ],
  sizes: ["S", "M", "L", "XL", "XXL"],
  images: {
    front: "/jersey/showcaze.png",
    back: "/jersey/client.png",
    gallery: [
      { src: "/jersey/showcaze.png", alt: "Maillot Mezz' 190 — recto",  label: "Recto" },
      { src: "/jersey/client.png",   alt: "Maillot Mezz' 190 — verso",  label: "Verso" },
    ],
  },
  defaultFloquage: {
    name: "",
    number: "190",
  },
};

const euro = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

export function formatEUR(value: number): string {
  return euro.format(value);
}
