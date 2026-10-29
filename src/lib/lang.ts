import "server-only";
import { cookies, headers } from "next/headers";

// ภาษาของหน้าเว็บ เก็บใน cookie ที่ปุ่มสลับภาษาตั้งไว้ (ค่าเริ่มต้นเป็นไทย)
// header x-j27-lang ใช้ตอน service worker ดาวน์โหลดหน้าทั้งสองภาษาเก็บไว้ใช้ออฟไลน์
export type Lang = "th" | "ja";
export const LANG_COOKIE = "j27_lang";
export const LANG_HEADER = "x-j27-lang";

export async function getLang(): Promise<Lang> {
  const h = (await headers()).get(LANG_HEADER);
  if (h === "th" || h === "ja") return h;
  return (await cookies()).get(LANG_COOKIE)?.value === "ja" ? "ja" : "th";
}
