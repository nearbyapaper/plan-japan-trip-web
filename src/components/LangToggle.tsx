"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { postToSW } from "./OfflineSupport";

// ปุ่มสลับ ไทย / 日本語 ตั้ง cookie แล้วให้ server วาดหน้าใหม่
export default function LangToggle({ lang }: { lang: "th" | "ja" }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  const set = (l: "th" | "ja") => {
    if (l === lang) return;
    document.cookie = `j27_lang=${l}; path=/; max-age=31536000; samesite=lax`;
    postToSW({ type: "lang", lang: l });
    // ออฟไลน์: โหลดหน้าใหม่ ให้ service worker ส่งฉบับภาษานั้นที่เก็บไว้ในเครื่อง
    if (!navigator.onLine) {
      setTimeout(() => location.reload(), 150);
      return;
    }
    start(() => router.refresh());
  };

  const btn = (l: "th" | "ja", label: string) => (
    <button
      type="button"
      onClick={() => set(l)}
      aria-pressed={lang === l}
      className={`rounded-full px-2.5 py-1 ${lang === l ? "bg-accent text-white" : "text-ink-2 hover:text-ink"}`}
    >
      {label}
    </button>
  );

  return (
    <div className={`flex shrink-0 rounded-full border border-line p-0.5 text-xs ${pending ? "opacity-60" : ""}`}>
      {btn("th", "ไทย")}
      {btn("ja", "日本語")}
    </div>
  );
}
