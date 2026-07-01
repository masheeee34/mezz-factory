import Navbar from "@/components/Navbar";
import JerseyViewer from "@/components/jersey/JerseyViewer";
import ProductPanel from "@/components/ProductPanel";
import Gallery from "@/components/Gallery";
import FeatureBar from "@/components/FeatureBar";
import ReviewsSection from "@/components/ReviewsSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="pt-[72px]">
        {/* ── HERO ── */}
        <section
          id="accueil"
          className="relative min-h-[calc(100vh-72px)] flex flex-col justify-between"
        >
          <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 flex-1 flex items-center py-6 sm:py-8">
            <div className="grid w-full gap-8 lg:grid-cols-[60%_1fr] lg:items-center lg:gap-12">
              {/* Maillot — occupe 55% sur desktop */}
              <JerseyViewer />
              {/* Infos produit */}
              <ProductPanel />
            </div>
          </div>

          {/* Feature bar inside hero section at the bottom */}
          <FeatureBar />
        </section>

        {/* Galerie */}
        <section id="galerie" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <SectionHeading kicker="Le shooting" title="Galerie" />
          <Gallery />
        </section>

        {/* Avis clients */}
        <section id="avis" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <SectionHeading kicker="Retours d'expérience" title="Avis Clients" />
          <ReviewsSection />
        </section>
      </main>

      <Footer />
    </>
  );
}

function SectionHeading({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="mb-8">
      <p className="text-xs uppercase tracking-[0.25em] text-red-bright">
        {kicker}
      </p>
      <h2 className="headline mt-1 text-4xl sm:text-5xl">{title}</h2>
    </div>
  );
}
