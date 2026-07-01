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
          <h4 className="text-sm font-bold uppercase tracking-wider text-text mb-4 text-center sm:text-left">
            💳 COMMENT RÉGLER VOTRE COMMANDE ({formatEUR(total)}) :
          </h4>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Option A — Revolut */}
            <div className="rounded-xl border border-line/40 bg-black/20 p-4 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-red-bright">Option 1</span>
                <h5 className="mt-1 text-sm font-semibold text-text">Lien instantané Revolut</h5>
                <p className="mt-2 text-xs text-muted leading-relaxed">
                  Payez de manière sécurisée en un clic via l&apos;application Revolut ou par carte.
                </p>
              </div>
              <a
                href="https://revolut.me/lyamls9gv"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block w-full rounded-lg bg-red-bright py-2 text-center text-xs font-bold uppercase tracking-widest text-white transition hover:bg-red"
              >
                Payer via Revolut
              </a>
            </div>

            {/* Option B — Virement */}
            <div className="rounded-xl border border-line/40 bg-black/20 p-4 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-red-bright">Option 2</span>
                <h5 className="mt-1 text-sm font-semibold text-text">Virement Bancaire</h5>
                <p className="mt-2 text-xs text-muted leading-relaxed">
                  Effectuez un virement classique. L&apos;IBAN (RIB) est disponible ci-dessous.
                </p>
                <div className="mt-3 rounded bg-black/40 p-2 text-center font-mono text-xs text-text border border-line/20 select-all">
                  FR76 2823 3000 0196 4198 4280 730
                </div>
              </div>
              
              <button
                type="button"
                onClick={handleCopyIBAN}
                className="mt-4 w-full rounded-lg border border-line bg-surface py-2 text-xs font-bold uppercase tracking-widest text-text transition hover:border-text"
              >
                {copied ? "IBAN Copié !" : "Copier l'IBAN"}
              </button>
            </div>
          </div>

          <div className="mt-5 rounded-lg border border-red-bright/20 bg-red-bright/5 p-3 text-xs text-muted leading-relaxed">
            <span className="font-bold text-red-bright">⚠️ IMPORTANT :</span> Veuillez indiquer impérativement la référence de votre commande (<span className="font-mono text-text font-bold">{submitted}</span>) dans le libellé de votre virement ou de votre paiement Revolut afin que nous puissions valider votre commande immédiatement.
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setSubmitted(null)}
            className="rounded-lg border border-line/60 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-muted transition hover:border-text hover:text-text"
          >
            Retour à la boutique
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
