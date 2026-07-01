"use client";

import { useConfigurator } from "@/lib/store";

export default function QuantityStepper() {
  const quantity = useConfigurator((s) => s.quantity);
  const setQuantity = useConfigurator((s) => s.setQuantity);

  return (
    <div className="inline-flex items-center rounded-lg border border-line bg-surface/50">
      <button
        type="button"
        aria-label="Diminuer la quantité"
        onClick={() => setQuantity(quantity - 1)}
        className="grid h-11 w-11 place-items-center text-lg text-muted transition hover:text-text"
      >
        −
      </button>
      <span className="w-10 text-center text-sm font-semibold tabular-nums">
        {quantity}
      </span>
      <button
        type="button"
        aria-label="Augmenter la quantité"
        onClick={() => setQuantity(quantity + 1)}
        className="grid h-11 w-11 place-items-center text-lg text-muted transition hover:text-text"
      >
        +
      </button>
    </div>
  );
}
