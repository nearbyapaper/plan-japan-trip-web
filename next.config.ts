import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ให้เบราว์เซอร์เช็ก service worker ใหม่ทุกครั้ง ไม่ค้างเวอร์ชันเก่า
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
    ];
  },
};

export default nextConfig;
