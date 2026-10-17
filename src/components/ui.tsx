import type { ReactNode } from "react";

export const accentClass: Record<string, string> = {
  slate: "bg-slate-500",
  sky: "bg-sky-500",
  violet: "bg-violet-500",
  rose: "bg-rose-500",
  amber: "bg-amber-500",
  emerald: "bg-emerald-500",
};

export const yen = (n: number) => `¥${n.toLocaleString("en-US")}`;
export const baht = (n: number) => `฿${n.toLocaleString("en-US")}`;

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-line bg-surface p-5 ${className}`}>{children}</section>;
}

export function SectionTitle({ icon, children }: { icon: string; children: ReactNode }) {
  return (
    <h2 className="mb-3 flex items-center gap-2 text-base font-bold">
      <span aria-hidden>{icon}</span>
      {children}
    </h2>
  );
}

export function Collapsible({ icon, title, children }: { icon: string; title: string; children: ReactNode }) {
  return (
    <details className="rounded-2xl border border-line bg-surface">
      <summary className="flex items-center gap-2 p-5 text-base font-bold">
        <span aria-hidden>{icon}</span>
        <span className="flex-1">{title}</span>
        <span className="chev text-ink-2 transition">›</span>
      </summary>
      <div className="px-5 pb-5">{children}</div>
    </details>
  );
}

export function Pill({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "warn" | "ok" }) {
  const tones = {
    neutral: "bg-ink/5 text-ink-2",
    warn: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
    ok: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  };
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}
