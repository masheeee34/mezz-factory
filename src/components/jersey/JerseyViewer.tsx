"use client";

import { useState, useDeferredValue } from "react";
import Image from "next/image";
import { useConfigurator } from "@/lib/store";

type Tab = "front" | "showcaze" | "verso";

export default function JerseyViewer() {
  const floquage        = useConfigurator((s) => s.floquage);
  const deferredFloquage = useDeferredValue(floquage);
  const [activeTab, setActiveTab] = useState<Tab>("front");

  const TABS = [
    { id: "front" as const, src: "/jersey/front.png", alt: "Maillot Face" },
    { id: "showcaze" as const, src: "/jersey/showcaze.png", alt: "Maillot Dos MEZZ'" },
    { id: "verso" as const, src: "/jersey/client.png", alt: "Personnaliser le Dos", isCustom: true },
  ];

  const activeIndex = TABS.findIndex(t => t.id === activeTab);

  // Custom name for the perso (verso) view — auto-sized so long names still fit.
  const floqName = (deferredFloquage.name ?? "").trim().toUpperCase();
  const nameFontSize =
    floqName.length <= 4 ? 152 :
    floqName.length <= 6 ? 136 :
    floqName.length <= 9 ? 114 : 96;

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* ── Image area ── */}
      <div className="relative w-full h-[360px] sm:h-[500px] md:h-[560px] lg:h-[600px] flex items-center justify-center">

        {/* 1. FRONT — Recto */}
        {activeTab === "front" && (
          <Image
            src="/jersey/front.png"
            alt="Maillot MEZZ' 190 — recto"
            fill
            priority
            sizes="(max-width: 768px) 90vw, 55vw"
            className="object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.95)]"
          />
        )}

        {/* 2. SHOWCAZE — Verso MEZZ' 190 */}
        {activeTab === "showcaze" && (
          <Image
            src="/jersey/showcaze.png"
            alt="Maillot MEZZ' 190 — dos"
            fill
            priority
            sizes="(max-width: 768px) 90vw, 55vw"
            className="object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.95)]"
          />
        )}

        {/* 3. PERSO — client.png + SVG name overlay (pixel-exact on the 2304×1844 art) */}
        {activeTab === "verso" && (
          <div className="relative h-full w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/jersey/client.png"
              alt="Template maillot"
              className="absolute inset-0 h-full w-full object-contain"
              style={{ filter: "drop-shadow(0 25px 50px rgba(0,0,0,0.9))" }}
            />
            {floqName && (
              <svg
                viewBox="0 0 2304 1844"
                preserveAspectRatio="xMidYMid meet"
                className="absolute inset-0 h-full w-full"
                style={{ pointerEvents: "none" }}
              >
                <defs>
                  {/* silver matched to the baked "190" grey */}
                  <linearGradient id="floqSilver" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#b2b2b4" />
                    <stop offset="50%" stopColor="#969698" />
                    <stop offset="100%" stopColor="#7c7c7e" />
                  </linearGradient>
                  {/* Just a soft drop shadow — Another Danger is already brushy,
                      so NO displacement (it warped the letters and looked bad). */}
                  <filter id="floqGrunge" x="-15%" y="-35%" width="130%" height="170%">
                    <feDropShadow dx="2" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.65" />
                  </filter>
                </defs>
                {/* baseline y≈482 sits just above the baked red underline (y≈503) */}
                <text
                  x="1152"
                  y="482"
                  textAnchor="middle"
                  fontFamily='"Another Danger", "Road Rage", Impact, sans-serif'
                  fontSize={nameFontSize}
                  letterSpacing="4"
                  fill="url(#floqSilver)"
                  filter="url(#floqGrunge)"
                >
                  {floqName}
                </text>
              </svg>
            )}
          </div>
        )}

        {/* Nike-style Pagination Dots Overlay */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
          {TABS.map((tab, idx) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === activeIndex ? "w-4 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Aller à la photo ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* ── Nike-style Thumbnails Strip ── */}
      <div className="flex justify-center gap-3 mt-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`relative aspect-square w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 bg-neutral-900/50 transition-all ${
              activeTab === tab.id
                ? "border-red-bright scale-105 opacity-100 shadow-lg"
                : "border-white/10 opacity-60 hover:opacity-100"
            }`}
          >
            <Image
              src={tab.src}
              alt={tab.alt}
              fill
              sizes="80px"
              className="object-cover"
            />
            {tab.isCustom && (
              <div className="absolute bottom-1 right-1 bg-red-bright/90 text-white font-mono text-[9px] font-bold px-1 py-0.5 rounded leading-none">
                PERSO
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
