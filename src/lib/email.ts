import path from "node:path";
import nodemailer from "nodemailer";
import type { OrderPayload } from "@/lib/types";

// The site logo (brush font "MEZZ'") embedded in the email so the brand font
// shows in every inbox — email clients strip web fonts, but images always work.
const LOGO_PATH = path.join(process.cwd(), "public", "new-logo.png");
const LOGO_CID = "mezzlogo";

/**
 * Simple transactional email via SMTP (Nodemailer) — the Next.js equivalent of
 * a classic PHP mail() script. Sends from your own mailbox (e.g. Gmail).
 *
 * Configure these in .env.local (see .env.example):
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SITE_URL, SHOP_EMAIL
 * If SMTP_HOST is missing, sending is skipped (the order still succeeds).
 */

const SITE_URL = process.env.SITE_URL ?? "http://localhost:3005";
const SHOP_EMAIL = process.env.SHOP_EMAIL ?? "Mezzshop951@gmail.com";

const euro = (n: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);

const esc = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));

function transporter() {
  const port = Number(process.env.SMTP_PORT ?? 465);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465, // 465 = SSL, 587 = STARTTLS
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

/* ── Branded HTML (dark + red, Mezz Factory) — table layout for email clients ── */
export function orderEmailHTML(orderId: string, p: OrderPayload, forShop: boolean): string {
  const { customer, order } = p;
  const floq = order.floquage.name || order.floquage.number
    ? `${esc(order.floquage.name || "—")}${order.floquage.number ? ` · N°${esc(order.floquage.number)}` : ""}`
    : "Aucun";

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:10px 0;color:#9a9aa0;font-size:13px;border-bottom:1px solid #232327;">${label}</td>
      <td style="padding:10px 0;color:#f4f4f5;font-size:14px;font-weight:600;text-align:right;border-bottom:1px solid #232327;">${value}</td>
    </tr>`;

  const intro = forShop
    ? `Nouvelle commande reçue de <strong style="color:#f4f4f5;">${esc(customer.firstName)} ${esc(customer.lastName)}</strong>.`
    : `Merci <strong style="color:#f4f4f5;">${esc(customer.firstName)}</strong> ! Ta commande est bien enregistrée. Voici le récapitulatif.`;

  return `<!doctype html><html lang="fr"><body style="margin:0;padding:0;background:#08080a;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#08080a;padding:24px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#0e0e10;border:1px solid #232327;border-radius:14px;overflow:hidden;font-family:Arial,Helvetica,sans-serif;">

        <!-- Header (logo embedded via CID = real site font, shows everywhere) -->
        <tr><td style="padding:24px 30px 18px;border-bottom:2px solid #e11d2a;">
          <img src="cid:${LOGO_CID}" alt="MEZZ' FACTORY" width="180" style="width:180px;height:auto;display:block;" />
        </td></tr>

        <!-- Intro -->
        <tr><td style="padding:28px 30px 6px;">
          <p style="margin:0 0 4px;color:#e11d2a;font-size:12px;letter-spacing:2px;text-transform:uppercase;font-weight:bold;">${forShop ? "Commande" : "Confirmation"}</p>
          <h1 style="margin:0 0 10px;color:#ffffff;font-size:24px;">${forShop ? "🧾 Nouvelle commande" : "Ta commande est reçue"}</h1>
          <p style="margin:0;color:#b9b9bd;font-size:14px;line-height:1.6;">${intro}</p>
          <p style="margin:14px 0 0;color:#9a9aa0;font-size:13px;">N° de commande&nbsp;: <span style="color:#f4f4f5;font-family:monospace;">${orderId}</span></p>
        </td></tr>

        <!-- Order recap -->
        <tr><td style="padding:20px 30px 6px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${row("Produit", esc(order.productName))}
            ${row("Taille", esc(order.size))}
            ${row("Quantité", String(order.quantity))}
            ${row("Floquage", floq)}
            ${row("Prix unitaire", euro(order.unitPriceEUR))}
          </table>
        </td></tr>

        <!-- Total -->
        <tr><td style="padding:8px 30px 24px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#141416;border-radius:10px;">
            <tr>
              <td style="padding:16px 18px;color:#f4f4f5;font-size:15px;font-weight:bold;">TOTAL</td>
              <td style="padding:16px 18px;color:#e11d2a;font-size:22px;font-weight:bold;text-align:right;">${euro(order.totalEUR)}</td>
            </tr>
          </table>
        </td></tr>

        <!-- Delivery -->
        <tr><td style="padding:0 30px 24px;">
          <p style="margin:0 0 8px;color:#9a9aa0;font-size:12px;letter-spacing:1px;text-transform:uppercase;font-weight:bold;">Livraison</p>
          <p style="margin:0;color:#e8e8ea;font-size:14px;line-height:1.7;">
            ${esc(customer.firstName)} ${esc(customer.lastName)}<br/>
            ${esc(customer.address).replace(/\n/g, "<br/>")}<br/>
            ${esc(customer.phone)} · ${esc(customer.email)}
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:20px 30px 26px;border-top:1px solid #232327;">
          <p style="margin:0;color:#6f6f74;font-size:12px;line-height:1.6;">
            Mezz Factory — GOUSSDAR · Goussainville<br/>
            <a href="mailto:${SHOP_EMAIL}" style="color:#9a9aa0;">${SHOP_EMAIL}</a> · 06 02 52 33 23
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
  </body></html>`;
}

/** Send confirmation to the customer + a notification to the shop. */
export async function sendOrderEmails(
  orderId: string,
  payload: OrderPayload,
): Promise<{ sent: boolean; error?: string }> {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    console.warn("[email] SMTP not configured (.env.local) — email skipped");
    return { sent: false, error: "SMTP not configured" };
  }
  try {
    const t = transporter();
    const from = `"Mezz Factory" <${process.env.SMTP_USER}>`;
    const attachments = [{ filename: "logo.png", path: LOGO_PATH, cid: LOGO_CID }];

    await t.sendMail({
      from,
      to: payload.customer.email,
      subject: `Confirmation de commande ${orderId} — Mezz Factory`,
      html: orderEmailHTML(orderId, payload, false),
      attachments,
    });

    await t.sendMail({
      from,
      to: SHOP_EMAIL,
      replyTo: payload.customer.email,
      subject: `🧾 Nouvelle commande ${orderId} — ${payload.customer.firstName} ${payload.customer.lastName}`,
      html: orderEmailHTML(orderId, payload, true),
      attachments,
    });

    return { sent: true };
  } catch (err) {
    console.error("[email] send failed:", err);
    return { sent: false, error: err instanceof Error ? err.message : "unknown" };
  }
}
