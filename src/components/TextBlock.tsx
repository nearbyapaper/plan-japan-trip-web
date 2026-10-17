// แสดงข้อความหลายบรรทัดจากชีตให้อ่านง่าย
// - บรรทัดขึ้นต้นด้วยเวลา (08:12) → เวลาตัวหนาแบบไทม์ไลน์
// - "•" → bullet, "1." → ขั้นตอน, "หมายเหตุ:" และวงเล็บ → ตัวเล็กสีจาง
// - "เช้า:" "บ่าย:" ฯลฯ → ป้ายหัวช่วง

const TIME = /^(\d{1,2}:\d{2}(?:–\d{1,2}:\d{2})?)\s+(.*)$/;
const LABEL = /^(เช้า|บ่าย|เที่ยง|เย็น|ค่ำ|บ่ายถึงค่ำ|พัก|ฝน|ฝนปรอย|ฝนหนัก|ฝนหนักหรือเหนื่อยจากบินข้ามคืน|ฝนตกหรือตลาดนัดงด|เหนื่อยหลังตลาดนัด|เหนื่อยหรือเวลาไม่พอ|ถ้าช้ากว่าแผน ตัดตามลำดับ)\s*:\s*(.*)$/;

export default function TextBlock({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-1.5 text-[15px] leading-relaxed">
      {lines.map((raw, i) => {
        const line = raw.trim();
        if (!line) return <div key={i} className="h-2" />;

        const time = line.match(TIME);
        if (time) {
          return (
            <div key={i} className="flex gap-3">
              <span className="w-[5.5rem] shrink-0 font-semibold tabular-nums text-accent">{time[1]}</span>
              <span>{time[2]}</span>
            </div>
          );
        }
        if (line.startsWith("•")) {
          return (
            <div key={i} className="flex gap-2 pl-1">
              <span className="text-accent">•</span>
              <span>{line.slice(1).trim()}</span>
            </div>
          );
        }
        const step = line.match(/^(\d+)\.\s+(.*)$/);
        if (step) {
          return (
            <div key={i} className="flex gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
                {step[1]}
              </span>
              <span>{step[2]}</span>
            </div>
          );
        }
        if (line.startsWith("หมายเหตุ:") || line.startsWith("(")) {
          return (
            <p key={i} className="pl-[6.25rem] text-sm text-ink-2 max-sm:pl-0">
              {line}
            </p>
          );
        }
        const label = line.match(LABEL);
        if (label) {
          return (
            <p key={i}>
              <span className="mr-1.5 rounded-md bg-accent/10 px-1.5 py-0.5 text-sm font-semibold text-accent">
                {label[1]}
              </span>
              {label[2]}
            </p>
          );
        }
        return <p key={i}>{line}</p>;
      })}
    </div>
  );
}
