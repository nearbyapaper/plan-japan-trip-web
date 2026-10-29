import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_NAME, isConfigured, isValidToken } from "@/lib/auth";

// ด่านแรก: ทุกหน้า (ยกเว้นหน้า login และไฟล์ static) ต้องมี cookie ที่ถูกต้อง
export async function middleware(req: NextRequest) {
  if (!isConfigured()) {
    return new NextResponse("ยังไม่ได้ตั้งค่า SITE_PASSWORD และ AUTH_SECRET", { status: 500 });
  }

  const ok = await isValidToken(req.cookies.get(COOKIE_NAME)?.value);
  if (!ok) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    const next = req.nextUrl.pathname + req.nextUrl.search;
    if (next !== "/") url.searchParams.set("next", next);
    return NextResponse.redirect(url);
  }

  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  res.headers.set("Cache-Control", "private, no-store");
  return res;
}

export const config = {
  // sw.js, manifest และไอคอน ไม่มีข้อมูลแผน และเบราว์เซอร์โหลด manifest โดยไม่ส่ง cookie
  matcher: ["/((?!login|_next/static|_next/image|favicon.ico|robots.txt|sw.js|manifest.webmanifest|icons/).*)"],
};
