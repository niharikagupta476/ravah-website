import { ReactNode } from "react";

interface LandingSectionProps {
  id?: string;
  title?: string;
  subtitle?: string;
  children: ReactNode;
}

export function LandingSection({ id, title, subtitle, children }: LandingSectionProps) {
  return (
    <section id={id} className="py-20 sm:py-24">
      <div className="mx-auto w-full max-w-6xl px-6">
        {(title || subtitle) && (
          <div className="mb-10 max-w-3xl space-y-3">
            {title && (
              <h2 className="text-3xl font-semibold tracking-tight text-slate-100 sm:text-4xl">
                {title}
              </h2>
            )}
            {subtitle && <p className="text-lg text-slate-300">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
