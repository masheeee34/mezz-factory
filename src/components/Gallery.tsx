"use client";

import { useState } from "react";
import Image from "next/image";
import { PRODUCT } from "@/lib/product";

export default function Gallery() {
  const images = PRODUCT.images.gallery;
  const [active, setActive] = useState(0);
  const current = images[active];

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div className="relative aspect-[4/3] w-full sm:aspect-[16/10]">
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 60vw"
          className="object-contain"
        />
        <span className="absolute left-2 top-2 text-xs uppercase tracking-[0.25em] text-muted">
          {current.label}
        </span>
      </div>

      {/* Thumbnails (Nike-style strip) */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => setActive(i)}
            aria-label={img.label}
            aria-current={i === active}
            className={`relative aspect-square h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition ${
              i === active
                ? "border-red-bright opacity-100"
                : "border-transparent opacity-60 hover:opacity-100"
            }`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="80px"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
