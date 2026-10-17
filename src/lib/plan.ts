import "server-only";
import { placeUrl, type RouteLeg } from "./maps";

// สำเนาข้อมูลจาก Google Sheet "Japan 2027" (แท็บ Main แถว 2–8 และแท็บ ค่าใช้จ่าย)
// ดึงเมื่อ 17 ต.ค. 2026 ถ้าแก้ชีตแล้วต้องอัปเดตไฟล์นี้ใหม่
// ไฟล์นี้ import ได้เฉพาะฝั่ง server เท่านั้น ข้อมูลจะไม่ติดไปกับ JavaScript ของหน้าเว็บ

export const SNAPSHOT_DATE = "17 ต.ค. 2026";
export const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1tDcJ_97EXKyNxRpZhIWOs061kpxK-KjEGFRAtWnxBKE/edit";

// อัตราแลกเปลี่ยนตอนดึงข้อมูล (Main!G13 = GOOGLEFINANCE JPYTHB)
export const THB_PER_JPY = 0.2104;

export type PriceStatus = "เช็กแล้ว" | "ประมาณ";

export type CostItem = {
  name: string;
  type: "ค่าเดินทาง" | "ค่าเข้า";
  yen: number;
  status: PriceStatus;
  source?: string;
};

export type MapLink = { name: string; url: string };

export type Day = {
  slug: string; // ใช้ใน URL เช่น /day/10
  date: string; // ตรงกับคอลัมน์ A ของ Main
  short: string; // ป้ายสั้นบนการ์ด
  title: string;
  stay: string;
  accent: string; // สีประจำวัน (Tailwind class)
  place: string;
  howto: string;
  rain: string;
  rainStat: string;
  maps: MapLink[];
  routes: RouteLeg[]; // ลิงก์เส้นทาง Google Maps ทีละช่วง
  costs: CostItem[];
  board: string;
  details: string;
  checklist: string;
};

const m = (q: string) => `https://www.google.com/maps/search/?api=1&query=${q}`;

export const trip = {
  title: "Japan 2027",
  subtitle: "Kamakura · Hayama · Radiohead @ Saitama · Hakone วันเกิดแฟน · Tokyo",
  dates: "9–15 มิ.ย. 2027",
  people: 2,
  flights: [
    { code: "TG640", route: "BKK 22:10 → NRT 06:20", date: "9 → 10 มิ.ย." },
    { code: "TG677", route: "NRT 17:25 → BKK 21:55", date: "15 มิ.ย." },
  ],
  flightNote: "33,760 บาทสำหรับ 2 คน รวมกระเป๋าโหลดคนละ 1 ใบ",
  stays: [
    { nights: "10–11 มิ.ย.", place: "Smile Hotel Shonan Fujisawa", status: "เลือกไว้ก่อน (3,572 บาท 2 คืน)" },
    { nights: "12 มิ.ย.", place: "ใกล้ Saitama-Shintoshin", status: "ยังไม่ได้เลือกโรงแรม" },
    { nights: "13 มิ.ย.", place: "โตเกียว หรือ Kawaguchiko", status: "ยังไม่ได้เลือก" },
    { nights: "14 มิ.ย.", place: "ยังไม่ได้เลือก", status: "ยังไม่ได้เลือก" },
  ],
  pending: [
    "คืนวันที่ 13 พักโตเกียวหรือ Kawaguchiko",
    "คืนวันที่ 14 พักที่ไหน แล้วแก้เส้นทางวันที่ 15 ที่ยังออกจาก Ikebukuro",
    "ร้านมื้อวันเกิดวันที่ 13",
    "โรงแรมคืนวันที่ 12 ใกล้ Saitama-Shintoshin",
    "จะใช้บัตร Izuhakone 1Day Bus Free และ Enoden Noriorikun ไหม",
  ],
};

// ชื่อจุดที่ใช้ค้นใน Google Maps (ภาษาอังกฤษแบบเดียวกับแท็บ คู่มือเดินทาง ภาษาญี่ปุ่นเมื่อชื่ออังกฤษหาไม่เจอ)
const HOTEL_FUJISAWA = "Smile Hotel Shonan Fujisawa";
const YORIDOKORO = "ヨリドコロ 稲村ヶ崎";
const SHIMAMURA = "ファッションセンターしまむら 高田馬場店";

// เส้นทางทีละช่วงตามไทม์ไลน์ใน Main คอลัมน์ C
const routes: Record<string, RouteLeg[]> = {
  "9": [{ to: "Suvarnabhumi Airport", mode: "driving", note: "จากที่อยู่ตอนนี้ไปสุวรรณภูมิ" }],
  "10": [
    { time: "08:33", from: "Narita Airport Terminal 1 Station", to: "Keisei Funabashi Station", mode: "transit", note: "Keisei Main Line (Rapid)" },
    { time: "09:33", from: "Keisei Funabashi Station", to: "JR Funabashi Station", mode: "walking", note: "เดินเปลี่ยนสถานี 5 นาที" },
    { time: "09:46", from: "JR Funabashi Station", to: "Shinagawa Station", mode: "transit", note: "JR Sobu Rapid" },
    { time: "10:26", from: "Shinagawa Station", to: "Fujisawa Station", mode: "transit", note: "JR Tokaido Line" },
    { from: "Fujisawa Station", to: HOTEL_FUJISAWA, mode: "walking", note: "ฝากกระเป๋า" },
    { time: "12:50", from: "Enoden Fujisawa Station", to: "Kamakurakokomae Station", mode: "transit", note: "Enoden" },
    { from: "Kamakurakokomae Station", to: "Kamakurakokomae Crossing", mode: "walking", note: "ทางข้ามรถไฟ 3 นาที" },
    { time: "13:40", from: "Kamakurakokomae Station", to: "Shichirigahama Station", mode: "walking", note: "เดินเลียบทะเล" },
    { time: "14:20", from: "Shichirigahama Station", to: "Inamuragasaki Station", mode: "transit", note: "Enoden" },
    { from: "Inamuragasaki Station", to: YORIDOKORO, mode: "walking", note: "Cafe Yoridokoro 3–5 นาที" },
    { time: "15:37", from: "Inamuragasaki Station", to: "Hase Station Kanagawa", mode: "transit", note: "Enoden" },
    { from: "Hase Station Kanagawa", to: "Kotoku-in Great Buddha", mode: "walking", note: "ถนนคนเดินหน้าพระใหญ่ 7 นาที" },
    { time: "17:35", from: "Hase Station Kanagawa", to: "Fujisawa Station", mode: "transit", note: "Enoden กลับ" },
    { from: "Fujisawa Station", to: HOTEL_FUJISAWA, mode: "walking", note: "กลับโรงแรม" },
  ],
  "11": [
    { time: "08:12", from: HOTEL_FUJISAWA, to: "Kita-Kamakura Station", mode: "transit", note: "JR Tokaido → เปลี่ยนที่ Ofuna → JR Yokosuka" },
    { from: "Kita-Kamakura Station", to: "Meigetsu-in", mode: "walking", note: "10 นาที เข้าก่อน 09:00" },
    { from: "Meigetsu-in", to: "Tsurugaoka Hachimangu", mode: "walking" },
    { from: "Tsurugaoka Hachimangu", to: "Kamakura Station", via: "Komachi-dori", mode: "walking", note: "ผ่าน Komachi-dori" },
    { time: "13:34", from: "Kamakura Station", to: "Zushi Station", mode: "transit", note: "JR Yokosuka" },
    { from: "Zushi Station", to: "Morito Daimyojin", mode: "transit", note: "รถบัส Keikyu 逗11 / 逗12 ป้าย 3" },
    { from: "Morito Daimyojin", to: "Hayama Marina", mode: "walking", note: "เดินเที่ยวย่าน Morito" },
    { from: "Hayama Marina", to: "Zushi Station", mode: "transit", note: "รถบัสป้าย Abuzuri" },
    { time: "18:34", from: "Zushi Station", to: "Fujisawa Station", mode: "transit", note: "JR เปลี่ยนที่ Ofuna" },
  ],
  "12": [
    { time: "08:12", from: "Fujisawa Station", to: "Oi Keibajo Mae Station", mode: "transit", note: "เปลี่ยนที่ Yokohama และ Tenkubashi" },
    { from: "Oi Keibajo Mae Station", to: "Ohi Racecourse", mode: "walking", note: "ตลาดนัด Tokyo City Flea Market" },
    { time: "12:03", from: "Oi Keibajo Mae Station", to: "Saitama-Shintoshin Station", mode: "transit", note: "Monorail → Hamamatsucho → JR Keihin-Tohoku" },
    { from: "Saitama-Shintoshin Station", to: "Cocoon City", mode: "walking", note: "ข้าวเที่ยง" },
    { time: "13:45", from: "Saitama-Shintoshin Station", to: "Musashi Ichinomiya Hikawa Shrine", mode: "transit", note: "ถ้ายังมีแรง: JR ไป Omiya แล้วเดิน" },
    { from: "Musashi Ichinomiya Hikawa Shrine", to: "Omiya Park", mode: "walking" },
    { from: "Omiya Park", to: "Saitama-Shintoshin Station", mode: "transit", note: "กลับไปพักที่โรงแรม" },
    { time: "17:00", from: "Saitama-Shintoshin Station", to: "Saitama Super Arena", mode: "walking", note: "GMO ARENA saitama 3 นาที" },
    { time: "09:32", from: "Fujisawa Station", to: "Saitama-Shintoshin Station", mode: "transit", note: "แผนวันฝน / ตลาดงด: JR ตรง ไม่เปลี่ยนรถ" },
  ],
  "13": [
    { time: "08:05", from: "Saitama-Shintoshin Station", to: "Odawara Station", mode: "transit", note: "JR ไม่ต้องเปลี่ยนรถ" },
    { time: "10:20", from: "Odawara Station", to: "Hakone-en", mode: "transit", note: "รถบัส Izuhakone ทางออกตะวันออก ป้าย 5" },
    { time: "14:00", from: "Hakone-en", to: "Motohakone-ko", mode: "transit", note: "รถบัส" },
    { from: "Motohakone-ko", to: "Hakone Shrine", mode: "walking", note: "10 นาที" },
    { time: "15:15", from: "Hakone Shrine", to: "Onshi Hakone Park", via: "Hakone Kyukaido Cedar Avenue", mode: "walking", note: "ผ่านถนนต้นสนโบราณ" },
    { time: "17:43", from: "Motohakone-ko", to: "Odawara Station", mode: "transit", note: "รถบัส Izuhakone" },
  ],
  "14": [
    { from: "Takadanobaba Station", to: SHIMAMURA, mode: "walking", note: "ทางออก Toyama 1 นาที" },
    { time: "11:52", from: "Takadanobaba Station", to: "Koenji Station", mode: "transit", note: "JR เปลี่ยนที่ Shinjuku" },
    { from: "Koenji Station", to: "Koenji Pal Shotengai", mode: "walking" },
    { time: "15:00", from: "Koenji Station", to: "Shimokitazawa Station", mode: "transit", note: "JR → Shinjuku → Odakyu" },
  ],
  "15": [
    { time: "13:09", from: "Ikebukuro Station", to: "Narita Airport Terminal 1 Station", mode: "transit", note: "แผนเก่า ต้องแก้เมื่อรู้ที่พัก" },
  ],
};

// ลิงก์สถานที่ที่เพิ่มจากคอลัมน์ F ของ Main
const extraPlaces: Record<string, MapLink[]> = {
  "9": [{ name: "Suvarnabhumi Airport", url: placeUrl("Suvarnabhumi Airport") }],
  "10": [{ name: HOTEL_FUJISAWA, url: placeUrl(HOTEL_FUJISAWA) }],
  "11": [{ name: "Morito Beach", url: placeUrl("Morito Beach Hayama") }],
  "13": [
    { name: "Motohakone-ko", url: placeUrl("Motohakone-ko") },
    { name: "Odawara Station", url: placeUrl("Odawara Station") },
  ],
  "15": [
    { name: "Seibu Ikebukuro (depachika)", url: placeUrl("Seibu Ikebukuro Main Store") },
    { name: "Sunshine City", url: placeUrl("Sunshine City Ikebukuro") },
    { name: "Narita Airport", url: placeUrl("Narita International Airport") },
  ],
};

const baseDays: Omit<Day, "routes">[] = [
  {
    slug: "9",
    date: "2027-06-09 (พุธ)",
    short: "9 มิ.ย. พุธ",
    title: "ออกเดินทางจากกรุงเทพ",
    stay: "บนเครื่อง",
    accent: "slate",
    place: `ออกเดินทางจากกรุงเทพตอนค่ำ: TG640 BKK 22:10 → NRT 06:20 (10 มิ.ย.)`,
    howto: `การบินไทย บินตรงจากสุวรรณภูมิ กระเป๋าโหลดรวมในตั๋ว 1 ใบต่อคน`,
    rain: "-",
    rainStat: "-",
    maps: [],
    costs: [],
    board: `สนามบินสุวรรณภูมิ (BKK) เคาน์เตอร์การบินไทย`,
    details: "",
    checklist: `ก่อนเดินทาง
☐ พาสปอร์ตทั้งสองคน และตั๋ว TG640 / TG677
☐ จองที่พัก 3 คืนแรก: Fujisawa 2 คืน (10–11 มิ.ย. เลือก Smile Hotel Shonan Fujisawa ไว้ก่อน) และใกล้ Saitama-Shintoshin 1 คืน (12 มิ.ย. คืนคอนเสิร์ต ควรจองก่อน)
☐ คืนวันที่ 13–14 ยังไม่ได้เลือกเมืองที่พัก
☐ เช็กเอกสารเข้าเมืองญี่ปุ่นที่ต้องกรอกล่วงหน้า (ยังไม่ได้เช็กกฎปี 2027)
☐ แลกเงินเยนสด

ตัวเลือกที่พักที่เจอ (ฝั่ง Saitama-Shintoshin ยังไม่ได้เช็กราคาของวันที่จะไป)
• Fujisawa: Smile Hotel Shonan Fujisawa (ทางออกใต้ของสถานี Fujisawa เดิน 2–5 นาที) 3,572 บาทสำหรับ 2 คืน 2 คน บน Trip.com เมื่อ 13 ต.ค. 2026 ตัวเลือกสำรองคือ Sotetsu Fresa Inn Kamakura-Ofuna สาขา Higashiguchi 4,608 บาท
• Saitama-Shintoshin: Hotel Metropolitan Saitama-Shintoshin (ติดสถานี เดินถึงสนาม 3 นาที), APA Hotel Saitama-Shintoshin Eki-kita (เดินจากสถานี 8 นาที), APA Hotel Saitama-Shintoshin Eki-nishi (เดิน 5 นาที)

วันนี้
☐ กระเป๋าโหลดคนละ 1 ใบ รวมในตั๋วแล้ว
☐ ถึงสุวรรณภูมิเผื่อเวลาก่อนเครื่องออก 22:10`,
  },
  {
    slug: "10",
    date: "2027-06-10 (พฤหัส)",
    short: "10 มิ.ย. พฤหัส",
    title: "ถึง Narita · เส้นชายทะเล Enoden",
    stay: "Smile Hotel Shonan Fujisawa (คืนที่ 1/2)",
    accent: "sky",
    place: `ถึง Narita 06:20 เข้าเมือง นั่งรถไฟไป Fujisawa ฝากกระเป๋าที่โรงแรม กินข้าวเที่ยง
บ่าย: เส้นชายทะเล Enoden หลังบินข้ามคืน: ทางข้ามรถไฟ Slam Dunk ที่ Kamakurakokomae และ Koshigoe Rakko Park ที่อยู่ติดกัน, เดินเลียบหาด Shichirigahama (ริมหาดคามาคุระ), Cafe Yoridokoro ริมราง Enoden ที่ Inamuragasaki, ถนนคนเดินย่านพระไดบุตสึ, พระใหญ่ Kotoku-in และ KANNON COFFEE แถว Hase
เย็น: กลับ Fujisawa เช็กอิน
พัก Fujisawa ที่ Smile Hotel Shonan Fujisawa (คืนที่ 1 จาก 2)`,
    howto: `08:33 Keisei Main Line (Rapid) Narita Airport (หรือ 08:36 Airport Terminal 2) → 09:33 Keisei-Funabashi เดิน 5 นาทีไป JR Funabashi
09:46 JR Sobu Rapid → 10:19 Shinagawa
10:26 JR Tokaido Line → 11:04 Fujisawa
(Narita → Fujisawa 2,166 เยน เปลี่ยนรถ 2 ครั้ง ราว 2 ชม. 30 นาที เป็นรอบตัวอย่าง เผื่อเวลาผ่าน ตม. และรับกระเป๋า)
12:50 Enoden Fujisawa → 13:07 Kamakurakokomae ไม่ต้องเปลี่ยนรถ ทางข้ามรถไฟอยู่ห่างสถานี 3 นาที Koshigoe Rakko Park อยู่ติดทางข้าม
13:40 เดินเลียบทะเลไป Shichirigahama 1 สถานี
14:20 Enoden Shichirigahama → 14:27 Inamuragasaki เดิน 3–5 นาทีถึง Cafe Yoridokoro (เปิด 07:00–18:00 ปิดวันอังคาร)
15:37 Enoden Inamuragasaki → 15:43 Hase เดินถนนคนเดินหน้าพระใหญ่ 7 นาทีถึง Kotoku-in (เปิดถึง 17:30) แล้วแวะ KANNON COFFEE
17:35 Enoden Hase → 18:07 Fujisawa ไม่ต้องเปลี่ยนรถ
หมายเหตุ: Enoden ออกทุก 14 นาที`,
    rain: `ฝนปรอย: ไปตามแผน พกร่ม ถ้าทะเลมองไม่เห็นให้ข้าม Kamakurakokomae, Koshigoe Rakko Park และ Shichirigahama นั่ง Enoden จาก Fujisawa ตรงไป Inamuragasaki (Cafe Yoridokoro อยู่ในร่ม) และ Hase ดูพระใหญ่
ฝนหนักหรือเหนื่อยจากบินข้ามคืน: พักที่ Fujisawa แล้วย้ายเส้นชายทะเลไปบ่ายวันที่ 11 แทน Hayama
ถ้าช้ากว่าแผน ตัดตามลำดับ: KANNON COFFEE, เวลาที่หาด Shichirigahama`,
    rainStat: "ฝน 2/5",
    maps: [
      { name: "Kamakurakokomae Crossing", url: m("Kamakurakokomae%20Crossing%20Kanagawa") },
      { name: "Koshigoe Rakko Park", url: m("%E8%85%B0%E8%B6%8A%E3%83%A9%E3%83%83%E3%82%B3%E5%85%AC%E5%9C%92") },
      { name: "Shichirigahama Beach", url: m("Shichirigahama%20Beach%20Kanagawa") },
      { name: "Cafe Yoridokoro (Inamuragasaki)", url: m("%E3%83%A8%E3%83%AA%E3%83%89%E3%82%B3%E3%83%AD%20%E7%A8%B2%E6%9D%91%E3%83%B6%E5%B4%8E") },
      { name: "Kotoku-in Great Buddha", url: m("Kotoku-in%20Great%20Buddha%20Kanagawa") },
      { name: "KANNON COFFEE kamakura", url: m("KANNON%20COFFEE%20kamakura%20Kanagawa") },
    ],
    costs: [
      { name: "Narita → Fujisawa: Keisei Main Line ถึง Keisei-Funabashi 758 + JR จาก Funabashi เปลี่ยนที่ Shinagawa 1,408", type: "ค่าเดินทาง", yen: 2166, status: "เช็กแล้ว", source: "transit.yahoo.co.jp" },
      { name: "Enoden Fujisawa → Kamakurakokomae", type: "ค่าเดินทาง", yen: 260, status: "เช็กแล้ว", source: "transit.yahoo.co.jp" },
      { name: "Enoden Shichirigahama → Inamuragasaki (แวะ Cafe Yoridokoro)", type: "ค่าเดินทาง", yen: 200, status: "เช็กแล้ว", source: "transit.yahoo.co.jp" },
      { name: "Enoden Inamuragasaki → Hase", type: "ค่าเดินทาง", yen: 200, status: "เช็กแล้ว", source: "transit.yahoo.co.jp" },
      { name: "พระใหญ่ Kamakura (Kotoku-in)", type: "ค่าเข้า", yen: 300, status: "เช็กแล้ว", source: "kotoku-in.jp" },
      { name: "Enoden Hase → Fujisawa", type: "ค่าเดินทาง", yen: 310, status: "เช็กแล้ว", source: "transit.yahoo.co.jp" },
      { name: "ทางข้ามรถไฟ Kamakurakokomae, Koshigoe Rakko Park, หาด Shichirigahama และถนนคนเดินหน้าพระใหญ่ (ฟรี)", type: "ค่าเข้า", yen: 0, status: "เช็กแล้ว" },
    ],
    board: `1. Narita: สถานีรถไฟ Keisei ใต้อาคารผู้โดยสาร ขึ้น Keisei Main Line (Rapid) ขบวนไป Keisei-Ueno 08:33 จาก Narita Airport หรือ 08:36 จาก Airport Terminal 2 (ไม่ใช่ Skyliner และไม่ใช่ Access Express)
2. ลง Keisei-Funabashi 09:33 เดิน 5 นาทีไปสถานี JR Funabashi
3. JR Funabashi ชานชาลา 3: ขึ้น JR Sobu Rapid ขบวนไป Kurihama 09:46 ลง Shinagawa 10:19 (ชานชาลา 15) เดินไปชานชาลา 12 ขึ้น JR Tokaido Line ขบวนไป Hiratsuka 10:26 ลง Fujisawa 11:04
4. Fujisawa: ฝากกระเป๋าที่ Smile Hotel Shonan Fujisawa (ฝั่งทางออกใต้) กินข้าวเที่ยงแถวสถานี
5. Fujisawa สถานี Enoden (ฝั่งทางออกใต้): ขึ้น Enoden ขบวนไป Kamakura 12:50 (รอบก่อนหน้า 12:36)
6. นั่ง Enoden 17 นาที ไม่ต้องเปลี่ยนรถ ลง Kamakurakokomae 13:07
7. Kamakurakokomae: ทางข้ามรถไฟอยู่ห่างสถานี 3 นาที Koshigoe Rakko Park อยู่ติดทางข้าม (ห่างสถานีราว 130 เมตร) แล้วเดินเลียบทะเลไปสถานี Shichirigahama (ยังไม่ได้เช็กเวลาเดิน เผื่อไว้ 15 นาที) หาดอยู่ห่างสถานี 3 นาที
8. Shichirigahama: ขึ้น Enoden ขบวนไป Kamakura 14:20 ลง Inamuragasaki 14:27 (รอบถัดไป 14:34 และ 14:48) เดิน 3–5 นาทีถึง Cafe Yoridokoro อยู่ข้างทางข้ามรถไฟ
9. Inamuragasaki ชานชาลา 2: ขึ้น Enoden ขบวนไป Kamakura 15:37 ลง Hase 15:43 (รอบถัดไป 15:51 และ 16:05) เดินถนนคนเดินหน้าพระใหญ่ 7 นาทีถึง Kotoku-in
10. Hase: ขึ้น Enoden ขบวนไป Fujisawa 17:35 ลงปลายทาง Fujisawa 18:07 (รอบถัดไป 17:49 ถึง 18:21) ขึ้นฝั่งตรงข้ามกับขบวนไป Kamakura
11. Fujisawa: เดินกลับ Smile Hotel Shonan Fujisawa เช็กอิน`,
    details: `• Enoden: รถไฟสายเล็กจาก Fujisawa ถึง Kamakura วิ่งผ่านย่านบ้านคนแล้วออกเลียบทะเลช่วง Koshigoe ถึง Inamuragasaki จาก Fujisawa ถึง Kamakurakokomae 17 นาที
• ทางข้ามรถไฟ Kamakurakokomae: ฉากเปิดของอนิเมะ Slam Dunk เห็นรถไฟ Enoden วิ่งผ่านหน้าทะเล Shonan และเกาะ Enoshima คนเยอะ มีเจ้าหน้าที่คุม ห้ามยืนถ่ายรูปบนถนน
• Koshigoe Rakko Park (腰越ラッコ公園): สวนเล็กๆ ติดทางข้ามรถไฟ Slam Dunk มองเห็นทางข้าม รถไฟ Enoden และทะเลจากในสวน ใช้เป็นที่ยืนถ่ายรูปแทนการยืนบนถนนได้ เข้าฟรี
• หาด Shichirigahama (ริมหาดคามาคุระในบล็อก paikondieow: หาดทรายสีดำ เห็นฟูจิไกลๆ ในวันฟ้าเปิด): หาดยาวเลียบทางรถไฟ Enoden มองเห็นเกาะ Enoshima นักโต้คลื่นเยอะ มีคาเฟ่และร้านอาหารริมทะเล บล็อกในแท็บ kanagawa แนะนำช่วงพระอาทิตย์ตก (กลาง มิ.ย. พระอาทิตย์ตกราว 19:00 ตามแผนนี้ไม่ได้อยู่รอ)
• Cafe Yoridokoro (ヨリドコロ สาขา Inamuragasaki): ร้านอาหารและคาเฟ่ในบ้านไม้เก่าสมัยไทโช อยู่ข้างทางข้ามรถไฟ นั่งริมหน้าต่างหรือบาร์ด้านนอกจะเห็นรถไฟ Enoden สีเขียววิ่งผ่านหน้าร้าน ขึ้นชื่อเรื่องชุดปลาตากแห้งย่าง (ราคาบนเว็บมีตั้งแต่ราว 1,000 ถึง 1,600 เยน ยังไม่ได้ยืนยัน) และไข่สดตีฟูราดข้าว เปิด 07:00–18:00 ปิดวันอังคาร รับออร์เดอร์สุดท้ายราว 17:00–17:30 คิวมักยาว
• ถนนคนเดินย่านพระไดบุตสึ: ถนนจากสถานี Hase ขึ้นไปพระใหญ่ เดินราว 7 นาที สองข้างทางเป็นร้านของกิน ของฝาก ร้านเซรามิก และคาเฟ่ บล็อก paikondieow แนะนำร้านเซรามิกและมุมดอกไม้ตามกำแพง
• พระใหญ่ Kotoku-in: พระพุทธรูปอมิตาภะสำริด สมบัติของชาติ เริ่มหล่อปี 1252 สูงราว 11.3 เมตร หนักราว 121 ตัน วิหารที่เคยคลุมถูกพายุและสึนามิพัดไปตั้งแต่ศตวรรษที่ 15 จึงนั่งกลางแจ้ง เข้าไปดูข้างในองค์พระได้ จ่ายเพิ่ม 50 เยนเป็นเงินสด (ยังไม่ได้เช็กซ้ำว่ายังเปิด)
• KANNON COFFEE kamakura: คาเฟ่เล็กแถว Hase ขึ้นชื่อเรื่องเครปและคุกกี้รูปพระใหญ่
• Fujisawa: เมืองใหญ่ของย่าน Shonan เป็นต้นสาย Enoden และจุดตัดของ JR Tokaido Line กับ Odakyu มีห้างและร้านอาหารรอบสถานีทั้งสองฝั่ง`,
    checklist: `ต้องจองล่วงหน้า
☐ Smile Hotel Shonan Fujisawa 2 คืน (10–11 มิ.ย.) เช็กอิน 15:00 ถามว่าฝากกระเป๋าก่อนเช็กอินได้ไหม (ถึงราว 11:10)
☐ Cafe Yoridokoro: ถามร้านว่าจองที่นั่งริมหน้าต่างหรือบาร์ด้านนอกได้ไหม โทร 0467-40-5737 (บางแหล่งบอกว่าจองไม่ได้ ต้องต่อคิว บางแหล่งบอกว่าเริ่มรับจองที่นั่งเคาน์เตอร์ตั้งแต่ ก.ย. 2024)

พกไป
☐ ซื้อหรือเติมบัตร IC (Suica / PASMO) ที่ Narita ใช้ได้ทั้ง Keisei, JR และ Enoden ค่ารถและค่าเข้าวันนี้ 3,436 เยนต่อคน (ไม่รวมค่าอาหารที่ Cafe Yoridokoro และ KANNON COFFEE)
☐ เงินสดสำหรับค่าเข้าพระใหญ่และคาเฟ่ (ยังไม่ได้เช็กว่ารับบัตรไหม)
☐ ร่มพับ

เวลา
☐ ต้องออกจาก Inamuragasaki ไม่เกิน 16:05 เพื่อเข้าพระใหญ่ก่อนปิด 17:30

ระวัง
☐ ที่ Narita ขึ้น Keisei Main Line เท่านั้น ไม่ขึ้น Skyliner หรือ Access Express และต้องลงที่ Keisei-Funabashi
☐ ที่ Funabashi ขึ้น JR Sobu Rapid แล้วต้องเปลี่ยนเป็น JR Tokaido Line ที่ Shinagawa เพราะ Sobu Rapid ไม่ผ่าน Fujisawa
☐ ที่ทางข้ามรถไฟ Slam Dunk ห้ามยืนถ่ายรูปบนถนน

ยังไม่ได้เช็ก
☐ การบินไทยใช้ Terminal ไหนที่ Narita
☐ เวลาเดิน Kamakurakokomae ไป Shichirigahama และระยะเดินจริงจาก Smile Hotel ไปสถานี Fujisawa (แหล่งข้อมูลบอก 2–5 นาที)
☐ เวลาปิดของ KANNON COFFEE และราคาเมนูของ Cafe Yoridokoro`,
  },
  {
    slug: "11",
    date: "2027-06-11 (ศุกร์)",
    short: "11 มิ.ย. ศุกร์",
    title: "Kamakura วัดไฮเดรนเยีย · Hayama",
    stay: "Smile Hotel Shonan Fujisawa (คืนที่ 2/2)",
    accent: "violet",
    place: `เช้า: Kamakura ฝั่งวัดและเมืองเก่า: 08:40 วัด Meigetsu-in (ไฮเดรนเยีย) ที่ Kita-Kamakura
10:30 ศาลเจ้า Tsurugaoka Hachimangu
11:15 กินข้าวและเดินถนน Komachi-dori
บ่าย: Hayama: ราว 14:15 ศาลเจ้า Morito Daimyojin และหาด Morito, ของกินเล่นและคาเฟ่ย่าน Morito (Asahiya, Misaki Donuts, SOSO HAYAMA), หาด Suwa, Hayama Marina
เย็น: กลับ Fujisawa
พัก Fujisawa ที่ Smile Hotel Shonan Fujisawa (คืนที่ 2 จาก 2)`,
    howto: `08:12 JR Tokaido Line Fujisawa → Ofuna 1 สถานี
08:25 JR Yokosuka Ofuna → 08:28 Kita-Kamakura เดิน 10 นาทีถึง Meigetsu-in
(วันนี้วันศุกร์ คนน่าจะน้อยกว่าเสาร์อาทิตย์ แต่ช่วงไฮเดรนเยียควรเข้าก่อน 09:00)
เดินต่อไปศาลเจ้า Tsurugaoka Hachimangu และ Komachi-dori ถึงสถานี Kamakura
13:34 JR Kamakura → 13:39 Zushi
รถบัส Keikyu สาย 逗11 หรือ 逗12 ป้าย 3 หน้าสถานี Zushi ราว 15 นาที ลงป้าย Morito Jinja (森戸神社)
ราว 14:15 เดินเที่ยวจากศาลเจ้า Morito ถึง Hayama Marina ตามเส้นทางในลิงก์ visitkanagawa (แท็บ Hayama) ราว 2.5 ชม.
รถบัสกลับที่ป้าย Abuzuri (鐙摺) ใกล้ Hayama Marina ไปสถานี Zushi
18:34 JR Zushi → เปลี่ยนที่ Ofuna → 18:56 Fujisawa (รอบถัดไป 18:41 ถึง 18:59)
หมายเหตุ: เวลารถบัสยังไม่ได้เช็ก`,
    rain: `ฝนปรอย: ไปตามแผน ไฮเดรนเยียสวยตอนฝน พกร่มและรองเท้ากันลื่น
ฝนหนัก: เที่ยวแค่ครึ่งเช้า (Meigetsu-in, ศาลเจ้า, Komachi-dori) ตัด Hayama ออกเพราะเป็นทางเดินริมทะเลกลางแจ้งทั้งหมด`,
    rainStat: "ฝน 2/5",
    maps: [
      { name: "Meigetsu-in", url: m("Meigetsu-in%20Kanagawa") },
      { name: "Tsurugaoka Hachimangu", url: m("Tsurugaoka%20Hachimangu%20Kanagawa") },
      { name: "Komachi-dori", url: m("Komachi-dori%20Kanagawa") },
      { name: "Morito Daimyojin", url: m("Morito%20Daimyojin%20Kanagawa") },
      { name: "Hayama Marina", url: m("Hayama%20Marina%20Kanagawa") },
    ],
    costs: [
      { name: "JR Fujisawa → Kita-Kamakura (เปลี่ยนรถที่ Ofuna)", type: "ค่าเดินทาง", yen: 209, status: "เช็กแล้ว", source: "transit.yahoo.co.jp" },
      { name: "วัด Meigetsu-in (ราคาปกติ เดือน มิ.ย. อาจเปลี่ยน)", type: "ค่าเข้า", yen: 500, status: "เช็กแล้ว", source: "trip-kamakura.com" },
      { name: "JR Kamakura → Zushi", type: "ค่าเดินทาง", yen: 199, status: "เช็กแล้ว", source: "transit.yahoo.co.jp" },
      { name: "รถบัส Keikyu สถานี Zushi ↔ Morito Jinja / Abuzuri ไป-กลับ (250 × 2)", type: "ค่าเดินทาง", yen: 500, status: "ประมาณ", source: "ยังไม่เจอค่าโดยสารบนเว็บ ประมาณเที่ยวละ 250 เยน" },
      { name: "JR Zushi → Fujisawa (เปลี่ยนรถที่ Ofuna)", type: "ค่าเดินทาง", yen: 253, status: "เช็กแล้ว", source: "transit.yahoo.co.jp" },
      { name: "ศาลเจ้า Tsurugaoka Hachimangu, ศาลเจ้า Morito และชายหาด Hayama (ฟรี)", type: "ค่าเข้า", yen: 0, status: "ประมาณ", source: "ศาลเจ้า Morito ยังไม่ได้ยืนยันว่าไม่เก็บค่าเข้า" },
    ],
    board: `1. Fujisawa ชานชาลา 3: ขึ้น JR Tokaido Line (Ueno-Tokyo Line) 08:12 ลง Ofuna 1 สถานี (ถึงชานชาลา 1/2) เดินไปชานชาลา 7/8 ขึ้น JR Yokosuka ขบวนไป Zushi 08:25 ลง Kita-Kamakura 08:28 (รอบก่อนหน้า ออก Fujisawa 08:01 ถึง 08:17)
2. Kita-Kamakura: เดิน 10 นาทีถึง Meigetsu-in
3. เดินจาก Meigetsu-in ไปศาลเจ้า Tsurugaoka Hachimangu (ยังไม่ได้เช็กเวลาเดิน เผื่อไว้ 30 นาที) ถ้าไม่อยากเดิน นั่ง JR 1 สถานีไป Kamakura
4. จากศาลเจ้าเดินถนน Komachi-dori ลงมาถึงสถานี Kamakura ราว 10 นาที
5. Kamakura ชานชาลา 1: ขึ้น JR ขบวนไป Zushi 13:34 ลง Zushi 13:39 (รอบถัดไป 13:45 และ 13:54)
6. สถานี Zushi ป้ายรถบัส 3: ขึ้นรถบัส Keikyu สาย 逗11 หรือ 逗12 ราว 15 นาที ลงป้าย Morito Jinja (森戸神社) รถผ่านป้าย Abuzuri, Hayama Marina และ Morito Kaigan ก่อนถึง
7. เดินเที่ยวย้อนขึ้นเหนือ: ศาลเจ้า Morito → หาด Morito → Asahiya (5 นาที) → Misaki Donuts (2 นาที) → SOSO HAYAMA (2 นาที) → Genbe (3 นาที) → หาด Suwa → Hayama Marina
8. ป้าย Abuzuri (鐙摺) ใกล้ Hayama Marina: ขึ้นรถบัสกลับสถานี Zushi ราว 10 นาที
9. Zushi: ขึ้น JR 18:34 ลง Ofuna เปลี่ยนเป็น JR Tokaido Line ขบวนไปทาง Odawara ลง Fujisawa 18:56 (รอบถัดไป 18:41 ถึง 18:59 และ 18:49 ถึง 19:10)`,
    details: `• วัด Meigetsu-in: วัดเซนนิกาย Rinzai ฉายา "วัดไฮเดรนเยีย" (Ajisai-dera) มีไฮเดรนเยียราว 2,500 ต้น เกือบทั้งหมดเป็นพันธุ์ Hime Ajisai สีฟ้าที่เรียกว่า Meigetsu-in Blue บานเต็มที่กลางเดือน มิ.ย. มุมถ่ายรูปดังคือบันไดหินที่มีดอกสองข้าง และหน้าต่างกลม "หน้าต่างแห่งการรู้แจ้ง" ในอาคารหลัก (คิวถ่ายยาว) สวนด้านหลังเปิดเฉพาะช่วงดอกไอริสและใบไม้เปลี่ยนสี เก็บค่าเข้าเพิ่ม 500 เยน เดือน มิ.ย. เปิดราว 08:30–17:00 (ยังไม่ได้เช็กซ้ำ)
• ศาลเจ้า Tsurugaoka Hachimangu: ศาลเจ้าสำคัญที่สุดของ Kamakura ก่อตั้งปี 1063 Minamoto no Yoritomo ย้ายมาที่ปัจจุบันปี 1180 ขึ้นบันไดหิน 61 ขั้นไปอาคารหลักแล้วมองลงมาเห็นถนน Wakamiya Oji ยาวไปถึงทะเล สองข้างทางเข้าเป็นสระ Genpei เข้าฟรี
• Komachi-dori: ถนนคนเดินยาวราว 360 เมตรจากศาลเจ้าถึงสถานี Kamakura ร้านของกินและของฝากกว่า 200 ร้าน เมืองขอความร่วมมือไม่เดินกินไปด้วย ให้ยืนกินหน้าร้าน

Hayama (จากลิงก์ visitkanagawa ในแท็บ Hayama)
• ศาลเจ้า Morito Daimyojin: ศาลเจ้าริมทะเลสมัยศตวรรษที่ 12 สร้างโดย Minamoto no Yoritomo มีโทริอิสีแดง ต้นสนจูนิเปอร์อายุ 800 ปี และจุดชมวิวหลังศาลเจ้า เปิด 09:00–17:00
• หาด Morito: ออกทางหลังศาลเจ้าข้ามสะพานแดง Misogi-bashi เป็นจุดชมภูเขาไฟฟูจิข้ามอ่าวที่คนไม่ค่อยรู้จัก (หน้าฝนอาจมองไม่เห็น)
• Asahiya: ร้านเนื้อเก่าแก่ของคนท้องถิ่น คร็อกเกต์เนื้อ Hayama ชิ้นละ 100 เยน (ราคาจากบทความ อาจเปลี่ยนแล้ว)
• Misaki Donuts: ร้านโดนัทริมหาด ตัวขายดีคือครีมชีสเลมอน
• SOSO HAYAMA: คาเฟ่ ร้านดอกไม้ และร้านของใช้ ในบ้านญี่ปุ่นเก่าอายุ 100 ปี
• Genbe: ร้านรองเท้าแตะและเสื้อผ้าชายหาด เปิดมาราว 150 ปี
• หาด Suwa: ท่าเรือประมงเล็กๆ คนน้อย นั่งพักกินขนมริมทะเลได้
• Hayama Marina: ท่าเรือยอชต์ที่ถือเป็นต้นกำเนิดกีฬาเรือใบของญี่ปุ่น มีร้านอาหารและร้านพุดดิ้ง Marlowe`,
    checklist: `ไม่ต้องจองอะไร

พกไป
☐ บัตร IC ใช้ได้ทั้ง JR และรถบัส Keikyu ค่ารถและค่าเข้าวันนี้ 1,661 เยนต่อคน
☐ เงินสด ค่าเข้า Meigetsu-in และของกินเล่นร้านเล็กที่ Hayama (ยังไม่ได้เช็กว่ารับบัตรไหม)
☐ ร่มพับและรองเท้าที่เดินสบาย กันลื่น

เวลา
☐ ออกจาก Fujisawa 08:12 เพื่อเข้า Meigetsu-in ก่อน 09:00 ต้องเปลี่ยนรถที่ Ofuna ให้ทันขบวน 08:25
☐ ศาลเจ้า Morito ปิด 17:00 ควรถึง Hayama ไม่เกิน 15:00

ยังไม่ได้เช็ก
☐ ตารางและค่ารถบัส Keikyu สถานี Zushi ไป Morito Jinja และขากลับจาก Abuzuri (ค่ารถในชีตเป็นค่าประมาณ)
☐ วันหยุดและเวลาเปิดของ Asahiya, Misaki Donuts, SOSO HAYAMA
☐ เวลาเดิน Meigetsu-in ไปศาลเจ้า Tsurugaoka Hachimangu
☐ เวลาเปิดและค่าเข้า Meigetsu-in เดือน มิ.ย. 2027 และสถานะดอกไฮเดรนเยีย`,
  },
  {
    slug: "12",
    date: "2027-06-12 (เสาร์)",
    short: "12 มิ.ย. เสาร์",
    title: "ตลาดนัด Ohi · คอนเสิร์ต Radiohead",
    stay: "ใกล้ Saitama-Shintoshin (ยังไม่ได้เลือกโรงแรม)",
    accent: "rose",
    place: `เช้า: เช็กเอาต์จาก Fujisawa ไปตลาดนัด Tokyo City Flea Market ที่สนามแข่งม้า Ohi (เลือกไว้ก่อน เปิดเฉพาะเสาร์อาทิตย์ งดถ้าฝนตก) ลากกระเป๋าไปด้วย
บ่าย: ไป Saitama-Shintoshin ฝากกระเป๋าที่โรงแรม กินข้าวเที่ยงที่ศูนย์อาหาร Cocoon City
ถ้ายังมีแรง นั่ง JR 1 สถานีไปศาลเจ้า Musashi Ichinomiya Hikawa และ Omiya Park แล้วกลับมาก่อน 15:15
พักผ่อนก่อนคอนเสิร์ต: เช็กอินโรงแรม 15:00 อาบน้ำ งีบในห้องจนถึงราว 17:00 (ถ้ายังเข้าห้องไม่ได้ นั่งพักที่ Keyaki Hiroba หรือ Starbucks ข้างสนาม)
คอนเสิร์ต Radiohead @ GMO ARENA saitama 18:00 JST
พัก Saitama (1 คืน)`,
    howto: `08:12 เช็กเอาต์ Fujisawa ขึ้น JR Tokaido Line (Ueno-Tokyo Line) → เปลี่ยนที่ Yokohama ขึ้น Keikyu Main Line รถด่วน → เปลี่ยนที่ Tenkubashi ขึ้น Tokyo Monorail → 09:23 Ōi-keibajō-mae
(เปลี่ยนรถ 2 ครั้ง 1 ชม. 11 นาที อีกเส้นทางเปลี่ยนที่ Kawasaki และ Hamamatsucho เวลาเท่ากัน 1,219 เยน)
09:30–12:00 เดินตลาดนัด
12:03 Tokyo Monorail → เปลี่ยนที่ Hamamatsucho ขึ้น JR Keihin-Tohoku Rapid → 13:05 Saitama-Shintoshin
(เปลี่ยนรถ 1 ครั้ง รอบถัดไป 12:13 ถึง 13:07 เปลี่ยน 2 ครั้ง)
13:10 ฝากกระเป๋าที่โรงแรม กินข้าวที่ Cocoon City
13:45–15:15 ถ้ายังมีแรง: JR 1 สถานีไป Omiya 3 นาที เดินไปศาลเจ้าราว 15 นาที กลับทางเดิม (ไม่เดิน Hikawa Sando 2 กม. เพื่อเก็บแรง)
15:15–17:00 เช็กอินแล้วพักในห้อง
17:00 เดินไปสนาม 3 นาที (ปรับตามเวลาเปิดประตูบนตั๋ว)
หลังคอนเสิร์ตเดินกลับโรงแรม ไม่ต้องขึ้นรถไฟ
หมายเหตุ: เวลารถเป็นตารางวันเสาร์เดือน ต.ค. 2026`,
    rain: `ฝนตกหรือตลาดนัดงด: ใช้แผนเดิม Fujisawa 09:32 JR Tokaido Line (Ueno-Tokyo Line) ถึง Saitama-Shintoshin 10:47 ไม่ต้องเปลี่ยนรถ 1,408 เยน (รอบถัดไป 09:41 ถึง 10:59) ฝากกระเป๋าแล้วอยู่ใน Cocoon City ซึ่งเป็นห้างในร่มติดสถานี จนเช็กอินได้ ค่ารถในแท็บค่าใช้จ่ายคิดแบบไปตลาดนัด
เหนื่อยหลังตลาดนัด: ข้ามศาลเจ้า Hikawa นั่งพักที่ Keyaki Hiroba หรือ Cocoon City จนเช็กอินได้`,
    rainStat: "ฝน 1/5",
    maps: [
      { name: "Tokyo City Flea Market (Ohi Racecourse)", url: m("Ohi+Racecourse+Flea+Market+2-1-2+Katsushima+Shinagawa") },
      { name: "Hikawa Shrine (Omiya)", url: m("Musashi+Ichinomiya+Hikawa+Shrine+Omiya") },
      { name: "Omiya Park", url: m("Omiya+Park+Saitama") },
      { name: "Cocoon City", url: m("Cocoon+City+Saitama-Shintoshin") },
      { name: "GMO ARENA saitama", url: m("Saitama+Super+Arena") },
    ],
    costs: [
      { name: "Fujisawa → Ōi-keibajō-mae (ตลาดนัด): JR Tokaido เปลี่ยนที่ Yokohama ขึ้น Keikyu เปลี่ยนที่ Tenkubashi ขึ้น Tokyo Monorail", type: "ค่าเดินทาง", yen: 1070, status: "เช็กแล้ว", source: "transit.yahoo.co.jp (ตารางวันเสาร์ 17 ต.ค. 2026)" },
      { name: "Ōi-keibajō-mae → Saitama-Shintoshin: Tokyo Monorail 317 + JR Keihin-Tohoku เปลี่ยนที่ Hamamatsucho 616", type: "ค่าเดินทาง", yen: 933, status: "เช็กแล้ว", source: "transit.yahoo.co.jp (ตารางวันเสาร์ 17 ต.ค. 2026)" },
      { name: "ตลาดนัด Tokyo City Flea Market ที่ Ohi Racecourse (เข้าฟรี)", type: "ค่าเข้า", yen: 0, status: "ประมาณ", source: "ยังไม่ได้ยืนยันว่าเข้าฟรี" },
      { name: "JR Saitama-Shintoshin → Omiya", type: "ค่าเดินทาง", yen: 155, status: "เช็กแล้ว", source: "transit.yahoo.co.jp" },
      { name: "ศาลเจ้า Hikawa, Omiya Park และทางเดิน Hikawa Sando (ฟรี)", type: "ค่าเข้า", yen: 0, status: "เช็กแล้ว" },
    ],
    board: `1. Fujisawa: เช็กเอาต์ Smile Hotel ขึ้น JR Tokaido Line (Ueno-Tokyo Line) 08:12 ลง Yokohama (ยังไม่ได้เช็กชานชาลา)
2. Yokohama: เปลี่ยนเป็น Keikyu Main Line รถด่วน (Express) ลง Tenkubashi
3. Tenkubashi: เปลี่ยนเป็น Tokyo Monorail ลง Ōi-keibajō-mae 09:23
4. Ōi-keibajō-mae: เดินไปลานจอดรถที่ 1 ของสนามแข่งม้า Ohi ที่ตั้งตลาดนัด (ยังไม่ได้เช็กเวลาเดินและตู้ล็อกเกอร์)
5. Ōi-keibajō-mae: ขึ้น Tokyo Monorail ไป Hamamatsucho 12:03 เปลี่ยนเป็น JR Keihin-Tohoku Rapid ลง Saitama-Shintoshin 13:05 ไม่ต้องเปลี่ยนอีก
6. Saitama-Shintoshin: ฝากกระเป๋าที่โรงแรม กินข้าวที่ศูนย์อาหาร Cocoon City (ทางออกตะวันออก)
7. ถ้ายังมีแรง (13:45–15:15): Saitama-Shintoshin ชานชาลา 2 หรือ 4 ขึ้น JR Keihin-Tohoku หรือ JR Utsunomiya Line ลง Omiya 3 นาที ทางออกตะวันออกเดินราว 15 นาทีถึงศาลเจ้า Hikawa สวน Omiya Park อยู่ติดกัน กลับทางเดิมแล้วนั่ง JR 1 สถานี
8. Saitama-Shintoshin: เช็กอินโรงแรม (ส่วนใหญ่เช็กอินได้ 15:00) พักในห้องถึงราว 17:00
9. 17:00 เดินไปสนาม สนามและ Keyaki Hiroba อยู่ฝั่งตะวันตกของสถานี เดิน 3 นาที
10. หลังคอนเสิร์ต: เดินกลับโรงแรม`,
    details: `• Tokyo City Flea Market (大井競馬場フリーマーケット): ตลาดนัดของมือสองในลานจอดรถที่ 1 ของสนามแข่งม้า Ohi ที่อยู่ 2-1-2 Katsushima, Shinagawa ผู้จัดคือ 東京リサイクル運動市民の会 เปิดเกือบทุกเสาร์อาทิตย์ 09:00–15:00 (บางเว็บบอกปิด 14:30) งดถ้าฝนตก มีเสื้อผ้า ของใช้ และของเก่า ปีที่แล้วมีตารางวันเปิดรายเดือน ตารางปี 2027 ยังไม่ออก
• ศาลเจ้า Musashi Ichinomiya Hikawa: ศาลเจ้าหลักของศาลเจ้า Hikawa ราว 280 แห่งทั่วคันโต ตามตำนานอายุกว่า 2,400 ปี ชื่อเมือง Omiya (ศาลเจ้าใหญ่) มาจากที่นี่ จุดเด่นคือประตู romon สีแดง สะพานข้ามสระ และป่าต้นไม้ใหญ่ เข้าฟรี
• Omiya Park: สวนของจังหวัดที่เก่าที่สุดใน Saitama (เปิดปี 1885) อยู่ติดหลังศาลเจ้า มีสระน้ำ ป่าสน และสวนสัตว์เล็กเข้าฟรี
• Hikawa Sando: ทางเดินเข้าศาลเจ้ายาวราว 2 กม. ร่มด้วยต้นเคยากิตลอดทาง ว่ากันว่าเป็นทางเข้าศาลเจ้าที่ยาวที่สุดในญี่ปุ่น วันนี้ไม่เดินทั้งเส้นเพื่อเก็บแรงไว้ดูคอนเสิร์ต

จุดพักผ่อนก่อนคอนเสิร์ต (ฟรี ยกเว้นค่าอาหาร)
• ห้องพักโรงแรม: พักได้ดีที่สุด ส่วนใหญ่เช็กอินได้ 15:00 Hotel Metropolitan Saitama-Shintoshin อยู่ติดสถานี (เดิน 1 นาที) APA Hotel Saitama-Shintoshin Eki-kita เช็กอิน 15:00 เดิน 8 นาที
• Cocoon City: ห้างติดทางออกตะวันออก ร้านกว่า 250 ร้าน ศูนย์อาหาร 2 แห่ง ที่นั่งเยอะ คนหมุนเร็ว แม้วันมีคอนเสิร์ต
• Keyaki Hiroba: ชั้น 2 เป็นลานกลางแจ้งร่มต้นเคยากิ มีม้านั่ง ติดสนาม ชั้นล่างเป็นร้านอาหาร วันมีคอนเสิร์ตคนจะเยอะ
• Starbucks สาขา Saitama-Shintoshin Keyaki Hiroba: ใกล้สนาม มีม้านั่งด้านนอก
• Cafe Cross Yard: คาเฟ่ชั้น 5 ของ Hotel Metropolitan ในอาคารสถานี คนที่ไม่ได้พักก็เข้าได้
• สวน Saitama-Shintoshin Station Park: สนามหญ้าราว 11,000 ตร.ม. เดินจากสถานี 7 นาที
• GMO ARENA saitama: ชื่อใหม่ของ Saitama Super Arena สนามในร่ม ให้ดูเวลาเปิดประตูบนตั๋ว และเช็กกฎเรื่องขนาดกระเป๋าก่อนไป
• ตัวเลือกเพิ่ม: ร้าน Shimamura สาขา Saitama-Shintoshin สาขาใหญ่ที่สุดในญี่ปุ่น ชั้น 2 ของ Saitama Shintoshin Fashion Mall ทางออกตะวันออกเดิน 3 นาที เปิด 10:00–19:00 (ข้อมูลปี 2021) แผนหลักของ Shimamura อยู่วันที่ 14`,
    checklist: `ต้องจองล่วงหน้า
☐ โรงแรมใกล้ Saitama-Shintoshin 1 คืน (12 มิ.ย.) คืนคอนเสิร์ตห้องมักเต็มเร็วและราคาขึ้น ควรจองเป็นอย่างแรก ถามว่าฝากกระเป๋าก่อนเช็กอินได้ไหมและเช็กอินได้กี่โมง แผนนี้ใช้ห้องพักผ่อน 15:15–17:00 (ถึงราว 13:05 ถ้าไปตลาดนัด หรือ 10:47 ถ้าไปตรง)
☐ ตั๋วคอนเสิร์ต Radiohead (เช็กว่าเป็นตั๋วกระดาษหรือตั๋วในมือถือ และต้องแสดงบัตรประจำตัวไหม)

เช็กก่อนไป
☐ ตลาดนัด Ohi เปิดวันเสาร์ 12 มิ.ย. 2027 ไหม (ดูตารางของ 東京リサイクル運動市民の会) และเช้าวันนั้นเช็กว่างดเพราะฝนไหม
☐ Smile Hotel Shonan Fujisawa เช็กเอาต์ภายใน 10:00 (วันนี้ออก 08:12)
☐ เวลาเปิดประตู (คอนเสิร์ตเริ่ม 18:00) ถ้าเปิดก่อน 17:00 ให้ออกจากห้องเร็วขึ้น
☐ กฎขนาดกระเป๋าและของต้องห้ามของสนาม

พกไป
☐ บัตร IC ค่ารถวันนี้ 2,158 เยนต่อคน
☐ เงินสดและเหรียญสำหรับตลาดนัด
☐ ร่มพับ (ช่วงเช้าถึงบ่ายเดินกลางแจ้งเกือบทั้งหมด)

ยังไม่ได้เช็ก
☐ ตู้ล็อกเกอร์ที่สถานี Ōi-keibajō-mae หรือที่ตลาดนัด (ต้องลากกระเป๋าเดินทางไปด้วย)
☐ เวลาเดินจากสถานี Ōi-keibajō-mae ถึงลานตลาดนัด
☐ ค่าเข้าตลาดนัด (คิดว่าฟรี)`,
  },
  {
    slug: "13",
    date: "2027-06-13 (อาทิตย์)",
    short: "13 มิ.ย. อาทิตย์",
    title: "Hakone วันเกิดแฟน",
    stay: "ยังไม่ได้เลือก (โตเกียว หรือ Kawaguchiko)",
    accent: "amber",
    place: `วันเกิดแฟน เที่ยว Hakone แบบไปเช้าเย็นกลับ
เช้า: เช็กเอาต์จาก Saitama นั่งรถไฟไป Odawara ฝากกระเป๋าที่ตู้ล็อกเกอร์ ต่อรถบัสขึ้นเขา
เที่ยง: Hakone-en Aquarium ริมทะเลสาบ Ashi และกินข้าวเที่ยง
บ่าย: Hakone Shrine กับโทริอิริมน้ำ เดินถนนต้นสนโบราณไป Onshi Hakone Park
เย็น: รถบัสกลับ Odawara รับกระเป๋า ไปที่พัก
พัก: ยังไม่ได้เลือก (โตเกียว หรือ Kawaguchiko)`,
    howto: `08:05 JR Saitama-Shintoshin → 09:59 Odawara ไม่ต้องเปลี่ยนรถ 1 ชม. 54 นาที
10:20 รถบัส Izuhakone ทางออกตะวันออก ป้าย 5 → 11:27 Hakone-en
11:30–13:50 Hakone-en Aquarium (เปิด 09:00–16:30 เข้าได้ถึง 16:00) และข้าวเที่ยง
14:00 รถบัส Hakone-en → 14:12 Motohakone เดินราว 10 นาทีถึง Hakone Shrine
15:15 เดินถนนต้นสนโบราณราว 500 ม. ไป Onshi Hakone Park (หอชมวิวเปิดถึง 16:30)
16:45–17:35 เวลาว่างริมทะเลสาบที่ Motohakone
17:43 รถบัส Motohakone → 18:37 Odawara
หมายเหตุ: เวลารถเป็นตารางวันอาทิตย์เดือน ต.ค. 2026 รถบัสขึ้นเขาวันอาทิตย์อาจช้ากว่านี้
หมายเหตุ: ไม่ขึ้น Komagatake Ropeway (ผู้ใช้ตัดออก 13 ต.ค. 2026)`,
    rain: `ฝนปรอย: ไปตามแผน Hakone-en Aquarium อยู่ในร่ม ศาลเจ้าในป่าสนเดินได้ พกร่ม ถ้าหมอกลงจนมองไม่เห็นทะเลสาบให้ข้าม Onshi Hakone Park แล้วกลับรถบัสรอบเร็วขึ้น
ฝนหนัก: เที่ยวแค่ Hakone-en Aquarium กับ Hakone Shrine แล้วกลับ Odawara
แผนสำรองแบบไม่ไป Hakone ยังไม่ได้ทำ`,
    rainStat: "ฝน 1/5 (แห้งสุดในช่วงนี้)",
    maps: [
      { name: "Hakone-en Aquarium", url: m("Hakone-en+Aquarium") },
      { name: "Hakone Shrine", url: m("Hakone+Shrine") },
      { name: "Hakone Kyukaido Cedar Avenue", url: m("Hakone+Kyukaido+Cedar+Avenue+Motohakone") },
      { name: "Onshi Hakone Park", url: m("Onshi+Hakone+Park") },
    ],
    costs: [
      { name: "JR Saitama-Shintoshin → Odawara (ไม่ต้องเปลี่ยนรถ)", type: "ค่าเดินทาง", yen: 2090, status: "เช็กแล้ว", source: "transit.yahoo.co.jp" },
      { name: "รถบัส Izuhakone สถานี Odawara → Hakone-en", type: "ค่าเดินทาง", yen: 1880, status: "เช็กแล้ว", source: "transit.yahoo.co.jp" },
      { name: "Hakone-en Aquarium", type: "ค่าเข้า", yen: 1600, status: "เช็กแล้ว", source: "princehotels.co.jp" },
      { name: "รถบัส Izuhakone Hakone-en → Motohakone", type: "ค่าเดินทาง", yen: 460, status: "เช็กแล้ว", source: "transit.yahoo.co.jp" },
      { name: "รถบัส Izuhakone Motohakone → สถานี Odawara", type: "ค่าเดินทาง", yen: 1510, status: "เช็กแล้ว", source: "transit.yahoo.co.jp" },
      { name: "Hakone Shrine, ถนนต้นสนโบราณ และ Onshi Hakone Park (ฟรี)", type: "ค่าเข้า", yen: 0, status: "เช็กแล้ว", source: "hakonenavi.jp, kanagawa-kankou.or.jp" },
    ],
    board: `1. Saitama-Shintoshin: ขึ้น JR ขบวนตรงไป Odawara 08:05 ลง Odawara 09:59 (ยังไม่ได้เช็กชานชาลา)
2. Odawara: ฝากกระเป๋าที่ตู้ล็อกเกอร์ในสถานี (ยังไม่ได้เช็กขนาดและราคา)
3. Odawara ทางออกตะวันออก ป้ายรถบัส 5: ขึ้นรถบัส Izuhakone ไป Hakone-en 10:20 ลงปลายทาง Hakone-en 11:27 (อีกรอบ 10:10 ผ่าน Owakudani ถึง 11:25) ต้องเป็นรถบัส Izuhakone ไม่ใช่ Hakone Tozan
4. Hakone-en: Hakone-en Aquarium อยู่ในบริเวณเดียวกับป้ายรถบัส
5. Hakone-en: ขึ้นรถบัส Izuhakone 14:00 ลง Motohakone 14:12 (มีรถอีกรอบ 13:50 จอดหน้า Hakone Shrine 13:56)
6. Motohakone: เดินราว 10 นาทีถึง Hakone Shrine
7. เดินกลับมา Motohakone แล้วเดินต่อตามถนนต้นสนโบราณไป Onshi Hakone Park (ยังไม่ได้เช็กเวลาเดิน เผื่อไว้เที่ยวละ 15–20 นาที)
8. เดินกลับมาป้าย Motohakone: ขึ้นรถบัส Izuhakone ไป Odawara 17:43 ลง Odawara 18:37 (รอบถัดไปของ Izuhakone 18:33 ถ้าพลาด รถบัส Hakone Tozan รอบสุดท้ายออก 20:03 จากป้าย Hakone-jinja-iriguchi ใช้บัตร Izuhakone ไม่ได้)
9. Odawara: รับกระเป๋า แล้วไปที่พัก ถ้าพักโตเกียว Odakyu ไป Shinjuku 18:51 ถึง 20:24 ไม่ต้องเปลี่ยนรถ 901 เยน (ยังไม่ได้ใส่ในค่าใช้จ่าย)`,
    details: `• Hakone-en Aquarium: พิพิธภัณฑ์สัตว์น้ำริมทะเลสาบ Ashi ในบริเวณ Hakone-en มีโซนน้ำเค็ม โซนน้ำจืด และลานแมวน้ำไบคาล เปิด 09:00–16:30 เข้าได้ถึง 16:00 ค่าเข้า 1,600 เยน
• Hakone Shrine: ศาลเจ้าเก่าแก่ในป่าสนริมทะเลสาบ Ashi จุดถ่ายรูปดังคือโทริอิสีแดงในน้ำ (Heiwa no Torii) คิวถ่ายรูปมักยาว ในเขตศาลเจ้ามี Kuzuryu Shrine สาขาใหม่ให้แวะได้ เข้าฟรี
• ถนนต้นสนโบราณ (Hakone Kyukaido): ทางเดินราว 500 ม. บนเส้นทาง Tokaido เก่า ใต้ต้นสนอายุถึง 350 ปี เชื่อม Motohakone กับ Onshi Hakone Park เดินฟรี
• Onshi Hakone Park: สวนบนแหลมริมทะเลสาบ Ashi เดิมเป็นพระตำหนักฤดูร้อนของราชวงศ์ มีหอชมวิวริมทะเลสาบ (เปิด 09:00–16:30) วันฟ้าเปิดเห็นภูเขาไฟฟูจิข้ามทะเลสาบ เข้าฟรี
• ตัวเลือกเพิ่ม: Hakone Checkpoint ด่านตรวจสมัยเอโดะที่สร้างขึ้นใหม่ อยู่ติดสวน ค่าเข้า 500 เยน (ราคาจากเว็บท่องเที่ยว ยังไม่ได้ยืนยัน) ยังไม่อยู่ในแผน`,
    checklist: `ต้องจองล่วงหน้า
☐ ที่พักคืนวันที่ 13: ยังไม่ได้เลือกเมือง (โตเกียว หรือ Kawaguchiko)
☐ ดินเนอร์วันเกิดแฟน: ยังไม่ได้เลือกร้านและยังไม่ได้จอง ถ้าพักโตเกียวจะถึง Shinjuku ราว 20:30

พกไป
☐ บัตร IC ค่ารถและค่าเข้าวันนี้ 7,540 เยนต่อคน (ยังไม่รวมรถไฟจาก Odawara ไปที่พัก)
☐ บัตร Izuhakone 1Day Bus Free 3,500 เยน ถูกกว่าจ่ายรถบัสทีละเที่ยว (3,850 เยน) 350 เยน ซื้อที่จุดขายตั๋ว Izuhakone หน้าสถานี Odawara (ในค่าใช้จ่ายยังคิดแบบจ่ายทีละเที่ยว)
☐ เงินสด และร่มพับ

เวลา
☐ ออกจาก Saitama-Shintoshin 08:05
☐ Hakone-en Aquarium เข้าได้ถึง 16:00
☐ ขึ้นรถบัสกลับจาก Motohakone 17:43

ระวัง
☐ Hakone Free Pass ของ Odakyu ใช้กับรถบัส Izuhakone ที่ไป Hakone-en ไม่ได้

ยังไม่ได้เช็ก
☐ ตู้ล็อกเกอร์ที่สถานี Odawara
☐ เวลาเดิน Hakone Shrine ไป Onshi Hakone Park และกลับมาป้าย Motohakone
☐ คิวถ่ายรูปที่โทริอิริมน้ำ
☐ ร้านที่จะนั่งช่วง 16:45–17:35 ก่อนขึ้นรถบัส (Bakery & Table Hakone ปิดราว 17:00, La Terrazza Ashinoko)
☐ ตารางรถไฟและรถบัสของเดือน มิ.ย. 2027`,
  },
  {
    slug: "14",
    date: "2027-06-14 (จันทร์)",
    short: "14 มิ.ย. จันทร์",
    title: "Shimamura · Koenji · Shimokitazawa",
    stay: "ยังไม่ได้เลือก",
    accent: "emerald",
    place: `เที่ยวย่านช้อปปิ้งในโตเกียว (เลือกไว้ก่อน)
เช้า: ช้อปเสื้อผ้าที่ Shimamura สาขา Takadanobaba
เที่ยง: กินข้าวและเดินร้านเสื้อผ้ามือสองและถนนช้อปปิ้งที่ Koenji
บ่ายถึงค่ำ: เดินร้านเสื้อผ้ามือสองและคาเฟ่ที่ Shimokitazawa กินข้าวเย็น
พัก: ยังไม่ได้เลือก`,
    howto: `10:00–11:45 Shimamura สาขา Takadanobaba (เปิด 10:00–20:00) ทางออก Toyama ฝั่ง Seibu เดิน 1 นาที
11:52 JR Yamanote → เปลี่ยนที่ Shinjuku ขึ้น JR Chuo Rapid → 12:08 Koenji
(หรือ Tokyo Metro Tozai เปลี่ยนที่ Nakano เร็วกว่าเล็กน้อย แต่ 313 เยน)
12:10–15:00 Koenji กินข้าวเที่ยงและเดินร้านเสื้อผ้ามือสอง (ส่วนใหญ่เปิดราวเที่ยง)
15:00 JR Chuo Rapid → เปลี่ยนที่ Shinjuku ขึ้น Odakyu → 15:25 Shimokitazawa
15:30–19:30 Shimokitazawa เดินร้านเสื้อผ้ามือสอง (หลายร้านปิดราว 20:00) และกินข้าวเย็น
หมายเหตุ: ค่ารถไป Takadanobaba ตอนเช้าและกลับที่พักตอนค่ำยังไม่ได้ใส่ เพราะยังไม่รู้ที่พัก
หมายเหตุ: เวลารถเป็นตารางวันจันทร์เดือน ต.ค. 2026`,
    rain: `ฝน: Shimamura อยู่ในร่ม ที่ Koenji เดินถนนช้อปปิ้ง Pal ที่มีหลังคา ที่ Shimokitazawa เน้นร้านใหญ่ใกล้สถานีและคาเฟ่ (วันนี้ฝน 3 ใน 5 ปี)
เหนื่อยหรือเวลาไม่พอ: ตัด Koenji ไป Shimokitazawa เลย (Yamanote เปลี่ยนที่ Shinjuku ขึ้น Odakyu 23 นาที 322 เยน)`,
    rainStat: "ฝน 3/5",
    maps: [
      { name: "Shimamura Takadanobaba", url: m("%E3%83%95%E3%82%A1%E3%83%83%E3%82%B7%E3%83%A7%E3%83%B3%E3%82%BB%E3%83%B3%E3%82%BF%E3%83%BC%E3%81%97%E3%81%BE%E3%82%80%E3%82%89+%E9%AB%98%E7%94%B0%E9%A6%AC%E5%A0%B4%E5%BA%97") },
      { name: "Koenji Pal Shotengai", url: m("Koenji+Pal+Shotengai") },
      { name: "Shimokitazawa", url: m("Shimokitazawa+Station") },
    ],
    costs: [
      { name: "JR Takadanobaba → Koenji (Yamanote เปลี่ยนที่ Shinjuku ขึ้น Chuo Rapid)", type: "ค่าเดินทาง", yen: 209, status: "เช็กแล้ว", source: "transit.yahoo.co.jp (ตารางวันจันทร์ 19 ต.ค. 2026)" },
      { name: "Koenji → Shimokitazawa: JR Chuo Rapid ถึง Shinjuku 199 + Odakyu 167", type: "ค่าเดินทาง", yen: 366, status: "เช็กแล้ว", source: "transit.yahoo.co.jp (ตารางวันจันทร์ 19 ต.ค. 2026)" },
    ],
    board: `1. สถานี Takadanobaba: ออกทางออก Toyama (戸山口) ของสถานี Seibu เดิน 1 นาทีถึงร้าน Shimamura
2. Takadanobaba ชานชาลา JR Yamanote ขาไป Shinjuku: ขึ้น 11:52 ลง Shinjuku เปลี่ยนเป็น JR Chuo Rapid ขบวนไปทาง Ome / Takao ลง Koenji 12:08 (ยังไม่ได้เช็กชานชาลา)
3. Koenji: ถนนช้อปปิ้ง Pal อยู่ทางออกใต้ ถนน Junjo อยู่ทางออกเหนือ ร้านเสื้อผ้ามือสองกระจายอยู่ในซอยรอบสถานี
4. Koenji: ขึ้น JR Chuo Rapid ไป Shinjuku 15:00 เปลี่ยนเป็น Odakyu Odawara Line ขบวนไป Hon-Atsugi ลง Shimokitazawa 15:25 (อีกเส้นทาง: JR ไป Kichijoji ต่อ Keio Inokashira 30 นาที 418 เยน)
5. Shimokitazawa: เดินรอบสถานี ร้านอยู่ทั้งฝั่งเหนือและใต้ของสถานี และตามทางเดินบนแนวทางรถไฟเก่า
6. ค่ำ: กลับที่พัก (ยังไม่ได้เลือก)`,
    details: `• Shimamura (ファッションセンターしまむら): ร้านเสื้อผ้าราคาถูกที่คนญี่ปุ่นใส่กัน ถูกกว่า GU และ UNIQLO มีเสื้อผ้าผู้ชาย ผู้หญิง เด็ก และไซซ์ใหญ่ (จากคลิป TikTok @s.thanakornn) สาขาส่วนใหญ่อยู่ชานเมือง ในเมืองโตเกียวมีไม่กี่สาขา
• สาขา Takadanobaba: ติดสถานี เปิด 10:00–20:00 (จากเว็บรวมร้าน ยังไม่ได้ยืนยันกับเว็บ Shimamura) ที่สถานีมีภาพวาดเจ้าหนูปรมาณูบนกำแพงใต้ทางรถไฟ JR
• สาขาอื่นที่เจอ: Nakano (เดินจากสถานี Nakano-sakaue 9 นาที ปิด 19:00) และสาขา Saitama-Shintoshin ซึ่งใหญ่ที่สุดในญี่ปุ่น (เดินจากสถานี 3 นาที เปิด 10:00–19:00)
• Koenji: ย่านเสื้อผ้ามือสองราคาไม่แพง มีถนนช้อปปิ้งเกือบ 20 สาย หลักๆ คือ Pal กับ Junjo ร้านที่บทความแนะนำ: PAPER MOON (ของถูก อยู่ถนนข้าง Pal) และ Slat (ราคาไม่แพง ไม่เน้น vintage) ร้านส่วนใหญ่เปิดราวเที่ยง
• Shimokitazawa: ย่านเสื้อผ้ามือสองที่ใหญ่ที่สุด มีทั้งร้านใหญ่ราคาถูกและร้าน vintage เล็กในซอย คาเฟ่เยอะ ร้านที่เจอ: 古着屋ジャム (11:00–20:00 ไม่มีวันหยุด ข้อมูลปี 2023), signal (12:00–20:00), NOTIME (เปิด 24 ชม. มีพนักงาน 12:00–21:00) ร้านเล็กมีวันปิดไม่ตรงกัน`,
    checklist: `เลือกไว้ก่อน
☐ เลือกเมืองที่จะพักคืนวันที่ 14 (ควรเป็นที่ที่ไป Narita สะดวกในวันที่ 15)

พกไป
☐ บัตร IC ค่ารถระหว่างย่านวันนี้ 575 เยนต่อคน (ไม่รวมค่ารถจากและกลับที่พัก)
☐ เงินสด ร้านเสื้อผ้ามือสองเล็กบางร้านอาจไม่รับบัตร (ยังไม่ได้เช็ก)
☐ พาสปอร์ต ใช้ทำ tax-free
☐ ร่มพับ และถุงผ้าใส่ของที่ซื้อ

ยังไม่ได้เช็ก
☐ เวลาเปิดของ Shimamura สาขา Takadanobaba กับเว็บ Shimamura
☐ วันปิดของร้านเสื้อผ้ามือสองที่อยากไป
☐ ถ้าซื้อเสื้อผ้าเยอะ เผื่อน้ำหนักกระเป๋าโหลดขากลับ (คนละ 1 ใบ)`,
  },
  {
    slug: "15",
    date: "2027-06-15 (อังคาร)",
    short: "15 มิ.ย. อังคาร",
    title: "ของฝาก · บินกลับ",
    stay: "กลับถึงกรุงเทพ 21:55",
    accent: "slate",
    place: `เช้า: ช้อปของฝากสั้นๆ แล้วเช็กเอาต์
บ่าย: ไป Narita กลับกรุงเทพ TG677 NRT 17:25 → BKK 21:55`,
    howto: `13:09 JR Yamanote Ikebukuro → Nippori ต่อ Keisei Main Line เปลี่ยนรถที่ Keisei-Sakura → 14:45 สนามบิน (ราว 1 ชม. 40 นาที)
ควรถึง Narita ราว 15:00
หมายเหตุ: ยังเป็นแผนเก่าที่ออกจาก Ikebukuro ต้องแก้เมื่อรู้ที่พักคืนวันที่ 14`,
    rain: "-",
    rainStat: "ฝน 4/5",
    maps: [],
    costs: [
      { name: "Ikebukuro → Narita: JR Yamanote 209 + Keisei Main Line 1,052", type: "ค่าเดินทาง", yen: 1261, status: "เช็กแล้ว", source: "transit.yahoo.co.jp" },
    ],
    board: `1. Ikebukuro ชานชาลา 7: ขึ้น JR Yamanote 13:09 ลง Nippori 13:22
2. Nippori ชานชาลา 2: ขึ้น Keisei Main Line ไป Keisei-Narita 13:30 ลง Keisei-Sakura 14:20 (ไม่ใช่ Skyliner และไม่ใช่ Access Express)
3. Keisei-Sakura: ต่อรถไป Narita Airport 14:23 ถึง Airport Terminal 2 14:45 สถานีถัดไปคือ Narita Airport ของ Terminal 1 (ยังไม่ได้เช็กว่าการบินไทยใช้อาคารไหน)`,
    details: `ของฝากรอบสถานี Ikebukuro ไม่ต้องเดินทางไกล
• ชั้นใต้ดินห้าง Seibu และ Tobu (depachika): ขนมกล่องของฝากและเบนโตะ ติดกับสถานี
• Sunshine City: ห้างใหญ่ฝั่งตะวันออก เดินจากสถานีราว 10 นาที มีร้านขนม ร้านคาแรกเตอร์ และร้านของใช้
• Don Quijote และร้านขายยารอบสถานี: ขนม เครื่องสำอาง ของใช้ ราคาถูก ทำ tax-free ได้เมื่อแสดงพาสปอร์ต`,
    checklist: `ถามโรงแรมไว้ก่อน
☐ เวลาเช็กเอาต์
☐ ฝากกระเป๋าหลังเช็กเอาต์ได้ไหม ระหว่างไปซื้อของฝาก

พกไป
☐ พาสปอร์ต ใช้ทำ tax-free ตอนซื้อของฝากและเช็กอินที่สนามบิน
☐ เงินในบัตร IC หรือเงินสด 1,261 เยนต่อคนสำหรับไป Narita
☐ เผื่อที่ว่างและน้ำหนักกระเป๋าโหลดสำหรับของฝาก (คนละ 1 ใบ)

เวลา
☐ ออกจาก Ikebukuro 13:09 ชานชาลา 7 ถึง Narita 14:45 เครื่องออก 17:25
☐ ขึ้น Keisei Main Line เท่านั้น ไม่ขึ้น Skyliner หรือ Access Express

ยังไม่ได้เช็ก
☐ การบินไทยใช้ Terminal ไหนที่ Narita (ลงผิดสถานีจะเสียเวลา)`,
  },
];

export const days: Day[] = baseDays.map((d) => ({
  ...d,
  maps: [...d.maps, ...(extraPlaces[d.slug] ?? [])],
  routes: routes[d.slug] ?? [],
}));

export const dayTotal = (d: Day) => d.costs.reduce((s, c) => s + c.yen, 0);
export const toThb = (yen: number) => Math.round(yen * THB_PER_JPY);
export const tripTotal = () => days.reduce((s, d) => s + dayTotal(d), 0);
export const getDay = (slug: string) => days.find((d) => d.slug === slug);
