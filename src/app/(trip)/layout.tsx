import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_NAME, isValidToken } from "@/lib/auth";
import { days } from "@/lib/plan";
import { logout } from "../login/actions";

// ด่านที่สอง: เช็ก cookie ซ้ำฝั่ง server ก่อนแสดงข้อมูล เผื่อ middleware ถูกข้าม
export default async function TripLayout({ children }: { children: React.ReactNode }) {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!(await isValidToken(token))) redirect("/login");

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-10 border-b border-line bg-bg/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <Link href="/" className="font-bold">
            🗾 Japan 2027
          </Link>
          <nav className="-mx-1 flex flex-1 gap-1 overflow-x-auto px-1 text-sm">
            {days.map((d) => (
              <Link
                key={d.slug}
                href={`/day/${d.slug}`}
                className="shrink-0 rounded-full px-2.5 py-1 text-ink-2 hover:bg-accent/10 hover:text-accent"
              >
                {d.slug}
              </Link>
            ))}
          </nav>
          <form action={logout}>
            <button className="shrink-0 rounded-full border border-line px-3 py-1 text-xs text-ink-2 hover:text-ink">
              ออก
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-6">{children}</main>
    </div>
  );
}
