"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PRODUCT, formatEUR } from "@/lib/product";
import { useConfigurator, useReviewsStore } from "@/lib/store";
import type { OrderPayload } from "@/lib/types";

const schema = z.object({
  firstName: z.string().min(2, "Prénom requis"),
  lastName: z.string().min(2, "Nom requis"),
  email: z.string().email("Email invalide"),
  phone: z
    .string()
    .min(8, "Numéro invalide")
    .regex(/^[0-9 +().-]+$/, "Numéro invalide"),
  address: z.string().min(8, "Adresse complète requise"),
});

type FormValues = z.infer<typeof schema>;

interface AddressSuggestion {
  properties: {
    label: string;
  };
}

export default function OrderForm() {
  const { size, quantity, floquage } = useConfigurator();
  const total = PRODUCT.priceEUR * quantity;
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const [copied, setCopied] = useState(false);
  const [addressQuery, setAddressQuery] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);

  const addReview = useReviewsStore((s) => s.addReview);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  const handleCopyIBAN = () => {
    navigator.clipboard.writeText("FR7628233000019641984280730");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Autocomplete search via government API
  const handleAddressChange = async (val: string) => {
    setAddressQuery(val);
    setValue("address", val, { shouldValidate: true });

    if (val.trim().length < 4) {
      setAddressSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setLoadingAddress(true);
    try {
      const response = await fetch(
        `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(val)}&limit=5`
      );
      if (response.ok) {
        const data = await response.json();
        setAddressSuggestions(data.features || []);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
    } finally {
      setLoadingAddress(false);
    }
  };

  const selectAddress = (label: string) => {
    setAddressQuery(label);
    setValue("address", label, { shouldValidate: true });
    setAddressSuggestions([]);
    setShowSuggestions(false);
  };

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    const payload: OrderPayload = {
      customer: { ...values },
      order: {
        productId: PRODUCT.id,
        productName: PRODUCT.name,
        size,
        quantity,
        floquage,
        unitPriceEUR: PRODUCT.priceEUR,
        totalEUR: total,
      },
    };

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { ok: boolean; orderId?: string; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Erreur serveur");
      
      // Auto-submit review if comment is entered
      if (reviewComment.trim()) {
        addReview({
          id: Math.random().toString(36).substring(2, 9),
          name: `${values.firstName} ${values.lastName[0]}.`.toUpperCase(),
          rating: reviewRating,
          comment: reviewComment.trim(),
          date: "À l'instant",
          customization: `Taille ${size}` + (floquage.name ? ` · FLOQUAGE: ${floquage.name} ${floquage.number}` : "")
        });
      }

      setSubmitted(data.orderId ?? "OK");
      setReviewComment("");
      setReviewRating(5);
      setAddressQuery("");
      reset();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Erreur inconnue");
    }
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto py-4 text-center">
        {/* Titre principal brutaliste */}
        <h3 
          className="headline text-4xl sm:text-5xl text-red-bright uppercase tracking-wider mb-2"
          style={{ fontFamily: '"Pink Blue", "Road Rage", Impact, sans-serif' }}
        >
          Commande enregistrée !
        </h3>
        <p className="text-xs uppercase tracking-widest text-muted">
          Référence de commande : <span className="font-mono text-text font-bold select-all">{submitted}</span>
        </p>

        {/* Ligne de séparation fine */}
        <div className="my-8 border-t border-line/30" />

        {/* Section Règlement Épurée */}
        <div className="text-left space-y-8">
          <h4 className="text-xs font-black uppercase tracking-[0.25em] text-muted text-center">
            Règlement de la commande — {formatEUR(total)}
          </h4>

          {/* Option 1 — Revolut (Flat Button) */}
          <div className="flex flex-col items-center gap-3">
            <a
              href="https://revolut.me/lyamls9gv"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-3 rounded-lg bg-white px-6 py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-black transition hover:bg-neutral-200"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/revolut.jpg"
                alt="Revolut"
                className="h-4 w-auto object-contain rounded-sm"
              />
              <span>Régler via Revolut</span>
            </a>
            <span className="text-[10px] text-muted uppercase tracking-wider">
              Paiement instantané par carte ou compte Revolut
            </span>
          </div>

          {/* Séparateur minimaliste */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-line/20"></div>
            <span className="flex-shrink mx-4 text-[10px] text-muted uppercase tracking-widest">ou</span>
            <div className="flex-grow border-t border-line/20"></div>
          </div>

          {/* Option 2 — Virement SEPA (Flat Row) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-line/30 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-text">Virement Bancaire (RIB)</span>
              
              {/* French bank badges */}
              <div className="flex items-center gap-2 opacity-50">
                <svg width="12" height="12" viewBox="0 0 24 24" className="rounded-sm">
                  <rect width="24" height="11" fill="#FF0000" />
                  <rect y="13" width="24" height="11" fill="#000000" />
                  <rect y="11" width="24" height="2" fill="#FFFFFF" />
                </svg>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#00915a">
                  <circle cx="12" cy="12" r="12" />
                  <path d="M7 16l3-7 3 7M11 12h-3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M13 8c1.5 0 2 1.5 2 2.5s-.5 2.5-2 2.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span className="text-[8px] font-bold tracking-tighter text-white border border-white/20 px-1 rounded-sm">SEPA</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="w-full flex-1 rounded-lg border border-line bg-black/30 px-4 py-3 text-center sm:text-left font-mono text-sm text-text font-bold select-all tracking-wider">
                FR76 2823 3000 0196 4198 4280 730
              </div>
              <button
                type="button"
                onClick={handleCopyIBAN}
                className="w-full sm:w-auto rounded-lg border border-line bg-surface/50 px-6 py-3 text-xs font-bold uppercase tracking-widest text-text transition hover:border-text whitespace-nowrap"
              >
                {copied ? "IBAN Copié !" : "Copier"}
              </button>
            </div>
          </div>

          {/* Info Transfert */}
          <div className="text-center pt-4">
            <p className="text-[11px] text-muted leading-relaxed max-w-md mx-auto">
              <span className="font-bold text-red-bright">⚠️ IMPORTANT :</span> Indique impérativement la référence <span className="font-mono text-text font-bold">{submitted}</span> en libellé de ton paiement pour valider la production.
            </p>
          </div>
        </div>

        {/* Ligne de séparation fine */}
        <div className="my-8 border-t border-line/30" />

        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setSubmitted(null)}
            className="rounded-lg border border-line/40 px-8 py-3 text-xs font-bold uppercase tracking-widest text-muted transition hover:border-text hover:text-text"
          >
            Retour boutique
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Prénom" error={errors.firstName?.message}>
            <input {...register("firstName")} className={inputCls} autoComplete="given-name" />
          </Field>
          <Field label="Nom" error={errors.lastName?.message}>
            <input {...register("lastName")} className={inputCls} autoComplete="family-name" />
          </Field>
        </div>

        <Field label="Email" error={errors.email?.message}>
          <input {...register("email")} type="email" className={inputCls} autoComplete="email" />
        </Field>

        <Field label="Numéro de téléphone" error={errors.phone?.message}>
          <input {...register("phone")} type="tel" className={inputCls} autoComplete="tel" />
        </Field>

        <div className="relative">
          <Field label="Adresse complète" error={errors.address?.message}>
            <div className="relative">
              <input
                type="text"
                value={addressQuery}
                onChange={(e) => handleAddressChange(e.target.value)}
                onFocus={() => setShowSuggestions(addressSuggestions.length > 0)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className={`${inputCls} pr-10`}
                autoComplete="one-time-code"
                placeholder="Entrez votre numéro et nom de rue..."
              />
              {loadingAddress && (
                <div className="absolute right-3 top-[38px] flex items-center justify-center">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-bright border-t-transparent" />
                </div>
              )}
            </div>
            {/* Hidden register to hook into react-hook-form validation */}
            <input type="hidden" {...register("address")} />
          </Field>

          {/* Autocomplete Suggestions Dropdown */}
          {showSuggestions && addressSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 z-50 mt-1 max-h-56 overflow-y-auto rounded-lg border border-line bg-surface/95 p-1 shadow-2xl backdrop-blur-md">
              {addressSuggestions.map((suggestion, index) => {
                const label = suggestion.properties.label;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => selectAddress(label)}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left text-xs text-text hover:bg-white/10 transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted shrink-0">
                      <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span className="truncate">{label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Section Avis Intégrée (Streetwear Design) */}
        <div className="border-t border-line/30 pt-6 mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">
              Laisse ton avis sur le maillot (Optionnel)
            </span>
            <div className="flex gap-1 text-lg text-red-bright">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewRating(star)}
                  className="transition hover:scale-110"
                >
                  {star <= reviewRating ? "★" : "☆"}
                </button>
              ))}
            </div>
          </div>
          <textarea
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            rows={2}
            className={`${inputCls} resize-none`}
            placeholder="Qualité du tissu, coupe, flocage... donne ton avis !"
          />
        </div>

        {serverError && (
          <p className="text-sm text-red-bright">{serverError}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="headline mt-4 rounded-xl bg-red-bright px-8 py-3.5 text-xl text-white shadow-glow transition hover:bg-red disabled:opacity-60"
        >
          {isSubmitting ? "Envoi…" : "Valider la commande"}
        </button>
      </form>

      {/* Recap */}
      <aside className="h-fit rounded-xl bg-surface/40 p-5 backdrop-blur-sm">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide">
          Récapitulatif
        </h3>
        <dl className="space-y-2 text-sm">
          <Row label="Produit" value={PRODUCT.name} />
          <Row label="Taille" value={size} />
          <Row label="Quantité" value={String(quantity)} />
          <Row
            label="Floquage"
            value={`${floquage.name || "—"} ${floquage.number ? `· ${floquage.number}` : ""}`}
          />
        </dl>
        <div className="my-4 red-divider" />
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted">Total</span>
          <span className="text-2xl font-bold text-red-bright">
            {formatEUR(total)}
          </span>
        </div>
      </aside>
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-line bg-bg px-3 py-2.5 text-sm outline-none transition focus:border-red-bright";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs uppercase tracking-wide text-muted">
        {label}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-bright">{error}</span>}
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted">{label}</dt>
      <dd className="font-medium text-text">{value}</dd>
    </div>
  );
}
