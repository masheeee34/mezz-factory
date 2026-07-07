"use client";

import { useConfigurator } from "@/lib/store";

export default function FloquageControls() {
  const floquage = useConfigurator((s) => s.floquage);
  const setName  = useConfigurator((s) => s.setName);

  return (
    <div className="w-full max-w-md">
      <div className="mb-3 flex items-center justify-between border-l-2 border-red-bright pl-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-text">FLOQUAGE</h3>
      </div>

      <div className="flex flex-col gap-3">
        {/* NOM — éditable */}
        <label className="block">
          <span className="mb-1 block text-xs uppercase tracking-wider text-text font-bold">
            NOM
          </span>
          <input
            type="text"
            value={floquage.name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ton nom ici"
            maxLength={12}
            className="w-full rounded-lg border border-line bg-black/40 px-3 py-2 text-sm uppercase tracking-wide outline-none transition focus:border-red-bright focus:bg-black/60"
          />
        </label>

        {/* NUMÉRO — fixé à 190, non modifiable */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <span className="mb-1 block text-xs uppercase tracking-wider text-text font-bold">
              NUMÉRO
            </span>
            <div className="flex items-center gap-2 rounded-lg border border-line/40 bg-black/20 px-3 py-2">
              <span className="text-sm font-bold text-text tracking-widest">190</span>
              <span className="ml-auto text-xs text-white/90 font-bold italic">Édition limitée — non modifiable</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
