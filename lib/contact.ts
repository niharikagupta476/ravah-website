export type ContactSource = "request_demo" | "contact" | "get_started";

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  company?: string;
  role?: string;
  source: ContactSource;
  createdAt: string;
}

export interface ContactRequestPayload {
  name?: string;
  email?: string;
  message?: string;
  company?: string;
  role?: string;
  pain?: string;
  source?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseContactPayload(payload: ContactRequestPayload) {
  const name = (payload.name || "").trim();
  const email = (payload.email || "").trim().toLowerCase();
  const message = (payload.message || payload.pain || "").trim();
  const company = (payload.company || "").trim();
  const role = (payload.role || "").trim();

  if (!name || name.length < 2) {
    return { ok: false as const, error: "Please provide your full name." };
  }

  if (!email || !EMAIL_REGEX.test(email)) {
    return { ok: false as const, error: "Please provide a valid work email." };
  }

  if (!message || message.length < 8) {
    return { ok: false as const, error: "Please include more details in your message." };
  }

  const source = normalizeContactSource(payload.source);

  return {
    ok: true as const,
    value: {
      name,
      email,
      message,
      company: company || undefined,
      role: role || undefined,
      source,
    },
  };
}

export function normalizeContactSource(source?: string): ContactSource {
  if (source === "contact" || source === "get_started") {
    return source;
  }

  return "request_demo";
}

const submissions: ContactSubmission[] = [];

export function saveContactSubmission(
  submission: Omit<ContactSubmission, "id" | "createdAt">,
): ContactSubmission {
  const saved: ContactSubmission = {
    ...submission,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  submissions.unshift(saved);
  submissions.splice(100);

  return saved;
}

export function getRecentContactSubmissions() {
  return submissions;
}
