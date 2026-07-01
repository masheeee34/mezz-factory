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

        {/* 3. PERSO — CSS overlay */}
        {activeTab === "verso" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="relative h-full" 
              style={{ 
                aspectRatio: "2304/1844",
                containerType: "size"
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/jersey/client.png"
                alt="Template maillot"
                className="h-full w-auto object-contain"
                style={{ filter: "drop-shadow(0 25px 50px rgba(0,0,0,0.9))" }}
              />
              {deferredFloquage.name?.trim() && (
                <div
                  style={{
                    position: "absolute",
                    top: "22.5%",
                    left: "50%",
                    transform: "translate(-50%, -100%)",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    pointerEvents: "none",
                  }}
                >
                  <span
                    style={{
                      fontFamily: '"Road Rage", Impact, sans-serif',
                      fontSize: "7.8cqh",
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                      background: "linear-gradient(180deg, #f5f5f5 0%, #d4d4d4 50%, #a8a8a8 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      filter: "drop-shadow(1px 3px 6px rgba(0,0,0,0.85))",
                      display: "block",
                    }}
                  >
                    {deferredFloquage.name.trim().toUpperCase()}
                  </span>
                </div>
              )}
            </div>
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
