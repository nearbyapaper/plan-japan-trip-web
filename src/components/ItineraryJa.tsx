import Link from "next/link";
import { daysJa, tripJa, type JaDay } from "@/lib/plan-ja";
import { Card, SectionTitle } from "@/components/ui";

function Schedule({ day }: { day: JaDay }) {
  return (
    <ul className="space-y-1.5">
      {day.items.map((it, i) => (
        <li key={i} className="flex gap-3">
          <span className="w-12 shrink-0 font-semibold tabular-nums text-ink-2">{it.time ?? ""}</span>
          <span className="min-w-0 flex-1">{it.text}</span>
        </li>
      ))}
    </ul>
  );
}

function DayCard({ day, link }: { day: JaDay; link?: boolean }) {
  return (
    <Card>
      <div className="mb-3 flex flex-wrap items-baseline gap-x-3">
        <h2 className="text-base font-bold">{day.date}</h2>
        {link ? (
          <Link href={`/day/${day.slug}`} className="font-semibold hover:text-accent">
            {day.title}
          </Link>
        ) : (
          <span className="font-semibold">{day.title}</span>
        )}
      </div>
      <Schedule day={day} />
      <p className="mt-3 border-t border-line pt-2 text-sm">
        <span className="text-ink-2">宿泊：</span>
        {day.stay}
      </p>
    </Card>
  );
}

function Basics() {
  return (
    <Card>
      <dl className="grid grid-cols-[5.5rem_1fr] gap-x-3 gap-y-2 text-[15px]">
        <dt className="text-ink-2">期間</dt>
        <dd>{tripJa.period}</dd>
        <dt className="text-ink-2">人数</dt>
        <dd>{tripJa.travelers}</dd>
        <dt className="text-ink-2">目的</dt>
        <dd>{tripJa.purpose}</dd>
      </dl>
    </Card>
  );
}

export function OverviewJa() {
  return (
    <div lang="ja" className="space-y-4">
      <section className="py-2">
        <p className="text-sm font-medium text-accent">Japan 2027</p>
        <h1 className="mt-1 text-3xl font-bold">{tripJa.title}</h1>
      </section>

      <Basics />

      <Card>
        <SectionTitle icon="✈️">航空便</SectionTitle>
        <div className="space-y-2">
          {tripJa.flights.map((f) => (
            <p key={f.code}>
              <span className="font-bold">
                {f.label} {f.code}
              </span>
              <span className="block text-[15px] sm:inline sm:pl-3">{f.detail}</span>
            </p>
          ))}
        </div>
      </Card>

      <Card>
        <SectionTitle icon="🛏">宿泊先</SectionTitle>
        <div className="divide-y divide-line">
          {tripJa.stays.map((s) => (
            <div key={s.name} className="py-2.5 first:pt-0 last:pb-0">
              <p className="text-sm text-ink-2">{s.nights}</p>
              <p className="font-semibold">{s.name}</p>
              <p className="text-[15px]">{s.address}</p>
            </div>
          ))}
        </div>
      </Card>

      <h2 className="pt-2 text-base font-bold">📅 日程</h2>
      {daysJa.map((d) => (
        <DayCard key={d.slug} day={d} link />
      ))}

      <p className="pb-4 text-center text-xs text-ink-2">{tripJa.note}</p>
    </div>
  );
}

export function DayJa({ day }: { day: JaDay }) {
  return (
    <div lang="ja" className="space-y-4">
      <DayCard day={day} />
      <Link href="/" className="inline-block rounded-full border border-line px-4 py-2 text-sm hover:border-accent">
        ← 旅行日程表（全日程）
      </Link>
    </div>
  );
}
