export type AnalyticsEvent =
  | "cta_demo_click"
  | "cta_docs_click"
  | "pricing_view"
  | "form_submit_demo"
  | "newsletter_subscribe";

export function trackEvent(event: AnalyticsEvent, payload?: Record<string, string>) {
  if (typeof window === "undefined") {
    return;
  }

  const provider = process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER;

  if (provider === "plausible" && typeof window.plausible === "function") {
    window.plausible(event, { props: payload });
  }

  if (provider === "posthog" && (window as any).posthog?.capture) {
    (window as any).posthog.capture(event, payload);
  }

  if (provider === "ga4" && typeof window.gtag === "function") {
    window.gtag("event", event, payload);
  }
}

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string> }) => void;
    gtag?: (...args: any[]) => void;
  }
}
