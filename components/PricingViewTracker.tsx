"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export function PricingViewTracker() {
  useEffect(() => {
    trackEvent("pricing_view");
  }, []);

  return null;
}
