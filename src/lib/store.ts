"use client";

import { create } from "zustand";
import type { Floquage, JerseyFace, Size } from "@/lib/types";
import { PRODUCT } from "@/lib/product";

interface ConfiguratorState {
  /** Which side of the jersey the 3D viewer is facing. */
  face: JerseyFace;
  floquage: Floquage;
  size: Size;
  quantity: number;
  /** Number of items the user added to the cart (drives the navbar badge). */
  cartCount: number;

  setFace: (face: JerseyFace) => void;
  flip: () => void;
  setName: (name: string) => void;
  setNumber: (number: string) => void;
  setSize: (size: Size) => void;
  setQuantity: (quantity: number) => void;
  addToCart: () => void;
}

const MAX_NAME = 12;
const MAX_NUMBER = 3;

export const useConfigurator = create<ConfiguratorState>((set) => ({
  face: "front",
  floquage: { ...PRODUCT.defaultFloquage },
  size: "M",
  quantity: 1,
  cartCount: 0,

  setFace: (face) => set({ face }),
  flip: () => set((s) => ({ face: s.face === "front" ? "back" : "front" })),

  setName: (name) =>
    set((s) => ({
      floquage: { ...s.floquage, name: name.toUpperCase().slice(0, MAX_NAME) },
      face: "back",
    })),

  setNumber: (number) =>
    set((s) => ({
      floquage: {
        ...s.floquage,
        number: number.replace(/\D/g, "").slice(0, MAX_NUMBER),
      },
      face: "back",
    })),

  setSize: (size) => set({ size }),
  setQuantity: (quantity) => set({ quantity: Math.max(1, Math.min(10, quantity)) }),
  addToCart: () => set((s) => ({ cartCount: s.cartCount + s.quantity })),
}));

/* ─── persistent reviews store ─── */
import { persist } from "zustand/middleware";

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  customization?: string;
}

interface ReviewsState {
  reviews: Review[];
  addReview: (review: Review) => void;
}

export const useReviewsStore = create<ReviewsState>()(
  persist(
    (set) => ({
      reviews: [
        {
          id: "1",
          name: "SOFIANE K.",
          rating: 5,
          comment: "Franchement incroyable. Le tissu est super épais, la coupe tombe parfaitement. Le floquage Road Rage est ultra propre.",
          date: "Il y a 2 jours",
          customization: "Taille L · FLOQUAGE: SOFIANE 95"
        },
        {
          id: "2",
          name: "LUCAS M.",
          rating: 5,
          comment: "Reçu en 4 jours. La bande rouge peinte et le gris dégradé sur le nom rendent trop bien en vrai.",
          date: "Il y a 5 jours",
          customization: "Taille XL · FLOQUAGE: LUCAS 10"
        },
        {
          id: "3",
          name: "YASMINA B.",
          rating: 5,
          comment: "Qualité streetwear lourde. L'effet usé sur les chiffres est ultra détaillé. Je recommande fort.",
          date: "Il y a 1 semaine",
          customization: "Taille S"
        }
      ],
      addReview: (review) => set((s) => ({ reviews: [review, ...s.reviews] })),
    }),
    {
      name: "mezz-reviews-storage",
    }
  )
);
