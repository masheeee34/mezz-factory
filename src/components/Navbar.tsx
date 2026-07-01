"use client";

import { useEffect, useState } from "react";
import { useConfigurator } from "@/lib/store";

const LINKS = [
  { href: "#accueil", label: "ACCUEIL" },
  { href: "#galerie", label: "COLLECTION" },
  { href: "#commander", label: "À PROPOS" },
  { href: "#contact", label: "CONTACT" },
];

export default function Navbar() {
  const cartCount = useConfigurator((s) => s.cartCount);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 border-b ${
        scrolled
          ? "border-red-bright/80 bg-bg/90 backdrop-blur-md"
          : "border-red-bright/40 bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#accueil" className="block" style={{ marginTop: "-14px", marginBottom: "-14px" }}>
          <img
            src="/new-logo.png"
            alt="Mezz'"
            style={{
              height: "110px",
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
                href={l.href}
                className="text-sm font-medium uppercase tracking-wide text-muted transition-colors hover:text-text"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <a href="#commander" aria-label="Mon compte" className="text-muted hover:text-text">
            <UserIcon />
          </a>
          <a
            href="#commander"
            aria-label="Panier"
            className="relative text-muted hover:text-text"
          >
            <CartIcon />
            <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-red-bright px-1 text-[10px] font-bold text-white">
              {cartCount}
            </span>
          </a>
        </div>
      </nav>
    </header>
  );
}

function UserIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" />
    </svg>
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
