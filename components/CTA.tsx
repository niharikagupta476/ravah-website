import Link from "next/link";
import { TrackedLink } from "./TrackedLink";
import type { AnalyticsEvent } from "@/lib/analytics";

interface CTAProps {
  title: string;
  description: string;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
  primaryEvent?: AnalyticsEvent;
  secondaryEvent?: AnalyticsEvent;
}

export function CTA({
  title,
  description,
  primary,
  secondary,
  primaryEvent,
  secondaryEvent,
}: CTAProps) {
  return (
    <div className="cta">
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <div className="cta-actions">
        {primaryEvent ? (
          <TrackedLink className="button button-primary" href={primary.href} event={primaryEvent}>
            {primary.label}
          </TrackedLink>
        ) : (
          <Link className="button button-primary" href={primary.href}>
            {primary.label}
          </Link>
        )}
        {secondary && (
          <>
            {secondaryEvent ? (
              <TrackedLink className="button button-ghost" href={secondary.href} event={secondaryEvent}>
                {secondary.label}
              </TrackedLink>
            ) : (
              <Link className="button button-ghost" href={secondary.href}>
                {secondary.label}
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
}
