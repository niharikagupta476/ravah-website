"use client";

import { FormEvent } from "react";
import { trackEvent } from "@/lib/analytics";

interface DemoFormProps {
  compact?: boolean;
}

export function DemoForm({ compact = false }: DemoFormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    trackEvent("form_submit_demo");
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div>
          <label htmlFor="name">Name</label>
          <input id="name" name="name" type="text" required />
        </div>
        <div>
          <label htmlFor="email">Work email</label>
          <input id="email" name="email" type="email" required />
        </div>
      </div>
      {!compact && (
        <div className="form-row">
          <div>
            <label htmlFor="company">Company</label>
            <input id="company" name="company" type="text" required />
          </div>
          <div>
            <label htmlFor="role">Role</label>
            <input id="role" name="role" type="text" required />
          </div>
        </div>
      )}
      <div>
        <label htmlFor="pain">What are you trying to improve?</label>
        <textarea id="pain" name="pain" rows={compact ? 3 : 4} required />
      </div>
      <button className="button button-primary" type="submit">
        Request Demo
      </button>
      <p className="hero-note">
        By submitting, you agree to be contacted about Ravah.ai.
      </p>
    </form>
  );
}
