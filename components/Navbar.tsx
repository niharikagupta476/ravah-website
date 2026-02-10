import Link from "next/link";
import { navLinks } from "@/lib/site";

export function Navbar() {
  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link href="/" className="logo" aria-label="Ravah.ai home">
          Ravah.ai
        </Link>
        <nav aria-label="Primary" className="nav-links">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="nav-cta">
          <Link className="button button-ghost" href="/docs">
            View Docs
          </Link>
          <Link className="button button-primary" href="/contact">
            Request Demo
          </Link>
        </div>
      </div>
    </header>
  );
}
