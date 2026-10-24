import "server-only";
import { cookies } from "next/headers";

// ภาษาของหน้าเว็บ เก็บใน cookie ที่ปุ่มสลับภาษาตั้งไว้ (ค่าเริ่มต้นเป็นไทย)
export type Lang = "th" | "ja";
export const LANG_COOKIE = "j27_lang";

export async function getLang(): Promise<Lang> {
  return (await cookies()).get(LANG_COOKIE)?.value === "ja" ? "ja" : "th";
}
