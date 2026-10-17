// ใช้ได้ทั้งใน middleware (Edge) และฝั่ง server (Node) เพราะใช้ Web Crypto

export const COOKIE_NAME = "j27_session";
export const MAX_AGE = 60 * 60 * 24 * 30; // 30 วัน

const encoder = new TextEncoder();

function toBase64Url(buf: ArrayBuffer) {
  let s = "";
  for (const b of new Uint8Array(buf)) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function isConfigured() {
  return Boolean(process.env.SITE_PASSWORD && process.env.AUTH_SECRET);
}

// ค่า cookie ที่ถูกต้อง = HMAC(AUTH_SECRET, รหัสผ่าน)
// เปลี่ยนรหัสผ่านหรือ AUTH_SECRET แล้วทุกคนจะต้อง login ใหม่
export async function expectedToken(): Promise<string | null> {
  const secret = process.env.AUTH_SECRET;
  const password = process.env.SITE_PASSWORD;
  if (!secret || !password) return null;
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(`j27:${password}`));
  return toBase64Url(sig);
}

// เทียบสตริงโดยใช้เวลาเท่ากันทุกกรณี กันการเดารหัสจากเวลาตอบกลับ
export function safeEqual(a: string, b: string) {
  const ab = encoder.encode(a);
  const bb = encoder.encode(b);
  let diff = ab.length ^ bb.length;
  for (let i = 0; i < Math.max(ab.length, bb.length); i++) {
    diff |= (ab[i] ?? 0) ^ (bb[i] ?? 0);
  }
  return diff === 0;
}

export async function isValidToken(token: string | undefined) {
  if (!token) return false;
  const expected = await expectedToken();
  return expected !== null && safeEqual(token, expected);
}

// กันการ redirect ออกไปเว็บอื่นหลัง login
export function safeNext(next: unknown) {
  if (typeof next !== "string" || !next.startsWith("/") || next.startsWith("//")) return "/";
  return next;
}
