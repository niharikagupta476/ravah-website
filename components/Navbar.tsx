import Image from "next/image";
import Link from "next/link";
import { navLinks } from "@/lib/site";

export function Navbar() {
  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link href="/" className="logo" aria-label="Ravah.ai home">
          <Image
            src="/assets/logo/ravah-logo-v3.png"
            alt="Ravah logo"
            width={1280}
            height={1280}
            className="brand-mark"
            priority
          />
          <span className="wordmark">Ravah.ai</span>
        </Link>
        <nav aria-label="Primary" className="nav-links">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="nav-cta">
          <Link className="button button-primary" href="/score">
            Try Ravah Score
          </Link>
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
