import { NextResponse } from "next/server";
import { z } from "zod";
import { sendOrderEmails } from "@/lib/email";
import dns from "node:dns/promises";

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
  
  // Valide l'existence réelle du domaine de l'adresse email (ex: bloque gamil.com ou hotmaill.fr)
  const emailDomain = order.customer.email.split("@")[1];
  try {
    const mx = await dns.resolveMx(emailDomain);
    if (!mx || mx.length === 0) {
      return NextResponse.json(
        { ok: false, error: "Le domaine de ton adresse e-mail n'existe pas ou ne peut pas recevoir d'e-mails (vérifie s'il y a une faute de frappe)." },
        { status: 400 }
      );
    }
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: "Le domaine de ton adresse e-mail n'existe pas ou ne peut pas recevoir d'e-mails (vérifie s'il y a une faute de frappe)." },
      { status: 400 }
    );
  }

  const orderId = `MZ-${Date.now().toString(36).toUpperCase()}`;

  console.log("[order]", orderId, JSON.stringify(order));

  // Send the branded confirmation email (customer + shop). Never blocks the
  // order: if email is down/unconfigured, the order still goes through.
  const mail = await sendOrderEmails(orderId, order);

  return NextResponse.json({ ok: true, orderId, emailSent: mail.sent });
}
