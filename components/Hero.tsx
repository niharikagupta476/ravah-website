import Link from "next/link";
import { TrackedLink } from "./TrackedLink";

interface HeroProps {
  title: string;
  subtitle: string;
  primaryCta?: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
  primaryEvent?: "cta_demo_click" | "cta_docs_click";
  secondaryEvent?: "cta_demo_click" | "cta_docs_click";
  note?: string;
}

export function Hero({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  primaryEvent,
  secondaryEvent,
  note,
}: HeroProps) {
  return (
    <div className="hero">
      <div className="hero-content">
        <h1>{title}</h1>
        <p className="hero-subtitle">{subtitle}</p>
        <div className="hero-actions">
          {primaryCta && (
            <>
              {primaryEvent ? (
                <TrackedLink
                  className="button button-primary"
                  href={primaryCta.href}
                  event={primaryEvent}
                >
                  {primaryCta.label}
                </TrackedLink>
              ) : (
                <Link className="button button-primary" href={primaryCta.href}>
                  {primaryCta.label}
                </Link>
              )}
            </>
          )}
          {secondaryCta && (
            <>
              {secondaryEvent ? (
                <TrackedLink
                  className="button button-ghost"
                  href={secondaryCta.href}
                  event={secondaryEvent}
                >
                  {secondaryCta.label}
                </TrackedLink>
              ) : (
                <Link className="button button-ghost" href={secondaryCta.href}>
                  {secondaryCta.label}
                </Link>
              )}
            </>
          )}
        </div>
        {note && <p className="hero-note">{note}</p>}
      </div>
      <div className="hero-card" aria-label="Product overview">
        <div className="hero-card-inner">
          <p className="eyebrow">Live demo flow</p>
          <h3>Incident to resolution in minutes</h3>
          <ul>
            <li>Root cause summaries with evidence links</li>
            <li>Pipeline failure diff + suggested fixes</li>
            <li>On-call briefing with next best actions</li>
          </ul>
          <div className="hero-card-placeholder">Screenshot placeholder</div>
        </div>
      </div>
    </div>
  );
}
