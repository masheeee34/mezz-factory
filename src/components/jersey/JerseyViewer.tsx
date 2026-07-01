"use client";

import { useEffect, useRef, useState, useCallback, useDeferredValue } from "react";
import Image from "next/image";
import { useConfigurator } from "@/lib/store";
import type { Floquage } from "@/lib/types";

const JERSEY = {
  collarY:    0.155,
  nameY:      0.222,     // Visual sweet spot for Road Rage name centering
  underlineY: 0.355,
  numberY:    0.52,
  cx:         0.5,
};

const FONT_NAME   = `"Road Rage", "Anton", Impact, sans-serif`;
const FONT_NUMBER = `"Road Rage", "Anton", Impact, sans-serif`;
const FONT_LABEL  = `"Anton", Impact, sans-serif`;
const COLLAR_TEXT  = "GOUSSAINVILLE";
const FIXED_NUMBER = "190";

/* ─── canvas renderer ─── */
function renderFloquage(
  ctx:       CanvasRenderingContext2D,
  jerseyImg: HTMLImageElement,
  floquage:  Floquage,
  brushImg:  HTMLImageElement | null,
  distressImg: HTMLImageElement | null,
) {
  const w  = ctx.canvas.width;
  const h  = ctx.canvas.height;
  const cx = w * JERSEY.cx;

  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(jerseyImg, 0, 0, w, h);

  const name = (floquage.name ?? "").trim().toUpperCase();

  // (GOUSSAINVILLE collar label is already printed on client.png - disabled here to avoid duplicate blur)

  const offscreen = document.createElement("canvas");
  offscreen.width  = w;
  offscreen.height = h;
  const off = offscreen.getContext("2d")!;

  /* ── NAME only — number is already printed on the jersey photo ── */
  if (name) {
    const nameFontSize = h * 0.082; // Bold, impactful sizing matching reference
    off.save();
    off.textAlign     = "center";
    off.textBaseline  = "alphabetic";
    off.font          = `${nameFontSize}px ${FONT_NAME}`;
    off.letterSpacing = `${nameFontSize * 0.07}px`;

    // Lighter silver-grey gradient matching the original name's lightness
    const nameGrad = off.createLinearGradient(
      cx, h * (JERSEY.nameY - 0.07),
      cx, h * JERSEY.nameY
    );
    nameGrad.addColorStop(0,   "#ffffff");
    nameGrad.addColorStop(0.5, "#dcdcdc");
    nameGrad.addColorStop(1,   "#b0b0b3");
    off.fillStyle     = nameGrad;

    off.shadowColor   = "rgba(0,0,0,0.55)";
    off.shadowBlur    = nameFontSize * 0.18;
    off.shadowOffsetX = nameFontSize * 0.02;
    off.shadowOffsetY = nameFontSize * 0.06;
    off.fillText(name, cx, h * JERSEY.nameY);
    off.restore();

    // Apply the distress/grunge scratches inside the letters with high opacity for visible cracks
    if (distressImg) {
      off.save();
      off.globalCompositeOperation = "source-atop";
      off.globalAlpha = 0.75; // Increased opacity for distinct texture cracks
      // Draw distress stretched over the name area
      off.drawImage(
        distressImg, 
        cx - w * 0.3, 
        h * (JERSEY.nameY - 0.08), 
        w * 0.6, 
        h * 0.1
      );
      off.restore();
    }
  }

  // 6 — Composite text onto jersey
  ctx.drawImage(offscreen, 0, 0);
}

/* ─── component ─── */
type Tab = "front" | "showcaze" | "verso";

export default function JerseyViewer() {
  const floquage        = useConfigurator((s) => s.floquage);
  const deferredFloquage = useDeferredValue(floquage);

  const [activeTab, setActiveTab] = useState<Tab>("front");
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const [backImg,   setBackImg]   = useState<HTMLImageElement | null>(null);
  const [brushImg,  setBrushImg]  = useState<HTMLImageElement | null>(null);
  const [distressImg, setDistressImg] = useState<HTMLImageElement | null>(null);
  const [fontsReady, setFontsReady] = useState(false);

  // Load client.png — clean back template for canvas rendering
  useEffect(() => {
    const img = new window.Image();
    img.onload = () => setBackImg(img);
    img.src    = "/jersey/client.png";
  }, []);

  // Load red brush stroke
  useEffect(() => {
    const img = new window.Image();
    img.onload = () => setBrushImg(img);
    img.src    = "/jersey/brush-red.png";
  }, []);

  // Load grunge distress texture (used to add black cracks/scratches inside the letters)
  useEffect(() => {
    const img = new window.Image();
    img.onload = () => setDistressImg(img);
    img.src    = "/jersey/distress.png";
  }, []);

  // Wait for fonts
  useEffect(() => {
    if (typeof document === "undefined") return;
    const load = async () => {
      try {
        await Promise.all([
          document.fonts.load('64px "Road Rage"'),
          document.fonts.load('64px "Anton"'),
        ]);
        await document.fonts.ready;
      } catch {}
      setFontsReady(true);
    };
    load();
  }, []);

  const TABS = [
    { id: "front" as const, src: "/jersey/front.png", alt: "Maillot Face" },
    { id: "showcaze" as const, src: "/jersey/showcaze.png", alt: "Maillot Dos MEZZ'" },
    { id: "verso" as const, src: "/jersey/client.png", alt: "Personnaliser le Dos", isCustom: true },
  ];

  const activeIndex = TABS.findIndex(t => t.id === activeTab);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !backImg) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const maxSize = 900;
    const ratio   = backImg.naturalWidth / backImg.naturalHeight;
    const cw      = ratio >= 1 ? maxSize : Math.round(maxSize * ratio);
    const ch      = ratio >= 1 ? Math.round(maxSize / ratio) : maxSize;
    canvas.width  = cw;
    canvas.height = ch;
    renderFloquage(ctx, backImg, deferredFloquage, brushImg, distressImg);
  }, [backImg, deferredFloquage, brushImg, distressImg]);

  useEffect(() => {
    if (fontsReady && activeTab === "verso") draw();
  }, [fontsReady, draw, activeTab]);

  // also draw when tab switches to verso
  useEffect(() => {
    if (activeTab === "verso" && fontsReady) draw();
  }, [activeTab, fontsReady, draw]);

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
        {TABS.map((tab, idx) => (
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
