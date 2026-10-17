"use client";

import { useEffect, useState } from "react";

// เช็กลิสต์ติ๊กได้ จำสถานะไว้ในเครื่องที่เปิดดู (ไม่ส่งไปที่อื่น)
export default function Checklist({ id, text }: { id: string; text: string }) {
  const storageKey = `j27:check:${id}`;
  const [done, setDone] = useState<Record<number, boolean>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setDone(JSON.parse(saved));
    } catch {
      /* เปิดแบบส่วนตัวหรือปิด storage ไว้ ก็ยังใช้งานได้ แค่ไม่จำ */
    }
  }, [storageKey]);

  const toggle = (i: number) => {
    setDone((prev) => {
      const next = { ...prev, [i]: !prev[i] };
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  return (
    <div className="space-y-1 text-[15px] leading-relaxed">
      {text.split("\n").map((raw, i) => {
        const line = raw.trim();
        if (!line) return <div key={i} className="h-3" />;
        if (line.startsWith("☐")) {
          const checked = !!done[i];
          return (
            <label key={i} className="flex cursor-pointer gap-3 rounded-lg px-2 py-1.5 hover:bg-accent/5">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(i)}
                className="mt-1 h-4 w-4 shrink-0 accent-[var(--accent)]"
              />
              <span className={checked ? "text-ink-2 line-through" : ""}>{line.slice(1).trim()}</span>
            </label>
          );
        }
        if (line.startsWith("•")) {
          return (
            <div key={i} className="flex gap-2 px-2">
              <span className="text-accent">•</span>
              <span>{line.slice(1).trim()}</span>
            </div>
          );
        }
        return (
          <h4 key={i} className="px-2 pt-1 text-xs font-bold uppercase tracking-wide text-ink-2">
            {line}
          </h4>
        );
      })}
    </div>
  );
}
