"use client";

import { useConfigurator } from "@/lib/store";
import { PRODUCT } from "@/lib/product";

export default function SizeSelector() {
  const size = useConfigurator((s) => s.size);
  const setSize = useConfigurator((s) => s.setSize);

  return (
    <div>
      <span className="mb-2 block text-center text-xs uppercase tracking-wider text-muted font-bold">
        TAILLE
      </span>
      <div className="flex flex-wrap justify-center gap-2">
        {PRODUCT.sizes.map((s) => {
          const active = s === size;
          return (
            <button
              key={s}
              type="button"
              onClick={() => setSize(s)}
              aria-pressed={active}
              className={`h-11 w-12 rounded-lg border text-sm font-semibold transition ${
                active
                  ? "border-red-bright bg-red-bright text-white"
                  : "border-line bg-surface/50 text-text hover:border-muted"
              }`}
            >
              {s}
            </button>
          );
        })}
      </div>
    </div>
  );
}
