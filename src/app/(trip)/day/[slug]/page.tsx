import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { dayTotal, days, getDay, toThb } from "@/lib/plan";
import TextBlock from "@/components/TextBlock";
import Checklist from "@/components/Checklist";
import { dirUrl, type TravelMode } from "@/lib/maps";
import { Card, Collapsible, Pill, SectionTitle, accentClass, baht, yen } from "@/components/ui";

const modeIcon: Record<TravelMode, string> = { transit: "🚆", walking: "🚶", driving: "🚗" };

// ชื่อที่ใช้ค้นใน Maps บางจุดยาวหรือเป็นภาษาญี่ปุ่น ย่อให้อ่านง่ายบนจอ
const display: Record<string, string> = {
  "ヨリドコロ 稲村ヶ崎": "Cafe Yoridokoro",
  "ファッションセンターしまむら 高田馬場店": "Shimamura Takadanobaba",
  "Hase Station Kanagawa": "Hase Station",
  "Musashi Ichinomiya Hikawa Shrine": "Hikawa Shrine",
  "Saitama Super Arena": "GMO ARENA saitama",
};
const shortName = (q: string) => display[q] ?? q;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const day = getDay((await params).slug);
  return { title: day ? `${day.short} · Japan 2027` : "Japan 2027" };
}

export default async function DayPage({ params }: Props) {
  const day = getDay((await params).slug);
  if (!day) notFound();

  const idx = days.indexOf(day);
  const prev = days[idx - 1];
  const next = days[idx + 1];
  const total = dayTotal(day);

  return (
    <div className="space-y-4">
      <section className="flex items-start gap-4 py-2">
        <span className={`mt-1 h-14 w-1.5 shrink-0 rounded-full ${accentClass[day.accent]}`} />
        <div>
          <p className="text-sm font-medium text-accent">{day.short}</p>
          <h1 className="mt-0.5 text-2xl font-bold">{day.title}</h1>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Pill>🛏 {day.stay}</Pill>
            {day.rainStat !== "-" && <Pill>☂ {day.rainStat} ปี</Pill>}
            {total > 0 && (
              <Pill>
                {yen(total)} ≈ {baht(toThb(total))} ต่อคน
              </Pill>
            )}
          </div>
        </div>
      </section>

      <Card>
        <SectionTitle icon="📍">ภาพรวมวันนี้</SectionTitle>
        <TextBlock text={day.place} />
      </Card>

      <Card>
        <SectionTitle icon="🕘">ไทม์ไลน์</SectionTitle>
        <TextBlock text={day.howto} />
      </Card>

      {day.routes.length > 0 && (
        <Card>
          <SectionTitle icon="🧭">เส้นทางใน Google Maps ทีละช่วง</SectionTitle>
          <div className="divide-y divide-line">
            {day.routes.map((r, i) => (
              <a
                key={i}
                href={dirUrl(r)}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-3 py-2.5 first:pt-0 last:pb-0"
              >
                <span className="w-12 shrink-0 text-sm font-semibold tabular-nums text-ink-2">{r.time ?? ""}</span>
                <span aria-hidden className="shrink-0">
                  {modeIcon[r.mode]}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] group-hover:text-accent">
                    {r.from ? shortName(r.from) : "ตำแหน่งปัจจุบัน"} → {shortName(r.to)}
                  </span>
                  {r.note && <span className="block text-xs text-ink-2">{r.note}</span>}
                </span>
                <span className="shrink-0 rounded-full border border-line px-3 py-1 text-xs group-hover:border-accent group-hover:text-accent">
                  เปิดเส้นทาง ↗
                </span>
              </a>
            ))}
          </div>
          <p className="mt-3 text-xs text-ink-2">
            Google Maps จะแสดงรอบรถของวันที่เปิดดู และอาจแนะนำ Skyliner หรือรถด่วนพิเศษ ให้ยึดสายรถตามไทม์ไลน์ด้านบน
          </p>
        </Card>
      )}

      {day.board && (
        <Collapsible icon="🚉" title="จุดขึ้นรถทีละขั้น">
          <TextBlock text={day.board} />
        </Collapsible>
      )}

      {day.rain !== "-" && (
        <Card className="border-sky-500/30 bg-sky-500/5">
          <SectionTitle icon="☔">ถ้าฝนตก</SectionTitle>
          <TextBlock text={day.rain} />
        </Card>
      )}

      {day.maps.length > 0 && (
        <Card>
          <SectionTitle icon="🗺">สถานที่ใน Google Maps</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {day.maps.map((m) => (
              <a
                key={m.url}
                href={m.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-line px-3 py-1.5 text-sm hover:border-accent hover:text-accent"
              >
                {m.name} ↗
              </a>
            ))}
          </div>
        </Card>
      )}

      {day.costs.length > 0 && (
        <Card>
          <SectionTitle icon="💴">ค่าเดินทาง + ค่าเข้า ต่อคน</SectionTitle>
          <div className="divide-y divide-line">
            {day.costs.map((c) => (
              <div key={c.name} className="flex gap-3 py-2.5 first:pt-0">
                <div className="min-w-0 flex-1">
                  <p className="text-[15px]">{c.name}</p>
                  <p className="mt-0.5 text-xs text-ink-2">
                    {c.type}
                    {c.source ? ` · ${c.source}` : ""}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-semibold tabular-nums">{yen(c.yen)}</p>
                  {c.status === "ประมาณ" && <Pill tone="warn">ประมาณ</Pill>}
                </div>
              </div>
            ))}
            <div className="flex justify-between pt-2.5 font-bold">
              <span>รวม</span>
              <span className="tabular-nums">
                {yen(total)} <span className="font-normal text-ink-2">≈ {baht(toThb(total))}</span>
              </span>
            </div>
          </div>
        </Card>
      )}

      {day.details && (
        <Collapsible icon="📖" title="รายละเอียดสถานที่">
          <TextBlock text={day.details} />
        </Collapsible>
      )}

      <Card>
        <SectionTitle icon="✅">ต้องจอง / ต้องเตรียม</SectionTitle>
        <Checklist id={day.slug} text={day.checklist} />
      </Card>

      <nav className="flex justify-between gap-3 pt-2 text-sm">
        {prev ? (
          <Link href={`/day/${prev.slug}`} className="rounded-full border border-line px-4 py-2 hover:border-accent">
            ← {prev.short}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/day/${next.slug}`} className="rounded-full border border-line px-4 py-2 hover:border-accent">
            {next.short} →
          </Link>
        ) : (
          <Link href="/" className="rounded-full border border-line px-4 py-2 hover:border-accent">
            ภาพรวม
          </Link>
        )}
      </nav>
    </div>
  );
}
