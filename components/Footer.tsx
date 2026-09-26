import Link from "next/link";
import { footerLinks } from "@/lib/site";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Link href="/" className="logo">
            Ravah.ai
          </Link>
          <p>
            AI DevOps Copilot for CI/CD failures, on-call triage, and faster
            MTTR.
          </p>
          <p className="footer-small">© {new Date().getFullYear()} Ravah.ai</p>
        </div>
        <div className="footer-links">
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4>{title}</h4>
              <ul>
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
