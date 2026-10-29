import type { MetadataRoute } from "next";

// ทำให้ติดตั้งเว็บเป็นแอปบนหน้าจอโทรศัพท์ได้ (Add to Home Screen)
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Japan 2027 แผนเที่ยว",
    short_name: "Japan 2027",
    description: "แผนเที่ยวส่วนตัว เปิดดูได้แม้ไม่มีอินเทอร์เน็ต",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f6f4ef",
    theme_color: "#c2410c",
    lang: "th",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
