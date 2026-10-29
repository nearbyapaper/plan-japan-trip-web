import type { Metadata, Viewport } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import { getLang } from "@/lib/lang";

const thai = Noto_Sans_Thai({
  variable: "--font-thai",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Japan 2027",
  description: "แผนเที่ยวส่วนตัว",
  robots: { index: false, follow: false },
  appleWebApp: { capable: true, title: "Japan 2027", statusBarStyle: "default" },
  icons: { apple: "/icons/apple-touch-icon.png" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f4ef" },
    { media: "(prefers-color-scheme: dark)", color: "#14130f" },
  ],
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // service worker อ่านค่า lang นี้เพื่อแยกเก็บหน้าไทย / ญี่ปุ่น
  return (
    <html lang={await getLang()}>
      <body className={`${thai.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
