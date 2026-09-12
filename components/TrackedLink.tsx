"use client";

import Link, { LinkProps } from "next/link";
import { ReactNode } from "react";
import { AnalyticsEvent, trackEvent } from "@/lib/analytics";

interface TrackedLinkProps extends LinkProps {
  children: ReactNode;
  className?: string;
  event: AnalyticsEvent;
  payload?: Record<string, string>;
}

export function TrackedLink({
  children,
  className,
  event,
  payload,
  ...props
}: TrackedLinkProps) {
  return (
    <Link
      {...props}
      className={className}
      onClick={() => trackEvent(event, payload)}
    >
      {children}
    </Link>
  );
}
