import type { Metadata } from "next";
import { safeNext } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "เข้าสู่ระบบ · Japan 2027" };

// หน้านี้ไม่มีข้อมูลแผนเที่ยวเลย แสดงได้โดยไม่ต้อง login
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <main className="flex min-h-dvh items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-3xl border border-line bg-surface p-8 shadow-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-2xl">
            🗾
          </div>
          <h1 className="text-xl font-bold">แผนเที่ยว Japan-2027</h1>
          <p className="mt-1 text-sm text-ink-2">ใส่รหัสผ่านเพื่อดูแผน</p>
        </div>
        <LoginForm next={safeNext(next)} />
      </div>
    </main>
  );
}
