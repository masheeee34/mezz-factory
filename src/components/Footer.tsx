export default function Footer() {
  return (
    <footer id="contact" className="border-t border-line/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="display text-3xl">MEZZ&apos;</p>
          <p className="mt-1 text-sm text-muted">
            GOUSSDAR — La référence du maillot personnalisé.
          </p>
        </div>

        <div className="text-sm">
          <p className="mb-2 text-xs uppercase tracking-widest text-muted">
            Contact
          </p>
          <a
            href="mailto:Mezzshop951@gmail.com"
            className="block text-text transition hover:text-red-bright"
          >
            Mezzshop951@gmail.com
          </a>
          <a
            href="tel:+33602523323"
            className="block text-text transition hover:text-red-bright"
          >
            06 02 52 33 23
          </a>
        </div>
      </div>

      <div className="border-t border-line/40 py-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} Mezzshop · Tous droits réservés.
      </div>
    </footer>
  );
}
