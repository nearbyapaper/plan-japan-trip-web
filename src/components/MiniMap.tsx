"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, Marker } from "leaflet";
import "leaflet/dist/leaflet.css";
import type { DayMap, LegMode, MapPin, PinKind } from "@/lib/minimap";

// สีหมุดตามประเภท และสีเส้นตามวิธีเดินทาง
const kindStyle: Record<PinKind, { bg: string; label: string }> = {
  station: { bg: "#64748b", label: "สถานี / จุดเปลี่ยนรถ" },
  spot: { bg: "#c2410c", label: "ที่เที่ยว" },
  food: { bg: "#d97706", label: "ของกิน / ร้าน" },
  hotel: { bg: "#7c3aed", label: "ที่พัก" },
};
const legStyle: Record<LegMode, { color: string; dash?: string; label: string }> = {
  transit: { color: "#2563eb", label: "รถไฟ" },
  bus: { color: "#0d9488", label: "รถบัส" },
  walking: { color: "#78716c", dash: "2 7", label: "เดิน" },
  bike: { color: "#16a34a", dash: "10 6", label: "จักรยาน" },
  ropeway: { color: "#9333ea", label: "กระเช้า" },
  taxi: { color: "#ca8a04", dash: "6 4", label: "แท็กซี่" },
};

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function popupHtml(p: MapPin) {
  const imgs = p.photos.length
    ? `<div class="mm-photos">${p.photos
        .map(
          (ph) =>
            `<a href="${esc(ph.page)}" target="_blank" rel="noreferrer" title="${esc(ph.credit)}"><img src="${esc(ph.src)}" alt="${esc(p.name)}" loading="lazy" /></a>`,
        )
        .join("")}</div><p class="mm-credit">รูปจาก Wikimedia Commons แตะรูปเพื่อดูเจ้าของและสัญญาอนุญาต</p>`
    : "";
  return `<div class="mm-pop">
    <p class="mm-title"><span class="mm-n" style="background:${kindStyle[p.kind].bg}">${p.n}</span>${esc(p.name)}</p>
    ${imgs}
    ${p.desc ? `<p class="mm-desc">${esc(p.desc)}</p>` : ""}
    <a class="mm-gmaps" href="${esc(p.mapsUrl)}" target="_blank" rel="noreferrer">เปิดใน Google Maps ↗</a>
  </div>`;
}

function OneMap({ data }: { data: DayMap }) {
  const el = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markers = useRef<Marker[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !el.current || mapRef.current) return;
      const map = L.map(el.current, { scrollWheelZoom: false, zoomSnap: 0.25 });
      mapRef.current = map;
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      for (const leg of data.legs) {
        const a = data.pins[leg.from];
        const b = data.pins[leg.to];
        const s = legStyle[leg.mode];
        L.polyline(
          [
            [a.lat, a.lng],
            [b.lat, b.lng],
          ],
          { color: s.color, weight: 4, opacity: 0.85, dashArray: s.dash, lineCap: "round" },
        ).addTo(map);
      }

      markers.current = data.pins.map((p) =>
        L.marker([p.lat, p.lng], {
          title: p.name,
          icon: L.divIcon({
            className: "mm-pin",
            html: `<span style="background:${kindStyle[p.kind].bg}">${p.n}</span>`,
            iconSize: [26, 26],
            iconAnchor: [13, 13],
            popupAnchor: [0, -12],
          }),
        })
          .bindPopup(popupHtml(p), { maxWidth: 280, minWidth: 240, maxHeight: 320, autoPanPadding: [16, 16] })
          .addTo(map),
      );

      map.fitBounds(L.latLngBounds(data.pins.map((p) => [p.lat, p.lng])), { padding: [28, 28], maxZoom: 16 });
      setReady(true);
    })();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [data]);

  const focus = (i: number) => {
    const m = markers.current[i];
    if (!m || !mapRef.current) return;
    mapRef.current.setView(m.getLatLng(), Math.max(mapRef.current.getZoom(), 14));
    m.openPopup();
  };

  const modes = [...new Set(data.legs.map((l) => l.mode))];

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-[15px] font-semibold">{data.title}</h3>
      </div>
      {data.note && <p className="text-xs text-ink-2">{data.note}</p>}
      <div
        ref={el}
        className="mm-map h-[380px] w-full overflow-hidden rounded-xl border border-line bg-line sm:h-[440px]"
        aria-label={`แผนที่ ${data.title}`}
      >
        {!ready && <p className="p-4 text-sm text-ink-2">กำลังโหลดแผนที่…</p>}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink-2">
        {modes.map((m) => (
          <span key={m} className="inline-flex items-center gap-1.5">
            <svg width="22" height="6" aria-hidden>
              <line x1="1" y1="3" x2="21" y2="3" stroke={legStyle[m].color} strokeWidth="3" strokeDasharray={legStyle[m].dash} strokeLinecap="round" />
            </svg>
            {legStyle[m].label}
          </span>
        ))}
      </div>
      <ol className="flex flex-wrap gap-1.5">
        {data.pins.map((p, i) => (
          <li key={p.n}>
            <button
              type="button"
              onClick={() => focus(i)}
              className="inline-flex items-center gap-1.5 rounded-full border border-line py-1 pl-1 pr-2.5 text-xs hover:border-accent hover:text-accent"
            >
              <span
                className="inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold text-white"
                style={{ background: kindStyle[p.kind].bg }}
              >
                {p.n}
              </span>
              {p.name}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function MiniMap({ maps }: { maps: DayMap[] }) {
  return (
    <div className="space-y-6">
      {maps.map((m) => (
        <OneMap key={m.title} data={m} />
      ))}
      <p className="text-xs text-ink-2">
        เส้นบนแผนที่เป็นเส้นตรงเชื่อมจุดตามลำดับ ไม่ใช่แนวรางหรือถนนจริง แตะหมุดเพื่อดูรายละเอียด รูป และเปิดใน Google Maps
      </p>
    </div>
  );
}
