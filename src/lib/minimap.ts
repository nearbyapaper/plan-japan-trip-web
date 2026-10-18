import "server-only";
import { placeUrl } from "./maps";
import { photos, type Photo } from "./minimap-photos";

// แผนที่ย่อรายวัน: หมุดเรียงตามลำดับในไทม์ไลน์ เชื่อมด้วยเส้นตรง (ไม่ใช่แนวรางหรือถนนจริง)
// พิกัดจาก OpenStreetMap (Nominatim) ดึงเมื่อ 18 ต.ค. 2026
// จุดที่ OpenStreetMap ไม่มีพิกัด (Smile Hotel, Cafe Yoridokoro, KANNON COFFEE, ร้านย่าน Morito) ไม่ได้ปักแยก
// แต่เขียนไว้ในรายละเอียดของหมุดที่อยู่ใกล้ที่สุดแทน

export type PinKind = "station" | "spot" | "food" | "hotel";
export type LegMode = "transit" | "bus" | "walking" | "bike" | "ropeway";

type PinDef = {
  name: string;
  lat: number;
  lng: number;
  kind: PinKind;
  desc?: string;
  q?: string; // คำค้นใน Google Maps (ไม่ใส่ = ใช้ name)
};

const pins = {
  // วันที่ 10
  narita: { name: "Narita Airport (Terminal 1)", lat: 35.7654, lng: 140.38599, kind: "station", desc: "08:33 ขึ้น Keisei Main Line (Rapid) ไม่ใช่ Skyliner หรือ Access Express", q: "Narita Airport Terminal 1 Station" },
  keiseiFunabashi: { name: "Keisei-Funabashi / JR Funabashi", lat: 35.69989, lng: 139.9863, kind: "station", desc: "09:33 ถึง เดิน 5 นาทีไป JR Funabashi ขึ้น JR Sobu Rapid 09:46", q: "Keisei Funabashi Station" },
  shinagawa: { name: "Shinagawa", lat: 35.62748, lng: 139.73777, kind: "station", desc: "10:19 ถึงชานชาลา 15 เดินไปชานชาลา 12 ขึ้น JR Tokaido Line 10:26", q: "Shinagawa Station" },
  fujisawa: { name: "Fujisawa · Smile Hotel Shonan Fujisawa", lat: 35.339, lng: 139.48523, kind: "hotel", desc: "สถานี Fujisawa และโรงแรม Smile Hotel Shonan Fujisawa ฝั่งทางออกใต้ (เดิน 2–5 นาที ยังไม่ได้เช็ก) หมุดนี้ปักที่สถานี เพราะ OpenStreetMap ไม่มีพิกัดโรงแรม สถานี Enoden อยู่ฝั่งทางออกใต้", q: "Smile Hotel Shonan Fujisawa" },
  kamakurakokomae: { name: "สถานี Kamakurakokomae", lat: 35.30672, lng: 139.50071, kind: "station", desc: "13:07 ถึงด้วย Enoden ทางข้ามรถไฟอยู่ห่างสถานี 3 นาที", q: "Kamakurakokomae Station" },
  crossing: { name: "ทางข้ามรถไฟ Slam Dunk · Koshigoe Rakko Park", lat: 35.3066, lng: 139.50209, kind: "spot", desc: "ฉากเปิดของอนิเมะ Slam Dunk เห็นรถไฟ Enoden วิ่งผ่านหน้าทะเล Shonan คนเยอะ ห้ามยืนถ่ายรูปบนถนน Koshigoe Rakko Park เป็นสวนเล็กติดทางข้าม ใช้ยืนถ่ายรูปแทนได้ เข้าฟรี", q: "Kamakurakokomae Crossing" },
  shichirigahama: { name: "หาด Shichirigahama", lat: 35.306, lng: 139.5108, kind: "spot", desc: "หาดทรายสีดำยาวเลียบทางรถไฟ Enoden มองเห็นเกาะ Enoshima วันฟ้าเปิดเห็นฟูจิไกลๆ ขึ้น Enoden ต่อที่สถานี Shichirigahama 14:20", q: "Shichirigahama Beach" },
  inamuragasaki: { name: "Inamuragasaki · Cafe Yoridokoro", lat: 35.30436, lng: 139.5219, kind: "food", desc: "Cafe Yoridokoro อยู่ห่างสถานี 3–5 นาที ร้านในบ้านไม้เก่าข้างทางข้ามรถไฟ นั่งริมหน้าต่างเห็น Enoden วิ่งผ่าน ขึ้นชื่อชุดปลาตากแห้งย่าง เปิด 07:00–18:00 ปิดวันอังคาร คิวยาว หมุดนี้ปักที่สถานี Inamuragasaki", q: "ヨリドコロ 稲村ヶ崎" },
  hase: { name: "สถานี Hase", lat: 35.3115, lng: 139.53563, kind: "station", desc: "15:43 ถึง ขากลับขึ้น Enoden ไป Fujisawa 17:35 (ขึ้นฝั่งตรงข้ามกับขบวนไป Kamakura)", q: "Hase Station Kanagawa" },
  kotokuin: { name: "พระใหญ่ Kotoku-in · KANNON COFFEE", lat: 35.3165, lng: 139.53573, kind: "spot", desc: "พระพุทธรูปสำริดสูงราว 11.3 เมตร นั่งกลางแจ้ง ค่าเข้า 300 เยน เปิดถึง 17:30 เดินถนนคนเดินจากสถานี Hase 7 นาที KANNON COFFEE (เครปและคุกกี้รูปพระใหญ่) อยู่แถวนี้", q: "Kotoku-in Great Buddha" },

  // วันที่ 11
  ofuna: { name: "Ofuna (เปลี่ยนรถ)", lat: 35.35577, lng: 139.53339, kind: "station", desc: "ขาไป: ลงชานชาลา 1/2 เดินไปชานชาลา 7/8 ขึ้น JR Shonan-Shinjuku Line 09:12 ขากลับ: เปลี่ยนเป็น JR Tokaido Line ไป Fujisawa", q: "Ofuna Station" },
  kamakura: { name: "สถานี Kamakura", lat: 35.31928, lng: 139.55087, kind: "station", desc: "09:18 ถึง ออกทางออกตะวันออก บ่ายขึ้น JR ไป Zushi 13:34 ชานชาลา 1", q: "Kamakura Station" },
  tsurugaoka: { name: "ศาลเจ้า Tsurugaoka Hachimangu", lat: 35.32518, lng: 139.55618, kind: "spot", desc: "ศาลเจ้าสำคัญที่สุดของ Kamakura ขึ้นบันไดหิน 61 ขั้นแล้วมองลงมาเห็นถนน Wakamiya Oji ยาวไปถึงทะเล เข้าฟรี", q: "Tsurugaoka Hachimangu" },
  komachi: { name: "ถนน Komachi-dori", lat: 35.32078, lng: 139.55196, kind: "food", desc: "ถนนคนเดินราว 360 เมตรจากศาลเจ้าถึงสถานี ร้านของกินและของฝากกว่า 200 ร้าน ให้ยืนกินหน้าร้าน ไม่เดินกิน ข้าวเที่ยงวันนี้", q: "Komachi-dori Kamakura" },
  zushi: { name: "สถานี Zushi", lat: 35.29757, lng: 139.5797, kind: "station", desc: "ป้ายรถบัส 3 หน้าสถานี ขึ้นรถบัส Keikyu สาย 逗11 หรือ 逗12 ราว 15 นาที ขากลับขึ้น JR 18:34", q: "Zushi Station" },
  morito: { name: "ศาลเจ้า Morito Daimyojin", lat: 35.27269, lng: 139.56982, kind: "spot", desc: "ศาลเจ้าริมทะเลสมัยศตวรรษที่ 12 โทริอิสีแดง ต้นสนจูนิเปอร์อายุ 800 ปี เปิด 09:00–17:00 ลงรถบัสป้าย Morito Jinja (森戸神社)", q: "Morito Daimyojin" },
  moritoBeach: { name: "หาด Morito และร้านย่าน Morito", lat: 35.27391, lng: 139.57208, kind: "food", desc: "ข้ามสะพานแดงหลังศาลเจ้าไปหาด Morito จุดชมฟูจิข้ามอ่าว เดินต่อไปทางเหนือ: Asahiya (คร็อกเกต์เนื้อ), Misaki Donuts, SOSO HAYAMA, Genbe, หาด Suwa ร้านเหล่านี้ไม่ได้ปักหมุดแยกเพราะไม่มีพิกัดใน OpenStreetMap", q: "Morito Beach Hayama" },
  hayamaMarina: { name: "Hayama Marina · ป้ายรถบัส Abuzuri", lat: 35.28272, lng: 139.56898, kind: "spot", desc: "ท่าเรือยอชต์ต้นกำเนิดกีฬาเรือใบของญี่ปุ่น มีร้านอาหารและร้านพุดดิ้ง Marlowe ขากลับขึ้นรถบัสที่ป้าย Abuzuri (鐙摺) ใกล้ๆ ไปสถานี Zushi", q: "Hayama Marina" },

  // วันที่ 12
  yokohama: { name: "Yokohama (เปลี่ยนรถ)", lat: 35.46601, lng: 139.62264, kind: "station", desc: "เปลี่ยนจาก JR Tokaido เป็น Keikyu Main Line รถด่วน", q: "Yokohama Station" },
  tenkubashi: { name: "Tenkubashi (เปลี่ยนรถ)", lat: 35.54833, lng: 139.75434, kind: "station", desc: "เปลี่ยนจาก Keikyu เป็น Tokyo Monorail", q: "Tenkubashi Station" },
  oiKeibajo: { name: "สถานี Ōi-keibajō-mae", lat: 35.59513, lng: 139.74706, kind: "station", desc: "09:23 ถึง ขาออกขึ้น Tokyo Monorail 12:03 ไป Hamamatsucho", q: "Oi Keibajo Mae Station" },
  ohiRacecourse: { name: "ตลาดนัด Tokyo City Flea Market (สนามแข่งม้า Ohi)", lat: 35.59231, lng: 139.7434, kind: "spot", desc: "ตลาดนัดของมือสองในลานจอดรถที่ 1 เปิดเสาร์อาทิตย์ 09:00–15:00 งดถ้าฝนตก ลากกระเป๋าไปด้วย (ยังไม่ได้เช็กตู้ล็อกเกอร์)", q: "Ohi Racecourse Flea Market 2-1-2 Katsushima Shinagawa" },
  hamamatsucho: { name: "Hamamatsucho (เปลี่ยนรถ)", lat: 35.65511, lng: 139.75706, kind: "station", desc: "เปลี่ยนจาก Tokyo Monorail เป็น JR Keihin-Tohoku Rapid ไป Saitama-Shintoshin", q: "Hamamatsucho Station" },
  saitamaShintoshin: { name: "Saitama-Shintoshin · โรงแรมคืนคอนเสิร์ต", lat: 35.89364, lng: 139.63395, kind: "hotel", desc: "13:05 ถึง ฝากกระเป๋าที่โรงแรม (ยังไม่ได้เลือก ตัวเลือกที่เจอ: Hotel Metropolitan ติดสถานี, APA Hotel Eki-kita) เช็กอิน 15:00 พักในห้องถึงราว 17:00", q: "Saitama-Shintoshin Station" },
  cocoon: { name: "Cocoon City", lat: 35.89567, lng: 139.63498, kind: "food", desc: "ห้างติดทางออกตะวันออก ร้านกว่า 250 ร้าน ศูนย์อาหาร 2 แห่ง ข้าวเที่ยงวันนี้", q: "Cocoon City Saitama-Shintoshin" },
  omiya: { name: "สถานี Omiya", lat: 35.90638, lng: 139.62433, kind: "station", desc: "ถ้ายังมีแรง: JR 1 สถานีจาก Saitama-Shintoshin 3 นาที ทางออกตะวันออกเดินราว 15 นาทีถึงศาลเจ้า", q: "Omiya Station Saitama" },
  hikawa: { name: "ศาลเจ้า Musashi Ichinomiya Hikawa", lat: 35.91677, lng: 139.62977, kind: "spot", desc: "ศาลเจ้าหลักของศาลเจ้า Hikawa ราว 280 แห่งทั่วคันโต ประตู romon สีแดง สะพานข้ามสระ ป่าต้นไม้ใหญ่ เข้าฟรี", q: "Musashi Ichinomiya Hikawa Shrine" },
  omiyaPark: { name: "Omiya Park", lat: 35.91903, lng: 139.63181, kind: "spot", desc: "สวนของจังหวัดที่เก่าที่สุดใน Saitama อยู่ติดหลังศาลเจ้า สระน้ำ ป่าสน สวนสัตว์เล็กเข้าฟรี", q: "Omiya Park Saitama" },
  arena: { name: "GMO ARENA saitama · Radiohead", lat: 35.89512, lng: 139.63075, kind: "spot", desc: "คอนเสิร์ต Radiohead 18:00 ชื่อเดิม Saitama Super Arena เดินจากสถานีและโรงแรม 3 นาที ดูเวลาเปิดประตูบนตั๋ว", q: "Saitama Super Arena" },

  // วันที่ 13
  odawara: { name: "สถานี Odawara", lat: 35.25575, lng: 139.15666, kind: "station", desc: "09:59 ถึงจาก Saitama-Shintoshin ฝากกระเป๋าที่ตู้ล็อกเกอร์ (ยังไม่ได้เช็ก) ทางออกตะวันออก ป้าย 5 ขึ้นรถบัส Izuhakone J03 (大涌谷経由 箱根園行) 10:30 ขากลับ Odakyu ไป Shinjuku 18:51", q: "Odawara Station" },
  owakudani: { name: "Owakudani (หุบควันภูเขาไฟ)", lat: 35.24442, lng: 139.01958, kind: "spot", desc: "11:19 ลงรถบัส J03 ป้าย 大涌谷 หุบภูเขาไฟที่ยังมีควันกำมะถัน ลานชมวิวและร้านไข่ดำ เดินเที่ยวราว 30 นาที เปิดราว 09:00–16:00 (ยังไม่ได้ยืนยัน) ซื้อตั๋วกระเช้าเที่ยวเดียว 2,000 เยนที่สถานี ขึ้นกระเช้าไป Togendai (桃源台行) ไม่เกิน 11:53 ถ้ากระเช้าหยุด: รถบัส J03 12:14 ไป Hakone-en", q: "Owakudani" },
  togendai: { name: "Togendai (กระเช้า → รถบัส Odakyu)", lat: 35.23791, lng: 138.9953, kind: "station", desc: "12:23 ถึงด้วยกระเช้า (ผ่าน Ubako ไม่ต้องลง) เดินราว 5 นาทีไปป้าย 箱根桃源台 ขึ้นรถบัส Odakyu ไป Hakone-en 12:30 (570 เยน บัตร Izuhakone ใช้ไม่ได้)", q: "Hakone Ropeway Togendai Station" },
  hakoneen: { name: "Hakone-en Aquarium", lat: 35.21224, lng: 139.00931, kind: "spot", desc: "12:45 ถึง พิพิธภัณฑ์สัตว์น้ำริมทะเลสาบ Ashi ลานแมวน้ำไบคาล ค่าเข้า 1,600 เยน เข้าได้ถึง 16:00 กินข้าวเที่ยงในบริเวณ Hakone-en รถบัสต่อ 14:00", q: "Hakone-en Aquarium" },
  motohakone: { name: "Motohakone-ko (ริมทะเลสาบ Ashi)", lat: 35.20283, lng: 139.0306, kind: "spot", desc: "14:12 ลงรถบัส 15:15–17:35 เวลาว่าง (ยังไม่ได้ใส่แผน) ขากลับขึ้นรถบัส Izuhakone 17:43 ไป Odawara", q: "Motohakone-ko" },
  hakoneShrine: { name: "Hakone Shrine", lat: 35.20397, lng: 139.02558, kind: "spot", desc: "ศาลเจ้าเก่าแก่ในป่าสนริมทะเลสาบ Ashi เดินจาก Motohakone ราว 10 นาที เข้าฟรี", q: "Hakone Shrine" },
  heiwaTorii: { name: "โทริอิริมน้ำ (Heiwa no Torii)", lat: 35.20274, lng: 139.02574, kind: "spot", desc: "โทริอิสีแดงในทะเลสาบ จุดถ่ายรูปดังของ Hakone คิวถ่ายรูปมักยาว", q: "Heiwa no Torii Hakone" },

  // วันที่ 14
  busta: { name: "Busta Shinjuku", lat: 35.68829, lng: 139.70063, kind: "station", desc: "ชั้น 4 เหนือทางออกใต้ของสถานี Shinjuku ถึงก่อน 06:45 ขึ้นรถบัส Fujikyu 06:55 (ต้องจอง) ขากลับลงชั้น 3 16:55", q: "Busta Shinjuku" },
  kawaguchiko: { name: "สถานี Kawaguchiko · ร้านเช่าจักรยาน", lat: 35.49835, lng: 138.76849, kind: "station", desc: "08:30 ถึง เช่าจักรยานไฟฟ้า 1 วัน ร้านในคลิปอยู่ทางซ้ายเมื่อออกจากสถานี (ยังไม่ได้เช็กชื่อร้านและราคา) ขากลับรถบัส 15:10 ป้าย 3 กินเทมปุระ Idaten ก่อนกลับ (ยังไม่ได้เช็กที่ตั้ง)", q: "Kawaguchiko Station" },
  lawsonKawaguchiko: { name: "Lawson หน้าสถานี (จุดถ่ายรูปฟูจิ)", lat: 35.49858, lng: 138.76712, kind: "spot", desc: "ฟูจิอยู่เหนือหลังคาร้านสะดวกซื้อ คิวยาว คลิปถ่ายจากอีกฝั่งถนนแทน", q: "Lawson Kawaguchiko Station-mae" },
  ohashi: { name: "สะพาน Kawaguchiko Ohashi", lat: 35.51175, lng: 138.76457, kind: "spot", desc: "สะพานข้ามทะเลสาบไปฝั่งเหนือ ชมวิวฟูจิ ลมแรง", q: "Kawaguchiko Ohashi Bridge" },
  nagasakiPark: { name: "Nagasaki Park", lat: 35.5218, lng: 138.75748, kind: "spot", desc: "มุมถ่ายรูปยอดนิยม วิวโล่ง เห็นฟูจิเด่น (สวนริมทะเลสาบที่คลิปเรียก Memorial Park อยู่ระหว่างสะพานกับจุดนี้ ยังไม่ได้เช็กชื่อจริง)", q: "Nagasaki Park Fujikawaguchiko" },
  oishiPark: { name: "Oishi Park", lat: 35.52329, lng: 138.74654, kind: "food", desc: "สวนดอกไม้ตามฤดูริมทะเลสาบ มีร้านของกินและของฝาก คลิปแนะนำไอศกรีมโคนแป้งคุกกี้ 650 เยน คนเยอะ", q: "Oishi Park Fujikawaguchiko" },
  yagisaki: { name: "Yagisaki Park", lat: 35.51211, lng: 138.75586, kind: "spot", desc: "จุดที่เจ้าของคลิปชอบที่สุด หน้าร้อนมีลาเวนเดอร์ ขากลับปั่นเข้าหาฟูจิ (จุดพักอีกฝั่งทะเลสาบในคลิปยังไม่รู้ชื่อ จึงไม่ได้ปัก)", q: "Yagisaki Park Fujikawaguchiko" },
  shinjuku: { name: "สถานี Shinjuku", lat: 35.6916, lng: 139.69968, kind: "station", desc: "17:18 JR Yamanote ชานชาลา 15 ไป Takadanobaba ขาไป Shimokitazawa เปลี่ยนเป็น Odakyu ชานชาลา 5 ขบวน 18:50", q: "Shinjuku Station" },
  takadanobaba: { name: "สถานี Takadanobaba", lat: 35.71348, lng: 139.70447, kind: "station", desc: "17:22 ถึง ออกทางออก Toyama (戸山口) ของสถานี Seibu ขาออก JR Yamanote 18:38 ชานชาลา 2", q: "Takadanobaba Station" },
  shimamura: { name: "Shimamura สาขา Takadanobaba", lat: 35.71192, lng: 139.70478, kind: "spot", desc: "ร้านเสื้อผ้าราคาถูกที่คนญี่ปุ่นใส่ ถูกกว่า GU และ UNIQLO เปิด 10:00–20:00 (ยังไม่ได้ยืนยันกับเว็บ Shimamura) 17:30–18:30", q: "ファッションセンターしまむら 高田馬場店" },
  shimokitazawa: { name: "Shimokitazawa", lat: 35.66127, lng: 139.66692, kind: "food", desc: "18:58 ถึง ย่านเสื้อผ้ามือสองที่ใหญ่ที่สุด ร้านอยู่ทั้งฝั่งเหนือและใต้ของสถานี หลายร้านปิดราว 20:00 กินข้าวเย็นที่นี่", q: "Shimokitazawa Station" },
} satisfies Record<string, PinDef>;

type PinId = keyof typeof pins;
type Step = PinId | [PinId, LegMode]; // จุดแรกไม่มีวิธีเดินทาง จุดต่อไปบอกวิธีที่ใช้มาถึง

type MapDef = { title: string; note?: string; steps: Step[] };

const dayMaps: Record<string, MapDef[]> = {
  "10": [
    {
      title: "เช้า: Narita → Fujisawa",
      steps: ["narita", ["keiseiFunabashi", "transit"], ["shinagawa", "transit"], ["fujisawa", "transit"]],
    },
    {
      title: "บ่าย: เส้นชายทะเล Enoden",
      note: "ใช้บัตร Noriorikun ขึ้นลง Enoden ได้ไม่จำกัด",
      steps: [
        "fujisawa",
        ["kamakurakokomae", "transit"],
        ["crossing", "walking"],
        ["shichirigahama", "walking"],
        ["inamuragasaki", "transit"],
        ["hase", "transit"],
        ["kotokuin", "walking"],
        ["hase", "walking"],
        ["fujisawa", "transit"],
      ],
    },
  ],
  "11": [
    {
      title: "Kamakura · Hayama",
      steps: [
        "fujisawa",
        ["ofuna", "transit"],
        ["kamakura", "transit"],
        ["tsurugaoka", "walking"],
        ["komachi", "walking"],
        ["kamakura", "walking"],
        ["zushi", "transit"],
        ["morito", "bus"],
        ["moritoBeach", "walking"],
        ["hayamaMarina", "walking"],
        ["zushi", "bus"],
        ["ofuna", "transit"],
        ["fujisawa", "transit"],
      ],
    },
  ],
  "12": [
    {
      title: "เช้า: Fujisawa → ตลาดนัด Ohi → Saitama",
      note: "วันฝนหรือตลาดงด: นั่ง JR จาก Fujisawa ตรงไป Saitama-Shintoshin",
      steps: [
        "fujisawa",
        ["yokohama", "transit"],
        ["tenkubashi", "transit"],
        ["oiKeibajo", "transit"],
        ["ohiRacecourse", "walking"],
        ["oiKeibajo", "walking"],
        ["hamamatsucho", "transit"],
        ["saitamaShintoshin", "transit"],
      ],
    },
    {
      title: "บ่าย–ค่ำ: Saitama-Shintoshin · Omiya · คอนเสิร์ต",
      steps: [
        "saitamaShintoshin",
        ["cocoon", "walking"],
        ["omiya", "transit"],
        ["hikawa", "walking"],
        ["omiyaPark", "walking"],
        ["omiya", "walking"],
        ["saitamaShintoshin", "transit"],
        ["arena", "walking"],
      ],
    },
  ],
  "13": [
    {
      title: "Hakone วันเกิดแฟน",
      note: "เช้านั่ง JR จาก Saitama-Shintoshin ตรงมา Odawara ค่ำนั่ง Odakyu จาก Odawara ไป Shinjuku (อยู่นอกแผนที่)",
      steps: [
        "odawara",
        ["owakudani", "bus"],
        ["togendai", "ropeway"],
        ["hakoneen", "bus"],
        ["motohakone", "bus"],
        ["hakoneShrine", "walking"],
        ["heiwaTorii", "walking"],
        ["motohakone", "walking"],
        ["odawara", "bus"],
      ],
    },
  ],
  "14": [
    {
      title: "Kawaguchiko ปั่นจักรยานรอบทะเลสาบ",
      note: "รถบัสทางด่วนจาก Busta Shinjuku 06:55 ถึง 08:30 เส้นปั่นวาดตามลำดับในคลิป ไม่ใช่เส้นถนนจริง",
      steps: [
        "kawaguchiko",
        ["lawsonKawaguchiko", "walking"],
        ["ohashi", "bike"],
        ["nagasakiPark", "bike"],
        ["oishiPark", "bike"],
        ["yagisaki", "bike"],
        ["kawaguchiko", "bike"],
      ],
    },
    {
      title: "เย็น–ค่ำ: Shimamura · Shimokitazawa",
      steps: [
        "busta",
        ["shinjuku", "walking"],
        ["takadanobaba", "transit"],
        ["shimamura", "walking"],
        ["takadanobaba", "walking"],
        ["shinjuku", "transit"],
        ["shimokitazawa", "transit"],
      ],
    },
  ],
};

// รูปแบบที่ส่งให้ component ฝั่งหน้าเว็บ
export type MapPin = {
  n: number;
  name: string;
  lat: number;
  lng: number;
  kind: PinKind;
  desc: string;
  photos: Photo[];
  mapsUrl: string;
};
export type MapLeg = { from: number; to: number; mode: LegMode };
export type DayMap = { title: string; note?: string; pins: MapPin[]; legs: MapLeg[] };

export function getDayMaps(slug: string): DayMap[] {
  return (dayMaps[slug] ?? []).map((def) => {
    const order: PinId[] = [];
    const legs: MapLeg[] = [];
    let prev: number | null = null;
    for (const step of def.steps) {
      const [id, mode] = typeof step === "string" ? [step, null] : step;
      let i = order.indexOf(id);
      if (i < 0) i = order.push(id) - 1;
      if (prev !== null && mode) legs.push({ from: prev, to: i, mode });
      prev = i;
    }
    const mapPins = order.map((id, i): MapPin => {
      const p: PinDef = pins[id];
      return {
        n: i + 1,
        name: p.name,
        lat: p.lat,
        lng: p.lng,
        kind: p.kind,
        desc: p.desc ?? "",
        photos: photos[id] ?? [],
        mapsUrl: placeUrl(p.q ?? p.name),
      };
    });
    return { title: def.title, note: def.note, pins: mapPins, legs };
  });
}
