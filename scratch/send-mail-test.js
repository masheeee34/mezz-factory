import fs from 'node:fs';
import path from 'node:path';
import nodemailer from 'nodemailer';

// Read env variables manually from .env.local
const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    env[parts[0].trim()] = parts.slice(1).join('=').trim();
  }
});

const SITE_URL = env.SITE_URL || "https://mezz-factory.vercel.app";
const SHOP_EMAIL = env.SHOP_EMAIL || "Mezzshop951@gmail.com";
const SMTP_HOST = env.SMTP_HOST;
const SMTP_PORT = Number(env.SMTP_PORT || 465);
const SMTP_USER = env.SMTP_USER;
const SMTP_PASS = env.SMTP_PASS;

const LOGO_PATH = path.join(process.cwd(), "public", "new-logo.png");
const LOGO_CID = "mezzlogo";

const euro = (n) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);

const esc = (s) =>
  s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function orderEmailHTML(orderId, p, forShop) {
  const { customer, order } = p;
  const floq = order.floquage.name || order.floquage.number
    ? `${esc(order.floquage.name || "—")}${order.floquage.number ? ` · N°${esc(order.floquage.number)}` : ""}`
    : "Aucun";

  const row = (label, value) => `
    <tr>
      <td style="padding:10px 0;color:#9a9aa0;font-size:13px;border-bottom:1px solid #232327;">${label}</td>
      <td style="padding:10px 0;color:#f4f4f5;font-size:14px;font-weight:600;text-align:right;border-bottom:1px solid #232327;">${value}</td>
    </tr>`;

  const intro = forShop
    ? `Nouvelle commande reçue de <strong style="color:#f4f4f5;">${esc(customer.firstName)} ${esc(customer.lastName)}</strong>.`
    : `Merci <strong style="color:#f4f4f5;">${esc(customer.firstName)}</strong> ! Ta commande est bien enregistrée. Voici le récapitulatif.`;

  return `<!doctype html><html lang="fr">
  <head>
    <meta charset="utf-8">
    <style>
      @font-face {
        font-family: 'Another Danger';
        src: local('Another Danger'), url('${SITE_URL}/fonts/AnotherDanger.otf') format('opentype');
        font-weight: normal;
        font-style: normal;
      }
      .brand-font {
        font-family: 'Another Danger', Impact, 'Arial Black', sans-serif !important;
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background:#08080a;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#08080a;padding:24px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#0e0e10;border:1px solid #232327;border-radius:14px;overflow:hidden;font-family:Arial,Helvetica,sans-serif;">
 
        <!-- Header (logo embedded via CID) -->
        <tr><td style="padding:24px 30px 18px;border-bottom:2px solid #e11d2a;">
          <img src="cid:${LOGO_CID}" alt="MEZZ' FACTORY" width="180" style="width:180px;height:auto;display:block;" />
        </td></tr>
 
        <!-- Intro -->
        <tr><td style="padding:28px 30px 6px;">
          <p class="brand-font" style="margin:0 0 4px;color:#e11d2a;font-size:14px;letter-spacing:2px;text-transform:uppercase;font-family:'Another Danger', Impact, 'Arial Black', sans-serif;">${forShop ? "COMMANDE" : "CONFIRMATION"}</p>
          <h1 class="brand-font" style="margin:0 0 12px;color:#ffffff;font-size:26px;font-family:'Another Danger', Impact, 'Arial Black', sans-serif;font-weight:normal;text-transform:uppercase;letter-spacing:0.5px;">${forShop ? "NOUVELLE COMMANDE" : "TA COMMANDE EST REÇUE"}</h1>
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
              <td class="brand-font" style="padding:16px 18px;color:#f4f4f5;font-size:18px;font-family:'Another Danger', Impact, 'Arial Black', sans-serif;letter-spacing:1px;">TOTAL</td>
              <td style="padding:16px 18px;color:#e11d2a;font-size:22px;font-weight:bold;text-align:right;font-family:Arial, Helvetica, sans-serif;">${euro(order.totalEUR)}</td>
            </tr>
          </table>
        </td></tr>
 
        <!-- Delivery -->
        <tr><td style="padding:0 30px 24px;">
          <p class="brand-font" style="margin:0 0 8px;color:#9a9aa0;font-size:14px;letter-spacing:1px;text-transform:uppercase;font-family:'Another Danger', Impact, 'Arial Black', sans-serif;">Livraison</p>
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

const mockPayload = {
  customer: {
    firstName: "Aymane",
    lastName: "Factory",
    email: "aymanediscord953@gmail.com",
    phone: "06 02 52 33 23",
    address: "GOUSSDAR\n95190 Goussainville",
  },
  order: {
    productId: "mezz190",
    productName: "Maillot MEZZ' 190",
    size: "L",
    quantity: 1,
    floquage: {
      name: "AYMANE",
      number: "190",
    },
    unitPriceEUR: 29.99,
    totalEUR: 29.99,
  },
};

async function main() {
  console.log("SMTP HOST:", SMTP_HOST);
  console.log("SMTP USER:", SMTP_USER);
  
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  const attachments = [{ filename: "logo.png", path: LOGO_PATH, cid: LOGO_CID }];

  console.log("Sending email to client...");
  await transporter.sendMail({
    from: `"Mezz Factory" <${SMTP_USER}>`,
    to: "aymanediscord953@gmail.com",
    subject: `Confirmation de commande MZ-TEST190 — Mezz Factory`,
    html: orderEmailHTML("MZ-TEST190", mockPayload, false),
    attachments,
  });

  console.log("Email sent successfully!");
}

main().catch(err => console.error("Error sending mail:", err));
