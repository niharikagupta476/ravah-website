"use client";

import { FormEvent, useState } from "react";
import { trackEvent } from "@/lib/analytics";

interface DemoFormProps {
  compact?: boolean;
  source?: "request_demo" | "contact" | "get_started";
}

export function DemoForm({
  compact = false,
  source = "request_demo",
}: DemoFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      company: String(formData.get("company") || ""),
      role: String(formData.get("role") || ""),
      pain: String(formData.get("pain") || ""),
      source,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { success: boolean; error?: string };

      if (!response.ok || !data.success) {
        setStatus("error");
        setErrorMessage(data.error || "Unable to submit form. Please try again.");
        return;
      }

      setStatus("success");
      form.reset();
      trackEvent("form_submit_demo", { source });
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please try again in a moment.");
    }
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
      <button className="button button-primary" type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Submitting..." : "Request Demo"}
      </button>
      {status === "success" && (
        <p className="hero-note" role="status">
          Thanks! We received your request and will follow up shortly.
        </p>
      )}
      {status === "error" && (
        <p className="hero-note" role="alert">
          {errorMessage}
        </p>
      )}
      <p className="hero-note">
        By submitting, you agree to be contacted about Ravah.ai.
      </p>
    </form>
  );
}
