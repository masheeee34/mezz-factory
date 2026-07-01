"use client";

import { PRODUCT, formatEUR } from "@/lib/product";
import { useConfigurator } from "@/lib/store";
import FloquageControls from "@/components/FloquageControls";
import SizeSelector from "@/components/SizeSelector";
import QuantityStepper from "@/components/QuantityStepper";

import { useRouter } from "next/navigation";

export default function ProductPanel() {
  const addToCart = useConfigurator((s) => s.addToCart);
  const router = useRouter();

  const handleAdd = () => {
    addToCart();
    router.push("/commande");
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Titre image — MEZZ' 190 + ÉDITION LIMITÉE (caché sur mobile, géré par le layout parent) */}
      <div className="hidden lg:block" style={{ marginBottom: "-8px" }}>
        <img
          src="/title-mezz190.png"
          alt="MEZZ' 190 — Édition limitée"
          style={{
            width: "100%",
            maxWidth: "320px",
            height: "auto",
            display: "block",
            margin: "0 auto",
            mixBlendMode: "lighten",
          }}
        />
      </div>

      {/* Prix */}
      <p className="text-2xl font-bold text-red-bright">
        {formatEUR(PRODUCT.priceEUR)}
      </p>

      {/* Description */}
      <p className="max-w-md text-sm leading-relaxed" style={{ color: "#c4c4c8" }}>
        {PRODUCT.description}
      </p>

      {/* Bullets */}
      <ul className="space-y-1.5">
        {PRODUCT.bullets.map((b) => (
          <li key={b} className="flex items-center gap-2 text-sm" style={{ color: "#e8e8ea" }}>
            <span className="h-1.5 w-1.5 flex-shrink-0 bg-red-bright" />
            {b}
          </li>
        ))}
      </ul>

      <FloquageControls />

      {/* Taille */}
      <SizeSelector />

      {/* Quantité + Panier */}
      <div className="flex w-full max-w-md flex-wrap items-center gap-3">
        <QuantityStepper />
        <button
          type="button"
          onClick={handleAdd}
          className="flex-1 rounded-xl bg-red-bright px-8 py-3.5 text-white transition hover:bg-red focus:outline-none focus:ring-2 focus:ring-red-bright/60"
          style={{
            fontFamily: '"Pink Blue", "Road Rage", Impact, sans-serif',
            fontSize: "1.3rem",
            textTransform: "uppercase",
            letterSpacing: "0.03em",
          }}
        >
          AJOUTER AU PANIER
        </button>
      </div>

      {/* Livraison */}
      <p className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted font-bold">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-red-bright flex-shrink-0">
          <path d="M3 7h11v8H3zM14 10h4l3 3v2h-7z" strokeLinejoin="round" />
          <circle cx="7" cy="17" r="1.6" />
          <circle cx="17.5" cy="17" r="1.6" />
        </svg>
        LIVRAISON RAPIDE &amp; SÉCURISÉE
      </p>
    </div>
  );
}
