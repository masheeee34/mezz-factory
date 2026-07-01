"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PRODUCT, formatEUR } from "@/lib/product";
import { useConfigurator } from "@/lib/store";
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
      setSubmitted(data.orderId ?? "OK");
      setAddressQuery("");
      reset();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Erreur inconnue");
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-red-bright/20 bg-surface/30 p-6 sm:p-8 backdrop-blur-md max-w-2xl mx-auto text-center">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-bright/10 text-red-bright">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <path d="M22 4L12 14.01l-3-3" />
          </svg>
        </div>

        <h3 className="headline text-3xl text-red-bright">Commande enregistrée !</h3>
        <p className="mt-2 text-sm text-muted">
          Référence de commande : <span className="font-mono text-text font-bold">{submitted}</span>
        </p>

        <div className="my-6 border-t border-line/40" />

        {/* Bloc Règlement */}
        <div className="text-left">
          <h4 className="text-xs font-black uppercase tracking-[0.2em] text-muted mb-4 flex items-center gap-2">
            <span className="h-1.5 w-1.5 bg-red-bright" /> Mode de règlement ({formatEUR(total)})
          </h4>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Option A — Revolut */}
            <div className="rounded-xl border border-line bg-black/40 p-5 flex flex-col justify-between hover:border-white/20 transition-all">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-red-bright bg-red-bright/10 px-2 py-0.5 rounded">Option 1</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/revolut.jpg"
                    alt="Revolut"
                    className="h-6 w-auto object-contain rounded"
                  />
                </div>
                <h5 className="mt-4 text-base font-bold text-text">Paiement instantané</h5>
                <p className="mt-1.5 text-xs text-muted leading-relaxed">
                  Règlement direct sur Revolut. Tu peux payer avec ton compte ou par carte bancaire.
                </p>
              </div>
              <a
                href="https://revolut.me/lyamls9gv"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 block w-full rounded-lg bg-red-bright py-2.5 text-center text-xs font-bold uppercase tracking-widest text-white transition hover:bg-red shadow-glow"
              >
                Payer via Revolut
              </a>
            </div>

            {/* Option B — Virement */}
            <div className="rounded-xl border border-line bg-black/40 p-5 flex flex-col justify-between hover:border-white/20 transition-all">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-red-bright bg-red-bright/10 px-2 py-0.5 rounded">Option 2</span>
                  {/* Bank logos (Société Générale, BNP Paribas, SEPA) */}
                  <div className="flex items-center gap-1.5 opacity-60">
                    {/* Société Générale */}
                    <svg width="14" height="14" viewBox="0 0 24 24" className="rounded-sm">
                      <rect width="24" height="11" fill="#FF0000" />
                      <rect y="13" width="24" height="11" fill="#000000" />
                      <rect y="11" width="24" height="2" fill="#FFFFFF" />
                    </svg>
                    {/* BNP Paribas */}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#00915a">
                      <circle cx="12" cy="12" r="12" />
                      <path d="M7 16l3-7 3 7M11 12h-3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M13 8c1.5 0 2 1.5 2 2.5s-.5 2.5-2 2.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    {/* SEPA text */}
                    <span className="text-[9px] font-black tracking-tighter text-white border border-white/30 px-1 rounded-sm leading-none py-0.5">SEPA</span>
                  </div>
                </div>
                <h5 className="mt-4 text-base font-bold text-text">Virement Bancaire</h5>
                <p className="mt-1.5 text-xs text-muted leading-relaxed">
                  Fais un virement classique. Copie l&apos;IBAN ci-dessous pour l&apos;ajouter à ton application.
                </p>
                <div className="mt-3.5 rounded bg-black/60 p-2.5 text-center font-mono text-xs text-text border border-line/40 select-all tracking-wider font-bold">
                  FR76 2823 3000 0196 4198 4280 730
                </div>
              </div>
              
              <button
                type="button"
                onClick={handleCopyIBAN}
                className="mt-6 w-full rounded-lg border border-line/60 bg-surface/50 py-2.5 text-xs font-bold uppercase tracking-widest text-text transition hover:border-text"
              >
                {copied ? "IBAN Copié !" : "Copier l'IBAN"}
              </button>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-red-bright/20 bg-red-bright/5 p-4 text-xs text-muted leading-relaxed">
            <span className="font-bold text-red-bright">⚠️ INFO TRANSFERT :</span> Mets la référence de commande (<span className="font-mono text-text font-bold">{submitted}</span>) en libellé de ton virement ou Revolut pour qu&apos;on valide la production de ton maillot directement.
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setSubmitted(null)}
            className="rounded-lg border border-line/40 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-muted transition hover:border-text hover:text-text"
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
                autoComplete="off"
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

        {serverError && (
          <p className="text-sm text-red-bright">{serverError}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="headline mt-2 rounded-xl bg-red-bright px-8 py-3.5 text-xl text-white shadow-glow transition hover:bg-red disabled:opacity-60"
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
