import Link from "next/link";

const links = [
  { href: "/product", label: "Product" },
  { href: "/docs", label: "Docs" },
  { href: "/pricing", label: "Pricing" },
  { href: "/ravah-score", label: "Ravah Score" },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-white/10 py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-4 px-6 text-sm text-slate-400 sm:flex-row sm:items-center">
        <p>© {new Date().getFullYear()} Ravah</p>
        <nav className="flex flex-wrap items-center gap-4" aria-label="Footer links">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-slate-200">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
