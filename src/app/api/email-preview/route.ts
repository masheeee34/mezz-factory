import { orderEmailHTML } from "@/lib/email";
import type { OrderPayload } from "@/lib/types";

const mockPayload: OrderPayload = {
  customer: {
    firstName: "Nassim",
    lastName: "Kaddour",
    email: "nassim.k95@gmail.com",
    phone: "06 12 34 56 78",
    address: "12 Rue de Paris\n95000 Goussainville",
  },
  order: {
    productId: "mezz190",
    productName: "Maillot MEZZ' 190",
    size: "L",
    quantity: 1,
    floquage: {
      name: "NASSIM",
      number: "10",
    },
    unitPriceEUR: 29.99,
    totalEUR: 29.99,
  },
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const forShop = type === "shop";

  const html = orderEmailHTML("MZ-DEMO123", mockPayload, forShop);
  
  // Replace the email attachment CID with the local logo path so it renders in browser
  const previewHtml = html.replace("cid:mezzlogo", "/new-logo.png");

  return new Response(previewHtml, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
