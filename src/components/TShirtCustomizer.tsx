"use client";

import React, { useState } from "react";

export default function TShirtCustomizer() {
  const [name, setName] = useState("FACTORY");

  // --- CONFIGURATION DE POSITIONNEMENT (Facile à ajuster) ---
  const config = {
    topPosition: "23.5%", // Position verticale (sous le col / omoplates)
    fontSize: "clamp(1.2rem, 5vw, 2.5rem)", // Taille de texte adaptative
    rotation: "-1.5deg", // Légère rotation pour suivre la perspective du tissu
    textColor: "#c4c4c8", // Couleur gris texturé / métallisé
    letterSpacing: "0.08em",
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto p-6 bg-neutral-900/80 border border-white/10 rounded-2xl backdrop-blur-md">
      
      {/* 1. CONTENEUR DU MAILLOT */}
      <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-black select-none">
        
        {/* Image du dos du t-shirt vierge */}
        <img
          src="/jersey/client.png" // Chemin vers l'image vierge
          alt="T-shirt Dos Vierge"
          className="w-full h-full object-contain pointer-events-none"
        />

        {/* 2. CALQUE DE TEXTE ABSOLUTE */}
        <div
          style={{
            position: "absolute",
            top: config.topPosition,
            left: "50%",
            transform: `translate(-50%, -50%) rotate(${config.rotation})`,
            width: "80%",
            textAlign: "center",
            pointerEvents: "none", // Le texte n'intercepte pas les clics
          }}
        >
          <span
            style={{
              fontFamily: '"Road Rage", Impact, sans-serif', // Remplace par ta police
              fontSize: config.fontSize,
              color: config.textColor,
              letterSpacing: config.letterSpacing,
              textTransform: "uppercase",
              display: "block",
              fontWeight: "bold",
              // Double ombre portée pour détacher le texte de l'arrière-plan sombre
              textShadow: "1px 2px 4px rgba(0, 0, 0, 0.8), -1px -1px 2px rgba(0, 0, 0, 0.4)",
              // Effet texture subtil en utilisant un masque de fondu (optionnel)
              maskImage: "linear-gradient(rgba(0,0,0,1) 85%, rgba(0,0,0,0.85))",
            }}
          >
            {name}
          </span>
        </div>
      </div>

      {/* 3. MODULE DE SAISIE CLIENT */}
      <div className="w-full flex flex-col gap-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400">
          Personnalisation du Nom
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value.toUpperCase())}
          placeholder="Écris ton nom"
          maxLength={12}
          className="w-full px-4 py-2.5 rounded-lg border border-white/15 bg-black/40 text-white text-sm uppercase tracking-wide outline-none transition focus:border-red-500 focus:bg-black/60 placeholder:text-neutral-600"
        />
      </div>

    </div>
  );
}
