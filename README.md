# Japan 2027 เว็บแผนเที่ยว (Next.js)

เว็บส่วนตัวที่แสดงแผนจาก Google Sheet "Japan 2027" ต้องใส่รหัสผ่านก่อนดู

## รันบนเครื่อง

```bash
cd web
npm install
cp .env.example .env.local   # แล้วใส่ SITE_PASSWORD และ AUTH_SECRET
npm run dev                  # เปิด http://localhost:3000
npm run build && npm start   # ทดสอบแบบ production
```

สร้าง AUTH_SECRET: `openssl rand -hex 32`

## Deploy ขึ้น Vercel (ฟรี)

1. `npx vercel login` แล้ว `npx vercel` ในโฟลเดอร์ `web` ตอบคำถามตามค่าเริ่มต้น
2. ตั้งตัวแปรใน Vercel → Project → Settings → Environment Variables
   - `SITE_PASSWORD` รหัสผ่านที่จะใช้จริง ยาว 12 ตัวขึ้นไป
   - `AUTH_SECRET` สุ่มใหม่ ไม่ใช้ค่าเดียวกับในเครื่อง
3. `npx vercel --prod`

เปลี่ยนรหัสผ่านหรือ AUTH_SECRET แล้ว deploy ใหม่ ทุกเครื่องที่ login ไว้จะถูกออกจากระบบ

## การป้องกันข้อมูล

- `src/middleware.ts` กั้นทุกหน้ายกเว้น `/login` ถ้าไม่มี cookie ที่ถูกต้องจะเด้งไปหน้า login
- `src/app/(trip)/layout.tsx` เช็ก cookie ซ้ำฝั่ง server อีกชั้น
- cookie เป็น HMAC ของรหัสผ่าน ตั้งเป็น HttpOnly, Secure, SameSite=Lax อายุ 30 วัน
- ข้อมูลแผนอยู่ใน `src/lib/plan.ts` ที่มี `import "server-only"` จึงไม่ติดไปกับไฟล์ JavaScript ของหน้าเว็บ
- ใส่รหัสผิดจะหน่วง 1 วินาที ยังไม่มีการล็อกหลังใส่ผิดหลายครั้ง จึงควรใช้รหัสยาว
- ตั้ง noindex และ robots.txt ห้าม search engine เก็บ

## ใช้งานตอนไม่มีอินเทอร์เน็ต (PWA)

- `public/sw.js` เก็บทุกหน้า (ภาพรวม + ทุกวัน ทั้งไทยและญี่ปุ่น) ไว้ในเครื่องทุกครั้งที่เปิดเว็บตอนออนไลน์ (อย่างมากทุก 15 นาที หรือกด "อัปเดตตอนนี้" ท้ายหน้า)
- ไม่มีเน็ตหรือเน็ตช้าเกิน 5 วินาที จะแสดงฉบับในเครื่องแทน ท้ายหน้าบอกเวลาที่บันทึกล่าสุด
- ใช้ไม่ได้ตอนออฟไลน์: พื้นหลังแผนที่, รูปสถานที่, ลิงก์ Google Maps (ควรโหลดแผนที่ออฟไลน์ในแอป Google Maps ไว้ด้วย)
- ทำงานเฉพาะ `npm run build && npm start` หรือบน Vercel ไม่ทำงานตอน `npm run dev`
- iPhone: เปิดใน Safari → แชร์ → "เพิ่มไปยังหน้าจอโฮม" แล้ว login ในแอปที่ติดตั้งอีกครั้ง (แอปแยก cookie กับ Safari) และเปิดทุกหน้าครั้งหนึ่งตอนมีเน็ต
- ออกจากระบบหรือ cookie หมดอายุ (30 วัน) แล้วเปิดตอนออนไลน์ ข้อมูลแผนในเครื่องจะถูกลบ

## อัปเดตข้อมูล

ข้อมูลเป็นสำเนาจากชีต (ดู `SNAPSHOT_DATE` ใน `src/lib/plan.ts`) แก้ชีตแล้วต้องอัปเดตไฟล์นี้และ deploy ใหม่
ห้ามใส่เลขการจอง เลขพาสปอร์ต หรือข้อมูลบัตรลงในไฟล์นี้
