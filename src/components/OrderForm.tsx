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

export default function OrderForm() {
  const { size, quantity, floquage } = useConfigurator();
  const total = PRODUCT.priceEUR * quantity;
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const [copied, setCopied] = useState(false);

  const handleCopyIBAN = () => {
    navigator.clipboard.writeText("FR7628233000019641984280730");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
                  {/* Real Revolut Logo */}
                  <svg className="text-white" width="60" height="14" viewBox="0 0 450 100" fill="currentColor">
                    <path d="M38.5 0h17.1v97.9H38.5V0zM116.7 39.5c.3-11.4 8.7-18.7 20.3-18.7 11.2 0 19.3 7 19.9 17.5l.3 1.2h-40.5zm40.5 13.9c-.8 13-9.5 21.6-21.7 21.6-11.5 0-20.1-7.8-20.1-20.8 0-13 8.6-20.8 20.1-20.8 11.4 0 19.6 7.4 20.4 19.6v.4h17.1c-.9-21.3-16.7-33.9-37.5-33.9-22 0-37.3 15-37.3 34.7s15.3 34.7 37.3 34.7c20.5 0 36.4-12.2 37.5-33.9h-17.1c-.2 7.7-1.3 11-3.2 13.1zM286.9 23.2V8.4H270v71c0 10.9 6.8 17 18 17 4.1 0 7.8-.5 10.8-1.5V79.6c-2.3.8-4.9 1.1-7.4 1.1-4.7 0-7.3-2.6-7.3-7.7V23.2h17.9zM207.2 23.2l-21.8 55-21.8-55h-18.4l31.1 74.7H195l31.1-74.7h-18.9zM368.1 23.2h-17.1v40.3c0 9.8-5.3 14.5-12.7 14.5s-12.6-4.7-12.6-14.5V23.2h-17.1v41.6c0 19.2 11.9 29.5 29.7 29.5 9.7 0 17.5-4 21.1-10.2l1.6 8.8h17.1V23.2zM73.5 44c11.9 0 19.9-6.4 19.9-16.5S85.4 11 73.5 11h-18v33h18zM55.5 56.4h16.2L89.6 98h19.8L88.9 52.8C101.4 48.7 110.5 39.5 110.5 26c0-21-16.5-30-37-30h-35v102h17V56.4z" />
                  </svg>
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

        <Field label="Adresse complète" error={errors.address?.message}>
          <textarea
            {...register("address")}
            rows={3}
            className={`${inputCls} resize-none`}
            autoComplete="street-address"
            placeholder="Numéro, rue, code postal, ville"
          />
        </Field>

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
