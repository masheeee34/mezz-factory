"use client";

import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import OrderForm from "@/components/OrderForm";
import Footer from "@/components/Footer";
import { useConfigurator } from "@/lib/store";
import Link from "next/link";

export default function CommandePage() {
  const { quantity } = useConfigurator();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar />

      <main className="min-h-[calc(100vh-72px)] pt-[100px] pb-16 flex flex-col justify-between">
        <div className="mx-auto max-w-6xl w-full px-4 sm:px-6">
          
          {/* Header de la page */}
          <div className="mb-10 text-center sm:text-left">
            <p className="text-xs uppercase tracking-[0.25em] text-red-bright font-black">
              Étape finale
            </p>
            <h1 
              className="headline mt-2 text-4xl sm:text-6xl text-text"
              style={{
                fontFamily: '"Pink Blue", "Road Rage", Impact, sans-serif',
                letterSpacing: "0.03em",
              }}
            >
              Finaliser la commande
            </h1>
            <p className="mt-2 text-sm text-text">
              Renseigne tes informations de livraison pour finaliser l&apos;achat de ton maillot MEZZ&apos; 190.
            </p>
          </div>

          {quantity === 0 ? (
            <div className="rounded-2xl border border-line bg-surface/30 p-12 text-center backdrop-blur-sm max-w-xl mx-auto">
              <h2 className="headline text-2xl text-text mb-4">Ton panier est vide</h2>
              <p className="text-sm text-text mb-8">
                Choisis ton maillot MEZZ&apos; 190 avant de passer commande.
              </p>
              <Link
                href="/"
                className="headline rounded-xl bg-red-bright px-8 py-3.5 text-lg text-white shadow-glow transition hover:bg-red"
                style={{
                  fontFamily: '"Pink Blue", "Road Rage", Impact, sans-serif',
                  letterSpacing: "0.03em",
                }}
              >
                Choisir mon maillot
              </Link>
            </div>
          ) : (
            <div className="mt-8">
              <OrderForm />
            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}
