// สร้างลิงก์ Google Maps แบบเดียวกับแท็บ คู่มือเดินทาง คอลัมน์ Google Maps
// https://developers.google.com/maps/documentation/urls/get-started

export type TravelMode = "transit" | "walking" | "driving";

export type RouteLeg = {
  time?: string; // เวลาออกตามแผน เช่น "08:33"
  from?: string; // ไม่ใส่ = เริ่มจากตำแหน่งปัจจุบันของมือถือ
  to: string;
  mode: TravelMode;
  via?: string; // จุดผ่าน (ใช้ได้กับการเดินและขับรถ ใช้กับ transit ไม่ได้)
  note?: string;
};

export function dirUrl(leg: RouteLeg): string {
  const p = new URLSearchParams({ api: "1" });
  if (leg.from) p.set("origin", leg.from);
  p.set("destination", leg.to);
  p.set("travelmode", leg.mode);
  if (leg.via && leg.mode !== "transit") p.set("waypoints", leg.via);
  return `https://www.google.com/maps/dir/?${p.toString()}`;
}

export const placeUrl = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
