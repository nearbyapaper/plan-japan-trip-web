"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_NAME, MAX_AGE, expectedToken, safeEqual, safeNext } from "@/lib/auth";

export type LoginState = { error?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("next"));
  const expectedPassword = process.env.SITE_PASSWORD;
  const token = await expectedToken();

  if (!expectedPassword || !token) {
    return { error: "เว็บยังไม่ได้ตั้งรหัสผ่าน" };
  }

  if (!safeEqual(password, expectedPassword)) {
    // หน่วงเวลาเมื่อรหัสผิด ให้เดารหัสทีละเยอะๆ ได้ช้าลง
    await new Promise((r) => setTimeout(r, 1000));
    return { error: "รหัสผ่านไม่ถูกต้อง" };
  }

  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
  redirect(next);
}

export async function logout() {
  (await cookies()).delete(COOKIE_NAME);
  redirect("/login");
}
