export type Size = "S" | "M" | "L" | "XL" | "XXL";

export type JerseyFace = "front" | "back";

export interface Floquage {
  /** Name printed on the back (e.g. "MEZZ'"). */
  name: string;
  /** Number printed on the back (e.g. "190"). */
  number: string;
}

export interface GalleryImage {
  src: string;
  alt: string;
  /** Short label shown under the thumbnail. */
  label: string;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  priceEUR: number;
  description: string;
  bullets: string[];
  sizes: Size[];
  images: {
    front: string;
    back: string;
    gallery: GalleryImage[];
  };
  /** Default floquage shown on first load. */
  defaultFloquage: Floquage;
}

/** Payload sent to /api/order. */
export interface OrderPayload {
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
  };
  order: {
    productId: string;
    productName: string;
    size: Size;
    quantity: number;
    floquage: Floquage;
    unitPriceEUR: number;
    totalEUR: number;
  };
}
