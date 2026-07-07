import type { ReactNode } from "react";

interface Feature {
  title: string;
  desc: string;
  icon: ReactNode;
}

const FEATURES: Feature[] = [
  {
    title: "ÉDITION LIMITÉE",
    desc: "Quantités très limitées",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    title: "QUALITÉ PREMIUM",
    desc: "Tissu technique respirant",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="9 11.5 11.5 14 16 9.5" />
      </svg>
    ),
  },
  {
    title: "LIVRAISON RAPIDE",
    desc: "Expédition sous 48h",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    title: "PAIEMENT SÉCURISÉ",
    desc: "Transactions 100% sécurisées",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
];

export default function FeatureBar() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 mb-12">
      <div className="grid grid-cols-1 gap-6 border border-line/40 bg-black/60 p-6 rounded-xl backdrop-blur-md sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f) => (
          <div key={f.title} className="flex items-center gap-4">
            <span className="shrink-0 text-red-bright">{f.icon}</span>
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-text">
                {f.title}
              </p>
              <p className="text-xs text-text mt-0.5">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
