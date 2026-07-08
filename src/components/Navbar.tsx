"use client";

import { useEffect, useState } from "react";
import { useConfigurator } from "@/lib/store";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "#accueil", label: "ACCUEIL" },
  { href: "#avis", label: "AVIS" },
  { href: "#contact", label: "CONTACT" },
];

export default function Navbar() {
  const cartCount = useConfigurator((s) => s.cartCount);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const getHref = (hash: string) => (isHome ? hash : `/${hash}`);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 border-b ${
        scrolled || mobileMenuOpen
          ? "border-red-bright/80 bg-bg/90 backdrop-blur-md"
          : "border-red-bright/40 bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href={isHome ? "#accueil" : "/"} className="block" onClick={() => setMobileMenuOpen(false)}>
          <img
            src="/new-logo.png"
            alt="Mezz'"
            style={{
              height: "76px",
              width: "auto",
              display: "block",
              mixBlendMode: "lighten",
            }}
          />
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={getHref(l.href)}
                className="text-sm font-medium uppercase tracking-wide text-text transition-colors hover:text-red-bright"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4" suppressHydrationWarning>
          <a
            href="/commande"
            aria-label="Panier"
            className="relative text-text hover:text-red-bright transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            <CartIcon />
            <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-red-bright px-1 text-[10px] font-bold text-white">
              {cartCount}
            </span>
          </a>

          {/* Hamburger Menu Toggle for Mobile */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-text hover:text-red-bright md:hidden focus:outline-none p-1 transition-colors"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-[72px] h-[calc(100dvh-72px)] z-40 bg-black md:hidden border-t border-red-bright/20 flex flex-col justify-between py-12 px-6 animate-fadeIn">
          <ul className="flex flex-col gap-6 text-center pt-8">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={getHref(l.href)}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xl font-bold uppercase tracking-widest text-text hover:text-red-bright block py-2.5 transition"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="border-t border-line/35 pt-6 text-center space-y-4">
            <p className="text-[10px] text-text uppercase tracking-[0.2em]">Mezz Factory — Streetwear</p>
          </div>
        </div>
      )}
    </header>
  );
}


function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M3 4h2l2.4 12.3a1 1 0 0 0 1 .7h8.7a1 1 0 0 0 1-.8L21 8H6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9.5" cy="20" r="1.4" />
      <circle cx="17.5" cy="20" r="1.4" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
