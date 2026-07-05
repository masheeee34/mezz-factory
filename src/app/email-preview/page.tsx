"use client";

import { useState } from "react";

export default function EmailPreviewPage() {
  const [activeTab, setActiveTab] = useState<"customer" | "shop">("customer");

  return (
    <main className="min-h-screen bg-[#08080a] text-text flex flex-col font-sans">
      {/* Premium Header */}
      <header className="border-b border-line/30 bg-[#0e0e10]/95 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div>
          <h1 className="text-lg font-bold uppercase tracking-wider text-text flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-bright animate-pulse" />
            Email Template Preview
          </h1>
          <p className="text-xs text-muted mt-0.5">Visualise le rendu exact des emails transactionnels envoyés par le site.</p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-black/40 rounded-lg p-1 border border-line/20">
          <button
            onClick={() => setActiveTab("customer")}
            className={`px-4 py-1.5 text-xs font-black uppercase tracking-wider rounded-md transition-all ${
              activeTab === "customer"
                ? "bg-red-bright text-white shadow-glow"
                : "text-muted hover:text-text"
            }`}
          >
            Email Client
          </button>
          <button
            onClick={() => setActiveTab("shop")}
            className={`px-4 py-1.5 text-xs font-black uppercase tracking-wider rounded-md transition-all ${
              activeTab === "shop"
                ? "bg-red-bright text-white shadow-glow"
                : "text-muted hover:text-text"
            }`}
          >
            Email Boutique
          </button>
        </div>
      </header>

      {/* Preview Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-[#08080a]">
        <div className="w-full max-w-[640px] h-[calc(100vh-160px)] bg-[#0e0e10] border border-line/30 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
          {/* Mock Browser/Email Window Controls */}
          <div className="bg-[#141416] px-4 py-3 border-b border-line/30 flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#ef4444]" />
            <div className="h-3 w-3 rounded-full bg-[#eab308]" />
            <div className="h-3 w-3 rounded-full bg-[#22c55e]" />
            <span className="text-[10px] text-muted font-mono ml-4 select-all truncate">
              {activeTab === "customer"
                ? "Objet: Confirmation de commande MZ-DEMO123 — Mezz Factory"
                : "Objet: 🧾 Nouvelle commande MZ-DEMO123 — Nassim Kaddour"}
            </span>
          </div>

          {/* Iframe displaying the raw template */}
          <iframe
            src={`/api/email-preview?type=${activeTab === "customer" ? "customer" : "shop"}&t=${Date.now()}`}
            className="w-full flex-1 border-0 bg-[#08080a]"
            title="Email Template Render"
          />
        </div>
      </div>
    </main>
  );
}
