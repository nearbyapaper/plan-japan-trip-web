"use client";

import { useCallback, useEffect, useState } from "react";

// บันทึกทุกหน้าของแผนไว้ในเครื่อง (ผ่าน public/sw.js) ให้เปิดดูได้ตอนไม่มีอินเทอร์เน็ต
// ทำงานเฉพาะตอน build จริง (npm run build / Vercel) ไม่ทำงานตอน npm run dev

const STATUS_KEY = "j27:offline";
const RESYNC_MS = 15 * 60 * 1000; // ออนไลน์อยู่ จะอัปเดตฉบับในเครื่องทุก 15 นาทีที่เปิดเว็บ

type Status = { at: number; saved: number; failed: number };
type SyncReply = { saved: number; failed: number; needLogin: boolean };

const swEnabled = () => process.env.NODE_ENV === "production" && "serviceWorker" in navigator;

function readStatus(): Status | null {
  try {
    const raw = localStorage.getItem(STATUS_KEY);
    return raw ? (JSON.parse(raw) as Status) : null;
  } catch {
    return null;
  }
}

function writeStatus(s: Status | null) {
  try {
    if (s) localStorage.setItem(STATUS_KEY, JSON.stringify(s));
    else localStorage.removeItem(STATUS_KEY);
  } catch {}
}

export async function postToSW<T>(msg: unknown): Promise<T | null> {
  if (!swEnabled()) return null;
  const reg = await navigator.serviceWorker.ready;
  const sw = reg.active;
  if (!sw) return null;
  return new Promise((resolve) => {
    const ch = new MessageChannel();
    ch.port1.onmessage = (e) => resolve(e.data as T);
    sw.postMessage(msg, [ch.port2]);
  });
}

function useOnline() {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);
  return online;
}

const fmt = (at: number, lang: "th" | "ja") =>
  new Date(at).toLocaleString(lang === "ja" ? "ja-JP" : "th-TH", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

// แถบด้านบนตอนออฟไลน์
export function OfflineBanner({ lang }: { lang: "th" | "ja" }) {
  const online = useOnline();
  const [status, setStatus] = useState<Status | null>(null);
  useEffect(() => setStatus(readStatus()), [online]);
  if (online) return null;
  return (
    <div className="no-print border-t border-amber-500/30 bg-amber-500/15 px-4 py-1.5 text-center text-xs">
      {lang === "ja" ? "📴 オフライン · 保存済みの内容を表示中" : "📴 ออฟไลน์อยู่ · แสดงข้อมูลที่บันทึกไว้ในเครื่อง"}
      {status && ` (${lang === "ja" ? "更新" : "อัปเดต"} ${fmt(status.at, lang)})`}
    </div>
  );
}

// ลงทะเบียน service worker, สั่งบันทึกทุกหน้า และแสดงสถานะท้ายหน้า
export default function OfflineSupport({ paths, lang }: { paths: string[]; lang: "th" | "ja" }) {
  const online = useOnline();
  const [status, setStatus] = useState<Status | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [supported, setSupported] = useState(false);
  const pathsKey = paths.join("|");

  const sync = useCallback(async () => {
    setSyncing(true);
    try {
      const r = await postToSW<SyncReply>({ type: "sync", paths: pathsKey.split("|") });
      if (r && !r.needLogin) {
        const s = { at: Date.now(), saved: r.saved, failed: r.failed };
        writeStatus(s);
        setStatus(s);
        // โหลดโค้ดแผนที่ไว้ล่วงหน้า ให้ service worker เก็บไว้ด้วย
        import("leaflet").catch(() => {});
      }
    } finally {
      setSyncing(false);
    }
  }, [pathsKey]);

  useEffect(() => {
    if (!swEnabled()) return;
    setSupported(true);
    setStatus(readStatus());
    navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!swEnabled()) return;
    postToSW({ type: "lang", lang });
  }, [lang]);

  useEffect(() => {
    if (!swEnabled() || !online) return;
    const s = readStatus();
    if (!s || s.failed > 0 || Date.now() - s.at > RESYNC_MS) sync();
  }, [online, sync]);

  if (!supported) return null;

  const ja = lang === "ja";
  let text: string;
  if (syncing) text = ja ? "オフライン用に保存中…" : "กำลังบันทึกไว้ใช้ตอนออฟไลน์…";
  else if (!status) text = ja ? "まだオフライン用に保存されていません" : "ยังไม่ได้บันทึกไว้ใช้ตอนออฟไลน์";
  else if (status.failed > 0)
    text = ja
      ? `一部のみ保存 (${status.saved} ページ) · ${fmt(status.at, lang)}`
      : `บันทึกได้บางส่วน (${status.saved} หน้า) · ${fmt(status.at, lang)}`;
  else
    text = ja
      ? `✓ オフラインでも閲覧可 · 更新 ${fmt(status.at, lang)}`
      : `✓ เปิดดูได้แม้ไม่มีเน็ต · อัปเดต ${fmt(status.at, lang)}`;

  return (
    <div className="no-print mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 pb-6 text-xs text-ink-2">
      <span>{text}</span>
      {online && !syncing && (
        <button
          type="button"
          onClick={sync}
          className="rounded-full border border-line px-3 py-1 hover:border-accent hover:text-accent"
        >
          {ja ? "今すぐ更新" : "อัปเดตตอนนี้"}
        </button>
      )}
    </div>
  );
}

// เรียกในหน้า login: ไม่ได้ login อยู่ = ลบข้อมูลแผนที่เก็บไว้ในเครื่องทิ้ง
export function ClearOfflineData() {
  useEffect(() => {
    if (!swEnabled() || !navigator.onLine) return;
    writeStatus(null);
    if (navigator.serviceWorker.controller) postToSW({ type: "clear" });
  }, []);
  return null;
}
