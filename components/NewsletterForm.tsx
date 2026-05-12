"use client";

import { FormEvent } from "react";
import { trackEvent } from "@/lib/analytics";

export function NewsletterForm() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    trackEvent("newsletter_subscribe");
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="newsletter-email">Work email</label>
        <input
          id="newsletter-email"
          name="newsletter-email"
          type="email"
          placeholder="you@company.com"
          required
        />
      </div>
      <button className="button button-ghost" type="submit">
        Join the waitlist
      </button>
    </form>
  );
}
