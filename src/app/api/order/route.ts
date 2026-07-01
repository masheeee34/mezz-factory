import { NextResponse } from "next/server";
import { z } from "zod";

const orderSchema = z.object({
  customer: z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(8),
    address: z.string().min(8),
  }),
  order: z.object({
    productId: z.string(),
    productName: z.string(),
    size: z.enum(["S", "M", "L", "XL", "XXL"]),
    quantity: z.number().int().min(1).max(10),
    floquage: z.object({
      name: z.string().max(12),
      number: z.string().max(3),
    }),
    unitPriceEUR: z.number(),
    totalEUR: z.number(),
  }),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON invalide" }, { status: 400 });
  }

  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Données invalides", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const order = parsed.data;
  const orderId = `MZ-${Date.now().toString(36).toUpperCase()}`;

  // TODO (production): brancher l'envoi réel ici.
  //  - Email   : Resend / Nodemailer vers Mezzshop951@gmail.com
  //  - Stockage: base de données (Postgres, Supabase, Notion…)
  //  - Paiement: Stripe Checkout (créer la session et renvoyer l'URL)
  console.log("[order]", orderId, JSON.stringify(order));

  return NextResponse.json({ ok: true, orderId });
}
