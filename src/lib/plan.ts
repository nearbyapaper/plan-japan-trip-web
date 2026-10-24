import "server-only";
import { placeUrl, type RouteLeg } from "./maps";

// สำเนาข้อมูลจาก Google Sheet "Japan 2027" (แท็บ Main แถว 2–8 และแท็บ ค่าใช้จ่าย)
// ดึงเมื่อ 18 ต.ค. 2026 วันที่ 12–15 และที่พักดึงใหม่ 23 ต.ค. 2026 (Almont Inn Nihonbashi เลือกไว้ก่อน) ถ้าแก้ชีตแล้วต้องอัปเดตไฟล์นี้ใหม่
// ไฟล์นี้ import ได้เฉพาะฝั่ง server เท่านั้น ข้อมูลจะไม่ติดไปกับ JavaScript ของหน้าเว็บ

export const SNAPSHOT_DATE = "24 ต.ค. 2026";
export const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1tDcJ_97EXKyNxRpZhIWOs061kpxK-KjEGFRAtWnxBKE/edit";

// อัตราแลกเปลี่ยนตอนดึงข้อมูล (Main!G13 = GOOGLEFINANCE JPYTHB)
export const THB_PER_JPY = 0.2116;

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
  subtitle: "Kamakura · Hayama · Radiohead @ Saitama · Hakone วันเกิดแฟน · Kawaguchiko · Tokyo",
  dates: "9–15 มิ.ย. 2027",
  people: 2,
  flights: [
    { code: "TG682", route: "BKK 22:45 → HND T3 06:55", date: "9 → 10 มิ.ย." },
    { code: "TG677", route: "NRT T1 17:25 → BKK 21:55", date: "15 มิ.ย." },
  ],
  flightNote: "33,230 บาทสำหรับ 2 คน (จองแล้ว) รวมกระเป๋าโหลดคนละ 1 ใบ",
  stays: [
    { nights: "10–11 มิ.ย.", place: "Smile Hotel Shonan Fujisawa", status: "เลือกไว้ก่อน (3,572 บาท 2 คืน)" },
    { nights: "12–14 มิ.ย.", place: "Almont Inn Nihonbashi (ห้องเตียงใหญ่ 14 ตร.ม.)", status: "เลือกไว้ก่อน ยังไม่ได้จอง (7,205 บาท 3 คืน ยกเลิกฟรี รวมอาหารเช้า) สำรอง: APA Hotel Ueno Ekimae" },
  ],
  pending: [
    "จอง Almont Inn Nihonbashi 3 คืน (12–14 มิ.ย. เลือกไว้ก่อน รอคุยกับแฟน ห้อง 14 ตร.ม. เหลือน้อย)",
    "ร้านมื้อวันเกิดวันที่ 13 และช่วงว่าง 15:15–17:35 ที่ Motohakone",
    "Shimamura จะอยู่วันไหน (ตอนนี้อยู่วันที่ 14)",
    "ไม่ต้องซื้อบัตร Izuhakone 1Day Bus Free (ไม่คุ้มกับแผน Owakudani) ส่วนบัตร Enoden Noriorikun วันที่ 10 เลือกไว้ก่อนแล้ว",
  ],
};

// ชื่อจุดที่ใช้ค้นใน Google Maps (ภาษาอังกฤษแบบเดียวกับแท็บ คู่มือเดินทาง ภาษาญี่ปุ่นเมื่อชื่ออังกฤษหาไม่เจอ)
const HOTEL_FUJISAWA = "Smile Hotel Shonan Fujisawa";
const YORIDOKORO = "ヨリドコロ 稲村ヶ崎";
const SHIMAMURA = "ファッションセンターしまむら 高田馬場店";
const HOTEL_TOKYO = "Almont Inn Tokyo Nihonbashi";

// เส้นทางทีละช่วงตามไทม์ไลน์ใน Main คอลัมน์ C
const routes: Record<string, RouteLeg[]> = {
  "9": [{ to: "Suvarnabhumi Airport", mode: "driving", note: "จากที่อยู่ตอนนี้ไปสุวรรณภูมิ" }],
  "10": [
    { time: "08:04", from: "Haneda Airport Terminal 3 Station", to: "Yokohama Station", mode: "transit", note: "Keikyu Airport Line (Express) ขบวนไป Kanazawa-Bunko" },
    { time: "08:41", from: "Yokohama Station", to: "Fujisawa Station", mode: "transit", note: "JR Tokaido Line" },
    { from: "Fujisawa Station", to: HOTEL_FUJISAWA, mode: "walking", note: "ฝากกระเป๋า" },
    { time: "10:30", from: "Enoden Fujisawa Station", to: "Kamakurakokomae Station", mode: "transit", note: "Enoden" },
    { from: "Kamakurakokomae Station", to: "Kamakurakokomae Crossing", mode: "walking", note: "ทางข้ามรถไฟ 3 นาที" },
    { time: "11:30", from: "Kamakurakokomae Station", to: "Shichirigahama Station", mode: "walking", note: "เดินเลียบทะเล" },
    { time: "12:42", from: "Shichirigahama Station", to: "Inamuragasaki Station", mode: "transit", note: "Enoden" },
    { from: "Inamuragasaki Station", to: YORIDOKORO, mode: "walking", note: "Cafe Yoridokoro ข้าวเที่ยง 3–5 นาที" },
    { time: "14:41", from: "Inamuragasaki Station", to: "Hase Station Kanagawa", mode: "transit", note: "Enoden" },
    { from: "Hase Station Kanagawa", to: "御霊神社 鎌倉", mode: "walking", note: "ศาลเจ้า Goryo ราว 300 ม." },
    { from: "御霊神社 鎌倉", to: "Kotoku-in Great Buddha", mode: "walking", note: "กลับทางสถานี Hase แล้วถนนคนเดินหน้าพระใหญ่" },
    { time: "17:35", from: "Hase Station Kanagawa", to: "Fujisawa Station", mode: "transit", note: "Enoden กลับ" },
    { from: "Fujisawa Station", to: HOTEL_FUJISAWA, mode: "walking", note: "กลับโรงแรม" },
  ],
  "11": [
    { time: "09:02", from: "Fujisawa Station", to: "Kamakura Station", mode: "transit", note: "JR Tokaido → เปลี่ยนที่ Ofuna → JR Shonan-Shinjuku 09:12" },
    { from: "Kamakura Station", to: "Tsurugaoka Hachimangu", mode: "walking", note: "ทางออกตะวันออก 10 นาที" },
    { from: "Tsurugaoka Hachimangu", to: "Kamakura Station", via: "Komachi-dori", mode: "walking", note: "ผ่าน Komachi-dori" },
    { time: "13:24", from: "Kamakura Station", to: "Zushi Station", mode: "transit", note: "JR Yokosuka ชานชาลา 1" },
    { time: "13:40", from: "Zushi Station", to: "Morito Daimyojin", mode: "transit", note: "รถบัส Keikyu 逗12 ป้าย 3 ทางออกตะวันออก" },
    { from: "Morito Daimyojin", to: "Hayama Marina", mode: "walking", note: "เดินเที่ยวย่าน Morito" },
    { time: "18:17", from: "Hayama Marina", to: "Zushi Station", mode: "transit", note: "รถบัส 逗12 ป้าย Abuzuri" },
    { time: "18:41", from: "Zushi Station", to: "Fujisawa Station", mode: "transit", note: "JR เปลี่ยนที่ Ofuna" },
  ],
  "12": [
    { time: "08:01", from: "Fujisawa Station", to: "Ningyocho Station", mode: "transit", note: "JR ถึง Shimbashi → Toei Asakusa Line 08:57" },
    { time: "09:04", from: "Ningyocho Station", to: HOTEL_TOKYO, mode: "walking", note: "ลากกระเป๋าไปฝากที่โรงแรม 5–10 นาที" },
    { from: HOTEL_TOKYO, to: "Ningyocho Station", mode: "walking", note: "5–10 นาที" },
    { time: "09:32", from: "Ningyocho Station", to: "Oi Keibajo Mae Station", mode: "transit", note: "Toei Asakusa → Daimon เดินไป Hamamatsucho → Tokyo Monorail" },
    { from: "Oi Keibajo Mae Station", to: "Ohi Racecourse", mode: "walking", note: "ตลาดนัด Tokyo City Flea Market" },
    { time: "12:03", from: "Oi Keibajo Mae Station", to: "Ningyocho Station", mode: "transit", note: "Monorail → เดินไป Daimon → Toei Asakusa ถึง 12:36" },
    { from: "Ningyocho Station", to: HOTEL_TOKYO, mode: "walking", note: "เช็กอิน พักในห้อง 15:00–16:00" },
    { time: "16:11", from: "Kayabacho Station", to: "Saitama-Shintoshin Station", mode: "transit", note: "Hibiya Line → Ueno → JR Takasaki 16:32" },
    { time: "17:00", from: "Saitama-Shintoshin Station", to: "Saitama Super Arena", mode: "walking", note: "GMO ARENA saitama 3 นาที" },
    { from: "Saitama Super Arena", to: "Omiya Station Saitama", mode: "walking", note: "หลังคอนเสิร์ต เดินราว 20 นาที เลี่ยงคนแน่น" },
    { from: "Omiya Station Saitama", to: "Kayabacho Station", mode: "transit", note: "JR → Ueno → Hibiya Line (เที่ยวสุดท้ายจาก Saitama-Shintoshin 23:15)" },
  ],
  "13": [
    { time: "07:50", from: "Kayabacho Station", to: "Odawara Station", mode: "transit", note: "Tozai → Otemachi → Chiyoda Line → Yoyogi-Uehara → Odakyu 快速急行 08:26 ถึง 09:48" },
    { time: "10:30", from: "Odawara Station", to: "Owakudani", mode: "transit", note: "รถบัส Izuhakone J03 (大涌谷経由 箱根園行) ทางออกตะวันออก ป้าย 5" },
    { time: "11:53", from: "Owakudani Station", to: "Togendai Station", mode: "transit", note: "Hakone Ropeway เที่ยวเดียว 2,000 เยน ผ่าน Ubako ไม่ต้องลง" },
    { time: "12:30", from: "Togendai Station", to: "Hakone-en", mode: "transit", note: "รถบัส Odakyu ป้าย 箱根桃源台 (บัตร Izuhakone ใช้ไม่ได้)" },
    { time: "14:00", from: "Hakone-en", to: "Motohakone-ko", mode: "transit", note: "รถบัส" },
    { from: "Motohakone-ko", to: "Hakone Shrine", mode: "walking", note: "10 นาที" },
    { time: "15:15", from: "Hakone Shrine", to: "Motohakone-ko", mode: "walking", note: "เวลาว่าง 15:15–17:35 (ยังไม่ได้ใส่แผน)" },
    { time: "17:43", from: "Motohakone-ko", to: "Odawara Station", mode: "transit", note: "รถบัส Izuhakone" },
    { time: "18:51", from: "Odawara Station", to: "Kayabacho Station", mode: "transit", note: "Odakyu 快速急行 → Yoyogi-Uehara → Chiyoda Line → Otemachi → Tozai ถึง 20:49" },
  ],
  "14": [
    { time: "06:08", from: "Kayabacho Station", to: "Shinjuku Station", mode: "transit", note: "Tozai → Kudanshita → Toei Shinjuku Line" },
    { from: "Shinjuku Station", to: "Busta Shinjuku", mode: "walking", note: "ถึงก่อน 06:45 ชั้น 4 เหนือทางออกใต้" },
    { time: "06:55", from: "Busta Shinjuku", to: "Kawaguchiko Station", mode: "transit", note: "รถบัสทางด่วน Fujikyu ต้องจองที่นั่ง" },
    { time: "09:00", from: "Kawaguchiko Station", to: "Kawaguchiko Station", via: "Lawson Kawaguchiko Station-mae|Kawaguchiko Ohashi Bridge|Nagasaki Park Fujikawaguchiko|Oishi Park Fujikawaguchiko|Yagisaki Park", mode: "driving", note: "เส้นปั่นจักรยานรอบทะเลสาบตามคลิป (ราว 20 กม. Google Maps ไม่มีโหมดจักรยานในญี่ปุ่น)" },
    { time: "15:10", from: "Kawaguchiko Station", to: "Busta Shinjuku", mode: "transit", note: "รถบัสทางด่วน Fujikyu ป้าย 3" },
    { time: "17:18", from: "Shinjuku Station", to: "Takadanobaba Station", mode: "transit", note: "JR Yamanote ชานชาลา 15" },
    { from: "Takadanobaba Station", to: SHIMAMURA, mode: "walking", note: "ทางออก Toyama 1 นาที" },
    { time: "18:38", from: "Takadanobaba Station", to: "Shimokitazawa Station", mode: "transit", note: "JR Yamanote → Shinjuku → Odakyu 18:50" },
    { time: "20:31", from: "Shimokitazawa Station", to: "Suitengumae Station", mode: "transit", note: "Keio Inokashira → Shibuya → Hanzomon Line" },
    { from: "Suitengumae Station", to: HOTEL_TOKYO, mode: "walking", note: "340 ม." },
  ],
  "15": [
    { from: HOTEL_TOKYO, to: "Ningyocho Station", mode: "walking", note: "รับกระเป๋า 12:50 เดินราว 10 นาที (ยังไม่ได้เช็ก)" },
    { time: "13:07", from: "Ningyocho Station", to: "Narita Airport Terminal 1 Station", mode: "transit", note: "Toei Asakusa Line 快速 成田空港行 วิ่งต่อ Keisei Main Line ไม่ต้องเปลี่ยนรถ" },
  ],
};

// ลิงก์สถานที่ที่เพิ่มจากคอลัมน์ F ของ Main
const extraPlaces: Record<string, MapLink[]> = {
  "9": [{ name: "Suvarnabhumi Airport", url: placeUrl("Suvarnabhumi Airport") }],
  "10": [{ name: HOTEL_FUJISAWA, url: placeUrl(HOTEL_FUJISAWA) }],
  "11": [{ name: "Morito Beach", url: placeUrl("Morito Beach Hayama") }],
  "12": [{ name: HOTEL_TOKYO, url: placeUrl(HOTEL_TOKYO) }],
  "13": [
    { name: "Motohakone-ko", url: placeUrl("Motohakone-ko") },
    { name: "Odawara Station", url: placeUrl("Odawara Station") },
  ],
  "14": [{ name: "Busta Shinjuku", url: placeUrl("Busta Shinjuku") }],
  "15": [
    { name: "Nihonbashi Mitsukoshi (depachika)", url: placeUrl("Nihonbashi Mitsukoshi Main Store") },
    { name: "COREDO Muromachi", url: placeUrl("COREDO Muromachi") },
    { name: "Ningyocho Amazake Yokocho", url: placeUrl("Ningyocho Amazake Yokocho") },
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
    place: `ออกเดินทางจากกรุงเทพตอนค่ำ: TG682 BKK 22:45 → HND T3 06:55 (10 มิ.ย.)`,
    howto: `การบินไทย บินตรงจากสุวรรณภูมิ กระเป๋าโหลดรวมในตั๋ว 1 ใบต่อคน`,
    rain: "-",
    rainStat: "-",
    maps: [],
    costs: [],
    board: `สนามบินสุวรรณภูมิ (BKK) เคาน์เตอร์การบินไทย`,
    details: "",
    checklist: `ก่อนเดินทาง
☐ พาสปอร์ตทั้งสองคน และตั๋ว TG682 / TG677
☐ จองที่พัก 2 ที่: Fujisawa 2 คืน (10–11 มิ.ย. เลือก Smile Hotel Shonan Fujisawa ไว้ก่อน) และ Almont Inn Nihonbashi 3 คืน (12–14 มิ.ย. เลือกไว้ก่อน ห้องเตียงใหญ่ 14 ตร.ม. ยกเลิกฟรี รวมอาหารเช้า 7,205 บาท ตัวเลือกสำรองคือ APA Hotel Ueno Ekimae 8,442 บาท)
☐ เช็กตั๋วคอนเสิร์ต Radiohead: ออกตั๋วแบบไหน (แอปหรือกระดาษ) ต้องใช้เบอร์โทรญี่ปุ่นไหม ชื่อบนตั๋วต้องตรงกับบัตรประจำตัวไหม และโอนให้แฟนได้ไหม
☐ ลงทะเบียน Visit Japan Web (ข้อมูล ตม. และศุลกากร) ให้ได้ QR code ไว้ใช้ที่ Haneda ช่วยให้ทันรถไฟ 08:04 (ยังไม่ได้เช็กกฎปี 2027)
☐ บัตร IC: ใช้ iPhone เพิ่ม Suica ใน Apple Wallet และเติมเงินด้วยบัตรเครดิตได้ ใช้ Android ให้ซื้อ Welcome Suica ที่ Haneda
☐ eSIM หรือแพ็กเกจเน็ตญี่ปุ่น (ต้องเปิดแผนที่และเช็กเวลารถทั้งทริป)
☐ แลกเงินเยนสด พกติดตัวราว 5,000–10,000 เยนต่อคนต่อวัน (ค่าประมาณ) ร้านเล็กที่ Hayama, Kawaguchiko และตลาดนัดหลายร้านรับแต่เงินสด
☐ ประกันเดินทาง (เที่ยวบินล่าช้า กระเป๋าหาย ค่ารักษาพยาบาล)

ตัวเลือกที่พักที่เจอ (ราคาบน Trip.com)
• Fujisawa: Smile Hotel Shonan Fujisawa (ทางออกใต้ของสถานี Fujisawa เดิน 2–5 นาที) 3,572 บาทสำหรับ 2 คืน 2 คน เมื่อ 13 ต.ค. 2026 ตัวเลือกสำรองคือ Sotetsu Fresa Inn Kamakura-Ofuna สาขา Higashiguchi 4,608 บาท
• โตเกียว 3 คืน (เช็ก 23 ต.ค. 2026): Almont Inn Nihonbashi ห้อง 14 ตร.ม. 7,205 บาท (เลือกไว้ก่อน), APA Hotel Ueno Ekimae 8,442 บาท (ติดสถานี Ueno รถตรงทุกเที่ยว ห้อง 11 ตร.ม.), Tosei Hotel Cocone Ueno 10,781 บาท, Hotel Resol Ueno 13,249 บาท (ห้อง 15 ตร.ม.)

วันนี้
☐ กระเป๋าโหลดคนละ 1 ใบ รวมในตั๋วแล้ว
☐ ถึงสุวรรณภูมิเผื่อเวลาก่อนเครื่องออก 22:45`,
  },
  {
    slug: "10",
    date: "2027-06-10 (พฤหัส)",
    short: "10 มิ.ย. พฤหัส",
    title: "ถึง Haneda · เส้นชายทะเล Enoden",
    stay: "Smile Hotel Shonan Fujisawa (คืนที่ 1/2)",
    accent: "sky",
    place: `ถึง Haneda T3 06:55 นั่ง Keikyu + JR ไป Fujisawa ถึงราว 09:00 ฝากกระเป๋าที่โรงแรม กินข้าวเช้า
10:30–17:35: เส้นชายทะเล Enoden แบบไม่เร่งหลังบินข้ามคืน ข้าวเที่ยงที่ Cafe Yoridokoro: ทางข้ามรถไฟ Slam Dunk ที่ Kamakurakokomae และ Koshigoe Rakko Park ที่อยู่ติดกัน, เดินเลียบหาด Shichirigahama (ริมหาดคามาคุระ), Cafe Yoridokoro ริมราง Enoden ที่ Inamuragasaki, ศาลเจ้า Goryo (ดอกไฮเดรนเยียกับ Enoden), ถนนคนเดินย่านพระไดบุตสึ, พระใหญ่ Kotoku-in และ KANNON COFFEE แถว Hase
เย็น: กลับ Fujisawa เช็กอิน
พัก Fujisawa ที่ Smile Hotel Shonan Fujisawa (คืนที่ 1 จาก 2)`,
    howto: `เครื่องลง Haneda T3 06:55 ผ่าน ตม. รับกระเป๋า ซื้อหรือเติมบัตร IC เผื่อราว 1 ชม.
08:04 Keikyu Airport Line (Express) Haneda Airport Terminal 3 → 08:31 Yokohama ไม่ต้องเปลี่ยนรถ
08:41 JR Tokaido Line → 09:01 Fujisawa
(Haneda T3 → Fujisawa 803 เยน เปลี่ยนรถ 1 ครั้ง ราว 1 ชม. รอบสำรอง: Keikyu 08:40 → Yokohama 09:11 → JR 09:18 → Fujisawa 09:43)
09:15 ฝากกระเป๋าที่โรงแรม กินข้าวเช้าและพักแถวสถานี Fujisawa
10:30 Enoden Fujisawa → 10:47 Kamakurakokomae ไม่ต้องเปลี่ยนรถ ทางข้ามรถไฟอยู่ห่างสถานี 3 นาที Koshigoe Rakko Park อยู่ติดทางข้าม
11:30 เดินเลียบทะเลไป Shichirigahama 1 สถานี เดินเล่นที่หาดถึงราว 12:35
12:42 Enoden Shichirigahama → 12:49 Inamuragasaki เดิน 3–5 นาทีถึง Cafe Yoridokoro กินข้าวเที่ยง (เปิด 07:00–18:00 ปิดวันอังคาร คิวมักยาว)
14:41 Enoden Inamuragasaki → 14:47 Hase
14:50 เดินไปศาลเจ้า Goryo ใกล้สถานี (ราว 300 ม. ยังไม่ได้เช็กเวลาเดิน) ทางข้ามรถไฟหน้าโทริอิเป็นจุดถ่ายรูป Enoden กับดอกไฮเดรนเยีย ราว 15:15 เดินกลับมาทางสถานี Hase
เดินถนนคนเดินหน้าพระใหญ่ 7 นาทีถึง Kotoku-in (เปิดถึง 17:30) แล้วแวะ KANNON COFFEE
17:35 Enoden Hase → 18:07 Fujisawa ไม่ต้องเปลี่ยนรถ (ถ้าเหนื่อยกลับรอบก่อนหน้าได้)
หมายเหตุ: Enoden ออกทุก 14 นาที ใช้บัตร Noriorikun (เลือกไว้ก่อน) ขึ้นลงได้ไม่จำกัด ถ้าเหนื่อยนั่ง Enoden จาก Kamakurakokomae ไป Shichirigahama แทนเดินได้โดยไม่จ่ายเพิ่ม`,
    rain: `ฝนปรอย: ไปตามแผน พกร่ม ถ้าทะเลมองไม่เห็นให้ข้าม Kamakurakokomae, Koshigoe Rakko Park และ Shichirigahama นั่ง Enoden จาก Fujisawa ตรงไป Inamuragasaki (Cafe Yoridokoro อยู่ในร่ม) และ Hase ดูพระใหญ่
ฝนหนักหรือเหนื่อยจากบินข้ามคืน: พักที่ Fujisawa แล้วย้ายเส้นชายทะเลไปบ่ายวันที่ 11 แทน Hayama
ถ้าช้ากว่าแผน ตัดตามลำดับ: KANNON COFFEE, เวลาที่หาด Shichirigahama`,
    rainStat: "ฝน 2/5",
    maps: [
      { name: "Kamakurakokomae Crossing", url: m("Kamakurakokomae%20Crossing%20Kanagawa") },
      { name: "Koshigoe Rakko Park", url: m("%E8%85%B0%E8%B6%8A%E3%83%A9%E3%83%83%E3%82%B3%E5%85%AC%E5%9C%92") },
      { name: "Shichirigahama Beach", url: m("Shichirigahama%20Beach%20Kanagawa") },
      { name: "Cafe Yoridokoro (Inamuragasaki)", url: m("%E3%83%A8%E3%83%AA%E3%83%89%E3%82%B3%E3%83%AD%20%E7%A8%B2%E6%9D%91%E3%83%B6%E5%B4%8E") },
      { name: "Goryo Shrine (御霊神社)", url: m("%E5%BE%A1%E9%9C%8A%E7%A5%9E%E7%A4%BE%20%E9%8E%8C%E5%80%89") },
      { name: "Kotoku-in Great Buddha", url: m("Kotoku-in%20Great%20Buddha%20Kanagawa") },
      { name: "KANNON COFFEE kamakura", url: m("KANNON%20COFFEE%20kamakura%20Kanagawa") },
    ],
    costs: [
      { name: "Haneda T3 → Fujisawa: Keikyu Airport Line ถึง Yokohama 363 + JR Tokaido Line 440", type: "ค่าเดินทาง", yen: 803, status: "เช็กแล้ว", source: "transit.yahoo.co.jp" },
      { name: "รวมใน Noriorikun: Enoden Fujisawa → Kamakurakokomae (ตั๋วปกติ 260)", type: "ค่าเดินทาง", yen: 0, status: "เช็กแล้ว", source: "transit.yahoo.co.jp" },
      { name: "รวมใน Noriorikun: Enoden Shichirigahama → Inamuragasaki แวะ Cafe Yoridokoro (ตั๋วปกติ 200)", type: "ค่าเดินทาง", yen: 0, status: "เช็กแล้ว", source: "transit.yahoo.co.jp" },
      { name: "รวมใน Noriorikun: Enoden Inamuragasaki → Hase (ตั๋วปกติ 200)", type: "ค่าเดินทาง", yen: 0, status: "เช็กแล้ว", source: "transit.yahoo.co.jp" },
      { name: "พระใหญ่ Kamakura (Kotoku-in)", type: "ค่าเข้า", yen: 300, status: "เช็กแล้ว", source: "kotoku-in.jp" },
      { name: "รวมใน Noriorikun: Enoden Hase → Fujisawa (ตั๋วปกติ 310)", type: "ค่าเดินทาง", yen: 0, status: "เช็กแล้ว", source: "transit.yahoo.co.jp" },
      { name: "บัตร Enoden 1 วัน Noriorikun (เลือกไว้ก่อน) แทนตั๋ว 4 เที่ยว 260 + 200 + 200 + 310 = 970 ประหยัด 170 ขึ้นลงได้ไม่จำกัดทั้งสาย ซื้อที่ตู้ขายตั๋วสถานี Enoden Fujisawa หรือแบบดิจิทัล", type: "ค่าเดินทาง", yen: 800, status: "เช็กแล้ว", source: "enoden.co.jp (ราคาปี 2026 ตั๋วปกติจาก transit.yahoo.co.jp)" },
      { name: "ทางข้ามรถไฟ Kamakurakokomae, Koshigoe Rakko Park, หาด Shichirigahama และถนนคนเดินหน้าพระใหญ่ (ฟรี)", type: "ค่าเข้า", yen: 0, status: "เช็กแล้ว" },
    ],
    board: `1. Haneda T3: ผ่าน ตม. แล้วเดินไปสถานี Keikyu ในอาคาร T3 ซื้อหรือเติมบัตร IC (Suica / PASMO) ขึ้น Keikyu Airport Line (Express) ขบวนไป Kanazawa-Bunko 08:04 ชานชาลา 2 ไม่ต้องเปลี่ยนรถถึง Yokohama (ถ้าขึ้นขบวนไป Inzai Nihon-Idai ต้องลงเปลี่ยนที่ Tenkubashi)
2. Yokohama: ลง 08:31 ชานชาลา 1 เดินไป JR ชานชาลา 6 ขึ้น JR Tokaido Line ขบวนไป Odawara 08:41 ลง Fujisawa 09:01 (รอบสำรอง: Keikyu 08:40 ขบวนไป Zushi·Hayama ถึง Yokohama 09:11 ต่อ JR Tokaido 09:18 ถึง Fujisawa 09:43)
3. Fujisawa: ฝากกระเป๋าที่ Smile Hotel Shonan Fujisawa (ฝั่งทางออกใต้) กินข้าวเช้าและพักแถวสถานี
4. Fujisawa สถานี Enoden (ฝั่งทางออกใต้): ขึ้น Enoden ขบวนไป Kamakura 10:30 (รอบถัดไป 10:44 และ 10:58)
5. นั่ง Enoden 17 นาที ไม่ต้องเปลี่ยนรถ ลง Kamakurakokomae 10:47
6. Kamakurakokomae: ทางข้ามรถไฟอยู่ห่างสถานี 3 นาที Koshigoe Rakko Park อยู่ติดทางข้าม (ห่างสถานีราว 130 เมตร) แล้วเดินเลียบทะเลไปสถานี Shichirigahama (ยังไม่ได้เช็กเวลาเดิน เผื่อไว้ 15 นาที) หาดอยู่ห่างสถานี 3 นาที
7. Shichirigahama: ขึ้น Enoden ขบวนไป Kamakura 12:42 ลง Inamuragasaki 12:49 (รอบถัดไป 12:56 และ 13:10) เดิน 3–5 นาทีถึง Cafe Yoridokoro อยู่ข้างทางข้ามรถไฟ กินข้าวเที่ยง
8. Inamuragasaki ชานชาลา 2: ขึ้น Enoden ขบวนไป Kamakura 14:41 ลง Hase 14:47 (รอบถัดไป 14:55 และ 15:09) เดินถนนคนเดินหน้าพระใหญ่ 7 นาทีถึง Kotoku-in
9. Hase: ขึ้น Enoden ขบวนไป Fujisawa 17:35 ลงปลายทาง Fujisawa 18:07 (รอบถัดไป 17:49 ถึง 18:21) ขึ้นฝั่งตรงข้ามกับขบวนไป Kamakura
10. Fujisawa: เดินกลับ Smile Hotel Shonan Fujisawa เช็กอิน`,
    details: `• Enoden: รถไฟสายเล็กจาก Fujisawa ถึง Kamakura วิ่งผ่านย่านบ้านคนแล้วออกเลียบทะเลช่วง Koshigoe ถึง Inamuragasaki จาก Fujisawa ถึง Kamakurakokomae 17 นาที
• ทางข้ามรถไฟ Kamakurakokomae: ฉากเปิดของอนิเมะ Slam Dunk เห็นรถไฟ Enoden วิ่งผ่านหน้าทะเล Shonan และเกาะ Enoshima คนเยอะ มีเจ้าหน้าที่คุม ห้ามยืนถ่ายรูปบนถนน
• Koshigoe Rakko Park (腰越ラッコ公園): สวนเล็กๆ ติดทางข้ามรถไฟ Slam Dunk มองเห็นทางข้าม รถไฟ Enoden และทะเลจากในสวน ใช้เป็นที่ยืนถ่ายรูปแทนการยืนบนถนนได้ เข้าฟรี
• หาด Shichirigahama (ริมหาดคามาคุระในบล็อก paikondieow: หาดทรายสีดำ เห็นฟูจิไกลๆ ในวันฟ้าเปิด): หาดยาวเลียบทางรถไฟ Enoden มองเห็นเกาะ Enoshima นักโต้คลื่นเยอะ มีคาเฟ่และร้านอาหารริมทะเล บล็อกในแท็บ kanagawa แนะนำช่วงพระอาทิตย์ตก (กลาง มิ.ย. พระอาทิตย์ตกราว 19:00 ตามแผนนี้ไม่ได้อยู่รอ)
• Cafe Yoridokoro (ヨリドコロ สาขา Inamuragasaki): ร้านอาหารและคาเฟ่ในบ้านไม้เก่าสมัยไทโช อยู่ข้างทางข้ามรถไฟ นั่งริมหน้าต่างหรือบาร์ด้านนอกจะเห็นรถไฟ Enoden สีเขียววิ่งผ่านหน้าร้าน ขึ้นชื่อเรื่องชุดปลาตากแห้งย่าง (ราคาบนเว็บมีตั้งแต่ราว 1,000 ถึง 1,600 เยน ยังไม่ได้ยืนยัน) และไข่สดตีฟูราดข้าว เปิด 07:00–18:00 ปิดวันอังคาร รับออร์เดอร์สุดท้ายราว 17:00–17:30 คิวมักยาว
• ถนนคนเดินย่านพระไดบุตสึ: ถนนจากสถานี Hase ขึ้นไปพระใหญ่ เดินราว 7 นาที สองข้างทางเป็นร้านของกิน ของฝาก ร้านเซรามิก และคาเฟ่ บล็อก paikondieow แนะนำร้านเซรามิกและมุมดอกไม้ตามกำแพง
• ศาลเจ้า Goryo (御霊神社): ศาลเจ้าเล็กใกล้สถานี Hase คนไม่ค่อยเยอะ ทางข้ามรถไฟอยู่หน้าโทริอิ ช่วงดอกไฮเดรนเยียบานถ่ายรูป Enoden ออกจากอุโมงค์ผ่านดอกไม้ได้ (ปกติ Kamakura ดอกบานช่วงต้นถึงกลาง มิ.ย. ยังไม่ได้เช็กปี 2027) มีโพสต์บอกว่าห้ามถ่ายรูปในบริเวณศาลเจ้า ให้ถ่ายจากทางข้าม ค่าเข้ายังไม่ได้เช็ก (รีวิวไม่พูดถึงค่าเข้า)
• พระใหญ่ Kotoku-in: พระพุทธรูปอมิตาภะสำริด สมบัติของชาติ เริ่มหล่อปี 1252 สูงราว 11.3 เมตร หนักราว 121 ตัน วิหารที่เคยคลุมถูกพายุและสึนามิพัดไปตั้งแต่ศตวรรษที่ 15 จึงนั่งกลางแจ้ง เข้าไปดูข้างในองค์พระได้ จ่ายเพิ่ม 50 เยนเป็นเงินสด (ยังไม่ได้เช็กซ้ำว่ายังเปิด)
• KANNON COFFEE kamakura: คาเฟ่เล็กแถว Hase ขึ้นชื่อเรื่องเครปและคุกกี้รูปพระใหญ่
• Fujisawa: เมืองใหญ่ของย่าน Shonan เป็นต้นสาย Enoden และจุดตัดของ JR Tokaido Line กับ Odakyu มีห้างและร้านอาหารรอบสถานีทั้งสองฝั่ง`,
    checklist: `ต้องจองล่วงหน้า
☐ Smile Hotel Shonan Fujisawa 2 คืน (10–11 มิ.ย.) เช็กอิน 15:00 ถามว่าฝากกระเป๋าก่อนเช็กอินได้ไหม (ถึงราว 09:15)
☐ Cafe Yoridokoro: ถามร้านว่าจองที่นั่งริมหน้าต่างหรือบาร์ด้านนอกได้ไหม โทร 0467-40-5737 (บางแหล่งบอกว่าจองไม่ได้ ต้องต่อคิว บางแหล่งบอกว่าเริ่มรับจองที่นั่งเคาน์เตอร์ตั้งแต่ ก.ย. 2024)

พกไป
☐ บัตร Enoden 1 วัน Noriorikun 800 เยน (เลือกไว้ก่อน) ซื้อที่ตู้ขายตั๋วสถานี Enoden Fujisawa ก่อนขึ้นขบวน 10:30 หรือซื้อแบบดิจิทัล ขึ้นลง Enoden ได้ไม่จำกัดทั้งวัน
☐ ซื้อหรือเติมบัตร IC (Suica / PASMO) ที่ Haneda ใช้กับ Keikyu และ JR ค่ารถและค่าเข้าวันนี้ 1,903 เยนต่อคน (ไม่รวมค่าอาหารที่ Cafe Yoridokoro และ KANNON COFFEE)
☐ เงินสดสำหรับค่าเข้าพระใหญ่และคาเฟ่ (ยังไม่ได้เช็กว่ารับบัตรไหม)
☐ ร่มพับ

เวลา
☐ ต้องออกจาก Inamuragasaki ไม่เกิน 16:05 เพื่อเข้าพระใหญ่ก่อนปิด 17:30 (แผนออก 14:41)

ระวัง
☐ ขาไปลง Haneda T3 ไม่ใช่ Narita ที่สถานี Keikyu ดูปลายทางขบวน ขบวนไป Kanazawa-Bunko หรือ Zushi·Hayama ถึง Yokohama ไม่ต้องเปลี่ยนรถ
☐ ที่ทางข้ามรถไฟ Slam Dunk ห้ามยืนถ่ายรูปบนถนน

ยังไม่ได้เช็ก
☐ เวลาผ่าน ตม. ที่ Haneda T3 ช่วงเช้า (แผนเผื่อไว้ราว 1 ชม.)
☐ เวลาเดิน Kamakurakokomae ไป Shichirigahama และระยะเดินจริงจาก Smile Hotel ไปสถานี Fujisawa (แหล่งข้อมูลบอก 2–5 นาที)
☐ เวลาปิดของ KANNON COFFEE และราคาเมนูของ Cafe Yoridokoro`,
  },
  {
    slug: "11",
    date: "2027-06-11 (ศุกร์)",
    short: "11 มิ.ย. ศุกร์",
    title: "Kamakura ศาลเจ้า · Hayama",
    stay: "Smile Hotel Shonan Fujisawa (คืนที่ 2/2)",
    accent: "violet",
    place: `เช้า: Kamakura ฝั่งศาลเจ้าและเมืองเก่า: 09:30 ศาลเจ้า Tsurugaoka Hachimangu
10:30 กินข้าวและเดินถนน Komachi-dori
บ่าย: Hayama: ราว 14:00 ศาลเจ้า Morito Daimyojin และหาด Morito, ของกินเล่นและคาเฟ่ย่าน Morito (Asahiya, Misaki Donuts, SOSO HAYAMA), หาด Suwa, Hayama Marina
เย็น: กลับ Fujisawa
พัก Fujisawa ที่ Smile Hotel Shonan Fujisawa (คืนที่ 2 จาก 2)`,
    howto: `09:02 JR Tokaido Line Fujisawa → Ofuna 1 สถานี
09:12 JR Shonan-Shinjuku Line Ofuna → 09:18 Kamakura (รอบถัดไป ออก Fujisawa 09:09 ถึง 09:28)
เดินจากสถานี Kamakura ไปศาลเจ้า Tsurugaoka Hachimangu ราว 10 นาที แล้วเดินกลับลงมาทาง Komachi-dori
13:24 JR Yokosuka Line Kamakura (ชานชาลา 1) → 13:30 Zushi
13:40 รถบัส Keikyu สาย 逗12 ขบวนไป 葉山 ป้าย 3 ทางออกตะวันออก → 13:55 Morito Jinja (森戸神社) 280 เยน (ถ้าพลาด รอบถัดไป 14:00 ถึง 14:15)
ราว 14:00 เดินเที่ยวจากศาลเจ้า Morito ถึง Hayama Marina ตามเส้นทางในลิงก์ visitkanagawa (แท็บ Hayama) ราว 2.5 ชม.
18:17 รถบัส Keikyu 逗12 ป้าย Abuzuri (鐙摺) ใกล้ Hayama Marina → 18:30 Zushi 250 เยน
18:41 JR Yokosuka Line Zushi → 18:51 Ofuna เปลี่ยนเป็น JR 18:55 → 18:59 Fujisawa (เผื่อเวลาเปลี่ยนรถ 11 นาที ถ้ารถบัสถึงเร็วขึ้นรอบ 18:34 ได้ ถึง 18:56)
หมายเหตุ: เวลาและค่ารถบัสเช็กกับ Yahoo Transit ตารางวันศุกร์ 30 ต.ค. 2026 แล้ว (24 ต.ค. 2026 ปรับให้ออกจาก Kamakura เร็วขึ้น 10 นาทีเพื่อได้เวลาที่ Hayama เพิ่ม)
หมายเหตุ: ตัดวัด Meigetsu-in ออก (ผู้ใช้สั่ง 18 ต.ค. 2026) จึงไม่ต้องออกเช้าและไม่ต้องลงที่ Kita-Kamakura เวลารถเป็นตารางวันศุกร์เดือน ต.ค. 2026`,
    rain: `ฝนปรอย: ไปตามแผน พกร่มและรองเท้ากันลื่น
ฝนหนัก: เที่ยวแค่ครึ่งเช้า (ศาลเจ้า Tsurugaoka Hachimangu, Komachi-dori) ตัด Hayama ออกเพราะเป็นทางเดินริมทะเลกลางแจ้งทั้งหมด`,
    rainStat: "ฝน 2/5",
    maps: [
      { name: "Tsurugaoka Hachimangu", url: m("Tsurugaoka%20Hachimangu%20Kanagawa") },
      { name: "Komachi-dori", url: m("Komachi-dori%20Kanagawa") },
      { name: "Morito Daimyojin", url: m("Morito%20Daimyojin%20Kanagawa") },
      { name: "Hayama Marina", url: m("Hayama%20Marina%20Kanagawa") },
    ],
    costs: [
      { name: "JR Fujisawa → Kamakura (เปลี่ยนรถที่ Ofuna)", type: "ค่าเดินทาง", yen: 209, status: "เช็กแล้ว", source: "transit.yahoo.co.jp (ตารางวันศุกร์ 16 ต.ค. 2026)" },
      { name: "JR Kamakura → Zushi", type: "ค่าเดินทาง", yen: 199, status: "เช็กแล้ว", source: "transit.yahoo.co.jp" },
      { name: "รถบัส Keikyu 逗12 สถานี Zushi → Morito Jinja (280) + Abuzuri → Zushi (250)", type: "ค่าเดินทาง", yen: 530, status: "เช็กแล้ว", source: "transit.yahoo.co.jp (ตารางวันศุกร์ 30 ต.ค. 2026)" },
      { name: "JR Zushi → Fujisawa (เปลี่ยนรถที่ Ofuna)", type: "ค่าเดินทาง", yen: 253, status: "เช็กแล้ว", source: "transit.yahoo.co.jp" },
      { name: "ศาลเจ้า Tsurugaoka Hachimangu, ศาลเจ้า Morito และชายหาด Hayama (ฟรี)", type: "ค่าเข้า", yen: 0, status: "ประมาณ", source: "ศาลเจ้า Morito ยังไม่ได้ยืนยันว่าไม่เก็บค่าเข้า" },
    ],
    board: `1. Fujisawa ชานชาลา 3: ขึ้น JR Tokaido Line (Ueno-Tokyo Line) ขบวนไป Takasaki 09:02 ลง Ofuna 09:06 (ถึงชานชาลา 1/2) เดินไปชานชาลา 7/8 ขึ้น JR Shonan-Shinjuku Line ขบวนไป Zushi 09:12 ลง Kamakura 09:18 ชานชาลา 1 (รอบถัดไป ออก Fujisawa 09:09 เปลี่ยนเป็น JR Yokosuka 09:22 ถึง 09:28)
2. Kamakura ทางออกตะวันออก: เดินไปศาลเจ้า Tsurugaoka Hachimangu ราว 10 นาที
3. จากศาลเจ้าเดินถนน Komachi-dori ลงมาถึงสถานี Kamakura ราว 10 นาที
4. Kamakura ชานชาลา 1: ขึ้น JR ขบวนไป Zushi 13:24 ลง Zushi 13:30 (ถ้าพลาด ขึ้น 13:34 แล้วต่อรถบัสรอบ 14:00)
5. สถานี Zushi ทางออกตะวันออก ป้ายรถบัส 3: ขึ้นรถบัส Keikyu สาย 逗12 ขบวนไป 葉山 13:40 ลงป้าย Morito Jinja (森戸神社) 13:55 280 เยน รถผ่านป้าย Abuzuri, Hayama Marina และ Morito Kaigan ก่อนถึง
6. เดินเที่ยวย้อนขึ้นเหนือ: ศาลเจ้า Morito → หาด Morito → Asahiya (5 นาที) → Misaki Donuts (2 นาที) → SOSO HAYAMA (2 นาที) → Genbe (3 นาที) → หาด Suwa → Hayama Marina
7. ป้าย Abuzuri (鐙摺) ใกล้ Hayama Marina: ขึ้นรถบัส 逗12 ขบวนไปสถานี Zushi 18:17 ถึง 18:30 250 เยน
8. Zushi ชานชาลา 3: ขึ้น JR Yokosuka 18:41 ลง Ofuna 18:51 เปลี่ยนเป็น JR ขบวนไป Odawara 18:55 ลง Fujisawa 18:59 (ถ้าทันรอบ 18:34 ถึง 18:56 รอบหลังสุดที่สบาย 18:49 ถึง 19:10)`,
    details: `• ศาลเจ้า Tsurugaoka Hachimangu: ศาลเจ้าสำคัญที่สุดของ Kamakura ก่อตั้งปี 1063 Minamoto no Yoritomo ย้ายมาที่ปัจจุบันปี 1180 ขึ้นบันไดหิน 61 ขั้นไปอาคารหลักแล้วมองลงมาเห็นถนน Wakamiya Oji ยาวไปถึงทะเล สองข้างทางเข้าเป็นสระ Genpei เข้าฟรี
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
☐ บัตร IC ใช้ได้ทั้ง JR และรถบัส Keikyu ค่ารถวันนี้ 1,191 เยนต่อคน
☐ เงินสด ของกินเล่นร้านเล็กที่ Hayama (ยังไม่ได้เช็กว่ารับบัตรไหม)
☐ ร่มพับและรองเท้าที่เดินสบาย กันลื่น

เวลา
☐ ออกจาก Fujisawa 09:02 เปลี่ยนรถที่ Ofuna ขึ้นขบวน 09:12 ถึง Kamakura 09:18
☐ JR Kamakura 13:24 → Zushi ต่อรถบัส 逗12 รอบ 13:40 ป้าย 3 ทางออกตะวันออก ขากลับรถบัส Abuzuri 18:17
☐ ศาลเจ้า Morito ปิด 17:00 ควรถึง Hayama ไม่เกิน 15:00

ยังไม่ได้เช็ก
☐ วันหยุดและเวลาเปิดของ Asahiya, Misaki Donuts, SOSO HAYAMA`,
  },
  {
    slug: "12",
    date: "2027-06-12 (เสาร์)",
    short: "12 มิ.ย. เสาร์",
    title: "ตลาดนัด Ohi · คอนเสิร์ต Radiohead",
    stay: "Almont Inn Nihonbashi (คืนที่ 1/3)",
    accent: "rose",
    place: `เช้า: เช็กเอาต์จาก Fujisawa นั่ง JR ไป Shimbashi ต่อ Toei Asakusa Line ไป Ningyocho แล้วเดินไปฝากกระเป๋าที่ Almont Inn Nihonbashi แล้วไปตลาดนัด Tokyo City Flea Market ที่สนามแข่งม้า Ohi (เลือกไว้ก่อน เปิดเฉพาะเสาร์อาทิตย์ งดถ้าฝนตก) ไม่ต้องลากกระเป๋าไปตลาด
เที่ยง: กลับโรงแรม กินข้าวเที่ยงแถว Nihonbashi / Ningyocho
15:00–16:00 เช็กอินโรงแรม อาบน้ำ งีบในห้อง
16:11 ออกไป Saitama-Shintoshin (เปลี่ยนรถที่ Ueno)
คอนเสิร์ต Radiohead @ GMO ARENA saitama 18:00 JST (เปิดประตู 15:30 เลิกราว 20:05–20:30 เป็นค่าประมาณ)
หลังคอนเสิร์ต: นั่งรถไฟกลับ Kayabacho (เปลี่ยนที่ Ueno) ถึงราว 21:30–22:45
พัก Almont Inn Nihonbashi (คืนที่ 1 จาก 3 เลือกไว้ก่อน)`,
    howto: `08:01 เช็กเอาต์ Fujisawa ขึ้น JR Tokaido Line (Ueno-Tokyo Line) ขบวนไป Ueno → 08:46 Shimbashi (ชานชาลา 2)
08:57 Toei Asakusa Line ขบวนไป Inzai-Makinohara → 09:04 Ningyocho (เปลี่ยนรถ 1 ครั้ง ทั้งหมด 1 ชม. 3 นาที 1,080 เยน) เดินลากกระเป๋าไปโรงแรมราว 5–10 นาที (เดิมแท็กซี่จากสถานี Tokyo ผู้ใช้เปลี่ยน 24 ต.ค. 2026)
09:10 ฝากกระเป๋าที่โรงแรม เดินกลับไปสถานี Ningyocho ราว 5–10 นาที
09:32 Toei Asakusa Line → 09:41 Daimon เดินไป Hamamatsucho 7 นาที → Tokyo Monorail 09:55 → 10:03 Ōi-keibajō-mae (เปลี่ยนรถ 1 ครั้ง 31 นาที 537 เยน รอบก่อนหน้า 09:21 ถึง 09:53)
10:05–12:00 เดินตลาดนัด
12:03 Tokyo Monorail → Hamamatsucho เดินไป Daimon → Toei Asakusa 12:27 → 12:36 Ningyocho (เปลี่ยนรถ 1 ครั้ง 537 เยน)
12:40–15:00 กินข้าวเที่ยงและพักแถวโรงแรม
15:00–16:00 เช็กอินแล้วพักในห้อง (ยังไม่ได้เช็กเวลาเช็กอินของ Almont)
16:11 Hibiya Line Kayabacho → 16:20 Ueno เปลี่ยนเป็น JR Takasaki Line 16:32 → 16:54 Saitama-Shintoshin (เปลี่ยนรถ 1 ครั้ง 43 นาที)
17:00 เดินไปสนาม 3 นาที (เปิดประตู 15:30)
18:00 คอนเสิร์ต เลิกราว 20:05–20:30 (ค่าประมาณจากความยาวโชว์ทัวร์ปี 2025 ราว 2 ชม. ถึง 2 ชม. ครึ่ง)
กลับโรงแรม เลือกตามแรงที่เหลือ (ทุกแบบเปลี่ยนเป็น Hibiya Line ที่ Ueno):
• เดินจากประตู W1 ราว 20 นาทีไปสถานี Omiya ขึ้น JR ไป Ueno แล้ว Hibiya Line เช่น Omiya 20:58 ถึง Kayabacho 21:43 เลี่ยงคนแน่นที่สถานี Saitama-Shintoshin (ผมแนะนำ)
• ต่อแถวที่สถานี Saitama-Shintoshin เช่น 20:46 ถึง Kayabacho 21:31 (ยังไม่รู้ว่าต้องรอเข้าสถานีนานเท่าไร)
• นั่งกินข้าวเย็นแถว Cocoon City รอให้คนซาแล้วค่อยกลับ
เที่ยวสุดท้าย: Saitama-Shintoshin 23:15 → Ueno 23:38 → Hibiya Line 23:49 → Kayabacho 23:58 แท็กซี่ราว 10,000–13,000 เยนต่อคัน เป็นค่าประมาณ ไม่แนะนำ
หมายเหตุ: เวลารถเป็นตารางวันเสาร์เดือน ต.ค. 2026
หมายเหตุ: 23 ต.ค. 2026 เลือกไว้ก่อนให้พัก Almont Inn Nihonbashi 3 คืน (ห้องเตียงใหญ่ 14 ตร.ม.) ตัวเลือกสำรองคือ APA Hotel Ueno Ekimae (รถตรงทุกเที่ยวแต่เกินงบ)`,
    rain: `เช็กตอนเช้าก่อนออกจาก Fujisawa 08:01: ตลาดนัดงดถ้าฝนตก (ยังไม่เจอว่าประกาศงดกี่โมง ให้ดูเว็บหรือ X ของตลาดนัด) ถ้าฝนตกตั้งแต่เช้าให้ใช้แผนสำรองเลย
ทุกแบบ: ออกจาก Fujisawa สายลงได้ (เช่น 09:01) นั่ง JR ไป Shimbashi ต่อ Toei Asakusa Line ไป Ningyocho แล้วเดินไปฝากกระเป๋าที่โรงแรมเหมือนเดิม
แบบ 1 Akihabara (ผมแนะนำ ใกล้และถูก): Hibiya Line Kayabacho → Akihabara 5 นาที ไม่ต้องเปลี่ยนรถ 178 เยนต่อเที่ยว เดินร้านของมือสอง ของเล่น เกม ของสะสม ส่วนใหญ่อยู่ในตึก กินข้าวเที่ยงแถวนั้น กลับโรงแรมเช็กอิน 15:00 พักในห้อง แล้วออก 16:11 ตามเดิม
แบบ 2 ไป Saitama เร็วขึ้น: กินข้าวเที่ยงแถวโรงแรม ออกจาก Kayabacho ราว 13:00 (เส้นทางเดียวกับรอบ 16:11) เดินห้าง Cocoon City กับ Shimamura สาขา Saitama-Shintoshin (เปิดถึง 19:00) ใกล้สถานี แต่จะไม่ได้พักในห้องก่อนคอนเสิร์ต
แบบ 3 พักอย่างเดียว: กินข้าวและเดินในร่มแถว Nihonbashi (COREDO Muromachi) เช็กอิน 15:00 นอนพักจนถึง 16:11
ค่ารถ: ถูกกว่าแผนตลาดนัด (ไม่ต้องจ่ายค่ารถไป-กลับ Ohi 1,074 เยน) แบบ 1 จ่ายเพิ่มแค่ 356 เยน ค่ารถในตารางค่าใช้จ่ายยังคิดแบบไปตลาดนัด
เหนื่อยหลังตลาดนัด: กลับโรงแรมแล้วพักในห้องให้นานขึ้นตั้งแต่เช็กอินได้
ดูแล้วไม่เหมาะ: Heiwajima Antique Fair (ตลาดของเก่าในร่มใกล้ Ohi) ปี 2026 จัดแค่ มี.ค. พ.ค. ก.ย. ธ.ค. ไม่มีเดือน มิ.ย.`,
    rainStat: "ฝน 1/5",
    maps: [
      { name: "Tokyo City Flea Market (Ohi Racecourse)", url: m("Ohi+Racecourse+Flea+Market+2-1-2+Katsushima+Shinagawa") },
      { name: "Hikawa Shrine (Omiya)", url: m("Musashi+Ichinomiya+Hikawa+Shrine+Omiya") },
      { name: "Omiya Park", url: m("Omiya+Park+Saitama") },
      { name: "Cocoon City", url: m("Cocoon+City+Saitama-Shintoshin") },
      { name: "GMO ARENA saitama", url: m("Saitama+Super+Arena") },
    ],
    costs: [
      { name: "Fujisawa → Ningyocho: JR Tokaido Line (Ueno-Tokyo Line) ถึง Shimbashi แล้ว Toei Asakusa Line (เปลี่ยนรถ 1 ครั้ง เดินไปฝากกระเป๋าที่ Almont Inn Nihonbashi ราว 5–10 นาที เดิมแท็กซี่จากสถานี Tokyo รวม 1,734)", type: "ค่าเดินทาง", yen: 1080, status: "เช็กแล้ว", source: "transit.yahoo.co.jp (ตารางวันเสาร์ 24 ต.ค. 2026)" },
      { name: "Ningyocho → Ōi-keibajō-mae (ตลาดนัด): Toei Asakusa Line ถึง Daimon เดินไป Hamamatsucho แล้ว Tokyo Monorail (เปลี่ยนรถ 1 ครั้ง เดิมขึ้นที่ Kayabacho 650 เปลี่ยน 3 ครั้ง)", type: "ค่าเดินทาง", yen: 537, status: "เช็กแล้ว", source: "transit.yahoo.co.jp (ตารางวันเสาร์ 24 ต.ค. 2026)" },
      { name: "ตลาดนัด Tokyo City Flea Market ที่ Ohi Racecourse (เข้าฟรี)", type: "ค่าเข้า", yen: 0, status: "ประมาณ", source: "ยังไม่ได้ยืนยันว่าเข้าฟรี" },
      { name: "Ōi-keibajō-mae → Ningyocho: Tokyo Monorail ถึง Hamamatsucho เดินไป Daimon แล้ว Toei Asakusa Line (เปลี่ยนรถ 1 ครั้ง เดิมไป Kayabacho 603 เปลี่ยน 2 ครั้ง)", type: "ค่าเดินทาง", yen: 537, status: "เช็กแล้ว", source: "transit.yahoo.co.jp (ตารางวันเสาร์ 24 ต.ค. 2026)" },
      { name: "Kayabacho → Saitama-Shintoshin (ไปคอนเสิร์ต): Hibiya Line ถึง Ueno แล้ว JR Takasaki Line", type: "ค่าเดินทาง", yen: 706, status: "เช็กแล้ว", source: "transit.yahoo.co.jp (ตารางวันเสาร์ 24 ต.ค. 2026)" },
      { name: "Saitama-Shintoshin หรือ Omiya → Kayabacho (หลังคอนเสิร์ต): JR ถึง Ueno แล้ว Hibiya Line ราคาเท่ากันทั้งสองสถานี", type: "ค่าเดินทาง", yen: 706, status: "เช็กแล้ว", source: "transit.yahoo.co.jp (ตารางวันเสาร์ 24 ต.ค. 2026)" },
    ],
    board: `1. Fujisawa ชานชาลา 3: เช็กเอาต์ Smile Hotel ขึ้น JR Tokaido Line (Ueno-Tokyo Line) ขบวนไป Ueno 08:01 ลง Shimbashi 08:46 ชานชาลา 2
2. Shimbashi: เดินตามป้าย Toei Asakusa Line ขึ้นขบวนไป Inzai-Makinohara 08:57 ชานชาลา 2 ลง Ningyocho 09:04 ชานชาลา 4 เดินไปโรงแรม (Nihonbashi Koami-cho 4-6, Almont Inn Tokyo Nihonbashi) ราว 5–10 นาที ฝากกระเป๋าที่โรงแรม
3. เดินกลับไปสถานี Ningyocho ราว 5–10 นาที ขึ้น Toei Asakusa Line ขบวนไป Keikyu Kurihama 09:32 ลง Daimon 09:41 เดินตามป้ายไป Hamamatsucho (Tokyo Monorail) ราว 7 นาที ขึ้น Tokyo Monorail ขบวนไปสนามบิน Haneda 09:55 ลง Ōi-keibajō-mae 10:03
4. Ōi-keibajō-mae: เดินไปลานจอดรถที่ 1 ของสนามแข่งม้า Ohi ที่ตั้งตลาดนัด (ยังไม่ได้เช็กเวลาเดิน)
5. Ōi-keibajō-mae: ขึ้น Tokyo Monorail ไป Hamamatsucho 12:03 เดินไปสถานี Daimon ราว 7 นาที ขึ้น Toei Asakusa Line ขบวน 快特 ไป Keisei Takasago 12:27 ลง Ningyocho 12:36 เดินกลับโรงแรม 5–10 นาที
6. กินข้าวเที่ยงแถว Nihonbashi / Ningyocho เช็กอินโรงแรม พักในห้อง
7. Kayabacho: ขึ้น Hibiya Line ขบวนไป Ueno 16:11 ลง Ueno 16:20 เดินไป JR ชานชาลา 14 ขึ้น JR Takasaki Line ขบวนไป Takasaki 16:32 (ขบวนต้นทาง Ueno มีโอกาสได้ที่นั่ง) ลง Saitama-Shintoshin 16:54 ชานชาลา 4
8. Saitama-Shintoshin ทางออกตะวันตก: เดินตรงแล้วเลี้ยวขวาที่ Keyaki Hiroba ถึงสนาม 3 นาที ประตูที่ใกล้สุดคือ Gate C
9. หลังคอนเสิร์ต แบบที่แนะนำ: ออกประตู W1 เดินขึ้นเหนือราว 20 นาทีไปสถานี Omiya ขึ้น JR Utsunomiya / Takasaki Line ขบวนที่ไป Ueno ลง Ueno แล้วเดินไป Tokyo Metro Hibiya Line ขบวนไป Naka-Meguro ลง Kayabacho
10. ทางเลือก: กลับทางสถานี Saitama-Shintoshin ขึ้น JR ไป Ueno 22 นาที แล้ว Hibiya Line ไป Kayabacho 9 นาที
11. Kayabacho: เดินกลับโรงแรมราว 5 นาที`,
    details: `• Tokyo City Flea Market (大井競馬場フリーマーケット): ตลาดนัดของมือสองในลานจอดรถที่ 1 ของสนามแข่งม้า Ohi ที่อยู่ 2-1-2 Katsushima, Shinagawa ผู้จัดคือ 東京リサイクル運動市民の会 เปิดเกือบทุกเสาร์อาทิตย์ 09:00–15:00 (บางเว็บบอกปิด 14:30) งดถ้าฝนตก มีเสื้อผ้า ของใช้ และของเก่า ปีที่แล้วมีตารางวันเปิดรายเดือน ตารางปี 2027 ยังไม่ออก
• Almont Inn Nihonbashi: โรงแรมที่เลือกไว้ก่อน 3 คืน ห้องเตียงใหญ่ 14 ตร.ม. คะแนน 9.2 จาก 202 รีวิวบน Trip.com ฝากกระเป๋าฟรี มีเครื่องดื่มฟรีที่ชั้น 1 ย่านเงียบ สถานีใกล้: Suitengumae 340 ม. Kayabacho 350 ม. Ningyocho ราว 10 นาที
• (ไม่อยู่ในแผนแล้ว เก็บไว้เป็นตัวเลือก) ศาลเจ้า Musashi Ichinomiya Hikawa: ศาลเจ้าหลักของศาลเจ้า Hikawa ราว 280 แห่งทั่วคันโต ตามตำนานอายุกว่า 2,400 ปี จุดเด่นคือประตู romon สีแดง สะพานข้ามสระ และป่าต้นไม้ใหญ่ เข้าฟรี
• Omiya Park: สวนของจังหวัดที่เก่าที่สุดใน Saitama (เปิดปี 1885) อยู่ติดหลังศาลเจ้า มีสระน้ำ ป่าสน และสวนสัตว์เล็กเข้าฟรี

จุดพักผ่อนก่อนคอนเสิร์ต (ฟรี ยกเว้นค่าอาหาร)
• ห้องพักโรงแรม: พัก Almont Inn Nihonbashi (เลือกไว้ก่อน) พักในห้อง 15:00–16:00 ก่อนออกมาสนาม จุดพักใกล้สนามด้านล่างใช้ถ้ามาถึงเร็วหรือรอให้คนซาหลังคอนเสิร์ต
• Cocoon City: ห้างติดทางออกตะวันออก ร้านกว่า 250 ร้าน ศูนย์อาหาร 2 แห่ง ที่นั่งเยอะ คนหมุนเร็ว แม้วันมีคอนเสิร์ต
• Keyaki Hiroba: ชั้น 2 เป็นลานกลางแจ้งร่มต้นเคยากิ มีม้านั่ง ติดสนาม ชั้นล่างเป็นร้านอาหาร วันมีคอนเสิร์ตคนจะเยอะ
• Starbucks สาขา Saitama-Shintoshin Keyaki Hiroba: ใกล้สนาม มีม้านั่งด้านนอก
• Cafe Cross Yard: คาเฟ่ชั้น 5 ของ Hotel Metropolitan ในอาคารสถานี คนที่ไม่ได้พักก็เข้าได้
• สวน Saitama-Shintoshin Station Park: สนามหญ้าราว 11,000 ตร.ม. เดินจากสถานี 7 นาที
• GMO ARENA saitama: ชื่อใหม่ของ Saitama Super Arena สนามในร่ม ให้ดูเวลาเปิดประตูบนตั๋ว และเช็กกฎเรื่องขนาดกระเป๋าก่อนไป
• ตัวเลือกเพิ่ม: ร้าน Shimamura สาขา Saitama-Shintoshin สาขาใหญ่ที่สุดในญี่ปุ่น ชั้น 2 ของ Saitama Shintoshin Fashion Mall ทางออกตะวันออกเดิน 3 นาที เปิด 10:00–19:00 (ข้อมูลปี 2021) แผนหลักของ Shimamura อยู่วันที่ 14`,
    checklist: `ต้องจองล่วงหน้า
☐ Almont Inn Nihonbashi 3 คืน (12–14 มิ.ย. เลือกไว้ก่อน) ห้องเตียงใหญ่ 14 ตร.ม. แบบยกเลิกฟรีรวมอาหารเช้า 7,205 บาทบน Trip.com (เช็ก 23 ต.ค. 2026 ยกเลิกฟรีถึง 10 มิ.ย. 2027 12:00 ราคาคืนเงินไม่ได้ 6,727 บาท) หน้าเว็บบอกว่าฝากกระเป๋าฟรี ถามว่าเช็กอินได้กี่โมง แผนนี้ถึงโรงแรมราว 09:10 และใช้ห้องพักผ่อน 15:00–16:00
☐ ตั๋วคอนเสิร์ต Radiohead (เช็กว่าเป็นตั๋วกระดาษหรือตั๋วในมือถือ และต้องแสดงบัตรประจำตัวไหม)

เช็กก่อนไป
☐ ตลาดนัด Ohi เปิดวันเสาร์ 12 มิ.ย. 2027 ไหม (ดูตารางของ 東京リサイクル運動市民の会) และเช้าวันนั้นเช็กว่างดเพราะฝนไหม
☐ Smile Hotel Shonan Fujisawa เช็กเอาต์ภายใน 10:00 (วันนี้ออก 08:01)
☐ เวลาเปิดประตูบนตั๋ว (ข่าวบอกเปิด 15:30 เริ่ม 18:00)
☐ ประกาศของผู้จัดเรื่องการปล่อยคนออกจากสนามเป็นรอบ
☐ กฎขนาดกระเป๋าและของต้องห้ามของสนาม
☐ บันทึกเส้นทางเดินจากสนามไปสถานี Omiya ใน Google Maps ไว้ก่อน (ทางไม่ค่อยมีจุดสังเกต)

พกไป
☐ บัตร IC เติมเงินไว้ก่อนเข้าคอนเสิร์ต จะได้ไม่ต้องต่อแถวซื้อตั๋วขากลับ ค่ารถวันนี้ 3,566 เยนต่อคน
☐ เงินสดและเหรียญสำหรับตลาดนัด
☐ ร่มพับ (ช่วงเช้าเดินกลางแจ้ง)
☐ รถเที่ยวสุดท้ายกลับโรงแรม: Saitama-Shintoshin 23:15 (เปลี่ยนเป็น Hibiya Line ที่ Ueno 23:49)

ยังไม่ได้เช็ก
☐ ทางเดินเปลี่ยนจาก JR ไป Toei Asakusa Line ที่ Shimbashi และเส้นทางเดินจาก Ningyocho ไปโรงแรม (ลากกระเป๋าใหญ่ ดูว่ามีลิฟต์ทางไหน)
☐ เวลาเลิกคอนเสิร์ตจริง (ประมาณจากทัวร์ปี 2025 ว่าเลิกราว 20:05–20:30)
☐ เวลาเดินจากสถานี Ōi-keibajō-mae ถึงลานตลาดนัด
☐ ค่าเข้าตลาดนัด (คิดว่าฟรี)`,
  },
  {
    slug: "13",
    date: "2027-06-13 (อาทิตย์)",
    short: "13 มิ.ย. อาทิตย์",
    title: "Hakone วันเกิดแฟน",
    stay: "Almont Inn Nihonbashi (คืนที่ 2/3)",
    accent: "amber",
    place: `วันเกิดแฟน เที่ยว Hakone แบบไปเช้าเย็นกลับ
เช้า: นั่งรถไฟจาก Kayabacho ไป Odawara (Tokyo Metro + Odakyu เปลี่ยนที่ Otemachi และ Yoyogi-Uehara) ไม่ต้องขนกระเป๋า ต่อรถบัสขึ้นเขา
สาย: แวะ Owakudani หุบควันภูเขาไฟ (เลือกไว้ก่อน) แล้วนั่ง Hakone Ropeway ลงไป Togendai ริมทะเลสาบ ต่อรถบัสไป Hakone-en
เที่ยง: Hakone-en Aquarium ริมทะเลสาบ Ashi และกินข้าวเที่ยง
บ่าย: Hakone Shrine กับโทริอิริมน้ำ
ราว 15:15–17:35 เวลาว่างที่ Motohakone (รอผู้ใช้หาที่มาลง)
เย็น: รถบัสกลับ Odawara นั่งรถไฟกลับ Kayabacho ถึง 20:49
พัก Almont Inn Nihonbashi (คืนที่ 2 จาก 3 เลือกไว้ก่อน)`,
    howto: `07:50 Tozai Kayabacho → 07:53 Otemachi เปลี่ยนเป็น Chiyoda Line 08:04 → 08:23 Yoyogi-Uehara เปลี่ยนเป็น Odakyu ขบวน 快速急行 08:26 (มีเวลาเปลี่ยน 3 นาที) → 09:48 Odawara เปลี่ยนรถ 2 ครั้ง 1 ชม. 58 นาที 1,057 เยน (เผื่อเวลาถึงรถบัส 10:30 อยู่ 42 นาที ถ้าพลาดขบวน 08:26 ให้ขึ้นขบวน 08:45 ถึง 10:11 ยังทันรถบัส เดิมออก 08:13 เปลี่ยนรถที่ Yoyogi-Uehara มีเวลาแค่ 1 นาที)
10:30 รถบัส Izuhakone J03 (大涌谷経由 箱根園行) ทางออกตะวันออก ป้าย 5 → 11:19 Owakudani (รอบสำรอง 10:55 ถึง 11:44)
11:20–11:50 เดินเที่ยว Owakudani
11:53 Hakone Ropeway Owakudani → 12:23 Togendai (ผ่าน Ubako ไม่ต้องลง)
12:30 รถบัส Odakyu Togendai → 12:45 Hakone-en
12:50–13:50 Hakone-en Aquarium (เปิด 09:00–16:30 เข้าได้ถึง 16:00) และข้าวเที่ยง
14:00 รถบัส Hakone-en → 14:12 Motohakone เดินราว 10 นาทีถึง Hakone Shrine
15:15–17:35 เวลาว่างที่ Motohakone (ยังไม่ได้ใส่แผน)
17:43 รถบัส Motohakone → 18:37 Odawara
18:51 Odakyu ขบวน 快速急行 Odawara → 20:18 Yoyogi-Uehara เปลี่ยนเป็น Chiyoda Line 20:19 → 20:39 Otemachi เปลี่ยนเป็น Tozai 20:47 → 20:49 Kayabacho เปลี่ยนรถ 2 ครั้ง 1,057 เยน
หมายเหตุ: 24 ต.ค. 2026 เปลี่ยนจาก JR ผ่าน Shimbashi (1,773 เยน 09:47 / 20:31) เป็น Odakyu ถูกกว่าเที่ยวละ 716 เยน นั่งนานขึ้นราว 20 นาทีต่อเที่ยว ทั้งสองแบบไม่เสียค่าเพิ่ม (ไม่ขึ้น Romancecar)
หมายเหตุ: เวลารถเป็นตารางวันอาทิตย์เดือน ต.ค. 2026 รถบัสขึ้นเขาวันอาทิตย์อาจช้ากว่านี้
หมายเหตุ: ไม่ขึ้น Komagatake Ropeway (ผู้ใช้ตัดออก 13 ต.ค. 2026) และไม่เดินถนนต้นสนโบราณไป Onshi Hakone Park (ผู้ใช้ตัดออก 18 ต.ค. 2026)
หมายเหตุ: Owakudani กับกระเช้าเที่ยวเดียวลง Togendai ผู้ใช้เลือกไว้ก่อน 18 ต.ค. 2026 ตัวเลือกที่ไม่ได้เลือกคือกระเช้าไป-กลับ Owakudani ↔ Sounzan 3,000 เยน (10,940 เยนต่อคนทั้งวัน)`,
    rain: `ฝนปรอย: ไปตามแผน Hakone-en Aquarium อยู่ในร่ม ศาลเจ้าในป่าสนเดินได้ พกร่ม ถ้าหมอกลงจนมองไม่เห็นทะเลสาบให้กลับรถบัสรอบเร็วขึ้น
ลมแรง หมอก หรือกระเช้าหยุดวิ่ง: ไม่ขึ้นกระเช้า นั่งรถบัส J03 จาก Owakudani 12:14 → Hakone-en 12:40 (800 เยน)
รถบัส J03 ไม่ผ่าน Owakudani (วันคนเยอะ): นั่งไปลงปลายทาง Hakone-en ตามแผนเดิม
ฝนหนัก: ข้าม Owakudani เที่ยวแค่ Hakone-en Aquarium กับ Hakone Shrine แล้วกลับ Odawara
แผนสำรองแบบไม่ไป Hakone ยังไม่ได้ทำ`,
    rainStat: "ฝน 1/5 (แห้งสุดในช่วงนี้)",
    maps: [
      { name: "Owakudani", url: placeUrl("Owakudani") },
      { name: "Hakone Ropeway Togendai", url: placeUrl("Hakone Ropeway Togendai Station") },
      { name: "Hakone-en Aquarium", url: m("Hakone-en+Aquarium") },
      { name: "Hakone Shrine", url: m("Hakone+Shrine") },
    ],
    costs: [
      { name: "Kayabacho → Odawara: Tozai ถึง Otemachi, Chiyoda Line ถึง Yoyogi-Uehara แล้ว Odakyu ขบวน 快速急行 (เปลี่ยนรถ 2 ครั้ง ไม่เสียค่าเพิ่ม เดิม JR ผ่าน Shimbashi 1,773)", type: "ค่าเดินทาง", yen: 1057, status: "เช็กแล้ว", source: "transit.yahoo.co.jp (ตารางวันอาทิตย์ 25 ต.ค. 2026)" },
      { name: "รถบัส Izuhakone J03 (ผ่าน Owakudani) สถานี Odawara → Owakudani (เลือกไว้ก่อน แผนสำรองคือนั่งไป Hakone-en ตรง 1,880)", type: "ค่าเดินทาง", yen: 1480, status: "เช็กแล้ว", source: "transit.yahoo.co.jp (ตารางวันอาทิตย์ 18 ต.ค. 2026)" },
      { name: "ลานชมวิว Owakudani (ฟรี)", type: "ค่าเข้า", yen: 0, status: "ประมาณ", source: "ยังไม่ได้ยืนยันว่าเข้าฟรี" },
      { name: "Hakone Ropeway Owakudani → Togendai เที่ยวเดียว ผ่าน Ubako ไม่ต้องเปลี่ยน (เลือกไว้ก่อน ตัวเลือกที่ไม่ได้เลือก: ไป-กลับ Owakudani ↔ Sounzan 3,000)", type: "ค่าเดินทาง", yen: 2000, status: "เช็กแล้ว", source: "hakonenavi.jp, odakyu.jp (ราคาเดียวทั้งสายตั้งแต่ ต.ค. 2025)" },
      { name: "รถบัส Odakyu สาย Shinjuku–Hakone Togendai → Hakone-en (บัตร Izuhakone ใช้ไม่ได้)", type: "ค่าเดินทาง", yen: 570, status: "เช็กแล้ว", source: "transit.yahoo.co.jp (ตารางวันอาทิตย์ 18 ต.ค. 2026)" },
      { name: "Hakone-en Aquarium", type: "ค่าเข้า", yen: 1600, status: "เช็กแล้ว", source: "princehotels.co.jp" },
      { name: "รถบัส Izuhakone Hakone-en → Motohakone", type: "ค่าเดินทาง", yen: 460, status: "เช็กแล้ว", source: "transit.yahoo.co.jp" },
      { name: "รถบัส Izuhakone Motohakone → สถานี Odawara", type: "ค่าเดินทาง", yen: 1510, status: "เช็กแล้ว", source: "transit.yahoo.co.jp" },
      { name: "Odawara → Kayabacho: Odakyu ขบวน 快速急行 ถึง Yoyogi-Uehara, Chiyoda Line ถึง Otemachi แล้ว Tozai (เปลี่ยนรถ 2 ครั้ง ไม่เสียค่าเพิ่ม เดิม JR ผ่าน Shimbashi 1,773)", type: "ค่าเดินทาง", yen: 1057, status: "เช็กแล้ว", source: "transit.yahoo.co.jp (ตารางวันอาทิตย์ 25 ต.ค. 2026)" },
      { name: "Hakone Shrine และโทริอิริมน้ำ (ฟรี)", type: "ค่าเข้า", yen: 0, status: "เช็กแล้ว", source: "hakonenavi.jp" },
    ],
    board: `1. Kayabacho: ขึ้น Tozai Line ขบวนไป Mitaka 07:50 ชานชาลา 4 ลง Otemachi 07:53 เปลี่ยนเป็น Chiyoda Line ไป Yoyogi-Uehara 08:04 ชานชาลา 5 ลง Yoyogi-Uehara 08:23 ชานชาลา 2 เปลี่ยนเป็น Odakyu ขบวน 快速急行 ไป Odawara 08:26 ชานชาลา 1 ลง Odawara 09:48 ชานชาลา 8 (มีเวลาเปลี่ยนรถ 3 นาที ถ้าพลาดให้ขึ้นขบวน 08:45 ถึง 10:11 ยังทันรถบัส 10:30 ทางเลือก: Hibiya Line 07:53 ลง Hibiya 08:01 ขึ้น Chiyoda Line 08:07 ต่อ Odakyu ขบวนเดียวกัน)
2. Odawara: ไม่ต้องฝากกระเป๋า (พัก Almont Inn Nihonbashi 3 คืน) เดินไปทางออกตะวันออก
3. Odawara ทางออกตะวันออก ป้ายรถบัส 5: ขึ้นรถบัส Izuhakone สาย J03 ไป Hakone-en ผ่าน Owakudani (J03 大涌谷経由 箱根園行) 10:30 ลงป้าย Owakudani (大涌谷) 11:19 (รอบสำรอง 10:55 ถึง 11:44) ต้องเป็นรถบัส Izuhakone ไม่ใช่ Hakone Tozan วันคนเยอะรถอาจไม่ผ่าน Owakudani ถ้าเป็นแบบนั้นให้นั่งไปลงปลายทาง Hakone-en
4. Owakudani: เดินจากป้ายราว 5 นาทีถึงลานชมวิวและสถานีกระเช้า เที่ยวราว 30 นาที
5. สถานีกระเช้า Owakudani: ซื้อตั๋วเที่ยวเดียว ขึ้น Hakone Ropeway ไป Togendai (桃源台行) 11:53 ผ่าน Ubako (姥子) 12:08 ไม่ต้องลง ถึง Togendai 12:23 (กระเช้าวิ่งราวนาทีละคัน)
6. Togendai: เดินราว 5 นาทีไปป้าย 箱根桃源台 (高速・連絡バス) ขึ้นรถบัส Odakyu สาย Shinjuku–Hakone ไป Hakone-en 12:30 ลง Hakone-en 12:45 (บัตร Izuhakone ใช้ไม่ได้ แตะบัตร IC)
7. Hakone-en: Hakone-en Aquarium อยู่ในบริเวณเดียวกับป้ายรถบัส
8. Hakone-en: ขึ้นรถบัส Izuhakone 14:00 ลง Motohakone 14:12 (มีรถอีกรอบ 13:50 จอดหน้า Hakone Shrine 13:56)
9. Motohakone: เดินราว 10 นาทีถึง Hakone Shrine
10. 15:15–17:35 เวลาว่างที่ Motohakone (ยังไม่ได้ใส่แผน)
11. ป้าย Motohakone: ขึ้นรถบัส Izuhakone ไป Odawara 17:43 ลง Odawara 18:37 (รอบถัดไปของ Izuhakone 18:33 ถ้าพลาด รถบัส Hakone Tozan รอบสุดท้ายออก 20:03 จากป้าย Hakone-jinja-iriguchi ใช้บัตร Izuhakone ไม่ได้)
12. Odawara: เดินไปชานชาลา Odakyu ขึ้นขบวน 快速急行 ไป Shinjuku 18:51 ลง Yoyogi-Uehara 20:18 เปลี่ยนเป็น Chiyoda Line ไป Ayase 20:19 ลง Otemachi 20:39 ขึ้น Tozai Line ไป Nishi-Funabashi 20:47 ลง Kayabacho 20:49 (ทางเลือก: ลง Chiyoda Line ที่ Hibiya 20:35 ขึ้น Hibiya Line 20:43 ถึง Kayabacho 20:52)`,
    details: `• Hakone-en Aquarium: พิพิธภัณฑ์สัตว์น้ำริมทะเลสาบ Ashi ในบริเวณ Hakone-en มีโซนน้ำเค็ม โซนน้ำจืด และลานแมวน้ำไบคาล เปิด 09:00–16:30 เข้าได้ถึง 16:00 ค่าเข้า 1,600 เยน
• Hakone Shrine: ศาลเจ้าเก่าแก่ในป่าสนริมทะเลสาบ Ashi จุดถ่ายรูปดังคือโทริอิสีแดงในน้ำ (Heiwa no Torii) คิวถ่ายรูปมักยาว ในเขตศาลเจ้ามี Kuzuryu Shrine สาขาใหม่ให้แวะได้ เข้าฟรี
• Owakudani (大涌谷): หุบภูเขาไฟที่ยังมีควันกำมะถันพวยขึ้นมา มีลานชมวิวและร้านไข่ดำที่ต้มในบ่อน้ำร้อน เวลาเปิดราว 09:00–16:00 (จากเว็บท่องเที่ยว ยังไม่ได้ยืนยัน) อาจปิดบางส่วนถ้าภูเขาไฟมีความเคลื่อนไหว
• Hakone Ropeway ช่วง Owakudani → Togendai: กระเช้าไต่ลงจากหุบควันไปริมทะเลสาบ Ashi ราว 30 นาที วันฟ้าเปิดเห็นฟูจิ ราคาเดียวทั้งสาย เที่ยวเดียว 2,000 เยน ไป-กลับ 3,000 เยน หยุดวิ่งเมื่อลมแรงหรือก๊าซภูเขาไฟสูง
• ตัวเลือกเพิ่ม: Hakone Checkpoint ด่านตรวจสมัยเอโดะที่สร้างขึ้นใหม่ อยู่ติด Onshi Hakone Park ค่าเข้า 500 เยน (ราคาจากเว็บท่องเที่ยว ยังไม่ได้ยืนยัน) ยังไม่อยู่ในแผน`,
    checklist: `ต้องจองล่วงหน้า
☐ ที่พักคืนวันที่ 13: Almont Inn Nihonbashi (คืนที่ 2 จาก 3 เลือกไว้ก่อน จองรวมกับคืนวันที่ 12)
☐ ดินเนอร์วันเกิดแฟน: ยังไม่ได้เลือกร้านและยังไม่ได้จอง ถ้ากินที่โตเกียวจะถึง Kayabacho 20:49

พกไป
☐ บัตร IC ค่ารถและค่าเข้าวันนี้ 9,734 เยนต่อคน (รวมรถไฟไป-กลับโรงแรมแล้ว)
☐ ตั๋วกระเช้า Owakudani → Togendai เที่ยวเดียว 2,000 เยน ซื้อที่สถานีกระเช้า Owakudani
☐ ไม่ต้องซื้อบัตร Izuhakone 1Day Bus Free (3,500 เยน) เพราะแผนนี้นั่งรถบัส Izuhakone รวม 3,450 เยน ถูกกว่าบัตร
☐ เงินสด และร่มพับ

เวลา
☐ ออกจาก Kayabacho 07:50 (รอบสำรอง 08:13 ถึง Odawara 10:11)
☐ รถบัส J03 ที่ Odawara 10:30 ป้าย 5 ดูว่าป้ายหน้ารถมีคำว่า 大涌谷経由
☐ ขึ้นกระเช้าที่ Owakudani ไม่เกิน 11:53 เพื่อทันรถบัส Odakyu 12:30 ที่ Togendai
☐ Hakone-en Aquarium เข้าได้ถึง 16:00
☐ ขึ้นรถบัสกลับจาก Motohakone 17:43

ระวัง
☐ Hakone Free Pass ของ Odakyu ใช้กับรถบัส Izuhakone ที่ไป Hakone-en ไม่ได้
☐ ที่ Togendai เป็นรถบัสของ Odakyu ไม่ใช่ Izuhakone
☐ วันคนเยอะรถบัส J03 อาจไม่ผ่าน Owakudani และกระเช้าหยุดได้ถ้าลมแรง แผนสำรองคือรถบัส J03 จาก Owakudani 12:14 → Hakone-en 12:40

ยังไม่ได้เช็ก
☐ คิวถ่ายรูปที่โทริอิริมน้ำ
☐ เวลาเปิดของ Owakudani และสถานะภูเขาไฟก่อนวันไป
☐ จะใช้ช่วงว่าง 15:15–17:35 ที่ Motohakone ทำอะไร (ร้านแถวนั้น: Bakery & Table Hakone ปิดราว 17:00, La Terrazza Ashinoko)
☐ ตารางรถไฟและรถบัสของเดือน มิ.ย. 2027`,
  },
  {
    slug: "14",
    date: "2027-06-14 (จันทร์)",
    short: "14 มิ.ย. จันทร์",
    title: "Kawaguchiko ปั่นจักรยาน · Shimamura · Shimokitazawa",
    stay: "Almont Inn Nihonbashi (คืนที่ 3/3)",
    accent: "emerald",
    place: `Kawaguchiko แบบไปเช้าเย็นกลับ แล้วกลับมาช้อปในโตเกียว (เลือกไว้ก่อน)
เช้า: รถบัสทางด่วนจาก Busta Shinjuku ถึง Kawaguchiko 08:30
09:00–14:00 เช่าจักรยานไฟฟ้าปั่นรอบทะเลสาบ Kawaguchiko ตามคลิป TikTok @pangrmttt: Lawson หน้าสถานี (จุดถ่ายรูปฟูจิ), สะพาน Kawaguchiko Ohashi, สวนริมทะเลสาบฝั่งเหนือ (ในคลิปเรียก Memorial Park), Nagasaki Park, Oishi Park (ไอศกรีมโคนคุกกี้ ของฝาก), จุดพักอีกฝั่งทะเลสาบ, Yagisaki Park
บ่าย: คืนจักรยาน กินเทมปุระร้าน Idaten แล้วนั่งรถบัสกลับ 15:10
17:30–18:30 Shimamura สาขา Takadanobaba
ค่ำ: Shimokitazawa เดินร้านเสื้อผ้ามือสองและกินข้าวเย็น
พัก Almont Inn Nihonbashi (คืนที่ 3 จาก 3 เลือกไว้ก่อน)`,
    howto: `06:08 Tozai Kayabacho → Kudanshita เปลี่ยนเป็น Toei Shinjuku Line 06:21 → 06:30 Shinjuku เดินไป Busta Shinjuku (เปลี่ยนรถ 1 ครั้ง ยังไม่ได้เช็กเวลาเดินจากชานชาลา Toei Shinjuku Line ถึง Busta)
06:55 รถบัสทางด่วน Fujikyu สาย Shinjuku–Fujigoko จาก Busta Shinjuku (ชั้น 4 เหนือทางออกใต้) → 08:30 Kawaguchiko Station ไม่ต้องเปลี่ยนรถ 1 ชม. 35 นาที (อีกรอบ Keio 06:45 ถึง 08:30)
09:00 เช่าจักรยานไฟฟ้าหน้าสถานี (ยังไม่ได้เช็กเวลาเปิดร้าน)
09:00–14:00 ปั่นรอบทะเลสาบตามคลิป ราว 20 กม. (คลิปใช้ราว 5 ชม. รวมเวลาแวะ)
14:00 คืนจักรยาน กินเทมปุระ Idaten ใกล้สถานี
15:10 รถบัสทางด่วน Fujikyu Kawaguchiko Station ป้าย 3 → 16:55 Busta Shinjuku
17:18 JR Yamanote Shinjuku (ชานชาลา 15) → 17:22 Takadanobaba
17:30–18:30 Shimamura Takadanobaba (เปิดถึง 20:00)
18:38 JR Yamanote → 18:43 Shinjuku → 18:50 Odakyu → 18:58 Shimokitazawa
19:00–20:30 Shimokitazawa (หลายร้านปิดราว 20:00) และกินข้าวเย็น
20:31 Keio Inokashira Shimokitazawa → 20:35 Shibuya เปลี่ยนเป็น Hanzomon Line 20:45 → 21:06 Suitengumae เดินถึงโรงแรม 340 ม.
ทางเลือกขากลับด้วยรถไฟ: Fujikyu 14:25 Kawaguchiko → Otsuki ต่อ JR Chuo เปลี่ยนเป็น Tozai ที่ Nakano → 16:57 Takadanobaba 2,747 เยน เปลี่ยนรถ 2 ครั้ง
หมายเหตุ: พัก Almont Inn Nihonbashi (เลือกไว้ก่อน 23 ต.ค. 2026) ค่ารถไปและกลับที่พักใส่ในค่าใช้จ่ายแล้ว
หมายเหตุ: ตัด Koenji ออก (ผู้ใช้สั่ง 18 ต.ค. 2026) เวลารถเป็นตารางวันจันทร์เดือน ต.ค. 2026 รถบัสอาจช้าถ้ารถติด`,
    rain: `ตัดสินใจคืนวันที่ 13 จากพยากรณ์ฝนที่ Fujikawaguchiko (โตเกียววันนี้ฝน 3 ใน 5 ปี) ตอนจองรถบัสทางด่วนให้ดูเงื่อนไขยกเลิกด้วย (ยังไม่ได้เช็กค่ายกเลิก ตั้งแต่ ต.ค. 2026 รถบัส Fujikyu จองผ่าน FUJIYAMA CONNECT)
ฝนปรอยหรือเมฆมาก: ไป Kawaguchiko ตามแผนแต่ไม่เช่าจักรยาน ใช้รถบัสวนรอบทะเลสาบสาย Red Line แทน (ราว 4 เที่ยวต่อชั่วโมง ค่ารถยังไม่ได้เช็ก) แวะ Oishi Park กับร้านและพิพิธภัณฑ์ริมทะเลสาบฝั่งเหนือ ฟูจิมักมองไม่เห็น
ฝนทั้งวัน: ไม่ไป Kawaguchiko เที่ยวโตเกียวฝั่งตะวันตกแทน ตื่นสายได้ ทุกช่วงไม่ต้องเปลี่ยนรถ
• 10:34 Tozai Kayabacho → 10:52 Takadanobaba (209 เยน) Shimamura เปิด 10:00 ช้อปราว 1 ชม.
• 12:13 Tozai ขบวนไป Mitaka → 12:31 Kichijoji (367 เยน) ข้าวเที่ยง เดินถนน Sun Road ที่มีหลังคา Harmonica Yokocho และร้านมือสองแถวสถานี
• ราว 15:04 Keio Inokashira ขบวนด่วน Kichijoji → 15:16 Shimokitazawa (209 เยน) ร้านเสื้อผ้ามือสองถึงราว 20:00 กินข้าวเย็น
• กลับเหมือนเดิม Shimokitazawa 20:31 → Suitengumae 21:06 (349 เยน) หรือกลับเร็วกว่านั้นก็ได้
ค่ารถแบบฝนทั้งวัน 1,134 เยนต่อคน ถูกกว่าแผน Kawaguchiko (8,512 เยน) ราว 7,400 เยน
รถบัสขากลับช้า (วันปกติ): ข้าม Shimamura ไป Shimokitazawa เลย
หมายเหตุ: เวลารถเป็นตารางวันจันทร์เดือน ต.ค. 2026`,
    rainStat: "ฝน 3/5",
    maps: [
      { name: "Kawaguchiko Station", url: placeUrl("Kawaguchiko Station") },
      { name: "Lawson Kawaguchiko Station-mae", url: placeUrl("Lawson Kawaguchiko Station-mae") },
      { name: "Kawaguchiko Ohashi Bridge", url: placeUrl("Kawaguchiko Ohashi Bridge") },
      { name: "Nagasaki Park", url: placeUrl("Nagasaki Park Fujikawaguchiko") },
      { name: "Oishi Park", url: placeUrl("Oishi Park Fujikawaguchiko") },
      { name: "Yagisaki Park", url: placeUrl("Yagisaki Park Fujikawaguchiko") },
      { name: "Shimamura Takadanobaba", url: m("%E3%83%95%E3%82%A1%E3%83%83%E3%82%B7%E3%83%A7%E3%83%B3%E3%82%BB%E3%83%B3%E3%82%BF%E3%83%BC%E3%81%97%E3%81%BE%E3%82%80%E3%82%89+%E9%AB%98%E7%94%B0%E9%A6%AC%E5%A0%B4%E5%BA%97") },
      { name: "Shimokitazawa", url: m("Shimokitazawa+Station") },
    ],
    costs: [
      { name: "Kayabacho → Shinjuku (ไป Busta Shinjuku): Tozai ถึง Kudanshita แล้ว Toei Shinjuku Line", type: "ค่าเดินทาง", yen: 286, status: "เช็กแล้ว", source: "transit.yahoo.co.jp (ตารางวันจันทร์ 26 ต.ค. 2026)" },
      { name: "Busta Shinjuku → Kawaguchiko: รถบัสทางด่วน Fujikyu สาย Shinjuku–Fujigoko (ไม่ต้องเปลี่ยนรถ)", type: "ค่าเดินทาง", yen: 2200, status: "เช็กแล้ว", source: "transit.yahoo.co.jp (ตารางวันจันทร์ 19 ต.ค. 2026)" },
      { name: "เช่าจักรยานไฟฟ้า 1 วัน ที่หน้าสถานี Kawaguchiko", type: "ค่าเดินทาง", yen: 3000, status: "ประมาณ", source: "บล็อก banzokubiology.com (ร้าน Fuji Kanko Travel ข้อมูลอาจเก่า) คลิป TikTok @pangrmttt พูดถึง 2,600 เยน ยังไม่ได้ยืนยันกับร้าน" },
      { name: "Kawaguchiko → Takadanobaba: รถบัสทางด่วน Fujikyu ถึง Busta Shinjuku 2,200 + JR Yamanote 155", type: "ค่าเดินทาง", yen: 2355, status: "เช็กแล้ว", source: "transit.yahoo.co.jp (ตารางวันจันทร์ 19 ต.ค. 2026)" },
      { name: "Takadanobaba → Shimokitazawa: JR Yamanote ถึง Shinjuku 155 + Odakyu 167", type: "ค่าเดินทาง", yen: 322, status: "เช็กแล้ว", source: "transit.yahoo.co.jp (ตารางวันจันทร์ 19 ต.ค. 2026)" },
      { name: "Shimokitazawa → Suitengumae: Keio Inokashira ถึง Shibuya แล้ว Hanzomon Line", type: "ค่าเดินทาง", yen: 349, status: "เช็กแล้ว", source: "transit.yahoo.co.jp (ตารางวันจันทร์ 26 ต.ค. 2026)" },
      { name: "จุดชมวิวและสวนรอบทะเลสาบ Kawaguchiko, Shimamura และ Shimokitazawa (ฟรี)", type: "ค่าเข้า", yen: 0, status: "ประมาณ", source: "ยังไม่ได้ยืนยันว่าสวนริมทะเลสาบทุกแห่งเข้าฟรี" },
    ],
    board: `เช้า Kayabacho: ขึ้น Tozai Line ขบวนไป Mitaka 06:08 ลง Kudanshita 06:15 เปลี่ยนเป็น Toei Shinjuku Line ขบวนไป Hashimoto 06:21 ลง Shinjuku 06:30 เดินไป Busta Shinjuku
1. Busta Shinjuku: ชั้น 4 เหนือทางออกใต้ของสถานี Shinjuku ขึ้นรถบัส Fujikyu สาย Shinjuku–Fujigoko 06:55 (ต้องจองที่นั่ง) ลงป้าย Kawaguchiko Station 08:30 (จอด Fujikyu Highland 08:25 ก่อน)
2. Kawaguchiko Station: เช่าจักรยานไฟฟ้า 1 วัน ร้านในคลิปอยู่ทางซ้ายเมื่อออกจากสถานี
3. ปั่นตามลำดับในคลิป: Lawson หน้าสถานี → ข้ามสะพาน Kawaguchiko Ohashi ไปฝั่งเหนือ → สวนริมทะเลสาบ → Nagasaki Park → Oishi Park → อ้อมไปอีกฝั่ง → Yagisaki Park → ปั่นกลับสถานี
4. คืนจักรยาน แล้วกินเทมปุระ Idaten (ยังไม่ได้เช็กที่ตั้งและเวลาเปิด)
5. Kawaguchiko Station ป้าย 3 ลานหน้าสถานี: ขึ้นรถบัส Fujikyu ไป Busta Shinjuku 15:10 ลง Busta Shinjuku 16:55 (ชั้น 3)
6. Shinjuku ชานชาลา 15: ขึ้น JR Yamanote ไปทาง Ikebukuro 17:18 ลง Takadanobaba 17:22
7. Takadanobaba: ทางออก Toyama (戸山口) ของสถานี Seibu เดิน 1 นาทีถึง Shimamura
8. Takadanobaba ชานชาลา 2: ขึ้น JR Yamanote ไปทาง Shinjuku 18:38 ลง Shinjuku 18:43 ชานชาลา 5 ขึ้น Odakyu ขบวน Rapid Express ไป Fujisawa 18:50 ลง Shimokitazawa 18:58 (รอบก่อนหน้า ออก 18:30 ถึง 18:51)
9. Shimokitazawa: เดินรอบสถานี ร้านอยู่ทั้งฝั่งเหนือและใต้ และตามทางเดินบนแนวทางรถไฟเก่า
10. Shimokitazawa: ขึ้น Keio Inokashira Line ขบวน Express ไป Shibuya 20:31 ลง Shibuya 20:35 เปลี่ยนเป็น Hanzomon Line ขบวนไป Oshiage 20:45 ลง Suitengumae 21:06 เดินกลับโรงแรม 340 ม.`,
    details: `Kawaguchiko (จากคลิป TikTok @pangrmttt ปั่นจักรยานรอบทะเลสาบราว 20 กม.)
• เช่าจักรยาน: คลิปแนะนำจักรยานไฟฟ้าแบบเหมาวัน เพราะทางขึ้นเนินเยอะ ร้าน Fuji Kanko Travel หน้าสถานี จักรยานไฟฟ้า 1 วัน 3,000 เยน จักรยานธรรมดา 2,500 เยน จองล่วงหน้าไม่ได้ (บล็อก banzokubiology ข้อมูลอาจเก่า) คลิปพูดถึงราคา 2,600 เยน
• Lawson หน้าสถานี Kawaguchiko: จุดถ่ายรูปฟูจิอยู่เหนือหลังคาร้านสะดวกซื้อ คิวยาว คลิปถ่ายจากอีกฝั่งแทน
• สะพาน Kawaguchiko Ohashi: สะพานข้ามทะเลสาบ ชมวิวฟูจิ ลมแรง
• สวนริมทะเลสาบฝั่งเหนือ (ในคลิปเรียก Memorial Park ยังไม่ได้เช็กชื่อจริง): ช่วงซากุระสวย ต้นหน้าร้อนหญ้าจะแห้ง
• Nagasaki Park: มุมถ่ายรูปยอดนิยม วิวโล่ง เห็นฟูจิเด่น
• Oishi Park: สวนดอกไม้ตามฤดูริมทะเลสาบ มีร้านของกินและของฝาก คนเยอะ คลิปแนะนำไอศกรีมโคนแป้งคุกกี้ 650 เยน
• จุดพักอีกฝั่งทะเลสาบ (ชื่อในคลิปฟังไม่ชัด): นั่งพักชมวิว
• Yagisaki Park: จุดที่เจ้าของคลิปชอบที่สุด หน้าร้อนมีลาเวนเดอร์ ขากลับปั่นเข้าหาฟูจิ
• เทมปุระ Idaten: ร้านที่คลิปแวะกินหลังคืนจักรยาน

โตเกียว
• Shimamura (ファッションセンターしまむら): ร้านเสื้อผ้าราคาถูกที่คนญี่ปุ่นใส่กัน ถูกกว่า GU และ UNIQLO มีเสื้อผ้าผู้ชาย ผู้หญิง เด็ก และไซซ์ใหญ่ (จากคลิป TikTok @s.thanakornn) สาขาส่วนใหญ่อยู่ชานเมือง ในเมืองโตเกียวมีไม่กี่สาขา
• สาขา Takadanobaba: ติดสถานี เปิด 10:00–20:00 (จากเว็บรวมร้าน ยังไม่ได้ยืนยันกับเว็บ Shimamura) ที่สถานีมีภาพวาดเจ้าหนูปรมาณูบนกำแพงใต้ทางรถไฟ JR
• สาขาอื่นที่เจอ: Nakano (เดินจากสถานี Nakano-sakaue 9 นาที ปิด 19:00) และสาขา Saitama-Shintoshin ซึ่งใหญ่ที่สุดในญี่ปุ่น (เดินจากสถานี 3 นาที เปิด 10:00–19:00)
• Shimokitazawa: ย่านเสื้อผ้ามือสองที่ใหญ่ที่สุด มีทั้งร้านใหญ่ราคาถูกและร้าน vintage เล็กในซอย คาเฟ่เยอะ ร้านที่เจอ: 古着屋ジャム (11:00–20:00 ไม่มีวันหยุด ข้อมูลปี 2023), signal (12:00–20:00), NOTIME (เปิด 24 ชม. มีพนักงาน 12:00–21:00) ร้านเล็กมีวันปิดไม่ตรงกัน`,
    checklist: `ต้องจองล่วงหน้า
☐ ที่นั่งรถบัสทางด่วน Fujikyu ไป-กลับ (Busta Shinjuku 06:55 และ Kawaguchiko 15:10) ยังไม่ได้เช็กว่าเปิดจองกี่วันก่อนเดินทาง
☐ ที่พักคืนวันที่ 14: Almont Inn Nihonbashi (คืนที่ 3 จาก 3 เลือกไว้ก่อน)

พกไป
☐ บัตร IC และเงินสด ค่ารถและค่าเช่าจักรยานวันนี้ 8,512 เยนต่อคน (รวมค่ารถไป-กลับโรงแรมแล้ว)
☐ พาสปอร์ต ใช้ซื้อของแบบขอคืนภาษี (ระบบใหม่: จ่ายรวมภาษีแล้วขอคืนที่สนามบินวันที่ 15)
☐ ครีมกันแดด หมวก เสื้อกันลม (คลิปบอกลมแรงบนสะพาน)
☐ ร่มพับ และถุงผ้าใส่ของที่ซื้อ

เวลา
☐ ออกจาก Kayabacho 06:08 ถึง Busta Shinjuku ก่อน 06:45
☐ คืนจักรยานราว 14:00 ขึ้นรถบัสกลับ 15:10
☐ Shimamura ปิด 20:00 ร้านใน Shimokitazawa ส่วนใหญ่ปิดราว 20:00

ยังไม่ได้เช็ก
☐ ร้านเช่าจักรยานไฟฟ้า: ชื่อร้านในคลิป ราคา เวลาเปิด และเอกสารที่ต้องใช้
☐ ชื่อสวนสองแห่งในคลิปที่ฟังไม่ชัด
☐ ที่ตั้งและเวลาเปิดของร้านเทมปุระ Idaten
☐ เวลาเปิดของ Shimamura สาขา Takadanobaba กับเว็บ Shimamura
☐ ถ้าซื้อเสื้อผ้าเยอะ เผื่อน้ำหนักกระเป๋าโหลดขากลับ (คนละ 1 ใบ)`,
  },
  {
    slug: "15",
    date: "2027-06-15 (อังคาร)",
    short: "15 มิ.ย. อังคาร",
    title: "ของฝาก · บินกลับ",
    stay: "กลับถึงกรุงเทพ 21:55",
    accent: "slate",
    place: `เช้า: ช้อปของฝากแถว Nihonbashi / Ningyocho แล้วเช็กเอาต์
บ่าย: ไป Narita กลับกรุงเทพ TG677 NRT T1 17:25 → BKK 21:55`,
    howto: `เช้า: ซื้อของฝากแถว Nihonbashi / Ningyocho เช็กเอาต์ ฝากกระเป๋าที่โรงแรม (หน้าเว็บบอกว่าฝากฟรี)
12:50 รับกระเป๋า เดินไปสถานี Ningyocho (Toei Asakusa Line) ราว 10 นาที (จากรีวิว ยังไม่ได้เช็ก)
13:07 Toei Asakusa Line ขบวน 快速 成田空港行 จาก Ningyocho วิ่งต่อเข้า Keisei Main Line → 14:45 Airport Terminal 2 นั่งต่อ 1 สถานีถึง Narita Airport (Terminal 1) ไม่ต้องเปลี่ยนรถ ไม่เสียค่าเพิ่ม
รอบสำรอง: Ningyocho 13:22 → Keisei-Takasago 13:44 เปลี่ยนเป็น Keisei Main Line 快速特急 13:45 → Keisei-Sakura 14:20 ต่อรถ 14:23 → Airport Terminal 2 14:45 (เปลี่ยนรถ 2 ครั้ง ถึงเวลาเดียวกัน)
ควรถึง Narita ราว 15:00
หมายเหตุ: ไม่ขึ้น Skyliner, Access Express หรือ エアポート快特 (วิ่งสาย Narita Sky Access) เวลารถเป็นตารางวันอังคารเดือน ต.ค. 2026 ยังไม่ได้เช็กว่าขบวนตรงแบบ 13:07 มีทุกชั่วโมงไหม`,
    rain: "-",
    rainStat: "ฝน 4/5",
    maps: [],
    costs: [
      { name: "Ningyocho → Narita Airport: Toei Asakusa Line ขบวน 快速 成田空港行 วิ่งต่อเข้า Keisei Main Line ไม่ต้องเปลี่ยนรถ (ไม่เสียค่าเพิ่ม)", type: "ค่าเดินทาง", yen: 1219, status: "เช็กแล้ว", source: "transit.yahoo.co.jp (ตารางวันอังคาร 27 ต.ค. 2026)" },
    ],
    board: `1. Almont Inn Nihonbashi: เช็กเอาต์ ฝากกระเป๋า ไปซื้อของฝาก แล้วกลับมารับกระเป๋าราว 12:50
2. เดินไปสถานี Ningyocho ชานชาลาของ Toei Asakusa Line (คนละชานชาลากับ Hibiya Line) ขึ้นขบวน 快速 成田空港行 13:07 ดูป้ายปลายทางต้องเป็น 成田空港 และไม่ใช่ アクセス特急 หรือ エアポート快特
3. นั่งไม่ต้องเปลี่ยนรถ รถวิ่งต่อเข้า Keisei Main Line ผ่าน Airport Terminal 2 14:45 อย่าลง นั่งต่ออีก 1 สถานีถึงปลายสาย Narita Airport ซึ่งคือ Terminal 1 ที่ TG677 ออก
4. ถ้าพลาดขบวน 13:07: ขึ้น Toei Asakusa Line 13:22 ลง Keisei-Takasago 13:44 เปลี่ยนเป็น Keisei Main Line 快速特急 ไป Keisei-Narita 13:45 ลง Keisei-Sakura 14:20 ต่อขบวนไป Narita Airport 14:23`,
    details: `ของฝากแถวโรงแรม เดินได้ (ยังไม่ได้เช็กเวลาเปิดของแต่ละร้าน และระยะเดิน)
• ห้าง Nihonbashi Mitsukoshi: ห้างเก่าแก่ของญี่ปุ่น ชั้นใต้ดิน (depachika) ขนมกล่องของฝาก ห่างโรงแรมราว 760 ม. (จาก Trip.com)
• COREDO Muromachi: ห้างข้าง Mitsukoshi ร้านขนมและของใช้ญี่ปุ่น
• Takashimaya Nihonbashi: ห้างใหญ่ ชั้นใต้ดินมีของฝาก
• Ningyocho Amazake Yokocho: ถนนร้านเก่าใกล้สถานี Ningyocho ขนมญี่ปุ่นและของทำมือ อยู่ทางเดียวกับสถานีที่จะขึ้นไปสนามบิน
• ร้านขายยาแถวสถานี Suitengumae (Matsumoto Kiyoshi ห่างโรงแรมราว 330 ม. จาก Trip.com)
ถ้าอยากได้ Ameyoko หรือ Don Quijote แบบที่ Ueno นั่ง Hibiya Line จาก Kayabacho ไป Ueno ราว 10 นาที แต่ต้องกลับมารับกระเป๋าก่อน 12:50`,
    checklist: `ถามโรงแรมไว้ก่อน
☐ เวลาเช็กเอาต์ของ Almont Inn Nihonbashi
☐ ฝากกระเป๋าหลังเช็กเอาต์ถึงราว 12:50 (หน้าเว็บบอกว่าฝากฟรี)

พกไป
☐ พาสปอร์ต ใช้ซื้อของแบบขอคืนภาษีและเช็กอินที่สนามบิน

คืนภาษี (ระบบใหม่ตั้งแต่ 1 พ.ย. 2026)
☐ ร้านเก็บเงินรวมภาษีตอนซื้อ แล้วคืนเงินหลังสแกนพาสปอร์ตที่เครื่องของศุลกากรในสนามบินตอนออกนอกประเทศ (ภายใน 90 วันหลังซื้อ)
☐ ของกินหรือเครื่องสำอางที่แกะใช้ในญี่ปุ่นแล้วขอคืนไม่ได้
☐ ศุลกากรอาจขอดูของ ถ้าจะใส่ของที่ขอคืนภาษีไว้ในกระเป๋าโหลด ให้ถามเคาน์เตอร์ก่อนโหลด (ยังไม่ได้เช็กขั้นตอนที่ Narita T1)
☐ เงินในบัตร IC หรือเงินสด 1,219 เยนต่อคนสำหรับไป Narita
☐ เผื่อที่ว่างและน้ำหนักกระเป๋าโหลดสำหรับของฝาก (คนละ 1 ใบ)

เวลา
☐ ออกจาก Ningyocho 13:07 ถึง Narita ราว 14:50 เครื่องออก 17:25
☐ ขึ้นขบวนที่วิ่ง Keisei Main Line เท่านั้น ไม่ขึ้น Skyliner, Access Express หรือ エアポート快特

ระวัง
☐ ที่ Ningyocho ต้องขึ้น Toei Asakusa Line ไม่ใช่ Hibiya Line
☐ TG677 ออกจาก Narita Terminal 1 ลงสถานีปลายสาย Narita Airport อย่าลงที่ Airport Terminal 2

ยังไม่ได้เช็ก
☐ ระยะเดินจากโรงแรมไปชานชาลา Toei Asakusa Line ที่ Ningyocho และลิฟต์สำหรับกระเป๋าใหญ่
☐ ขบวนตรงแบบ 13:07 มีทุกชั่วโมงไหม`,
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
