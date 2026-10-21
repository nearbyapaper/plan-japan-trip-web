import Link from "next/link";
import { SHEET_URL, SNAPSHOT_DATE, THB_PER_JPY, dayTotal, days, toThb, trip, tripTotal } from "@/lib/plan";
import { Card, Pill, SectionTitle, accentClass, baht, yen } from "@/components/ui";

export default function Overview() {
  const total = tripTotal();
  const estimated = days.flatMap((d) => d.costs).filter((c) => c.status === "ประมาณ").reduce((s, c) => s + c.yen, 0);

  return (
    <div className="space-y-5">
      <section className="py-2">
        <p className="text-sm font-medium text-accent">{trip.dates} · 2 คน</p>
        <h1 className="mt-1 text-3xl font-bold">{trip.title}</h1>
        <p className="mt-2 text-ink-2">{trip.subtitle}</p>
      </section>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="!p-4">
          <p className="text-xs text-ink-2">ค่าเดินทาง + ค่าเข้า ต่อคน</p>
          <p className="mt-1 text-2xl font-bold tabular-nums">{yen(total)}</p>
          <p className="text-sm text-ink-2">≈ {baht(toThb(total))}</p>
        </Card>
        <Card className="!p-4">
          <p className="text-xs text-ink-2">รวม 2 คน</p>
          <p className="mt-1 text-2xl font-bold tabular-nums">{yen(total * 2)}</p>
          <p className="text-sm text-ink-2">≈ {baht(toThb(total * 2))}</p>
        </Card>
        <Card className="!p-4">
          <p className="text-xs text-ink-2">ตั๋วเครื่องบิน 2 คน</p>
          <p className="mt-1 text-2xl font-bold tabular-nums">฿33,230</p>
          <p className="text-sm text-ink-2">รวมกระเป๋าโหลด</p>
        </Card>
      </div>
      <p className="-mt-2 text-xs text-ink-2">
        ไม่รวมค่าที่พักและอาหาร ในยอดมีค่าประมาณ {yen(estimated)} อัตรา {THB_PER_JPY} บาทต่อเยน
      </p>

      <div>
        <SectionTitle icon="📅">แผนรายวัน</SectionTitle>
        <div className="space-y-2.5">
          {days.map((d) => {
            const t = dayTotal(d);
            return (
              <Link
                key={d.slug}
                href={`/day/${d.slug}`}
                className="group flex items-stretch overflow-hidden rounded-2xl border border-line bg-surface transition hover:border-accent/50"
              >
                <span className={`w-1.5 shrink-0 ${accentClass[d.accent]}`} />
                <div className="flex flex-1 items-center gap-4 p-4">
                  <div className="w-12 shrink-0 text-center">
                    <p className="text-2xl font-bold leading-none">{d.slug}</p>
                    <p className="mt-1 text-xs text-ink-2">{d.short.split(" ").pop()}</p>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold group-hover:text-accent">{d.title}</p>
                    <p className="truncate text-sm text-ink-2">🛏 {d.stay}</p>
                  </div>
                  <div className="hidden shrink-0 text-right sm:block">
                    {t > 0 && <p className="text-sm font-semibold tabular-nums">{yen(t)}</p>}
                    {d.rainStat !== "-" && <p className="text-xs text-ink-2">☂ {d.rainStat.replace("ฝน ", "")}</p>}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <Card>
        <SectionTitle icon="✈️">เที่ยวบิน</SectionTitle>
        <div className="space-y-2">
          {trip.flights.map((f) => (
            <div key={f.code} className="flex flex-wrap items-baseline gap-x-3">
              <span className="font-bold">{f.code}</span>
              <span className="tabular-nums">{f.route}</span>
              <span className="text-sm text-ink-2">{f.date}</span>
            </div>
          ))}
          <p className="text-sm text-ink-2">{trip.flightNote}</p>
        </div>
      </Card>

      <Card>
        <SectionTitle icon="🛏">ที่พัก</SectionTitle>
        <div className="divide-y divide-line">
          {trip.stays.map((s) => (
            <div key={s.nights} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2.5 first:pt-0 last:pb-0">
              <span className="w-24 shrink-0 text-sm font-semibold">{s.nights}</span>
              <span className="flex-1">{s.place}</span>
              <Pill tone={s.status.startsWith("เลือกไว้ก่อน") ? "ok" : "warn"}>{s.status}</Pill>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionTitle icon="🤔">เรื่องที่ยังต้องตัดสินใจ</SectionTitle>
        <ol className="list-decimal space-y-1.5 pl-5">
          {trip.pending.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ol>
      </Card>

      <p className="pb-4 text-center text-xs text-ink-2">
        ข้อมูลจาก{" "}
        <a href={SHEET_URL} className="underline" target="_blank" rel="noreferrer">
          Google Sheet Japan 2027
        </a>{" "}
        ณ {SNAPSHOT_DATE} · เวลารถเป็นตารางปี 2026 ต้องเช็กซ้ำก่อนเดินทาง
      </p>
    </div>
  );
}
