export type AnalyticsEvent =
  | "cta_demo_click"
  | "cta_docs_click"
  | "pricing_view"
  | "form_submit_demo"
  | "newsletter_subscribe"
  | "score_started"
  | "score_completed"
  | "score_cta_click";

export function trackEvent(
  event: AnalyticsEvent,
  payload?: Record<string, string>,
) {
  if (typeof window === "undefined") {
    return;
  }

  if (typeof window.gtag === "function") {
    window.gtag("event", event, payload);
  }

  if (window.posthog?.capture) {
    window.posthog.capture(event, payload);
  }

  if (typeof window.plausible === "function") {
    window.plausible(event, { props: payload });
  }
}

export function trackPageView(path: string) {
  if (typeof window === "undefined") {
    return;
  }

  if (typeof window.gtag === "function") {
    window.gtag("event", "page_view", {
      page_location: `${window.location.origin}${path}`,
      page_path: path,
    });
  }

  if (window.posthog?.capture) {
    window.posthog.capture("page_view", { path });
  }

  if (typeof window.plausible === "function") {
    window.plausible("pageview", { props: { path } });
  }
}

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string> }) => void;
    gtag?: (...args: any[]) => void;
    posthog?: {
      capture?: (event: string, payload?: Record<string, string>) => void;
    };
  }
}
