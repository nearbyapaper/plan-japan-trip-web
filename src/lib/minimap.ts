import "server-only";
import { placeUrl } from "./maps";
import { photos, type Photo } from "./minimap-photos";

// แผนที่ย่อรายวัน: หมุดเรียงตามลำดับในไทม์ไลน์ เชื่อมด้วยเส้นตรง (ไม่ใช่แนวรางหรือถนนจริง)
// พิกัดจาก OpenStreetMap (Nominatim) ดึงเมื่อ 18 ต.ค. 2026 หมุดย่านโตเกียววันที่ 12–14 ดึงเพิ่ม 23 ต.ค. 2026 หมุดวันที่ 15 ดึงเพิ่ม 24 ต.ค. 2026
// จุดที่ OpenStreetMap ไม่มีพิกัด (Smile Hotel, Cafe Yoridokoro, KANNON COFFEE, ร้านย่าน Morito) ไม่ได้ปักแยก
// แต่เขียนไว้ในรายละเอียดของหมุดที่อยู่ใกล้ที่สุดแทน

export type PinKind = "station" | "spot" | "food" | "hotel";
export type LegMode = "transit" | "bus" | "walking" | "bike" | "ropeway" | "taxi";

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
  haneda: { name: "Haneda Airport Terminal 3", lat: 35.5450118, lng: 139.7670385, kind: "station", desc: "เครื่องลง 06:55 ขึ้น Keikyu Airport Line (Express) ขบวนไป Kanazawa-Bunko 08:04 ชานชาลา 2 ไม่ต้องเปลี่ยนรถถึง Yokohama", q: "Haneda Airport Terminal 3 Station Keikyu" },
  yokohama10: { name: "Yokohama", lat: 35.4660109, lng: 139.6226361, kind: "station", desc: "08:31 ถึง Keikyu ชานชาลา 1 เดินไป JR ชานชาลา 6 ขึ้น JR Tokaido Line 08:41", q: "Yokohama Station" },
  fujisawa: { name: "Fujisawa · Smile Hotel Shonan Fujisawa", lat: 35.339, lng: 139.48523, kind: "hotel", desc: "สถานี Fujisawa และโรงแรม Smile Hotel Shonan Fujisawa ฝั่งทางออกใต้ (เดิน 2–5 นาที ยังไม่ได้เช็ก) หมุดนี้ปักที่สถานี เพราะ OpenStreetMap ไม่มีพิกัดโรงแรม สถานี Enoden อยู่ฝั่งทางออกใต้", q: "Smile Hotel Shonan Fujisawa" },
  kamakurakokomae: { name: "สถานี Kamakurakokomae", lat: 35.30672, lng: 139.50071, kind: "station", desc: "10:47 ถึงด้วย Enoden ทางข้ามรถไฟอยู่ห่างสถานี 3 นาที", q: "Kamakurakokomae Station" },
  crossing: { name: "ทางข้ามรถไฟ Slam Dunk · Koshigoe Rakko Park", lat: 35.3066, lng: 139.50209, kind: "spot", desc: "ฉากเปิดของอนิเมะ Slam Dunk เห็นรถไฟ Enoden วิ่งผ่านหน้าทะเล Shonan คนเยอะ ห้ามยืนถ่ายรูปบนถนน Koshigoe Rakko Park เป็นสวนเล็กติดทางข้าม ใช้ยืนถ่ายรูปแทนได้ เข้าฟรี", q: "Kamakurakokomae Crossing" },
  shichirigahama: { name: "หาด Shichirigahama", lat: 35.306, lng: 139.5108, kind: "spot", desc: "หาดทรายสีดำยาวเลียบทางรถไฟ Enoden มองเห็นเกาะ Enoshima วันฟ้าเปิดเห็นฟูจิไกลๆ ขึ้น Enoden ต่อที่สถานี Shichirigahama 12:42", q: "Shichirigahama Beach" },
  inamuragasaki: { name: "Inamuragasaki · Cafe Yoridokoro", lat: 35.30436, lng: 139.5219, kind: "food", desc: "Cafe Yoridokoro อยู่ห่างสถานี 3–5 นาที ร้านในบ้านไม้เก่าข้างทางข้ามรถไฟ นั่งริมหน้าต่างเห็น Enoden วิ่งผ่าน ขึ้นชื่อชุดปลาตากแห้งย่าง เปิด 07:00–18:00 ปิดวันอังคาร คิวยาว หมุดนี้ปักที่สถานี Inamuragasaki", q: "ヨリドコロ 稲村ヶ崎" },
  hase: { name: "สถานี Hase", lat: 35.3115, lng: 139.53563, kind: "station", desc: "14:47 ถึง ขากลับขึ้น Enoden ไป Fujisawa 17:35 (ขึ้นฝั่งตรงข้ามกับขบวนไป Kamakura)", q: "Hase Station Kanagawa" },
  goryo: { name: "ศาลเจ้า Goryo", lat: 35.31099, lng: 139.53279, kind: "spot", desc: "ศาลเจ้าเล็กห่างสถานี Hase ราว 300 ม. ทางข้ามรถไฟหน้าโทริอิเป็นจุดถ่ายรูป Enoden กับดอกไฮเดรนเยีย (ปกติบานต้นถึงกลาง มิ.ย.) มีโพสต์บอกว่าห้ามถ่ายรูปในบริเวณศาลเจ้า", q: "御霊神社 鎌倉" },
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

  // วันที่ 12 (พัก Almont Inn Nihonbashi 12–14 มิ.ย. เลือกไว้ก่อน 23 ต.ค. 2026)
  ningyocho: { name: "สถานี Ningyocho", lat: 35.68628, lng: 139.78219, kind: "station", desc: "วันที่ 12: 09:04 ถึงด้วย Toei Asakusa Line จาก Shimbashi เดินลากกระเป๋าไปโรงแรม 5–10 นาที แล้วกลับมาขึ้นรอบ 09:32 ไปตลาดนัด (ขากลับถึง 12:36) วันที่ 15: ขึ้น Toei Asakusa Line ไป Narita", q: "Ningyocho Station" },
  hotelTokyo: { name: "Almont Inn Nihonbashi (ที่พัก 3 คืน)", lat: 35.68268, lng: 139.78072, kind: "hotel", desc: "เลือกไว้ก่อน ห้องเตียงใหญ่ 14 ตร.ม. ฝากกระเป๋าฟรี สถานีใกล้: Suitengumae 340 ม. Kayabacho 350 ม. Ningyocho ราว 10 นาที หมุดนี้ปักกลางย่าน Nihonbashi Koami-cho เพราะ OpenStreetMap ไม่มีพิกัดโรงแรม", q: "Almont Inn Tokyo Nihonbashi" },
  kayabacho: { name: "สถานี Kayabacho", lat: 35.68072, lng: 139.77792, kind: "station", desc: "สถานีหลักของวันที่ 12–14 (Tozai Line และ Hibiya Line) เดินจากโรงแรมราว 5 นาที", q: "Kayabacho Station" },
  shimbashi: { name: "Shimbashi (เปลี่ยนรถ)", lat: 35.66607, lng: 139.75968, kind: "station", desc: "วันที่ 12 เช้า: ลง JR 08:46 เปลี่ยนเป็น Toei Asakusa Line 08:57 ไป Ningyocho", q: "Shimbashi Station" },
  oiKeibajo: { name: "สถานี Ōi-keibajō-mae", lat: 35.59513, lng: 139.74706, kind: "station", desc: "10:03 ถึง ขาออกขึ้น Tokyo Monorail 12:03 ไป Hamamatsucho", q: "Oi Keibajo Mae Station" },
  ohiRacecourse: { name: "ตลาดนัด Tokyo City Flea Market (สนามแข่งม้า Ohi)", lat: 35.59231, lng: 139.7434, kind: "spot", desc: "ตลาดนัดของมือสองในลานจอดรถที่ 1 เปิดเสาร์อาทิตย์ 09:00–15:00 งดถ้าฝนตก ฝากกระเป๋าไว้ที่โรงแรมแล้ว ไม่ต้องลากมา", q: "Ohi Racecourse Flea Market 2-1-2 Katsushima Shinagawa" },
  hamamatsucho: { name: "Hamamatsucho (เปลี่ยนรถ)", lat: 35.65511, lng: 139.75706, kind: "station", desc: "เดินเชื่อมกับสถานี Daimon (Toei Asakusa Line) ราว 7 นาที ขาไป: ลง Daimon 09:41 ขึ้น Tokyo Monorail 09:55 ขากลับ: ลง Monorail เดินไป Daimon ขึ้น Toei Asakusa Line 12:27", q: "Hamamatsucho Station" },
  ueno: { name: "Ueno (เปลี่ยนรถ)", lat: 35.71196, lng: 139.77772, kind: "station", desc: "เปลี่ยนระหว่าง Hibiya Line กับ JR ขาไป JR Takasaki Line 16:32 ชานชาลา 14 ขากลับ Hibiya Line เที่ยวสุดท้าย 23:49", q: "Ueno Station" },
  saitamaShintoshin: { name: "สถานี Saitama-Shintoshin", lat: 35.89364, lng: 139.63395, kind: "station", desc: "16:54 ถึงจาก Ueno ทางออกตะวันตกเดินไปสนาม 3 นาที รถเที่ยวสุดท้ายกลับโรงแรม 23:15", q: "Saitama-Shintoshin Station" },
  cocoon: { name: "Cocoon City", lat: 35.89567, lng: 139.63498, kind: "food", desc: "ห้างติดทางออกตะวันออก ร้านกว่า 250 ร้าน ศูนย์อาหาร 2 แห่ง นั่งรอให้คนซาหลังคอนเสิร์ตได้", q: "Cocoon City Saitama-Shintoshin" },
  omiya: { name: "สถานี Omiya", lat: 35.90638, lng: 139.62433, kind: "station", desc: "หลังคอนเสิร์ต: เดินจากประตู W1 ราว 20 นาที ขึ้น JR ไป Ueno แล้วเปลี่ยนเป็น Hibiya Line ไป Kayabacho เช่น 20:58 ถึง 21:43 เลี่ยงคนแน่นที่ Saitama-Shintoshin", q: "Omiya Station Saitama" },
  arena: { name: "GMO ARENA saitama · Radiohead", lat: 35.89512, lng: 139.63075, kind: "spot", desc: "คอนเสิร์ต Radiohead 18:00 ชื่อเดิม Saitama Super Arena เดินจากสถานี 3 นาที เปิดประตู 15:30 เลิกราว 20:05–20:30 (ค่าประมาณ)", q: "Saitama Super Arena" },

  // วันที่ 13
  odawara: { name: "สถานี Odawara", lat: 35.25575, lng: 139.15666, kind: "station", desc: "09:48 ถึงจาก Kayabacho (รอบสำรองถึง 10:11 Tokyo Metro + Odakyu เปลี่ยนที่ Otemachi และ Yoyogi-Uehara) ไม่ต้องฝากกระเป๋า ทางออกตะวันออก ป้าย 5 ขึ้นรถบัส Izuhakone J03 (大涌谷経由 箱根園行) 10:10 (รอบสำรอง 10:30) ขากลับ Odakyu 18:51 ไป Yoyogi-Uehara แล้วต่อรถใต้ดินถึง Kayabacho 20:49", q: "Odawara Station" },
  owakudani: { name: "Owakudani (หุบควันภูเขาไฟ)", lat: 35.24442, lng: 139.01958, kind: "spot", desc: "10:59 ลงรถบัส J03 ป้าย 大涌谷 หุบภูเขาไฟที่ยังมีควันกำมะถัน ลานชมวิวและร้านไข่ดำ เดินเที่ยวราว 50 นาที เปิดราว 09:00–16:00 (ยังไม่ได้ยืนยัน) ซื้อตั๋วกระเช้าเที่ยวเดียว 2,000 เยนที่สถานี ขึ้นกระเช้าไป Togendai (桃源台行) ไม่เกิน 11:53 ถ้ากระเช้าหยุด: รถบัส J03 12:14 ไป Hakone-en", q: "Owakudani" },
  togendai: { name: "Togendai (กระเช้า → รถบัส Odakyu)", lat: 35.23791, lng: 138.9953, kind: "station", desc: "12:23 ถึงด้วยกระเช้า (ผ่าน Ubako ไม่ต้องลง) เดินราว 5 นาทีไปป้าย 箱根桃源台 ขึ้นรถบัส Odakyu ไป Hakone-en 12:30 (570 เยน บัตร Izuhakone ใช้ไม่ได้)", q: "Hakone Ropeway Togendai Station" },
  hakoneen: { name: "Hakone-en Aquarium", lat: 35.21224, lng: 139.00931, kind: "spot", desc: "12:45 ถึง พิพิธภัณฑ์สัตว์น้ำริมทะเลสาบ Ashi ลานแมวน้ำไบคาล ค่าเข้า 1,600 เยน เข้าได้ถึง 16:00 กินข้าวเที่ยงในบริเวณ Hakone-en รถบัสต่อ 14:00", q: "Hakone-en Aquarium" },
  motohakone: { name: "Motohakone-ko (ริมทะเลสาบ Ashi)", lat: 35.20283, lng: 139.0306, kind: "spot", desc: "14:12 ลงรถบัส 15:15–17:35 เวลาว่าง (ยังไม่ได้ใส่แผน) ขากลับขึ้นรถบัส Izuhakone 17:43 ไป Odawara", q: "Motohakone-ko" },
  hakoneShrine: { name: "Hakone Shrine", lat: 35.20397, lng: 139.02558, kind: "spot", desc: "ศาลเจ้าเก่าแก่ในป่าสนริมทะเลสาบ Ashi เดินจาก Motohakone ราว 10 นาที เข้าฟรี", q: "Hakone Shrine" },
  heiwaTorii: { name: "โทริอิริมน้ำ (Heiwa no Torii)", lat: 35.20274, lng: 139.02574, kind: "spot", desc: "โทริอิสีแดงในทะเลสาบ จุดถ่ายรูปดังของ Hakone คิวถ่ายรูปมักยาว", q: "Heiwa no Torii Hakone" },

  // วันที่ 14
  shibuya: { name: "Shibuya (เปลี่ยนรถ)", lat: 35.66057, lng: 139.70253, kind: "station", desc: "ขากลับ: ลง Keio Inokashira 20:35 เปลี่ยนเป็น Hanzomon Line 20:45", q: "Shibuya Station" },
  suitengumae: { name: "สถานี Suitengumae", lat: 35.68408, lng: 139.78416, kind: "station", desc: "21:06 ถึงด้วย Hanzomon Line เดินถึงโรงแรม 340 ม.", q: "Suitengumae Station" },
  busta: { name: "Busta Shinjuku", lat: 35.68829, lng: 139.70063, kind: "station", desc: "ชั้น 4 เหนือทางออกใต้ของสถานี Shinjuku ถึงก่อน 06:45 ขึ้นรถบัส Fujikyu 06:55 (ต้องจอง) ขากลับลงชั้น 3 16:55", q: "Busta Shinjuku" },
  kawaguchiko: { name: "สถานี Kawaguchiko · ร้านเช่าจักรยาน", lat: 35.49835, lng: 138.76849, kind: "station", desc: "08:30 ถึง เช่าจักรยานไฟฟ้า 1 วัน ร้านในคลิปอยู่ทางซ้ายเมื่อออกจากสถานี (ยังไม่ได้เช็กชื่อร้านและราคา) ขากลับรถบัส 15:10 ป้าย 3 กินเทมปุระ Idaten ก่อนกลับ (ยังไม่ได้เช็กที่ตั้ง)", q: "Kawaguchiko Station" },
  lawsonKawaguchiko: { name: "Lawson หน้าสถานี (จุดถ่ายรูปฟูจิ)", lat: 35.49858, lng: 138.76712, kind: "spot", desc: "ฟูจิอยู่เหนือหลังคาร้านสะดวกซื้อ คิวยาว คลิปถ่ายจากอีกฝั่งถนนแทน", q: "Lawson Kawaguchiko Station-mae" },
  ohashi: { name: "สะพาน Kawaguchiko Ohashi", lat: 35.51175, lng: 138.76457, kind: "spot", desc: "สะพานข้ามทะเลสาบไปฝั่งเหนือ ชมวิวฟูจิ ลมแรง", q: "Kawaguchiko Ohashi Bridge" },
  nagasakiPark: { name: "Nagasaki Park", lat: 35.5218, lng: 138.75748, kind: "spot", desc: "มุมถ่ายรูปยอดนิยม วิวโล่ง เห็นฟูจิเด่น (สวนริมทะเลสาบที่คลิปเรียก Memorial Park อยู่ระหว่างสะพานกับจุดนี้ ยังไม่ได้เช็กชื่อจริง)", q: "Nagasaki Park Fujikawaguchiko" },
  oishiPark: { name: "Oishi Park", lat: 35.52329, lng: 138.74654, kind: "food", desc: "สวนดอกไม้ตามฤดูริมทะเลสาบ มีร้านของกินและของฝาก คลิปแนะนำไอศกรีมโคนแป้งคุกกี้ 650 เยน คนเยอะ", q: "Oishi Park Fujikawaguchiko" },
  yagisaki: { name: "Yagisaki Park", lat: 35.51211, lng: 138.75586, kind: "spot", desc: "จุดที่เจ้าของคลิปชอบที่สุด หน้าร้อนมีลาเวนเดอร์ ขากลับปั่นเข้าหาฟูจิ (จุดพักอีกฝั่งทะเลสาบในคลิปยังไม่รู้ชื่อ จึงไม่ได้ปัก)", q: "Yagisaki Park Fujikawaguchiko" },
  shinjuku: { name: "สถานี Shinjuku", lat: 35.6916, lng: 139.69968, kind: "station", desc: "16:55 ลงรถบัสที่ Busta Shinjuku เดินไปสถานี Odakyu ขึ้นขบวน Rapid Express 17:10 ไป Shimokitazawa ไม่ต้องเปลี่ยนรถ (ยังไม่ได้เช็กเวลาเดิน)", q: "Shinjuku Station" },
  takadanobaba: { name: "สถานี Takadanobaba", lat: 35.71348, lng: 139.70447, kind: "station", desc: "วันที่ 15: 09:50 ถึงด้วย Tozai Line จาก Kayabacho ออกทางออก Toyama (戸山口) ของสถานี Seibu ขาออก Tozai 11:00 ชานชาลา 1 ไป Nihombashi", q: "Takadanobaba Station" },
  shimamura: { name: "Shimamura สาขา Takadanobaba", lat: 35.71192, lng: 139.70478, kind: "spot", desc: "ร้านเสื้อผ้าราคาถูกที่คนญี่ปุ่นใส่ ถูกกว่า GU และ UNIQLO เปิด 10:00–20:00 (ยังไม่ได้ยืนยันกับเว็บ Shimamura) วันที่ 15 ช้อป 10:00–11:00", q: "ファッションセンターしまむら 高田馬場店" },
  shimokitazawa: { name: "Shimokitazawa", lat: 35.66127, lng: 139.66692, kind: "food", desc: "17:18 ถึง ย่านเสื้อผ้ามือสองที่ใหญ่ที่สุด ร้านอยู่ทั้งฝั่งเหนือและใต้ของสถานี หลายร้านปิดราว 20:00 กินข้าวเย็นที่นี่", q: "Shimokitazawa Station" },
  // วันที่ 15
  nihombashi: { name: "สถานี Nihombashi", lat: 35.68165, lng: 139.7762, kind: "station", desc: "11:15 ถึงด้วย Tozai Line จาก Takadanobaba เดินไป COREDO Muromachi (ยังไม่ได้เช็กทางออก)", q: "Nihombashi Station" },
  coredo: { name: "COREDO Muromachi", lat: 35.68677, lng: 139.77488, kind: "food", desc: "11:20–12:05 ของฝาก: Ninben ร้านปลาโอแห้ง มีบาร์ซุปดาชิ (COREDO Muromachi 1 ชั้น 1 เปิด 11:00), Kayanoya ซองซุปดาชิ (COREDO Muromachi 3 ชั้น 1), Nihonbashi Kiya มีดและเครื่องครัว", q: "コレド室町1" },
  amazake: { name: "Amazake Yokocho (Ningyocho)", lat: 35.68613, lng: 139.78514, kind: "food", desc: "12:05–12:45 ถนนร้านเก่า ขนมญี่ปุ่นและของทำมือ แล้วเดินกลับโรงแรมรับกระเป๋า 12:50 ถ้าช้าให้ข้าม (ยังไม่ได้เช็กระยะเดิน)", q: "甘酒横丁" },
} satisfies Record<string, PinDef>;

type PinId = keyof typeof pins;
type Step = PinId | [PinId, LegMode]; // จุดแรกไม่มีวิธีเดินทาง จุดต่อไปบอกวิธีที่ใช้มาถึง

type MapDef = { title: string; note?: string; steps: Step[] };

const dayMaps: Record<string, MapDef[]> = {
  "10": [
    {
      title: "เช้า: Haneda T3 → Fujisawa",
      steps: ["haneda", ["yokohama10", "transit"], ["fujisawa", "transit"]],
    },
    {
      title: "10:30–18:07: เส้นชายทะเล Enoden",
      note: "ใช้บัตร Noriorikun ขึ้นลง Enoden ได้ไม่จำกัด",
      steps: [
        "fujisawa",
        ["kamakurakokomae", "transit"],
        ["crossing", "walking"],
        ["shichirigahama", "walking"],
        ["inamuragasaki", "transit"],
        ["hase", "transit"],
        ["goryo", "walking"],
        ["hase", "walking"],
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
      title: "เช้า: Fujisawa → Shimbashi → Ningyocho → โรงแรม",
      note: "JR ถึง Shimbashi เปลี่ยนเป็น Toei Asakusa Line ไป Ningyocho (เปลี่ยนรถ 1 ครั้ง) แล้วเดินลากกระเป๋าไปฝากที่โรงแรม",
      steps: ["fujisawa", ["shimbashi", "transit"], ["ningyocho", "transit"], ["hotelTokyo", "walking"]],
    },
    {
      title: "สาย: ตลาดนัด Ohi แล้วกลับโรงแรม",
      note: "ไป-กลับจาก Ningyocho เปลี่ยนรถครั้งเดียวที่ Daimon/Hamamatsucho (เดินเชื่อม 7 นาที) เส้นในแผนที่เป็นเส้นตรง ไม่ใช่แนวราง",
      steps: [
        "hotelTokyo",
        ["ningyocho", "walking"],
        ["hamamatsucho", "transit"],
        ["oiKeibajo", "transit"],
        ["ohiRacecourse", "walking"],
        ["oiKeibajo", "walking"],
        ["hamamatsucho", "transit"],
        ["ningyocho", "transit"],
        ["hotelTokyo", "walking"],
      ],
    },
    {
      title: "16:11–ค่ำ: คอนเสิร์ต Radiohead",
      note: "ขากลับแนะนำเดินไป Omiya เลี่ยงคนแน่น เที่ยวสุดท้ายจาก Saitama-Shintoshin 23:15",
      steps: [
        "hotelTokyo",
        ["kayabacho", "walking"],
        ["ueno", "transit"],
        ["saitamaShintoshin", "transit"],
        ["arena", "walking"],
        ["omiya", "walking"],
        ["ueno", "transit"],
        ["kayabacho", "transit"],
        ["hotelTokyo", "walking"],
      ],
    },
  ],
  "13": [
    {
      title: "Hakone วันเกิดแฟน",
      note: "เช้านั่ง Tokyo Metro + Odakyu จาก Kayabacho (เปลี่ยนที่ Otemachi และ Yoyogi-Uehara) ออก 07:50 มา Odawara 09:48 ค่ำกลับทางเดิมถึง Kayabacho 20:49 (อยู่นอกแผนที่)",
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
      note: "เช้าออกจาก Kayabacho 06:08 (Tozai + Toei Shinjuku Line) รถบัสทางด่วนจาก Busta Shinjuku 06:55 ถึง 08:30 เส้นปั่นวาดตามลำดับในคลิป ไม่ใช่เส้นถนนจริง",
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
      title: "เย็น–ค่ำ: Shimokitazawa · กลับโรงแรม",
      steps: [
        "busta",
        ["shinjuku", "walking"],
        ["shimokitazawa", "transit"],
        ["shibuya", "transit"],
        ["suitengumae", "transit"],
        ["hotelTokyo", "walking"],
      ],
    },
  ],
  "15": [
    {
      title: "เช้า: Shimamura · ของฝาก Nihonbashi",
      note: "เช็กเอาต์ 09:20 ฝากกระเป๋า รับกระเป๋า 12:50 แล้วขึ้น Toei Asakusa Line ที่ Ningyocho 13:07 ไป Narita ไม่ต้องเปลี่ยนรถ (อยู่นอกแผนที่)",
      steps: [
        "hotelTokyo",
        ["kayabacho", "walking"],
        ["takadanobaba", "transit"],
        ["shimamura", "walking"],
        ["takadanobaba", "walking"],
        ["nihombashi", "transit"],
        ["coredo", "walking"],
        ["amazake", "walking"],
        ["hotelTokyo", "walking"],
        ["ningyocho", "walking"],
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
