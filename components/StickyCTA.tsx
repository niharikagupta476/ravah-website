"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface StickyCTAProps {
  label?: string;
}

export function StickyCTA({ label = "Request Demo" }: StickyCTAProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 320);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div className="sticky-cta" role="region" aria-label="Sticky demo call to action">
      <span>Ready to reduce MTTR and alert noise?</span>
      <Link href="/contact" className="button button-primary">
        {label}
      </Link>
    </div>
  );
}
