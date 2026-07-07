"use client";

import { useReviewsStore } from "@/lib/store";

export default function ReviewsSection() {
  const reviews = useReviewsStore((s) => s.reviews);

  return (
    <div className="w-full">
      {/* Grid d'avis */}
      <div className="grid gap-8 md:grid-cols-3 border-t border-line/30 pt-8">
        {reviews.map((r) => (
          <div key={r.id} className="flex flex-col justify-between space-y-4">
            
            {/* Note & Commentaire */}
            <div className="space-y-3">
              {/* Système d'étoiles brut */}
              <div className="flex gap-0.5 text-red-bright text-sm">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <span key={idx}>
                    {idx < r.rating ? "★" : "☆"}
                  </span>
                ))}
              </div>

              {/* Commentaire */}
              <p className="text-sm text-text leading-relaxed font-medium">
                &ldquo;{r.comment}&rdquo;
              </p>
            </div>

            {/* Auteur & Détails produit */}
            <div className="space-y-1 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-text">
                  {r.name}
                </span>
                <span className="text-[10px] text-text/80 uppercase tracking-wider">
                  {r.date}
                </span>
              </div>
              
              {r.customization && (
                <p className="text-[10px] text-text/80 uppercase tracking-wider font-bold">
                  {r.customization}
                </p>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
